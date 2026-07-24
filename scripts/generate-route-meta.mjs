import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { CITIES } from '../shared/data/cities.ts';
import { CATEGORIES, SERVICES } from '../shared/data/services.ts';
import {
  STATIC_PAGE_SEO,
  getBlogSeoDescription,
  getBlogSeoTitle,
} from '../shared/data/seo.ts';

const SITE_ORIGIN = 'https://bryansdetailingomaha.com';
const DIST_DIR = join(process.cwd(), 'dist');
const BLOG_API_URL = 'https://bryans-detailing-api.bryansmobiledetailing.workers.dev/api/blog/posts';
const DEFAULT_IMAGE = '/20211009_025807-COLLAGE.jpg';

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const routeUrl = (path) => `${SITE_ORIGIN}${path === '/' ? '/' : path}`;

function listMarkup(items) {
  if (!items?.length) return '';
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function linkListMarkup(items) {
  if (!items?.length) return '';
  return `<ul>${items.map((item) => (
    `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`
  )).join('')}</ul>`;
}

function fallbackMarkup({ heading, description, details = '', links = [] }) {
  return [
    '<main data-static-route-content="true">',
    `  <h1>${escapeHtml(heading)}</h1>`,
    `  <p>${escapeHtml(description)}</p>`,
    details ? `  ${details}` : '',
    links.length ? `  <nav aria-label="Related pages">${linkListMarkup(links)}</nav>` : '',
    '</main>',
  ].filter(Boolean).join('\n');
}

function staticHeading(path, title) {
  const headings = {
    '/': 'Auto Detailing in Bellevue & Omaha',
    '/services': 'Auto Detailing Services & Pricing',
    '/book': 'Book Your Auto Detail',
    '/gallery': 'Auto Detailing Before & After Gallery',
    '/ceramic-coating': 'Professional Ceramic Coating in Omaha & Bellevue',
    '/membership': 'Car Care Membership Plans',
    '/gift-cards': 'Auto Detailing Gift Cards',
    '/faq': 'Auto Detailing Frequently Asked Questions',
    '/quote': 'Request an Auto Detailing Quote',
    '/blog': 'Auto Detailing Tips & Guides',
  };
  return headings[path] || title.split('|')[0].trim();
}

function buildStaticRoutes() {
  const routes = new Map();
  const categoryLinks = CATEGORIES.map((category) => ({
    href: `/services/category/${category.slug}`,
    label: category.name,
  }));

  for (const [path, seo] of Object.entries(STATIC_PAGE_SEO)) {
    let details = '';
    let links = [];

    if (path === '/' || path === '/services') {
      details = `<h2>Detailing services</h2>${linkListMarkup(categoryLinks)}`;
      links = CITIES.filter((city) => city.type === 'primary').map((city) => ({
        href: `/areas/${city.slug}`,
        label: `Auto detailing in ${city.name}`,
      }));
    } else if (path === '/book') {
      details = `<h2>Available packages</h2>${linkListMarkup(SERVICES.map((service) => ({
        href: `/services/${service.id}`,
        label: service.name,
      })))}`;
    } else if (path === '/ceramic-coating') {
      const coatingServices = SERVICES.filter((service) => service.categoryId === 'protection');
      details = `<h2>Ceramic protection options</h2>${linkListMarkup(coatingServices.map((service) => ({
        href: `/services/${service.id}`,
        label: service.name,
      })))}`;
    } else if (path === '/gallery') {
      links = categoryLinks;
    }

    routes.set(path, {
      path,
      title: seo.title,
      description: seo.description,
      canonicalPath: seo.canonicalPath,
      robots: seo.robots,
      imagePath: seo.imagePath || DEFAULT_IMAGE,
      fallback: fallbackMarkup({
        heading: staticHeading(path, seo.title),
        description: seo.description,
        details,
        links,
      }),
    });
  }

  for (const category of CATEGORIES) {
    const path = `/services/category/${category.slug}`;
    const categoryServices = SERVICES.filter((service) => service.categoryId === category.id);
    routes.set(path, {
      path,
      title: category.seo?.title || `${category.name} | Bryan's Showroom Quality Mobile Detailing`,
      description: category.seo?.description || category.description,
      imagePath: category.image || DEFAULT_IMAGE,
      fallback: fallbackMarkup({
        heading: category.name,
        description: category.description,
        details: `<h2>Available ${escapeHtml(category.name)} services</h2>${linkListMarkup(categoryServices.map((service) => ({
          href: `/services/${service.id}`,
          label: service.name,
        })))}`,
        links: [{ href: '/book', label: 'Book auto detailing' }],
      }),
    });
  }

  for (const service of SERVICES) {
    const path = `/services/${service.id}`;
    const prices = Object.values(service.price).filter((price) => Number.isFinite(price) && price > 0);
    const priceText = service.pricingType === 'custom' || prices.length === 0
      ? 'Custom quote based on vehicle size and condition.'
      : `Pricing starts at $${Math.min(...prices)}.`;
    routes.set(path, {
      path,
      title: service.seo.title,
      description: service.seo.description,
      imagePath: service.image || DEFAULT_IMAGE,
      fallback: fallbackMarkup({
        heading: service.name,
        description: service.longDescription,
        details: [
          `<p>${escapeHtml(priceText)}</p>`,
          service.bestFor ? `<p><strong>Best for:</strong> ${escapeHtml(service.bestFor)}</p>` : '',
          `<h2>What is included</h2>${listMarkup(service.features)}`,
        ].filter(Boolean).join(''),
        links: [
          { href: `/services/category/${CATEGORIES.find((category) => category.id === service.categoryId)?.slug || ''}`, label: 'Compare related services' },
          { href: `/book?serviceId=${service.id}`, label: `Book ${service.name}` },
        ],
      }),
    });
  }

  for (const city of CITIES) {
    const path = `/areas/${city.slug}`;
    routes.set(path, {
      path,
      title: city.seo.title,
      description: city.seo.description,
      imagePath: DEFAULT_IMAGE,
      fallback: fallbackMarkup({
        heading: city.content.title,
        description: city.content.intro,
        details: `<h2>${escapeHtml(city.content.whyLabel)}</h2>${listMarkup(city.content.whyPoints)}`,
        links: categoryLinks,
      }),
    });
  }

  return routes;
}

async function loadBlogRoutes() {
  try {
    const response = await fetch(BLOG_API_URL, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new Error(`Blog API returned ${response.status}`);
    const posts = await response.json();
    if (!Array.isArray(posts)) throw new Error('Blog API did not return an array');

    return posts
      .filter((post) => post?.published !== false && typeof post?.slug === 'string' && /^[a-z0-9-]+$/.test(post.slug))
      .map((post) => {
        const title = typeof post.title === 'string' ? post.title : 'Auto Detailing Guide';
        const excerpt = typeof post.excerpt === 'string' ? post.excerpt : 'Practical auto detailing advice from Bryan.';
        const path = `/blog/${post.slug}`;
        return {
          path,
          title: getBlogSeoTitle(post.slug, title),
          description: getBlogSeoDescription(post.slug, excerpt),
          imagePath: typeof post.featuredImage === 'string' && post.featuredImage ? post.featuredImage : DEFAULT_IMAGE,
          fallback: fallbackMarkup({
            heading: title,
            description: excerpt,
            links: [
              { href: '/blog', label: 'More auto detailing guides' },
              { href: '/services', label: 'View detailing services' },
            ],
          }),
        };
      });
  } catch (error) {
    console.warn(`Skipped blog route metadata: ${error instanceof Error ? error.message : error}`);
    return [];
  }
}

function replaceManagedTag(html, matcher, replacement) {
  if (!matcher.test(html)) {
    throw new Error(`Could not find managed metadata tag: ${matcher}`);
  }
  return html.replace(matcher, replacement);
}

function renderRouteHtml(template, route) {
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const canonical = routeUrl(route.canonicalPath || route.path);
  const image = route.imagePath.startsWith('http') ? route.imagePath : `${SITE_ORIGIN}${route.imagePath}`;
  let html = template.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);

  html = replaceManagedTag(
    html,
    /<meta(?=[^>]*data-rh="true")(?=[^>]*name="description")[^>]*>/i,
    `<meta data-rh="true" name="description" content="${description}" />`,
  );
  html = replaceManagedTag(
    html,
    /<link(?=[^>]*data-rh="true")(?=[^>]*rel="canonical")[^>]*>/i,
    `<link data-rh="true" rel="canonical" href="${canonical}" />`,
  );

  const socialValues = {
    'og:url': canonical,
    'og:title': route.title,
    'og:description': route.description,
    'og:image': image,
    'twitter:url': canonical,
    'twitter:title': route.title,
    'twitter:description': route.description,
    'twitter:image': image,
  };

  for (const [property, content] of Object.entries(socialValues)) {
    html = replaceManagedTag(
      html,
      new RegExp(`<meta(?=[^>]*data-rh="true")(?=[^>]*property="${property}")[^>]*>`, 'i'),
      `<meta data-rh="true" property="${property}" content="${escapeHtml(content)}" />`,
    );
  }

  if (route.robots) {
    const robotsTag = `<meta name="robots" content="${escapeHtml(route.robots)}" />`;
    html = /<meta(?=[^>]*name="robots")[^>]*>/i.test(html)
      ? html.replace(/<meta(?=[^>]*name="robots")[^>]*>/i, robotsTag)
      : html.replace('</head>', `    ${robotsTag}\n  </head>`);
  }

  if (!/<div id="root"><\/div>/i.test(html)) {
    throw new Error('Could not find the empty React root in the Vite output');
  }

  return html.replace('<div id="root"></div>', `<div id="root">${route.fallback}</div>`);
}

function renderNotFoundHtml(template) {
  const fallback = fallbackMarkup({
    heading: 'Page Not Found',
    description: 'The requested page could not be found. Browse Bryan\'s detailing services or return to the homepage.',
    links: [
      { href: '/', label: 'Return to the homepage' },
      { href: '/services', label: 'Browse detailing services' },
    ],
  });
  let html = template
    .replace(/<title>[^<]*<\/title>/i, `<title>Page Not Found | Bryan's Showroom Quality Mobile Detailing</title>`)
    .replace(/<meta(?=[^>]*data-rh="true")(?=[^>]*name="description")[^>]*>/i, '<meta data-rh="true" name="description" content="The requested page could not be found." />')
    .replace(/<link(?=[^>]*data-rh="true")(?=[^>]*rel="canonical")[^>]*>\s*/i, '')
    .replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);

  html = html.replace('</head>', '    <meta name="robots" content="noindex,follow" />\n  </head>');
  return html;
}

const template = await readFile(join(DIST_DIR, 'index.html'), 'utf8');
const sitemapPath = join(DIST_DIR, 'sitemap.xml');
let sitemap = await readFile(sitemapPath, 'utf8');
const blogRoutes = await loadBlogRoutes();

const blogEntries = blogRoutes
  .filter((route) => !sitemap.includes(`<loc>${routeUrl(route.path)}</loc>`))
  .map((route) => `  <url><loc>${routeUrl(route.path)}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`)
  .join('\n');

if (blogEntries) {
  sitemap = sitemap.replace('</urlset>', `${blogEntries}\n</urlset>`);
  await writeFile(sitemapPath, sitemap, 'utf8');
}

const routes = buildStaticRoutes();
for (const route of blogRoutes) routes.set(route.path, route);

const sitemapPaths = [...sitemap.matchAll(/<loc>https:\/\/bryansdetailingomaha\.com(\/[^<]*)<\/loc>/g)]
  .map((match) => match[1] || '/');
const missingRoutes = sitemapPaths.filter((path) => !routes.has(path));
if (missingRoutes.length) {
  throw new Error(`Missing static metadata for sitemap routes: ${missingRoutes.join(', ')}`);
}

const noindexPaths = [...routes.values()]
  .filter((route) => route.robots?.includes('noindex'))
  .map((route) => route.path);
const renderedPaths = new Set([...sitemapPaths, ...noindexPaths]);

for (const path of renderedPaths) {
  const route = routes.get(path);
  const outputPath = path === '/'
    ? join(DIST_DIR, 'index.html')
    : join(DIST_DIR, `${path.slice(1)}.html`);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderRouteHtml(template, route), 'utf8');
}

await writeFile(join(DIST_DIR, '404.html'), renderNotFoundHtml(template), 'utf8');

console.log(`Generated route HTML for ${renderedPaths.size} pages (${sitemapPaths.length} sitemap pages, ${noindexPaths.length} noindex pages, ${blogRoutes.length} blog posts) plus 404.html.`);
