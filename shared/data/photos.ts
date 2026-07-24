/**
 * Real customer photos selected from Bryan's Google Photos Takeout archive.
 * Website copies are resized WebP files; the original archive remains unchanged.
 */

const T = (filename: string) => `/gallery/takeout/${filename}.webp`;

export const PHOTOS = {
  vwGolfBlue: T('fb_img_1669760742808'),
  corvetteRed: T('20220520_195826'),
  classicCarGloss: T('20250823_084022'),
  limoThumb: T('20230507_162319'),
  interiorAfter1: T('20210629_204424'),
  interiorAfter2: T('20221116_000144'),
  suvInterior: T('20210629_204721'),
  detailWork: T('20230513_100433'),
  exteriorGloss: T('20260502_192636'),
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
    src: T('20260502_192636'),
    category: 'paint',
    alt: 'Black vehicle paint after machine polishing in Bellevue NE',
    label: 'Paint Correction Finish',
  },
  {
    id: 2,
    src: T('img_20210916_144041'),
    category: 'paint',
    alt: 'Dark paint after swirl removal and machine polishing in Omaha NE',
    label: 'Swirl Removal Result',
  },
  {
    id: 3,
    src: T('20230513_182328'),
    category: 'paint',
    alt: 'Blue vehicle paint after polishing in Bellevue NE',
    label: 'Blue Paint Polishing Result',
  },
  {
    id: 4,
    src: T('20220520_195826'),
    category: 'exterior',
    alt: 'Red Corvette after exterior detailing in Omaha NE',
    label: 'Corvette Exterior Detail',
  },
  {
    id: 5,
    src: T('20230507_162319'),
    category: 'exterior',
    alt: 'Yellow Camaro after exterior detailing in Bellevue NE',
    label: 'Camaro Exterior Detail',
  },
  {
    id: 6,
    src: T('20230420_162911'),
    category: 'exterior',
    alt: 'Black Mazda after exterior detailing in Omaha NE',
    label: 'Mazda Exterior Detail',
  },
  {
    id: 7,
    src: T('20250823_084022'),
    category: 'specialty',
    alt: 'Fox body Mustang after exterior detailing in Omaha NE',
    label: 'Mustang Exterior Detail',
  },
  {
    id: 8,
    src: T('20250513_124821'),
    category: 'specialty',
    alt: 'Red touring motorcycle after detailing in Bellevue NE',
    label: 'Motorcycle Detail',
  },
  {
    id: 9,
    src: T('20250421_150404'),
    category: 'specialty',
    alt: 'Chaparral boat after exterior cleaning in Omaha NE',
    label: 'Boat Exterior Detail',
  },
  {
    id: 10,
    src: T('20210629_204424'),
    category: 'interior',
    alt: 'Clean center console after interior detailing in Bellevue NE',
    label: 'Center Console Detail',
  },
  {
    id: 11,
    src: T('20210629_204528'),
    category: 'interior',
    alt: 'Clean front seats after interior detailing in Bellevue NE',
    label: 'Front Seat Cleaning',
  },
  {
    id: 12,
    src: T('20210629_204721'),
    category: 'interior',
    alt: 'Clean rear seats after interior detailing in Omaha NE',
    label: 'Rear Seat Cleaning',
  },
  {
    id: 14,
    src: T('20221116_000144'),
    category: 'interior',
    alt: 'Clean driver area after deep interior detailing in Bellevue NE',
    label: 'Deep Interior Cleaning',
  },
  {
    id: 15,
    src: T('img_20220314_163652'),
    category: 'interior',
    alt: 'Clean dashboard and passenger area after interior detailing in Omaha NE',
    label: 'Dashboard and Cabin Detail',
  },
  {
    id: 16,
    src: T('20230507_132420'),
    category: 'paint',
    alt: 'Yellow Camaro paint after polishing in Bellevue NE',
    label: 'Camaro Paint Finish',
  },
  {
    id: 17,
    src: T('20230513_100433'),
    category: 'paint',
    alt: 'Blue vehicle paint under inspection after polishing in Omaha NE',
    label: 'Paint Inspection Result',
  },
  {
    id: 18,
    src: T('20260502_192711'),
    category: 'paint',
    alt: 'Black vehicle side panel after paint correction in Omaha NE',
    label: 'Corrected Side Panel',
  },
  {
    id: 19,
    src: T('fb_img_1669760742808'),
    category: 'exterior',
    alt: 'Blue performance car after exterior detailing in Bellevue NE',
    label: 'Performance Car Detail',
  },
  {
    id: 20,
    src: T('20220520_195815'),
    category: 'paint',
    alt: 'Red Corvette hood after polishing in Omaha NE',
    label: 'Corvette Paint Finish',
  },
  {
    id: 21,
    src: T('img_20211222_165008'),
    category: 'specialty',
    alt: 'Clear headlight after headlight restoration in Bellevue NE',
    label: 'Headlight Restoration',
  },
  {
    id: 22,
    src: T('20210629_205216'),
    category: 'exterior',
    alt: 'Red SUV after exterior detailing in Omaha NE',
    label: 'SUV Exterior Detail',
  },
  {
    id: 23,
    src: T('20230420_162915'),
    category: 'exterior',
    alt: 'Clean wheel and tire after exterior detailing in Omaha NE',
    label: 'Wheel and Tire Detail',
  },
  {
    id: 24,
    src: T('20250823_084015'),
    category: 'specialty',
    alt: 'Fox body Mustang side profile after detailing in Omaha NE',
    label: 'Classic Mustang Detail',
  },
];

export const BEFORE_AFTERS = [
  {
    id: 1,
    before: T('20210629_083754'),
    after: T('20210629_204424'),
    label: 'Center Console Cleaning',
    description: 'The same center console before and after interior cleaning and detailing.',
    category: 'interior',
  },
  {
    id: 2,
    before: T('20210629_083804'),
    after: T('20210629_204528'),
    label: 'Front Seat Cleaning',
    description: 'The same front seating area before and after vacuuming, cleaning, and stain treatment.',
    category: 'interior',
  },
  {
    id: 3,
    before: T('20210629_083840'),
    after: T('20210629_204645'),
    label: 'Rear Carpet Cleaning',
    description: 'The same rear floor area before and after debris removal and carpet cleaning.',
    category: 'interior',
  },
  {
    id: 5,
    before: T('img_20220314_110042'),
    after: T('img_20220314_163649'),
    label: 'Console and Cupholder Detail',
    description: 'The same console and cupholder area before and after interior detailing.',
    category: 'interior',
  },
  {
    id: 6,
    before: T('img_20210915_195802'),
    after: T('img_20210916_144041'),
    label: 'Paint Correction',
    description: 'Paint defects visible under inspection lighting before correction and the polished finish afterward.',
    category: 'paint',
  },
  {
    id: 7,
    before: T('img_20211222_160924'),
    after: T('img_20211222_165008'),
    label: 'Headlight Restoration',
    description: 'The same cloudy headlight before restoration and after clarity was restored.',
    category: 'specialty',
  },
  {
    id: 8,
    before: T('20260502_124004'),
    after: T('20260502_192636'),
    label: 'Swirl Removal and Polishing',
    description: 'The same black paint job under inspection before correction and after machine polishing.',
    category: 'paint',
  },
];
