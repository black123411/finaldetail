import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { CITIES } from '../shared/data/cities.ts';
import { CATEGORIES, SERVICES } from '../shared/data/services.ts';
import { CUSTOMER_SERVICE_GROUPS, SPECIALTY_SERVICE_OPTIONS } from '../shared/data/customerServiceHierarchy.ts';
import { BOOKING_LINK, getSquareBookingLink, isInquiryOnlyService } from '../client/lib/constants.ts';
import {
  STATIC_PAGE_SEO,
  getBlogSeoDescription,
  getBlogSeoTitle,
} from '../shared/data/seo.ts';

const SITE_ORIGIN = 'https://bryansdetailingomaha.com';
const DIST_DIR = join(process.cwd(), 'dist');
const BLOG_API_URL = 'https://bryans-detailing-api.bryansmobiledetailing.workers.dev/api/blog/posts';
const BLOG_FALLBACK_MANIFEST = join(process.cwd(), 'content', 'blog-seo-20260808', 'manifest.json');
const DEFAULT_IMAGE = '/20211009_025807-COLLAGE.jpg';

const EXTRA_FALLBACK_BLOG_POSTS = [
  {
    title: 'Car Detailing Cost in Omaha (2026)',
    slug: 'car-detailing-cost-omaha-2026',
    excerpt: 'See current Omaha car detailing prices for interior cleaning, full details, paint correction, and ceramic coating, plus what can change the final price.',
    featuredImage: DEFAULT_IMAGE,
    published: true,
  },
];

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

const VEHICLE_SIZE_LABELS = {
  car: 'Sedan / coupe',
  suv: 'SUV / crossover',
  truck: 'Truck / large SUV',
  largeSuv: 'XL vehicle / van',
  rv: 'RV / boat',
  tractor: 'Tractor / equipment',
};

const formatPrice = (price) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
}).format(price);

function priceMarkup(service) {
  const entries = Object.entries(service.price || {}).filter(([, price]) => Number.isFinite(price) && price > 0);
  if (!entries.length) {
    return service.pricingType === 'custom' ? '<p><strong>Pricing:</strong> Quote after photos and condition review.</p>' : '';
  }
  const suffix = service.pricingType === 'variable' ? '/ft' : '';
  const minimum = Math.min(...entries.map(([, price]) => price));
  const startingPrice = `${formatPrice(minimum)}${suffix}`;
  const priceRows = entries.length > 1
    ? `<p><strong>Vehicle-size prices:</strong> ${entries.map(([size, price]) => `${escapeHtml(VEHICLE_SIZE_LABELS[size] || size)} ${formatPrice(price)}${suffix}`).join(' · ')}.</p>`
    : '';
  return `<p><strong>Starting at ${startingPrice}.</strong></p>${priceRows}<p>Additional work caused by condition is discussed before I begin.</p>`;
}

function withIndefiniteArticle(phrase) {
  return `${/^[aeiou]/i.test(String(phrase).trim()) ? 'an' : 'a'} ${phrase}`;
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
    '/': 'Mobile Car Detailing in Omaha & Bellevue, NE',
    '/services': 'Auto Detailing Services and Pricing',
    '/about': 'Meet Bryan',
    '/book': 'Book Your Auto Detail',
    '/gallery': 'Auto Detailing Before & After Gallery',
    '/ceramic-coating': 'System X Ceramic Coating in Bellevue & Omaha',
    '/membership': 'Car Care Membership Plans',
    '/gift-cards': 'Auto Detailing Gift Cards',
    '/faq': 'Auto Detailing Frequently Asked Questions',
    '/quote': 'Tell Me About Your Vehicle',
    '/blog': 'Auto Detailing Tips & Guides',
    '/review': 'Enjoyed your detail?',
    '/sitemap': 'Sitemap',
    '/terms': 'Terms of Service',
    '/privacy': 'Privacy Policy',
  };
  return headings[path] || title.split('|')[0].trim();
}

// Category pages were prerendering as little more than a heading and a list of
// service names, well under half the depth of the city pages. This builds the
// same level of detail from data already defined in shared/data/services.ts —
// every figure below comes from the service records, nothing is asserted here.
function categoryDetailsMarkup(category, categoryServices) {
  const categoryName = category.name.toLowerCase();
  const isPlural = /(?:packages|plans)$/.test(categoryName);
  const singularOption = categoryName.replace(/packages$/, 'package').replace(/plans$/, 'plan');
  const optionTitle = category.name.replace(/Packages$/, 'Package').replace(/Plans$/, 'Plan');
  const choiceLabel = isPlural ? singularOption : `${categoryName} option`;
  const allPrices = categoryServices.flatMap((service) => Object.values(service.price || {}))
    .filter((price) => Number.isFinite(price) && price > 0);
  const startingLine = allPrices.length
    ? `<p><strong>${escapeHtml(category.name)} in the Omaha metro ${isPlural ? 'start' : 'starts'} at ${formatPrice(Math.min(...allPrices))}.</strong> Final pricing depends on vehicle size and current condition.</p>`
    : '';

  const serviceSections = categoryServices.map((service) => {
    const prices = Object.values(service.price || {}).filter((price) => Number.isFinite(price) && price > 0);
    const heading = prices.length
      ? `${service.name} — from ${formatPrice(Math.min(...prices))}`
      : `${service.name} — custom quote`;
    return [
      `<h3>${escapeHtml(heading)}</h3>`,
      `<p>${escapeHtml(service.longDescription || service.shortDescription || '')}</p>`,
      service.bestFor ? `<p><strong>Best for:</strong> ${escapeHtml(service.bestFor)}</p>` : '',
      priceMarkup(service),
      service.features?.length ? `<h4>What ${escapeHtml(service.name)} includes</h4>${listMarkup(service.features)}` : '',
    ].filter(Boolean).join('');
  }).join('');

  const comparisonRows = categoryServices.map((service) => {
    const prices = Object.values(service.price || {}).filter((price) => Number.isFinite(price) && price > 0);
    const price = prices.length ? `from ${formatPrice(Math.min(...prices))}` : 'custom quote';
    return `${service.name} (${price}): ${service.shortDescription || ''}`;
  });

  const process = [
    'Compare the options below and pick the one matching the vehicle condition and the result you want.',
    'Book an available appointment online, or send photos if you are unsure which level fits.',
    'Choose mobile service at your location, or a drop-off appointment in Bellevue.',
    'Review the finished work together along with maintenance recommendations.',
  ];

  const faqQuestions = [
    `How much ${isPlural ? 'do' : 'does'} ${categoryName} cost in Omaha and Bellevue?`,
    `Which ${choiceLabel} should I choose?`,
    `${isPlural ? 'Are' : 'Is'} ${categoryName} available for mobile service or Bellevue drop-off?`,
    `How long ${isPlural ? 'do' : 'does'} ${categoryName} take?`,
    'Does vehicle size change the price?',
  ];

  return [
    startingLine,
    `<h2>${escapeHtml(optionTitle)} options and pricing</h2>`,
    serviceSections,
    `<h2>Comparing ${escapeHtml(isPlural ? categoryName : `${categoryName} options`)}</h2>${listMarkup(comparisonRows)}`,
    `<h2>How an appointment works</h2><ol>${process.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol>`,
    `<h2>Common questions</h2>${listMarkup(faqQuestions)}`,
  ].filter(Boolean).join('');
}

function buildStaticRoutes(blogRoutes = []) {
  const routes = new Map();
  const categoryLinks = CATEGORIES.map((category) => ({
    href: `/services/category/${category.slug}`,
    label: category.name,
  }));

  for (const [path, seo] of Object.entries(STATIC_PAGE_SEO)) {
    let details = '';
    let links = [];

    if (path === '/') {
      const featuredServices = SERVICES
        .filter((service) => ['maintenance-interior', 'interior-detail', 'interior-reset', 'full-detail-package', 'showroom-package', 'system-x-pro-plus'].includes(service.id))
        .map((service) => ({
          href: `/services/${service.id}`,
          label: `${service.name} — ${service.pricingType === 'custom' ? 'quote' : `from ${formatPrice(Math.min(...Object.values(service.price).filter((price) => Number.isFinite(price) && price > 0)))}`}`,
        }));
      details = `<h2>Detailing services and starting prices</h2>${linkListMarkup(featuredServices)}<h2>Service categories</h2>${linkListMarkup(categoryLinks)}`;
      links = CITIES.filter((city) => city.type === 'primary').map((city) => ({
        href: `/areas/${city.slug}`,
        label: `Auto detailing in ${city.name}`,
      }));
    } else if (path === '/services') {
      const groupSections = CUSTOMER_SERVICE_GROUPS.map((group) => {
        const serviceLinks = group.services.map((option) => {
          const service = SERVICES.find((item) => item.id === option.serviceId);
          if (!service) return null;
          const prices = Object.values(service.price || {}).filter((price) => Number.isFinite(price) && price > 0);
          const priceLabel = prices.length ? `from ${formatPrice(Math.min(...prices))}` : 'quote after review';
          return {
            href: `/services/${service.id}`,
            label: `${option.displayName || service.name} — ${option.fitLabel} — ${priceLabel}`,
          };
        }).filter(Boolean);
        return `<h2>${escapeHtml(group.title)}</h2><p>${escapeHtml(group.description)}</p>${linkListMarkup(serviceLinks)}`;
      }).join('');
      const specialtyLinks = SPECIALTY_SERVICE_OPTIONS.map((option) => ({
        href: option.serviceId ? `/services/${option.serviceId}` : '/quote',
        label: `${option.title} — text photos or request a quote`,
      }));
      details = `${groupSections}<h2>Specialty / Restoration</h2><p>Condition-dependent work is reviewed from photos before pricing or scheduling.</p>${linkListMarkup(specialtyLinks)}<p><a href="/quote">Text photos or request a quote</a></p><h2>More service information</h2>${linkListMarkup(categoryLinks)}`;
      links = CITIES.filter((city) => city.type === 'primary').map((city) => ({
        href: `/areas/${city.slug}`,
        label: `Auto detailing in ${city.name}`,
      }));
    } else if (path === '/book' || path === '/booking') {
      details = '<h2>Booking is handled securely by Square</h2><p>Choose a service on this website, then select the vehicle option and an available appointment time on Square. Specialty jobs that need photos are quoted before scheduling.</p>';
      links = [
        { href: BOOKING_LINK, label: 'Continue to Square booking' },
        { href: '/services', label: 'Compare detailing services' },
        { href: '/quote', label: 'Text photos or request a quote' },
      ];
    } else if (path === '/about') {
      details = [
        '<h2>Owner-operated since 2017</h2>',
        '<p>I’m Bryan, the owner and detailer behind Bryan’s Showroom Quality Detailing. Before starting the business, I worked in a collision center doing detailing, vehicle preparation, and paint prep. That experience taught me how differently paint, trim, fabric, and other surfaces need to be handled.</p>',
        '<h2>Why I started the business</h2>',
        '<p>After my mother passed away, I took guardianship of my two younger siblings. I needed a way to support my family, so in 2017 I turned the detailing work I already knew and cared about into my own business.</p>',
        '<h2>How I approach the work</h2>',
        '<p>I inspect the vehicle, recommend the service, perform the detail, and check the result myself. I explain what I see, what I expect can be improved safely, and any price change before adding work. The person you talk to is the person doing the work.</p>',
      ].join('');
      links = [
        { href: '/services', label: 'View detailing services' },
        { href: BOOKING_LINK, label: 'View appointment availability' },
        { href: '/quote', label: 'Text photos or contact Bryan' },
      ];
    } else if (path === '/quote') {
      details = [
        '<h2>Text photos for the quickest answer</h2>',
        '<p>Send a few clear photos of the vehicle and the areas that need attention. You can also use the short contact form. I review every request myself before recommending a service or confirming a price.</p>',
        '<h2>What to include</h2>',
        listMarkup(['Year, make, model, and vehicle size', 'The interior, paint, odor, stain, or specialty work you want done', 'Pet hair, spills, oxidation, access limitations, or other condition details']),
        '<p>Photos are sent by text so I can view them clearly on my phone; they are not uploaded through the contact form.</p>',
      ].join('');
      links = [
        { href: 'sms:+17123056313', label: 'Text photos to Bryan' },
        { href: 'tel:+17123056313', label: 'Call (712) 305-6313' },
        { href: '/services', label: 'Compare detailing services' },
      ];
    } else if (path === '/ceramic-coating') {
      const coatingServices = SERVICES.filter((service) => service.categoryId === 'protection');
      details = `<h2>Ceramic protection options</h2>${linkListMarkup(coatingServices.map((service) => ({
        href: `/services/${service.id}`,
        label: service.name,
      })))}`;
    } else if (path === '/gallery') {
      links = categoryLinks;
    } else if (path === '/blog') {
      details = blogRoutes.length
        ? `<h2>Latest auto detailing guides</h2>${linkListMarkup(blogRoutes.map((route) => ({
            href: route.path,
            label: route.title.split('|')[0].trim(),
          })))}`
        : '';
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
        heading: `${category.name} in Omaha & Bellevue`,
        description: category.description,
        details: categoryDetailsMarkup(category, categoryServices),
        links: [
          ...categoryServices.map((service) => ({
            href: `/services/${service.id}`,
            label: service.name,
          })),
          ...CITIES.filter((city) => city.type === 'primary').slice(0, 4).map((city) => ({
            href: `/areas/${city.slug}`,
            label: `${category.name} in ${city.name}`,
          })),
          { href: '/quote', label: `Get ${withIndefiniteArticle(category.name.toLowerCase())} quote` },
          ...(category.id === 'tractor-detailing' ? [] : [{ href: BOOKING_LINK, label: 'Book auto detailing with Square' }]),
        ],
      }),
    });
  }

  for (const service of SERVICES) {
    const path = `/services/${service.id}`;
    const prices = Object.values(service.price).filter((price) => Number.isFinite(price) && price > 0);
    routes.set(path, {
      path,
      title: service.seo.title,
      description: service.seo.description,
      imagePath: service.image || DEFAULT_IMAGE,
      fallback: fallbackMarkup({
        heading: service.name,
        description: service.longDescription,
        details: [
          /\$\d/.test(service.longDescription) ? '' : priceMarkup(service),
          service.bestFor ? `<p><strong>Best for:</strong> ${escapeHtml(service.bestFor)}</p>` : '',
          `<h2>What is included</h2>${listMarkup(service.features)}`,
        ].filter(Boolean).join(''),
        links: [
          { href: `/services/category/${CATEGORIES.find((category) => category.id === service.categoryId)?.slug || ''}`, label: 'Compare related services' },
          isInquiryOnlyService(service.id)
            ? { href: '/quote', label: `Text photos / request a quote for ${service.name}` }
            : { href: getSquareBookingLink(service.id), label: `Book ${service.name} with Square` },
        ],
      }),
    });
  }

  for (const city of CITIES) {
    const path = `/areas/${city.slug}`;
    const cityServices = SERVICES.filter((service) => city.content.featuredServiceIds?.includes(service.id));
    const serviceLinks = (cityServices.length ? cityServices : SERVICES.slice(0, 8)).map((service) => ({
      href: `/services/${service.id}`,
      label: service.name,
    }));
    const areaLinks = city.content.serviceAreas.map((area) => {
      const matchingCity = CITIES.find((candidate) => candidate.name.toLowerCase().startsWith(area.toLowerCase()));
      return matchingCity ? { href: `/areas/${matchingCity.slug}`, label: `Auto detailing in ${matchingCity.name}` } : null;
    }).filter(Boolean);

    const processDetails = [
      'Choose the service that matches the vehicle condition and desired result.',
      'Confirm an available appointment online or request help choosing a package.',
      'Prepare the vehicle and work area when mobile service is selected.',
      'Review the completed work and maintenance recommendations.',
    ];

    const faqQuestions = [
      `Do you offer mobile car detailing in ${city.name}?`,
      `What detailing service should I choose in ${city.name}?`,
      `Can I get paint correction or ceramic coating near ${city.name}?`,
    ];

    routes.set(path, {
      path,
      title: city.seo.title,
      description: city.seo.description,
      imagePath: DEFAULT_IMAGE,
      fallback: fallbackMarkup({
        heading: city.content.title,
        description: city.content.intro,
        details: [
          `<h2>${escapeHtml(city.content.servicesLabel)}</h2>${linkListMarkup(serviceLinks)}`,
          `<h2>${escapeHtml(city.content.whyLabel)}</h2>${listMarkup(city.content.whyPoints)}`,
          `<h2>Nearby service areas</h2>${listMarkup(city.content.serviceAreas)}`,
          `<h2>How detailing works</h2><ol>${processDetails.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol>`,
          `<h2>Local questions</h2>${listMarkup(faqQuestions)}`,
          `<p><strong>${escapeHtml(city.content.cta)}</strong></p>`,
        ].join(''),
        links: [
          ...areaLinks,
          ...serviceLinks.slice(0, 6),
          { href: '/quote', label: `Get ${withIndefiniteArticle(city.name)} detailing quote` },
        ],
      }),
    });
  }

  return routes;
}

function mapBlogRoutes(posts) {
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
}

async function loadBlogRoutes() {
  try {
    const response = await fetch(BLOG_API_URL, { signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new Error(`Blog API returned ${response.status}`);
    const posts = await response.json();
    if (!Array.isArray(posts)) throw new Error('Blog API did not return an array');

    return mapBlogRoutes(posts);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);

    try {
      const localPosts = JSON.parse(await readFile(BLOG_FALLBACK_MANIFEST, 'utf8'));
      if (!Array.isArray(localPosts)) throw new Error('local manifest did not return an array');
      console.warn(`Blog API unavailable (${reason}); using ${localPosts.length + EXTRA_FALLBACK_BLOG_POSTS.length} local blog routes.`);
      return mapBlogRoutes([...localPosts, ...EXTRA_FALLBACK_BLOG_POSTS]);
    } catch (fallbackError) {
      console.warn(`Skipped blog route metadata: ${reason}; local fallback failed: ${fallbackError instanceof Error ? fallbackError.message : fallbackError}`);
      return [];
    }
  }
}

function replaceManagedTag(html, matcher, replacement) {
  if (!matcher.test(html)) {
    throw new Error(`Could not find managed metadata tag: ${matcher}`);
  }
  return html.replace(matcher, replacement);
}

function routeSchema(route) {
  const city = CITIES.find((candidate) => `/areas/${candidate.slug}` === route.path);
  if (!city) return null;

  const region = city.name.includes('Council Bluffs') ? 'IA' : 'NE';
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Auto Detailing in ${city.name}`,
    serviceType: 'Auto detailing',
    description: city.seo.description,
    url: routeUrl(route.path),
    provider: {
      '@type': ['LocalBusiness', 'AutomotiveBusiness'],
      '@id': `${SITE_ORIGIN}/#business`,
      name: "Bryan's Showroom Quality Mobile Detailing",
    },
    areaServed: {
      '@type': 'City',
      name: city.name.replace(/, (NE|IA)$/, ''),
      addressRegion: region,
      addressCountry: 'US',
    },
  };
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

  const schema = routeSchema(route);
  if (schema) {
    html = html.replace(
      '</head>',
      `    <script type="application/ld+json">${JSON.stringify(schema).replaceAll('</', '<\\/')}</script>\n  </head>`,
    );
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

const routes = buildStaticRoutes(blogRoutes);
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
const supplementalPaths = [...routes.keys()]
  .filter((path) => !path.startsWith('/admin') && path !== '/login');
const renderedPaths = new Set([...sitemapPaths, ...noindexPaths, ...supplementalPaths]);

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
