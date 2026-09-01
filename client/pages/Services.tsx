import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Check, Clock, MessageSquare } from 'lucide-react';
import { SERVICES, type Service } from '@/shared/data/services';
import { CUSTOMER_SERVICE_GROUPS, SPECIALTY_SERVICE_OPTIONS } from '@/shared/data/customerServiceHierarchy';
import { ServiceAPI } from '../services/api';
import { formatCurrency } from '../lib/utils';
import RelatedGuides from '../components/RelatedGuides';
import { trackBookingHandoff, trackEvent } from '../lib/analytics';
import { BOOKING_LINK, getSquareBookingLink, isInquiryOnlyService } from '../lib/constants';

interface SquareService { id: string; name: string; variations: Array<{ id: string; name: string; price: number }> }

const groups = CUSTOMER_SERVICE_GROUPS;
const navigationGroups = [...groups, { id: 'specialty', label: 'Specialty' }];
const PHOTO_TEXT_LINK = 'sms:+17123056313?body=Hi%20Bryan%2C%20I%20need%20a%20quote%20for%20condition-dependent%20detailing.%20Here%20are%20photos%3A';

// Entry point for people who know what is wrong with their vehicle but not what
// the service is called. Every destination is an existing page or section anchor.
const needs = [
  { need: 'The inside needs cleaned', answer: 'Signature Interior Detail', href: '/services/interior-detail' },
  { need: 'Heavy stains, spills, or typical heavy pet hair', answer: 'Interior Restoration', href: '/services/interior-reset' },
  { need: 'Odor, mold, contamination, or unusual condition', answer: 'Text Photos / Request Quote', href: '#specialty' },
  { need: 'Inside and outside together', answer: 'Full Details', href: '#full-detail' },
  { need: 'Paint looks dull or swirled', answer: 'Paint Correction', href: '#paint' },
  { need: 'I want long-term protection', answer: 'Ceramic Coating', href: '#ceramic' },
  { need: 'RV, boat, or work equipment', answer: 'Text Photos / Request Quote', href: '#specialty' },
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
        <div className="container mx-auto px-4 py-14 md:py-20"><div className="max-w-3xl"><p className="text-sm font-black uppercase tracking-[.18em] text-blue-300">Services &amp; pricing</p><h1 className="mt-4 text-4xl font-black leading-[.98] tracking-tight sm:text-5xl md:text-6xl">Auto Detailing Services and Pricing</h1><p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">See what each service includes and where pricing starts. Larger vehicles and heavier cleanup can take more time, and I will explain any price change before I begin.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><a href={BOOKING_LINK} onClick={(event) => trackBookingHandoff(event, { location: 'services_hero' })} className="inline-flex min-h-14 items-center justify-center bg-blue-600 px-7 font-black hover:bg-blue-700">Check Availability</a><a href="sms:+17123056313?body=Hi%20Bryan%2C%20I%20need%20help%20choosing%20a%20detail.%20Here%20are%20photos%3A" className="inline-flex min-h-14 items-center justify-center gap-2 border border-white/50 px-7 font-black hover:bg-white hover:text-slate-950"><MessageSquare className="h-5 w-5" /> Text Me Photos</a></div></div></div>
      </section>

      <nav aria-label="Service categories" className="sticky top-18 z-30 border-b border-slate-200 bg-white"><div className="container mx-auto flex snap-x overflow-x-auto px-4">{navigationGroups.map((group) => <a key={group.id} href={`#${group.id}`} className="flex min-h-14 shrink-0 snap-start items-center border-b-2 border-transparent px-5 text-sm font-black text-slate-600 hover:border-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">{group.label}</a>)}</div></nav>

      <div className="container mx-auto px-4 py-10 md:py-16">
        <section aria-labelledby="what-do-you-need" className="mb-10 border-b border-slate-200 pb-10">
          <h2 id="what-do-you-need" className="text-2xl font-black tracking-tight md:text-3xl">What does your vehicle need?</h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">Start with the problem and I will point you to the right service. Not sure? Text me photos and I will tell you straight.</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {needs.map((item) => {
              const inner = (
                <>
                  <span className="block font-bold leading-6 text-slate-900 group-hover:text-blue-700">{item.need}</span>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-black text-blue-700">
                    {item.answer}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </>
              );
              const className = 'group flex min-h-20 flex-col justify-center border border-slate-300 px-5 py-4 transition hover:border-blue-600 hover:bg-blue-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500';
              return (
                <li key={item.need}>
                  {item.href.startsWith('#') ? (
                    <a href={item.href} className={className}>{inner}</a>
                  ) : (
                    <Link to={item.href} className={className}>{inner}</Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
        <p className="mb-10 border-b border-slate-200 pb-6 text-sm font-semibold leading-6 text-slate-600">Starting prices vary by vehicle size and condition. Mobile service and Bellevue drop-off are available. Payment is collected after the work is completed.</p>
        <div className="space-y-16">
          {groups.map((group) => {
            const services = group.services.map((option) => {
              const service = SERVICES.find((item) => item.id === option.serviceId);
              return service ? { service, option } : null;
            }).filter((entry): entry is { service: Service; option: (typeof group.services)[number] } => Boolean(entry));
            return <section key={group.id} id={group.id} className="scroll-mt-36"><div className="grid gap-5 border-b-2 border-slate-950 pb-7 md:grid-cols-[.8fr_1.2fr]"><h2 className="text-3xl font-black tracking-tight md:text-4xl">{group.title}</h2><p className="max-w-2xl leading-7 text-slate-600">{group.description}</p></div><div className="divide-y divide-slate-200 border-b border-slate-200">{services.map(({ service, option }) => {
              const inquiry = isInquiryOnlyService(service.id) || !Object.values(service.price).some((price) => price > 0);
              const highlights = option.customerHighlights || service.features.slice(0, 3);
              return <article key={service.id} className={`grid gap-6 py-7 lg:grid-cols-[1fr_1.3fr_auto] lg:items-start ${option.recommended ? 'bg-blue-50/60 px-4 sm:px-6' : ''}`}><div><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-black uppercase tracking-[.14em] text-blue-700">{option.fitLabel}</p>{option.recommended && <span className="bg-blue-600 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-white">Recommended</span>}</div><h3 className="mt-2 text-2xl font-black tracking-tight">{option.displayName || service.name}</h3><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-blue-700"><span>{getStartingPrice(service, squareServices)}</span><span className="inline-flex items-center gap-1.5 text-slate-600"><Clock className="h-4 w-4" /> {getDuration(service)}</span></div></div><div><p className="font-semibold leading-7 text-slate-800">{option.customerDescription}</p><ul className="mt-4 grid gap-2 sm:grid-cols-2">{highlights.map((feature) => <li key={feature} className="flex gap-2 text-sm text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />{feature}</li>)}</ul></div><div className="flex gap-2 lg:justify-end"><Link to={`/services/${service.id}`} className="inline-flex min-h-11 items-center border border-slate-300 px-4 font-bold hover:border-blue-600 hover:text-blue-700">View Details</Link>{inquiry ? <Link to="/quote" onClick={() => trackEvent('begin_quote', { location: 'services_list', service_id: service.id })} className="inline-flex min-h-11 items-center bg-blue-600 px-5 font-black text-white hover:bg-blue-700">Request Quote</Link> : <a href={getSquareBookingLink(service.id)} onClick={(event) => trackBookingHandoff(event, { location: 'services_list', service_id: service.id })} className="inline-flex min-h-11 items-center bg-blue-600 px-5 font-black text-white hover:bg-blue-700">Book</a>}</div></article>;
            })}</div></section>;
          })}
          <section id="specialty" className="scroll-mt-36">
            <div className="grid gap-5 border-b-2 border-slate-950 pb-7 md:grid-cols-[.8fr_1.2fr]">
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">Specialty / Restoration</h2>
              <p className="max-w-2xl leading-7 text-slate-600">These jobs vary too much by condition, size, access, or safety requirements to price responsibly before I see them. Text clear photos or request a quote first.</p>
            </div>
            <div className="grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
              {SPECIALTY_SERVICE_OPTIONS.map((option) => (
                <article key={option.id} className="flex min-h-64 flex-col bg-white p-6">
                  <p className="text-xs font-black uppercase tracking-[.14em] text-violet-700">Photo review required</p>
                  <h3 className="mt-2 text-xl font-black tracking-tight">{option.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{option.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a href={PHOTO_TEXT_LINK} onClick={() => trackEvent('click_text_quote', { location: 'services_specialty', specialty_id: option.id })} className="inline-flex min-h-11 items-center gap-2 border border-slate-300 px-4 font-bold hover:border-blue-600 hover:text-blue-700"><MessageSquare className="h-4 w-4" /> Text Photos</a>
                    <Link to="/quote" onClick={() => trackEvent('begin_quote', { location: 'services_specialty', specialty_id: option.id })} className="inline-flex min-h-11 items-center bg-blue-600 px-4 font-black text-white hover:bg-blue-700">Request Quote</Link>
                    {option.serviceId && <Link to={`/services/${option.serviceId}`} className="inline-flex min-h-11 items-center px-1 text-sm font-bold text-blue-700 hover:underline">Service details</Link>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
      <RelatedGuides topic="all" heading="Helpful detailing guides" intro="Learn more about interior work, paint correction, ceramic protection, seasonal care, and appointment options." />
      <section className="bg-slate-950 py-16 text-white"><div className="container mx-auto flex flex-col justify-between gap-7 px-4 md:flex-row md:items-center"><div><h2 className="text-3xl font-black">Not sure which service to book?</h2><p className="mt-3 max-w-2xl text-slate-300">Text me a few clear photos and tell me what you want cleaned or corrected. I will take a look and give you a straight answer.</p></div><a href="sms:+17123056313?body=Hi%20Bryan%2C%20I%20need%20help%20choosing%20a%20detail.%20Here%20are%20photos%3A" className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 bg-blue-600 px-7 font-black hover:bg-blue-700">Text Me Photos <ArrowRight className="h-5 w-5" /></a></div></section>
    </div>
  );
}
