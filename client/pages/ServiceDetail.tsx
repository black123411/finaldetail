import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock,
  Info,
  MapPin,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { SERVICES, CATEGORIES, VEHICLE_SIZES, SPECIALTY_SIZES, type Service } from '@/shared/data/services';
import { SERVICE_PAGE_CONTENT } from '@/shared/data/servicePageContent';
import { BEFORE_AFTERS } from '@/shared/data/photos';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { Button } from '../components/ui/button';
import { formatCurrency } from '../lib/utils';

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
  return service.pricingType === 'variable' ? formatCurrency(price) + '/ft' : formatCurrency(price);
}

function getDuration(service: Service) {
  if (typeof service.duration === 'string') return service.duration;
  return service.duration.car || service.duration.rv || Object.values(service.duration)[0];
}

function getPriceRows(service: Service) {
  const sizes = service.isSpecialty ? SPECIALTY_SIZES : VEHICLE_SIZES;
  return sizes
    .map((size) => ({ size, price: service.price[size.id] }))
    .filter((row) => row.price !== undefined);
}

function getServiceAvailability(service: Service) {
  if (service.id === 'ppf-inquiry') return 'Custom consultation required';
  if (service.isSpecialty) return 'Mobile service by quote';
  if (service.categoryId === 'paint-correction' || service.categoryId === 'protection') {
    return 'Bellevue drop-off recommended';
  }
  return 'Mobile or Bellevue drop-off';
}

export default function ServiceDetail() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = SERVICES.find((item) => item.id === serviceId);
  const category = service ? CATEGORIES.find((item) => item.id === service.categoryId) : undefined;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  if (!service || !category) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="max-w-md text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-zinc-400" />
          <h1 className="mt-5 text-3xl font-black">Service not found</h1>
          <p className="mt-3 text-zinc-600">This service may have been moved or renamed.</p>
          <Button asChild className="mt-7 h-12 rounded-md bg-zinc-950 px-6">
            <Link to="/services">View all services</Link>
          </Button>
        </div>
      </main>
    );
  }

  const guide = SERVICE_PAGE_CONTENT[service.id];
  const proofId = PROOF_BY_SERVICE[service.id];
  const visualProof = proofId ? BEFORE_AFTERS.find((item) => item.id === proofId) : undefined;
  const relatedServices = (guide?.internalServiceIds || [])
    .map((id) => SERVICES.find((item) => item.id === id))
    .filter((item): item is Service => Boolean(item))
    .slice(0, 3);
  const priceRows = getPriceRows(service);
  const numericPrices = priceRows
    .map(({ price }) => price)
    .filter((price): price is number => typeof price === 'number' && price > 0);
  const faqItems = guide?.faq || [];
  const isInquiryOnly = service.id === 'ppf-inquiry';
  const primaryTarget = isInquiryOnly ? '/quote' : `/book?serviceId=${service.id}`;
  const primaryLabel = isInquiryOnly ? 'Request a PPF quote' : 'Check availability';
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
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bellevue',
        addressRegion: 'NE',
      },
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
    <main className="min-h-screen bg-white pb-20 text-zinc-950 md:pb-0">
      <Helmet>
        {service.image && <meta property="og:image" content={`https://bryansdetailingomaha.com${service.image}`} />}
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
        {faqItems.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqItems.map((item) => ({
                '@type': 'Question',
                name: item.question,
                acceptedAnswer: { '@type': 'Answer', text: item.answer },
              })),
            })}
          </script>
        )}
      </Helmet>

      <section className="relative min-h-[620px] overflow-hidden bg-zinc-950 text-white">
        {service.image && (
          <img
            src={service.image}
            alt={`${service.name} in Bellevue and Omaha`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/20" />
        <div className="container relative mx-auto flex min-h-[620px] items-end px-4 pb-14 pt-32 md:pb-20">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-zinc-200">
              <Link to="/services" className="inline-flex items-center gap-2 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> All services
              </Link>
              <span className="text-zinc-600">/</span>
              <Link to={`/services/category/${category.slug}`} className="hover:text-white">{category.name}</Link>
            </div>
            {service.badge && (
              <p className="mt-7 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                {service.badge}
              </p>
            )}
            <h1 className="mt-6 text-5xl font-black leading-[0.95] md:text-7xl">{service.name}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-200 md:text-xl">{service.shortDescription}</p>
            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              <div className="border-l-2 border-emerald-400 bg-black/30 px-4 py-3 backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Typical Time</p>
                <p className="mt-1 font-bold text-white">{getDuration(service)}</p>
              </div>
              <div className="border-l-2 border-emerald-400 bg-black/30 px-4 py-3 backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Pricing</p>
                <p className="mt-1 font-bold text-white">{getStartingPrice(service) === 'Custom quote' ? 'Custom quote' : `Starts at ${getStartingPrice(service)}`}</p>
              </div>
              <div className="border-l-2 border-emerald-400 bg-black/30 px-4 py-3 backdrop-blur-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Service Option</p>
                <p className="mt-1 font-bold text-white">{getServiceAvailability(service)}</p>
              </div>
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to={primaryTarget}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-emerald-500 px-7 font-black text-zinc-950 hover:bg-emerald-400"
              >
                <Calendar className="h-5 w-5" /> {primaryLabel}
              </Link>
              <a
                href={`sms:+17123056313?body=${textMessage}`}
                className="inline-flex h-14 items-center justify-center rounded-md border border-white/40 bg-black/20 px-7 font-bold text-white hover:bg-white hover:text-zinc-950"
              >
                <MessageSquare className="mr-2 h-5 w-5" /> Text photos to Bryan
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-950 text-white">
        <div className="container mx-auto grid gap-px bg-zinc-800 md:grid-cols-3">
          <div className="flex gap-4 bg-zinc-950 px-5 py-6 md:px-8">
            <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-400" />
            <div><p className="font-black">Owner-operated</p><p className="mt-1 text-sm text-zinc-400">Bryan handles the appointment and quality check.</p></div>
          </div>
          <div className="flex gap-4 bg-zinc-950 px-5 py-6 md:px-8">
            <CircleDollarSign className="h-6 w-6 shrink-0 text-emerald-400" />
            <div><p className="font-black">Condition-based pricing</p><p className="mt-1 text-sm text-zinc-400">Additional work is explained before it is added.</p></div>
          </div>
          <div className="flex gap-4 bg-zinc-950 px-5 py-6 md:px-8">
            <MapPin className="h-6 w-6 shrink-0 text-emerald-400" />
            <div><p className="font-black">Omaha metro service</p><p className="mt-1 text-sm text-zinc-400">Mobile options plus Bellevue drop-off.</p></div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-14 grid gap-6 border-y border-zinc-200 py-8 md:grid-cols-[220px_1fr] md:items-start">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700">Best fit for</p>
            <p className="text-xl font-bold leading-relaxed text-zinc-800">{service.bestFor || guide?.headline || service.shortDescription}</p>
          </div>
          <div className="grid gap-14 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">{guide?.headline || service.name}</h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-600">{guide?.intro || service.longDescription}</p>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {(guide?.sections || []).map((section) => (
                <div key={section.title}>
                  <h3 className="text-xl font-black tracking-tight">{section.title}</h3>
                  <p className="mt-3 leading-relaxed text-zinc-600">{section.body}</p>
                </div>
              ))}
            </div>
            </div>

            <aside className="border-l-4 border-emerald-500 bg-zinc-50 p-7 md:p-9">
            <h2 className="text-2xl font-black">What is included</h2>
            <ul className="mt-6 space-y-4">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 leading-relaxed text-zinc-700">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-20 md:py-28">
        <div className="container mx-auto grid gap-14 px-4 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">Pricing by vehicle size</h2>
            <div className="mt-7 divide-y divide-zinc-200 border-y border-zinc-200 bg-white">
              {priceRows.map(({ size, price }) => (
                <div key={size.id} className="flex items-center justify-between gap-6 px-5 py-4">
                  <span className="font-bold text-zinc-700">{size.name}</span>
                  <span className="text-lg font-black">
                    {price ? formatCurrency(price) + (service.pricingType === 'variable' ? '/ft' : '') : 'Custom quote'}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              Final price depends on vehicle condition, selected add-ons, access, and any additional restoration work approved before the service begins.
            </p>
            <Link to={primaryTarget} className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-zinc-950 px-6 font-black text-white hover:bg-zinc-800">
              {primaryLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">{guide?.processTitle || 'How the service is completed'}</h2>
            <ul className="mt-7 space-y-5">
              {(guide?.process || []).map((item) => (
                <li key={item} className="flex items-start gap-4 border-b border-zinc-200 pb-5">
                  <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
                  <span className="leading-relaxed text-zinc-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {(guide?.buyerNotes || []).length > 0 && (
        <section className="border-b border-zinc-200 py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-[240px_1fr]">
              <div>
                <Info className="h-6 w-6 text-emerald-600" />
                <h2 className="mt-3 text-2xl font-black">Before your appointment</h2>
              </div>
              <ul className="grid gap-4 md:grid-cols-3">
                {guide.buyerNotes.map((note) => (
                  <li key={note} className="border-l border-zinc-300 pl-5 leading-relaxed text-zinc-600">{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {visualProof && (
        <section className="bg-zinc-950 py-20 text-white md:py-28">
          <div className="container mx-auto grid items-center gap-12 px-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-4xl font-black tracking-tight md:text-5xl">Real results from this type of work</h2>
              <p className="mt-5 text-lg leading-relaxed text-zinc-300">{visualProof.description}</p>
              <Link to="/gallery" className="mt-7 inline-flex items-center gap-2 font-black text-emerald-400 hover:text-emerald-300">
                View the full gallery <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="overflow-hidden rounded-lg border border-white/10">
              <BeforeAfterSlider beforeImage={visualProof.before} afterImage={visualProof.after} />
            </div>
          </div>
        </section>
      )}

      {faqItems.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <h2 className="text-4xl font-black tracking-tight">Questions about {service.name}</h2>
              <p className="mt-4 leading-relaxed text-zinc-600">Answers about condition, timing, mobile service, preparation, and expected results.</p>
            </div>
            <div className="divide-y divide-zinc-200 border-y border-zinc-200">
              {faqItems.map((item, index) => (
                <div key={item.question}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-lg font-black">{item.question}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === index && <p className="pb-6 pr-10 leading-relaxed text-zinc-600">{item.answer}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedServices.length > 0 && (
        <section className="border-t border-zinc-200 bg-zinc-50 py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="text-3xl font-black tracking-tight md:text-4xl">Related detailing services</h2>
                <p className="mt-3 text-zinc-600">Compare services that solve a similar problem or work well together.</p>
              </div>
              <Link to="/services" className="inline-flex items-center gap-2 font-black">All services <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-9 grid gap-6 md:grid-cols-3">
              {relatedServices.map((related) => (
                <Link key={related.id} to={`/services/${related.id}`} className="group overflow-hidden rounded-lg border border-zinc-200 bg-white">
                  {related.image ? (
                    <img src={related.image} alt={related.name} className="aspect-[16/9] w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex aspect-[16/9] items-end bg-zinc-900 p-5 font-black text-white">{related.name}</div>
                  )}
                  <div className="p-5">
                    <h3 className="text-xl font-black group-hover:text-emerald-700">{related.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600">{related.shortDescription}</p>
                    {related.bestFor && <p className="mt-3 text-xs font-bold leading-relaxed text-zinc-500">Best for: {related.bestFor}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-emerald-500 py-16 text-zinc-950">
        <div className="container mx-auto flex flex-col items-start justify-between gap-7 px-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">{isInquiryOnly ? `Want a quote for ${service.name}?` : `Ready to book ${service.name}?`}</h2>
            <p className="mt-3 max-w-2xl font-semibold">{isInquiryOnly ? 'Send vehicle details and the coverage areas you want protected.' : 'Choose your vehicle size, available add-ons, and appointment time online.'}</p>
          </div>
          <Link to={primaryTarget} className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-zinc-950 px-7 font-black text-white hover:bg-zinc-800">
            {primaryLabel} <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

    </main>
  );
}
