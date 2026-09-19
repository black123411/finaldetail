import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Check, MessageSquare, ShieldCheck, Star } from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import Testimonials from '../components/Testimonials';
import { SERVICES } from '@/shared/data/services';
import { BEFORE_AFTERS } from '@/shared/data/photos';
import { formatCurrency } from '../lib/utils';
import { trackBookingHandoff, trackEvent } from '../lib/analytics';
import { getSquareBookingLink } from '../lib/constants';

const results = BEFORE_AFTERS.filter(({ id }) => [1, 2, 6, 7].includes(id));
const textHref = 'sms:+17123056313?body=Hi%20Bryan%2C%20I%27m%20not%20sure%20which%20detail%20I%20need.%20Here%20are%20photos%20of%20my%20vehicle%3A';
const googleReviewsHref = "https://www.google.com/maps/search/?api=1&query=Bryan%27s%20Showroom%20Quality%20Mobile%20Detailing&query_place_id=ChIJVVU5ibSJk4cRCK2ex-dRYIg";

const popular = [
  { id: 'interior-detail', label: 'Signature Interior Detail', fit: 'Normal daily use', fallback: 'Dust, crumbs, dirty mats, light stains and everyday interior buildup.' },
  { id: 'full-detail-package', label: 'Signature Full Detail', fit: 'Inside + outside', fallback: 'Professional interior detailing with exterior cleaning, decontamination and protection.' },
  { id: 'paint-enhancement-polish', label: 'Paint Enhancement Polish', fit: 'Dull or lightly swirled paint', fallback: 'Improve gloss, light swirls, wash haze and mild oxidation with machine polishing.' },
  { id: 'system-x-crystal-plus', label: 'System X Crystal+ Essential', fit: 'Longer-term protection', fallback: 'Certified ceramic protection with the paint preparation appropriate for the vehicle.' },
].map((item) => ({ ...item, service: SERVICES.find((service) => service.id === item.id)! }));

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto grid min-h-[620px] gap-10 px-4 py-16 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-black leading-[.96] tracking-tight sm:text-6xl lg:text-7xl">Car Detailing in Bellevue &amp; Omaha, NE</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">Professional interior detailing, complete full details, paint correction and certified System X ceramic coatings. Mobile service is available throughout the metro, with appointment-only Bellevue drop-off for longer or weather-sensitive work.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/services" onClick={() => trackEvent('view_services', { location: 'home_hero_primary' })} className="inline-flex min-h-14 items-center justify-center gap-2 bg-blue-600 px-7 font-black text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <Calendar className="h-5 w-5" /> View Services &amp; Pricing
              </Link>
              <a href={textHref} onClick={() => trackEvent('click_text_quote', { location: 'home_hero' })} className="inline-flex min-h-14 items-center justify-center gap-2 border border-slate-300 px-7 font-black text-slate-900 hover:border-blue-600 hover:text-blue-700">
                <MessageSquare className="h-5 w-5" /> Text Vehicle Photos
              </a>
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-500">Not sure what to book? Send a few clear photos and tell me what you want improved. I will recommend the service that fits before you schedule.</p>
          </div>

          <div className="relative">
            <img src="/hero-detailing-optimized.webp" alt="Professionally detailed vehicle in Bellevue Nebraska" className="aspect-[4/3] w-full object-cover" />
            <div className="grid border-x border-b border-slate-200 bg-slate-50 sm:grid-cols-3">
              <div className="border-b border-slate-200 p-5 sm:border-b-0 sm:border-r"><p className="text-xs font-black uppercase tracking-[.14em] text-slate-500">Serving the metro</p><p className="mt-1 font-black">Since 2017</p></div>
              <div className="border-b border-slate-200 p-5 sm:border-b-0 sm:border-r"><p className="text-xs font-black uppercase tracking-[.14em] text-slate-500">Service options</p><p className="mt-1 font-black">Mobile + Drop-Off</p></div>
              <div className="p-5"><p className="text-xs font-black uppercase tracking-[.14em] text-slate-500">Coatings</p><p className="mt-1 font-black">System X Certified</p></div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Why customers choose Bryan" className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="container mx-auto grid px-4 sm:grid-cols-3">
          {['Owner-operated service', '4.8 rating from 48 Google reviews', 'Mobile + Bellevue drop-off'].map((item) => (
            <div key={item} className="flex min-h-20 items-center gap-3 border-b border-slate-800 py-4 last:border-b-0 sm:border-r sm:px-5 lg:border-b-0 first:pl-0 last:border-r-0">
              <Check className="h-5 w-5 shrink-0 text-blue-400" />
              {item.includes('Google reviews') ? (
                <a href={googleReviewsHref} target="_blank" rel="noreferrer" className="text-sm font-black text-slate-100 underline decoration-slate-600 underline-offset-4 hover:text-blue-300">{item}</a>
              ) : (
                <span className="text-sm font-black text-slate-100">{item}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div>
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Choose by what your vehicle needs</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">You do not need to diagnose the package yourself. Start with the result you want, compare the service details, then check live availability in Square.</p>
              <Link to="/services" className="mt-6 inline-flex min-h-11 items-center gap-2 font-black text-blue-700 hover:text-blue-900">Compare every service <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid border-l border-t border-slate-300 md:grid-cols-2">
              {popular.map(({ service, label, fit, fallback }) => {
                const start = Math.min(...Object.values(service.price).filter((price) => price > 0));
                return (
                  <article key={service.id} className="flex min-h-72 flex-col border-b border-r border-slate-300 bg-white p-7 lg:p-8">
                    <p className="text-xs font-black uppercase tracking-[.14em] text-blue-700">{fit}</p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight">{label}</h3>
                    <p className="mt-2 text-lg font-black text-slate-900">From {formatCurrency(start)}</p>
                    <p className="mt-5 flex-1 leading-7 text-slate-600">{service.bestFor || fallback}</p>
                    <div className="mt-7 flex flex-wrap gap-2">
                      <Link to={`/services/${service.id}`} className="inline-flex min-h-11 items-center border border-slate-300 px-4 font-bold hover:border-blue-600 hover:text-blue-700">View Details</Link>
                      <a href={getSquareBookingLink(service.id)} onClick={(event) => trackBookingHandoff(event, { location: 'home_popular', service_id: service.id })} className="inline-flex min-h-11 items-center bg-blue-600 px-5 font-black text-white hover:bg-blue-700">Check Availability</a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="mt-8 border-l-4 border-blue-600 bg-slate-50 p-6 sm:flex sm:items-center sm:justify-between sm:gap-8">
            <div><h3 className="text-xl font-black">Still not sure which service fits?</h3><p className="mt-2 leading-7 text-slate-600">Text me photos of the interior, exterior or problem area. I will tell you what I would book for that vehicle.</p></div>
            <a href={textHref} onClick={() => trackEvent('click_text_quote', { location: 'home_service_choices' })} className="mt-5 inline-flex min-h-12 shrink-0 items-center gap-2 bg-slate-950 px-5 font-black text-white hover:bg-blue-700 sm:mt-0"><MessageSquare className="h-4 w-4" /> Text Photos</a>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Real detailing results</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">Before-and-after photos from actual vehicles make it easier to judge the kind of improvement a service can realistically deliver.</p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {results.map((item) => <article key={item.id}><BeforeAfterSlider beforeImage={item.before} afterImage={item.after} /><h3 className="mt-4 text-lg font-black">{item.label}</h3></article>)}
          </div>
          <Link to="/gallery" className="mt-9 inline-flex min-h-12 items-center gap-2 border border-slate-300 bg-white px-6 font-black hover:border-blue-600 hover:text-blue-700">View Before &amp; After Gallery <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <img src="/bryan-professional-headshot.webp" alt="Bryan, owner of Bryan's Showroom Quality Detailing in Bellevue Nebraska" className="aspect-[4/3] w-full object-cover object-center" />
          <div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">The person you contact does the work</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">I inspect the vehicle, recommend the service, perform the detail and check the finished result myself. Before opening the business in 2017, I worked around collision-center detailing, vehicle preparation and paint prep, experience that still guides how I approach paint and interior materials today.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {['Direct communication with the owner', 'Condition-based service recommendations', 'No surprise condition-related upgrades', 'Realistic expectations for stains and paint defects'].map((item) => <div key={item} className="flex gap-3 border-t border-slate-200 pt-4"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" /><span className="font-bold text-slate-800">{item}</span></div>)}
            </div>
            <Link to="/about" className="mt-8 inline-flex min-h-12 items-center gap-2 bg-slate-950 px-6 font-black text-white hover:bg-blue-700">About Bryan's Detailing <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-9 flex flex-wrap items-center gap-3"><Star className="h-6 w-6 fill-amber-400 text-amber-400" /><h2 className="text-3xl font-black">4.8 on Google from 48 reviews</h2><a href={googleReviewsHref} target="_blank" rel="noreferrer" className="ml-auto font-black text-blue-700 underline decoration-blue-200 underline-offset-4 hover:text-blue-900">Read Google reviews</a></div>
          <Testimonials />
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white lg:py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Mobile detailing across Bellevue and Omaha</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">I serve Bellevue, Omaha, Papillion, La Vista, Council Bluffs and nearby communities. Mobile availability depends on the service, weather, access and a safe place to work. Longer paint and coating services are usually better suited to Bellevue drop-off.</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 font-bold text-blue-300"><Link to="/areas/bellevue-ne">Bellevue</Link><Link to="/areas/omaha-ne">Omaha</Link><Link to="/areas/papillion-ne">Papillion</Link><Link to="/areas/la-vista-ne">La Vista</Link><Link to="/areas/council-bluffs-ia">Council Bluffs</Link></div>
          </div>
          <div className="border-l-4 border-blue-500 bg-slate-900 p-7"><h3 className="text-2xl font-black">Ready to schedule?</h3><p className="mt-3 leading-7 text-slate-300">Choose a service and check current availability, or send photos first if you want a recommendation.</p><div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row"><Link to="/services" onClick={() => trackEvent('view_services', { location: 'home_final_cta' })} className="inline-flex min-h-12 items-center justify-center bg-blue-600 px-6 font-black text-white hover:bg-blue-700">View Services &amp; Pricing</Link><a href={textHref} onClick={() => trackEvent('click_text_quote', { location: 'home_final_cta' })} className="inline-flex min-h-12 items-center justify-center border border-slate-600 px-6 font-black text-white hover:border-blue-400">Text Photos</a></div></div>
        </div>
      </section>
    </div>
  );
}
