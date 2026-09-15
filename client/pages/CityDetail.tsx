import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Calendar, Check, MapPin, MessageSquare } from 'lucide-react';
import { CITIES } from '@/shared/data/cities';
import { SERVICES } from '@/shared/data/services';
import RelatedGuides from '../components/RelatedGuides';
import { formatCurrency } from '../lib/utils';
import { getSquareBookingLink, isInquiryOnlyService } from '../lib/constants';
import { trackBookingHandoff, trackEvent } from '../lib/analytics';

const photoTextLink = 'sms:+17123056313?body=Hi%20Bryan%2C%20I%20need%20help%20choosing%20a%20detail.%20Here%20are%20photos%20of%20my%20vehicle%3A';

function getStartingPrice(service: typeof SERVICES[number]) {
  const values = Object.values(service.price).filter((price) => price > 0);
  if (!values.length) return 'Custom quote';
  const price = Math.min(...values);
  return service.pricingType === 'variable' ? `From ${formatCurrency(price)}/ft` : `From ${formatCurrency(price)}`;
}

export default function CityDetail() {
  const { slug } = useParams<{ slug: string }>();
  const city = CITIES.find((item) => item.slug === slug);

  if (!city) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-white px-4 py-20 text-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950">Service area not found</h1>
          <p className="mt-4 text-slate-600">Browse current detailing services and the areas I serve.</p>
          <Link to="/services" className="mt-7 inline-flex min-h-12 items-center bg-blue-600 px-6 font-black text-white hover:bg-blue-700">View Services &amp; Pricing</Link>
        </div>
      </main>
    );
  }

  const region = city.name.includes('Council Bluffs') ? 'IA' : 'NE';
  const featured = (city.content.featuredServiceIds || [])
    .map((id) => SERVICES.find((service) => service.id === id))
    .filter((service): service is typeof SERVICES[number] => Boolean(service));

  const citySchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Auto Detailing in ${city.name}`,
    serviceType: 'Auto detailing',
    description: city.seo.description,
    url: `https://bryansdetailingomaha.com/areas/${city.slug}`,
    provider: {
      '@type': ['LocalBusiness', 'AutomotiveBusiness'],
      '@id': 'https://bryansdetailingomaha.com/#business',
      name: "Bryan's Showroom Quality Mobile Detailing",
    },
    areaServed: {
      '@type': 'City',
      name: city.name.replace(/, (NE|IA)$/, ''),
      addressRegion: region,
      addressCountry: 'US',
    },
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(citySchema)}</script>
      </Helmet>

      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto grid gap-10 px-4 py-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-700"><MapPin className="h-4 w-4" /> Serving {city.name}</div>
            <h1 className="mt-4 text-5xl font-black leading-[.98] tracking-tight sm:text-6xl">{city.content.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{city.content.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/services" onClick={() => trackEvent('view_services', { location: 'city_hero', city: city.slug })} className="inline-flex min-h-14 items-center justify-center gap-2 bg-blue-600 px-7 font-black text-white hover:bg-blue-700">
                <Calendar className="h-5 w-5" /> View Services &amp; Pricing
              </Link>
              <a href={photoTextLink} onClick={() => trackEvent('click_text_quote', { location: 'city_hero', city: city.slug })} className="inline-flex min-h-14 items-center justify-center gap-2 border border-slate-300 px-7 font-black text-slate-900 hover:border-blue-600 hover:text-blue-700">
                <MessageSquare className="h-5 w-5" /> Text Vehicle Photos
              </a>
            </div>
          </div>

          <div className="border border-slate-200 bg-slate-50 p-7 sm:p-9">
            <h2 className="text-2xl font-black">What you can expect</h2>
            <div className="mt-6 space-y-4">
              {city.content.whyPoints.slice(0, 4).map((point) => (
                <div key={point} className="flex gap-3 border-t border-slate-200 pt-4 first:border-t-0 first:pt-0">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
                  <p className="font-semibold leading-7 text-slate-700">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-black tracking-tight">{city.content.servicesLabel}</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">These are the services most commonly requested from {city.name}. Open a service to compare what is included, or check current Square availability when you already know what you want.</p>
          </div>

          <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
            {featured.map((service) => {
              const inquiry = isInquiryOnlyService(service.id) || !Object.values(service.price).some((price) => price > 0);
              return (
                <article key={service.id} className="grid gap-6 py-7 lg:grid-cols-[1fr_1.25fr_auto] lg:items-center">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">{service.name}</h3>
                    <p className="mt-2 font-black text-blue-700">{getStartingPrice(service)}</p>
                  </div>
                  <p className="leading-7 text-slate-600">{service.shortDescription}</p>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <Link to={`/services/${service.id}`} className="inline-flex min-h-11 items-center border border-slate-300 px-4 font-bold hover:border-blue-600 hover:text-blue-700">View Details</Link>
                    {inquiry ? (
                      <Link to="/quote" onClick={() => trackEvent('begin_quote', { location: 'city_services', city: city.slug, service_id: service.id })} className="inline-flex min-h-11 items-center bg-blue-600 px-5 font-black text-white hover:bg-blue-700">Request Quote</Link>
                    ) : (
                      <a href={getSquareBookingLink(service.id)} onClick={(event) => trackBookingHandoff(event, { location: 'city_services', city: city.slug, service_id: service.id })} className="inline-flex min-h-11 items-center bg-blue-600 px-5 font-black text-white hover:bg-blue-700">Check Availability</a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <Link to="/services" className="mt-7 inline-flex min-h-11 items-center gap-2 font-black text-blue-700 hover:text-blue-900">See all detailing services <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-14 lg:py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[1fr_.85fr] lg:items-start">
          <div>
            <h2 className="text-4xl font-black tracking-tight">{city.content.whyLabel}</h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {city.content.whyPoints.map((point) => (
                <div key={point} className="flex gap-3 border-t border-slate-300 pt-4">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
                  <p className="font-semibold leading-7 text-slate-700">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <aside className="border-l-4 border-blue-600 bg-white p-7">
            <div className="flex items-center gap-2 text-blue-700"><MapPin className="h-5 w-5" /><span className="font-black">Nearby service areas</span></div>
            <div className="mt-5 flex flex-wrap gap-2">
              {city.content.serviceAreas.map((area) => <span key={area} className="border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700">{area}</span>)}
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-600">Mobile service depends on the selected service, weather, access and a safe work area. Bellevue drop-off is available by appointment for longer or weather-sensitive work.</p>
          </aside>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <h2 className="text-4xl font-black tracking-tight">How detailing works</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">Choose the service when you know what you need, or send photos first when the vehicle condition makes the choice less obvious.</p>
          </div>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {[
              ['1', 'Choose the service', 'Compare the service description, starting price and the condition it is designed for.'],
              ['2', 'Check availability', 'Use the service-specific Square link to choose the appropriate vehicle option and an available time.'],
              ['3', 'Confirm mobile or drop-off', 'The service, work area and weather determine whether mobile service or Bellevue drop-off is the better fit.'],
              ['4', 'Review condition-related work', 'If the vehicle needs work beyond the selected package, I discuss it with you before adding it.'],
            ].map(([number, title, body]) => (
              <div key={number} className="grid gap-3 py-5 sm:grid-cols-[44px_1fr]">
                <span className="flex h-9 w-9 items-center justify-center bg-slate-950 text-sm font-black text-white">{number}</span>
                <div><h3 className="font-black text-slate-950">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{body}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-14 text-white lg:py-16">
        <div className="container mx-auto flex flex-col justify-between gap-7 px-4 md:flex-row md:items-center">
          <div className="max-w-2xl"><h2 className="text-3xl font-black tracking-tight">Need help choosing the right detail?</h2><p className="mt-3 leading-7 text-slate-300">Text a few clear vehicle photos and tell me what you want cleaned, corrected or protected. I will recommend the service that fits.</p></div>
          <a href={photoTextLink} onClick={() => trackEvent('click_text_quote', { location: 'city_footer', city: city.slug })} className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 bg-blue-600 px-7 font-black text-white hover:bg-blue-700"><MessageSquare className="h-5 w-5" /> Text Vehicle Photos</a>
        </div>
      </section>

      <RelatedGuides topic="all" heading={`Helpful detailing guides for ${city.name}`} intro="Learn more about interior detailing, paint correction, ceramic coating, seasonal care and choosing the right service." />
    </div>
  );
}
