export interface CityPage {
  slug: string;
  name: string;
  type: 'primary' | 'secondary';
  seo: { title: string; description: string };
  content: {
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
      title: 'Mobile Car Detailing Omaha, NE | Bryan\'s Detailing',
      description: 'Professional mobile car detailing in Omaha. Interior detailing, complete details, paint correction, and Bellevue drop-off ceramic coating options.'
    },
    content: {
      title: 'Mobile Car Detailing in Omaha, Nebraska',
      intro: "Bryan's Showroom Quality Detailing provides owner-operated mobile auto detailing throughout Omaha and the surrounding metro. Services include interior detailing, complete inside-and-out details, paint enhancement, paint correction, and ceramic coating preparation. Mobile availability depends on the service, weather, workspace, access, distance, and vehicle condition. Bellevue drop-off and pickup options are available for services that require controlled conditions or extended working time.",
      servicesLabel: 'Auto Detailing Services Available in Omaha:',
      whyLabel: "Why Omaha drivers choose Bryan's:",
      whyPoints: [
        'Current ratings and customer reviews available on Google',
        'System X certified ceramic coating installer',
        'Paint correction that reduces or removes eligible swirls and scratches',
        'Mobile service in Omaha when access and conditions allow',
        'Bellevue drop-off options for intensive work'
      ],
      serviceAreas: ['West Omaha', 'Midtown Omaha', 'South Omaha', 'Bellevue', 'Papillion', 'La Vista'],
      cta: 'Book your Omaha auto detail online and choose a current available time.'
    }
  },
  {
    slug: 'bellevue-ne',
    name: 'Bellevue, NE',
    type: 'primary',
    seo: {
      title: 'Car Detailing Bellevue, NE | Mobile & Drop-Off Options',
      description: 'Owner-operated car detailing in Bellevue, Nebraska. Mobile detailing, interior cleaning, full details, paint correction, and ceramic coating.'
    },
    content: {
      title: 'Professional Car Detailing in Bellevue, Nebraska',
      intro: "Bryan's Showroom Quality Detailing is based in Bellevue and has served Bellevue and the Omaha metro since 2017. I provide professional interior detailing, full vehicle details, paint correction, and certified ceramic coating services for cars, trucks, SUVs, specialty vehicles, and work vehicles. Mobile service is available when the service, weather, workspace, and vehicle condition are suitable. Bellevue drop-off and pickup options are available by appointment for services that require more time or controlled conditions. This is an appointment-only drop-off location, not an open public storefront.",
      servicesLabel: 'Auto Detailing Services in Bellevue:',
      whyLabel: "Why Bellevue residents choose Bryan's:",
      whyPoints: [
        'Locally owned and operated in Bellevue since 2017',
        'Serving Offutt AFB military families with flexible scheduling',
        'System X certified ceramic coating installation',
        'Mobile service plus Bellevue drop-off options',
        'Current Bellevue and Omaha customer reviews available on Google'
      ],
      serviceAreas: ['Bellevue', 'Offutt AFB', 'Fontenelle Hills', 'Levi Carter Park area', 'Papillion'],
      cta: 'View current Bellevue appointment availability.'
    }
  },
  {
    slug: 'papillion-ne',
    name: 'Papillion, NE',
    type: 'secondary',
    seo: {
      title: 'Auto Detailing Papillion NE | Mobile & Drop-Off',
      description: 'Auto detailing for Papillion drivers, including interior cleaning, exterior wash and wax, paint correction, ceramic coating, and full details.'
    },
    content: {
      title: 'Auto Detailing in Papillion, NE',
      intro: "Papillion drivers can book Bryan's Showroom Quality Mobile Detailing for careful interior, exterior, paint-correction, and ceramic-coating work. I bring mobile service to homes and offices, with Bellevue drop-off and pickup available when a service needs controlled working conditions.",
      servicesLabel: 'Detailing Services for Papillion Residents:',
      whyLabel: "What Papillion customers can expect:",
      whyPoints: [
        'Mobile detailing at your home or office in Papillion',
        'Paint correction based on the finish and defects that can be safely improved',
        'Ceramic coating with preparation matched to the vehicle',
        'Interior services for pet hair, stains, spills, and odors',
        'Online booking plus photo-based recommendations'
      ],
      serviceAreas: ['Papillion', 'Shadow Lake area', 'La Vista', 'Bellevue', 'Sarpy County'],
      cta: 'Book your Papillion auto detail and choose mobile or Bellevue drop-off.'
    }
  },
  {
    slug: 'la-vista-ne',
    name: 'La Vista, NE',
    type: 'secondary',
    seo: {
      title: 'Auto Detailing La Vista NE | Mobile Car Detailing',
      description: 'Mobile auto detailing in La Vista for interior cleaning, full details, paint care, maintenance, and Bellevue drop-off services when needed.'
    },
    content: {
      title: 'Auto Detailing in La Vista, NE',
      intro: "La Vista drivers can schedule Bryan's Showroom Quality Mobile Detailing at home or work. I bring the equipment and products for mobile appointments, with Bellevue drop-off and pickup available for services that need controlled conditions.",
      servicesLabel: 'La Vista Detailing Services:',
      whyLabel: "Why La Vista customers choose Bryan's:",
      whyPoints: [
        'Mobile service at your La Vista address',
        'Interior cleaning for families and pet owners',
        'Exterior paint enhancement and gloss improvement',
        'Starting prices and condition adjustments explained clearly',
        'Clear scope and timing before work begins'
      ],
      serviceAreas: ['La Vista', 'Papillion', 'Ralston', 'Bellevue', 'South Omaha'],
      cta: 'View La Vista detailing services and current availability.'
    }
  },
  {
    slug: 'ralston-ne',
    name: 'Ralston, NE',
    type: 'secondary',
    seo: {
      title: 'Auto Detailing Ralston NE | Bryan\'s Detailing',
      description: 'Auto detailing for Ralston drivers with interior cleaning, full-detail packages, paint correction, ceramic coating, and online booking.'
    },
    content: {
      title: 'Auto Detailing in Ralston, NE',
      intro: "Ralston drivers can request mobile detailing without a long drive. Bryan's Showroom Quality Mobile Detailing offers maintenance details, interior restoration, full details, paint correction, and ceramic coating, with the service scope reviewed before work begins.",
      servicesLabel: 'Ralston Auto Detailing Services:',
      whyLabel: "Why Ralston drivers choose Bryan's:",
      whyPoints: [
        'Mobile scheduling for Ralston residents',
        'Interior restoration for stains, pet hair, and odor sources',
        'Paint correction to reduce eligible wash marks and swirls',
        'Starting prices with the scope explained before work begins',
        'Owner-operated service with mobile and Bellevue options'
      ],
      serviceAreas: ['Ralston', 'Bellevue', 'La Vista', 'South Omaha'],
      cta: 'Book your Ralston detail and view current appointment availability.'
    }
  },
  {
    slug: 'gretna-ne',
    name: 'Gretna, NE',
    type: 'secondary',
    seo: {
      title: 'Auto Detailing Gretna NE | Mobile Car Detailing',
      description: 'Mobile auto detailing in Gretna and Sarpy County for interior cleaning, full details, paint care, ceramic coating, and vehicle protection.'
    },
    content: {
      title: 'Auto Detailing in Gretna, NE',
      intro: "Gretna drivers can book Bryan's Showroom Quality Mobile Detailing for road grime, interior buildup, paint care, and pre-sale preparation. I provide mobile appointments when the location and service are a good fit, with Bellevue drop-off and pickup available for controlled work.",
      servicesLabel: 'Detailing Services for Gretna & Sarpy County:',
      whyLabel: "Why Gretna drivers choose Bryan's:",
      whyPoints: [
        'Mobile service at a suitable home or office location',
        'Interior and exterior cleaning for road grime and family vehicles',
        'SUV and truck detailing matched to vehicle condition',
        'Pre-sale detail packages that improve presentation',
        'Professional ceramic coating with inspection-based preparation'
      ],
      serviceAreas: ['Gretna', 'Springfield', 'Papillion', 'Bellevue', 'Sarpy County'],
      cta: 'Book a Gretna mobile detail or choose Bellevue drop-off.'
    }
  },
  {
    slug: 'elkhorn-ne',
    name: 'Elkhorn, NE',
    type: 'secondary',
    seo: {
      title: 'Auto Detailing Elkhorn NE | Paint & Ceramic Coating',
      description: 'Auto detailing for Elkhorn and West Omaha with interior restoration, machine paint correction, ceramic coating, and new-car protection.'
    },
    content: {
      title: 'Auto Detailing in Elkhorn, NE',
      intro: "Elkhorn and West Omaha drivers can schedule System X ceramic coating, multi-stage paint correction, and interior restoration through Bryan's Showroom Quality Mobile Detailing. I review the vehicle and preparation needed before confirming the service.",
      servicesLabel: 'Elkhorn Auto Detailing Services:',
      whyLabel: 'Why Elkhorn residents choose Bryan\'s:',
      whyPoints: [
        'System X certified ceramic coating for long-term protection',
        'Multi-stage paint correction for luxury and performance vehicles',
        'New-car detail packages with inspection-based paint preparation',
        'Mobile service to Elkhorn and West Omaha',
        'Mobile and Bellevue drop-off options when conditions require'
      ],
      serviceAreas: ['Elkhorn', 'West Omaha', 'Waterloo', 'Valley', 'Douglas County'],
      cta: 'Schedule your Elkhorn ceramic coating or detail today.'
    }
  },
  {
    slug: 'council-bluffs-ia',
    name: 'Council Bluffs, IA',
    type: 'secondary',
    seo: {
      title: 'Auto Detailing Council Bluffs IA | Mobile Service',
      description: 'Mobile auto detailing in Council Bluffs for interior cleaning, exterior protection, paint correction, ceramic coating, and full-detail packages.'
    },
    content: {
      title: 'Auto Detailing in Council Bluffs, IA',
      intro: "Bryan's Showroom Quality Mobile Detailing serves Council Bluffs with mobile interior, exterior, paint-correction, and ceramic-coating appointments when the location is a good fit. Bellevue drop-off and pickup are also available for services that need controlled working conditions.",
      servicesLabel: 'Council Bluffs Detailing Services:',
      whyLabel: 'What Council Bluffs customers get:',
      whyPoints: [
        'Mobile service in Council Bluffs when the location is suitable',
        'Interior extraction for heavy stains and odor sources',
        'Exterior paint decontamination and sealant',
        'Road-salt and contamination removal based on condition',
        'Starting prices and any condition adjustment explained in advance'
      ],
      serviceAreas: ['Council Bluffs', 'Carter Lake', 'Missouri Valley', 'Omaha border area'],
      cta: 'Book your Council Bluffs detail and view current availability.'
    }
  },
  {
    slug: 'offutt-afb-ne',
    name: 'Offutt AFB',
    type: 'secondary',
    seo: {
      title: 'Auto Detailing Near Offutt AFB | Bellevue NE',
      description: 'Auto detailing near Offutt AFB with mobile and Bellevue drop-off options for military families, including interior, full-detail, and paint services.'
    },
    content: {
      title: 'Auto Detailing Near Offutt AFB',
      intro: "Bryan's Showroom Quality Mobile Detailing serves Offutt Air Force Base families with mobile appointments near Bellevue when the location is suitable, plus Bellevue drop-off and pickup options. I review the vehicle, access, and timing before confirming the appointment.",
      servicesLabel: 'Services for Offutt AFB Families:',
      whyLabel: 'Why military families choose Bryan\'s:',
      whyPoints: [
        'Flexible scheduling around duty hours and TDY',
        'Mobile service near Bellevue when the location is suitable',
        'Pre-PCS detail packages to prepare a vehicle for sale',
        'New car detail for vehicles purchased before deployment',
        'Respectful, straightforward service for military families'
      ],
      serviceAreas: ['Offutt AFB', 'Bellevue', 'Papillion', 'La Vista'],
      cta: 'Book your Offutt detail — flexible scheduling for military families.'
    }
  }
];
