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
import { getSquareBookingLink, isInquiryOnlyService } from '../lib/constants';

interface SquareService {
  id: string;
  name: string;
  variations: Array<{ id: string; name: string; price: number }>;
}

const groups = CUSTOMER_SERVICE_GROUPS;
const navigationGroups = [...groups, { id: 'specialty', label: 'Specialty' }];
const photoTextLink = 'sms:+17123056313?body=Hi%20Bryan%2C%20I%20need%20help%20choosing%20a%20detail.%20Here%20are%20photos%20of%20my%20vehicle%3A';

const needs = [
  { need: 'Normal interior dirt and everyday buildup', answer: 'Signature Interior Detail', href: '/services/interior-detail' },
  { need: 'Heavy stains, spills or embedded pet hair', answer: 'Interior Restoration', href: '/services/interior-reset' },
  { need: 'Inside and outside cleaned together', answer: 'Full Detailing Packages', href: '#full-detail' },
  { need: 'Dull paint, haze or visible swirls', answer: 'Paint Enhancement / Correction', href: '#paint' },
  { need: 'Long-term paint protection', answer: 'System X Ceramic Coating', href: '/ceramic-coating' },
  { need: 'Odor, mold, contamination or unusual condition', answer: 'Photo Review / Quote', href: '#specialty' },
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

function getDuration(service: Service) {
  return typeof service.duration === 'string' ? service.duration : service.duration.car || service.duration.rv || Object.values(service.duration)[0];
}

export default function Services() {
  const [squareServices, setSquareServices] = useState<SquareService[]>([]);

  useEffect(() => {
    ServiceAPI.getCatalogServices()
      .then((data) => setSquareServices(Array.isArray(data) ? data : []))
      .catch(() => setSquareServices([]));
  }, []);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: SERVICES.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://bryansdetailingomaha.com/services/${service.id}`,
      name: service.name,
    })),
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Helmet><script type="application/ld+json">{JSON.stringify(schema)}</script></Helmet>

      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto grid gap-10 px-4 py-14 lg:grid-cols-[1fr_.82fr] lg:items-center lg:py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-black leading-[.98] tracking-tight sm:text-6xl">Car Detailing Services &amp; Pricing</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Compare interior detailing, full details, exterior paint care, paint correction and System X ceramic coating. Start with the condition of your vehicle and the result you want, then check current Square availability for the exact service.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#what-do-you-need" onClick={() => trackEvent('view_service_chooser', { location: 'services_hero' })} className="inline-flex min-h-14 items-center justify-center bg-blue-600 px-7 font-black text-white hover:bg-blue-700">Find the Right Service</a>
              <a href={photoTextLink} onClick={() => trackEvent('click_text_quote', { location: 'services_hero' })} className="inline-flex min-h-14 items-center justify-center gap-2 border border-slate-300 px-7 font-black text-slate-900 hover:border-blue-600 hover:text-blue-700"><MessageSquare className="h-5 w-5" /> Text Vehicle Photos</a>
            </div>
          </div>

          <div className="border-l-4 border-blue-600 bg-slate-50 p-7 sm:p-9">
            <h2 className="text-2xl font-black">Before you book</h2>
            <div className="mt-5 space-y-4 text-slate-700">
              {[
                'Square shows current appointment availability and vehicle-size options.',
                'Standard detailing appointments do not require a deposit.',
                'Ceramic coating appointments require a deposit.',
                'If the vehicle needs work beyond the selected package, I discuss it before adding it.',
              ].map((item) => <div key={item} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" /><p className="leading-7">{item}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <nav aria-label="Service categories" className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="container mx-auto flex snap-x overflow-x-auto px-4">
          {navigationGroups.map((group) => <a key={group.id} href={`#${group.id}`} className="flex min-h-14 shrink-0 snap-start items-center border-b-2 border-transparent px-5 text-sm font-black text-slate-600 hover:border-blue-600 hover:text-blue-700">{group.label}</a>)}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 lg:py-16">
        <section id="what-do-you-need" className="scroll-mt-36 border-b border-slate-200 pb-12">
          <div className="grid gap-7 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
            <div>
              <h2 className="text-4xl font-black tracking-tight">What does your vehicle need?</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">Start with the problem instead of trying to decode package names.</p>
            </div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {needs.map((item) => {
                const inner = <><div><p className="font-bold text-slate-900">{item.need}</p><p className="mt-1 text-sm font-black text-blue-700">{item.answer}</p></div><ArrowRight className="h-5 w-5 shrink-0 text-slate-400" /></>;
                const className = 'flex min-h-20 items-center justify-between gap-5 py-4 transition hover:text-blue-700';
                return item.href.startsWith('#') ? <a key={item.need} href={item.href} className={className}>{inner}</a> : <Link key={item.need} to={item.href} className={className}>{inner}</Link>;
              })}
            </div>
          </div>
        </section>

        <div className="mt-14 space-y-16">
          {groups.map((group) => {
            const groupServices = group.services
              .map((option) => {
                const service = SERVICES.find((item) => item.id === option.serviceId);
                return service ? { service, option } : null;
              })
              .filter((entry): entry is { service: Service; option: (typeof group.services)[number] } => Boolean(entry));

            return (
              <section key={group.id} id={group.id} className="scroll-mt-36">
                <div className="grid gap-5 border-b-2 border-slate-950 pb-6 md:grid-cols-[.8fr_1.2fr]">
                  <h2 className="text-3xl font-black tracking-tight md:text-4xl">{group.title}</h2>
                  <p className="max-w-2xl leading-7 text-slate-600">{group.description}</p>
                </div>

                <div className="divide-y divide-slate-200 border-b border-slate-200">
                  {groupServices.map(({ service, option }) => {
                    const inquiry = isInquiryOnlyService(service.id) || !Object.values(service.price).some((price) => price > 0);
                    const highlights = option.customerHighlights || service.features.slice(0, 3);

                    return (
                      <article key={service.id} className={`grid gap-6 py-7 lg:grid-cols-[.95fr_1.35fr_auto] lg:items-start ${option.recommended ? 'border-l-4 border-blue-600 bg-blue-50/50 pl-5 pr-3' : ''}`}>
                        <div>
                          <p className="text-xs font-black uppercase tracking-[.14em] text-blue-700">{option.fitLabel}</p>
                          <h3 className="mt-2 text-2xl font-black tracking-tight">{option.displayName || service.name}</h3>
                          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold"><span className="text-blue-700">{getStartingPrice(service, squareServices)}</span><span className="inline-flex items-center gap-1.5 text-slate-600"><Clock className="h-4 w-4" /> {getDuration(service)}</span></div>
                        </div>
                        <div>
                          <p className="font-semibold leading-7 text-slate-800">{option.customerDescription}</p>
                          <ul className="mt-4 grid gap-2 sm:grid-cols-2">{highlights.map((feature) => <li key={feature} className="flex gap-2 text-sm leading-6 text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />{feature}</li>)}</ul>
                        </div>
                        <div className="flex flex-wrap gap-2 lg:justify-end">
                          <Link to={`/services/${service.id}`} className="inline-flex min-h-11 items-center border border-slate-300 px-4 font-bold hover:border-blue-600 hover:text-blue-700">View Details</Link>
                          {inquiry ? (
                            <Link to="/quote" onClick={() => trackEvent('begin_quote', { location: 'services_list', service_id: service.id })} className="inline-flex min-h-11 items-center bg-blue-600 px-5 font-black text-white hover:bg-blue-700">Request Quote</Link>
                          ) : (
                            <a href={getSquareBookingLink(service.id)} onClick={(event) => trackBookingHandoff(event, { location: 'services_list', service_id: service.id })} className="inline-flex min-h-11 items-center bg-blue-600 px-5 font-black text-white hover:bg-blue-700">Check Availability</a>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <section id="specialty" className="scroll-mt-36">
            <div className="grid gap-5 border-b-2 border-slate-950 pb-6 md:grid-cols-[.8fr_1.2fr]">
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">Specialty &amp; Condition-Based Work</h2>
              <p className="max-w-2xl leading-7 text-slate-600">Some jobs vary too much by size, contamination, access or safety requirements to price responsibly before I see them. Send clear photos first so I can recommend the right process.</p>
            </div>
            <div className="divide-y divide-slate-200 border-b border-slate-200">
              {SPECIALTY_SERVICE_OPTIONS.map((option) => (
                <article key={option.id} className="grid gap-5 py-6 md:grid-cols-[.8fr_1.25fr_auto] md:items-center">
                  <div><p className="text-xs font-black uppercase tracking-[.14em] text-blue-700">Photo review first</p><h3 className="mt-2 text-xl font-black tracking-tight">{option.title}</h3></div>
                  <p className="text-sm leading-6 text-slate-600">{option.description}</p>
                  <div className="flex flex-wrap gap-2 md:justify-end"><a href={photoTextLink} onClick={() => trackEvent('click_text_quote', { location: 'services_specialty', specialty_id: option.id })} className="inline-flex min-h-11 items-center gap-2 border border-slate-300 px-4 font-bold hover:border-blue-600 hover:text-blue-700"><MessageSquare className="h-4 w-4" /> Text Photos</a><Link to="/quote" onClick={() => trackEvent('begin_quote', { location: 'services_specialty', specialty_id: option.id })} className="inline-flex min-h-11 items-center bg-blue-600 px-4 font-black text-white hover:bg-blue-700">Request Quote</Link></div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      <RelatedGuides topic="all" heading="Helpful detailing guides" intro="Learn more about interior work, paint correction, ceramic protection, seasonal care and choosing the right appointment." />

      <section className="bg-slate-950 py-14 text-white">
        <div className="container mx-auto flex flex-col justify-between gap-7 px-4 md:flex-row md:items-center">
          <div><h2 className="text-3xl font-black tracking-tight">Not sure which service to book?</h2><p className="mt-3 max-w-2xl leading-7 text-slate-300">Text me clear photos of the vehicle and tell me what you want cleaned, corrected or protected. I will recommend the service that fits.</p></div>
          <a href={photoTextLink} onClick={() => trackEvent('click_text_quote', { location: 'services_footer' })} className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 bg-blue-600 px-7 font-black hover:bg-blue-700"><MessageSquare className="h-5 w-5" /> Text Vehicle Photos</a>
        </div>
      </section>
    </div>
  );
}
