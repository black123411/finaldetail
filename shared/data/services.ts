export type VehicleSize = 'car' | 'suv' | 'truck' | 'largeSuv' | 'rv' | 'tractor';

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  price: Record<string, number>;
  pricingType: 'fixed' | 'custom' | 'variable';
  squareName: string;
  seo: {
    title: string;
    description: string;
  };
  features: string[];
  duration: string | Record<string, string>;
  badge?: string | null;
  highlight?: boolean;
  image?: string;
  isSpecialty?: boolean;
  bestFor?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  seo?: {
    title: string;
    description: string;
  };
}

export const CATEGORIES: Category[] = [
  { 
    id: 'interior-detailing', 
    slug: 'interior-detailing',
    name: 'Interior Detailing', 
    description: 'Breathe new life into your cabin with my premium interior car detailing in Bellevue and Omaha. I eliminate dust, deep set stains, and odors to deliver a hygienic, factory-fresh driving experience you can instantly feel.',
    image: 'https://lh3.googleusercontent.com/p/AF1QipORfnLVjZw7YXTz2u6d4lISiI1L-kSweobZZbQG=w1200-h800-k-no',
    seo: {
      title: 'Interior Auto Detailing Bellevue NE | Car Interior Cleaners Omaha',
      description: 'Top-rated interior car detailing in Bellevue and Omaha. I specialize in deep cleaning, hot water extraction, and odor removal to restore your vehicle\'s inside.'
    }
  },
  { 
    id: 'exterior-detailing', 
    slug: 'exterior-detailing',
    name: 'Exterior Detailing', 
    description: 'Erase road grime and environmental contamination that dulls your clear coat. My exterior car detailing service safely restores a brilliant gloss while laying down durable paint protection to defend your vehicle.',
    image: 'https://lh3.googleusercontent.com/p/AF1QipNBh1JPkPPvuM9a6ZAEqUVD-q_ngfoeYPE03bev=w1200-h800-k-no',
    seo: {
      title: 'Exterior Auto Detailing Bellevue NE | Car Wash & Wax Omaha',
      description: 'Professional exterior car detailing and hand washes in Bellevue and Omaha. I safely remove grime, perform clay bar treatments, and apply durable wax protection.'
    }
  },
  { 
    id: 'full-detailing', 
    slug: 'full-detailing',
    name: 'Full Detailing Packages', 
    description: 'The ultimate automotive transformation. I combine my elite interior and exterior auto detailing services into one complete package, engineered to get your car, truck, or SUV back to pristine showroom condition.',
    image: 'https://lh3.googleusercontent.com/p/AF1QipOUgRYgEmkuiTvPZkFhp5iBTftXdefL0BuQAZ8_=w1200-h800-k-no',
    seo: {
      title: 'Full Car Detailing Packages Bellevue NE | Complete Auto Detail Omaha',
      description: 'Comprehensive full auto detailing packages in Bellevue and Omaha. From interior shampooing to exterior paint enhancement, I transform your vehicle inside and out.'
    }
  },
  { 
    id: 'paint-correction', 
    slug: 'paint-correction',
    name: 'Paint Correction', 
    description: 'Permanently remove swirl marks, scratches, and oxidation. My multi-stage machine polishing and paint correction restores true mirror-like clarity and depth to your clear coat—not just a temporary shine.',
    image: 'https://lh3.googleusercontent.com/p/AF1QipPbrkvTh49XT1SrfoYOibUm-HglwodcZMs0ToSk=w1200-h800-k-no',
    seo: {
      title: 'Auto Paint Correction Bellevue NE | Machine Polishing & Swirl Removal Omaha',
      description: 'Expert paint correction in Bellevue and Omaha. I permanently erase swirl marks, scratches, and oxidation through multi-stage machine polishing for a flawless gloss.'
    }
  },
  { 
    id: 'protection', 
    slug: 'ceramic-coating',
    name: 'Ceramic Coating', 
    description: 'Lock in perfection. My professional-grade ceramic coating creates a resilient, hydrophobic shield over your paint, repelling water, dirt, and UV damage to maintain a high-gloss finish for years.',
    image: 'https://lh3.googleusercontent.com/p/AF1QipNBh1JPkPPvuM9a6ZAEqUVD-q_ngfoeYPE03bev=w1200-h800-k-no',
    seo: {
      title: 'Ceramic Coating Bellevue NE | Long-Lasting Auto Paint Protection Omaha',
      description: 'Protect your vehicle with premium ceramic coating in Bellevue and Omaha. Enjoy years of extreme hydrophobic water beading, deep gloss, and scratch resistance.'
    }
  },
  { 
    id: 'maintenance', 
    slug: 'maintenance-plans',
    name: 'Maintenance Detailing', 
    description: 'Preserve your vehicle\'s value and showroom shine year-round. My exclusive maintenance auto detailing plans are engineered for Bellevue and Omaha drivers who demand flawless upkeep.',
    image: '/gallery/photo-17.jpg',
    seo: {
      title: 'Car Maintenance Detailing Plans Bellevue NE | Auto Upkeep Omaha',
      description: 'Join my exclusive car maintenance detailing plans in Bellevue and Omaha. Preventative washing and interior upkeep designed to protect your detailing investment.'
    }
  },
  {
    id: 'rv-boat-detailing',
    slug: 'rv-boat-detailing',
    name: 'RV, Boat & Equipment Detailing',
    description: 'Protect your biggest investments from the harsh Midwest elements. From intense oxidation removal to full gel-coat cleanups, my specialized detailing ensures your RV or boat is always adventure-ready.',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=1200',
    seo: {
      title: 'RV & Boat Detailing Bellevue NE | Marine Gel-Coat Cleaning Omaha',
      description: 'Specialized RV and Boat detailing in Bellevue and Omaha. I perform intense gel-coat oxidation removal, marine washing, and UV wax sealing.'
    }
  },
  {
    id: 'tractor-detailing',
    slug: 'tractor-farm-equipment',
    name: 'Tractor & Farm Equipment',
    description: 'Maximize the lifespan and performance of your farm machinery. I execute heavy-duty cleaning and degreasing to safeguard your tractors and equipment from destructive buildup.',
    image: 'https://images.unsplash.com/photo-1594913785162-e678ac052429?auto=format&fit=crop&q=80&w=1200',
    seo: {
      title: 'Tractor & Farm Equipment Detailing Bellevue NE | Heavy Ag Cleaning Omaha',
      description: 'Industrial-grade tractor and farm equipment detailing in Bellevue and Omaha. Extend the lifespan of your agricultural machinery with powerful degreasing.'
    }
  }
];

export const VEHICLE_SIZES = [
  { id: 'car', name: 'Sedan / Coupe', icon: '🚗' },
  { id: 'suv', name: 'Small SUV / Crossover', icon: '🚙' },
  { id: 'truck', name: 'Truck / Large SUV', icon: '🛻' },
  { id: 'largeSuv', name: 'XL Vehicle / Van', icon: '🚐' },
];

export const SPECIALTY_SIZES = [
  { id: 'rv', name: 'RV / Boat / Trailer', icon: '🏠' },
  { id: 'tractor', name: 'Tractor / Equipment', icon: '🚜' },
];

export const ADD_ONS = [
  { id: 'pet-hair', name: 'Pet Hair Removal', price: 50, duration: '45-60 mins', description: 'Deep removal of embedded pet hair from carpets, seats, and all crevices using specialized tools and a high-powered vacuum.' },
  { id: 'seat-shampoo', name: 'Shampoo & Hot Water Extraction', price: 60, duration: '60 mins', description: 'Professional hot water extraction lifts and removes deep stains from cloth upholstery, carpets, and floor mats — not just surface cleaning.' },
  { id: 'smoke-odor', name: 'Ozone Odor Elimination', price: 125, duration: '3.5 hours', description: 'Industrial ozone generator treatment that permanently destroys smoke, pet, mold, and food odors at the molecular level — not just masks them.' },
  { id: 'engine-bay', name: 'Engine Bay Detail', price: 50, duration: '45 mins', description: 'Safe low-pressure degreasing, steam cleaning, and dressing of the engine compartment. Makes leaks easier to spot and runs cooler.' },
  { id: 'headlight', name: 'Headlight Restoration', price: 100, duration: '60-90 mins', description: 'Multi-stage wet sanding, polishing, and UV sealant coating restores clarity and nighttime visibility to yellowed, hazy headlights.' },
];

export const SERVICES: Service[] = [
  // --- INTERIOR ---
  {
    id: 'interior-detail',
    categoryId: 'interior-detailing',
    name: 'Signature Interior Detail',
    shortDescription: 'White-glove interior detail eliminating buildup and light stains for a fresh, sophisticated cabin.',
    longDescription: 'Reclaim the comfort of your daily commute in Bellevue and Omaha. My Signature Interior Detail is a concierge-level deep-cleaning service that goes far beyond a quick vacuum. By thoroughly cleaning and sanitizing plastics, extracting light stains, and air-purging tight crevices, I eliminate everyday buildup and restore a crisp, clean, factory-fresh feel to your vehicle’s interior.',
    price: { car: 149, suv: 169, truck: 189, largeSuv: 209 },
    pricingType: 'fixed',
    squareName: 'Signature Interior Detail',
    seo: {
      title: 'Interior Car Detailing Bellevue NE | Auto Detailing Omaha',
      description: 'Experience premium interior car detailing in Bellevue and Omaha. I eliminate dust, grime, and stains to restore a flawless, hygienic driving environment.'
    },
    features: [
      'Full dual-stage vacuum (Interior & Trunk)',
      'Cracks & crevices air-purged of dust/crumbs',
      'Plastics & vinyl deep cleaned & sanitized',
      'Cupholders & cubbies detailed',
      'Door panels & pockets scrubbed',
      'Streak-free interior glass clarity',
      'High-traffic stain spot treatment',
      'Rubber/Carpet mats deep cleaned',
      'Premium UV barrier (Prevents cracking)',
      'Door jambs degreased & shined'
    ],
    duration: '2-3.5 hours',
    bestFor: 'Daily drivers needing a professional reset and long-term surface protection.',
    badge: 'Popular',
    image: 'https://lh3.googleusercontent.com/p/AF1QipORfnLVjZw7YXTz2u6d4lISiI1L-kSweobZZbQG=w1200-h800-k-no'
  },
  {
    id: 'interior-reset',
    categoryId: 'interior-detailing',
    name: 'Deep Interior Restoration',
    shortDescription: 'Intensive deep cleaning & hot water extraction for heavy dirt, severe stains, and stubborn pet hair.',
    longDescription: 'Turn back the clock on severely neglected interiors. Designed for family haulers and heavily used vehicles in the Omaha metro, the Deep Interior Restoration utilizes advanced hot water extraction and therapeutic steam sanitization to pull out deep-seated stains, eliminate ground-in dirt, and completely remove stubborn pet hair. I permanently transform your cabin, recovering its value and pristine condition.',
    price: { car: 199, suv: 229, truck: 259, largeSuv: 289 },
    pricingType: 'fixed',
    squareName: 'Deep Interior Restoration',
    seo: {
      title: 'Deep Interior Car Cleaning Bellevue NE | Stain & Pet Hair Removal',
      description: 'Total interior auto restoration in Bellevue. I specialize in hot water extraction, heavy stain removal, and pet hair eradication across the Omaha area.'
    },
    features: [
      'Everything in Interior Detail',
      'Hot water extraction (Removes deep stains)',
      'Therapeutic steam sanitization',
      'Intensive fabric & upholstery shampoo',
      'Complete pet hair removal & de-linting',
      'Seat track & sliding rail deep clean',
      'Headliner safely spot-cleaned',
      'Deep odor neutralization treatment'
    ],
    duration: '4-6 hours',
    bestFor: 'Neglected interiors, heavy pet hair, or used-cars needing a "Factory Fresh" feel.',
    badge: 'Deep Restoration',
    image: 'https://lh3.googleusercontent.com/p/AF1QipNOzqClcrsz7xle5InxS3H5aejnJRASt2EZAPe-=w1200-h800-k-no'
  },

  // --- EXTERIOR ---
  {
    id: 'exterior-enhancement',
    categoryId: 'exterior-detailing',
    name: 'Premium Wash & Wax',
    shortDescription: 'Meticulous advanced decontamination wash & premium paint sealant for high-gloss protection.',
    longDescription: 'Elevate your vehicle\'s curb appeal far beyond a standard car wash. Nebraska roads bombard your clear coat with iron fallout to brake dust. My Premium Wash & Wax uses a technical chemical decontamination and clay bar treatment to pull embedded grit out of your paint, leaving it smooth-as-glass. I lock in the gloss with a premium hydrophobic silica sealant that protects against harsh weather for up to 6 months.',
    price: { car: 119, suv: 139, truck: 159, largeSuv: 179 },
    pricingType: 'fixed',
    squareName: 'Premium Wash & Wax',
    seo: {
      title: 'Exterior Auto Detailing Bellevue NE | Paint Decontamination Omaha',
      description: 'Professional exterior car detailing in Bellevue. I utilize iron decontamination, clay bar treatments, and durable paint sealants for a high-gloss finish.'
    },
    features: [
      'Concierge-Level Foam Hand Wash',
      'Wheels, Barrels & Arches Deep Cleaned',
      'High-Gloss Tire Dressing (No-sling formula)',
      'Clay Bar "Smooth-to-touch" Treatment',
      'Iron & Chemical Decontamination',
      'Premium Hydrophobic Gloss Sealant (6-month)',
      'Exterior Glass Hydrophobic Treatment',
      'Trim Restoration & UV Protection'
    ],
    duration: '2-3 hours',
    bestFor: 'Ending the "rough paint" feel and adding a mirror-like protective shield.',
    badge: 'Best-Seller',
    highlight: true,
    image: 'https://lh3.googleusercontent.com/p/AF1QipMVRpjSjIaH_il5_nxbuqY8dFctvIBXtdMP5HAz=w1200-h800-k-no'
  },
  {
    id: 'paint-enhancement-polish',
    categoryId: 'exterior-detailing',
    name: 'Paint Enhancement Polish',
    shortDescription: 'Single-stage Rupes machine polish that removes 50–70% of light swirls, restoring a depth of shine you haven\'t seen since the car was new.',
    longDescription: 'If your paint looks dull, hazy, or covered in fine scratches from automatic car washes, this is the fix. Using a Rupes orbital machine polisher and professional-grade finishing compounds, I perform a single-stage correction that cuts through micro-marring, light swirl marks, and oxidation — restoring the wet, deep, reflective clarity your paint had when it was new. Finished with a durable silica sealant to lock in the results for months. A massive upgrade from any hand wax.',
    price: { car: 279, suv: 329, truck: 369, largeSuv: 419 },
    pricingType: 'fixed',
    squareName: 'Paint Enhancement Polish',
    seo: {
      title: 'Machine Paint Polishing Bellevue NE | Car Gloss Enhancement Omaha',
      description: 'Single-stage Rupes machine polishing in Bellevue and Omaha. Removes 50-70% of light swirl marks and restores deep gloss to dull or hazy clear coat.'
    },
    features: [
      'Full decontamination wash included',
      'Single-stage Rupes orbital machine polish',
      'Removes 50–70% of light swirls & haze',
      'Restores deep gloss & reflective clarity',
      'Durable silica paint sealant (6-month)',
      'Prep wash, clay bar & iron decon included'
    ],
    duration: '4-5 hours',
    bestFor: 'Vehicles that look dull or hazy but don\'t have deep scratches. Big visual upgrade before ceramic coating.',
    badge: 'Premium Enhancement',
    image: 'https://lh3.googleusercontent.com/p/AF1QipNheq-q2h7K5rE3ZzXdsQqG_-my0uLanSzP4nBS=w1200-h800-k-no'
  },

  // --- PAINT CORRECTION ---
  {
    id: 'paint-correction-l1',
    categoryId: 'paint-correction',
    name: 'Paint Correction (Level 1)',
    shortDescription: 'Dedicated single-stage machine correction to permanently erase minor defects and haze.',
    longDescription: 'Attain true clarity with my professional Paint Correction. This intensive single-stage abrasive polishing process safely levels the top layer of your clear coat, permanently eradicating 60% to 80% of unsightly car wash scratches, minor swirl marks, and environmental haze. Utilizing premium foam or microfiber pads paired with high-quality, diminishing-abrasive polishes, I effectively remove defects rather than just filling them in. The result is a flawless, mirror-like finish that prepares your paint perfectly for a protective sealant or entry-level ceramic coating.',
    price: { car: 279, suv: 329, truck: 369, largeSuv: 419 },
    pricingType: 'custom',
    squareName: 'Paint Correction (Level 1)',
    seo: {
      title: 'Level 1 Paint Correction Bellevue NE | Swirl Removal Omaha',
      description: 'Erase swirl marks and scratches with professional Level 1 Paint Correction in Bellevue and Omaha. Achieve a brilliant, clear-coat mirror finish.'
    },
    features: ['Precision Single-Stage Correction', 'Surface Decontamination', 'Gloss Restoration', 'Wipeout Inspection', 'Paint Depth Assessment'],
    duration: '6-8 hours',
    bestFor: 'Newer vehicles or well-maintained paint.',
    image: 'https://lh3.googleusercontent.com/p/AF1QipPbrkvTh49XT1SrfoYOibUm-HglwodcZMs0ToSk=w1200-h800-k-no'
  },
  {
    id: 'paint-correction-l2',
    categoryId: 'paint-correction',
    name: 'Paint Correction (Level 2)',
    shortDescription: 'Advanced two-stage compounding and polishing to remove heavy swirls and scratches.',
    longDescription: 'The ultimate restoration for heavily swirled or scratched paint. My Level 2 Paint Correction utilizes a heavy cutting compound with specialized microfiber cutting pads to aggressively remove up to 85-95% of deep defects. This is followed by an ultra-fine finishing polish with soft foam pads to refine the surface, removing any micro-marring left by the first step and extracting maximum gloss. This intensive process rescues older paint systems, making your vehicle look better than the day it rolled off the showroom floor.',
    price: { car: 449, suv: 529, truck: 599, largeSuv: 679 },
    pricingType: 'custom',
    squareName: 'Paint Correction (Level 2)',
    seo: {
      title: 'Two-Stage Paint Correction Bellevue NE | Deep Scratch Removal Omaha',
      description: 'Rescue your clear coat with my multi-stage Paint Correction in Bellevue and Omaha. Eliminate severe swirl marks and scratches for a breathtaking gloss.'
    },
    features: ['Intensive Two-Stage Compounding & Polishing', 'Intensive Defect Removal', 'High-Clarity Finishing', 'Prep for Ceramic Coating', 'Detailed Surface Inspection'],
    duration: '1-2 Days',
    bestFor: 'Older vehicles or paint with visible swirl marks.',
    highlight: true,
    badge: 'Ultimate Paint Restoration',
    image: 'https://lh3.googleusercontent.com/p/AF1QipOUgRYgEmkuiTvPZkFhp5iBTftXdefL0BuQAZ8_=w1200-h800-k-no'
  },

  // --- CERAMIC COATING ---
  {
    id: 'ceramic-3yr',
    categoryId: 'protection',
    name: '3-Year Ceramic Coating',
    shortDescription: 'Professional 3-year ceramic shield that repels dirt, water, and UV damage.',
    longDescription: 'Stop waxing your car every season. As an authorized System X certified installer, I provide a professional-grade Ceramic Coating that chemically bonds with your vehicle\'s clear coat at a molecular level, forming an ultra-durable, impenetrable layer of protection. This cross-linking process ensures a 3-year lifespan of self-cleaning hydrophobic properties that sheet water instantly, resist harsh road salts, bug splatter, and UV damage. Routine maintenance washes become 80% easier—all while locking in a permanent, wet-look gloss that outlasts any traditional wax or sealant.',
    price: { car: 599, suv: 679, truck: 749, largeSuv: 849 },
    pricingType: 'custom',
    squareName: '3-Year Ceramic Coating',
    seo: {
      title: '3-Year Ceramic Coating Bellevue NE | Auto Paint Protection Omaha',
      description: 'Protect your vehicle with a durable 3-year ceramic coating in Bellevue and Omaha. Unmatched hydrophobic water beading, UV resistance, and an incredible wet-look shine.'
    },
    features: ['3-Year Professional Grade Coating', 'Deep Hydrophobic Properties', 'UV Protection Barrier', 'Ease of Maintenance', 'Technical Prep Wash Included'],
    duration: '1-2 Days',
    bestFor: 'Drivers who want professional long-term protection without a multi-day commitment. Perfect first-time ceramic package.',
    badge: 'Long-Term Protection',
    image: 'https://lh3.googleusercontent.com/p/AF1QipNBh1JPkPPvuM9a6ZAEqUVD-q_ngfoeYPE03bev=w1200-h800-k-no'
  },
  {
    id: 'protection-package',
    categoryId: 'protection',
    name: 'Protection Package',
    shortDescription: 'The ultimate exterior bundle: Expert paint correction sealed perfectly under a ceramic coating.',
    longDescription: 'The absolute pinnacle of automotive surface care. As a System X certified installer, I meticulously prepare your vehicle by completely decontaminating the exterior and performing a precision Paint Correction to guarantee the paint is completely flawless. Immediately after, I seal that perfection under a premium, chemically bonded Ceramic Coating. This package guarantees years of extreme durability against UV rays and chemical staining, stunning visual depth, and effortless maintenance.',
    price: { car: 799, suv: 949, truck: 1099, largeSuv: 1249 },
    pricingType: 'custom',
    squareName: 'Protection Package',
    seo: {
      title: 'Ceramic Coating & Paint Correction Package Bellevue NE | Omaha',
      description: 'The ultimate auto detailing package for Bellevue and Omaha. Combine precision paint correction with a professional ceramic coating to guarantee flawless, long-term protection.'
    },
    features: [
      'Bespoke Technical Prep Wash',
      'Complete Clay & Decontamination',
      'Precision Paint Correction',
      'Professional Ceramic Coating Application',
      'Windshield & Wheel Face Coating Included'
    ],
    duration: '2 Days',
    bestFor: 'New vehicles or those wanting the absolute best protection.',
    badge: 'Best Value',
    highlight: true,
    image: 'https://lh3.googleusercontent.com/p/AF1QipPxCiwStTBTX-8I-8tu6wwWF_sXjB7u7MMAd_F1=w1200-h800-k-no'
  },

  // --- FULL DETAIL ---
  {
    id: 'express-detail',
    categoryId: 'full-detailing',
    name: 'Express Mini Detail',
    shortDescription: 'A thorough hand wash, wheel clean, and interior wipe-down to keep your car looking sharp between full details.',
    longDescription: 'The smartest way to maintain your vehicle\'s appearance between full detail appointments. I foam hand wash the entire exterior, deep clean wheels and tires with a no-sling dressing, vacuum the interior, wipe down all hard surfaces, and leave your glass streak-free inside and out. This is the service I recommend monthly for vehicles that have already been fully detailed — it keeps everything protected and looking its best without ever letting buildup set in.',
    price: { car: 89, suv: 109, truck: 129, largeSuv: 149 },
    pricingType: 'fixed',
    squareName: 'Express Mini Detail',
    seo: {
      title: 'Express Mini Detail Bellevue NE | Maintenance Car Wash Omaha',
      description: 'Professional hand wash, wheel clean, and interior wipe-down in Bellevue and Omaha. The perfect monthly maintenance detail to keep your car looking its best.'
    },
    features: [
      'Foam pre-soak & hand wash',
      'Wheels, barrels & tires deep cleaned',
      'High-gloss no-sling tire dressing',
      'Interior & trunk vacuum',
      'Dash, console & door panel wipe-down',
      'Streak-free interior & exterior glass'
    ],
    duration: '1.5-2 hours',
    bestFor: 'Monthly upkeep for already-detailed vehicles. Best paired with our Maintenance Plan for recurring savings.',
    badge: 'Quick Refresh',
    image: '/gallery/photo-19.jpg'
  },
  {
    id: 'full-detail-package',
    categoryId: 'full-detailing',
    name: 'Signature Full Detail',
    shortDescription: 'Comprehensive top-to-bottom transformation combining my Elite Interior & Exterior services.',
    longDescription: 'Why settle for half the job? The Signature Full Detail is my highly-rated, comprehensive reset engineered to protect both the inside and outside of your vehicle. By bundling my thorough Signature Interior Detail with the decontamination and gloss enhancement of my Premium Wash & Wax, you achieve a totally rejuvenated, show-ready vehicle while securing exceptional package savings.',
    price: { car: 229, suv: 259, truck: 289, largeSuv: 329 },
    pricingType: 'fixed',
    squareName: 'Signature Full Detail',
    seo: {
      title: 'Full Car Detailing Package Bellevue NE | Complete Auto Refresh Omaha',
      description: 'Transform your vehicle inside and out with my Signature Full Detail in Bellevue and Omaha. Combining elite interior cleaning with exterior decontamination.'
    },
    features: [
      'Elite Signature Interior Detail',
      'Premium Exterior Wash & Wax',
      'Wheel & Tire Deep Clean',
      'Exclusive Bundle Savings Applied ✅',
      'Complete 360-Degree Transformation'
    ],
    duration: '4-6 hours',
    bestFor: 'The essential bi-annual refresh for vehicles that deserve to look their best.',
    badge: 'Best Value',
    image: '/gallery/photo-2.jpg'
  },
  {
    id: 'showroom-package',
    categoryId: 'full-detailing',
    name: 'Showroom Package',
    shortDescription: 'My most aggressive restoration package, combining heavy interior extraction and exterior machine polishing.',
    longDescription: 'Maximize your vehicle’s resale value and drastically wind back the clock. The Showroom Package is a heavy-duty overhaul combining my deep-extraction Interior Reset and my gloss-enhancing Paint Enhancement Polish. I brutally assault interior stains and aggressively buff out clear coat haze, restoring the lost aesthetic glory of neglected daily drivers or pre-sale vehicles.',
    price: { car: 399, suv: 449, truck: 499, largeSuv: 549 },
    pricingType: 'fixed',
    squareName: 'Showroom Package',
    seo: {
      title: 'Showroom Restoration Auto Detailing Bellevue NE | Resale Detail Omaha',
      description: 'Boost your car\'s resale value with my Showroom Detailing Package. Deep stain extraction and machine paint polishing to resurrect heavily used vehicles across Bellevue and Omaha.'
    },
    features: [
      'Intensive Interior Reset (Shampoo/Steam)',
      'Machine Paint Enhancement Polish',
      'Restores 50-70% Paint Clarity',
      'Full Engine Bay Restoration',
      'Deep Odor & Fabric Protection',
      'Maximum Resale Value Prep'
    ],
    duration: '6-8 hours',
    bestFor: 'Pre-sale prep, used car purchases, or restoring the family "adventure" vehicle.',
    highlight: true,
    image: '/gallery/photo-11.jpg'
  },

  // --- MAINTENANCE ---
  {
    id: 'maintenance-detail',
    categoryId: 'maintenance',
    name: 'Maintenance Plan',
    shortDescription: 'Exclusive monthly routine upkeep reserved for previously detailed and coated vehicles.',
    longDescription: 'Protect your detailing investment with my recurring Maintenance Plan. Tailored exclusively for vehicles that have recently received one of my complete detailing or ceramic coating packages, this service utilizes safe wash methods and rapid interior wipe-downs to ensure your vehicle remains in impeccable condition year-round without inducing new paint defects.',
    price: { car: 89, suv: 109, truck: 129, largeSuv: 149 },
    pricingType: 'fixed',
    squareName: 'Maintenance Plan',
    seo: {
      title: 'Car Maintenance Detailing Plan Bellevue NE | Auto Cleaning Omaha',
      description: 'Preserve your ceramic coating or fresh detail. Join my exclusive car maintenance detailing plan in Bellevue and Omaha for routine, high-quality vehicle upkeep.'
    },
    features: [
      'Routine maintenance vacuum',
      'Quick interior wipe down',
      'Glass cleaned inside & out',
      'Safe, scratch-free hand wash',
      'Spray protection sealant refresh',
      'Tire dressing application'
    ],
    duration: '1.5-2 hours',
    bestFor: 'Existing clients wanting to maintain their investment.',
    image: '/gallery/photo-17.jpg'
  },

  // --- RV & BOAT ---
  {
    id: 'rv-boat-wash-wax',
    categoryId: 'rv-boat-detailing',
    name: 'RV / Boat Wash & Wax',
    shortDescription: 'Meticulous exterior wash and robust UV sealant protection for large recreational vehicles.',
    longDescription: 'Safeguard your massive mobile investments against harsh aquatic and highway environments. I deliver a meticulously detailed hand wash to strip away aggressive bug splatter and road grime, finishing with an advanced UV-protective wax or sealant to defend the vast surface area of your RV, camper, or boat.',
    price: { rv: 10 }, 
    pricingType: 'variable',
    squareName: 'RV / Boat Wash & Wax',
    seo: {
      title: 'RV & Boat Wash & Wax Detailing Bellevue NE | Omaha RV Cleaning',
      description: 'Protect your camper or boat with my specialized RV and Boat detailing services in Bellevue and Omaha. Complete wash, bug removal, and long-lasting UV wax protection.'
    },
    features: [
      'Technical hand wash',
      'Roof wash (where accessible)',
      'Wheels & arches cleaned',
      'Bug & insect removal',
      'Sealant or wax UV protection'
    ],
    duration: '4-6 hours',
    isSpecialty: true,
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'rv-boat-oxidation',
    categoryId: 'rv-boat-detailing',
    name: 'Oxidation Removal (RV/Boat)',
    shortDescription: 'Aggressive machine compounding to restore color and gloss to chalky, oxidized gel-coats.',
    longDescription: 'When the sun drastically fades your RV or vessel, a simple wash won’t cut it. My Oxidation Removal tackles severe chalkiness and gel-coat degradation. Using heavy rotary or dual-action machine polishing, I cut through the damaging oxidation, restoring vibrant, mirror-like gloss and sealing it tight to drastically improve the life of the surface.',
    price: { rv: 20 },
    pricingType: 'variable',
    squareName: 'Oxidation Removal (RV/Boat)',
    seo: {
      title: 'RV & Boat Oxidation Removal Bellevue NE | Gel-Coat Polishing Omaha',
      description: 'Restore the shine to your faded RV, camper, or boat. I specialize in aggressive machine oxidation removal and gel-coat polishing across the Omaha metro.'
    },
    features: [
      'Heavy compound process',
      'Machine surface restoration',
      'Gloss recovery polishing',
      'Mirror-shine sealant application',
      'Improvement-focused restoration'
    ],
    duration: '1-2 Days',
    isSpecialty: true,
    badge: 'Restoration',
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&q=80&w=1200'
  },

  // --- TRACTOR / FARM ---
  {
    id: 'tractor-detailing-service',
    categoryId: 'tractor-detailing',
    name: 'Tractor / Equipment Cleanup',
    shortDescription: 'Industrial-strength degreasing and cleaning to protect your agricultural investments.',
    longDescription: 'Nebraska agriculture demands reliable, well-maintained machinery. My Equipment Cleanup service utilizes industrial-strength degreasing, high-pressure hot water, and meticulous interior cab detailing to blast away corrosive buildup, mud, and grease. Clean machinery operates cooler, lasts longer, and provides a drastically superior operator experience.',
    price: { tractor: 200 }, 
    pricingType: 'custom',
    squareName: 'Tractor / Farm Equipment Detailing',
    seo: {
      title: 'Tractor & Farm Equipment Detailing Bellevue NE | Agricultural Cleaning',
      description: 'Industrial-grade agricultural equipment cleaning in Bellevue. I provide heavy-duty tractor degreasing, pressure washing, and cab detailing.'
    },
    features: [
      'Heavy-duty degreasing',
      'Pressure wash of all surfaces',
      'Cab interior wipe down',
      'Mud & heavy dirt removal',
      'Glass clarity restore'
    ],
    duration: '3-6 hours',
    isSpecialty: true,
    badge: 'Agricultural Heavy Detail',
    image: 'https://images.unsplash.com/photo-1605151523450-cbccfb50e200?auto=format&fit=crop&q=80&w=1200'
  },

  // --- NEW SERVICES ---
  {
    id: 'new-car-detail',
    categoryId: 'full-detailing',
    name: 'New Car Detail & Protection',
    shortDescription: 'Protect your new vehicle from day one — dealer contamination removed, paint corrected, and sealed for long-term protection.',
    longDescription: 'New doesn\'t mean perfect. Dealer prep, transport scratches, and contamination from sitting on a lot mean your brand-new vehicle\'s paint likely has light defects already. My New Car Detail removes all of that before it causes long-term damage. I perform a full decontamination wash, a light paint correction to remove any swirls from dealer prep, and apply a professional-grade sealant or ceramic coating to protect your investment from day one. This is the single best thing you can do for a new car.',
    price: { car: 279, suv: 329, truck: 369, largeSuv: 419 },
    pricingType: 'custom',
    squareName: 'New Car Detail & Protection',
    seo: {
      title: 'New Car Detail Bellevue NE | New Vehicle Paint Protection Omaha',
      description: 'Protect your new car from day one with a professional new car detail in Bellevue and Omaha. Dealer contamination removal, light paint correction, and long-term sealant application.'
    },
    features: [
      'Full decontamination wash & clay bar',
      'Dealer prep swirl & scratch removal',
      'Paint depth & defect inspection',
      'Professional sealant or ceramic coating',
      'Interior wipe-down & glass detail',
      'Preserve warranty & resale value'
    ],
    duration: '4-6 hours',
    bestFor: 'Brand-new vehicles straight from the dealership. Best paired with a ceramic coating for lifetime protection.',
    badge: 'New Car Special',
    highlight: true,
    image: 'https://lh3.googleusercontent.com/p/AF1QipNBh1JPkPPvuM9a6ZAEqUVD-q_ngfoeYPE03bev=w1200-h800-k-no'
  },
  {
    id: 'pre-sale-detail',
    categoryId: 'full-detailing',
    name: 'Pre-Sale Detail Package',
    shortDescription: 'Maximize your vehicle\'s selling price with a professional top-to-bottom transformation before you list it.',
    longDescription: 'Buyers make decisions based on first impressions. A professionally detailed vehicle sells faster and for more money — period. My Pre-Sale Detail Package is engineered specifically to maximize perceived value: I deep-clean and shampoo the interior to remove stains and odors, machine polish the exterior to restore gloss and hide light scratches, and dress every surface so the car looks showroom-ready in photos and in-person. Sellers who invest in a pre-sale detail typically recoup 3–5x the cost in their final sale price.',
    price: { car: 329, suv: 369, truck: 399, largeSuv: 449 },
    pricingType: 'fixed',
    squareName: 'Pre-Sale Detail Package',
    seo: {
      title: 'Pre-Sale Car Detail Bellevue NE | Sell Your Car Faster Omaha',
      description: 'Maximize your vehicle\'s resale value with a professional pre-sale detail in Bellevue and Omaha. Interior shampoo, machine polish, and full presentation prep to sell faster and for more.'
    },
    features: [
      'Deep interior shampoo & steam clean',
      'Odor neutralization treatment',
      'Machine paint enhancement polish',
      'Engine bay clean & degrease',
      'Headlight restoration (if needed)',
      'Full exterior dress & tire shine'
    ],
    duration: '6-8 hours',
    bestFor: 'Anyone listing a vehicle privately or at a dealership who wants to maximize sale price.',
    badge: 'Boost Resale Value',
    image: 'https://lh3.googleusercontent.com/p/AF1QipOUgRYgEmkuiTvPZkFhp5iBTftXdefL0BuQAZ8_=w1200-h800-k-no'
  },
  {
    id: 'odor-elimination',
    categoryId: 'interior-detailing',
    name: 'Odor Elimination Treatment',
    shortDescription: 'Permanently destroy smoke, pet, mold, and food odors — not just cover them up.',
    longDescription: 'Air fresheners don\'t fix odor problems — they just mask them temporarily. My Odor Elimination Treatment uses an industrial ozone generator to produce O3 molecules that penetrate deep into carpet fibers, seat foam, headliners, and HVAC systems — permanently oxidizing and destroying odor-causing bacteria, mold, and compounds at the source. Paired with a full interior detail and enzyme pre-treatment on problem areas, this is the only truly permanent solution for vehicles with heavy smoke, pet, or mildew odors.',
    price: { car: 139, suv: 159, truck: 179, largeSuv: 199 },
    pricingType: 'fixed',
    squareName: 'Odor Elimination Treatment',
    seo: {
      title: 'Car Odor Removal Bellevue NE | Smoke & Pet Odor Elimination Omaha',
      description: 'Permanently eliminate smoke, pet, mold, and food odors from your vehicle in Bellevue and Omaha. Industrial ozone treatment destroys odors at the molecular level — not just masks them.'
    },
    features: [
      'Full interior detail & vacuum first',
      'Enzyme pre-treatment on problem areas',
      'Industrial ozone generator treatment',
      'HVAC & vent system deodorization',
      'Headliner & carpet odor penetration',
      'Permanent elimination — not masking'
    ],
    duration: '4-5 hours',
    bestFor: 'Vehicles with smoke damage, pet accidents, mildew/flood history, or strong food odors that won\'t go away.',
    badge: 'Permanent Fix',
    image: 'https://lh3.googleusercontent.com/p/AF1QipNOzqClcrsz7xle5InxS3H5aejnJRASt2EZAPe-=w1200-h800-k-no'
  },
  {
    id: 'ppf-inquiry',
    categoryId: 'protection',
    name: 'Paint Protection Film (PPF)',
    shortDescription: 'The ultimate physical armor for high-impact areas — self-healing film that stops rock chips, scratches, and road debris.',
    longDescription: 'Paint Protection Film (PPF) is a virtually invisible urethane film applied to high-impact areas of your vehicle — hood, fenders, mirrors, bumper — that physically absorbs rock chips, scratches, and road debris before they can damage your paint. Unlike ceramic coating, PPF has a self-healing top coat that causes minor scratches to disappear in sunlight or warm water. For the ultimate protection, PPF and ceramic coating are paired together: PPF takes the physical hits, ceramic repels everything else. Contact me to discuss your vehicle and get a custom quote.',
    price: { car: 0 },
    pricingType: 'custom',
    squareName: 'Paint Protection Film (PPF)',
    seo: {
      title: 'Paint Protection Film (PPF) Bellevue NE | Rock Chip Protection Omaha',
      description: 'Paint Protection Film installation in Bellevue and Omaha. Self-healing PPF stops rock chips, scratches, and road debris from damaging your paint. Contact for a custom quote.'
    },
    features: [
      'Self-healing urethane film technology',
      'Stops rock chips & road debris',
      'Virtually invisible on paint surface',
      'Minor scratches disappear in sunlight',
      'Pairs perfectly with ceramic coating',
      'Custom quote based on coverage area'
    ],
    duration: '1-3 Days',
    bestFor: 'New vehicles, high-end cars, or anyone driving on highways where rock chips are a constant concern.',
    badge: 'Coming Soon — Inquire',
    image: 'https://lh3.googleusercontent.com/p/AF1QipPbrkvTh49XT1SrfoYOibUm-HglwodcZMs0ToSk=w1200-h800-k-no'
  }
];


