export interface CityPage {
  slug: string;
  name: string;
  type: 'primary' | 'secondary';
  seo: { title: string; description: string };
  content: {
    featuredServiceIds?: string[];
    title: string;
    intro: string;
    servicesLabel: string;
    whyLabel: string;
    whyPoints: string[];
    serviceAreas: string[];
    cta: string;
  };
}

export const CITIES: CityPage[] = [
  {
    slug: 'omaha-ne',
    name: 'Omaha, NE',
    type: 'primary',
    seo: {
      title: 'Car Detailing Omaha, NE | Mobile Auto Detailing',
      description: 'Mobile car detailing in Omaha, NE for interiors, full details, paint correction and ceramic coatings, with Bellevue drop-off available for longer services.'
    },
    content: {
      featuredServiceIds: ['interior-detail', 'full-detail-package', 'paint-enhancement-polish', 'paint-correction-l1', 'system-x-crystal-plus', 'pre-sale-detail'],
      title: 'Mobile Car Detailing in Omaha, NE',
      intro: 'I provide professional mobile car detailing throughout Omaha for cars, trucks and SUVs. Services include interior detailing, complete inside-and-out details, paint enhancement, paint correction and System X ceramic coating preparation. Mobile appointments are available when the service, weather and work area are suitable, with appointment-only Bellevue drop-off available for longer or weather-sensitive work.',
      servicesLabel: 'Popular Car Detailing Services in Omaha',
      whyLabel: 'Why Omaha customers choose Bryan',
      whyPoints: [
        'Owner-operated detailing with direct communication from the person doing the work',
        'Mobile appointments throughout Omaha when the service and work area are suitable',
        'Clear starting prices with condition-related work discussed before it is added',
        'Paint correction based on inspection and a test spot rather than a one-size-fits-all promise',
        'Certified System X ceramic coating with Bellevue drop-off available for longer services'
      ],
      serviceAreas: ['West Omaha', 'Midtown Omaha', 'South Omaha', 'Bellevue', 'Papillion', 'La Vista'],
      cta: 'Check Omaha Availability'
    }
  },
  {
    slug: 'bellevue-ne',
    name: 'Bellevue, NE',
    type: 'primary',
    seo: {
      title: 'Car Detailing Bellevue, NE | Mobile & Drop-Off',
      description: 'Car detailing in Bellevue, NE with mobile and appointment-only drop-off options. Interior detailing, full details, paint correction and ceramic coatings.'
    },
    content: {
      featuredServiceIds: ['interior-detail', 'full-detail-package', 'paint-correction-l1', 'system-x-crystal-plus', 'new-car-detail', 'maintenance-detail'],
      title: 'Car Detailing in Bellevue, NE',
      intro: 'Bryan\'s Showroom Quality Detailing is based in Bellevue and has served Bellevue and the Omaha metro since 2017. I provide interior detailing, full details, exterior detailing, paint correction and certified System X ceramic coatings. Bellevue customers can choose mobile service for qualifying appointments or appointment-only drop-off for longer, weather-sensitive and paint-protection services.',
      servicesLabel: 'Car Detailing Services in Bellevue',
      whyLabel: 'Why Bellevue drivers choose Bryan',
      whyPoints: [
        'Based in Bellevue and owner-operated since 2017',
        'Mobile service and appointment-only Bellevue drop-off options',
        'Interior detailing for normal daily use through heavier restoration work',
        'Professional paint correction and certified System X ceramic coating installation',
        'Clear recommendations based on the actual condition of the vehicle'
      ],
      serviceAreas: ['Bellevue', 'Offutt AFB', 'Fontenelle Hills', 'Papillion', 'La Vista'],
      cta: 'Check Bellevue Availability'
    }
  },
  {
    slug: 'papillion-ne',
    name: 'Papillion, NE',
    type: 'secondary',
    seo: {
      title: 'Car Detailing Papillion, NE | Mobile Detailing',
      description: 'Mobile car detailing in Papillion, NE for interior details, full details, paint correction and ceramic coating, with Bellevue drop-off options available.'
    },
    content: {
      featuredServiceIds: ['interior-detail', 'full-detail-package', 'new-car-detail', 'maintenance-detail'],
      title: 'Car Detailing in Papillion, NE',
      intro: 'I provide mobile car detailing in Papillion for drivers who want professional interior cleaning, complete detailing and paint care without making an unnecessary trip across the metro. Many interior and full-detail appointments can be completed at your home or workplace when there is a suitable work area. Bellevue drop-off is available for longer services, paint correction and ceramic coating.',
      servicesLabel: 'Detailing Services for Papillion Vehicles',
      whyLabel: 'What Papillion customers can expect',
      whyPoints: [
        'Mobile detailing at qualifying Papillion homes and workplaces',
        'Interior services matched to the actual condition of the vehicle',
        'Full-detail options for customers who want the inside and outside handled together',
        'New-car paint preparation, correction and coating options',
        'Bellevue drop-off available when controlled working conditions are a better fit'
      ],
      serviceAreas: ['Papillion', 'Shadow Lake area', 'La Vista', 'Bellevue', 'Sarpy County'],
      cta: 'Check Papillion Availability'
    }
  },
  {
    slug: 'la-vista-ne',
    name: 'La Vista, NE',
    type: 'secondary',
    seo: {
      title: 'Car Detailing La Vista, NE | Mobile Detailing',
      description: 'Mobile car detailing in La Vista, NE for interior cleaning, full details, exterior paint care and odor treatment, with Bellevue drop-off when needed.'
    },
    content: {
      featuredServiceIds: ['interior-detail', 'full-detail-package', 'maintenance-detail', 'odor-elimination'],
      title: 'Car Detailing in La Vista, NE',
      intro: 'I provide mobile car detailing throughout La Vista for vehicles that need professional interior cleaning, complete detailing or exterior paint care. La Vista is close enough to Bellevue that appointment-only drop-off is also practical for longer services, odor work and weather-sensitive jobs.',
      servicesLabel: 'Interior, Full and Exterior Detailing in La Vista',
      whyLabel: 'Why La Vista customers choose Bryan',
      whyPoints: [
        'Mobile service for qualifying appointments at your La Vista location',
        'Interior detailing for family vehicles, pet hair, stains and everyday buildup',
        'Complete full-detail packages for interior and exterior work together',
        'Odor-source cleaning and treatment when a normal detail is not enough',
        'Bellevue drop-off available for longer or weather-sensitive services'
      ],
      serviceAreas: ['La Vista', 'Papillion', 'Ralston', 'Bellevue', 'South Omaha'],
      cta: 'Check La Vista Availability'
    }
  },
  {
    slug: 'ralston-ne',
    name: 'Ralston, NE',
    type: 'secondary',
    seo: {
      title: 'Car Detailing Ralston, NE | Mobile Auto Detailing',
      description: 'Mobile car detailing in Ralston, NE for interior detailing, full details and exterior paint care, with Bellevue drop-off available for longer services.'
    },
    content: {
      featuredServiceIds: ['interior-detail', 'interior-reset', 'full-detail-package', 'paint-correction-l1'],
      title: 'Car Detailing in Ralston, NE',
      intro: 'I provide mobile detailing for Ralston customers who need interior cleaning, complete detailing and exterior paint care. Interior services range from routine upkeep to heavier restoration, while paint services are selected after looking at the finish and the defects that can be improved safely.',
      servicesLabel: 'Car Detailing Services for Ralston Drivers',
      whyLabel: 'What Ralston customers get',
      whyPoints: [
        'Mobile appointments for qualifying Ralston locations',
        'Interior detailing from routine cleaning through heavier restoration',
        'Full-detail packages for inside-and-out vehicle care',
        'Paint correction based on inspection, defect depth and a test spot',
        'Bellevue drop-off available for longer paint and protection services'
      ],
      serviceAreas: ['Ralston', 'Bellevue', 'La Vista', 'South Omaha'],
      cta: 'Check Ralston Availability'
    }
  },
  {
    slug: 'gretna-ne',
    name: 'Gretna, NE',
    type: 'secondary',
    seo: {
      title: 'Car Detailing Gretna, NE | Mobile Auto Detailing',
      description: 'Mobile car detailing in Gretna, NE for interior detailing, full details, new-car protection and ceramic coating, with Bellevue drop-off available.'
    },
    content: {
      featuredServiceIds: ['interior-detail', 'full-detail-package', 'new-car-detail', 'system-x-crystal-plus'],
      title: 'Car Detailing in Gretna, NE',
      intro: 'I serve Gretna and western Sarpy County with mobile interior detailing, full details and paint-care services. Mobile appointments work well for many normal detailing jobs, while new-car protection, paint correction and ceramic coating may be better suited to appointment-only Bellevue drop-off.',
      servicesLabel: 'Detailing Services for Gretna and Sarpy County',
      whyLabel: 'Why Gretna customers choose Bryan',
      whyPoints: [
        'Mobile service at qualifying Gretna homes and workplaces',
        'Interior and full-detail options for family vehicles, SUVs and trucks',
        'New-car paint preparation before sealant or ceramic coating',
        'System X ceramic coating with preparation based on the paint condition',
        'Clear recommendations before additional condition-related work is performed'
      ],
      serviceAreas: ['Gretna', 'Springfield', 'Papillion', 'Bellevue', 'Sarpy County'],
      cta: 'Check Gretna Availability'
    }
  },
  {
    slug: 'elkhorn-ne',
    name: 'Elkhorn, NE',
    type: 'secondary',
    seo: {
      title: 'Car Detailing Elkhorn, NE | Paint Correction & Ceramic',
      description: 'Car detailing in Elkhorn, NE with mobile service for interior details plus paint correction, new-car protection and certified System X ceramic coatings.'
    },
    content: {
      featuredServiceIds: ['new-car-detail', 'paint-correction-l2', 'system-x-pro-plus', 'interior-detail'],
      title: 'Car Detailing in Elkhorn, NE',
      intro: 'I provide detailing for Elkhorn and West Omaha vehicles, including mobile interior detailing, new-car paint preparation, paint correction and certified System X ceramic coating. For paint work, I inspect the finish and determine the preparation needed before confirming the final correction or coating plan.',
      servicesLabel: 'Paint Care, Protection and Detailing in Elkhorn',
      whyLabel: 'Why Elkhorn customers choose Bryan',
      whyPoints: [
        'Certified System X ceramic coating with vehicle-specific paint preparation',
        'Paint correction selected after inspection and a test spot',
        'New-car detailing for bonded contamination and dealer-prep defects',
        'Mobile interior detailing available at qualifying Elkhorn locations',
        'Bellevue drop-off for longer correction and coating appointments'
      ],
      serviceAreas: ['Elkhorn', 'West Omaha', 'Waterloo', 'Valley', 'Douglas County'],
      cta: 'Request Elkhorn Availability'
    }
  },
  {
    slug: 'council-bluffs-ia',
    name: 'Council Bluffs, IA',
    type: 'secondary',
    seo: {
      title: 'Car Detailing Council Bluffs, IA | Mobile Service',
      description: 'Mobile car detailing in Council Bluffs, IA for interior detailing, full details, exterior decontamination and paint care, with Bellevue drop-off available.'
    },
    content: {
      featuredServiceIds: ['interior-detail', 'full-detail-package', 'exterior-enhancement', 'paint-correction-l1'],
      title: 'Car Detailing in Council Bluffs, IA',
      intro: 'I provide mobile detailing in Council Bluffs for customers who need interior cleaning, complete detailing and exterior paint care. Year-round driving in the metro can leave road film, bonded contamination, dirty wheels and winter residue behind, so exterior decontamination and paint protection are common needs in addition to interior work.',
      servicesLabel: 'Car Detailing Services in Council Bluffs',
      whyLabel: 'What Council Bluffs customers can expect',
      whyPoints: [
        'Mobile service in Council Bluffs when there is enough safe working space',
        'Interior detailing for daily buildup, stains, spills and pet hair',
        'Exterior decontamination for road film, bonded contamination and winter residue',
        'Paint correction for eligible swirls, haze and wash damage',
        'Bellevue drop-off available for longer paint and protection services'
      ],
      serviceAreas: ['Council Bluffs', 'Carter Lake', 'Omaha border area', 'Bellevue'],
      cta: 'Check Council Bluffs Availability'
    }
  },
  {
    slug: 'offutt-afb-ne',
    name: 'Offutt AFB',
    type: 'secondary',
    seo: {
      title: 'Car Detailing Offutt AFB, NE | Mobile Detailing',
      description: 'Mobile car detailing near Offutt AFB in Bellevue, NE. Interior detailing, full details, paint care and convenient appointment options for local vehicles.'
    },
    content: {
      featuredServiceIds: ['interior-detail', 'full-detail-package', 'pre-sale-detail', 'new-car-detail'],
      title: 'Car Detailing Near Offutt AFB, NE',
      intro: 'Bryan\'s Showroom Quality Detailing is based in Bellevue near Offutt AFB. I provide mobile and appointment-based detailing for vehicles in the surrounding Bellevue and Offutt area, including interior detailing, full details, pre-sale work, new-car protection and paint-care services.',
      servicesLabel: 'Detailing Services Near Offutt AFB',
      whyLabel: 'Why Offutt-area customers choose Bryan',
      whyPoints: [
        'Bellevue-based owner-operated detailing close to Offutt AFB',
        'Mobile appointments when there is a suitable work area and service conditions allow',
        'Interior and full-detail packages for daily drivers and family vehicles',
        'Pre-sale and new-car services for vehicles being sold, traded or recently purchased',
        'Bellevue drop-off available for longer or weather-sensitive work'
      ],
      serviceAreas: ['Offutt AFB', 'Bellevue', 'Papillion', 'La Vista'],
      cta: 'Check Offutt-Area Availability'
    }
  }
];
