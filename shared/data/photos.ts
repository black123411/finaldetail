/**
 * Real photos from Bryan's Google Business page at full resolution.
 * Source: Google Maps Place ID ChIJVVU5ibSJk4cRCK2ex-dRYIg
 * All alt tags are SEO-optimized for Omaha / Bellevue local search.
 */

// ─── Base photo URLs (high resolution 1600px) ─────────────────────────────────
const G = (id: string, w = 1600, h = 900) =>
  `https://lh3.googleusercontent.com/p/${id}=w${w}-h${h}-k-no`;

export const PHOTOS = {
  // Hero / flagship shots
  vwGolfBlue:       G('AF1QipNBh1JPkPPvuM9a6ZAEqUVD-q_ngfoeYPE03bev'),
  corvetteRed:      G('AF1QipOUgRYgEmkuiTvPZkFhp5iBTftXdefL0BuQAZ8_'),
  classicCarGloss:  G('AF1QipPbrkvTh49XT1SrfoYOibUm-HglwodcZMs0ToSk'),
  limoThumb:        G('AF1QipPxCiwStTBTX-8I-8tu6wwWF_sXjB7u7MMAd_F1'),

  // Interior work
  interiorAfter1:   G('AF1QipORfnLVjZw7YXTz2u6d4lISiI1L-kSweobZZbQG'),
  interiorAfter2:   G('AF1QipNOzqClcrsz7xle5InxS3H5aejnJRASt2EZAPe-'),
  suvInterior:      G('AF1QipOck1RG7EcljjU2HDO_-fiosxGNotYqMp2Q469u'),
  detailWork:       G('AF1QipNheq-q2h7K5rE3ZzXdsQqG_-my0uLanSzP4nBS'),

  // Exterior / paint
  exteriorGloss:    G('AF1QipMVRpjSjIaH_il5_nxbuqY8dFctvIBXtdMP5HAz'),
};

export interface GalleryImage {
  id: number;
  src: string;
  category: 'interior' | 'exterior' | 'paint' | 'ceramic' | 'specialty';
  alt: string;
  label?: string;
}

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 1,
    src: PHOTOS.vwGolfBlue,
    category: 'ceramic',
    alt: 'Ceramic coating result on blue Volkswagen Golf - mirror reflection Bellevue NE',
    label: 'Ceramic Coating – VW Golf',
  },
  {
    id: 2,
    src: PHOTOS.corvetteRed,
    category: 'paint',
    alt: 'Paint correction on red Corvette – swirl removal and gloss restoration Omaha NE',
    label: 'Paint Correction – Corvette',
  },
  {
    id: 3,
    src: PHOTOS.classicCarGloss,
    category: 'paint',
    alt: 'Classic car paint correction high-gloss mirror finish auto detailing Bellevue NE',
    label: 'Paint Correction – Classic Car',
  },
  {
    id: 4,
    src: PHOTOS.limoThumb,
    category: 'specialty',
    alt: 'Limousine interior restoration deep cleaning before and after Omaha NE',
    label: 'Limo Interior Restoration',
  },
  {
    id: 5,
    src: PHOTOS.interiorAfter1,
    category: 'interior',
    alt: 'Deep interior detail – carpet and seat shampoo extraction Omaha NE',
    label: 'Interior Reset – Seats & Carpet',
  },
  {
    id: 6,
    src: PHOTOS.interiorAfter2,
    category: 'interior',
    alt: 'Interior deep clean result – dashboard and console detailing Bellevue NE',
    label: 'Interior Detail – Dashboard',
  },
  {
    id: 7,
    src: PHOTOS.suvInterior,
    category: 'interior',
    alt: 'SUV interior detailing – steam clean and odor removal Omaha Nebraska',
    label: 'SUV Interior Cleaning',
  },
  {
    id: 8,
    src: PHOTOS.exteriorGloss,
    category: 'exterior',
    alt: 'Exterior paint enhancement wash and wax high gloss result Bellevue NE',
    label: 'Exterior Wash & Wax',
  },
  {
    id: 9,
    src: PHOTOS.detailWork,
    category: 'exterior',
    alt: 'Professional mobile auto detailing hand wash and decontamination Omaha',
    label: 'Mobile Detail Service',
  },
  // Local public photos for before/after sliders
  {
    id: 10,
    src: '/20191020_165304.jpg',
    category: 'exterior',
    alt: 'Before and after exterior detailing paint decontamination Bellevue NE',
    label: 'Exterior Before & After',
  },
  {
    id: 11,
    src: '/20191020_165130.jpg',
    category: 'paint',
    alt: 'Paint correction in progress swirl removal Omaha auto detailing',
    label: 'Paint Correction Process',
  },
  {
    id: 12,
    src: '/IMG_20210907_193919.jpg',
    category: 'interior',
    alt: 'Thorough vacuum and interior detailing mobile service Omaha NE',
    label: 'Interior Vacuum & Clean',
  },
];

export const BEFORE_AFTERS = [
  {
    id: 1,
    before: '/20191020_062847.jpg',
    after: '/20191020_062924.jpg',
    label: 'Stage 2 Paint Correction',
    description: 'Heavy swirl marks and scratches eliminated through two-stage machine polishing.',
    category: 'paint',
  },
  {
    id: 2,
    before: '/20191020_110329.jpg',
    after: '/20191020_110339.jpg',
    label: 'Deep Interior Restoration',
    description: 'Hot water extraction and steam sanitization on heavily soiled carpet and seats.',
    category: 'interior',
  },
];
