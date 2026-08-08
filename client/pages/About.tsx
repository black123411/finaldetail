import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, MapPin, MessageSquare, Search, ShieldCheck, Sparkles, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { trackEvent } from '../lib/analytics';

const APPROACH = [
  {
    icon: Search,
    title: 'Inspect before recommending',
    copy: 'Vehicle condition, materials, paint defects, access, and the result you want are reviewed before the service scope is finalized.',
  },
  {
    icon: ShieldCheck,
    title: 'Protect the vehicle first',
    copy: 'Products, tools, and correction steps are selected for the surface being worked on instead of forcing every vehicle through one process.',
  },
  {
    icon: CheckCircle2,
    title: 'Explain changes clearly',
    copy: 'If condition, vehicle size, or an unexpected issue changes the price or timing, Bryan explains it before additional work begins.',
  },
];

const SPECIALTIES = [
  'Interior detailing and deeper interior restoration',
  'Complete inside-and-out detailing packages',
  'Paint enhancement and paint correction',
  'Certified System X ceramic coating installation',
  'Maintenance care for previously detailed vehicles',
  'RV, boat, tractor, and equipment detailing by appointment',
];

export default function About() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Bryan',
    jobTitle: 'Owner and Professional Auto Detailer',
    url: 'https://bryansdetailingomaha.com/about',
    worksFor: {
      '@type': 'LocalBusiness',
      '@id': 'https://bryansdetailingomaha.com/#business',
      name: "Bryan's Showroom Quality Mobile Detailing",
    },
    knowsAbout: [
      'Interior car detailing',
      'Paint correction',
      'Ceramic coating',
      'Vehicle appearance care',
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>

      <section className="relative overflow-hidden bg-zinc-950 pb-24 pt-28 text-white md:pb-32 md:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(16,185,129,0.16),transparent_38%)]" />
        <div className="container relative mx-auto grid items-center gap-14 px-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-400">Owner-operated since 2017</p>
            <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
              Meet Bryan, Your Local Auto Detailer
            </h1>
            <p className="mt-7 max-w-2xl text-lg font-medium leading-relaxed text-zinc-300 md:text-xl">
              Bryan owns and operates Bryan's Showroom Quality Mobile Detailing from Bellevue, serving drivers throughout the Omaha metro with mobile and appointment-only drop-off options.
            </p>
            <p className="mt-5 max-w-2xl leading-relaxed text-zinc-400">
              Every vehicle is handled with a condition-based plan—not an assembly-line checklist. The goal is to recommend the service the vehicle actually needs, set realistic expectations, and protect the materials and finish while producing a result worth maintaining.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-14 bg-emerald-500 px-7 font-black text-zinc-950 hover:bg-emerald-400" asChild>
                <Link to="/book" onClick={() => trackEvent('begin_booking', { location: 'about_hero' })}>
                  <Calendar className="mr-2 h-5 w-5" /> View Availability
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 border-zinc-700 bg-white/5 px-7 font-black text-white hover:bg-white hover:text-zinc-950" asChild>
                <a href="sms:+17123056313?body=Hi%20Bryan%2C%20I%27d%20like%20help%20choosing%20a%20detailing%20service.%20Here%20are%20photos%20of%20my%20vehicle%3A" onClick={() => trackEvent('click_text_quote', { location: 'about_hero' })}>
                  <MessageSquare className="mr-2 h-5 w-5" /> Text Photos to Bryan
                </a>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-900 shadow-2xl">
              <img
                src="/interior-detailing.png"
                alt="Bryan's professional interior detailing work in Bellevue and Omaha"
                width="1200"
                height="900"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="grid gap-4 p-7 sm:grid-cols-2">
                <div>
                  <p className="text-3xl font-black text-white">2017</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-zinc-400">Serving the metro since</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-emerald-400">System X</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-zinc-400">Certified installer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">The owner-operated difference</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-zinc-950 md:text-6xl">One person accountable for the process.</h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-600">
              Bryan reviews the vehicle, performs the work, and communicates the scope. That keeps recommendations, expectations, and quality control connected from the first photos through the final walkthrough.
            </p>
          </div>
          <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
            {APPROACH.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-2xl font-black tracking-tight text-zinc-950">{title}</h3>
                <p className="mt-4 leading-relaxed text-zinc-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto grid gap-14 px-4 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">Detailing specialties</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-zinc-950 md:text-5xl">From daily-driver interiors to long-term paint protection.</h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-600">
              Services are selected around the vehicle's condition and the result you want. Mobile work is available where the service, weather, access, and workspace are suitable. Intensive paint, coating, and restoration work can use Bellevue drop-off by appointment.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild><Link to="/services">Compare Services & Pricing</Link></Button>
              <Button variant="outline" asChild><Link to="/gallery">View Real Results</Link></Button>
            </div>
          </div>
          <div className="rounded-[2rem] bg-zinc-950 p-8 text-white md:p-10">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-emerald-400" />
              <h2 className="text-2xl font-black">Work Bryan handles</h2>
            </div>
            <ul className="mt-7 space-y-4">
              {SPECIALTIES.map((item) => (
                <li key={item} className="flex items-start gap-3 text-zinc-300">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-emerald-400">
            <MapPin className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-4xl font-black tracking-tight text-zinc-950">Based in Bellevue. Serving the Omaha metro.</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-zinc-600">
            Learn how mobile and drop-off detailing work in the two primary service areas, then choose the package that matches your vehicle.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="outline" asChild><Link to="/areas/omaha-ne">Omaha Detailing</Link></Button>
            <Button variant="outline" asChild><Link to="/areas/bellevue-ne">Bellevue Detailing</Link></Button>
            <Button variant="outline" asChild><Link to="/review">Leave a Review</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
