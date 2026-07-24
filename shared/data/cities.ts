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
      title: 'Auto Detailing Omaha NE | Interior, Paint & Coatings',
      description: 'Owner-operated auto detailing in Omaha for interiors, full details, paint correction, ceramic coating, and condition-based specialty work.'
    },
    content: {
      title: 'Auto Detailing in Omaha, NE',
      intro: "Omaha drivers trust Bryan's Showroom Quality Mobile Detailing for the metro area's most thorough auto detailing. From daily driver maintenance details to full paint correction and System X ceramic coating, every service is completed to exacting standards — not just a quick wash. Based in Bellevue, we serve all of Omaha with mobile and shop-based services.",
      servicesLabel: 'Auto Detailing Services Available in Omaha:',
      whyLabel: "Why Omaha drivers choose Bryan's:",
      whyPoints: [
        'Current ratings and customer reviews available on Google',
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
      title: 'Auto Detailing Bellevue NE | Bryan\'s Detailing',
      description: 'Bellevue auto detailing with mobile and drop-off options for interiors, full details, paint correction, ceramic coating, and maintenance care.'
    },
    content: {
      title: 'Auto Detailing in Bellevue, NE',
      intro: "Bryan's Showroom Quality Mobile Detailing is based right here in Bellevue — giving local residents the fastest scheduling, the most competitive pricing, and the most accountable service in the metro. Whether you're near Offutt AFB, Cunningham Lake, or anywhere in between, we offer both mobile detailing at your home and intensive shop-based services for paint correction and ceramic coating.",
      servicesLabel: 'Auto Detailing Services in Bellevue:',
      whyLabel: 'Why Bellevue residents trust us:',
      whyPoints: [
        'Locally owned and operated in Bellevue since 2019',
        'Serving Offutt AFB military families with flexible scheduling',
        'System X certified ceramic coating — not consumer-grade DIY',
        'Shop and mobile options for every service level',
        'Current Bellevue and Omaha customer reviews available on Google'
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
      title: 'Auto Detailing Papillion NE | Mobile & Drop-Off',
      description: 'Auto detailing for Papillion drivers, including interior cleaning, exterior wash and wax, paint correction, ceramic coating, and full details.'
    },
    content: {
      title: 'Auto Detailing in Papillion, NE',
      intro: "Papillion is one of the fastest-growing communities in Nebraska — and its residents expect quality that matches. Bryan's Showroom Quality Mobile Detailing serves Papillion with the same professional-grade processes used on high-end vehicles across the metro. Mobile service brings the shop to your driveway, or drop your vehicle at our Bellevue location for intensive paint correction and ceramic coating.",
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
      title: 'Auto Detailing La Vista NE | Mobile Car Detailing',
      description: 'Mobile auto detailing in La Vista for interior cleaning, full details, paint care, maintenance, and Bellevue drop-off services when needed.'
    },
    content: {
      title: 'Auto Detailing in La Vista, NE',
      intro: "La Vista residents don't have to drive far for elite auto detailing — we bring it to you. Bryan's Showroom Quality Mobile Detailing provides mobile service directly to La Vista homes and businesses, with the same professional-grade products and techniques used on vehicles across Omaha and Bellevue. No corners cut, no shortcuts taken.",
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
      title: 'Auto Detailing Ralston NE | Bryan\'s Detailing',
      description: 'Auto detailing for Ralston drivers with interior cleaning, full-detail packages, paint correction, ceramic coating, and online booking.'
    },
    content: {
      title: 'Auto Detailing in Ralston, NE',
      intro: "Ralston is right in our backyard — making same-day and next-day appointments possible for local residents. Bryan's Showroom Quality Mobile Detailing serves Ralston with a full menu of professional detailing services, from quick maintenance details that keep your car looking sharp to full restorations that bring neglected vehicles back to life.",
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
      title: 'Auto Detailing Gretna NE | Mobile Car Detailing',
      description: 'Mobile auto detailing in Gretna and Sarpy County for interior cleaning, full details, paint care, ceramic coating, and vehicle protection.'
    },
    content: {
      title: 'Auto Detailing in Gretna, NE',
      intro: "Gretna residents commute hard — and their vehicles show it. Bryan's Showroom Quality Mobile Detailing serves Gretna with mobile auto detailing that eliminates road grime, interior buildup, and paint damage accumulated from daily Nebraska driving. Whether it's a quick refresh or a full paint correction before a sale, we deliver professional results at your door.",
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
      title: 'Auto Detailing Elkhorn NE | Paint & Ceramic Coating',
      description: 'Auto detailing for Elkhorn and West Omaha with interior restoration, machine paint correction, ceramic coating, and new-car protection.'
    },
    content: {
      title: 'Auto Detailing in Elkhorn, NE',
      intro: "Elkhorn's growing community of luxury and performance vehicle owners deserves detailing that matches. Bryan's Showroom Quality Mobile Detailing serves Elkhorn and West Omaha with professional-grade ceramic coating, multi-stage paint correction, and interior restoration. Our System X certified coating protects your investment — whether it's a new daily driver or a weekend show vehicle.",
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
      title: 'Auto Detailing Council Bluffs IA | Mobile Service',
      description: 'Mobile auto detailing in Council Bluffs for interior cleaning, exterior protection, paint correction, ceramic coating, and full-detail packages.'
    },
    content: {
      title: 'Auto Detailing in Council Bluffs, IA',
      intro: "We cross the river to serve Council Bluffs residents who want professional-grade detailing without the wait. Bryan's Showroom Quality Mobile Detailing brings the full menu of services to Council Bluffs — from quick interior refreshes to full paint correction and ceramic coating. Same standards, same products, same results as our Omaha and Bellevue clients.",
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
      title: 'Auto Detailing Near Offutt AFB | Bellevue NE',
      description: 'Auto detailing near Offutt AFB with mobile and Bellevue drop-off options for military families, including interior, full-detail, and paint services.'
    },
    content: {
      title: 'Auto Detailing Near Offutt AFB',
      intro: "Bryan's Showroom Quality Mobile Detailing proudly serves military families at Offutt Air Force Base. We understand the demands of military life — which is why we offer flexible scheduling, mobile service, and fast turnaround to fit around duty hours and deployment schedules. We've detailed hundreds of vehicles for Offutt service members and their families.",
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
