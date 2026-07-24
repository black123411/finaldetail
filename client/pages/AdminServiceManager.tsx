import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ServiceAPI } from '../services/api';

type SyncOperation = {
  key: string;
  action: 'create' | 'update' | 'unchanged';
  localName: string;
  squareName: string;
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

type SyncPreview = {
  planHash: string;
  summary: { create: number; update: number; unchanged: number; archive: number };
  operations: SyncOperation[];
  retirements: Array<{ id: string; name: string; version: number }>;
  untouchedSquareItems: Array<{ id: string; name: string }>;
  safety: string;
};

function errorMessage(reason: unknown, fallback: string) {
  return reason instanceof Error ? reason.message : fallback;
}

export default function AdminServiceManager() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<SyncPreview | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [success, setSuccess] = useState('');

  const loadServices = async () => {
    const items = await ServiceAPI.getAdminServices();
    setServices(Array.isArray(items) ? items : []);
  };

  useEffect(() => {
    loadServices()
      .catch((reason) => setError(errorMessage(reason, 'Unable to load Square services.')))
      .finally(() => setLoading(false));
  }, []);

  const previewSync = async () => {
    setPreviewing(true);
    setError('');
    setSuccess('');
    try {
      setPreview(await ServiceAPI.previewSquareSync());
    } catch (reason) {
      setError(errorMessage(reason, 'Unable to compare the website with Square.'));
    } finally {
      setPreviewing(false);
    }
  };

  const applySync = async () => {
    if (!preview) return;
    const changeCount = preview.summary.create + preview.summary.update;
    const archiveCount = preview.summary.archive;
    if (!window.confirm(`Apply ${changeCount} create/update change${changeCount === 1 ? '' : 's'} and archive ${archiveCount} retired service${archiveCount === 1 ? '' : 's'}? Archived items remain in Square history but stop appearing as active booking choices.`)) return;

    setSyncing(true);
    setError('');
    setSuccess('');
    try {
      const result = await ServiceAPI.syncSquare(preview.planHash);
      setSuccess(result.message || 'Square sync completed safely.');
      await loadServices();
      setPreview(null);
    } catch (reason) {
      setError(errorMessage(reason, 'The Square sync could not be completed.'));
    } finally {
      setSyncing(false);
    }
  };

  const actionable = preview?.operations.filter((operation) => operation.action !== 'unchanged') || [];
  const ceramicCosts = preview?.operations.filter((operation) => operation.costBasis) || [];
  const changeCount = (preview?.summary.create || 0) + (preview?.summary.update || 0) + (preview?.summary.archive || 0);

  return (
    <main className="min-h-screen bg-zinc-50 px-4 pb-24 pt-32 font-sans">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link to="/admin" className="mb-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-950">
              <ArrowLeft className="h-4 w-4" /> Admin
            </Link>
            <h1 className="text-3xl font-black italic tracking-tight text-zinc-950">Service Sync Wizard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">Compare the website service menu with the live Square catalog, review every proposed change, then choose whether to apply it.</p>
          </div>
          <a href="https://app.squareup.com/dashboard/items/library" target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 text-sm font-black text-zinc-900 hover:border-zinc-950">
            Open Square <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <section className="overflow-hidden rounded-[2rem] bg-zinc-950 text-white shadow-xl">
          <div className="grid gap-7 p-7 md:grid-cols-[1fr_auto] md:items-center md:p-9">
            <div>
              <div className="mb-3 flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.22em]">Preview first · reviewed archives only</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight">Website → Square catalog</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">Preview is read-only. Apply updates the website catalog and archives only the retired services named in the preview. Customers, past bookings, payments, and all unrelated Square items remain untouched.</p>
            </div>
            <button type="button" onClick={() => void previewSync()} disabled={previewing || syncing} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 text-sm font-black text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60">
              {previewing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {preview ? 'Refresh preview' : 'Preview safe sync'}
            </button>
          </div>
        </section>

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-900">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-bold text-emerald-900">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> {success}
          </div>
        )}

        {preview && (
          <section className="mt-7 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Sync preview ready</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-zinc-950">Review before anything changes</h2>
                <p className="mt-2 text-sm text-zinc-600">{preview.safety} {preview.untouchedSquareItems.length} unrelated Square item{preview.untouchedSquareItems.length === 1 ? '' : 's'} will remain untouched.</p>
              </div>
              <button type="button" onClick={() => void applySync()} disabled={syncing || changeCount === 0} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 text-sm font-black text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300">
                {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {changeCount === 0 ? 'Square is already synced' : `Apply ${changeCount} reviewed change${changeCount === 1 ? '' : 's'}`}
              </button>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                ['Create', preview.summary.create, 'text-blue-700 bg-blue-50'],
                ['Update', preview.summary.update, 'text-amber-800 bg-amber-50'],
                ['Unchanged', preview.summary.unchanged, 'text-emerald-800 bg-emerald-50'],
                ['Archive', preview.summary.archive, 'text-rose-800 bg-rose-50'],
              ].map(([label, value, colors]) => (
                <div key={String(label)} className={`rounded-2xl p-5 ${colors}`}>
                  <p className="text-[10px] font-black uppercase tracking-widest">{label}</p>
                  <p className="mt-2 text-3xl font-black">{value}</p>
                </div>
              ))}
            </div>

            {preview.retirements.length > 0 && (
              <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-700">Retired services to archive</p>
                <p className="mt-2 text-sm text-rose-900">These stay in Square history but will no longer appear as active booking choices.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {preview.retirements.map((item) => (
                    <span key={item.id} className="rounded-xl bg-white px-3 py-2 text-sm font-black text-rose-900 shadow-sm">{item.name}</span>
                  ))}
                </div>
              </div>
            )}

            {ceramicCosts.length > 0 && (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 md:p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">Private System X cost and price check</p>
                <h3 className="mt-2 text-xl font-black text-zinc-950">Retail pricing uses your real one-off dealer costs</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-700">This information is admin-only. Consumables are estimates for prep chemicals, pads, towels, tape, and coating application supplies; labor, overhead, card fees, and taxes are not included.</p>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  {ceramicCosts.map((operation) => {
                    const cost = operation.costBasis!;
                    return (
                      <article key={operation.key} className="rounded-2xl bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                          <p className="font-black text-zinc-950">{operation.squareName}</p>
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-800">${cost.estimatedDirectMaterials} est. materials</span>
                        </div>
                        <p className="mt-3 text-sm font-bold text-zinc-700">{cost.includedProducts}</p>
                        <p className="mt-2 text-xs leading-5 text-zinc-500">Products ${cost.includedProductCost} + estimated consumables ${cost.estimatedConsumables}. {cost.basis}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {operation.variations.map((variation) => (
                            <span key={variation.name} className="rounded-lg bg-zinc-100 px-2.5 py-1.5 text-xs font-black text-zinc-700">{variation.name} ${variation.price}</span>
                          ))}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            {actionable.length > 0 ? (
              <div className="mt-8 space-y-4">
                {actionable.map((operation) => (
                  <article key={operation.key} className="rounded-2xl border border-zinc-200 p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-lg font-black text-zinc-950">{operation.squareName}</p>
                        {operation.localName !== operation.squareName && <p className="mt-1 text-xs text-zinc-500">Website label: {operation.localName}</p>}
                      </div>
                      <span className={`w-fit rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest ${operation.action === 'create' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-900'}`}>{operation.action}</span>
                    </div>
                    <ul className="mt-4 grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
                      {operation.changes.map((change) => <li key={change} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {change}</li>)}
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {operation.variations.map((variation) => (
                        <span key={variation.name} className="rounded-xl bg-zinc-100 px-3 py-2 text-xs font-bold text-zinc-700">{variation.name} · ${variation.price} · {variation.durationMinutes} min</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-8 flex items-center gap-3 rounded-2xl bg-emerald-50 p-5 text-sm font-bold text-emerald-900">
                <CheckCircle2 className="h-5 w-5" /> The website and Square service catalog already match.
              </div>
            )}
          </section>
        )}

        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Current Square catalog</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-zinc-950">{services.length} live services</h2>
            </div>
          </div>

          {loading && <div className="flex items-center justify-center rounded-[2rem] bg-white p-20 text-zinc-500"><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Loading Square catalog…</div>}
          {!loading && !error && (
            <div className="grid gap-4 md:grid-cols-2">
              {services.map((service) => (
                <article key={service.id} className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-zinc-950">{service.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">{service.description || 'No Square description provided.'}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-800">Connected</span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {(service.variations || []).map((variation: any) => (
                      <span key={variation.id} className="rounded-xl bg-zinc-100 px-3 py-2 text-xs font-bold text-zinc-700">{variation.name || 'Option'} · ${variation.price || 0} · {Math.round((variation.duration || 0) / 60000)} min</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
