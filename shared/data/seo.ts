export const SITE_ORIGIN = 'https://bryansdetailingomaha.com';
export const DEFAULT_SOCIAL_IMAGE = '/20211009_025807-COLLAGE.jpg';

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
    description: 'Owner-operated mobile and drop-off car detailing in Bellevue and Omaha. Interior details from $179, full details, paint correction, and ceramic coatings.',
  },
  '/services': {
    title: 'Auto Detailing Services & Prices | Bellevue and Omaha',
    description: "Compare interior detailing, full details, paint correction, and ceramic coating prices from Bryan's Detailing in Bellevue and the Omaha metro.",
  },
  '/book': {
    title: 'Book Auto Detailing Online | Omaha & Bellevue NE',
    description: 'Choose a detailing service, vehicle size, available add-ons, and appointment time online for Bryan\'s detailing in Bellevue and the Omaha metro.',
    robots: 'noindex,follow',
  },
  '/booking': {
    title: 'Book Auto Detailing Online | Omaha & Bellevue NE',
    description: 'Choose a detailing service, vehicle size, available add-ons, and appointment time online for Bryan\'s detailing in Bellevue and the Omaha metro.',
    canonicalPath: '/book',
    robots: 'noindex,follow',
  },
  '/quote': {
    title: 'Get an Auto Detailing Quote | Omaha & Bellevue NE',
    description: 'Request a condition-based quote for heavy interior restoration, odor, pet hair, paint correction, ceramic coating, RVs, boats, or equipment.',
  },
  '/gallery': {
    title: 'Auto Detailing Before & After Gallery | Omaha NE',
    description: 'See real Bellevue and Omaha results from interior restoration, full details, paint correction, ceramic coating, and specialty-vehicle detailing.',
  },
  '/ceramic-coating': {
    title: 'Ceramic Coating Omaha & Bellevue | System X Certified',
    description: 'Certified System X ceramic coating installation in Bellevue for Omaha-area vehicles. Paint preparation, correction, coating, and aftercare included.',
  },
  '/membership': {
    title: 'Car Care Membership | Omaha & Bellevue NE',
    description: 'Keep a recently detailed or ceramic-coated vehicle clean with scheduled maintenance washes, interior upkeep, and protection refreshes.',
  },
  '/gift-cards': {
    title: 'Auto Detailing Gift Cards | Omaha & Bellevue NE',
    description: 'Give professional auto detailing in Bellevue and Omaha. Arrange a gift card for interior detailing, full details, paint correction, or ceramic coating.',
  },
  '/faq': {
    title: 'Auto Detailing FAQ | Omaha & Bellevue NE',
    description: 'Get answers about detailing prices, mobile service, Bellevue drop-off, booking, vehicle condition, paint correction, and ceramic coating.',
  },
  '/blog': {
    title: 'Auto Detailing Tips | Omaha & Bellevue NE',
    description: 'Read practical local guides about interior detailing, paint correction, ceramic coating, winter protection, maintenance, and vehicle care.',
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
    description: 'Read policies for estimates, vehicle condition, appointments, payments, cancellations, weather, and use of Bryan\'s detailing website.',
  },
  '/privacy': {
    title: "Privacy Policy | Bryan's Showroom Quality Mobile Detailing",
    description: 'Learn how website, quote, booking, and customer information is collected, used, protected, and retained.',
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
  'ceramic-coating-cost-omaha': "Ceramic Coating Cost in Omaha NE | Bryan's Detailing",
  'paint-correction-vs-ceramic-coating': "Paint Correction vs Ceramic Coating | Bryan's Detailing",
  'best-car-detailing-bellevue-ne': "Choosing a Bellevue Auto Detailer | Bryan's Detailing",
  'pre-sale-detail-omaha': "Detailing a Car Before Selling | Bryan's Detailing",
  'how-to-protect-new-car-paint': "How to Protect New Car Paint | Bryan's Detailing",
};

const BLOG_SEO_DESCRIPTIONS: Record<string, string> = {
  'ceramic-coating-cost-omaha': 'Omaha ceramic coating pricing guide covering paint prep, vehicle condition, coating terms, maintenance, and questions to ask an installer.',
  'paint-correction-vs-ceramic-coating': 'Learn how paint correction improves defects, how ceramic coating protects prepared paint, and when combining both services makes sense.',
  'best-car-detailing-bellevue-ne': 'Use this practical checklist to compare Bellevue auto detailers, evaluate quotes and paint-care processes, and set realistic expectations.',
  'pre-sale-detail-omaha': 'Learn which detailing steps help an Omaha-area vehicle look better in listing photos, what to prioritize, and when correction is unnecessary.',
  'how-to-protect-new-car-paint': 'A first-month guide to new-car paint protection in Omaha, including delivery inspection, safe washing, contamination, polishing, and coatings.',
};

export function getBlogSeoTitle(slug: string, articleTitle: string) {
  const curatedTitle = BLOG_SEO_TITLES[slug];
  if (curatedTitle) return curatedTitle;

  const suffix = " | Bryan's Detailing";
  const availableLength = 60 - suffix.length;
  if (articleTitle.length <= availableLength) return `${articleTitle}${suffix}`;

  const shortened = articleTitle
    .slice(0, availableLength - 1)
    .replace(/\s+\S*$/, '')
    .trim();
  return `${shortened || articleTitle.slice(0, availableLength - 1)}…${suffix}`;
}

export function getBlogSeoDescription(slug: string, excerpt: string) {
  const curatedDescription = BLOG_SEO_DESCRIPTIONS[slug];
  if (curatedDescription) return curatedDescription;
  if (excerpt.length <= 160) return excerpt;

  const shortened = excerpt
    .slice(0, 157)
    .replace(/\s+\S*$/, '')
    .trim();
  return `${shortened || excerpt.slice(0, 157)}…`;
}
