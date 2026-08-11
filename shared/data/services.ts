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

export interface AddOn {
  id: string;
  name: string;
  price: number;
  priceBySize?: Partial<Record<VehicleSize, number>>;
  duration: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { 
    id: 'interior-detailing', 
    slug: 'interior-detailing',
    name: 'Interior Detailing', 
    description: 'Interior car detailing in Bellevue and Omaha for dust, crumbs, stains, pet hair, and odor. Start with Maintenance Interior from $139, then choose Signature Interior Detail or Deep Interior Restoration for heavier buildup. Services include vacuuming, steam cleaning, upholstery shampoo, hot water extraction, glass cleaning, and interior wipe down.',
    image: '/gallery/takeout/20210629_204424.webp',
    seo: {
      title: 'Interior Car Detailing Bellevue & Omaha | Prices From $139',
      description: 'Interior car detailing in Bellevue and Omaha from $139, with maintenance cleaning, vacuuming, shampoo, extraction, stain treatment, and pet-hair options.'
    }
  },
  { 
    id: 'exterior-detailing', 
    slug: 'exterior-detailing',
    name: 'Exterior Detailing', 
    description: 'Professional exterior cleaning for road film, bugs, wheels, bonded contamination, and paint that feels rough after normal washing. The process cleans and protects the finish without promising correction that requires machine polishing.',
    image: '/gallery/takeout/20220520_195826.webp',
    seo: {
      title: 'Exterior Car Detailing Omaha & Bellevue | Bryan\'s Detailing',
      description: 'Exterior car detailing in Omaha and Bellevue with careful washing, paint decontamination, clay treatment, and durable protection.'
    }
  },
  { 
    id: 'full-detailing', 
    slug: 'full-detailing',
    name: 'Full Detailing Packages', 
    description: 'Complete car detailing packages for Bellevue and Omaha drivers who need interior cleaning and exterior detailing in one appointment. Choose full detail, pre-sale detail, new car protection, or paint enhancement.',
    image: '/gallery/takeout/20230507_162319.webp',
    seo: {
      title: 'Full Car Detailing Bellevue & Omaha | Inside and Out',
      description: 'Complete inside-and-out car detailing in Bellevue and Omaha. Interior cleaning, exterior hand wash, decontamination, wheels, tires, and protection.'
    }
  },
  { 
    id: 'paint-correction', 
    slug: 'paint-correction',
    name: 'Paint Correction', 
    description: 'Controlled machine polishing that permanently reduces or removes eligible swirl marks, oxidation, wash haze, and light scratches depending on paint depth and defect severity. The process restores clarity and depth to the clear coat without promising unsafe or impossible results.',
    image: '/gallery/takeout/20260502_192636.webp',
    seo: {
      title: 'Paint Correction Omaha & Bellevue | Swirl Mark Removal',
      description: 'Professional paint correction in Bellevue and Omaha for eligible swirl marks, oxidation, haze, and light scratches. Paint inspection required.'
    }
  },
  { 
    id: 'protection', 
    slug: 'ceramic-coating',
    name: 'Ceramic Coating', 
    description: 'Certified System X ceramic coating in Bellevue and Omaha for durable gloss, chemical resistance, UV resistance, water behavior, and easier maintenance washing. Paint preparation is matched to the condition of the vehicle.',
    image: '/gallery/takeout/20230513_182328.webp',
    seo: {
      title: 'Ceramic Coating Omaha & Bellevue | System X Certified',
      description: 'Certified System X ceramic coating installation in Bellevue for Omaha-area vehicles. Paint preparation, correction, coating, and aftercare included.'
    }
  },
  { 
    id: 'maintenance', 
    slug: 'maintenance-plans',
    name: 'Maintenance Detailing', 
    description: 'Maintenance detailing for vehicles that have already been professionally cleaned, corrected, or ceramic coated. Routine interior wipe down, safe hand wash, glass cleaning, and protection refreshes.',
    image: '/gallery/takeout/20230420_162911.webp',
    seo: {
      title: 'Maintenance Car Detailing Omaha & Bellevue | Bryan\'s Detailing',
      description: 'Routine maintenance detailing in Omaha and Bellevue for recently detailed or ceramic-coated vehicles, including safe washing and interior upkeep.'
    }
  },
  {
    id: 'rv-boat-detailing',
    slug: 'rv-boat-detailing',
    name: 'RV, Boat & Equipment Detailing',
    description: 'RV and boat detailing around Bellevue and Omaha, including wash and wax, bug removal, gel coat cleaning, oxidation removal, machine polishing, and UV sealant protection.',
    image: '/gallery/takeout/20250421_150404.webp',
    seo: {
      title: 'RV & Boat Detailing | Omaha & Bellevue',
      description: 'RV and boat detailing around Bellevue and Omaha, including wash and wax, bug removal, gel-coat cleaning, oxidation removal, and UV protection.'
    }
  },
  {
    id: 'tractor-detailing',
    slug: 'tractor-farm-equipment',
    name: 'Tractor & Farm Equipment',
    description: 'Tractor and farm equipment cleaning for mud, grease, dust, cab interiors, glass, and exterior buildup. Mobile heavy equipment detailing available by quote.',
    image: '',
    seo: {
      title: 'Farm Equipment Cleaning Services | Omaha Metro',
      description: 'Mobile tractor and equipment cleaning around Bellevue and Omaha for mud, grease, dust, cab interiors, glass, and exterior buildup.'
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

export const ADD_ONS: AddOn[] = [
  { id: 'pet-hair', name: 'Pet Hair Removal', price: 75, duration: 'Quoted after photos', description: 'Starts at $75. Final price is quoted after texted photos because embedded pet hair, vehicle size, and cargo-area condition can change the time required.' },
  { id: 'smoke-odor', name: 'Ozone Odor Elimination', price: 125, duration: '3.5 hours', description: 'Ozone odor treatment for smoke, pet, mildew, and food smells after the odor source has been cleaned.' },
  { id: 'engine-bay', name: 'Engine Bay Detail', price: 50, duration: '45 mins', description: 'Safe low-pressure degreasing, steam cleaning, and dressing of the engine compartment. Makes leaks easier to spot and runs cooler.' },
  { id: 'headlight', name: 'Headlight Restoration', price: 100, duration: '60-90 mins', description: 'Multi-stage wet sanding, polishing, and UV sealant coating restores clarity and nighttime visibility to yellowed, hazy headlights.' },
  {
    id: 'system-x-glass-plus',
    name: 'System X Glass+ Windshield Protection',
    price: 149,
    duration: '45 mins',
    description: 'System X Glass+ on the windshield for hydrophobic clarity and easier bug, ice, and road-film removal. Already included with Pro+, MAX G+, and Phantom 2K packages.'
  },
  {
    id: 'system-x-wheel-plus',
    name: 'System X Wheel+ Face Protection',
    price: 299,
    priceBySize: { car: 299, suv: 329, truck: 349, largeSuv: 379 },
    duration: '1.5 hours',
    description: 'Wheel-face decontamination and System X Wheel+ protection against brake dust, heat, pitting, and corrosion. Already included with MAX G+ and Phantom 2K.'
  },
  {
    id: 'system-x-interior-protection',
    name: 'System X Complete Interior Protection',
    price: 399,
    priceBySize: { car: 399, suv: 449, truck: 449, largeSuv: 499 },
    duration: '2 hours',
    description: 'System X LVP on leather, vinyl, and plastic plus Textile protection on carpet and fabric. Must be paired with a clean or freshly detailed interior.'
  },
  {
    id: 'system-x-revive-trim',
    name: 'System X Revive Trim Restoration',
    price: 199,
    priceBySize: { car: 199, suv: 229, truck: 249, largeSuv: 279 },
    duration: '1.5 hours',
    description: 'Restores faded unpainted exterior plastic and trim, then adds durable UV and hydrophobic protection with System X Revive.'
  },
];

export const SERVICES: Service[] = [
  // --- INTERIOR ---
  {
    id: 'maintenance-interior',
    categoryId: 'interior-detailing',
    name: 'Maintenance Interior',
    shortDescription: 'A thorough vacuum and interior wipe-down for regularly maintained vehicles that do not need full shampooing or extraction.',
    longDescription: 'Maintenance Interior is for reasonably maintained vehicles that need a proper vacuum and wipe-down without full shampooing or extraction. It includes a thorough vacuum, compressed-air blowout, cleaning of the dash, console, doors, and plastics, floor mat cleaning, interior glass, and light spot cleaning. Severe stains, excessive pet hair, major odor removal, and full fabric extraction require a higher-level interior service.',
    price: { car: 139, suv: 159, truck: 179, largeSuv: 199 },
    pricingType: 'fixed',
    squareName: 'Maintenance Interior',
    seo: {
      title: 'Maintenance Interior Cleaning | Bellevue & Omaha From $139',
      description: 'Maintenance interior cleaning in Bellevue and Omaha from $139 for regularly maintained vehicles that need vacuuming, wipe-down, mats, glass, and light spot cleaning.'
    },
    features: [
      'Thorough interior and trunk vacuum',
      'Compressed-air blowout for cracks and crevices',
      'Dash, console, door, and plastic cleaning',
      'Floor mat cleaning',
      'Interior glass cleaning',
      'Light spot cleaning'
    ],
    duration: '2-2.5 hours',
    bestFor: 'Regularly maintained vehicles without heavy stains, major pet hair, spills, strong odors, or neglected interiors.',
    badge: 'From $139',
    image: '/gallery/takeout/20210629_204424.webp'
  },
  {
    id: 'interior-detail',
    categoryId: 'interior-detailing',
    name: 'Signature Interior Detail',
    shortDescription: 'Interior car detailing for dust, crumbs, light stains, dirty mats, glass, plastics, cupholders, and everyday buildup.',
    longDescription: 'Signature Interior Detail is an interior car detailing service for Bellevue and Omaha drivers who want the cabin cleaned properly. The service includes a thorough vacuum, compressed-air blowout, interior wipe down, plastic and vinyl cleaning, mat cleaning, glass cleaning, cupholder cleaning, door panel cleaning, light stain treatment, and door jamb wipe down.',
    price: { car: 179, suv: 199, truck: 209, largeSuv: 229 },
    pricingType: 'fixed',
    squareName: 'Signature Interior Detail',
    seo: {
      title: 'Interior Car Detailing Bellevue & Omaha | Prices From $179',
      description: 'Professional interior car detailing in Bellevue and Omaha. Vacuuming, compressed-air cleaning, light stain treatment, and pet-hair options.'
    },
    features: [
      'Interior and trunk vacuum',
      'Compressed-air blowout for cracks and crevices',
      'Plastic and vinyl cleaning',
      'Cupholder and console cleaning',
      'Door panel and pocket cleaning',
      'Interior glass cleaning',
      'Light stain spot treatment',
      'Rubber mat and carpet mat cleaning',
      'Interior dressing on applicable plastics',
      'Door jamb wipe down'
    ],
    duration: '2-3.5 hours',
    bestFor: 'Daily drivers with normal dust, crumbs, dirty mats, light stains, and interior buildup.',
    badge: 'Popular',
    image: '/gallery/takeout/20210629_204424.webp'
  },
  {
    id: 'interior-reset',
    categoryId: 'interior-detailing',
    name: 'Interior Restoration',
    shortDescription: 'Deep interior cleaning with hot water extraction for heavy dirt, fabric stains, pet hair, spills, and odor sources.',
    longDescription: 'Interior Restoration is for neglected interiors, family vehicles, work vehicles, used cars, and pet vehicles around Bellevue and Omaha. The service includes dry debris removal, pet hair removal, steam cleaning as needed, upholstery shampoo, hot-water extraction, seat track cleaning, mat cleaning, plastic cleaning, glass cleaning, and odor-source cleaning.',
    price: { car: 249, suv: 279, truck: 289, largeSuv: 309 },
    pricingType: 'fixed',
    squareName: 'Deep Interior Restoration',
    seo: {
      title: 'Interior Restoration Bellevue & Omaha | From $249',
      description: 'Interior restoration in Bellevue and Omaha with shampooing, hot-water extraction, heavy stain treatment, pet-hair removal, and odor-source cleaning.'
    },
    features: [
      'Everything in Signature Interior Detail',
      'Hot water extraction for fabric and carpet',
      'Steam cleaning where safe for the material',
      'Upholstery shampoo',
      'Pet hair removal',
      'Seat track and rail cleaning',
      'Headliner spot cleaning where safe',
      'Odor source cleaning'
    ],
    duration: '4-6 hours',
    bestFor: 'Neglected interiors, heavy pet hair, spills, stains, used cars, and family vehicles.',
    badge: 'Deep Restoration',
    image: '/gallery/takeout/20221116_000144.webp'
  },

  // --- EXTERIOR ---
  {
    id: 'exterior-enhancement',
    categoryId: 'exterior-detailing',
    name: 'Premium Wash & Wax',
    shortDescription: 'Exterior hand wash, wheel cleaning, iron removal, clay bar treatment, and paint sealant for gloss and protection.',
    longDescription: 'Premium Wash & Wax is an exterior car detailing service for paint that feels rough or looks dull after normal washing. The process includes a foam pre-wash, contact hand wash, wheel and tire cleaning, bug removal, iron decontamination, clay bar treatment, exterior glass cleaning, tire dressing, trim dressing where needed, and a durable paint sealant.',
    price: { car: 149, suv: 169, truck: 189, largeSuv: 209 },
    pricingType: 'fixed',
    squareName: 'Premium Wash & Wax',
    seo: {
      title: 'Exterior Detailing Bellevue NE | Wash & Wax Omaha',
      description: 'Exterior detailing with foam pre-wash, hand washing, wheel cleaning, iron removal, clay treatment, and paint sealant in Bellevue and Omaha.'
    },
    features: [
      'Foam pre-wash and contact hand wash',
      'Wheel face, barrel, tire, and wheel well cleaning',
      'No-sling tire dressing',
      'Clay bar treatment',
      'Iron fallout removal',
      'Paint sealant application',
      'Exterior glass cleaning',
      'Exterior trim dressing where needed'
    ],
    duration: '2-3 hours',
    bestFor: 'Vehicles with rough paint, road film, bug residue, dirty wheels, and light exterior contamination.',
    badge: 'Best-Seller',
    highlight: true,
    image: '/gallery/takeout/20220520_195826.webp'
  },
  {
    id: 'paint-enhancement-polish',
    categoryId: 'exterior-detailing',
    name: 'Paint Enhancement Polish',
    shortDescription: 'Single-stage machine polishing for dull paint, light swirl marks, wash haze, oxidation, and improved gloss.',
    longDescription: 'Paint Enhancement Polish is for paint that looks dull, hazy, or lightly swirled from automatic car washes and poor washing. The service includes a prep wash, iron removal, clay bar treatment, single-stage machine polish, panel wipe, and paint sealant. It improves gloss and clarity but is not meant for deep scratch removal.',
    price: { car: 349, suv: 399, truck: 449, largeSuv: 499 },
    pricingType: 'fixed',
    squareName: 'Paint Enhancement Polish',
    seo: {
      title: 'Paint Polishing Bellevue NE | Restore Gloss in Omaha',
      description: 'Single-stage machine polishing in Bellevue and Omaha to reduce light swirl marks, improve clarity, and restore gloss to dull or hazy paint.'
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
    bestFor: 'Vehicles with dull paint, light swirls, wash haze, oxidation, or paint that needs gloss before protection.',
    badge: 'Paint Gloss',
    image: '/gallery/takeout/20230513_182328.webp'
  },

  // --- PAINT CORRECTION ---
  {
    id: 'paint-correction-l1',
    categoryId: 'paint-correction',
    name: 'Paint Correction (Level 1)',
    shortDescription: 'Single-stage, targeted paint improvement based on paint thickness, a test spot, and the defects that can be corrected safely.',
    longDescription: 'Paint Correction Level 1 is a single-stage, targeted machine-polishing service for light to moderate swirl marks, wash scratches, towel marks, and paint haze. The process includes paint decontamination, clay bar treatment, paint-thickness checks when needed, a test spot, machine polishing, panel inspection, and paint protection. It removes or reduces defects instead of hiding them with glaze. Final price is confirmed after texted photos and paint inspection; heavy oxidation or defects requiring additional stages are quoted separately before work.',
    price: { car: 499, suv: 549, truck: 599, largeSuv: 649 },
    pricingType: 'custom',
    squareName: 'Paint Correction (Level 1)',
    seo: {
      title: 'Level 1 Paint Correction | Bellevue & Omaha NE',
      description: 'Level 1 paint correction in Bellevue and Omaha for moderate swirl marks, wash haze, light scratches, improved clarity, and deeper gloss.'
    },
    features: ['Single-stage machine polishing', 'Paint decontamination', 'Swirl mark reduction', 'Panel wipe inspection', 'Paint depth check where needed'],
    duration: '6-8 hours',
    bestFor: 'Newer vehicles or well-maintained paint.',
    image: '/gallery/takeout/img_20210916_144041.webp'
  },
  {
    id: 'paint-correction-l2',
    categoryId: 'paint-correction',
    name: 'Paint Correction (Level 2)',
    shortDescription: 'Advanced two-stage compounding and polishing to remove heavy swirls and scratches.',
    longDescription: 'Paint Correction Level 2 is a two-stage machine polishing service for heavier swirl marks, deeper wash scratches, oxidation, and neglected paint. The process uses a compounding step to cut defects and a finishing polish to refine gloss. Deep scratches that are through the clear coat may improve but cannot always be fully removed safely.',
    price: { car: 550, suv: 650, truck: 750, largeSuv: 850 },
    pricingType: 'custom',
    squareName: 'Paint Correction (Level 2)',
    seo: {
      title: 'Two-Stage Paint Correction | Bellevue & Omaha NE',
      description: 'Two-stage paint correction in Bellevue and Omaha for heavier swirl marks, wash scratches, oxidation, improved clarity, and gloss restoration.'
    },
    features: ['Two-stage compounding and polishing', 'Heavy swirl mark reduction', 'Finishing polish for gloss', 'Ceramic coating prep available', 'Paint inspection under lighting'],
    duration: '1-2 Days',
    bestFor: 'Older vehicles or paint with visible swirl marks.',
    highlight: true,
    badge: 'Heavy Correction',
    image: '/gallery/takeout/20260502_192636.webp'
  },

  // --- SYSTEM X CERAMIC COATING ---
  {
    id: 'system-x-crystal-plus',
    categoryId: 'protection',
    name: 'System X Crystal+ Essential',
    shortDescription: 'Certified entry-level System X protection with paint preparation, gloss enhancement, CARFAX registration, and a 2-year warranty.',
    longDescription: 'Crystal+ Essential is the entry point to certified System X protection. The vehicle receives a safe wash, chemical and mechanical decontamination, light gloss enhancement, panel prep, and System X Crystal+ on painted surfaces. The coating is registered to CARFAX and carries a 2-year warranty when installed and maintained according to System X requirements.',
    price: { car: 699, suv: 799, truck: 899, largeSuv: 999 },
    pricingType: 'fixed',
    squareName: 'System X Crystal+ Essential',
    seo: {
      title: 'System X Crystal+ Ceramic Coating | Omaha & Bellevue',
      description: 'Certified System X Crystal+ ceramic coating in Bellevue and Omaha with paint decontamination, gloss enhancement, CARFAX registration, and a 2-year warranty.'
    },
    features: [
      'System X Crystal+ on painted surfaces',
      '2-year System X warranty registration',
      'CARFAX coating registration',
      'Wash, iron removal, and clay decontamination',
      'Light gloss-enhancement polish',
      'Panel prep and coating aftercare guide'
    ],
    duration: '1 Day',
    bestFor: 'First-time coating buyers, newer daily drivers, lease vehicles, and owners who want a straightforward entry-level System X package.',
    badge: 'Best Entry Value',
    image: '/gallery/takeout/20230513_182328.webp'
  },
  {
    id: 'system-x-pro-plus',
    categoryId: 'protection',
    name: 'System X Pro+ Signature',
    shortDescription: 'Best-value System X protection with paint enhancement, Pro+, Glass+ windshield coating, and up to 6 years of coverage.',
    longDescription: 'Pro+ Signature is the recommended package for a daily driver you plan to keep. It combines full decontamination, single-stage machine paint enhancement, panel prep, System X Pro+ on painted surfaces, and System X Glass+ on the windshield. Pro+ is an ultra-hydrophobic 9H coating offering up to 6 years of protection with CARFAX registration.',
    price: { car: 1099, suv: 1249, truck: 1399, largeSuv: 1549 },
    pricingType: 'fixed',
    squareName: 'System X Pro+ Signature',
    seo: {
      title: 'System X Pro+ Ceramic Coating Bellevue & Omaha | From $1,099',
      description: 'Certified System X Pro+ ceramic coating in Bellevue for Omaha-area vehicles with paint preparation, correction, Glass+, coating, and aftercare.'
    },
    features: [
      'System X Pro+ on painted surfaces',
      'Up to 6 years of System X protection',
      'CARFAX coating registration',
      'Single-stage machine paint enhancement',
      'System X Glass+ windshield coating',
      'Full decontamination, panel prep, and aftercare guide'
    ],
    duration: '1-2 Days',
    bestFor: 'Daily drivers, newer luxury vehicles, and owners who want the strongest balance of price, gloss, correction, and warranty length.',
    badge: 'Most Popular',
    highlight: true,
    image: '/gallery/takeout/20260502_192629.webp'
  },
  {
    id: 'system-x-max-g-plus',
    categoryId: 'protection',
    name: 'System X MAX G+ Ultimate',
    shortDescription: 'Lifetime-warranty System X protection with MAX G+ paint coating, correction, Wheel+, and Glass+ for a complete exterior system.',
    longDescription: 'MAX G+ Ultimate is a complete exterior protection package. It includes full decontamination, single-stage paint correction, System X MAX G+ on paint, badges, and applicable exterior trim, Wheel+ on wheel faces, and Glass+ on the windshield. MAX G+ is System X\'s highest-gloss single-component coating and is eligible for lifetime warranty registration on automotive applications.',
    price: { car: 1599, suv: 1749, truck: 1899, largeSuv: 2099 },
    pricingType: 'fixed',
    squareName: 'System X MAX G+ Ultimate',
    seo: {
      title: 'System X MAX G+ Ceramic Coating | Omaha & Bellevue',
      description: 'System X MAX G+ ceramic coating with paint correction, Wheel+, Glass+, CARFAX registration, and lifetime-warranty eligibility in Omaha and Bellevue.'
    },
    features: [
      'System X MAX G+ on paint, badges, and applicable trim',
      'Lifetime-warranty registration eligibility',
      'Single-stage paint correction included',
      'System X Wheel+ on wheel faces',
      'System X Glass+ on the windshield',
      'CARFAX registration and coating aftercare plan'
    ],
    duration: '2 Days',
    bestFor: 'High-value vehicles, long-term ownership, maximum gloss, and customers who want paint, wheel, and windshield protection in one package.',
    badge: 'Complete Exterior',
    image: '/gallery/takeout/20230513_182328.webp'
  },
  {
    id: 'system-x-phantom-2k',
    categoryId: 'protection',
    name: 'System X Phantom 2K Bespoke',
    shortDescription: 'Flagship two-part System X protection paired with deeper correction, Wheel+, Glass+, and a vehicle-specific finish plan.',
    longDescription: 'Phantom 2K Bespoke is the flagship package for owners who want the strongest System X automotive coating system. It combines a vehicle-specific one- or two-stage paint-correction plan with Phantom 2K on paint, badges, and applicable trim, Wheel+ on wheel faces, and Glass+ on the windshield. The final prep plan is confirmed after paint inspection because severe defects and specialty finishes require individualized preparation.',
    price: { car: 1999, suv: 2199, truck: 2399, largeSuv: 2599 },
    pricingType: 'custom',
    squareName: 'System X Phantom 2K Bespoke',
    seo: {
      title: 'System X Phantom 2K Ceramic Coating | Omaha',
      description: 'Flagship System X Phantom 2K ceramic coating with paint correction, Wheel+, Glass+, CARFAX registration, and a bespoke exterior protection plan.'
    },
    features: [
      'System X Phantom 2K two-part paint coating',
      'Vehicle-specific one- or two-stage correction plan',
      'System X Wheel+ on wheel faces',
      'System X Glass+ on the windshield',
      'Applicable badges and exterior trim coated',
      'CARFAX registration and detailed aftercare plan'
    ],
    duration: '2-3 Days',
    bestFor: 'Collector cars, specialty finishes, black vehicles, high-end builds, and owners who want the flagship System X coating rather than a one-size-fits-all package.',
    badge: 'Flagship',
    image: '/gallery/takeout/20260502_192629.webp'
  },

  // --- FULL DETAIL ---
  {
    id: 'full-detail-package',
    categoryId: 'full-detailing',
    name: 'Signature Full Detail',
    shortDescription: 'Full car detail package with interior cleaning, exterior hand wash, paint decontamination, and paint sealant.',
    longDescription: 'Signature Full Detail combines Signature Interior Detail with Premium Wash & Wax. It is the main full car detailing package for Bellevue and Omaha drivers who want the inside cleaned and the exterior washed, decontaminated, and protected in one appointment.',
    price: { car: 279, suv: 319, truck: 359, largeSuv: 399 },
    pricingType: 'fixed',
    squareName: 'Signature Full Detail',
    seo: {
      title: 'Full Car Detailing Bellevue & Omaha | From $279',
      description: 'Complete inside-and-out car detailing in Bellevue and Omaha with interior cleaning, exterior hand wash, decontamination, wheels, tires, and protection.'
    },
    features: [
      'Signature Interior Detail',
      'Premium Wash & Wax',
      'Wheel and tire cleaning',
      'Interior and exterior bundle pricing',
      'Complete inside-and-out detail'
    ],
    duration: '4-6 hours',
    bestFor: 'Vehicles that need interior cleaning and exterior detailing in one appointment.',
    badge: 'Best Value',
    image: '/gallery/takeout/20230507_162319.webp'
  },
  {
    id: 'showroom-package',
    categoryId: 'full-detailing',
    name: 'Showroom Package',
    shortDescription: 'Interior restoration and exterior machine polishing for neglected vehicles, used cars, and pre-sale prep.',
    longDescription: 'The Showroom Package combines Interior Restoration with Paint Enhancement Polish. It is built for vehicles that need hot-water extraction, stain treatment, pet-hair removal, odor-source cleaning, exterior decontamination, and single-stage machine polishing before sale or regular use.',
    price: { car: 499, suv: 549, truck: 599, largeSuv: 649 },
    pricingType: 'fixed',
    squareName: 'Showroom Package',
    seo: {
      title: 'Showroom Detail Package Bellevue & Omaha | From $499',
      description: 'A major interior and exterior improvement package in Bellevue and Omaha with interior restoration, decontamination, and machine polishing.'
    },
    features: [
      'Interior Restoration',
      'Machine Paint Enhancement Polish',
      'Improves paint gloss and clarity',
      'Engine bay cleaning',
      'Odor source cleaning and fabric protection',
      'Pre-sale vehicle prep'
    ],
    duration: '6-8 hours',
    bestFor: 'Pre-sale prep, used car purchases, neglected interiors, and dull paint.',
    highlight: true,
    image: '/gallery/takeout/20220520_195826.webp'
  },

  // --- MAINTENANCE ---
  {
    id: 'maintenance-detail',
    categoryId: 'maintenance',
    name: 'Maintenance Plan',
    shortDescription: 'Routine maintenance detail for vehicles that have already been professionally cleaned, corrected, or ceramic coated.',
    longDescription: 'Maintenance Plan is for existing clients or recently detailed vehicles. It includes a safe hand wash, quick interior vacuum, interior wipe down, glass cleaning, tire dressing, and spray sealant refresh so the vehicle stays cleaner between full details.',
    price: { car: 119, suv: 139, truck: 159, largeSuv: 179 },
    pricingType: 'fixed',
    squareName: 'Maintenance Plan',
    seo: {
      title: 'Maintenance Car Detailing | Bellevue & Omaha NE',
      description: 'Maintenance detailing for ceramic-coated or recently detailed vehicles with a safe wash, interior upkeep, glass cleaning, and protection refresh.'
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
    bestFor: 'Existing clients, ceramic coated vehicles, and recently detailed vehicles.',
    image: '/gallery/takeout/20230420_162911.webp'
  },

  // --- RV & BOAT ---
  {
    id: 'rv-boat-wash-wax',
    categoryId: 'rv-boat-detailing',
    name: 'RV / Boat Wash & Wax',
    shortDescription: 'RV and boat wash and wax with bug removal, exterior wash, and UV sealant protection.',
    longDescription: 'RV / Boat Wash & Wax is $22 per foot with a $250 minimum. It includes exterior washing, bug removal, wheel and arch cleaning, roof washing where safely accessible, and sealant protection. Final price is confirmed after texted photos and the length, height, access, and condition are reviewed. Heavy oxidation, black streaks, mold, or excessive buildup is quoted separately before work.',
    price: { rv: 22 },
    pricingType: 'variable',
    squareName: 'RV / Boat Wash & Wax',
    seo: {
      title: 'RV & Boat Wash and Wax | Bellevue & Omaha',
      description: 'RV and boat wash and wax around Bellevue and Omaha with bug removal, accessible roof cleaning, wheel cleaning, and UV-resistant protection.'
    },
    features: [
      'Exterior hand wash',
      'Roof wash (where accessible)',
      'Wheels & arches cleaned',
      'Bug & insect removal',
      'Sealant or wax UV protection'
    ],
    duration: '4-6 hours',
    isSpecialty: true,
    bestFor: 'RVs, campers, trailers, and boats that need exterior cleaning, bug removal, and fresh UV-resistant protection.',
    image: '/gallery/takeout/20250421_150404.webp'
  },
  {
    id: 'rv-boat-oxidation',
    categoryId: 'rv-boat-detailing',
    name: 'Oxidation Removal (RV/Boat)',
    shortDescription: 'Machine compounding and polishing for chalky, faded, oxidized RV and boat gel coat.',
    longDescription: 'Oxidation Removal is $40 per foot with a $500 minimum for RVs and boats with chalky, faded, or oxidized gel coat. The process includes wash prep, machine compounding, polishing, and sealant protection. Final price is confirmed after texted photos and inspection. Severe oxidation can improve significantly but may not return to new condition.',
    price: { rv: 40 },
    pricingType: 'variable',
    squareName: 'Oxidation Removal (RV/Boat)',
    seo: {
      title: 'RV & Boat Oxidation Removal | Omaha & Bellevue',
      description: 'Machine compounding and polishing for chalky, faded, oxidized RV and boat gel coat around Bellevue and the Omaha metro.'
    },
    features: [
      'Heavy compound process',
      'Machine surface restoration',
      'Gloss recovery polishing',
      'Sealant application',
      'Improvement-focused restoration'
    ],
    duration: '1-2 Days',
    isSpecialty: true,
    bestFor: 'Chalky, faded, or oxidized RV and boat gel coat that needs machine compounding and gloss restoration.',
    badge: 'Restoration',
    image: '/gallery/takeout/20250421_150404.webp'
  },

  // --- TRACTOR / FARM ---
  {
    id: 'tractor-detailing-service',
    categoryId: 'tractor-detailing',
    name: 'Tractor / Equipment Cleanup',
    shortDescription: 'Tractor and equipment cleaning for mud, grease, dust, cab interiors, glass, and exterior buildup.',
    longDescription: 'Tractor / Equipment Cleanup is performed at the customer\'s location and has a $250 minimum covering up to the first two hours, then costs $150 per additional hour. The customer must provide a safe, suitable work area with water and standard electrical access. Final price is confirmed after texted photos; heavy mud, grease, access limitations, and disposal requirements are quoted before work.',
    price: { tractor: 250 },
    pricingType: 'custom',
    squareName: 'Tractor / Equipment Cleanup',
    seo: {
      title: 'Tractor & Equipment Detailing | Omaha & Bellevue',
      description: 'Mobile tractor and equipment cleaning around Bellevue and Omaha with safe degreasing, pressure washing, cab cleanup, and glass cleaning.'
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
    bestFor: 'Tractors, farm equipment, and work vehicles with mud, grease, dust, dirty glass, or cab buildup.',
    badge: 'Equipment Cleaning',
    image: ''
  },

  // --- NEW SERVICES ---
  {
    id: 'new-car-detail',
    categoryId: 'full-detailing',
    name: 'New Car Detail & Protection',
    shortDescription: 'New vehicle detail with paint decontamination, light polishing, and sealant or ceramic coating protection.',
    longDescription: 'New does not always mean perfect. Dealer prep, transport scratches, and contamination from sitting on a lot can leave light defects on a new vehicle. My New Car Detail addresses that buildup with a full decontamination wash, light paint correction when needed, and a professional sealant or ceramic coating for added protection. Final prep is based on the vehicle\'s condition.',
    price: { car: 349, suv: 399, truck: 449, largeSuv: 499 },
    pricingType: 'custom',
    squareName: 'New Car Detail & Protection',
    seo: {
      title: 'New Car Detailing & Protection | Omaha & Bellevue',
      description: 'New-car detailing in Bellevue and Omaha with paint decontamination, light polishing, and sealant or ceramic-coating protection from day one.'
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
    bestFor: 'Brand-new vehicles from the dealership that need paint prep and protection before daily driving.',
    badge: 'New Car Special',
    highlight: true,
    image: '/gallery/takeout/fb_img_1669760742808.webp'
  },
  {
    id: 'pre-sale-detail',
    categoryId: 'full-detailing',
    name: 'Pre-Sale Detail Package',
    shortDescription: 'Pre-sale car detailing with interior shampoo, odor source cleaning, exterior machine polish, and photo-ready finishing.',
    longDescription: 'Pre-Sale Detail Package is for sellers who want the vehicle clean before listing photos, trade-in, or private showings. The service includes interior shampoo, hot water extraction where needed, odor source cleaning, exterior wash, paint enhancement polish, engine bay cleaning, glass cleaning, and tire dressing.',
    price: { car: 399, suv: 449, truck: 499, largeSuv: 549 },
    pricingType: 'fixed',
    squareName: 'Pre-Sale Detail Package',
    seo: {
      title: 'Pre-Sale Car Detailing | Omaha & Bellevue NE',
      description: 'Pre-sale detailing in Bellevue and Omaha with interior shampoo, extraction, exterior machine polishing, engine-bay cleaning, and photo-ready finishing.'
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
    image: '/gallery/takeout/20250823_084022.webp'
  },
  {
    id: 'odor-elimination',
    categoryId: 'interior-detailing',
    name: 'Odor Elimination Treatment',
    shortDescription: 'Odor treatment for smoke, pet odor, mildew smell, food spills, and used-car interior odors.',
    longDescription: 'Standalone Odor Elimination Treatment starts with a full interior detail and cleaning of the odor source, followed by targeted cleaning, enzyme treatment when needed, HVAC deodorizing, and controlled ozone treatment. It is intended for smoke smell, pet odor, mildew smell, food spills, and used-car odors. Final price is confirmed after texted photos. Water leaks, mold, biohazards, or active contamination must be corrected or separately quoted before work because the odor can return.',
    price: { car: 299, suv: 329, truck: 359, largeSuv: 389 },
    pricingType: 'fixed',
    squareName: 'Odor Elimination Treatment',
    seo: {
      title: 'Car Odor Removal | Bellevue & Omaha NE',
      description: 'Car odor treatment in Bellevue and Omaha for smoke, pets, food spills, mildew smells, and used-car odors after the source is properly cleaned.'
    },
    features: [
      'Full interior detail & vacuum first',
      'Enzyme pre-treatment on problem areas',
      'Controlled ozone treatment',
      'HVAC & vent system deodorization',
      'Headliner & carpet odor penetration',
      'Odor treatment instead of air freshener'
    ],
    duration: '4-5 hours',
    bestFor: 'Vehicles with smoke damage, pet accidents, mildew/flood history, or strong food odors that won\'t go away.',
    badge: 'Odor Treatment',
    image: '/gallery/takeout/20210629_204608.webp'
  },
  {
    id: 'ppf-inquiry',
    categoryId: 'protection',
    name: 'Paint Protection Film (PPF)',
    shortDescription: 'Paint Protection Film inquiry for rock chip protection on bumpers, hoods, mirrors, fenders, and high-impact areas.',
    longDescription: 'Paint Protection Film (PPF) is clear urethane film installed on high-impact paint areas such as the front bumper, hood, fenders, mirrors, and door cups. PPF helps reduce rock chips and road debris damage. Ceramic coating can be added over film for easier cleaning. Contact Bryan for coverage options and a custom quote.',
    price: { car: 0 },
    pricingType: 'custom',
    squareName: 'Paint Protection Film (PPF)',
    seo: {
      title: 'Paint Protection Film (PPF) | Omaha & Bellevue NE',
      description: 'Ask about paint protection film for bumpers, hoods, mirrors, fenders, and other high-impact areas in Bellevue and Omaha. Custom quote required.'
    },
    features: [
      'Self-healing urethane film technology',
      'Helps reduce exposure to rock chips and road debris',
      'Clear film designed to remain discreet when properly installed',
      'Self-healing behavior depends on the film and conditions',
      'Can be paired with ceramic coating for easier maintenance',
      'Custom quote based on coverage area'
    ],
    duration: '1-3 Days',
    bestFor: 'New vehicles, high-end cars, or anyone driving on highways where rock chips are a constant concern.',
    badge: 'Coming Soon — Inquire',
    image: '/gallery/takeout/20260502_192711.webp'
  }
];
