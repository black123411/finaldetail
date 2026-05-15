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
      title: 'Auto Detailing Omaha NE | Paint Correction & Ceramic Coating',
      description: "Top-rated auto detailing in Omaha NE. Bryan's Showroom Quality Detailing specializes in ceramic coating, paint correction, and interior detailing. 4.9★ Google Rating."
    },
    content: {
      title: 'Auto Detailing in Omaha, NE',
      intro: "Omaha drivers trust Bryan's Showroom Quality Detailing for the metro area's most thorough auto detailing. From daily driver maintenance details to full paint correction and System X ceramic coating, every service is completed to exacting standards — not just a quick wash. Based in Bellevue, we serve all of Omaha with mobile and shop-based services.",
      servicesLabel: 'Auto Detailing Services Available in Omaha:',
      whyLabel: "Why Omaha drivers choose Bryan's:",
      whyPoints: [
        '4.9★ Google rating — 43+ verified reviews',
        'System X certified ceramic coating installer',
        'Paint correction that permanently removes swirls & scratches',
        'Mobile service across all Omaha zip codes',
        'Secure shop location in Bellevue for intensive work'
      ],
      serviceAreas: ['West Omaha', 'Midtown Omaha', 'South Omaha', 'Bellevue', 'Papillion', 'La Vista'],
      cta: 'Book your Omaha auto detail online — appointments fill fast.'
    }
  },
  {
    slug: 'bellevue-ne',
    name: 'Bellevue, NE',
    type: 'primary',
    seo: {
      title: 'Car Detailing Bellevue NE | Ceramic Coating & Paint Correction',
      description: "Bellevue's #1 rated auto detailing service. Bryan's Showroom Quality Detailing offers ceramic coating, paint correction, interior restoration, and mobile detailing. Book online."
    },
    content: {
      title: 'Auto Detailing in Bellevue, NE',
      intro: "Bryan's Showroom Quality Detailing is based right here in Bellevue — giving local residents the fastest scheduling, the most competitive pricing, and the most accountable service in the metro. Whether you're near Offutt AFB, Cunningham Lake, or anywhere in between, we offer both mobile detailing at your home and intensive shop-based services for paint correction and ceramic coating.",
      servicesLabel: 'Auto Detailing Services in Bellevue:',
      whyLabel: 'Why Bellevue residents trust us:',
      whyPoints: [
        'Locally owned and operated in Bellevue since 2019',
        'Serving Offutt AFB military families with flexible scheduling',
        'System X certified ceramic coating — not consumer-grade DIY',
        'Shop and mobile options for every service level',
        '4.9★ rated by 43+ Bellevue and Omaha customers'
      ],
      serviceAreas: ['Bellevue', 'Offutt AFB', 'Fontenelle Hills', 'Levi Carter Park area', 'Papillion'],
      cta: 'Schedule your Bellevue detail today — online booking available 24/7.'
    }
  },
  {
    slug: 'papillion-ne',
    name: 'Papillion, NE',
    type: 'secondary',
    seo: {
      title: 'Car Detailing Papillion NE | Interior & Paint Correction Services',
      description: "Professional auto detailing in Papillion NE. Bryan's Showroom Quality Detailing serves Papillion with interior detailing, exterior wash & wax, paint correction, and ceramic coating."
    },
    content: {
      title: 'Auto Detailing in Papillion, NE',
      intro: "Papillion is one of the fastest-growing communities in Nebraska — and its residents expect quality that matches. Bryan's Showroom Quality Detailing serves Papillion with the same professional-grade processes used on high-end vehicles across the metro. Mobile service brings the shop to your driveway, or drop your vehicle at our Bellevue location for intensive paint correction and ceramic coating.",
      servicesLabel: 'Detailing Services for Papillion Residents:',
      whyLabel: 'What sets us apart in Papillion:',
      whyPoints: [
        'Mobile detailing at your home or office in Papillion',
        'Professional paint correction for show-ready results',
        'Ceramic coating to protect against Nebraska winters and UV',
        'Family-vehicle specialists — pet hair, stains, and odors',
        'Easy online booking — no phone calls required'
      ],
      serviceAreas: ['Papillion', 'Shadow Lake area', 'La Vista', 'Bellevue', 'Sarpy County'],
      cta: 'Book your Papillion auto detail — we come to you.'
    }
  },
  {
    slug: 'la-vista-ne',
    name: 'La Vista, NE',
    type: 'secondary',
    seo: {
      title: 'Car Detailing La Vista NE | Mobile Auto Detailing Services',
      description: "Mobile auto detailing in La Vista NE. Bryan's Showroom Quality Detailing offers interior cleaning, exterior paint correction, and ceramic coating for La Vista residents."
    },
    content: {
      title: 'Auto Detailing in La Vista, NE',
      intro: "La Vista residents don't have to drive far for elite auto detailing — we bring it to you. Bryan's Showroom Quality Detailing provides mobile service directly to La Vista homes and businesses, with the same professional-grade products and techniques used on vehicles across Omaha and Bellevue. No corners cut, no shortcuts taken.",
      servicesLabel: 'La Vista Detailing Services:',
      whyLabel: 'Why La Vista customers choose us:',
      whyPoints: [
        'Mobile service at your La Vista address',
        'Deep interior cleaning for families and pet owners',
        'Exterior paint enhancement and gloss restoration',
        'Honest pricing — no hidden fees or upsells',
        'Fast turnaround — most services completed same day'
      ],
      serviceAreas: ['La Vista', 'Papillion', 'Ralston', 'Bellevue', 'South Omaha'],
      cta: 'Get a free quote for La Vista auto detailing today.'
    }
  },
  {
    slug: 'ralston-ne',
    name: 'Ralston, NE',
    type: 'secondary',
    seo: {
      title: 'Car Detailing Ralston NE | Professional Auto Detail Services',
      description: "Auto detailing in Ralston NE. Bryan's Showroom Quality Detailing serves Ralston with interior detailing, paint correction, and ceramic coating. Book online."
    },
    content: {
      title: 'Auto Detailing in Ralston, NE',
      intro: "Ralston is right in our backyard — making same-day and next-day appointments possible for local residents. Bryan's Showroom Quality Detailing serves Ralston with a full menu of professional detailing services, from quick maintenance details that keep your car looking sharp to full restorations that bring neglected vehicles back to life.",
      servicesLabel: 'Ralston Auto Detailing Services:',
      whyLabel: 'Our Ralston commitment:',
      whyPoints: [
        'Same-day and next-day availability for Ralston residents',
        'Full interior restoration including odor elimination',
        'Paint correction to remove car wash scratches and swirls',
        'Affordable pricing without sacrificing quality',
        'Locally operated — your car is in our community'
      ],
      serviceAreas: ['Ralston', 'Bellevue', 'La Vista', 'South Omaha'],
      cta: 'Book your Ralston detail — fast availability, professional results.'
    }
  },
  {
    slug: 'gretna-ne',
    name: 'Gretna, NE',
    type: 'secondary',
    seo: {
      title: 'Car Detailing Gretna NE | Mobile Auto Detailing Sarpy County',
      description: "Professional mobile auto detailing in Gretna NE and Sarpy County. Interior cleaning, paint correction, and ceramic coating from Bryan's Showroom Quality Detailing."
    },
    content: {
      title: 'Auto Detailing in Gretna, NE',
      intro: "Gretna residents commute hard — and their vehicles show it. Bryan's Showroom Quality Detailing serves Gretna with mobile auto detailing that eliminates road grime, interior buildup, and paint damage accumulated from daily Nebraska driving. Whether it's a quick refresh or a full paint correction before a sale, we deliver professional results at your door.",
      servicesLabel: 'Detailing Services for Gretna & Sarpy County:',
      whyLabel: 'Why Gretna drivers call us:',
      whyPoints: [
        'Mobile service eliminates the trip to a shop',
        'Nebraska winter salt and road grime specialists',
        'Family SUV and truck detailing experience',
        'Pre-sale detail packages that maximize resale value',
        'Professional ceramic coating for long-term protection'
      ],
      serviceAreas: ['Gretna', 'Springfield', 'Papillion', 'Bellevue', 'Sarpy County'],
      cta: 'Book a Gretna mobile detail — we drive to you.'
    }
  },
  {
    slug: 'elkhorn-ne',
    name: 'Elkhorn, NE',
    type: 'secondary',
    seo: {
      title: 'Car Detailing Elkhorn NE | Ceramic Coating & Paint Correction',
      description: "Auto detailing in Elkhorn NE. Bryan's Showroom Quality Detailing serves West Omaha and Elkhorn with ceramic coating, paint correction, and full interior detailing."
    },
    content: {
      title: 'Auto Detailing in Elkhorn, NE',
      intro: "Elkhorn's growing community of luxury and performance vehicle owners deserves detailing that matches. Bryan's Showroom Quality Detailing serves Elkhorn and West Omaha with professional-grade ceramic coating, multi-stage paint correction, and interior restoration. Our System X certified coating protects your investment — whether it's a new daily driver or a weekend show vehicle.",
      servicesLabel: 'Elkhorn Auto Detailing Services:',
      whyLabel: 'Why Elkhorn residents choose Bryan\'s:',
      whyPoints: [
        'System X certified ceramic coating for long-term protection',
        'Multi-stage paint correction for luxury and performance vehicles',
        'New car detail packages — protect your investment from day one',
        'Mobile service to Elkhorn and West Omaha',
        'High-end results without dealership prices'
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
      title: 'Car Detailing Council Bluffs IA | Mobile Auto Detailer',
      description: "Mobile auto detailing in Council Bluffs IA. Bryan's Showroom Quality Detailing crosses the river to serve Council Bluffs with interior cleaning, paint correction, and ceramic coating."
    },
    content: {
      title: 'Auto Detailing in Council Bluffs, IA',
      intro: "We cross the river to serve Council Bluffs residents who want professional-grade detailing without the wait. Bryan's Showroom Quality Detailing brings the full menu of services to Council Bluffs — from quick interior refreshes to full paint correction and ceramic coating. Same standards, same products, same results as our Omaha and Bellevue clients.",
      servicesLabel: 'Council Bluffs Detailing Services:',
      whyLabel: 'What Council Bluffs customers get:',
      whyPoints: [
        'Mobile service — we come to Council Bluffs',
        'Full interior extraction for heavy stains and odors',
        'Exterior paint decontamination and sealant',
        'Iowa winter road salt removal specialists',
        'Fair pricing with no Iowa upcharge'
      ],
      serviceAreas: ['Council Bluffs', 'Carter Lake', 'Missouri Valley', 'Omaha border area'],
      cta: 'Book your Council Bluffs detail — we come to you.'
    }
  },
  {
    slug: 'offutt-afb-ne',
    name: 'Offutt AFB',
    type: 'secondary',
    seo: {
      title: 'Car Detailing Offutt AFB | Military Auto Detailing Bellevue NE',
      description: "Auto detailing near Offutt Air Force Base. Bryan's Showroom Quality Detailing serves military families at Offutt AFB with flexible scheduling and professional detailing services."
    },
    content: {
      title: 'Auto Detailing Near Offutt AFB',
      intro: "Bryan's Showroom Quality Detailing proudly serves military families at Offutt Air Force Base. We understand the demands of military life — which is why we offer flexible scheduling, mobile service, and fast turnaround to fit around duty hours and deployment schedules. We've detailed hundreds of vehicles for Offutt service members and their families.",
      servicesLabel: 'Services for Offutt AFB Families:',
      whyLabel: 'Why military families choose Bryan\'s:',
      whyPoints: [
        'Flexible scheduling around duty hours and TDY',
        'Mobile service on and near base',
        'Pre-PCS detail packages to maximize vehicle sale price',
        'New car detail for vehicles purchased before deployment',
        'Veteran-friendly — we appreciate your service'
      ],
      serviceAreas: ['Offutt AFB', 'Bellevue', 'Papillion', 'La Vista'],
      cta: 'Book your Offutt detail — flexible scheduling for military families.'
    }
  }
];
