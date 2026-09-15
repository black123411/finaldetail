import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Check, Clock, MessageSquare } from 'lucide-react';
import { SERVICES, CATEGORIES } from '@/shared/data/services';
import { getSquareBookingLink, isInquiryOnlyService } from '../lib/constants';
import { formatCurrency } from '../lib/utils';
import { trackBookingHandoff, trackEvent } from '../lib/analytics';
import RelatedGuides, { guideTopicForCategory } from '../components/RelatedGuides';

const photoTextLink = 'sms:+17123056313?body=Hi%20Bryan%2C%20I%20need%20help%20choosing%20a%20detail.%20Here%20are%20photos%20of%20my%20vehicle%3A';

function getStartingPrice(service: typeof SERVICES[number]) {
  const price = service.price.car || service.price.suv || service.price.rv || Object.values(service.price)[0];
  if (!price) return 'Custom quote';
  return service.pricingType === 'variable' ? `From ${formatCurrency(price)}/ft` : `From ${formatCurrency(price)}`;
}

function getDuration(service: typeof SERVICES[number]) {
  return typeof service.duration === 'string'
    ? service.duration
    : service.duration.car || service.duration.rv || Object.values(service.duration)[0];
}

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const category = CATEGORIES.find((item) => item.slug === slug);

  if (!category) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-white px-4 py-20 text-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Service category not found</h1>
          <Link to="/services" className="mt-7 inline-flex min-h-12 items-center bg-blue-600 px-6 font-black text-white hover:bg-blue-700">View All Services</Link>
        </div>
      </main>
    );
  }

  const categoryServices = SERVICES.filter((service) => service.categoryId === category.id);
  const localHeadingByCategory: Record<string, string> = {
    'interior-detailing': 'Interior Car Detailing in Bellevue & Omaha',
    'exterior-detailing': 'Exterior Car Detailing in Bellevue & Omaha',
    'full-detailing': 'Full Car Detailing in Bellevue & Omaha',
    'paint-correction': 'Paint Correction in Bellevue & Omaha',
    'ceramic-coating': 'Ceramic Coating in Bellevue & Omaha',
    'maintenance-plans': 'Maintenance Car Detailing in Bellevue & Omaha',
    'rv-boat-detailing': 'RV & Boat Detailing in Bellevue & Omaha',
    'tractor-farm-equipment': 'Equipment Detailing in Bellevue & Omaha',
  };
  const localHeading = localHeadingByCategory[category.slug] || `${category.name} in Bellevue & Omaha`;

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto grid gap-10 px-4 py-14 lg:grid-cols-[1fr_.9fr] lg:items-center lg:py-20">
          <div className="max-w-3xl">
            <Link to="/services" className="inline-flex items-center gap-2 text-sm font-black text-blue-700 hover:text-blue-900"><ArrowLeft className="h-4 w-4" /> All Services</Link>
            <h1 className="mt-5 text-5xl font-black leading-[.98] tracking-tight sm:text-6xl">{localHeading}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{category.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#service-options" className="inline-flex min-h-14 items-center justify-center gap-2 bg-blue-600 px-7 font-black text-white hover:bg-blue-700"><Calendar className="h-5 w-5" /> Compare Services</a>
              <a href={photoTextLink} onClick={() => trackEvent('click_text_quote', { location: 'category_hero', category: category.slug })} className="inline-flex min-h-14 items-center justify-center gap-2 border border-slate-300 px-7 font-black text-slate-900 hover:border-blue-600 hover:text-blue-700"><MessageSquare className="h-5 w-5" /> Text Vehicle Photos</a>
            </div>
          </div>
          <img src={category.image} alt={`${category.name} in Bellevue and Omaha`} className="aspect-[4/3] w-full object-cover" referrerPolicy="no-referrer" />
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="container mx-auto grid px-4 sm:grid-cols-3">
          {[
            'Owner-operated since 2017',
            'Clear service descriptions and starting prices',
            'Mobile options plus Bellevue drop-off',
          ].map((item) => <div key={item} className="flex min-h-20 items-center gap-3 border-b border-slate-800 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:px-5 first:pl-0 last:border-r-0"><Check className="h-5 w-5 shrink-0 text-blue-400" /><span className="text-sm font-black">{item}</span></div>)}
        </div>
      </section>

      <section id="service-options" className="scroll-mt-28 py-14 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-7 border-b-2 border-slate-950 pb-7 lg:grid-cols-[.75fr_1.25fr]">
            <h2 className="text-4xl font-black tracking-tight">Compare {category.name}</h2>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">Choose the service that matches the condition of the vehicle and the result you want. Open the full service page for details, or check current Square availability when you already know what fits.</p>
          </div>

          <div className="divide-y divide-slate-200 border-b border-slate-200">
            {categoryServices.map((service) => {
              const inquiry = isInquiryOnlyService(service.id) || !Object.values(service.price).some((price) => price > 0);
              return (
                <article key={service.id} className="grid gap-7 py-8 lg:grid-cols-[220px_1fr_auto] lg:items-start">
                  <img src={service.image || category.image} alt={service.name} className="aspect-[4/3] w-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-black tracking-tight">{service.name}</h3>
                      {service.badge && <span className="border border-slate-300 px-2.5 py-1 text-xs font-black text-slate-600">{service.badge}</span>}
                    </div>
                    <p className="mt-3 max-w-2xl leading-7 text-slate-600">{service.shortDescription}</p>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold"><span className="text-blue-700">{getStartingPrice(service)}</span><span className="inline-flex items-center gap-1.5 text-slate-600"><Clock className="h-4 w-4" /> {getDuration(service)}</span></div>
                    <ul className="mt-5 grid gap-2 sm:grid-cols-2">{service.features.slice(0, 4).map((feature) => <li key={feature} className="flex gap-2 text-sm leading-6 text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />{feature}</li>)}</ul>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:flex-col">
                    {inquiry ? (
                      <Link to="/quote" onClick={() => trackEvent('begin_quote', { location: 'category_service', service_id: service.id, category: category.slug })} className="inline-flex min-h-11 items-center justify-center bg-blue-600 px-5 font-black text-white hover:bg-blue-700">Request Quote</Link>
                    ) : (
                      <a href={getSquareBookingLink(service.id)} onClick={(event) => trackBookingHandoff(event, { location: 'category_service', service_id: service.id, category: category.slug })} className="inline-flex min-h-11 items-center justify-center bg-blue-600 px-5 font-black text-white hover:bg-blue-700">Check Availability</a>
                    )}
                    <Link to={`/services/${service.id}`} className="inline-flex min-h-11 items-center justify-center border border-slate-300 px-5 font-bold hover:border-blue-600 hover:text-blue-700">View Details</Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-14 lg:py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[1fr_.8fr] lg:items-start">
          <div>
            <h2 className="text-4xl font-black tracking-tight">Mobile service or Bellevue drop-off</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Many detailing appointments can be completed mobile when the service, weather and work area are suitable. Longer paint-correction, ceramic-coating and weather-sensitive services are usually better suited to appointment-only Bellevue drop-off.</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 font-bold text-blue-700"><Link to="/areas/bellevue-ne">Car Detailing in Bellevue</Link><Link to="/areas/omaha-ne">Car Detailing in Omaha</Link><Link to="/areas/papillion-ne">Papillion Service Area</Link></div>
          </div>
          <aside className="border-l-4 border-blue-600 bg-white p-7"><h3 className="text-2xl font-black">Unsure which option fits?</h3><p className="mt-3 leading-7 text-slate-600">Send photos of the vehicle and tell me what you want improved. I will recommend the appropriate service before you book.</p><a href={photoTextLink} onClick={() => trackEvent('click_text_quote', { location: 'category_help', category: category.slug })} className="mt-6 inline-flex min-h-12 items-center gap-2 bg-slate-950 px-5 font-black text-white hover:bg-blue-700"><MessageSquare className="h-4 w-4" /> Text Vehicle Photos</a></aside>
        </div>
      </section>

      <RelatedGuides topic={guideTopicForCategory(category.id)} heading={`${category.name} guides and comparisons`} intro="Learn how the service works, what it can improve and how to care for the vehicle afterward." />

      <section className="bg-slate-950 py-14 text-white">
        <div className="container mx-auto flex flex-col justify-between gap-7 px-4 md:flex-row md:items-center">
          <div><h2 className="text-3xl font-black tracking-tight">Ready to choose a service?</h2><p className="mt-3 max-w-2xl leading-7 text-slate-300">Compare the exact service details and pricing, then check availability for the one that matches your vehicle.</p></div>
          <Link to="/services" className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 bg-blue-600 px-7 font-black text-white hover:bg-blue-700">All Services &amp; Pricing <ArrowRight className="h-5 w-5" /></Link>
        </div>
      </section>
    </div>
  );
}
