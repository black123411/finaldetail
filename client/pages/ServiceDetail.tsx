import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle, ArrowLeft, ArrowRight, Calendar, Check, ChevronDown, Clock, MapPin, MessageSquare, ShieldCheck } from 'lucide-react';
import { trackBookingHandoff, trackEvent } from '../lib/analytics';
import { getSquareBookingLink, isInquiryOnlyService } from '../lib/constants';
import { SERVICES, CATEGORIES, VEHICLE_SIZES, SPECIALTY_SIZES, type Service } from '@/shared/data/services';
import { SERVICE_PAGE_CONTENT } from '@/shared/data/servicePageContent';
import { BEFORE_AFTERS } from '@/shared/data/photos';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import RelatedGuides, { guideTopicForCategory } from '../components/RelatedGuides';
import { formatCurrency } from '../lib/utils';

const INTERIOR_COMPARISON = [
  {
    label: 'Best for',
    signature: 'Normal daily buildup, light stains and a cabin that needs a thorough professional detail.',
    restoration: 'Heavy pet hair, embedded stains, spills and neglected interiors.',
  },
  {
    label: 'Fabric and stain work',
    signature: 'Light stain treatment where needed.',
    restoration: 'Shampooing, hot-water extraction and more intensive stain work where appropriate.',
  },
  {
    label: 'Cleaning level',
    signature: 'Vacuuming, air blowout, interior surfaces, mats, glass and detail work.',
    restoration: 'Everything in the standard interior process plus heavier fabric and contamination removal.',
  },
] as const;

const PROOF_BY_SERVICE: Record<string, number> = {
  'interior-detail': 1,
  'interior-reset': 2,
  'full-detail-package': 1,
  'showroom-package': 2,
  'pre-sale-detail': 3,
  'paint-enhancement-polish': 6,
  'paint-correction-l1': 6,
  'paint-correction-l2': 8,
  'system-x-crystal-plus': 8,
  'system-x-pro-plus': 8,
  'system-x-max-g-plus': 8,
  'system-x-phantom-2k': 8,
};

function getStartingPrice(service: Service) {
  const price = service.price.car || service.price.suv || service.price.rv || Object.values(service.price)[0];
  if (!price) return 'Custom quote';
  return service.pricingType === 'variable' ? `${formatCurrency(price)}/ft` : formatCurrency(price);
}

function getDuration(service: Service) {
  if (typeof service.duration === 'string') return service.duration;
  return service.duration.car || service.duration.rv || Object.values(service.duration)[0];
}

function getPriceRows(service: Service) {
  const sizes = service.isSpecialty ? SPECIALTY_SIZES : VEHICLE_SIZES;
  return sizes.map((size) => ({ size, price: service.price[size.id] })).filter((row) => row.price !== undefined);
}

function getServiceAvailability(service: Service) {
  if (service.id === 'ppf-inquiry') return 'Consultation required';
  if (service.id === 'odor-elimination') return 'Bellevue drop-off';
  if (service.isSpecialty) return 'Mobile service by quote';
  if (service.categoryId === 'paint-correction' || service.categoryId === 'protection') return 'Bellevue drop-off recommended';
  return 'Mobile or Bellevue drop-off';
}

export default function ServiceDetail() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = SERVICES.find((item) => item.id === serviceId);
  const category = service ? CATEGORIES.find((item) => item.id === service.categoryId) : undefined;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => { window.scrollTo(0, 0); }, [serviceId]);

  if (!service || !category) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-white px-4 py-20 text-center">
        <div><AlertTriangle className="mx-auto h-9 w-9 text-slate-400" /><h1 className="mt-5 text-4xl font-black tracking-tight">Service not found</h1><p className="mt-3 text-slate-600">This service may have been moved or renamed.</p><Link to="/services" className="mt-7 inline-flex min-h-12 items-center bg-blue-600 px-6 font-black text-white hover:bg-blue-700">View All Services</Link></div>
      </main>
    );
  }

  const guide = SERVICE_PAGE_CONTENT[service.id];
  const proofId = PROOF_BY_SERVICE[service.id];
  const visualProof = proofId ? BEFORE_AFTERS.find((item) => item.id === proofId) : undefined;
  const relatedServices = (guide?.internalServiceIds || []).map((id) => SERVICES.find((item) => item.id === id)).filter((item): item is Service => Boolean(item)).slice(0, 3);
  const priceRows = getPriceRows(service);
  const numericPrices = priceRows.map(({ price }) => price).filter((price): price is number => typeof price === 'number' && price > 0);
  const faqItems = guide?.faq || [];
  const isInquiryOnly = isInquiryOnlyService(service.id);
  const bookingTarget = getSquareBookingLink(service.id);
  const primaryLabel = isInquiryOnly ? 'Request a Quote' : 'Check Availability';
  const textMessage = encodeURIComponent(`Hi Bryan, I have a question about ${service.name}. Here are photos of my vehicle:`);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.longDescription,
    ...(service.image ? { image: `https://bryansdetailingomaha.com${service.image}` } : {}),
    url: `https://bryansdetailingomaha.com/services/${service.id}`,
    provider: {
      '@type': 'AutomotiveBusiness',
      name: "Bryan's Showroom Quality Mobile Detailing",
      telephone: '+17123056313',
      address: { '@type': 'PostalAddress', addressLocality: 'Bellevue', addressRegion: 'NE' },
    },
    ...(service.pricingType === 'fixed' && numericPrices.length > 0 ? {
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: Math.min(...numericPrices),
        highPrice: Math.max(...numericPrices),
        priceCurrency: 'USD',
        offerCount: numericPrices.length,
      },
    } : {}),
  };

  return (
    <div className="min-h-screen bg-white pb-20 text-slate-950 md:pb-0">
      <Helmet>
        {service.image && <meta property="og:image" content={`https://bryansdetailingomaha.com${service.image}`} />}
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
        {faqItems.length > 0 && <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) })}</script>}
      </Helmet>

      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto grid gap-10 px-4 py-12 lg:grid-cols-[1fr_.9fr] lg:items-center lg:py-16">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-600"><Link to="/services" className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900"><ArrowLeft className="h-4 w-4" /> All Services</Link><span>/</span><Link to={`/services/category/${category.slug}`} className="hover:text-blue-700">{category.name}</Link></div>
            <h1 className="mt-6 text-5xl font-black leading-[.98] tracking-tight sm:text-6xl">{service.name}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{service.shortDescription}</p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="border-t-2 border-blue-600 pt-3"><p className="text-xs font-black uppercase tracking-[.12em] text-slate-500">Starting Price</p><p className="mt-1 font-black">{getStartingPrice(service)}</p></div>
              <div className="border-t-2 border-blue-600 pt-3"><p className="text-xs font-black uppercase tracking-[.12em] text-slate-500">Typical Time</p><p className="mt-1 font-black">{getDuration(service)}</p></div>
              <div className="border-t-2 border-blue-600 pt-3"><p className="text-xs font-black uppercase tracking-[.12em] text-slate-500">Service Option</p><p className="mt-1 font-black">{getServiceAvailability(service)}</p></div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {isInquiryOnly ? (
                <Link to="/quote" onClick={() => trackEvent('begin_quote', { location: 'service_detail', service_id: service.id })} className="inline-flex min-h-14 items-center justify-center gap-2 bg-blue-600 px-7 font-black text-white hover:bg-blue-700"><Calendar className="h-5 w-5" /> {primaryLabel}</Link>
              ) : (
                <a href={bookingTarget} onClick={(event) => trackBookingHandoff(event, { location: 'service_detail', service_id: service.id })} className="inline-flex min-h-14 items-center justify-center gap-2 bg-blue-600 px-7 font-black text-white hover:bg-blue-700"><Calendar className="h-5 w-5" /> {primaryLabel}</a>
              )}
              <a href={`sms:+17123056313?body=${textMessage}`} onClick={() => trackEvent('click_text_quote', { location: 'service_detail', service_id: service.id })} className="inline-flex min-h-14 items-center justify-center gap-2 border border-slate-300 px-7 font-black text-slate-900 hover:border-blue-600 hover:text-blue-700"><MessageSquare className="h-5 w-5" /> Text Vehicle Photos</a>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">{isInquiryOnly ? 'Send clear photos and job details so I can review the condition before confirming the service and price.' : 'Square shows the current vehicle options and appointment availability for this service.'}</p>
          </div>

          {service.image ? <img src={service.image} alt={`${service.name} in Bellevue and Omaha`} className="aspect-[4/3] w-full object-cover" /> : <div className="flex aspect-[4/3] items-end bg-slate-950 p-8 text-3xl font-black text-white">{service.name}</div>}
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="container mx-auto grid px-4 md:grid-cols-3">
          <div className="flex gap-3 border-b border-slate-800 py-5 md:border-b-0 md:border-r md:px-6 first:pl-0"><ShieldCheck className="h-5 w-5 shrink-0 text-blue-400" /><div><p className="font-black">Owner-operated</p><p className="mt-1 text-sm text-slate-400">I handle the recommendation, work and final check.</p></div></div>
          <div className="flex gap-3 border-b border-slate-800 py-5 md:border-b-0 md:border-r md:px-6"><Check className="h-5 w-5 shrink-0 text-blue-400" /><div><p className="font-black">Clear service fit</p><p className="mt-1 text-sm text-slate-400">The page explains what the service is designed to handle.</p></div></div>
          <div className="flex gap-3 py-5 md:px-6"><MapPin className="h-5 w-5 shrink-0 text-blue-400" /><div><p className="font-black">Bellevue &amp; Omaha metro</p><p className="mt-1 text-sm text-slate-400">Mobile options plus Bellevue drop-off.</p></div></div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[.14em] text-blue-700">Best fit for</p>
            <p className="mt-3 text-xl font-bold leading-8 text-slate-900">{service.bestFor || guide?.headline || service.shortDescription}</p>
            <h2 className="mt-10 text-4xl font-black tracking-tight">{guide?.headline || service.name}</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">{guide?.intro || service.longDescription}</p>
            <div className="mt-10 grid gap-8 md:grid-cols-3">{(guide?.sections || []).map((section) => <div key={section.title}><h3 className="text-xl font-black">{section.title}</h3><p className="mt-3 leading-7 text-slate-600">{section.body}</p></div>)}</div>

            {(service.id === 'interior-detail' || service.id === 'interior-reset') && (
              <section className="mt-12 border-y border-slate-200">
                <h3 className="py-5 text-2xl font-black">Compare interior services</h3>
                <div className="hidden md:block">
                  <div className="grid grid-cols-[.7fr_1fr_1fr] border-t border-slate-200 bg-slate-950 text-sm text-white"><div className="p-4 font-black">Comparison</div><div className="p-4 font-black">Signature Interior</div><div className="p-4 font-black">Interior Restoration</div></div>
                  {INTERIOR_COMPARISON.map((row) => <div key={row.label} className="grid grid-cols-[.7fr_1fr_1fr] border-t border-slate-200 text-sm"><div className="bg-slate-50 p-4 font-bold">{row.label}</div><div className="p-4 leading-6 text-slate-700">{row.signature}</div><div className="p-4 leading-6 text-slate-700">{row.restoration}</div></div>)}
                </div>
                <div className="divide-y divide-slate-200 md:hidden">{INTERIOR_COMPARISON.map((row) => <div key={row.label} className="py-5"><p className="font-black">{row.label}</p><p className="mt-3 text-sm font-bold text-blue-700">Signature Interior</p><p className="mt-1 text-sm leading-6 text-slate-600">{row.signature}</p><p className="mt-3 text-sm font-bold text-blue-700">Interior Restoration</p><p className="mt-1 text-sm leading-6 text-slate-600">{row.restoration}</p></div>)}</div>
              </section>
            )}
          </div>

          <aside className="border-l-4 border-blue-600 bg-slate-50 p-7 lg:sticky lg:top-24 lg:self-start">
            <h2 className="text-2xl font-black">What is included</h2>
            <ul className="mt-6 space-y-4">{service.features.map((feature) => <li key={feature} className="flex items-start gap-3 leading-7 text-slate-700"><Check className="mt-1 h-4 w-4 shrink-0 text-blue-600" /><span>{feature}</span></li>)}</ul>
          </aside>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16 lg:py-20">
        <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Pricing by vehicle size</h2>
            <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200 bg-white">{priceRows.map(({ size, price }) => <div key={size.id} className="flex items-center justify-between gap-6 px-5 py-4"><span className="font-bold text-slate-700">{size.name}</span><span className="text-lg font-black">{price ? formatCurrency(price) + (service.pricingType === 'variable' ? '/ft' : '') : 'Custom quote'}</span></div>)}</div>
            <p className="mt-4 text-sm leading-6 text-slate-500">Vehicle size and condition can change the amount of work required. If something outside the selected service is needed, I discuss it before adding it.</p>
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">{guide?.processTitle || 'How the service is completed'}</h2>
            <div className="mt-6 divide-y divide-slate-300 border-y border-slate-300">{(guide?.process || []).map((item, index) => <div key={item} className="grid gap-3 py-5 sm:grid-cols-[40px_1fr]"><span className="flex h-8 w-8 items-center justify-center bg-slate-950 text-xs font-black text-white">{index + 1}</span><p className="leading-7 text-slate-700">{item}</p></div>)}</div>
          </div>
        </div>
      </section>

      {(guide?.buyerNotes || []).length > 0 && <section className="py-14"><div className="container mx-auto grid gap-7 px-4 md:grid-cols-[.7fr_1.3fr]"><div><h2 className="text-3xl font-black tracking-tight">Before your appointment</h2></div><div className="divide-y divide-slate-200 border-y border-slate-200">{guide.buyerNotes.map((note) => <div key={note} className="flex gap-3 py-4"><Check className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" /><p className="leading-7 text-slate-600">{note}</p></div>)}</div></div></section>}

      {visualProof && <section className="bg-slate-950 py-16 text-white lg:py-20"><div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-[.8fr_1.2fr]"><div><h2 className="text-4xl font-black tracking-tight">Real results from this type of work</h2><p className="mt-5 text-lg leading-8 text-slate-300">{visualProof.description}</p><Link to="/gallery" className="mt-7 inline-flex items-center gap-2 font-black text-blue-300">View Before &amp; After Gallery <ArrowRight className="h-4 w-4" /></Link></div><BeforeAfterSlider beforeImage={visualProof.before} afterImage={visualProof.after} /></div></section>}

      {faqItems.length > 0 && <section className="py-16 lg:py-20"><div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[.7fr_1.3fr]"><div><h2 className="text-4xl font-black tracking-tight">Questions about {service.name}</h2><p className="mt-4 leading-7 text-slate-600">Answers about condition, timing, mobile service, preparation and expected results.</p></div><div className="divide-y divide-slate-200 border-y border-slate-200">{faqItems.map((item, index) => <div key={item.question}><button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)} className="flex w-full items-center justify-between gap-6 py-5 text-left"><span className="text-lg font-black">{item.question}</span><ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} /></button>{openFaq === index && <p className="pb-5 pr-10 leading-7 text-slate-600">{item.answer}</p>}</div>)}</div></div></section>}

      <RelatedGuides topic={guideTopicForCategory(service.categoryId)} heading={`Learn more about ${service.name}`} intro="Review the process, upkeep and local driving considerations that can affect the best service choice for your vehicle." />

      {relatedServices.length > 0 && <section className="border-t border-slate-200 bg-slate-50 py-14 lg:py-20"><div className="container mx-auto px-4"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h2 className="text-3xl font-black tracking-tight">Related detailing services</h2><p className="mt-3 text-slate-600">Compare services that solve a similar problem or work well together.</p></div><Link to="/services" className="inline-flex items-center gap-2 font-black text-blue-700">All Services <ArrowRight className="h-4 w-4" /></Link></div><div className="mt-8 grid border-l border-t border-slate-300 md:grid-cols-3">{relatedServices.map((related) => <Link key={related.id} to={`/services/${related.id}`} className="border-b border-r border-slate-300 bg-white p-6 hover:bg-blue-50/40"><h3 className="text-xl font-black">{related.name}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{related.shortDescription}</p></Link>)}</div></div></section>}

      <section className="bg-blue-600 py-14 text-white">
        <div className="container mx-auto flex flex-col justify-between gap-7 px-4 md:flex-row md:items-center">
          <div><h2 className="text-3xl font-black tracking-tight">{isInquiryOnly ? `Need a quote for ${service.name}?` : `Ready to schedule ${service.name}?`}</h2><p className="mt-3 max-w-2xl leading-7 text-blue-50">{isInquiryOnly ? 'Send the vehicle or job details so I can review the condition before confirming the service.' : 'Choose your vehicle option and see current appointment availability in Square.'}</p></div>
          {isInquiryOnly ? <Link to="/quote" onClick={() => trackEvent('begin_quote', { location: 'service_detail_footer', service_id: service.id })} className="inline-flex min-h-14 shrink-0 items-center justify-center bg-slate-950 px-7 font-black text-white hover:bg-slate-900">Request Quote</Link> : <a href={bookingTarget} onClick={(event) => trackBookingHandoff(event, { location: 'service_detail_footer', service_id: service.id })} className="inline-flex min-h-14 shrink-0 items-center justify-center bg-slate-950 px-7 font-black text-white hover:bg-slate-900">Check Availability</a>}
        </div>
      </section>
    </div>
  );
}
