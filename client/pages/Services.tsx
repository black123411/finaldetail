import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Check, Clock, MessageSquare } from 'lucide-react';
import { SERVICES, type Service } from '@/shared/data/services';
import { ServiceAPI } from '../services/api';
import { formatCurrency } from '../lib/utils';
import RelatedGuides from '../components/RelatedGuides';
import { trackEvent } from '../lib/analytics';

interface SquareService { id: string; name: string; variations: Array<{ id: string; name: string; price: number }> }

const groups = [
  { id: 'interior', label: 'Interior', title: 'Interior Detailing', description: 'From light upkeep to deep interior restoration, stain treatment, pet hair removal, and odor work.', ids: ['maintenance-interior', 'interior-detail', 'interior-reset', 'odor-elimination'] },
  { id: 'full-detail', label: 'Full Detail', title: 'Full Details', description: 'Inside-and-out packages for daily drivers, seasonal cleanups, new vehicles, and pre-sale preparation.', ids: ['full-detail-package', 'showroom-package', 'new-car-detail', 'pre-sale-detail', 'maintenance-detail'] },
  { id: 'paint', label: 'Paint', title: 'Paint Correction', description: 'Exterior decontamination and machine polishing to improve gloss, oxidation, swirls, and other correctable paint defects.', ids: ['exterior-enhancement', 'paint-enhancement-polish', 'paint-correction-l1', 'paint-correction-l2'] },
  { id: 'ceramic', label: 'Ceramic', title: 'Ceramic Coating', description: 'System X ceramic coating options with the paint preparation needed for a clean, durable finish.', ids: ['system-x-crystal-plus', 'system-x-pro-plus', 'system-x-max-g-plus', 'system-x-phantom-2k', 'ppf-inquiry'] },
  { id: 'specialty', label: 'Specialty', title: 'Specialty Vehicles', description: 'Cleaning, polishing, and protection for RVs, boats, tractors, trailers, and equipment.', ids: ['rv-boat-wash-wax', 'rv-boat-oxidation', 'tractor-detailing-service'] },
] as const;

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
function getStartingPrice(service: Service, square: SquareService[]) {
  const local = service.price.car || service.price.suv || service.price.rv || Object.values(service.price)[0];
  const target = normalize(service.squareName || service.name);
  const match = square.find((item) => normalize(item.name) === target || normalize(item.name).includes(target) || target.includes(normalize(item.name)));
  const prices = match?.variations.map((variation) => variation.price).filter((price) => price > 0) || [];
  const price = prices.length ? Math.min(...prices) : local;
  if (!price) return 'Custom quote';
  return service.pricingType === 'variable' ? `From ${formatCurrency(price)}/ft` : `From ${formatCurrency(price)}`;
}
function getDuration(service: Service) { return typeof service.duration === 'string' ? service.duration : service.duration.car || service.duration.rv || Object.values(service.duration)[0] }

export default function Services() {
  const [squareServices, setSquareServices] = useState<SquareService[]>([]);
  useEffect(() => { ServiceAPI.getCatalogServices().then((data) => setSquareServices(Array.isArray(data) ? data : [])).catch(() => setSquareServices([])); }, []);
  const schema = { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: SERVICES.map((service, index) => ({ '@type': 'ListItem', position: index + 1, url: `https://bryansdetailingomaha.com/services/${service.id}`, name: service.name })) };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Helmet><script type="application/ld+json">{JSON.stringify(schema)}</script></Helmet>
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <img src="/gallery/takeout/20260502_192636.webp" alt="Black vehicle paint after detailing" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/35" />
        <div className="container mx-auto px-4 py-14 md:py-20"><div className="max-w-3xl"><p className="text-sm font-black uppercase tracking-[.18em] text-blue-300">Services &amp; pricing</p><h1 className="mt-4 text-4xl font-black leading-[.98] tracking-tight sm:text-5xl md:text-6xl">Auto Detailing Services and Pricing</h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">Compare the services below by the work your vehicle needs. Prices start with standard-condition vehicles and change with size or heavier work. I explain any additional cost before I begin.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link to="/book" className="inline-flex min-h-14 items-center justify-center bg-blue-600 px-7 font-black hover:bg-blue-700">Check Availability</Link><a href="sms:+17123056313?body=Hi%20Bryan%2C%20I%20need%20help%20choosing%20a%20detail.%20Here%20are%20photos%3A" className="inline-flex min-h-14 items-center justify-center gap-2 border border-white/50 px-7 font-black hover:bg-white hover:text-slate-950"><MessageSquare className="h-5 w-5" /> Text Photos</a></div></div></div>
      </section>

      <nav aria-label="Service categories" className="sticky top-18 z-30 border-b border-slate-200 bg-white"><div className="container mx-auto flex snap-x overflow-x-auto px-4">{groups.map((group) => <a key={group.id} href={`#${group.id}`} className="flex min-h-14 shrink-0 snap-start items-center border-b-2 border-transparent px-5 text-sm font-black text-slate-600 hover:border-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">{group.label}</a>)}</div></nav>

      <div className="container mx-auto px-4 py-10 md:py-16">
        <p className="mb-10 border-b border-slate-200 pb-6 text-sm font-semibold leading-6 text-slate-600">Starting prices vary by vehicle size and condition. Mobile service and Bellevue drop-off are available. Payment is collected after the work is completed.</p>
        <div className="space-y-16">
          {groups.map((group) => {
            const services = group.ids.map((id) => SERVICES.find((service) => service.id === id)).filter((service): service is Service => Boolean(service));
            return <section key={group.id} id={group.id} className="scroll-mt-36"><div className="grid gap-5 border-b-2 border-slate-950 pb-7 md:grid-cols-[.8fr_1.2fr]"><h2 className="text-3xl font-black tracking-tight md:text-4xl">{group.title}</h2><p className="max-w-2xl leading-7 text-slate-600">{group.description}</p></div><div className="divide-y divide-slate-200 border-b border-slate-200">{services.map((service) => {
              const inquiry = service.id === 'ppf-inquiry' || !Object.values(service.price).some((price) => price > 0);
              return <article key={service.id} className="grid gap-6 py-7 lg:grid-cols-[1fr_1.3fr_auto] lg:items-start"><div><h3 className="text-2xl font-black tracking-tight">{service.name}</h3><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-blue-700"><span>{getStartingPrice(service, squareServices)}</span><span className="inline-flex items-center gap-1.5 text-slate-600"><Clock className="h-4 w-4" /> {getDuration(service)}</span></div></div><div><p className="leading-7 text-slate-600">{service.bestFor || service.shortDescription}</p><ul className="mt-4 grid gap-2 sm:grid-cols-2">{service.features.slice(0, 3).map((feature) => <li key={feature} className="flex gap-2 text-sm text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />{feature}</li>)}</ul></div><div className="flex gap-2 lg:justify-end"><Link to={`/services/${service.id}`} className="inline-flex min-h-11 items-center border border-slate-300 px-4 font-bold hover:border-blue-600 hover:text-blue-700">View Details</Link><Link to={inquiry ? '/quote' : `/book?serviceId=${service.id}`} onClick={() => trackEvent(inquiry ? 'begin_quote' : 'begin_booking', { location: 'services_list', service_id: service.id })} className="inline-flex min-h-11 items-center bg-blue-600 px-5 font-black text-white hover:bg-blue-700">{inquiry ? 'Request Quote' : 'Book'}</Link></div></article>;
            })}</div></section>;
          })}
        </div>
      </div>
      <RelatedGuides topic="all" heading="Helpful detailing guides" intro="Learn more about interior work, paint correction, ceramic protection, seasonal care, and appointment options." />
      <section className="bg-slate-950 py-16 text-white"><div className="container mx-auto flex flex-col justify-between gap-7 px-4 md:flex-row md:items-center"><div><h2 className="text-3xl font-black">Not sure what your vehicle needs?</h2><p className="mt-3 max-w-2xl text-slate-300">Text me clear photos and tell me what you want fixed. I will point you toward the service that makes sense.</p></div><a href="sms:+17123056313?body=Hi%20Bryan%2C%20I%20need%20help%20choosing%20a%20detail.%20Here%20are%20photos%3A" className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 bg-blue-600 px-7 font-black hover:bg-blue-700">Text Photos <ArrowRight className="h-5 w-5" /></a></div></section>
    </div>
  );
}
