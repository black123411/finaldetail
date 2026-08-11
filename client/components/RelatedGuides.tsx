import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export type GuideTopic =
  | 'all'
  | 'home'
  | 'interior'
  | 'exterior'
  | 'full-detail'
  | 'paint'
  | 'ceramic'
  | 'maintenance'
  | 'local'
  | 'gallery'
  | 'gift';

type GuideKey =
  | 'paint-correction'
  | 'ceramic-vs-wax'
  | 'interior-detailing'
  | 'winter-road-salt'
  | 'mobile-vs-dropoff'
  | 'detailing-frequency';

const GUIDES: Record<GuideKey, { title: string; description: string; path: string }> = {
  'paint-correction': {
    title: 'Paint Correction Explained',
    description: 'Learn what swirl marks and scratches can be improved, and when clear-coat preservation matters.',
    path: '/blog/paint-correction-swirl-marks-scratches-omaha',
  },
  'ceramic-vs-wax': {
    title: 'Ceramic Coating vs. Wax in Nebraska',
    description: 'Compare durability, gloss, upkeep, and protection options for Nebraska driving conditions.',
    path: '/blog/ceramic-coating-vs-wax-nebraska',
  },
  'interior-detailing': {
    title: 'What Interior Detailing Includes',
    description: 'See what professional interior detailing includes and what can affect the price.',
    path: '/blog/what-does-interior-car-detailing-include-omaha-bellevue',
  },
  'winter-road-salt': {
    title: 'Winter Road Salt and Grime Guide',
    description: 'Protect paint and interior surfaces from Omaha-area winter road film, salt, and tracked-in mess.',
    path: '/blog/winter-road-salt-car-care-omaha-nebraska',
  },
  'mobile-vs-dropoff': {
    title: 'Mobile vs. Drop-Off Detailing',
    description: 'Compare convenience, weather, workspace, service depth, and vehicle-condition considerations.',
    path: '/blog/mobile-vs-drop-off-car-detailing-omaha-bellevue',
  },
  'detailing-frequency': {
    title: 'How Often Should You Detail Your Car?',
    description: 'Build a practical schedule around driving habits, passengers, storage, and Nebraska seasons.',
    path: '/blog/how-often-detail-car-omaha-nebraska',
  },
};

const TOPIC_GUIDES: Record<GuideTopic, GuideKey[]> = {
  all: ['interior-detailing', 'paint-correction', 'ceramic-vs-wax', 'winter-road-salt', 'mobile-vs-dropoff', 'detailing-frequency'],
  home: ['detailing-frequency', 'mobile-vs-dropoff', 'winter-road-salt'],
  interior: ['interior-detailing', 'detailing-frequency', 'mobile-vs-dropoff'],
  exterior: ['winter-road-salt', 'ceramic-vs-wax', 'detailing-frequency'],
  'full-detail': ['mobile-vs-dropoff', 'detailing-frequency', 'winter-road-salt'],
  paint: ['paint-correction', 'ceramic-vs-wax', 'winter-road-salt'],
  ceramic: ['ceramic-vs-wax', 'paint-correction', 'winter-road-salt'],
  maintenance: ['detailing-frequency', 'winter-road-salt', 'ceramic-vs-wax'],
  local: ['mobile-vs-dropoff', 'winter-road-salt', 'detailing-frequency'],
  gallery: ['paint-correction', 'interior-detailing', 'ceramic-vs-wax'],
  gift: ['detailing-frequency', 'interior-detailing', 'ceramic-vs-wax'],
};

const CATEGORY_TOPICS: Record<string, GuideTopic> = {
  'interior-detailing': 'interior',
  'exterior-detailing': 'exterior',
  'full-detailing': 'full-detail',
  'paint-correction': 'paint',
  protection: 'ceramic',
  'ceramic-coating': 'ceramic',
  maintenance: 'maintenance',
  'maintenance-plans': 'maintenance',
  'rv-boat-detailing': 'local',
  'tractor-detailing': 'local',
  'tractor-farm-equipment': 'local',
};

export function guideTopicForCategory(categoryId: string): GuideTopic {
  return CATEGORY_TOPICS[categoryId] ?? 'home';
}

interface RelatedGuidesProps {
  topic: GuideTopic;
  heading?: string;
  intro?: string;
  theme?: 'light' | 'dark';
}

export default function RelatedGuides({
  topic,
  heading = 'Helpful detailing guides',
  intro = 'Use these practical guides to compare options and choose the right next step for your vehicle.',
  theme = 'light',
}: RelatedGuidesProps) {
  const guides = TOPIC_GUIDES[topic].map((key) => ({ key, ...GUIDES[key] }));
  const isDark = theme === 'dark';

  return (
    <section className={isDark ? 'bg-zinc-950 py-20 text-white md:py-24' : 'border-y border-zinc-200 bg-zinc-50 py-20 md:py-24'}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              <BookOpen className="h-4 w-4" />
              Detailing knowledge center
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">{heading}</h2>
            <p className={`mt-4 max-w-2xl leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{intro}</p>
          </div>
          <Link to="/blog" className={`inline-flex items-center gap-2 font-black ${isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-zinc-950 hover:text-emerald-700'}`}>
            View all detailing tips <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className={`mt-10 grid gap-5 ${guides.length > 3 ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-3'}`}>
          {guides.map((guide) => (
            <Link
              key={guide.key}
              to={guide.path}
              className={`group flex min-h-56 flex-col rounded-2xl border p-6 transition-all hover:-translate-y-1 ${
                isDark
                  ? 'border-zinc-800 bg-zinc-900 hover:border-emerald-500/50'
                  : 'border-zinc-200 bg-white hover:border-emerald-500 hover:shadow-xl hover:shadow-zinc-200/50'
              }`}
            >
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Read the guide</span>
              <h3 className="mt-4 text-xl font-black leading-tight tracking-tight">{guide.title}</h3>
              <p className={`mt-3 text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{guide.description}</p>
              <span className={`mt-auto inline-flex items-center gap-2 pt-6 text-sm font-black ${isDark ? 'text-white' : 'text-zinc-950'}`}>
                Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
