import { ServiceDetail } from '@/shared/types';

export const SERVICES: ServiceDetail[] = [
  // Interior
  {
    id: "int-refresh",
    name: "Interior Refresh",
    description: "A solid cleaning for well-maintained vehicles. I'll vacuum, wipe down surfaces, and clean the glass.",
    priceMin: 129,
    priceMax: 179,
    squareId: "interior-refresh",
    category: "Interior"
  },
  {
    id: "int-detail",
    name: "Interior Detail",
    description: "The standard for a like-new feel. Includes steam cleaning, shampooing, and leather conditioning.",
    priceMin: 199,
    priceMax: 249,
    squareId: "interior-detail",
    category: "Interior",
    popular: true
  },
  {
    id: "int-reset",
    name: "Interior Reset",
    description: "For vehicles that need professional restoration. Deep stain removal, odor neutralizer, and full sanitization.",
    priceMin: 269,
    priceMax: 329,
    squareId: "interior-reset",
    category: "Interior"
  },

  // Exterior
  {
    id: "ext-detail",
    name: "Exterior Detail",
    description: "Deep wash, decontamination, and a high-grade sealant for protection.",
    priceMin: 79,
    priceMax: 119,
    squareId: "exterior-detail",
    category: "Exterior"
  },
  {
    id: "ext-enhancement",
    name: "Exterior Enhancement",
    description: "Removes light oxidation and restores depth to your paint with a one-step polish.",
    priceMin: 149,
    priceMax: 199,
    squareId: "exterior-enhancement",
    category: "Exterior"
  },

  // Paint Correction
  {
    id: "paint-l1",
    name: "Paint Correction Level 1",
    description: "Removes 50-70% of swirls and scratches. Perfect for daily drivers.",
    priceMin: 250,
    priceMax: 350,
    squareId: "paint-correction-l1",
    category: "Paint"
  },
  {
    id: "paint-l2",
    name: "Paint Correction Level 2",
    description: "Two-stage correction removing 85%+ of defects. Near-perfect finish.",
    priceMin: 400,
    priceMax: 600,
    squareId: "paint-correction-l2",
    category: "Paint"
  },

  // Ceramic Coating
  { id: "system-x-crystal-plus", name: "System X Crystal+ Essential", description: "Certified entry System X protection with a 2-year warranty.", priceMin: 699, priceMax: 999, squareId: "system-x-crystal-plus", category: "Ceramic" },
  { id: "system-x-pro-plus", name: "System X Pro+ Signature", description: "Paint enhancement, Pro+, and Glass+ with up to 6 years of protection.", priceMin: 1099, priceMax: 1549, squareId: "system-x-pro-plus", category: "Ceramic", popular: true },
  { id: "system-x-max-g-plus", name: "System X MAX G+ Ultimate", description: "Lifetime-warranty eligible coating with correction, Wheel+, and Glass+.", priceMin: 1599, priceMax: 2099, squareId: "system-x-max-g-plus", category: "Ceramic" },
  { id: "system-x-phantom-2k", name: "System X Phantom 2K Bespoke", description: "Flagship two-part coating with a vehicle-specific correction plan.", priceMin: 1999, priceMax: 2599, squareId: "system-x-phantom-2k", category: "Ceramic" },

  // Packages
  {
    id: "pkg-full",
    name: "Full Detail Package",
    description: "The complete package. Full interior detail and full exterior detail combined.",
    priceMin: 299,
    priceMax: 379,
    squareId: "full-detail-package",
    category: "Package"
  },
  {
    id: "pkg-showroom",
    name: "Showroom Package",
    description: "The gold standard. Full detail plus paint enhancement and premium interior protection.",
    priceMin: 399,
    priceMax: 549,
    squareId: "showroom-package",
    category: "Package",
    popular: true
  },

  // Maintenance
  {
    id: "maint-plan",
    name: "Maintenance Plan",
    description: "Regular upkeep to keep that showroom shine. *Only after a full detail.",
    priceMin: 99,
    priceMax: 179,
    squareId: "maintenance-plan",
    category: "Maintenance"
  }
];

export const SQUARE_BOOKING_URL = "/book";
