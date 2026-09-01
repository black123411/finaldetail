export interface CustomerServiceOption {
  serviceId: string;
  displayName?: string;
  fitLabel: string;
  customerDescription: string;
  customerHighlights?: string[];
  recommended?: boolean;
}

export interface CustomerServiceGroup {
  id: string;
  label: string;
  title: string;
  description: string;
  services: CustomerServiceOption[];
}

export const CUSTOMER_SERVICE_GROUPS: CustomerServiceGroup[] = [
  {
    id: 'interior',
    label: 'Interior',
    title: 'Interior Detailing',
    description: 'Already clean? Choose Maintenance. Normal daily dirt and light spots? Choose Signature. Need shampoo, extraction, or heavy cleanup? Choose Restoration.',
    services: [
      {
        serviceId: 'maintenance-interior',
        fitLabel: 'Already clean — upkeep only',
        customerDescription: 'Choose this only when the interior is already in good condition. It is a thorough vacuum and surface wipe-down—not a deep clean—and does not include shampoo, extraction, heavy stains, spills, odors, or pet-hair cleanup.',
        customerHighlights: [
          'Thorough vacuum and compressed-air blowout',
          'Dash, console, doors, plastics, mats, and glass wiped clean',
          'No shampoo, extraction, or heavy-condition cleanup',
        ],
      },
      {
        serviceId: 'interior-detail',
        fitLabel: 'Normal daily use — recommended',
        customerDescription: 'Choose this for a regularly used vehicle that needs a complete interior clean, not just upkeep. It adds detailed cleaning of cupholders, pockets, door panels, mats, and light stain spot treatment, but not full carpet or seat extraction.',
        customerHighlights: [
          'Everything needed for normal dust, crumbs, dirty mats, and buildup',
          'Detailed cupholders, console, door panels, pockets, and jambs',
          'Light stain spot treatment; no full fabric extraction',
        ],
        recommended: true,
      },
      {
        serviceId: 'interior-reset',
        fitLabel: 'Neglected or heavily soiled',
        customerDescription: 'Choose this when Signature is not enough. It adds shampoo and hot-water extraction for spills, fabric stains, embedded dirt, and typical heavy pet hair, with several extra hours for deeper cleaning.',
        customerHighlights: [
          'Includes the Signature Interior Detail cleaning steps',
          'Carpet and upholstery shampoo with hot-water extraction',
          'Heavy stains, spills, embedded dirt, and typical heavy pet hair',
        ],
      },
    ],
  },
  {
    id: 'full-detail',
    label: 'Full Details',
    title: 'Full Details',
    description: 'Two clear inside-and-out choices: a complete routine detail or the larger restoration and paint-improvement package.',
    services: [
      {
        serviceId: 'full-detail-package',
        fitLabel: 'Complete inside and out',
        customerDescription: 'Signature interior cleaning plus exterior decontamination and protection in one appointment.',
        recommended: true,
      },
      {
        serviceId: 'showroom-package',
        fitLabel: 'Bigger transformation',
        customerDescription: 'Interior restoration plus machine paint enhancement for a vehicle that needs a major improvement.',
      },
    ],
  },
  {
    id: 'paint',
    label: 'Paint',
    title: 'Paint Correction',
    description: 'Choose an enhancement for gloss and light swirls, or paint correction for more visible defects after a safe paint assessment.',
    services: [
      {
        serviceId: 'paint-enhancement-polish',
        displayName: 'Paint Enhancement',
        fitLabel: 'Gloss and light-defect improvement',
        customerDescription: 'For dull paint, wash haze, light swirl marks, and oxidation that needs a single-stage polish.',
      },
      {
        serviceId: 'paint-correction-l1',
        displayName: 'Paint Correction',
        fitLabel: 'More visible paint defects',
        customerDescription: 'For moderate swirl marks, wash scratches, haze, and defects that can be corrected safely.',
        recommended: true,
      },
    ],
  },
  {
    id: 'ceramic',
    label: 'Ceramic',
    title: 'Ceramic Coating',
    description: 'Current certified System X packages, preparation, coverage, and pricing remain unchanged.',
    services: [
      {
        serviceId: 'system-x-crystal-plus',
        fitLabel: 'Entry System X protection',
        customerDescription: 'A straightforward certified coating package with paint preparation and registered protection.',
      },
      {
        serviceId: 'system-x-pro-plus',
        fitLabel: 'Most popular System X package',
        customerDescription: 'The strongest balance of paint enhancement, gloss, warranty length, and everyday protection.',
        recommended: true,
      },
      {
        serviceId: 'system-x-max-g-plus',
        fitLabel: 'Complete exterior protection',
        customerDescription: 'A long-term paint, wheel-face, and windshield protection package with correction included.',
      },
      {
        serviceId: 'system-x-phantom-2k',
        fitLabel: 'Flagship coating package',
        customerDescription: 'A vehicle-specific flagship System X package for specialty finishes and high-end builds.',
      },
    ],
  },
];

export const SPECIALTY_SERVICE_OPTIONS = [
  {
    id: 'odor-treatment',
    title: 'Odor treatment',
    description: 'Smoke, pet, food, mildew, or used-car odors after the source is reviewed.',
    serviceId: 'odor-elimination',
  },
  {
    id: 'water-intrusion-mold',
    title: 'Water intrusion / mold',
    description: 'Photo review is required so active leaks, moisture, mold, and material condition can be addressed responsibly.',
  },
  {
    id: 'biohazard-contamination',
    title: 'Biohazard / severe contamination',
    description: 'The condition and safety requirements must be reviewed before scope, acceptance, and price can be confirmed.',
  },
  {
    id: 'unusual-pet-hair',
    title: 'Unusual heavy pet hair',
    description: 'Send photos when pet hair is deeply embedded or far beyond a typical interior-restoration appointment.',
  },
  {
    id: 'rv-boat',
    title: 'RV / boat',
    description: 'Length, height, access, material, oxidation, and current condition determine the correct service and labor.',
    serviceId: 'rv-boat-wash-wax',
  },
  {
    id: 'tractor-equipment',
    title: 'Tractor / equipment',
    description: 'Photos help confirm equipment size, buildup, access, surface condition, and the result you want.',
    serviceId: 'tractor-detailing-service',
  },
  {
    id: 'unusual-restoration',
    title: 'Severe oxidation / unusual restoration work',
    description: 'A condition review is needed before choosing a safe correction process or setting expectations.',
    serviceId: 'rv-boat-oxidation',
  },
] as const;
