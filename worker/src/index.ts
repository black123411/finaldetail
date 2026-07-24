import { ADD_ONS, SERVICES, SPECIALTY_SIZES, VEHICLE_SIZES } from "../../shared/data/services";

interface Env {
  SQUARE_ACCESS_TOKEN: string;
  SQUARE_LOCATION_ID: string;
  SQUARE_ENVIRONMENT: string;
  ALLOWED_ORIGINS: string;
  ADMIN_PASSWORD: string;
  ADMIN_SESSION_SECRET: string;
  CONTENT_DB: D1Database;
}

const SQUARE_VERSION = "2026-05-20";

class SquareApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function allowedOrigin(request: Request, env: Env): string | null {
  const origin = request.headers.get("Origin");
  if (!origin) return null;

  const allowed = new Set(
    env.ALLOWED_ORIGINS.split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );

  return allowed.has(origin) ? origin : "";
}

function responseHeaders(request: Request, env: Env): Headers {
  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  });

  const origin = allowedOrigin(request, env);
  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Authorization,Content-Type");
    headers.set("Vary", "Origin");
  }

  return headers;
}

function json(request: Request, env: Env, data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: responseHeaders(request, env),
  });
}

function squareBaseUrl(env: Env): string {
  return env.SQUARE_ENVIRONMENT === "sandbox"
    ? "https://connect.squareupsandbox.com"
    : "https://connect.squareup.com";
}

async function squareRequest<T>(
  env: Env,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${env.SQUARE_ACCESS_TOKEN}`);
  headers.set("Square-Version", SQUARE_VERSION);
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${squareBaseUrl(env)}${path}`, {
    ...init,
    headers,
  });

  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.errors?.[0]?.detail ||
      data?.errors?.[0]?.code ||
      `Square request failed (${response.status})`;
    throw new SquareApiError(message, response.status);
  }

  return data as T;
}

function camelizeKey(key: string): string {
  return key.replace(/_([a-z])/g, (_match, letter: string) => letter.toUpperCase());
}

function camelize<T = unknown>(value: any): T {
  if (Array.isArray(value)) return value.map((entry) => camelize(entry)) as T;
  if (!value || typeof value !== "object") return value as T;

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [camelizeKey(key), camelize(entry)]),
  ) as T;
}

async function listCatalogServices(env: Env): Promise<any[]> {
  let cursor: string | undefined;
  const objects: any[] = [];

  do {
    const query = new URLSearchParams({ types: "ITEM" });
    if (cursor) query.set("cursor", cursor);

    const page = await squareRequest<{ objects?: any[]; cursor?: string }>(
      env,
      `/v2/catalog/list?${query.toString()}`,
    );
    objects.push(...(page.objects || []));
    cursor = page.cursor;
  } while (cursor);

  const serviceMap = new Map<string, any>();
  for (const object of objects) {
    const item = object.item_data;
    if (item?.is_archived) continue;
    const variations = item?.variations || [];
    if (!variations.some((variation: any) => variation.item_variation_data?.service_duration)) {
      continue;
    }

    const name = item?.name || object.id;
    const version = Number(object.version || 0);
    const existing = serviceMap.get(name);
    if (existing && existing.version >= version) continue;

    serviceMap.set(name, {
      id: object.id,
      name,
      description: item?.description,
      categoryId: item?.category_id || item?.categories?.[0]?.id,
      version,
      variations: variations.map((variation: any) => ({
        id: variation.id,
        name: variation.item_variation_data?.name,
        duration: variation.item_variation_data?.service_duration,
        price: Number(variation.item_variation_data?.price_money?.amount || 0) / 100,
      })),
    });
  }

  return Array.from(serviceMap.values());
}

type CatalogSyncAction = "create" | "update" | "unchanged";

type CatalogSyncOperation = {
  key: string;
  action: CatalogSyncAction;
  localName: string;
  squareName: string;
  existingId?: string;
  existingVersion?: number;
  changes: string[];
  variations: Array<{ name: string; price: number; durationMinutes: number }>;
  costBasis?: {
    includedProducts: string;
    includedProductCost: number;
    estimatedConsumables: number;
    estimatedDirectMaterials: number;
    basis: string;
  };
};

function normalizeCatalogName(value = ""): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const RETIRED_SQUARE_SERVICE_NAMES = new Set([
  normalizeCatalogName("3-Year Ceramic Coating"),
  normalizeCatalogName("Protection Package"),
]);

const SYSTEM_X_COST_BASIS: Record<string, NonNullable<CatalogSyncOperation["costBasis"]>> = {
  "system-x-crystal-plus": {
    includedProducts: "System X Crystal+ 65 mL",
    includedProductCost: 89,
    estimatedConsumables: 60,
    estimatedDirectMaterials: 149,
    basis: "One-off dealer price; 12+ bottle discount is not assumed.",
  },
  "system-x-pro-plus": {
    includedProducts: "System X Pro+ 65 mL ($189) + Glass+ 10 mL ($20)",
    includedProductCost: 209,
    estimatedConsumables: 80,
    estimatedDirectMaterials: 289,
    basis: "One-off dealer prices; 12+ bottle discounts are not assumed.",
  },
  "system-x-max-g-plus": {
    includedProducts: "System X MAX G+ 65 mL ($289) + Glass+ 10 mL ($20) + Wheel+ 20 mL ($89)",
    includedProductCost: 398,
    estimatedConsumables: 100,
    estimatedDirectMaterials: 498,
    basis: "One-off dealer prices; 12+ bottle discounts are not assumed.",
  },
  "system-x-phantom-2k": {
    includedProducts: "System X Phantom 2K 65 mL ($329) + Glass+ 10 mL ($20) + Wheel+ 20 mL ($89)",
    includedProductCost: 438,
    estimatedConsumables: 120,
    estimatedDirectMaterials: 558,
    basis: "One-off dealer prices; 12+ bottle discounts are not assumed.",
  },
  "addon-system-x-glass-plus": {
    includedProducts: "System X Glass+ 10 mL",
    includedProductCost: 20,
    estimatedConsumables: 10,
    estimatedDirectMaterials: 30,
    basis: "Current one-off dealer price; labor, overhead, and card fees are not included.",
  },
  "addon-system-x-wheel-plus": {
    includedProducts: "System X Wheel+ 20 mL",
    includedProductCost: 89,
    estimatedConsumables: 20,
    estimatedDirectMaterials: 109,
    basis: "Current one-off dealer price; labor, overhead, and card fees are not included.",
  },
  "addon-system-x-interior-protection": {
    includedProducts: "System X LVP 65 mL ($89) + Textile 500 mL ($35)",
    includedProductCost: 124,
    estimatedConsumables: 20,
    estimatedDirectMaterials: 144,
    basis: "Current one-off dealer prices; XL or heavily upholstered vehicles may require additional product.",
  },
  "addon-system-x-revive-trim": {
    includedProducts: "System X Revive 20 mL",
    includedProductCost: 50,
    estimatedConsumables: 15,
    estimatedDirectMaterials: 65,
    basis: "Current one-off dealer price; final scope depends on the amount and condition of unpainted trim.",
  },
};

function serviceDurationToMs(duration: string | Record<string, string> | undefined): number {
  const value = typeof duration === "string"
    ? duration
    : duration?.car || (duration ? Object.values(duration)[0] : undefined) || "2 hours";
  const values = [...value.matchAll(/\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
  const amount = values.length ? Math.max(...values) : 2;
  const normalized = value.toLowerCase();
  const minutes = normalized.includes("day")
    ? amount * 8 * 60
    : normalized.includes("hour") || normalized.includes(" hr")
      ? amount * 60
      : amount;
  return Math.max(15, Math.round(minutes)) * 60 * 1000;
}

async function listRawCatalogItems(env: Env): Promise<any[]> {
  let cursor: string | undefined;
  const items: any[] = [];

  do {
    const query = new URLSearchParams({ types: "ITEM" });
    if (cursor) query.set("cursor", cursor);
    const page = await squareRequest<{ objects?: any[]; cursor?: string }>(
      env,
      `/v2/catalog/list?${query.toString()}`,
    );
    items.push(...(page.objects || []).filter(
      (object) => object.type === "ITEM" && !object.is_deleted && !object.item_data?.is_archived,
    ));
    cursor = page.cursor;
  } while (cursor);

  return items;
}

function desiredCatalogItems() {
  return [
    ...SERVICES.map((service) => ({
      key: service.id,
      localName: service.name,
      squareName: service.squareName || service.name,
      description: service.longDescription || service.shortDescription,
      duration: service.duration,
      variations: (service.isSpecialty ? SPECIALTY_SIZES : VEHICLE_SIZES)
        .filter((size) => service.price[size.id] !== undefined)
        .map((size) => ({ name: size.name, price: service.price[size.id] })),
    })),
    ...ADD_ONS.map((addon) => ({
      key: `addon-${addon.id}`,
      localName: addon.name,
      squareName: addon.name,
      description: addon.description,
      duration: addon.duration,
      variations: addon.priceBySize
        ? VEHICLE_SIZES
            .filter((size) => addon.priceBySize?.[size.id] !== undefined)
            .map((size) => ({ name: size.name, price: addon.priceBySize![size.id]! }))
        : [{ name: "Regular", price: addon.price }],
    })),
  ];
}

function findExistingCatalogItem(rawItems: any[], squareName: string, localName: string): any | undefined {
  const names = new Set([normalizeCatalogName(squareName), normalizeCatalogName(localName)]);
  return rawItems.find((item) => names.has(normalizeCatalogName(item.item_data?.name || "")));
}

function findExistingVariation(existingVariations: any[], variationName: string, desiredVariationCount: number): any | undefined {
  const namedMatch = existingVariations.find(
    (candidate: any) => normalizeCatalogName(candidate.item_variation_data?.name || "") === normalizeCatalogName(variationName),
  );
  if (namedMatch) return namedMatch;

  // Single-price add-ons sometimes have a custom variation label in Square.
  // Reuse that variation instead of creating a duplicate just to rename it.
  return desiredVariationCount === 1 && existingVariations.length === 1
    ? existingVariations[0]
    : undefined;
}

function buildCatalogSyncOperation(desired: ReturnType<typeof desiredCatalogItems>[number], existing?: any): CatalogSyncOperation {
  const durationMs = serviceDurationToMs(desired.duration);
  const changes: string[] = [];
  const existingVariations = existing?.item_data?.variations || [];

  if (!existing) {
    changes.push("Create missing Square service");
  } else {
    if ((existing.item_data?.description || "") !== desired.description) changes.push("Update description");
    if (existing.item_data?.product_type !== "APPOINTMENTS_SERVICE") changes.push("Mark as appointment service");

    for (const variation of desired.variations) {
      const current = findExistingVariation(existingVariations, variation.name, desired.variations.length);
      if (!current) {
        changes.push(`Add ${variation.name} variation`);
        continue;
      }
      const data = current.item_variation_data || {};
      if ((data.name || "") !== variation.name) changes.push(`Rename option to ${variation.name}`);
      const currentPrice = Number(data.price_money?.amount || 0) / 100;
      if (currentPrice !== variation.price) changes.push(`Update ${variation.name} price from $${currentPrice} to $${variation.price}`);
      if (Number(data.service_duration || 0) !== durationMs) changes.push(`Update ${variation.name} duration`);
      if (data.available_for_booking !== true) changes.push(`Enable ${variation.name} for booking`);
    }
  }

  return {
    key: desired.key,
    action: !existing ? "create" : changes.length ? "update" : "unchanged",
    localName: desired.localName,
    squareName: desired.squareName,
    existingId: existing?.id,
    existingVersion: existing?.version ? Number(existing.version) : undefined,
    changes,
    costBasis: SYSTEM_X_COST_BASIS[desired.key],
    variations: desired.variations.map((variation) => ({
      ...variation,
      durationMinutes: Math.round(durationMs / 60_000),
    })),
  };
}

async function catalogSyncPlan(env: Env) {
  const rawItems = await listRawCatalogItems(env);
  const desiredItems = desiredCatalogItems();
  const operations = desiredItems.map((desired) =>
    buildCatalogSyncOperation(desired, findExistingCatalogItem(rawItems, desired.squareName, desired.localName)),
  );
  const retirementItems = rawItems.filter((item) =>
    RETIRED_SQUARE_SERVICE_NAMES.has(normalizeCatalogName(item.item_data?.name || "")),
  );
  const retirements = retirementItems.map((item) => ({
    id: item.id,
    name: item.item_data?.name || item.id,
    version: Number(item.version || 0),
  }));
  const matchedIds = new Set(operations.map((operation) => operation.existingId).filter(Boolean));
  const retirementIds = new Set(retirements.map((item) => item.id));
  const untouchedSquareItems = rawItems
    .filter((item) => !matchedIds.has(item.id) && !retirementIds.has(item.id))
    .map((item) => ({ id: item.id, name: item.item_data?.name || item.id }));
  const signature = {
    operations: operations.map(({ key, action, existingId, existingVersion, variations, changes }) => ({
      key,
      action,
      existingId,
      existingVersion,
      variations,
      changes,
    })),
    retirements,
  };
  const planHash = base64Url(await digest(JSON.stringify(signature)));

  return {
    planHash,
    operations,
    retirements,
    retirementItems,
    untouchedSquareItems,
    summary: {
      create: operations.filter((operation) => operation.action === "create").length,
      update: operations.filter((operation) => operation.action === "update").length,
      unchanged: operations.filter((operation) => operation.action === "unchanged").length,
      archive: retirements.length,
    },
    rawItems,
    desiredItems,
  };
}

function archivedCatalogObject(existing: any): any {
  const object = cleanCatalogObjectForUpsert(existing);
  object.item_data = { ...(object.item_data || {}), is_archived: true };
  return object;
}

function cleanCatalogObjectForUpsert(value: any): any {
  if (Array.isArray(value)) return value.map(cleanCatalogObjectForUpsert);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !["updated_at", "is_deleted", "catalog_v1_ids"].includes(key))
      .map(([key, entry]) => [key, cleanCatalogObjectForUpsert(entry)]),
  );
}

function catalogObjectForSync(
  desired: ReturnType<typeof desiredCatalogItems>[number],
  existing: any | undefined,
  fallbackTeamMemberIds: string[],
): any {
  const durationMs = serviceDurationToMs(desired.duration);
  const itemId = existing?.id || `#item-${desired.key}`;
  const object = existing
    ? cleanCatalogObjectForUpsert(existing)
    : {
        type: "ITEM",
        id: itemId,
        present_at_all_locations: true,
        item_data: { variations: [] },
      };
  const existingVariations = object.item_data?.variations || [];
  const desiredVariationNames = new Set(desired.variations.map((variation) => normalizeCatalogName(variation.name)));
  const matchedVariationIds = new Set(
    desired.variations
      .map((variation) => findExistingVariation(existingVariations, variation.name, desired.variations.length)?.id)
      .filter(Boolean),
  );
  const preservedVariations = existingVariations.filter(
    (variation: any) =>
      !matchedVariationIds.has(variation.id) &&
      !desiredVariationNames.has(normalizeCatalogName(variation.item_variation_data?.name || "")),
  );

  const syncedVariations = desired.variations.map((variation, index) => {
    const current = findExistingVariation(existingVariations, variation.name, desired.variations.length);
    const variationObject = current
      ? cleanCatalogObjectForUpsert(current)
      : {
          type: "ITEM_VARIATION",
          id: `#variation-${desired.key}-${index}`,
          present_at_all_locations: true,
          item_variation_data: {},
        };
    const currentData = variationObject.item_variation_data || {};
    variationObject.item_variation_data = {
      ...currentData,
      item_id: itemId,
      name: variation.name,
      pricing_type: "FIXED_PRICING",
      price_money: { amount: Math.round(variation.price * 100), currency: "USD" },
      service_duration: durationMs,
      available_for_booking: true,
      ...(currentData.team_member_ids?.length
        ? { team_member_ids: currentData.team_member_ids }
        : fallbackTeamMemberIds.length
          ? { team_member_ids: fallbackTeamMemberIds }
          : {}),
    };
    return variationObject;
  });

  object.item_data = {
    ...(object.item_data || {}),
    name: desired.squareName,
    description: desired.description,
    product_type: "APPOINTMENTS_SERVICE",
    variations: [...syncedVariations, ...preservedVariations],
  };
  return object;
}

function catalogObjectsForPlan(plan: Awaited<ReturnType<typeof catalogSyncPlan>>): any[] {
  const actionable = plan.operations.filter((operation) => operation.action !== "unchanged");
  const fallbackTeamMemberIds = Array.from(new Set(
    plan.rawItems.flatMap((item: any) =>
      (item.item_data?.variations || []).flatMap((variation: any) => variation.item_variation_data?.team_member_ids || []),
    ),
  )) as string[];
  const desiredByKey = new Map(plan.desiredItems.map((item) => [item.key, item]));
  const rawById = new Map(plan.rawItems.map((item: any) => [item.id, item]));

  return actionable.map((operation) =>
    catalogObjectForSync(
      desiredByKey.get(operation.key)!,
      operation.existingId ? rawById.get(operation.existingId) : undefined,
      fallbackTeamMemberIds,
    ),
  );
}

function validateUniqueCatalogIds(objects: any[]): { itemCount: number; variationCount: number } {
  const ids = new Set<string>();
  let variationCount = 0;

  for (const object of objects) {
    const catalogObjects = [object, ...(object.item_data?.variations || [])];
    variationCount += Math.max(0, catalogObjects.length - 1);
    for (const catalogObject of catalogObjects) {
      const id = catalogObject?.id;
      if (!id) continue;
      if (ids.has(id)) throw new HttpError(`Sync preview found a duplicate Square object ID (${id}). Refresh after the catalog is corrected.`, 409);
      ids.add(id);
    }
  }

  return { itemCount: objects.length, variationCount };
}

async function previewSquareSync(request: Request, env: Env): Promise<Response> {
  const plan = await catalogSyncPlan(env);
  const objects = [
    ...catalogObjectsForPlan(plan),
    ...plan.retirementItems.map(archivedCatalogObject),
  ];
  const validation = validateUniqueCatalogIds(objects);
  return json(request, env, {
    planHash: plan.planHash,
    summary: plan.summary,
    operations: plan.operations,
    retirements: plan.retirements,
    untouchedSquareItems: plan.untouchedSquareItems,
    safety: "Only the retired ceramic services shown below will be archived. No Square items are permanently deleted.",
    validation: { ...validation, uniqueIds: true },
  });
}

async function applySquareSync(request: Request, env: Env): Promise<Response> {
  const body = (await request.json().catch(() => null)) as { confirm?: boolean; planHash?: string } | null;
  if (body?.confirm !== true || !body.planHash) {
    return json(request, env, { error: "Preview the sync and explicitly confirm the current plan before applying it." }, 400);
  }

  const plan = await catalogSyncPlan(env);
  if (body.planHash !== plan.planHash) {
    return json(request, env, { error: "Square changed after the preview. Refresh the sync preview and review it again." }, 409);
  }

  const actionable = plan.operations.filter((operation) => operation.action !== "unchanged");
  if (actionable.length === 0 && plan.retirementItems.length === 0) {
    return json(request, env, { success: true, message: "Square already matches the website catalog.", summary: plan.summary });
  }

  const objects = [
    ...catalogObjectsForPlan(plan),
    ...plan.retirementItems.map(archivedCatalogObject),
  ];
  validateUniqueCatalogIds(objects);

  await squareRequest(env, "/v2/catalog/batch-upsert", {
    method: "POST",
    body: JSON.stringify({
      idempotency_key: crypto.randomUUID(),
      batches: [{ objects }],
    }),
  });
  await audit(
    env,
    "Square catalog safe sync",
    `Created ${plan.summary.create}, updated ${plan.summary.update}, archived ${plan.summary.archive}, deleted 0`,
  );

  return json(request, env, {
    success: true,
    message: `Square sync complete. Created ${plan.summary.create}, updated ${plan.summary.update}, archived ${plan.summary.archive}, deleted 0.`,
    summary: plan.summary,
  });
}

async function getCatalogServices(request: Request, env: Env): Promise<Response> {
  const response = json(request, env, await listCatalogServices(env));
  response.headers.set("Cache-Control", "public, max-age=300");
  return response;
}

async function getAvailability(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");
  const ids = (url.searchParams.get("serviceVariationIds") || url.searchParams.get("serviceVariationId") || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!start || !end || ids.length === 0) {
    return json(request, env, { error: "Start, end, and a Square service variation are required." }, 400);
  }

  const result = await squareRequest<{ availabilities?: any[] }>(
    env,
    "/v2/bookings/availability/search",
    {
      method: "POST",
      body: JSON.stringify({
        query: {
          filter: {
            start_at_range: { start_at: start, end_at: end },
            location_id: env.SQUARE_LOCATION_ID,
            segment_filters: ids.map((id) => ({ service_variation_id: id })),
          },
        },
      }),
    },
  );

  return json(request, env, camelize(result.availabilities || []));
}

function appointmentSegment(segment: any): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries({
      duration_minutes: segment.durationMinutes,
      service_variation_id: segment.serviceVariationId,
      service_variation_version: segment.serviceVariationVersion,
      team_member_id: segment.teamMemberId,
      any_team_member: segment.anyTeamMember,
      intermission_minutes: segment.intermissionMinutes,
      resource_ids: segment.resourceIds,
    }).filter(([, value]) => value !== undefined && value !== null),
  );
}

const PUBLIC_FAQS = [
  {
    id: "1",
    question: "How long does a full detail take?",
    answer: "A full interior and exterior detail typically takes 4 to 6 hours depending on the vehicle size and condition.",
    order: 1,
  },
  {
    id: "2",
    question: "Do you need access to water and power?",
    answer: "No. The mobile detailing setup is self-contained with water and power for suitable mobile appointments.",
    order: 2,
  },
  {
    id: "3",
    question: "What is a ceramic coating?",
    answer: "A ceramic coating bonds to prepared paint to add gloss, water beading, UV resistance, and easier maintenance than traditional wax.",
    order: 3,
  },
  {
    id: "4",
    question: "Do I need to be present while you detail my car?",
    answer: "Not for the entire appointment. Bryan needs access to the vehicle and will confirm the handoff and completion details with you.",
    order: 4,
  },
];

function formString(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function formStringList(form: FormData, name: string): string[] {
  const value = formString(form, name);
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === "string").slice(0, 20)
      : [];
  } catch {
    return [value.slice(0, 200)];
  }
}

function squarePhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length >= 11 && digits.length <= 16) return `+${digits}`;
  return null;
}

async function submitQuote(request: Request, env: Env): Promise<Response> {
  const form = await request.formData();
  const name = formString(form, "name");
  const phone = squarePhone(formString(form, "phone"));
  const email = formString(form, "email");

  if (
    name.length < 2 ||
    name.length > 100 ||
    !phone ||
    (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))
  ) {
    return json(request, env, { error: "Please provide a valid name, phone number, and email address." }, 400);
  }

  const services = formStringList(form, "services");
  const addons = formStringList(form, "addons");
  const redFlags = formString(form, "redFlags");
  const vehicle = [formString(form, "vehicleYear"), formString(form, "vehicleSize")]
    .filter(Boolean)
    .join(" ");
  const submittedAt = new Date().toISOString();
  const quoteNote = [
    "Website quote request",
    `Submitted: ${submittedAt}`,
    `Vehicle: ${vehicle || "Not specified"}`,
    `Condition: ${formString(form, "condition") || "Not specified"}`,
    `Customer priority: ${formString(form, "expectation") || "Not specified"}`,
    `Preliminary range: $${formString(form, "estimatedRange") || "Not calculated"}`,
    `Services: ${services.join(", ") || "None specified"}`,
    `Add-ons: ${addons.join(", ") || "None selected"}`,
    redFlags ? `Disclosures: ${redFlags}` : "",
    "Photos: customer is instructed to text photos to (712) 305-6313.",
  ]
    .filter(Boolean)
    .join("\n");

  const nameParts = name.split(/\s+/);
  const givenName = nameParts.shift() || name;
  const familyName = nameParts.join(" ");
  let existingCustomer: any | undefined;

  if (email) {
    const search = await squareRequest<{ customers?: any[] }>(env, "/v2/customers/search", {
      method: "POST",
      body: JSON.stringify({ query: { filter: { email_address: { exact: email } } } }),
    });
    existingCustomer = search.customers?.[0];
  }

  let customerId: string | undefined;
  if (existingCustomer?.id) {
    const combinedNote = [existingCustomer.note, quoteNote].filter(Boolean).join("\n\n").slice(-8_000);
    const updated = await squareRequest<{ customer?: { id?: string } }>(
      env,
      `/v2/customers/${encodeURIComponent(existingCustomer.id)}`,
      {
        method: "PUT",
        body: JSON.stringify({
          version: existingCustomer.version,
          given_name: givenName,
          family_name: familyName || undefined,
          email_address: email || undefined,
          phone_number: phone,
          note: combinedNote,
        }),
      },
    );
    customerId = updated.customer?.id;
  } else {
    const created = await squareRequest<{ customer?: { id?: string } }>(env, "/v2/customers", {
      method: "POST",
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        given_name: givenName,
        family_name: familyName || undefined,
        email_address: email || undefined,
        phone_number: phone,
        reference_id: `website-quote-${Date.now()}`,
        note: quoteNote,
      }),
    });
    customerId = created.customer?.id;
  }

  if (!customerId) throw new SquareApiError("Square did not save the quote request.", 502);
  return json(request, env, {
    success: true,
    message: "Quote request saved to Square for Bryan to review.",
    photosAccepted: false,
  });
}

async function createBooking(request: Request, env: Env): Promise<Response> {
  const body = (await request.json()) as any;
  const { startAt, serviceVariationIds, appointmentSegments, customer, serviceName, addons } = body;

  if (!startAt || !customer?.email || !customer?.firstName || !customer?.phone) {
    return json(request, env, { error: "Missing required booking details." }, 400);
  }

  if (!Array.isArray(serviceVariationIds) || serviceVariationIds.length === 0) {
    return json(request, env, { error: "A Square service variation is required to create a booking." }, 400);
  }

  if (
    serviceVariationIds.some(
      (id: string) => !id || id.startsWith("local-") || id.includes("-var-"),
    )
  ) {
    return json(
      request,
      env,
      { error: "This service is not connected to a real Square service variation." },
      400,
    );
  }

  if (!Array.isArray(appointmentSegments) || appointmentSegments.length === 0) {
    return json(request, env, { error: "Please choose an available Square time slot." }, 400);
  }

  const segments = appointmentSegments.map(appointmentSegment);
  if (segments.some((segment: any) => !segment.service_variation_id || !segment.team_member_id)) {
    return json(
      request,
      env,
      { error: "Square did not return a bookable team member for this slot. Please choose another time." },
      400,
    );
  }

  const search = await squareRequest<{ customers?: any[] }>(env, "/v2/customers/search", {
    method: "POST",
    body: JSON.stringify({
      query: { filter: { email_address: { exact: customer.email } } },
    }),
  });

  let customerId = search.customers?.[0]?.id;
  if (!customerId) {
    const created = await squareRequest<{ customer?: { id?: string } }>(env, "/v2/customers", {
      method: "POST",
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        given_name: customer.firstName,
        family_name: customer.lastName,
        email_address: customer.email,
        phone_number: customer.phone,
      }),
    });
    customerId = created.customer?.id;
  }

  if (!customerId) throw new SquareApiError("Square did not return a customer ID.", 502);

  const customerNote = [
    customer.notes,
    customer.locationType ? `Service location: ${customer.locationType}` : "",
    customer.address ? `Address: ${customer.address}` : "",
    serviceName ? `Services: ${serviceName}` : "",
    Array.isArray(addons) && addons.length > 0 ? `Add-ons: ${addons.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const result = await squareRequest<{ booking?: any }>(env, "/v2/bookings", {
    method: "POST",
    body: JSON.stringify({
      idempotency_key: crypto.randomUUID(),
      booking: {
        start_at: startAt,
        location_id: env.SQUARE_LOCATION_ID,
        customer_id: customerId,
        customer_note: customerNote,
        appointment_segments: segments,
      },
    }),
  });

  if (!result.booking?.id) throw new SquareApiError("Square did not return a booking ID.", 502);
  return json(request, env, camelize(result.booking));
}

const ADMIN_SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const textEncoder = new TextEncoder();

class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function digest(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", textEncoder.encode(value)));
}

async function safeStringEqual(left: string, right: string): Promise<boolean> {
  const [leftDigest, rightDigest] = await Promise.all([digest(left), digest(right)]);
  let different = 0;
  for (let index = 0; index < leftDigest.length; index += 1) {
    different |= leftDigest[index] ^ rightDigest[index];
  }
  return different === 0;
}

async function adminSigningKey(env: Env): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    textEncoder.encode(env.ADMIN_SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function createAdminToken(env: Env): Promise<string> {
  const payload = base64Url(textEncoder.encode(JSON.stringify({ exp: Date.now() + ADMIN_SESSION_DURATION_MS })));
  const signature = new Uint8Array(
    await crypto.subtle.sign("HMAC", await adminSigningKey(env), textEncoder.encode(payload)),
  );
  return `${payload}.${base64Url(signature)}`;
}

function bearerToken(request: Request): string {
  const authorization = request.headers.get("Authorization") || "";
  return authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
}

async function hasValidAdminToken(request: Request, env: Env): Promise<boolean> {
  if (!env.ADMIN_SESSION_SECRET) return false;
  const [payload, suppliedSignature] = bearerToken(request).split(".");
  if (!payload || !suppliedSignature) return false;

  try {
    const signatureBytes = fromBase64Url(suppliedSignature);
    const signature = signatureBytes.buffer.slice(
      signatureBytes.byteOffset,
      signatureBytes.byteOffset + signatureBytes.byteLength,
    ) as ArrayBuffer;
    const validSignature = await crypto.subtle.verify(
      "HMAC",
      await adminSigningKey(env),
      signature,
      textEncoder.encode(payload),
    );
    if (!validSignature) return false;
    const decoded = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as { exp?: number };
    return typeof decoded.exp === "number" && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

async function verifyAdminPassword(request: Request, env: Env): Promise<Response> {
  if (!env.ADMIN_PASSWORD || !env.ADMIN_SESSION_SECRET) {
    return json(request, env, { error: "Admin login is not configured." }, 503);
  }

  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";
  const clientKey = request.headers.get("CF-Connecting-IP") || "unknown";
  const now = Date.now();
  const attempt = await env.CONTENT_DB.prepare(
    "SELECT attempt_count, reset_at FROM admin_login_attempts WHERE client_key = ?",
  ).bind(clientKey).first<{ attempt_count: number; reset_at: number }>();

  if (attempt && attempt.reset_at > now && attempt.attempt_count >= 5) {
    return json(request, env, { error: "Too many login attempts. Please try again in 15 minutes." }, 429);
  }

  if (!(await safeStringEqual(password, env.ADMIN_PASSWORD))) {
    const count = attempt && attempt.reset_at > now ? attempt.attempt_count + 1 : 1;
    const resetAt = attempt && attempt.reset_at > now ? attempt.reset_at : now + LOGIN_WINDOW_MS;
    await env.CONTENT_DB.prepare(
      "INSERT INTO admin_login_attempts (client_key, attempt_count, reset_at) VALUES (?, ?, ?) ON CONFLICT(client_key) DO UPDATE SET attempt_count = excluded.attempt_count, reset_at = excluded.reset_at",
    ).bind(clientKey, count, resetAt).run();
    return json(request, env, { error: "Invalid administrator password" }, 401);
  }

  await env.CONTENT_DB.prepare("DELETE FROM admin_login_attempts WHERE client_key = ?").bind(clientKey).run();
  return json(request, env, { ok: true, token: await createAdminToken(env), expiresIn: ADMIN_SESSION_DURATION_MS });
}

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  featured_image: string;
  published: number;
  created_at: string;
  updated_at: string;
};

function blogPost(row: BlogRow) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    category: row.category,
    featuredImage: row.featured_image,
    published: row.published === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function normalizeBlogInput(input: any, existing?: BlogRow) {
  const title = typeof input?.title === "string" ? input.title.trim() : "";
  const slug = typeof input?.slug === "string"
    ? input.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "")
    : "";
  const excerpt = typeof input?.excerpt === "string" ? input.excerpt.trim() : "";
  const content = typeof input?.content === "string" ? input.content.trim() : "";
  const author = typeof input?.author === "string" && input.author.trim() ? input.author.trim() : "Bryan";
  const category = typeof input?.category === "string" && input.category.trim() ? input.category.trim() : "Detailing Tips";
  const featuredImage = typeof input?.featuredImage === "string" ? input.featuredImage.trim() : "";

  if (!title || title.length > 200) throw new HttpError("Title is required and must be 200 characters or fewer.", 400);
  if (!slug || slug.length > 200) throw new HttpError("A valid URL slug is required.", 400);
  if (!excerpt || excerpt.length > 600) throw new HttpError("Excerpt is required and must be 600 characters or fewer.", 400);
  if (!content || content.length > 250_000) throw new HttpError("Article content is required and must be under 250,000 characters.", 400);

  const now = new Date().toISOString();
  return {
    id: existing?.id || crypto.randomUUID(),
    title,
    slug,
    excerpt,
    content,
    author: author.slice(0, 100),
    category: category.slice(0, 100),
    featuredImage: featuredImage.slice(0, 2_000),
    published: input?.published === true ? 1 : 0,
    createdAt: existing?.created_at || now,
    updatedAt: now,
  };
}

async function listBlogPosts(env: Env, includeDrafts: boolean): Promise<ReturnType<typeof blogPost>[]> {
  const query = includeDrafts
    ? "SELECT * FROM blog_posts ORDER BY created_at DESC"
    : "SELECT * FROM blog_posts WHERE published = 1 ORDER BY created_at DESC";
  const result = await env.CONTENT_DB.prepare(query).all<BlogRow>();
  return (result.results || []).map(blogPost);
}

async function audit(env: Env, action: string, details = ""): Promise<void> {
  await env.CONTENT_DB.batch([
    env.CONTENT_DB.prepare("INSERT INTO admin_audit_logs (id, action, details, created_at) VALUES (?, ?, ?, ?)")
      .bind(crypto.randomUUID(), action.slice(0, 120), details.slice(0, 500), new Date().toISOString()),
    env.CONTENT_DB.prepare("DELETE FROM admin_audit_logs WHERE id NOT IN (SELECT id FROM admin_audit_logs ORDER BY created_at DESC LIMIT 200)"),
  ]);
}

async function saveBlogPost(request: Request, env: Env, id?: string): Promise<Response> {
  const body = await request.json();
  const existing = id
    ? await env.CONTENT_DB.prepare("SELECT * FROM blog_posts WHERE id = ?").bind(id).first<BlogRow>()
    : null;
  if (id && !existing) throw new HttpError("Article not found.", 404);
  const post = normalizeBlogInput(body, existing || undefined);
  const duplicate = await env.CONTENT_DB.prepare("SELECT id FROM blog_posts WHERE slug = ? AND id <> ?")
    .bind(post.slug, post.id).first<{ id: string }>();
  if (duplicate) throw new HttpError("An article with this slug already exists.", 409);

  await env.CONTENT_DB.prepare(
    "INSERT INTO blog_posts (id,title,slug,excerpt,content,author,category,featured_image,published,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,slug=excluded.slug,excerpt=excluded.excerpt,content=excluded.content,author=excluded.author,category=excluded.category,featured_image=excluded.featured_image,published=excluded.published,updated_at=excluded.updated_at",
  ).bind(post.id, post.title, post.slug, post.excerpt, post.content, post.author, post.category, post.featuredImage, post.published, post.createdAt, post.updatedAt).run();
  await audit(env, id ? "Blog article updated" : "Blog article created", post.title);
  return json(request, env, { ...post, published: post.published === 1 }, id ? 200 : 201);
}

async function listFaqs(env: Env) {
  const result = await env.CONTENT_DB.prepare(
    "SELECT id, question, answer, order_index FROM faqs ORDER BY order_index, created_at",
  ).all<{ id: string; question: string; answer: string; order_index: number }>();
  return (result.results || []).map((row) => ({ id: row.id, question: row.question, answer: row.answer, order: row.order_index }));
}

function normalizeFaqInput(input: any) {
  const question = typeof input?.question === "string" ? input.question.trim() : "";
  const answer = typeof input?.answer === "string" ? input.answer.trim() : "";
  const order = Number.isFinite(Number(input?.order)) ? Math.trunc(Number(input.order)) : 0;
  if (!question || question.length > 500) throw new HttpError("Question is required and must be 500 characters or fewer.", 400);
  if (!answer || answer.length > 5_000) throw new HttpError("Answer is required and must be 5,000 characters or fewer.", 400);
  return { question, answer, order };
}

async function saveFaq(request: Request, env: Env, id?: string): Promise<Response> {
  const faq = normalizeFaqInput(await request.json());
  const faqId = id || crypto.randomUUID();
  const existing = id ? await env.CONTENT_DB.prepare("SELECT id FROM faqs WHERE id = ?").bind(id).first() : null;
  if (id && !existing) throw new HttpError("FAQ not found.", 404);
  const now = new Date().toISOString();
  await env.CONTENT_DB.prepare(
    "INSERT INTO faqs (id,question,answer,order_index,created_at,updated_at) VALUES (?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET question=excluded.question,answer=excluded.answer,order_index=excluded.order_index,updated_at=excluded.updated_at",
  ).bind(faqId, faq.question, faq.answer, faq.order, now, now).run();
  await audit(env, id ? "FAQ updated" : "FAQ created", faq.question);
  return json(request, env, { id: faqId, ...faq }, id ? 200 : 201);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = allowedOrigin(request, env);
    if (origin === "") return json(request, env, { error: "Origin not allowed." }, 403);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: responseHeaders(request, env) });
    }

    const url = new URL(request.url);

    try {
      if (request.method === "GET" && url.pathname === "/api/health") {
        return json(request, env, { status: "ok", provider: "cloudflare" });
      }
      if (request.method === "GET" && url.pathname === "/api/catalog/services") {
        return await getCatalogServices(request, env);
      }
      if (request.method === "GET" && url.pathname === "/api/availability") {
        return await getAvailability(request, env);
      }
      if (request.method === "POST" && url.pathname === "/api/bookings") {
        return await createBooking(request, env);
      }
      if (request.method === "POST" && url.pathname === "/api/quote") {
        return await submitQuote(request, env);
      }
      if (request.method === "POST" && url.pathname === "/api/analytics/funnel") {
        return json(request, env, { success: true });
      }
      if (request.method === "POST" && url.pathname === "/api/admin/verify-password") {
        return await verifyAdminPassword(request, env);
      }
      if (request.method === "GET" && url.pathname === "/api/admin/session") {
        const authenticated = await hasValidAdminToken(request, env);
        return json(request, env, { authenticated }, authenticated ? 200 : 401);
      }
      if (request.method === "POST" && url.pathname === "/api/admin/logout") {
        return json(request, env, { ok: true });
      }
      if (request.method === "GET" && url.pathname === "/api/blog/posts") {
        const response = json(request, env, await listBlogPosts(env, false));
        response.headers.set("Cache-Control", "public, max-age=60");
        return response;
      }
      if (request.method === "GET" && url.pathname.startsWith("/api/blog/posts/")) {
        const slug = decodeURIComponent(url.pathname.slice("/api/blog/posts/".length));
        const row = await env.CONTENT_DB.prepare(
          "SELECT * FROM blog_posts WHERE slug = ? AND published = 1",
        ).bind(slug).first<BlogRow>();
        return row ? json(request, env, blogPost(row)) : json(request, env, { error: "Article not found." }, 404);
      }
      if (request.method === "GET" && url.pathname === "/api/faqs") {
        const faqs = await listFaqs(env);
        const response = json(request, env, faqs.length > 0 ? faqs : PUBLIC_FAQS);
        response.headers.set("Cache-Control", "public, max-age=60");
        return response;
      }
      if (request.method === "GET" && url.pathname === "/api/reviews") {
        return json(request, env, {
          success: false,
          message: "Current customer reviews are available on Google.",
          reviews: [],
        });
      }

      if (url.pathname.startsWith("/api/admin/")) {
        if (!(await hasValidAdminToken(request, env))) {
          return json(request, env, { error: "Administrator authentication required" }, 401);
        }

        if (request.method === "GET" && url.pathname === "/api/admin/services") {
          return json(request, env, await listCatalogServices(env));
        }
        if (request.method === "POST" && url.pathname === "/api/admin/sync-square/preview") {
          return await previewSquareSync(request, env);
        }
        if (request.method === "POST" && url.pathname === "/api/admin/sync-square") {
          return await applySquareSync(request, env);
        }
        if (url.pathname.startsWith("/api/admin/services/") || [
          "/api/admin/sync-catalog",
          "/api/admin/remove-all-duplicates",
          "/api/admin/cleanup-duplicates",
        ].includes(url.pathname)) {
          return json(request, env, { error: "For safety, edit and clean up services in Square Dashboard." }, 409);
        }
        if (request.method === "GET" && url.pathname === "/api/admin/logs") {
          const requested = Number(url.searchParams.get("limit") || 10);
          const limit = Math.max(1, Math.min(50, Number.isFinite(requested) ? Math.trunc(requested) : 10));
          const result = await env.CONTENT_DB.prepare(
            "SELECT id, action, details, created_at FROM admin_audit_logs ORDER BY created_at DESC LIMIT ?",
          ).bind(limit).all<{ id: string; action: string; details: string; created_at: string }>();
          return json(request, env, (result.results || []).map((row) => ({ ...row, createdAt: row.created_at })));
        }
        if (request.method === "GET" && url.pathname === "/api/admin/blog/storage") {
          return json(request, env, { storage: "Cloudflare D1", persistent: true });
        }
        if (request.method === "GET" && url.pathname === "/api/admin/blog/posts") {
          return json(request, env, await listBlogPosts(env, true));
        }
        if (request.method === "POST" && url.pathname === "/api/admin/blog/posts") {
          return await saveBlogPost(request, env);
        }
        const blogAdminMatch = url.pathname.match(/^\/api\/admin\/blog\/posts\/([^/]+)$/);
        if (blogAdminMatch && request.method === "PUT") {
          return await saveBlogPost(request, env, decodeURIComponent(blogAdminMatch[1]));
        }
        if (blogAdminMatch && request.method === "DELETE") {
          const id = decodeURIComponent(blogAdminMatch[1]);
          const existing = await env.CONTENT_DB.prepare("SELECT title FROM blog_posts WHERE id = ?").bind(id).first<{ title: string }>();
          if (!existing) throw new HttpError("Article not found.", 404);
          await env.CONTENT_DB.prepare("DELETE FROM blog_posts WHERE id = ?").bind(id).run();
          await audit(env, "Blog article deleted", existing.title);
          return json(request, env, { ok: true });
        }
        if (request.method === "POST" && url.pathname === "/api/admin/faqs") {
          return await saveFaq(request, env);
        }
        const faqAdminMatch = url.pathname.match(/^\/api\/admin\/faqs\/([^/]+)$/);
        if (faqAdminMatch && request.method === "PUT") {
          return await saveFaq(request, env, decodeURIComponent(faqAdminMatch[1]));
        }
        if (faqAdminMatch && request.method === "DELETE") {
          const id = decodeURIComponent(faqAdminMatch[1]);
          const existing = await env.CONTENT_DB.prepare("SELECT question FROM faqs WHERE id = ?").bind(id).first<{ question: string }>();
          if (!existing) throw new HttpError("FAQ not found.", 404);
          await env.CONTENT_DB.prepare("DELETE FROM faqs WHERE id = ?").bind(id).run();
          await audit(env, "FAQ deleted", existing.question);
          return json(request, env, { ok: true });
        }
      }

      return json(request, env, { error: "Not found." }, 404);
    } catch (error) {
      const status = error instanceof HttpError
        ? error.status
        : error instanceof SquareApiError && error.status < 500
          ? error.status
          : 502;
      const message = error instanceof Error ? error.message : "Request failed.";
      return json(request, env, { error: message }, status);
    }
  },
};
