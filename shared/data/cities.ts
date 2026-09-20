export interface CityProjectImage {
  src: string;
  alt: string;
}

export interface CityProject {
  title: string;
  intro: string;
  vehicle?: string;
  service: string;
  location: string;
  images: CityProjectImage[];
  links: Array<{ label: string; href: string }>;
}

export interface CityServiceSection {
  title: string;
  body: string;
  href: string;
  linkLabel: string;
}

export interface CityFaq {
  question: string;
  answer: string;
}

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
    serviceSections?: CityServiceSection[];
    projects?: CityProject[];
    faqs?: CityFaq[];
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
      intro: 'I provide professional car detailing throughout Omaha for cars, trucks and SUVs, with mobile appointments available when the service, weather and work area are suitable. Services range from interior detailing and complete inside-and-out details to paint enhancement, paint correction and System X ceramic coatings. For longer paint-correction, ceramic-coating or weather-sensitive appointments, Bellevue drop-off is also available by appointment.',
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
      cta: 'Check Omaha Availability',
      serviceSections: [
        {
          title: 'Interior Detailing in Omaha',
          body: 'For daily-driver interiors with dust, crumbs, dirty mats and normal buildup, I match the cleaning level to the vehicle condition. Deeper restoration options are available for heavier stains, pet hair, spills and neglected interiors.',
          href: '/services/category/interior-detailing',
          linkLabel: 'Compare Interior Detailing in Omaha'
        },
        {
          title: 'Paint Correction in Omaha',
          body: 'Swirl marks, wash haze, oxidation and light scratches can reduce gloss even when the vehicle is otherwise clean. I inspect the paint and perform a test spot before recommending the appropriate level of correction.',
          href: '/services/category/paint-correction',
          linkLabel: 'Learn about Paint Correction in Omaha'
        },
        {
          title: 'Ceramic Coating in Omaha',
          body: 'I install System X ceramic coatings after completing the paint preparation appropriate for the vehicle. Depending on the condition of the paint, preparation may include decontamination, polishing or paint correction before the coating is applied.',
          href: '/ceramic-coating',
          linkLabel: 'Compare Ceramic Coating in Omaha'
        },
        {
          title: 'Mobile Detailing in Omaha or Bellevue Drop-Off',
          body: 'Many interior and general detailing services can be completed at your Omaha location when there is suitable access, weather and a safe place to work. Longer paint-correction, ceramic-coating and weather-sensitive services may be better suited to my appointment-only Bellevue drop-off location.',
          href: '/services',
          linkLabel: 'View all detailing services'
        }
      ],
      projects: [
        {
          title: 'Ram 1500 Exterior Detailing in Omaha',
          vehicle: 'Ram 1500 Big Horn',
          service: 'Exterior detailing',
          location: 'Omaha, Nebraska',
          intro: 'This Ram 1500 Big Horn received exterior detailing focused on cleaning up the paint, wheels, trim and exterior surfaces while restoring a cleaner, glossier overall appearance. Trucks can accumulate substantial road film, dirt and contamination around the lower panels, wheel areas and bodywork, so those areas received particular attention during the detail. The finished truck had a noticeably cleaner and more reflective exterior while maintaining the paint and trim appropriately.',
          images: [
            { src: '/omaha/omaha-truck-detailing-before.jpg', alt: 'Ram 1500 Big Horn before exterior detailing in Omaha Nebraska' },
            { src: '/omaha/omaha-truck-detailing-before-2.jpg', alt: 'Ram 1500 Big Horn paint and wheel condition before detailing in Omaha' },
            { src: '/omaha/omaha-truck-detailing-after.jpg', alt: 'Ram 1500 Big Horn after exterior detailing in Omaha Nebraska' },
            { src: '/omaha/omaha-truck-detailing-after-2.jpg', alt: 'Ram 1500 Big Horn finished exterior after Omaha detailing' }
          ],
          links: [{ label: 'View Exterior Detailing', href: '/services/category/exterior-detailing' }]
        },
        {
          title: 'Mazda CX-9 Interior Detailing in Omaha',
          vehicle: 'Mazda CX-9',
          service: 'Interior detailing',
          location: 'Omaha, Nebraska',
          intro: 'This Mazda CX-9 received interior detailing throughout the passenger compartment. The service focused on the seating areas, carpeting, floor mats, center console, door panels and other high-contact surfaces that collect dirt during normal family use. The lighter interior makes contamination especially noticeable, so careful cleaning around the seats, carpeting and trim helped restore a fresher, more uniform appearance.',
          images: [
            { src: '/omaha/omaha-interior-detailing-before.jpg', alt: 'Mazda CX-9 interior before detailing in Omaha Nebraska' },
            { src: '/omaha/omaha-interior-cleaning-before.jpg', alt: 'Mazda CX-9 interior and floor mats before cleaning in Omaha' },
            { src: '/omaha/omaha-interior-detailing-after.jpg', alt: 'Mazda CX-9 interior after professional detailing in Omaha Nebraska' },
            { src: '/omaha/omaha-interior-cleaning-after.jpg', alt: 'Mazda CX-9 cleaned interior after Omaha detailing' }
          ],
          links: [{ label: 'View Interior Detailing in Omaha', href: '/services/category/interior-detailing' }]
        },
        {
          title: 'Omaha Car Detailing Results',
          service: 'Professional car detailing',
          location: 'Omaha, Nebraska',
          intro: 'These photos show additional vehicles after professional detailing work in Omaha. They are included as visual proof of finished work rather than presented as a dramatic before-and-after claim. Every vehicle gets a process matched to its materials, condition and the owner’s goals.',
          images: [
            { src: '/omaha/omaha-auto-detailing-finished-vehicle.jpg', alt: 'Finished vehicle after auto detailing in Omaha Nebraska' },
            { src: '/omaha/omaha-car-detailing-finished.jpg', alt: 'Professional car detailing result in Omaha Nebraska' },
            { src: '/omaha/omaha-detailing-results.jpg', alt: 'Vehicle after professional detailing service in Omaha' }
          ],
          links: [{ label: 'View Car Detailing Services', href: '/services' }]
        },
        {
          title: 'Premium and Performance Vehicle Detailing in Omaha',
          vehicle: 'Aston Martin Vantage S and Subaru WRX',
          service: 'Premium vehicle detailing',
          location: 'Omaha, Nebraska',
          intro: 'These Omaha projects show experience with enthusiast and premium vehicles, including an Aston Martin Vantage S and Subaru WRX. The work focused on safely cleaning and refining paint, wheels, trim and detailed interior surfaces. I adjust the process to the specific vehicle rather than applying the same procedure to every car, and I only recommend paint correction or ceramic coating when the actual condition and service call for it.',
          images: [
            { src: '/omaha/omaha-premium-car-detailing.jpg', alt: 'Subaru WRX wheel after professional detailing in Omaha' },
            { src: '/omaha/omaha-performance-car-detailing.jpg', alt: 'Premium vehicle interior detail from an Omaha detailing project' },
            { src: '/omaha/omaha-exterior-detailing-result.jpg', alt: 'Aston Martin Vantage S after exterior detailing in Omaha Nebraska' },
            { src: '/omaha/omaha-car-detailing-paint-finish.jpg', alt: 'Clean paint finish after premium Omaha car detailing' }
          ],
          links: [
            { label: 'View Exterior Detailing', href: '/services/category/exterior-detailing' },
            { label: 'View Paint Correction', href: '/services/category/paint-correction' },
            { label: 'View Ceramic Coating', href: '/ceramic-coating' }
          ]
        },
        {
          title: 'Deep Interior Cleaning in Omaha',
          service: 'Deep interior detailing',
          location: 'Omaha, Nebraska',
          intro: 'This Omaha interior started with visible debris and buildup around the carpeting, seat mounting areas, center console and other difficult-to-reach spaces. For interiors in this condition, the service goes beyond simply wiping down visible surfaces. Detailed cleaning focuses on the areas where dirt collects over time, including around and beneath seating areas, along carpet edges, inside cup holders and around interior trim. The result is a substantially cleaner cabin and a better starting point for maintaining the vehicle going forward.',
          images: [
            { src: '/omaha/omaha-deep-interior-cleaning-before.jpg', alt: 'Vehicle interior before deep interior detailing in Omaha Nebraska' },
            { src: '/omaha/omaha-deep-interior-cleaning-after.jpg', alt: 'Interior after deep detailing service in Omaha Nebraska' },
            { src: '/omaha/omaha-interior-restoration-result.jpg', alt: 'Finished interior after professional restoration in Omaha' }
          ],
          links: [{ label: 'View Interior Restoration', href: '/services/category/interior-detailing' }]
        }
      ],
      faqs: [
        { question: 'Do you offer mobile car detailing in Omaha?', answer: 'Yes. Mobile appointments are available throughout Omaha when the service, weather, access and work area are suitable. Some longer or weather-sensitive services may be better completed through Bellevue drop-off.' },
        { question: 'How much does car detailing cost in Omaha?', answer: 'Pricing depends on the service, vehicle size and condition. Current starting prices are shown on each service page, with additional restoration work discussed before it is performed.' },
        { question: 'Do you offer interior detailing in Omaha?', answer: 'Yes. Interior services range from maintenance cleaning for regularly maintained vehicles to deeper restoration for stains, pet hair, spills and heavily soiled interiors.' },
        { question: 'Do you offer paint correction in Omaha?', answer: 'Yes. Paint correction is available for eligible swirl marks, wash haze, oxidation and light scratches. I inspect the paint and perform a test spot before determining the appropriate correction process.' },
        { question: 'Do you install ceramic coatings for Omaha customers?', answer: 'Yes. I am a System X certified installer and offer several ceramic-coating packages. Paint preparation is determined by the vehicle’s condition before coating installation.' },
        { question: 'Should I choose mobile detailing or Bellevue drop-off?', answer: 'Mobile service works well for many detailing appointments when conditions are suitable. Bellevue drop-off is often better for longer paint-correction, ceramic-coating and weather-sensitive work.' }
      ]
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
