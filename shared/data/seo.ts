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
    title: "Car Detailing Bellevue & Omaha, NE | Bryan's Detailing",
    description: 'Professional car detailing in Bellevue and Omaha, NE. Interior details, full details, paint correction, ceramic coatings, mobile service and Bellevue drop-off.',
  },
  '/services': {
    title: 'Car Detailing Services & Prices | Bellevue & Omaha',
    description: 'Compare car detailing prices in Bellevue and Omaha for interior detailing, full details, exterior detailing, paint correction, ceramic coatings and more.',
  },
  '/about': {
    title: "About Bryan's Detailing | Bellevue, NE Detailer",
    description: "Meet Bryan, the owner and detailer behind Bryan's Showroom Quality Detailing in Bellevue, NE, with owner-operated service and paint-prep experience.",
  },
  '/book': {
    title: "Book Car Detailing Bellevue & Omaha, NE | Bryan's",
    description: 'Book car detailing in Bellevue and Omaha. Compare services, choose your vehicle size and select an available appointment for mobile or drop-off detailing.',
    robots: 'noindex,follow',
  },
  '/booking': {
    title: "Book Car Detailing Bellevue & Omaha, NE | Bryan's",
    description: 'Book car detailing in Bellevue and Omaha. Compare services, choose your vehicle size and select an available appointment for mobile or drop-off detailing.',
    canonicalPath: '/book',
    robots: 'noindex,follow',
  },
  '/account': {
    title: "Account | Bryan's Showroom Quality Detailing",
    description: 'Customer account access for Bryan\'s Showroom Quality Detailing.',
    canonicalPath: '/account',
    robots: 'noindex,follow',
  },
  '/quote': {
    title: "Auto Detailing Quote Bellevue & Omaha, NE | Bryan's",
    description: 'Request an auto detailing quote in Bellevue or Omaha. Text vehicle photos for the fastest recommendation, or send your year, make, model and service needs.',
  },
  '/gallery': {
    title: 'Car Detailing Before & After | Bellevue & Omaha',
    description: "See car detailing before-and-after results from Bryan's Detailing in Bellevue and Omaha, including interior restoration, paint correction and exterior details.",
  },
  '/ceramic-coating': {
    title: 'Ceramic Coating Bellevue & Omaha | System X Certified',
    description: 'Certified System X ceramic coating in Bellevue for Omaha-area vehicles. Compare coating packages, paint preparation, correction, protection and aftercare.',
  },
  '/membership': {
    title: 'Car Care Membership | Bellevue & Omaha, NE',
    description: 'Keep a professionally detailed vehicle looking its best with scheduled maintenance detailing in Bellevue and Omaha, including safe washing and interior upkeep.',
  },
  '/gift-cards': {
    title: 'Car Detailing Gift Cards | Bellevue & Omaha, NE',
    description: 'Buy car detailing gift cards for services in Bellevue and Omaha. Give professional interior, exterior or full detailing without choosing the package for them.',
  },
  '/faq': {
    title: 'Car Detailing FAQ | Bellevue & Omaha, NE',
    description: 'Get answers about car detailing prices, mobile service, Bellevue drop-off, vehicle condition, booking, paint correction, ceramic coatings and service times.',
  },
  '/blog': {
    title: 'Auto Detailing Tips | Bellevue & Omaha, NE',
    description: 'Practical Bellevue and Omaha car detailing guides covering interior care, paint correction, ceramic coating, Nebraska weather and vehicle maintenance.',
  },
  '/review': {
    title: "Leave a Review | Bryan's Showroom Quality Detailing",
    description: 'Share your experience after an auto detailing, paint correction, or ceramic coating appointment with Bryan.',
    robots: 'noindex,follow',
  },
  '/sitemap': {
    title: "Website Sitemap | Bryan's Showroom Quality Detailing",
    description: 'Browse detailing services, service areas, pricing, booking information, the before-and-after gallery, and customer resources.',
  },
  '/terms': {
    title: "Terms of Service | Bryan's Showroom Quality Detailing",
    description: "Read policies for estimates, vehicle condition, appointments, payments, cancellations, weather, and use of Bryan's detailing website.",
  },
  '/privacy': {
    title: "Privacy Policy | Bryan's Showroom Quality Detailing",
    description: "Learn how website, quote, booking, and customer information is collected, used, protected, and retained.",
  },
  '/login': {
    title: "Admin Login | Bryan's Showroom Quality Detailing",
    description: 'Private staff login.',
    robots: 'noindex,nofollow',
  },
  '/admin': {
    title: "Admin | Bryan's Showroom Quality Detailing",
    description: 'Private staff administration area.',
    robots: 'noindex,nofollow',
  },
  '/admin/services': {
    title: "Service Admin | Bryan's Showroom Quality Detailing",
    description: 'Private service administration area.',
    robots: 'noindex,nofollow',
  },
  '/admin/blog': {
    title: "Blog Admin | Bryan's Showroom Quality Detailing",
    description: 'Private blog administration area.',
    robots: 'noindex,nofollow',
  },
  '/admin/faq': {
    title: "FAQ Admin | Bryan's Showroom Quality Detailing",
    description: 'Private FAQ administration area.',
    robots: 'noindex,nofollow',
  },
};

export const NOT_FOUND_SEO: SeoRoute = {
  title: "Page Not Found | Bryan's Showroom Quality Detailing",
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
