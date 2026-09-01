export const SITE_ORIGIN = 'https://bryansdetailingomaha.com';
export const DEFAULT_SOCIAL_IMAGE = '/20211009_025807-COLLAGE.jpg';

export const BUSINESS = {
  name: "Bryan's Showroom Quality Mobile Detailing",
  url: SITE_ORIGIN,
  telephone: '+1-712-305-6313',
  email: 'bryansmobiledetailing@gmail.com',
  priceRange: '$$',
  address: {
    streetAddress: '1907 Arlington Cir',
    addressLocality: 'Bellevue',
    addressRegion: 'NE',
    postalCode: '68123',
    addressCountry: 'US',
  },
  geo: {
    latitude: 41.1544,
    longitude: -95.9153,
  },
  areaServed: [
    'Bellevue, NE',
    'Omaha, NE',
    'Papillion, NE',
    'La Vista, NE',
    'Ralston, NE',
    'Gretna, NE',
    'Elkhorn, NE',
    'Council Bluffs, IA',
    'Offutt AFB, NE',
  ],
} as const;

export type SeoRoute = {
  title: string;
  description: string;
  canonicalPath?: string;
  robots?: string;
  imagePath?: string;
};

export const STATIC_PAGE_SEO: Record<string, SeoRoute> = {
  '/': {
    title: "Mobile Car Detailing Omaha & Bellevue | Bryan's Detailing",
    description: 'Owner-operated mobile and drop-off car detailing in Bellevue and Omaha. Interior detailing from $139, full details, paint correction, and ceramic coatings.',
  },
  '/services': {
    title: 'Auto Detailing Services & Prices | Bellevue and Omaha',
    description: "Compare interior detailing, full details, paint correction, and ceramic coating prices from Bryan's Detailing in Bellevue and the Omaha metro.",
  },
  '/about': {
    title: "Meet Bryan | Owner of Bryan's Detailing in Bellevue, NE",
    description: "Meet Bryan, the owner and detailer behind Bryan's Showroom Quality Mobile Detailing. Serving Bellevue and the Omaha metro since 2017.",
  },
  '/book': {
    title: 'Book Auto Detailing Online | Omaha & Bellevue NE',
    description: 'Choose a detailing service on Bryan\'s website, then select your vehicle option and an available appointment time securely with Square.',
    robots: 'noindex,follow',
  },
  '/booking': {
    title: 'Book Auto Detailing Online | Omaha & Bellevue NE',
    description: 'Choose a detailing service on Bryan\'s website, then select your vehicle option and an available appointment time securely with Square.',
    canonicalPath: '/book',
    robots: 'noindex,follow',
  },
  '/quote': {
    title: 'Get an Auto Detailing Quote | Omaha & Bellevue NE',
    description: 'Text Bryan clear vehicle photos for the quickest detailing recommendation, or send a short contact request for a personally reviewed quote.',
  },
  '/gallery': {
    title: 'Car Detailing Before & After Gallery | Omaha & Bellevue',
    description: 'See real detailing results from interior restoration, full details, paint correction, ceramic coating, and specialty-vehicle work around Omaha and Bellevue.',
  },
  '/ceramic-coating': {
    title: 'Ceramic Coating Omaha & Bellevue | System X Certified',
    description: 'Certified System X ceramic coating installation in Bellevue for Omaha-area vehicles. Paint preparation, correction, coating, and aftercare included.',
  },
  '/membership': {
    title: 'Car Care Membership | Omaha & Bellevue NE',
    description: 'Keep a recently detailed vehicle clean with scheduled maintenance washes, interior upkeep, and protection refreshes in the Omaha metro.',
  },
  '/gift-cards': {
    title: 'Auto Detailing Gift Cards | Omaha & Bellevue NE',
    description: 'Give professional auto detailing in Bellevue and Omaha, from interior and full details to paint correction and ceramic coating.',
  },
  '/faq': {
    title: 'Auto Detailing FAQ | Omaha & Bellevue NE',
    description: 'Answers about detailing prices, mobile service, Bellevue drop-off, booking, vehicle condition, paint correction, and ceramic coating.',
  },
  '/blog': {
    title: 'Auto Detailing Tips | Omaha & Bellevue NE',
    description: 'Practical guides about interior detailing, paint correction, ceramic coating, Nebraska weather, maintenance, and vehicle care.',
  },
  '/review': {
    title: "Leave a Review | Bryan's Showroom Quality Mobile Detailing",
    description: 'Share your experience after an auto detailing, paint correction, or ceramic coating appointment with Bryan.',
    robots: 'noindex,follow',
  },
  '/sitemap': {
    title: "Website Sitemap | Bryan's Showroom Quality Mobile Detailing",
    description: 'Browse detailing services, service areas, pricing, booking information, the before-and-after gallery, and customer resources.',
  },
  '/terms': {
    title: "Terms of Service | Bryan's Showroom Quality Mobile Detailing",
    description: "Read policies for estimates, vehicle condition, appointments, payments, cancellations, weather, and use of Bryan's detailing website.",
  },
  '/privacy': {
    title: "Privacy Policy | Bryan's Showroom Quality Mobile Detailing",
    description: "Learn how website, quote, booking, and customer information is collected, used, protected, and retained.",
  },
  '/login': {
    title: "Admin Login | Bryan's Showroom Quality Mobile Detailing",
    description: 'Private staff login.',
    robots: 'noindex,nofollow',
  },
  '/admin': {
    title: "Admin | Bryan's Showroom Quality Mobile Detailing",
    description: 'Private staff administration area.',
    robots: 'noindex,nofollow',
  },
  '/admin/services': {
    title: "Service Admin | Bryan's Showroom Quality Mobile Detailing",
    description: 'Private service administration area.',
    robots: 'noindex,nofollow',
  },
  '/admin/blog': {
    title: "Blog Admin | Bryan's Showroom Quality Mobile Detailing",
    description: 'Private blog administration area.',
    robots: 'noindex,nofollow',
  },
  '/admin/faq': {
    title: "FAQ Admin | Bryan's Showroom Quality Mobile Detailing",
    description: 'Private FAQ administration area.',
    robots: 'noindex,nofollow',
  },
};

export const NOT_FOUND_SEO: SeoRoute = {
  title: "Page Not Found | Bryan's Showroom Quality Mobile Detailing",
  description: "The requested page could not be found. Browse Bryan's detailing services or return to the homepage.",
  robots: 'noindex,follow',
};

const BLOG_SEO_TITLES: Record<string, string> = {
  'car-detailing-cost-omaha-2026': "Car Detailing Cost in Omaha (2026) | Bryan's",
  'ceramic-coating-cost-omaha': "Ceramic Coating Cost in Omaha NE | Bryan's Detailing",
  'paint-correction-vs-ceramic-coating': "Paint Correction vs Ceramic Coating | Bryan's Detailing",
  'best-car-detailing-bellevue-ne': "Choosing a Bellevue Auto Detailer | Bryan's Detailing",
  'pre-sale-detail-omaha': "Detailing a Car Before Selling in Omaha | Bryan's Detailing",
  'how-to-protect-new-car-paint': "How to Protect New Car Paint in Nebraska | Bryan's Detailing",
};

const BLOG_SEO_DESCRIPTIONS: Record<string, string> = {
  'car-detailing-cost-omaha-2026': 'See current Omaha car detailing prices for interior cleaning, full details, paint correction, and ceramic coating, plus what can change the final price.',
  'ceramic-coating-cost-omaha': 'Omaha ceramic coating pricing guide covering paint preparation, vehicle condition, coating terms, maintenance, and questions to ask an installer.',
  'paint-correction-vs-ceramic-coating': 'Learn how paint correction improves visible defects, how ceramic coating protects prepared paint, and when combining both services makes sense.',
  'best-car-detailing-bellevue-ne': 'A practical checklist for comparing Bellevue auto detailers, evaluating quotes, understanding what each service includes, and knowing what results to expect.',
  'pre-sale-detail-omaha': 'Learn which detailing steps can help an Omaha-area vehicle photograph better for sale, what to prioritize, and when paint correction is unnecessary.',
  'how-to-protect-new-car-paint': 'A practical guide to protecting new-car paint in Nebraska, including safe washing, contamination removal, polishing, and coatings.',
};

export function getBlogSeoTitle(slug: string, articleTitle: string) {
  const curatedTitle = BLOG_SEO_TITLES[slug];
  if (curatedTitle) return curatedTitle;
  const suffix = " | Bryan's Detailing";
  const availableLength = 60 - suffix.length;
  if (articleTitle.length <= availableLength) return `${articleTitle}${suffix}`;
  const shortened = articleTitle.slice(0, availableLength - 1).replace(/\s+\S*$/, '').trim();
  return `${shortened || articleTitle.slice(0, availableLength - 1)}…${suffix}`;
}

export function getBlogSeoDescription(slug: string, excerpt: string) {
  const curatedDescription = BLOG_SEO_DESCRIPTIONS[slug];
  if (curatedDescription) return curatedDescription;
  if (excerpt.length <= 160) return excerpt;
  const shortened = excerpt.slice(0, 157).replace(/\s+\S*$/, '').trim();
  return `${shortened || excerpt.slice(0, 157)}…`;
}
