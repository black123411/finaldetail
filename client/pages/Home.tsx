import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Check, MessageSquare, ShieldCheck, Star } from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import Testimonials from '../components/Testimonials';
import { SERVICES } from '@/shared/data/services';
import { BEFORE_AFTERS } from '@/shared/data/photos';
import { formatCurrency } from '../lib/utils';
import { trackEvent } from '../lib/analytics';

const results = BEFORE_AFTERS.filter(({ id }) => [1, 2, 6, 7].includes(id));
const textHref = 'sms:+17123056313?body=Hi%20Bryan%2C%20I%27m%20not%20sure%20which%20detail%20I%20need.%20Here%20are%20photos%20of%20my%20vehicle%3A';

const popular = [
  { id: 'interior-detail', label: 'Signature Interior Detail', fallback: 'Everyday dirt, crumbs, dusty surfaces, dirty mats, and light stains.' },
  { id: 'full-detail-package', label: 'Signature Full Detail', fallback: 'A complete interior detail with a thorough exterior cleaning.' },
  { id: 'paint-enhancement-polish', label: 'Paint Enhancement Polish', fallback: 'Dull paint, light swirls, wash haze, oxidation, and lost gloss.' },
  { id: 'system-x-crystal-plus', label: 'System X Crystal+ Essential', fallback: 'Entry-level certified ceramic protection for newer daily drivers.' },
].map((item) => ({ ...item, service: SERVICES.find((service) => service.id === item.id)! }));

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <img src="/hero-detailing-optimized.webp" alt="Detailed vehicle with a polished finish" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/25" />
        <div className="container mx-auto flex min-h-[620px] items-center px-4 py-24">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-blue-300">Owner-operated since 2017</p>
            <h1 className="max-w-3xl text-5xl font-black leading-[.96] tracking-tight sm:text-6xl lg:text-7xl">Mobile Car Detailing in Omaha &amp; Bellevue</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">Interior detailing, full details, paint correction, and ceramic coatings—done carefully and priced clearly before any additional work.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/services" onClick={() => trackEvent('view_services', { location: 'home_hero' })} className="inline-flex min-h-14 items-center justify-center gap-2 bg-blue-600 px-7 font-black text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
                View Services &amp; Pricing <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/book" onClick={() => trackEvent('begin_booking', { location: 'home_hero' })} className="inline-flex min-h-14 items-center justify-center gap-2 border border-white/50 bg-slate-950/40 px-7 font-black text-white hover:bg-white hover:text-slate-950">
                <Calendar className="h-5 w-5" /> Book Now
              </Link>
            </div>
            <a href={textHref} onClick={() => trackEvent('click_text_quote', { location: 'home_hero' })} className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold text-blue-200 underline decoration-blue-400 underline-offset-4 hover:text-white">
              Not sure? Text Bryan photos. <MessageSquare className="h-4 w-4" />
            </a>
            <p className="mt-5 text-sm text-slate-300">Mobile service across the metro and appointment-only drop-off in Bellevue.</p>
          </div>
        </div>
      </section>

      <section aria-label="Why customers trust Bryan" className="border-b border-slate-200 bg-white">
        <div className="container mx-auto grid px-4 sm:grid-cols-2 lg:grid-cols-5">
          {['Owner-operated since 2017', '4.9 customer rating', 'System X Certified', 'Mobile + Bellevue drop-off', 'Honest pricing before additional work'].map((item) => (
            <div key={item} className="flex min-h-20 items-center gap-3 border-b border-slate-200 py-4 last:border-b-0 sm:border-r sm:px-4 lg:border-b-0 first:pl-0 last:border-r-0">
              <Check className="h-5 w-5 shrink-0 text-blue-600" /><span className="text-sm font-black text-slate-800">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl"><p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">What I offer</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Services &amp; Starting Prices</h2><p className="mt-4 text-lg leading-8 text-slate-600">These four services cover the most common needs. Open a service for the full details, or view every option if your vehicle needs something different.</p></div>
            <Link to="/services" className="inline-flex min-h-11 shrink-0 items-center gap-2 font-black text-blue-700">See all services &amp; prices <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-10 grid border-l border-t border-slate-300 md:grid-cols-2">
            {popular.map(({ service, label, fallback }) => (
              <article key={service.id} className="flex min-h-72 flex-col border-b border-r border-slate-300 bg-white p-7 lg:p-9">
                <div><h3 className="text-2xl font-black">{label}</h3><p className="mt-2 text-lg font-black text-blue-700">From {formatCurrency(Math.min(...Object.values(service.price).filter(Boolean)))}</p></div>
                <p className="mt-5 flex-1 leading-7 text-slate-600">{service.bestFor || fallback}</p>
                <div className="mt-7 flex flex-wrap gap-2">
                  <Link to={`/services/${service.id}`} className="inline-flex min-h-11 items-center border border-slate-300 px-4 font-bold hover:border-blue-600 hover:text-blue-700">View Details</Link>
                  <Link to={`/book?serviceId=${service.id}`} onClick={() => trackEvent('begin_booking', { location: 'home_popular', service_id: service.id })} className="inline-flex min-h-11 items-center bg-blue-600 px-5 font-black text-white hover:bg-blue-700">Book</Link>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 text-base text-slate-600">Not sure which one fits? <a href={textHref} onClick={() => trackEvent('click_text_quote', { location: 'home_service_choices' })} className="inline-flex min-h-11 items-center gap-2 font-black text-blue-700 underline decoration-blue-300 underline-offset-4">Text me a few photos <MessageSquare className="h-4 w-4" /></a></p>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white lg:py-28">
        <div className="container mx-auto px-4"><div className="max-w-2xl"><p className="text-sm font-black uppercase tracking-[0.18em] text-blue-300">Real work</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Before &amp; After Results</h2><p className="mt-4 text-lg text-slate-300">Drag the sliders to see results from actual detailing jobs.</p></div>
          <div className="mt-12 grid gap-7 md:grid-cols-2">{results.map((item) => <article key={item.id}><BeforeAfterSlider beforeImage={item.before} afterImage={item.after} /><h3 className="mt-4 text-lg font-black">{item.label}</h3></article>)}</div>
          <Link to="/gallery" className="mt-10 inline-flex min-h-12 items-center gap-2 border border-slate-600 px-6 font-black hover:border-blue-400 hover:text-blue-300">View the gallery <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div><p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">Why customers choose me</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">The person you contact does the work.</h2><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">I inspect the vehicle, explain what I see, perform the detail, and check the finished work myself. If I find something unexpected, I talk with you before adding work or changing the price.</p><Link to="/about" className="mt-7 inline-flex min-h-12 items-center gap-2 bg-slate-950 px-6 font-black text-white hover:bg-blue-700">Meet Bryan <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="border-l-4 border-blue-600 bg-slate-50 p-8"><ShieldCheck className="h-9 w-9 text-blue-700" /><h3 className="mt-5 text-2xl font-black">Careful work. Honest communication.</h3><ul className="mt-5 space-y-4 text-slate-700">{['I treat every vehicle as if it were my own.', 'I recommend what the vehicle actually needs.', 'I do not promise results that are not realistic.', 'I personally check the finished work.'].map((item) => <li key={item} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-blue-600" />{item}</li>)}</ul></div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-20"><div className="container mx-auto px-4"><div className="mb-10 flex items-center gap-3"><Star className="h-6 w-6 fill-amber-400 text-amber-400" /><h2 className="text-3xl font-black">Customer Reviews</h2></div><Testimonials /></div></section>

      <section className="py-20 lg:py-24"><div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[1.25fr_.75fr] lg:items-center"><div><p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">Service area</p><h2 className="mt-3 text-4xl font-black tracking-tight">Mobile detailing across the Omaha metro</h2><p className="mt-5 text-lg leading-8 text-slate-600">I provide mobile detailing in Omaha, Bellevue, Papillion, La Vista, Council Bluffs, and nearby communities. Appointment-only vehicle drop-off is also available in Bellevue.</p><div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 font-bold text-blue-700"><Link to="/areas/omaha-ne">Omaha</Link><Link to="/areas/bellevue-ne">Bellevue</Link><Link to="/areas/papillion-ne">Papillion</Link><Link to="/areas/la-vista-ne">La Vista</Link><Link to="/areas/council-bluffs-ia">Council Bluffs</Link></div></div><aside className="border-l-4 border-blue-600 bg-slate-50 p-7"><h3 className="text-xl font-black">Mobile or Bellevue drop-off</h3><p className="mt-3 leading-7 text-slate-600">Mobile appointments depend on the service, weather, access, and a safe place to work. Longer paint and coating services are usually better suited to drop-off.</p><Link to="/quote" className="mt-5 inline-flex min-h-11 items-center gap-2 font-black text-blue-700">Ask about your location <ArrowRight className="h-4 w-4" /></Link></aside></div></section>

      <section className="bg-slate-900 py-20 text-white"><div className="container mx-auto flex flex-col justify-between gap-8 px-4 lg:flex-row lg:items-center"><div className="max-w-2xl"><h2 className="text-4xl font-black tracking-tight sm:text-5xl">Ready to get your vehicle cleaned up?</h2><p className="mt-4 text-lg text-slate-300">Choose a service and check availability, or text me photos if you want help deciding.</p></div><div className="flex flex-col gap-3 sm:flex-row"><Link to="/book" onClick={() => trackEvent('begin_booking', { location: 'home_final_cta' })} className="inline-flex min-h-14 items-center justify-center bg-blue-600 px-7 font-black text-white hover:bg-blue-700">Book Now</Link><a href={textHref} onClick={() => trackEvent('click_text_quote', { location: 'home_final_cta' })} className="inline-flex min-h-14 items-center justify-center border border-slate-600 px-7 font-black text-white hover:border-blue-400">Text Photos</a></div></div></section>
    </div>
  );
}
