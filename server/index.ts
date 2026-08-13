import "dotenv/config";
import express from "express";
import { getSquareClient, getSquareLocationId } from "./services/square.ts";
import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import path from "path";
import fs from "fs";
import multer from "multer";
import nodemailer from "nodemailer";
import { SERVICES, CATEGORIES, VEHICLE_SIZES, SPECIALTY_SIZES, ADD_ONS, type Service } from "../shared/data/services.ts";
import { CITIES } from "../shared/data/cities.ts";
import { DEFAULT_SOCIAL_IMAGE, getBlogSeoDescription, getBlogSeoTitle, SITE_ORIGIN, STATIC_PAGE_SEO } from "../shared/data/seo.ts";
import { logToSystem, logSquareError, LogLevel } from "./services/errorLogger.ts";
import { blogStorageDescription, mutateBlogPosts, readBlogPosts, type StoredBlogPost } from "./services/blogStore.ts";

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 5, fields: 30, fieldSize: 100 * 1024 },
  fileFilter: (_req, file, callback) => {
    callback(null, file.mimetype.startsWith('image/'));
  }
});

const getSquareErrorMessage = (error: any, fallback: string) => {
  const detail = error?.errors?.[0]?.detail || error?.result?.errors?.[0]?.detail;
  return detail || error?.message || fallback;
};

const logSquareApiError = (label: string, error: any) => {
  const details = {
    statusCode: error?.statusCode,
    errors: error?.errors || error?.result?.errors,
    message: error?.message,
  };
  console.error(label, details);
};

const serviceDurationToMs = (duration: string | Record<string, string> | undefined): number => {
  const value = typeof duration === 'string'
    ? duration
    : duration?.car || (duration ? Object.values(duration)[0] : undefined) || '2 hours';
  const values = [...value.matchAll(/\d+(?:\.\d+)?/g)].map(match => Number(match[0]));
  const amount = values.length ? Math.max(...values) : 2;
  const normalized = value.toLowerCase();
  const minutes = normalized.includes('day')
    ? amount * 8 * 60
    : normalized.includes('hour') || normalized.includes(' hr')
      ? amount * 60
      : amount;
  return Math.max(15, Math.round(minutes)) * 60 * 1000;
};

const APP_URL = SITE_ORIGIN;
const SOCIAL_IMAGE = `${APP_URL}${DEFAULT_SOCIAL_IMAGE}`;

type RouteSeo = {
  title: string;
  description: string;
  canonicalPath: string;
  schema?: Record<string, any>;
  robots?: string;
  statusCode?: number;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const normalizePagePath = (pathName: string) => {
  const cleanPath = pathName.split('?')[0].split('#')[0] || '/';
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) return cleanPath.slice(0, -1);
  return cleanPath;
};

const businessSchema = () => ({
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "AutomotiveBusiness"],
  "name": "Bryan's Showroom Quality Mobile Detailing",
  "image": SOCIAL_IMAGE,
  "@id": `${APP_URL}/#business`,
  "url": `${APP_URL}/`,
  "telephone": "+1-712-305-6313",
  "email": "bryansmobiledetailing@gmail.com",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1907 Arlington Cir",
    "addressLocality": "Bellevue",
    "addressRegion": "NE",
    "postalCode": "68123",
    "addressCountry": "US"
  },
  "areaServed": CITIES.map(city => ({
    "@type": "City",
    "name": city.name
  })),
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "07:00",
    "closes": "19:00"
  }
});

const getServiceFaqSchema = (service: Service) => {
  const price = service.price.car || service.price.suv || service.price.rv || Object.values(service.price)[0];
  const priceLabel = service.pricingType === 'variable' ? `$${price}/ft` : `$${price}`;
  const duration = typeof service.duration === 'string'
    ? service.duration
    : service.duration.car || service.duration.rv || Object.values(service.duration)[0];
  const faq = [
    {
      question: `What is included in ${service.name}?`,
      answer: `${service.name} includes ${service.features.slice(0, 3).join(', ').toLowerCase()} and the steps explained on this page. Bryan confirms vehicle condition, size, and add-ons before the appointment is finalized.`
    },
    {
      question: `How long does ${service.name} take?`,
      answer: `Typical working time is ${duration}. Larger vehicles, heavy soil, pet hair, odor, oxidation, or extra add-ons can extend the appointment.`
    },
    {
      question: `How much does ${service.name} cost?`,
      answer: `${service.name} starts at ${priceLabel}. Final pricing depends on vehicle size, condition, selected add-ons, and whether extra restoration or specialty labor is needed.`
    },
    {
      question: 'Can this service be done mobile?',
      answer: 'Many services can be done mobile around Bellevue, Omaha, Papillion, La Vista, and Council Bluffs. Intensive services such as paint correction, ceramic coating, or heavy restoration may be better as a Bellevue drop-off.'
    }
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
};

const getRouteSeo = async (requestPath: string): Promise<RouteSeo> => {
  const pathName = normalizePagePath(requestPath);
  const serviceMatch = pathName.match(/^\/services\/([a-z0-9-]+)$/);
  const categoryMatch = pathName.match(/^\/services\/category\/([a-z0-9-]+)$/);
  const cityMatch = pathName.match(/^\/areas\/([a-z0-9-]+)$/);
  const blogMatch = pathName.match(/^\/blog\/([a-z0-9-]+)$/);

  if (serviceMatch) {
    const service = SERVICES.find(item => item.id === serviceMatch[1]);
    if (service) {
      return {
        title: service.seo.title,
        description: service.seo.description,
        canonicalPath: `/services/${service.id}`,
        schema: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "name": service.name,
              "description": service.longDescription,
              "url": `${APP_URL}/services/${service.id}`,
              "provider": businessSchema(),
              "areaServed": CITIES.map(city => city.name),
              "offers": {
                "@type": "Offer",
                "priceCurrency": "USD",
                "price": service.price.car || service.price.suv || Object.values(service.price)[0],
                "availability": "https://schema.org/InStock"
              }
            },
            getServiceFaqSchema(service)
          ]
        }
      };
    }
  }

  if (categoryMatch) {
    const category = CATEGORIES.find(item => item.slug === categoryMatch[1]);
    if (category) {
      return {
        title: category.seo?.title || `${category.name} | Bryan's Showroom Quality Mobile Detailing`,
        description: category.seo?.description || category.description,
        canonicalPath: `/services/category/${category.slug}`,
        schema: businessSchema()
      };
    }
  }

  if (cityMatch) {
    const city = CITIES.find(item => item.slug === cityMatch[1]);
    if (city) {
      return {
        title: city.seo.title,
        description: city.seo.description,
        canonicalPath: `/areas/${city.slug}`,
        schema: businessSchema()
      };
    }
  }

  if (blogMatch) {
    try {
      const post = (await readBlogPosts()).find(item => item.slug === blogMatch[1] && item.published);
      if (post) {
        return {
          title: getBlogSeoTitle(post.slug, post.title),
          description: getBlogSeoDescription(post.slug, post.excerpt),
          canonicalPath: `/blog/${post.slug}`,
          schema: {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.featuredImage || SOCIAL_IMAGE,
            "datePublished": post.createdAt,
            "dateModified": post.updatedAt,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Bryan's Showroom Quality Mobile Detailing",
              "url": APP_URL
            },
            "mainEntityOfPage": `${APP_URL}/blog/${post.slug}`
          }
        };
      }
    } catch (error) {
      console.error('Failed to load blog SEO metadata:', error);
    }
  }

  const staticSeo = STATIC_PAGE_SEO[pathName];
  if (staticSeo) {
    return {
      ...staticSeo,
      canonicalPath: staticSeo.canonicalPath || pathName,
      schema: businessSchema(),
    };
  }

  return {
    title: "Page Not Found | Bryan's Showroom Quality Mobile Detailing",
    description: "The requested page could not be found. Browse Bryan's auto detailing services or return to the homepage.",
    canonicalPath: pathName,
    schema: businessSchema(),
    robots: 'noindex,follow',
    statusCode: 404
  };
};

const injectRouteSeo = (html: string, seo: RouteSeo) => {
  const canonicalUrl = `${APP_URL}${seo.canonicalPath === '/' ? '/' : seo.canonicalPath}`;
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);
  const schema = JSON.stringify(seo.schema || businessSchema()).replace(/</g, '\\u003c');

  const injectedHtml = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/i, `<meta name="description" content="${description}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="twitter:url" content="[^"]*"\s*\/?>/i, `<meta property="twitter:url" content="${canonicalUrl}" />`)
    .replace(/<meta property="twitter:title" content="[^"]*"\s*\/?>/i, `<meta property="twitter:title" content="${title}" />`)
    .replace(/<meta property="twitter:description" content="[^"]*"\s*\/?>/i, `<meta property="twitter:description" content="${description}" />`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, `<script type="application/ld+json">${schema}</script>`);

  if (!seo.robots) return injectedHtml;

  const robotsTag = `<meta name="robots" content="${seo.robots}" />`;
  return /<meta name="robots" content="[^"]*"\s*\/?>/i.test(injectedHtml)
    ? injectedHtml.replace(/<meta name="robots" content="[^"]*"\s*\/?>/i, robotsTag)
    : injectedHtml.replace(/<\/head>/i, `    ${robotsTag}\n  </head>`);
};

async function startServer() {
  console.log("Starting server...");
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.set('trust proxy', 1);
  app.use(express.json({ limit: '1mb' }));
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://*.google-analytics.com https://analytics.google.com https://*.googletagmanager.com https://stats.g.doubleclick.net https://www.google.com https://api.open-meteo.com https://*.squareup.com https://*.squarecdn.com; frame-src https://www.google.com https://www.googletagmanager.com https://*.squareup.com https://*.squarecdn.com; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests"
    );
    next();
  });

  // BigInt serialization
  app.set('json replacer', (key: string, value: any) =>
    typeof value === 'bigint' ? value.toString() : value
  );

  // Redirects and Canonicalization Middleware
  app.use((req, res, next) => {
    const host = req.get('host') || '';
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const url = req.originalUrl || req.url;
    const requestPath = req.path.toLowerCase();
    const legacyRedirects: Record<string, string> = {
      '/home': '/',
      '/home/': '/',
      '/services-1': '/services',
      '/services-1/': '/services',
      '/appointments': '/book',
      '/appointments/': '/book',
      '/s/appointments': '/book',
      '/s/appointments/': '/book',
      '/booking': '/book',
      '/booking/': '/book',
      '/gallery/': '/gallery',
      '/exterior-wash-and-wax': '/services/exterior-enhancement',
      '/s/gift-cards': '/gift-cards',
      '/tractor-ceramic-coating': '/services/tractor-detailing-service',
      '/services/ceramic-coating': '/services/category/ceramic-coating',
      '/services/interior-detailing': '/services/category/interior-detailing',
      '/services/full-detail': '/services/category/full-detailing',
      '/services/paint-correction': '/services/category/paint-correction',
      '/services/exterior-only': '/services/exterior-enhancement',
      '/services/full-detailing': '/services/category/full-detailing',
      '/services/interior-only': '/services/interior-detail',
      '/services/maintenance': '/services/maintenance-detail',
      '/product/paint-correction/dtj56skdjjzlkx6vfwehttsq': '/services/category/paint-correction',
      '/product/exterior-protection/ztfv36ft57ejxi3h2hxlh4hu': '/services/category/exterior-detailing',
      '/shop/rv-detailing-services/da32pniiisvjwk7d5iudz4jw': '/services/category/rv-boat-detailing',
      '/blog/how-to-protect-new-car-paint': '/services/new-car-detail'
    };
    const legacyDestination = legacyRedirects[requestPath];
    
    // Skip redirects for local development
    if (host.includes('localhost') || host.includes('127.0.0.1') || host.includes('0.0.0.0')) {
      return next();
    }
    
    // Normalize host and protocol
    const isOldDomain = host.includes('bryansmobiledetailing.com') || host.includes('bryansdetailing.com');
    const isWww = host.startsWith('www.');
    const isHttp = protocol === 'http';
    
    // If it's old domain, has WWW, or is HTTP, redirect to canonical HTTPS URL
    if (isOldDomain || isWww || isHttp) {
      const canonicalHost = 'bryansdetailingomaha.com';
      const destination = legacyDestination || url;
      console.log(`[SEO Redirect] Redirecting from ${protocol}://${host}${url} to https://${canonicalHost}${destination}`);
      return res.redirect(301, `https://${canonicalHost}${destination}`);
    }

    if (legacyDestination) {
      console.log(`[SEO Redirect] Redirecting legacy route ${requestPath} to ${legacyDestination}`);
      return res.redirect(301, legacyDestination);
    }
    
    next();
  });

  const adminSessionSecret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD;
  // Firebase Hosting strips cookies from Cloud Run rewrites except for the
  // reserved __session cookie, so admin auth must use that name in production.
  const adminCookieName = '__session';
  const adminSessionDurationMs = 8 * 60 * 60 * 1000;
  const loginAttempts = new Map<string, { count: number; resetAt: number }>();
  const publicActionAttempts = new Map<string, { count: number; resetAt: number }>();

  const limitPublicAction = (maxAttempts: number, windowMs: number): express.RequestHandler => (req, res, next) => {
    const key = `${req.ip || req.socket.remoteAddress || 'unknown'}:${req.path}`;
    const now = Date.now();
    const current = publicActionAttempts.get(key);
    const active = current && current.resetAt > now ? current : { count: 0, resetAt: now + windowMs };
    if (active.count >= maxAttempts) {
      return res.status(429).json({ error: 'Too many requests. Please wait and try again.' });
    }
    publicActionAttempts.set(key, { ...active, count: active.count + 1 });
    next();
  };

  const parseCookies = (req: express.Request) =>
    Object.fromEntries(
      (req.headers.cookie || '')
        .split(';')
        .map(cookie => cookie.trim())
        .filter(Boolean)
        .map(cookie => {
          const separator = cookie.indexOf('=');
          const key = separator >= 0 ? cookie.slice(0, separator) : cookie;
          const value = separator >= 0 ? cookie.slice(separator + 1) : '';
          return [decodeURIComponent(key), decodeURIComponent(value)];
        })
    );

  const createAdminSession = () => {
    if (!adminSessionSecret) return '';
    const expiresAt = Date.now() + adminSessionDurationMs;
    const payload = Buffer.from(JSON.stringify({ expiresAt })).toString('base64url');
    const signature = createHmac('sha256', adminSessionSecret).update(payload).digest('base64url');
    return `${payload}.${signature}`;
  };

  const hasValidAdminSession = (req: express.Request) => {
    if (!adminSessionSecret) return false;
    const token = parseCookies(req)[adminCookieName];
    if (!token) return false;

    const [payload, suppliedSignature] = token.split('.');
    if (!payload || !suppliedSignature) return false;

    const expectedSignature = createHmac('sha256', adminSessionSecret).update(payload).digest('base64url');
    const supplied = Buffer.from(suppliedSignature);
    const expected = Buffer.from(expectedSignature);
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return false;

    try {
      const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { expiresAt?: number };
      return typeof session.expiresAt === 'number' && session.expiresAt > Date.now();
    } catch {
      return false;
    }
  };

  const requireAdmin: express.RequestHandler = (req, res, next) => {
    if (!hasValidAdminSession(req)) {
      return res.status(401).json({ error: 'Administrator authentication required' });
    }
    next();
  };

  app.post('/api/admin/verify-password', (req, res) => {
    const configuredPassword = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD;
    const submittedPassword = typeof req.body?.password === 'string' ? req.body.password : '';
    const clientKey = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const attempt = loginAttempts.get(clientKey);

    if (attempt && attempt.resetAt > now && attempt.count >= 5) {
      return res.status(429).json({ error: 'Too many login attempts. Please try again in 15 minutes.' });
    }

    if (!configuredPassword) {
      console.error('[Admin Auth] Missing ADMIN_PASSWORD environment variable');
      return res.status(503).json({ error: 'Admin login is not configured' });
    }

    const submittedBuffer = Buffer.from(submittedPassword);
    const configuredBuffer = Buffer.from(configuredPassword);
    const validPassword =
      submittedBuffer.length === configuredBuffer.length &&
      timingSafeEqual(submittedBuffer, configuredBuffer);

    if (!validPassword) {
      const activeAttempt = attempt && attempt.resetAt > now ? attempt : { count: 0, resetAt: now + 15 * 60 * 1000 };
      loginAttempts.set(clientKey, { ...activeAttempt, count: activeAttempt.count + 1 });
      return res.status(401).json({ error: 'Invalid administrator password' });
    }

    loginAttempts.delete(clientKey);
    const session = createAdminSession();
    if (!session) {
      return res.status(503).json({ error: 'Admin sessions are not configured' });
    }
    res.cookie(adminCookieName, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: adminSessionDurationMs,
    });
    return res.json({ ok: true });
  });

  app.get('/api/admin/session', (req, res) => {
    res.json({ authenticated: hasValidAdminSession(req) });
  });

  app.post('/api/admin/logout', (_req, res) => {
    res.clearCookie(adminCookieName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    res.json({ ok: true });
  });

  const normalizeBlogInput = (input: any, existing?: StoredBlogPost) => {
    const title = typeof input?.title === 'string' ? input.title.trim() : '';
    const slug = typeof input?.slug === 'string'
      ? input.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '')
      : '';
    const excerpt = typeof input?.excerpt === 'string' ? input.excerpt.trim() : '';
    const content = typeof input?.content === 'string' ? input.content.trim() : '';
    const author = typeof input?.author === 'string' && input.author.trim() ? input.author.trim() : 'Bryan';
    const category = typeof input?.category === 'string' && input.category.trim() ? input.category.trim() : 'Detailing Tips';
    const featuredImage = typeof input?.featuredImage === 'string' ? input.featuredImage.trim() : '';

    if (!title || title.length > 200) return { error: 'Title is required and must be 200 characters or fewer.' };
    if (!slug || slug.length > 200) return { error: 'A valid URL slug is required.' };
    if (!excerpt || excerpt.length > 600) return { error: 'Excerpt is required and must be 600 characters or fewer.' };
    if (!content || content.length > 250_000) return { error: 'Article content is required and must be under 250,000 characters.' };

    const now = new Date().toISOString();
    const post: StoredBlogPost = {
      id: existing?.id || randomUUID(),
      title,
      slug,
      excerpt,
      content,
      author: author.slice(0, 100),
      category: category.slice(0, 100),
      featuredImage: featuredImage.slice(0, 2_000),
      published: input?.published === true,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    return { post };
  };

  const sortBlogPosts = (posts: StoredBlogPost[]) =>
    [...posts].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  app.get('/api/blog/posts', async (_req, res) => {
    try {
      const posts = await readBlogPosts();
      res.json(sortBlogPosts(posts.filter(post => post.published)));
    } catch (error) {
      console.error('[Blog] Failed to read public posts:', error);
      res.status(500).json({ error: 'Blog posts are temporarily unavailable' });
    }
  });

  app.get('/api/blog/posts/:slug', async (req, res) => {
    try {
      const posts = await readBlogPosts();
      const post = posts.find(item => item.published && item.slug === req.params.slug);
      if (!post) return res.status(404).json({ error: 'Article not found' });
      res.json(post);
    } catch (error) {
      console.error('[Blog] Failed to read article:', error);
      res.status(500).json({ error: 'Article is temporarily unavailable' });
    }
  });

  app.use('/api/admin', requireAdmin);

  app.get('/api/admin/blog/posts', async (_req, res) => {
    try {
      res.json(sortBlogPosts(await readBlogPosts()));
    } catch (error) {
      console.error('[Blog Admin] Failed to list posts:', error);
      res.status(500).json({ error: 'Unable to load blog posts' });
    }
  });

  app.get('/api/admin/blog/storage', (_req, res) => {
    res.json({ storage: blogStorageDescription, persistent: Boolean(process.env.BLOG_STORAGE_BUCKET) });
  });

  app.post('/api/admin/blog/posts', async (req, res) => {
    const normalized = normalizeBlogInput(req.body);
    if ('error' in normalized) return res.status(400).json({ error: normalized.error });

    try {
      const created = await mutateBlogPosts(posts => {
        if (posts.some(post => post.slug === normalized.post.slug)) {
          throw Object.assign(new Error('An article with this slug already exists.'), { statusCode: 409 });
        }
        return { posts: [normalized.post, ...posts], result: normalized.post };
      });
      res.status(201).json(created);
    } catch (error: any) {
      console.error('[Blog Admin] Failed to create post:', error);
      res.status(error?.statusCode || 500).json({ error: error?.message || 'Unable to create article' });
    }
  });

  app.put('/api/admin/blog/posts/:id', async (req, res) => {
    try {
      const updated = await mutateBlogPosts(posts => {
        const index = posts.findIndex(post => post.id === req.params.id);
        if (index < 0) throw Object.assign(new Error('Article not found'), { statusCode: 404 });
        const normalized = normalizeBlogInput(req.body, posts[index]);
        if ('error' in normalized) throw Object.assign(new Error(normalized.error), { statusCode: 400 });
        if (posts.some((post, postIndex) => postIndex !== index && post.slug === normalized.post.slug)) {
          throw Object.assign(new Error('An article with this slug already exists.'), { statusCode: 409 });
        }
        const nextPosts = [...posts];
        nextPosts[index] = normalized.post;
        return { posts: nextPosts, result: normalized.post };
      });
      res.json(updated);
    } catch (error: any) {
      console.error('[Blog Admin] Failed to update post:', error);
      res.status(error?.statusCode || 500).json({ error: error?.message || 'Unable to update article' });
    }
  });

  app.delete('/api/admin/blog/posts/:id', async (req, res) => {
    try {
      await mutateBlogPosts(posts => {
        const nextPosts = posts.filter(post => post.id !== req.params.id);
        if (nextPosts.length === posts.length) throw Object.assign(new Error('Article not found'), { statusCode: 404 });
        return { posts: nextPosts, result: undefined };
      });
      res.status(204).end();
    } catch (error: any) {
      console.error('[Blog Admin] Failed to delete post:', error);
      res.status(error?.statusCode || 500).json({ error: error?.message || 'Unable to delete article' });
    }
  });

  // Helper to get Square Client from request headers
  const getClientFromReq = (req: express.Request) => {
    const token = req.path.startsWith('/api/admin/') ? req.headers['x-square-access-token'] as string : undefined;
    return getSquareClient(token);
  };

  const getLocFromReq = (req: express.Request) => {
    const loc = req.path.startsWith('/api/admin/') ? req.headers['x-square-location-id'] as string : undefined;
    return getSquareLocationId(loc);
  };

  // API Routes
  app.get("/api/admin/force-migrate", async (req, res) => {
    try {
      res.json({ status: "ok", count: 0, message: "Disabled as Firestore is no longer used for backend service syncing." });
    } catch (e: any) {
      res.status(500).json({ status: "error", error: e.message });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // SEO Routes
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(`User-agent: *\nAllow: /\nSitemap: https://bryansdetailingomaha.com/sitemap.xml`);
  });

  app.get("/sitemap.xml", async (req, res) => {
    const appUrl = 'https://bryansdetailingomaha.com';
    
    const staticUrls = [
      '',
      '/services',
      '/book',
      '/gallery',
      '/ceramic-coating',
      '/membership',
      '/gift-cards',
      '/faq',
      '/quote',
      '/blog'
    ];

    const serviceUrls = SERVICES.map(s => `/services/${s.id}`);
    const categoryUrls = CATEGORIES.map(c => `/services/category/${c.slug}`);
    const cityUrls = CITIES.map(c => `/areas/${c.slug}`);
    let blogUrls: string[] = [];
    try {
      blogUrls = (await readBlogPosts())
        .filter(post => post.published)
        .map(post => `/blog/${post.slug}`);
    } catch (error) {
      console.error('Failed to load blog URLs for sitemap:', error);
    }

    const allUrls = [...staticUrls, ...serviceUrls, ...categoryUrls, ...cityUrls, ...blogUrls];

    res.type("application/xml");
    
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(path => {
  let priority = '0.5';
  let freq = 'monthly';
  if (path === '') {
    priority = '1.0';
    freq = 'weekly';
  } else if (path === '/services') {
    priority = '0.9';
    freq = 'weekly';
  } else if (path.startsWith('/services/')) {
    priority = '0.8';
    freq = 'weekly';
  } else if (path.startsWith('/areas/')) {
    priority = '0.8';
    freq = 'weekly';
  } else if (path.startsWith('/blog/')) {
    priority = '0.7';
    freq = 'weekly';
  }
  return `  <url>
    <loc>${appUrl}${path}</loc>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n')}
</urlset>`;

    res.send(sitemapContent);
  });

  // Square Payment Processing
  app.post("/api/payments", requireAdmin, async (req, res) => {
    const { sourceId, amount, customerId, bookingId, paymentIntentId } = req.body;

    try {
      const client = getClientFromReq(req) as any;

      // Stage 1: Create "Payment Intent" (Square Order) if no sourceId provided
      if (!sourceId) {
        console.log(`💳 Creating Payment Intent for Customer: ${customerId}, Amount: ${amount}`);
        const orderResponse = await client.ordersApi.createOrder({
          idempotencyKey: randomUUID(),
          order: {
            locationId: getLocFromReq(req),
            customerId,
            lineItems: [
              {
                name: `Booking Payment ${bookingId || 'New'}`,
                quantity: '1',
                basePriceMoney: {
                  amount: BigInt(amount),
                  currency: 'USD',
                },
              },
            ],
          },
        });

        // Return the Order ID as the "client_secret"
        return res.json({ 
          client_secret: orderResponse.result?.order?.id || orderResponse.order?.id,
          id: orderResponse.result?.order?.id || orderResponse.order?.id
        });
      }

      // Stage 2: Process the actual payment
      const response = await client.paymentsApi.createPayment({
        sourceId,
        idempotencyKey: randomUUID(),
        amountMoney: {
          amount: BigInt(amount), // Amount in cents
          currency: 'USD',
        },
        customerId,
        orderId: paymentIntentId, // Link the payment to the "intent" (Order)
        note: `Payment for Booking ${bookingId}${paymentIntentId ? ` (Order: ${paymentIntentId})` : ''}`,
      });

      res.json(response.result?.payment || response.payment);
    } catch (error: any) {
      console.error("Square Payment Error:", error);
      res.status(500).json({ error: error.message || "Payment failed" });
    }
  });

  // Fetch Services from Square Catalog
  app.get("/api/catalog/debug", requireAdmin, async (req, res) => {
    try {
      const client = getClientFromReq(req) as any;
      const catalog = client.catalogApi;
      
      let objects: any[] = [];
      let cursor: string | undefined = undefined;
      
      do {
        const response: any = await catalog.listCatalog(cursor, 'ITEM');
        const resObjects = response.data || response.result?.objects || response.objects || [];
        objects = objects.concat(resObjects);
        cursor = response.response?.cursor || response.result?.cursor || response.cursor;
      } while (cursor);

      res.json(objects);
    } catch (e: any) {
      res.status(500).json({ error: e.message || String(e) });
    }
  });

  app.get("/api/catalog/services", async (req, res) => {
    try {
      const client = getClientFromReq(req) as any;
      const catalog = client.catalogApi;
      
      let objects: any[] = [];
      let cursor: string | undefined = undefined;
      
      do {
        const response: any = await catalog.listCatalog(cursor, 'ITEM');
        const resObjects = response.data || response.result?.objects || response.objects || [];
        objects = objects.concat(resObjects);
        cursor = response.response?.cursor || response.result?.cursor || response.cursor;
      } while (cursor);

      // Filter for items that are services and map them
      const serviceMap = new Map();
      
      objects
        .filter((obj: any) => obj.itemData?.variations?.some((v: any) => v.itemVariationData?.serviceDuration))
        .forEach((obj: any) => {
          const name = obj.itemData?.name;
          const version = obj.version ? BigInt(obj.version) : 0n;
          
          if (!serviceMap.has(name) || version > serviceMap.get(name).version) {
            serviceMap.set(name, {
              id: obj.id,
              name: obj.itemData?.name,
              description: obj.itemData?.description,
              categoryId: obj.itemData?.categoryId,
              version: version,
              variations: obj.itemData?.variations?.map((v: any) => ({
                id: v.id,
                name: v.itemVariationData?.name,
                duration: v.itemVariationData?.serviceDuration,
                price: v.itemVariationData?.priceMoney?.amount ? Number(v.itemVariationData.priceMoney.amount) / 100 : 0,
              }))
            });
          }
        });

      res.json(Array.from(serviceMap.values()));
    } catch (error: any) {
      console.error("Square Catalog Error:", error);
      res.json([]);
    }
  });

  // ─── Square Catalog Sync ───────────────────────────────────────────────────
  // POST /api/admin/sync-catalog
  // Upserts all services from services.ts into Square as bookable service items.
  // Safe to run multiple times — will NEVER create duplicates.
  // ────────────────────────────────────────────────────────────────────────────
  app.post('/api/admin/sync-catalog', async (req, res) => {
    const results: { name: string; action: 'created' | 'updated' | 'skipped'; id?: string; error?: string }[] = [];

    try {
      const client = getClientFromReq(req) as any;
      const locationId = getLocFromReq(req);

      // ── Step 1: Fetch all existing Square catalog items ───────────────────
      let existingObjects: any[] = [];
      let cursor: string | undefined;
      do {
        const resp: any = await client.catalogApi.listCatalog(cursor, 'ITEM');
        const objs = resp.data || resp.result?.objects || resp.objects || [];
        existingObjects = existingObjects.concat(objs);
        cursor = resp.response?.cursor || resp.result?.cursor || resp.cursor;
      } while (cursor);

      // Build name → existing item map (latest version wins)
      const existingByName = new Map<string, any>();
      for (const obj of existingObjects) {
        const name: string = obj.itemData?.name || '';
        const version = obj.version ? BigInt(obj.version) : 0n;
        const prev = existingByName.get(name);
        if (!prev || version > BigInt(prev.version || 0)) {
          existingByName.set(name, obj);
        }
      }

      // ── Step 2: Fetch team members for bookability ────────────────────────
      let teamMemberId: string | null = null;
      try {
        const teamResp: any = await client.teamApi.searchTeamMembers({ query: {} });
        const members = teamResp.teamMembers || teamResp.result?.teamMembers || [];
        if (members.length > 0) teamMemberId = members[0].id;
      } catch (e) {
        console.warn('Could not fetch team members — bookability will be skipped:', e);
      }

      // ── Step 3: Duration helper ───────────────────────────────────────────
      const durationToMs = serviceDurationToMs;

      // ── Step 4: Vehicle size labels ───────────────────────────────────────
      const VEHICLE_LABELS: Record<string, string> = {
        car: 'Car / Sedan',
        suv: 'SUV / Crossover',
        truck: 'Truck',
        largeSuv: 'Large SUV / Van',
        rv: 'RV / Boat (per foot)',
        tractor: 'Tractor / Equipment',
      };

      // ── Step 5: Build & upsert each service ───────────────────────────────
      for (const svc of SERVICES) {
        const squareName = svc.squareName || svc.name;

        try {
          const existing = existingByName.get(squareName);
          const durationMs = durationToMs(svc.duration);
          const priceObj = svc.price as Record<string, number>;

          // Build variations (one per vehicle size)
          const variations: any[] = Object.entries(priceObj)
            .filter(([, price]) => price > 0) // skip $0 (PPF inquiry)
            .map(([sizeKey, price]) => {
              const label = VEHICLE_LABELS[sizeKey] || sizeKey;
              const variationName = Object.keys(priceObj).length === 1 ? squareName : label;

              // If updating, find the matching existing variation to preserve its ID
              const existingVariation = existing?.itemData?.variations?.find(
                (v: any) => v.itemVariationData?.name === variationName
              );

              return {
                type: 'ITEM_VARIATION',
                id: existingVariation?.id || `#var-${svc.id}-${sizeKey}`,
                ...(existingVariation ? { version: existingVariation.version } : {}),
                itemVariationData: {
                  name: variationName,
                  pricingType: 'FIXED_PRICING',
                  priceMoney: {
                    amount: BigInt(Math.round(price * 100)),
                    currency: 'USD',
                  },
                  serviceDuration: durationMs,
                  availableForBooking: true,
                  // Link to location so it's bookable there
                  locationOverrides: locationId
                    ? [{ locationId, trackInventory: false }]
                    : undefined,
                },
              };
            });

          // For PPF (price = 0), create a single "Contact for Quote" variation
          if (variations.length === 0) {
            variations.push({
              type: 'ITEM_VARIATION',
              id: existing?.itemData?.variations?.[0]?.id || `#var-${svc.id}-quote`,
              ...(existing?.itemData?.variations?.[0] ? { version: existing.itemData.variations[0].version } : {}),
              itemVariationData: {
                name: 'Contact for Quote',
                pricingType: 'VARIABLE_PRICING',
                serviceDuration: durationToMs('2 hours'),
                availableForBooking: false,
              },
            });
          }

          const catalogObject: any = {
            type: 'ITEM',
            id: existing?.id || `#item-${svc.id}`,
            ...(existing ? { version: existing.version } : {}),
            itemData: {
              name: squareName,
              description: svc.shortDescription || svc.longDescription?.slice(0, 4096),
              variations,
              // Mark as a service (not a product)
              productType: 'APPOINTMENTS_SERVICE',
            },
          };

          const upsertResp: any = await client.catalogApi.upsertCatalogObject({
            idempotencyKey: randomUUID(),
            object: catalogObject,
          });

          const savedItem = upsertResp.catalogObject || upsertResp.result?.catalogObject;
          const savedId = savedItem?.id;

          // ── Step 6: Enable service for team member bookings ───────────────
          if (teamMemberId && savedId) {
            try {
              // Bookability is managed via Square Dashboard → Bookings settings.
              // The Square SDK does not expose upsertTeamMemberBookingProfile —
              // team member booking profiles are read-only via the API.
              console.log(`✅ Synced "${squareName}" (ID: ${savedId}). Enable bookability in Square Dashboard.`);
            } catch (bookErr: any) {
              console.warn(`Bookings note for "${squareName}":`, bookErr?.message || bookErr);
            }
          }


          results.push({
            name: squareName,
            action: existing ? 'updated' : 'created',
            id: savedId,
          });
        } catch (err: any) {
          console.error(`Sync error for "${squareName}":`, err);
          results.push({ name: squareName, action: 'skipped', error: err?.message || String(err) });
        }
      }

      const created = results.filter((r) => r.action === 'created').length;
      const updated = results.filter((r) => r.action === 'updated').length;
      const skipped = results.filter((r) => r.action === 'skipped').length;

      res.json({
        status: 'ok',
        summary: { created, updated, skipped, total: results.length },
        results,
      });
    } catch (fatal: any) {
      console.error('Catalog sync fatal error:', fatal);
      res.status(500).json({ status: 'error', error: fatal?.message || String(fatal) });
    }
  });

  // Square Availability API
  app.get("/api/availability", async (req, res) => {
    try {
      const { start, end, serviceVariationId, serviceVariationIds } = req.query;
      
      if (!start || !end) {
        return res.status(400).json({ error: "Start and end dates are required" });
      }

      const client = getClientFromReq(req) as any;
      const ids = serviceVariationIds ? (serviceVariationIds as string).split(',') : [(serviceVariationId as string) || "ANY_SERVICE_VARIATION_ID"];
      
      const response = await client.bookingsApi.searchAvailability({
        query: {
          filter: {
            startAtRange: {
              startAt: start as string,
              endAt: end as string,
            },
            locationId: getLocFromReq(req),
            segmentFilters: ids.map(id => ({
              serviceVariationId: id,
            }))
          }
        }
      });

      const availabilities = response.result?.availabilities || response.availabilities || [];
      res.json(availabilities);
    } catch (error: any) {
      logSquareApiError("Square Availability Error:", error);
      res.status(error.statusCode || 500).json({ error: getSquareErrorMessage(error, "Failed to fetch availability") });
    }
  });

  app.post("/api/bookings", limitPublicAction(10, 15 * 60 * 1000), async (req, res) => {
    try {
      const { startAt, locationId, serviceVariationIds, appointmentSegments, customer, serviceName, addons } = req.body;
      
      const client = getClientFromReq(req) as any;
      const resolvedLocationId = getLocFromReq(req);

      if (!startAt || !resolvedLocationId || !customer?.email || !customer?.firstName || !customer?.phone) {
        return res.status(400).json({ error: "Missing required booking details." });
      }

      if (!Array.isArray(serviceVariationIds) || serviceVariationIds.length === 0) {
        return res.status(400).json({ error: "A Square service variation is required to create a booking." });
      }

      if (serviceVariationIds.some((id: string) => !id || id.startsWith("local-") || id.includes("-var-"))) {
        return res.status(400).json({ error: "This service is not connected to a real Square service variation. Sync Square services before accepting online bookings." });
      }

      if (!Array.isArray(appointmentSegments) || appointmentSegments.length === 0) {
        return res.status(400).json({ error: "Please choose an available Square time slot before confirming your booking." });
      }

      const bookingSegments = appointmentSegments.map((segment: any) => ({
        durationMinutes: segment.durationMinutes,
        serviceVariationId: segment.serviceVariationId,
        serviceVariationVersion: segment.serviceVariationVersion ? BigInt(segment.serviceVariationVersion) : undefined,
        teamMemberId: segment.teamMemberId,
        anyTeamMember: segment.anyTeamMember,
        intermissionMinutes: segment.intermissionMinutes,
        resourceIds: segment.resourceIds,
      })).map((segment: any) => {
        Object.keys(segment).forEach(key => segment[key] === undefined && delete segment[key]);
        return segment;
      });

      if (bookingSegments.some((segment: any) => !segment.serviceVariationId || !segment.teamMemberId)) {
        return res.status(400).json({ error: "Square did not return a bookable team member for this slot. Please choose another time." });
      }

      // 1. Create or Find Customer
      let customerId;
      try {
        const searchResult = await client.customersApi.searchCustomers({
          query: {
            filter: {
              emailAddress: {
                exact: customer.email
              }
            }
          }
        });

        const customers = searchResult.result?.customers || searchResult.customers;
        if (customers && customers.length > 0) {
          customerId = customers[0].id;
        } else {
          const createResult = await client.customersApi.createCustomer({
            idempotencyKey: randomUUID(),
            givenName: customer.firstName,
            familyName: customer.lastName,
            emailAddress: customer.email,
            phoneNumber: customer.phone,
          });
          customerId = createResult.result?.customer?.id || createResult.customer?.id;
        }
      } catch (e: any) {
        console.error("Customer Error:", e);
        throw new Error(e.message || "Square customer creation failed");
      }

      // 2. Create Booking
      const customerNote = [
        customer.notes,
        customer.locationType ? `Service location: ${customer.locationType}` : "",
        customer.address ? `Address: ${customer.address}` : "",
        serviceName ? `Services: ${serviceName}` : "",
        Array.isArray(addons) && addons.length > 0 ? `Add-ons: ${addons.join(", ")}` : "",
      ].filter(Boolean).join("\n");

      const requiresDropOff =
        /odor elimination/i.test(String(serviceName || "")) ||
        (Array.isArray(addons) && addons.some((addon: unknown) => /ozone.*odor|odor.*ozone/i.test(String(addon))));
      if (requiresDropOff && customer.locationType !== "drop-off") {
        return res.status(400).json({ error: "Odor and ozone treatments must be booked as a Bellevue drop-off appointment." });
      }

      const bookingResult = await client.bookingsApi.createBooking({
        idempotencyKey: randomUUID(),
        booking: {
          startAt,
          locationId: resolvedLocationId,
          customerId,
          customerNote,
          appointmentSegments: bookingSegments,
        }
      });
      const booking = bookingResult.result?.booking || bookingResult.booking;

      if (!booking?.id) {
        throw new Error("Square did not return a booking ID.");
      }

      // 3. Send Confirmation Emails
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
          const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          const formattedDate = new Date(startAt).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: customer.email,
            bcc: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: "Booking Confirmed - Bryan's Showroom Quality Mobile Detailing",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #111;">Booking Confirmed!</h2>
                <p>Hi ${customer.firstName},</p>
                <p>I've received your booking for <strong>${formattedDate}</strong>.</p>
                <p>Payment will be collected upon completion of the service.</p>
                <p><strong>Appointment Details:</strong></p>
                <ul>
                  <li>Location: Bellevue / Omaha Metro</li>
                  <li>Time: ${formattedDate}</li>
                </ul>
                <p>If you have any questions, feel free to call us at (712) 305-6313.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #777;">Bryan's Showroom Quality Mobile Detailing</p>
              </div>
            `
          });
        } catch (emailErr) {
          console.error("Email Notification Error:", emailErr);
        }
      }

      res.json(booking);
    } catch (error: any) {
      logSquareApiError("Square Booking Error:", error);
      res.status(error.statusCode || 500).json({ error: getSquareErrorMessage(error, "Failed to create booking") });
    }
  });

  // ─── Review Request Email ──────────────────────────────────────────────────
  // Called after a booking is completed to ask the customer for a Google review
  app.post('/api/send-review-request', requireAdmin, async (req, res) => {
    const { firstName, email, serviceName } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const GOOGLE_REVIEW_URL =
      'https://search.google.com/local/writereview?placeid=ChIJVVU5ibSJk4cRCK2ex-dRYIg';

    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: `Bryan's Detailing <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `How did I do? — Bryan's Showroom Quality Mobile Detailing`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
            <div style="background: #18c972; padding: 32px 40px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 900; color: #000; letter-spacing: -0.04em;">How did I do?</h1>
              <p style="margin: 8px 0 0; color: #000; opacity: 0.7; font-weight: 600;">Bryan's Showroom Quality Mobile Detailing</p>
            </div>
            <div style="padding: 40px;">
              <p style="font-size: 16px; color: #e4e4e7; margin: 0 0 16px; line-height: 1.6;">
                Hi ${firstName || 'there'},
              </p>
              <p style="font-size: 16px; color: #e4e4e7; margin: 0 0 24px; line-height: 1.6;">
                I hope you're loving the results of your ${serviceName || 'recent detail'}! If you have 60 seconds, a Google review makes a huge difference for a small local business like mine — and helps other Omaha and Bellevue drivers find quality detailing.
              </p>
              <a href="${GOOGLE_REVIEW_URL}" style="display: inline-block; background: #18c972; color: #000; font-weight: 900; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; padding: 16px 32px; border-radius: 12px;">
                ⭐ Leave a Google Review
              </a>
              <p style="font-size: 13px; color: #71717a; margin: 32px 0 0; line-height: 1.6;">
                Takes less than 60 seconds. Your feedback helps more than you know.<br/>
                — Bryan
              </p>
              <hr style="border: none; border-top: 1px solid #27272a; margin: 32px 0;" />
              <p style="font-size: 11px; color: #52525b; margin: 0;">
                Bryan's Showroom Quality Mobile Detailing · 1907 Arlington Cir, Bellevue NE 68123 · (712) 305-6313
              </p>
            </div>
          </div>
        `,
      });

      res.json({ status: 'ok' });
    } catch (err: any) {
      console.error('Review email error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // ─── Abandoned Quote Follow-up Email ──────────────────────────────────────
  // Called when a customer starts a quote but doesn't book
  app.post('/api/send-quote-followup', requireAdmin, async (req, res) => {
    const { firstName, email, services, vehicleType } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: `Bryan's Detailing <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Still thinking about your detail? — Bryan's Showroom Quality Mobile Detailing`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
            <div style="background: #111; padding: 32px 40px; border-bottom: 1px solid #1a1a1a;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #fff; letter-spacing: -0.04em;">Still thinking about your detail?</h1>
            </div>
            <div style="padding: 40px;">
              <p style="font-size: 16px; color: #e4e4e7; margin: 0 0 16px; line-height: 1.6;">
                Hi ${firstName || 'there'},
              </p>
              <p style="font-size: 16px; color: #e4e4e7; margin: 0 0 8px; line-height: 1.6;">
              You started a quote for your ${vehicleType || 'vehicle'} — I wanted to follow up in case you still have questions about the service or next steps.
              </p>
              ${services?.length ? `<p style="font-size: 14px; color: #a1a1aa; margin: 0 0 24px;">Services you were interested in: <strong style="color: #fff;">${services.join(', ')}</strong></p>` : ''}
              <a href="https://bryansdetailingomaha.com/book" style="display: inline-block; background: #18c972; color: #000; font-weight: 900; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; padding: 16px 32px; border-radius: 12px;">
                Book My Detail →
              </a>
              <p style="font-size: 13px; color: #71717a; margin: 32px 0 0; line-height: 1.6;">
                Have questions? Reply to this email or call/text me directly at <a href="tel:7123056313" style="color: #18c972;">(712) 305-6313</a>.<br/>
                — Bryan
              </p>
              <hr style="border: none; border-top: 1px solid #27272a; margin: 32px 0;" />
              <p style="font-size: 11px; color: #52525b; margin: 0;">
                Bryan's Showroom Quality Mobile Detailing · Bellevue, NE · <a href="https://bryansdetailingomaha.com/unsubscribe" style="color: #52525b;">Unsubscribe</a>
              </p>
            </div>
          </div>
        `,
      });

      res.json({ status: 'ok' });
    } catch (err: any) {
      console.error('Quote follow-up email error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Admin Sync Endpoint - Robust Idempotent Upsert
  app.post("/api/admin/sync-square", async (req, res) => {
    try {

      const client = getClientFromReq(req) as any;
      const { catalog, teamMembers } = client;
      
      console.log('🚀 Starting Square Sync (Idempotent Mode)...');

      // 1. Fetch existing catalog to map names to IDs (prevents duplicates)
      let allObjects: any[] = [];
      let cursor: string | undefined = undefined;
      do {
        const response: any = await catalog.listCatalog(cursor);
        const objects = response.data || response.result?.objects || response.objects || [];
        allObjects = allObjects.concat(objects);
        cursor = response.response?.cursor || response.result?.cursor || response.cursor;
      } while (cursor);
      
      const normalize = (name: string) => {
        return name.toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .trim();
      };
      
      const existingItemsByNorm = new Map<string, any>();
      for (const obj of allObjects) {
        if (obj.isDeleted || obj.type !== 'ITEM') continue;
        existingItemsByNorm.set(normalize(obj.itemData.name), obj);
      }

      // Check for team members for availability
      const teamMemberIds: string[] = [];
      try {
        const teamResult = await teamMembers.search({ query: { filter: { status: 'ACTIVE' } } });
        teamMemberIds.push(...(teamResult.teamMembers?.map((tm: any) => tm.id) || []));
      } catch (e) {
        console.warn("Team member fetch skipped:", e);
      }

      const syncTimestamp = Date.now();

      // Sync categories first
      const categoryIdMap: Record<string, string> = {};
      for (const cat of CATEGORIES) {
        try {
          const catNorm = normalize(cat.name);
          const existingCat = allObjects.find(obj => obj.type === 'CATEGORY' && normalize(obj.categoryData.name) === catNorm);
          
          const upsertRes: any = await catalog.object.upsert({
            idempotencyKey: `cat-${cat.id}-${syncTimestamp}`,
            object: {
              type: 'CATEGORY',
              id: existingCat?.id || `#${cat.id}`,
              version: existingCat?.version,
              categoryData: { name: cat.name },
            }
          });
          const finalId = upsertRes.result?.catalogObject?.id || upsertRes.catalogObject?.id;
          console.log(`Synced category ${cat.name} -> ${finalId}`);
          if (finalId) categoryIdMap[cat.id] = finalId;
        } catch (catError: any) {
          console.error(`Error syncing category ${cat.name}:`, catError);
        }
      }

      let syncedCount = 0;
      const allItems = [...SERVICES, ...ADD_ONS.map(a => ({ ...a, categoryId: 'add-ons', isAddon: true }))];
      const syncedItemIds = new Set<string>();

      for (const item of allItems as any[]) {
        try {
          const norm = normalize(item.name);
          const existing = existingItemsByNorm.get(norm);
          
          // Calculate duration logic
          const durationMinutes = serviceDurationToMs(item.duration) / (60 * 1000);

          const getVarId = (varName: string, fallback: string) => {
            if (!existing?.itemData?.variations) return fallback;
            const match = existing.itemData.variations.find((v: any) => v.itemVariationData?.name === varName);
            return match ? match.id : fallback;
          };
          
          const getVarVersion = (varName: string) => {
            if (!existing?.itemData?.variations) return undefined;
            const match = existing.itemData.variations.find((v: any) => v.itemVariationData?.name === varName);
            return match ? match.version : undefined;
          };

          const variations = item.isAddon ? [{
            type: 'ITEM_VARIATION',
            id: getVarId('Standard', `#var-${item.id}`),
            version: getVarVersion('Standard'),
            itemVariationData: {
              itemId: existing?.id,
              name: 'Standard',
              pricingType: 'FIXED_PRICING',
              serviceDuration: BigInt(durationMinutes * 60 * 1000),
              availableForBooking: true,
              priceMoney: {
                amount: BigInt(item.price * 100),
                currency: 'USD',
              },
              ...(teamMemberIds.length > 0 ? { teamMemberIds } : {}),
            },
          }] : (item.isSpecialty ? SPECIALTY_SIZES : VEHICLE_SIZES).map(size => {
            const price = item.price[size.id];
            if (price === undefined) return null;
            return {
              type: 'ITEM_VARIATION',
              id: getVarId(size.name, `#var-${item.id}-${size.id}`),
              version: getVarVersion(size.name),
              itemVariationData: {
                itemId: existing?.id,
                name: size.name,
                pricingType: 'FIXED_PRICING',
                serviceDuration: BigInt(durationMinutes * 60 * 1000),
                availableForBooking: true,
                priceMoney: {
                  amount: BigInt(price * 100),
                  currency: 'USD',
                },
                ...(teamMemberIds.length > 0 ? { teamMemberIds } : {}),
              },
            };
          }).filter(Boolean);

          const upsertRes: any = await catalog.object.upsert({
            idempotencyKey: `item-${item.id}-${syncTimestamp}`,
            object: {
              type: 'ITEM',
              id: existing?.id || `#${item.id}`,
              version: existing?.version,
              itemData: {
                name: item.name,
                description: item.longDescription || item.shortDescription || item.description || '',
                categoryId: categoryIdMap[item.categoryId],
                productType: 'APPOINTMENTS_SERVICE',
                variations: variations as any,
              },
            },
          });

          const finalId = upsertRes.result?.catalogObject?.id || upsertRes.catalogObject?.id;
          console.log(`Synced item ${item.name} -> ${finalId}`);
          if (finalId) syncedItemIds.add(finalId);
          syncedCount++;
        } catch (itemError: any) {
           console.error(`Error syncing item ${item.name}:`, itemError.message || itemError);
        }
      }

      // 4. PRUNING: Delete items in Square that are NOT in our local synced set
      const toDeleteIds: string[] = [];
      for (const obj of allObjects) {
        if (obj.type === 'ITEM' && !obj.isDeleted && !syncedItemIds.has(obj.id)) {
          // Extra safety: only delete if it looks like a detailing service or category match
          // (Actually, user explicitly asked to delete what doesn't match the website)
          toDeleteIds.push(obj.id);
        }
      }

      if (toDeleteIds.length > 0) {
        console.log(`🗑️ Pruning ${toDeleteIds.length} extra items from Square...`);
        // Use batchDelete (limit 200 per call, we probably have less)
        await catalog.batchDelete({ objectIds: toDeleteIds });
      }

      // 5. Removed Firestore Master Sync. Local codebase is the only source.
      let masterSyncMsg = "";

      res.json({ 
        success: true, 
        message: `Sync & Prune Complete. Updated ${syncedCount} items, Removed ${toDeleteIds.length} extras.${masterSyncMsg}` 
      });
      
      await logToSystem({
        level: LogLevel.INFO,
        source: 'SquareSync',
        message: 'Manual Square Sync completed successfully',
        details: { syncedCount, prunedCount: toDeleteIds.length, masterSyncMsg }
      });
    } catch (error: any) {
      console.error("Sync Error:", error);
      await logSquareError('SquareSync', 'Manual Square Sync failed', error);
      res.status(500).json({ 
        error: "Square Synchronization failed. Please check your Access Token and Location ID in the Setup Wizard.",
        details: error.message 
      });
    }
  });
  app.post("/api/admin/remove-all-duplicates", async (req, res) => {
    try {
      const client = getClientFromReq(req) as any;
      const { catalog } = client;
      console.log('🧹 Nuclear Cleanup: Identifying all duplicates...');

      let allObjects: any[] = [];
      let cursor: string | undefined = undefined;
      do {
        const response: any = await catalog.listCatalog(cursor, 'CATEGORY,ITEM');
        const objects = response.data || response.result?.objects || response.objects || [];
        allObjects = allObjects.concat(objects);
        cursor = response.response?.cursor || response.result?.cursor || response.cursor;
      } while (cursor);
      
      const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
      const itemGroups = new Map<string, any[]>();
      const catGroups = new Map<string, any[]>();

      for (const obj of allObjects) {
        if (obj.isDeleted) continue;
        const name = (obj.type === 'CATEGORY' ? obj.categoryData?.name : obj.itemData?.name || "");
        if (!name) continue;
        const norm = normalize(name);

        const group = obj.type === 'CATEGORY' ? catGroups : itemGroups;
        if (!group.has(norm)) group.set(norm, []);
        group.get(norm)!.push(obj);
      }

      const toDelete: string[] = [];
      
      // Process items
      for (const [name, items] of itemGroups.entries()) {
        if (items.length > 1) {
          items.sort((a,b) => Number((BigInt(b.version || 0) - BigInt(a.version || 0)).toString()));
          const redundant = items.slice(1).map(i => i.id);
          toDelete.push(...redundant);
        }
      }
      
      for (const [name, cats] of catGroups.entries()) {
        if (cats.length > 1) {
          cats.sort((a,b) => Number((BigInt(b.version || 0) - BigInt(a.version || 0)).toString()));
          const redundant = cats.slice(1).map(c => c.id);
          toDelete.push(...redundant);
        }
      }

      if (toDelete.length > 0) {
        const uniqueDels = [...new Set(toDelete)];
        for (let i = 0; i < uniqueDels.length; i += 200) {
          await catalog.batchDelete({ objectIds: uniqueDels.slice(i, i + 200) });
        }
        res.json({ success: true, message: `Cleanup Successful. Merged ${uniqueDels.length} duplicates.` });
      } else {
        res.json({ success: true, message: "No duplicates found." });
      }
    } catch (error: any) {
      console.error("Cleanup Error:", error);
      res.status(500).json({ error: error.message || "Cleanup failed" });
    }
  });

  // --- NEW MASTER SERVICE CRUD ---

  // List all services from Master DB
  app.get("/api/admin/services", async (req, res) => {
    try {
      // Return static services since we removed Firestore Admin duties
      res.json(SERVICES);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Square Webhook Concierge
  app.post("/api/square/webhook", async (req, res) => {
    const { type, data } = req.body;
    
    // Acknowledgement immediately (Square requirements)
    res.status(200).send("OK");

    if (type === 'catalog.version.updated') {
      console.log('🔔 Square Catalog Change Detected. Server auto-correction is currently disabled.');
    }
  });

  app.post("/api/admin/cleanup-duplicates", async (req, res) => {
    try {
      const client = getClientFromReq(req) as any;
      const { catalog } = client;
      console.log('🧹 Nuclear Catalog Flush...');

      let objects: any[] = [];
      let cursor: string | undefined = undefined;
      do {
        const response: any = await catalog.listCatalog(cursor, 'CATEGORY,ITEM');
        const resObjects = response.data || response.result?.objects || response.objects || [];
        objects = objects.concat(resObjects);
        cursor = response.response?.cursor || response.result?.cursor || response.cursor;
      } while (cursor);
      
      const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
      const currentNames = new Set([
        ...SERVICES.map(s => normalize(s.name)),
        ...CATEGORIES.map(c => normalize(c.name)),
        ...ADD_ONS.map(a => normalize(a.name))
      ]);

      const toDelete: string[] = [];
      for (const obj of objects) {
        if (obj.isDeleted) continue;
        const name = normalize((obj.type === 'CATEGORY' ? obj.categoryData?.name : obj.itemData?.name) || "");
        if (!name) continue;
        
        // If it's a detail related but not in our official list, trash it
        if (!currentNames.has(name)) {
          const isRelated = ['detail', 'wash', 'wax', 'ceramic', 'paint', 'interior', 'exterior', 'rv', 'boat'].some(p => name.includes(p));
          if (isRelated) toDelete.push(obj.id);
        }
      }

      if (toDelete.length > 0) {
        for (let i = 0; i < toDelete.length; i += 200) {
          await catalog.batchDelete({ objectIds: toDelete.slice(i, i + 200) });
        }
      }

      res.json({ success: true, message: `Flushed ${toDelete.length} items.` });
    } catch (error: any) {
      console.error("Flush Error:", error);
      res.status(500).json({ error: error.message || "Flush failed" });
    }
  });

  // Instant Quote Endpoint
  app.post("/api/quote", limitPublicAction(5, 60 * 60 * 1000), upload.array("photos", 5), async (req, res) => {
    try {
      const { name, email, phone, vehicleYear, vehicleSize, year, make, model, type, condition, services, addons, expectation, estimatedRange } = req.body;
      const files = req.files as Express.Multer.File[];

      if (typeof name !== 'string' || name.trim().length < 2 || name.length > 100 ||
          typeof phone !== 'string' || phone.trim().length < 7 || phone.length > 30 ||
          (email && (typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))) {
        return res.status(400).json({ error: 'Please provide a valid name, phone number, and email address.' });
      }

      const parseSelection = (value: unknown): string[] => {
        if (Array.isArray(value)) return value.filter(item => typeof item === 'string').slice(0, 20);
        if (typeof value !== 'string') return [];
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed.filter(item => typeof item === 'string').slice(0, 20) : [];
        } catch {
          return [value.slice(0, 200)];
        }
      };
      const selectedServices = parseSelection(services);
      const selectedAddons = parseSelection(addons);
      const safeName = escapeHtml(name.trim());
      const safeEmail = escapeHtml(typeof email === 'string' ? email.trim() : 'Not provided');
      const safePhone = escapeHtml(phone.trim());
      const safeVehicle = escapeHtml([vehicleYear || year, make, model, vehicleSize || type].filter(Boolean).join(' ') || 'Not specified');
      const safeCondition = escapeHtml(typeof condition === 'string' ? condition.slice(0, 100) : 'Not specified');
      const safeExpectation = escapeHtml(typeof expectation === 'string' ? expectation.slice(0, 100) : 'Not specified');
      const safeRange = escapeHtml(typeof estimatedRange === 'string' ? estimatedRange.slice(0, 50) : 'Not calculated');

      console.log(`New quote request received from ${safeName}`);

      // Configure email transporter
      // Note: User needs to provide these in Secrets
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const emailContent = `
        <h2>New Instant Quote Request</h2>
        <p><strong>Customer Details:</strong></p>
        <ul>
          <li>Name: ${safeName}</li>
          <li>Email: ${safeEmail}</li>
          <li>Phone: ${safePhone}</li>
        </ul>
        <p><strong>Vehicle Details:</strong></p>
        <ul>
          <li>Vehicle: ${safeVehicle}</li>
          <li>Condition: ${safeCondition}</li>
          <li>Customer priority: ${safeExpectation}</li>
          <li>Preliminary range: $${safeRange}</li>
        </ul>
        <p><strong>Services Requested:</strong></p>
        <p>${selectedServices.map(escapeHtml).join(', ') || 'None specified'}</p>
        <p><strong>Add-ons:</strong> ${selectedAddons.map(escapeHtml).join(', ') || 'None selected'}</p>
        <p><em>Disclaimer: This is an estimate. Final price may vary upon physical inspection.</em></p>
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `New Quote Request: ${name.trim().replace(/[\r\n]/g, ' ')} - ${[vehicleYear || year, vehicleSize || type].filter(Boolean).join(' ')}`,
        html: emailContent,
        attachments: files?.map(file => ({
          filename: file.originalname,
          content: file.buffer
        }))
      };

      // Only attempt to send if credentials are provided
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Quote request sent successfully" });
      } else {
        console.warn("⚠️ Email credentials missing. Quote received but not sent.");
        res.status(503).json({ error: 'Quote email is temporarily unavailable. Please text or call (712) 305-6313.' });
      }
    } catch (error: any) {
      console.error("Quote Submission Error:", error);
      res.status(500).json({ error: error.message || "Failed to submit quote request" });
    }
  });

  // Google Places Reviews Endpoint
  app.get("/api/reviews", async (req, res) => {
    try {
      let apiKey = (process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY) as string;

      if (apiKey) {
        apiKey = apiKey.trim();
      }

      let placeId = process.env.GOOGLE_PLACE_ID as string;
      
      if (placeId) {
         placeId = placeId.trim();
      } else {
         placeId = 'ChIJVVU5ibSJk4cRCK2ex-dRYIg'; // Fallback to Bryan's Showroom Quality Mobile Detailing
      }

      if (!apiKey || !placeId || placeId === 'undefined' || apiKey === 'undefined' || placeId === 'null' || apiKey === 'null') {
        return res.json({ 
          success: false, 
          message: "Google Maps API Key and Place ID must be configured in Admin Setup Wizard",
          reviews: [] 
        });
      }

      // Use Places API (New) which supports API keys with HTTP Referrer restrictions
      // We pass the origin/referer from the client to the Google API
      const referer = req.get('origin') || req.get('referer') || 'https://bryansdetailingomaha.com';
      
      const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?fields=reviews`, {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'Referer': referer
        }
      });

      const data = await response.json().catch(() => ({}));
      
      if (!response.ok || data.error) {
        const errorData = data.error || {};
        let message = `Google Places API error: ${errorData.status || errorData.code || response.statusText}`;
        console.warn(message, errorData.message || response.status);
        return res.json({ 
          success: false, 
          message: errorData.message || message,
          reviews: [] // Frontend will fall back
        });
      }

      // Map Google reviews to our format
      const reviews = (data.reviews || []).map((review: any, index: number) => ({
        id: index + 1,
        name: review.authorAttribution?.displayName || "Customer",
        role: "Google Review",
        content: review.text?.text || review.originalText?.text || "",
        rating: review.rating || 5,
        image: review.authorAttribution?.photoUri || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.authorAttribution?.displayName || 'Customer')}&background=random`
      }));

      res.json({ success: true, reviews });
    } catch (error: any) {
      console.error("Google Reviews Error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch reviews" });
    }
  });

  // Admin Logs Endpoint
  app.get("/api/admin/logs", async (req, res) => {
    try {
      // Mock logs response since Firestore logs are disabled
      res.json([]);
    } catch (error: any) {
      console.error("Failed to fetch logs:", error);
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Initializing Vite dev server...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    console.log("Vite dev server initialized.");
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    // Do not let Express redirect page routes that share a name with an asset
    // directory (notably /gallery) to a trailing-slash URL.
    app.use(express.static(distPath, { redirect: false }));
    app.get("*", async (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      try {
        const html = await fs.promises.readFile(indexPath, "utf8");
        const seo = await getRouteSeo(req.path);
        res.status(seo.statusCode || 200).type("html").send(injectRouteSeo(html, seo));
      } catch (error) {
        console.error("Failed to read index.html for SEO injection:", error);
        res.sendFile(indexPath);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
