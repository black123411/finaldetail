import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Calendar, Check, Clock } from 'lucide-react';
import { SERVICES, type Service } from '@/shared/data/services';
import { ServiceAPI } from '../services/api';
import { formatCurrency } from '../lib/utils';
import RelatedGuides from '../components/RelatedGuides';

interface SquareService {
  id: string;
  name: string;
  variations: Array<{ id: string; name: string; price: number }>;
}

const SERVICE_GROUPS = [
  {
    title: 'Interior Detailing',
    description: 'Interior cleaning for everyday buildup, heavy stains, pet hair, spills, and odor problems.',
    ids: ['maintenance-interior', 'interior-detail', 'interior-reset', 'odor-elimination'],
  },
  {
    title: 'Complete Vehicle Details',
    description: 'Inside-and-out packages for daily drivers, neglected vehicles, new cars, pre-sale preparation, and ongoing maintenance.',
    ids: ['full-detail-package', 'showroom-package', 'new-car-detail', 'pre-sale-detail', 'maintenance-detail'],
  },
  {
    title: 'Paint Restoration and Protection',
    description: 'Exterior washing, decontamination, machine polishing, swirl removal, ceramic coating, and long-term paint protection.',
    ids: ['exterior-enhancement', 'paint-enhancement-polish', 'paint-correction-l1', 'paint-correction-l2', 'system-x-crystal-plus', 'system-x-pro-plus', 'system-x-max-g-plus', 'system-x-phantom-2k', 'ppf-inquiry'],
  },
  {
    title: 'RV, Boat and Equipment Detailing',
    description: 'Condition-based cleaning and restoration for larger vehicles, boats, trailers, tractors, and equipment.',
    ids: ['rv-boat-wash-wax', 'rv-boat-oxidation', 'tractor-detailing-service'],
  },
];

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

function getStartingPrice(service: Service, squareServices: SquareService[]) {
  const localPrice = service.price.car || service.price.suv || service.price.rv || Object.values(service.price)[0];
  const targetName = normalize(service.squareName || service.name);
  const squareMatch = squareServices.find((item) => {
    const squareName = normalize(item.name);
    return squareName === targetName || squareName.includes(targetName) || targetName.includes(squareName);
  });
  const squarePrices = squareMatch?.variations.map((variation) => variation.price).filter((price) => price > 0) || [];
  const price = squarePrices.length ? Math.min(...squarePrices) : localPrice;
  if (!price) return 'Custom quote';
  return service.pricingType === 'variable' ? 'From ' + formatCurrency(price) + '/ft' : 'From ' + formatCurrency(price);
}

function getDuration(service: Service) {
  if (typeof service.duration === 'string') return service.duration;
  return service.duration.car || service.duration.rv || Object.values(service.duration)[0];
}

export default function Services() {
  const [squareServices, setSquareServices] = useState<SquareService[]>([]);

  useEffect(() => {
    ServiceAPI.getCatalogServices()
      .then((data) => setSquareServices(Array.isArray(data) ? data : []))
      .catch(() => setSquareServices([]));
  }, []);

  const servicesSchema = {
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
    <main className="min-h-screen bg-white text-zinc-950">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(servicesSchema)}</script>
      </Helmet>
      <section className="bg-emerald-500 text-zinc-950 py-4 text-center font-black uppercase tracking-[0.24em]">
        Book online 24/7 and reserve your preferred detail time. Weekend and holiday appointments are scheduled based on availability.
      </section>

      <section className="relative min-h-140 flex items-end overflow-hidden bg-zinc-950">
        <img
          src="/gallery/takeout/20260502_192636.webp"
          alt="Corrected black vehicle paint after professional detailing in Bellevue"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/65 to-black/15" />
        <div className="container relative mx-auto px-4 pb-16 pt-32 md:pb-24">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl font-black leading-[0.95] md:text-7xl">
              Auto Detailing Services and Pricing
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-zinc-200 md:text-xl">
              Choose the service based on the result your vehicle needs—not simply the cheapest package. The prices below are starting prices for standard-condition vehicles. Vehicle size, excessive pet hair, staining, mud, bodily fluids, smoke, severe odors, oxidation, and neglected condition may affect the final price. Any condition adjustment is explained before additional work begins.
             </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/book"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-emerald-500 px-7 font-black text-zinc-950 transition-colors hover:bg-emerald-400"
              >
                <Calendar className="h-5 w-5" /> View Current Availability
              </Link>
              <Link
                to="/quote"
                className="inline-flex h-14 items-center justify-center rounded-md border border-white/40 bg-black/20 px-7 font-bold text-white transition-colors hover:bg-white hover:text-zinc-950"
              >
                Text Photos for a Recommendation
              </Link>
            </div>
            <p className="mt-4 max-w-2xl text-sm text-zinc-200 leading-relaxed">
              Book now to see live appointment availability for your vehicle size and condition. Most weekend details are reserved quickly.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="container mx-auto grid gap-6 px-4 py-8 text-sm font-semibold text-zinc-700 md:grid-cols-3">
          <p>Prices vary by vehicle size and condition.</p>
          <p>Mobile service and Bellevue drop-off are available.</p>
          <p>Payment is collected after the work is completed.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-black tracking-tight md:text-5xl">Choose the result your vehicle needs</h2>
          <p className="mt-5 text-lg leading-relaxed text-zinc-600">
            Compare interior detailing, complete inside-and-out packages, paint correction, ceramic coating, and specialty vehicle services. Each service page explains what is included, what is not included, and when a condition-based quote is needed.
          </p>
        </div>

        <div className="mt-20 space-y-24">
          {SERVICE_GROUPS.map((group) => {
            const groupServices = group.ids
              .map((id) => SERVICES.find((service) => service.id === id))
              .filter((service): service is Service => Boolean(service));

            return (
              <section key={group.title}>
                <div className="max-w-3xl border-l-4 border-emerald-500 pl-5">
                  <h2 className="text-3xl font-black tracking-tight md:text-4xl">{group.title}</h2>
                  <p className="mt-3 leading-relaxed text-zinc-600">{group.description}</p>
                </div>

                <div className="mt-10 grid gap-7 lg:grid-cols-2">
                  {groupServices.map((service) => (
                    <article key={service.id} className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
                      <Link to={`/services/${service.id}`} className="group block">
                        <div className="aspect-16/8 overflow-hidden bg-zinc-900">
                          {service.image ? (
                            <img
                              src={service.image}
                              alt={`${service.name} by Bryan's Showroom Quality Mobile Detailing`}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full items-end p-6 text-2xl font-black text-white">
                              Tractor and equipment cleaning
                            </div>
                          )}
                        </div>
                        <div className="p-6 md:p-7">
                          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-bold text-zinc-600">
                            <span>{getStartingPrice(service, squareServices)}</span>
                            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {getDuration(service)}</span>
                          </div>
                          <h3 className="mt-4 text-2xl font-black tracking-tight transition-colors group-hover:text-emerald-700">
                            {service.name}
                          </h3>
                          <p className="mt-3 leading-relaxed text-zinc-600">{service.shortDescription}</p>
                          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                            {service.features.slice(0, 4).map((feature) => (
                              <li key={feature} className="flex items-start gap-2 text-sm text-zinc-700">
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <span className="mt-6 inline-flex items-center gap-2 font-black text-zinc-950">
                            View service details <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <RelatedGuides
        topic="all"
        heading="Compare services before you book"
        intro="These six guides explain interior work, paint correction, protection, maintenance timing, winter care, and mobile versus drop-off appointments."
      />

      <section className="bg-zinc-950 py-20 text-white">
        <div className="container mx-auto flex flex-col items-start justify-between gap-8 px-4 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black tracking-tight">Not sure which service fits?</h2>
            <p className="mt-4 text-lg leading-relaxed text-zinc-300">
              Send clear photos and a short description of the vehicle condition. I can recommend the appropriate package before scheduling.
            </p>
          </div>
          <Link
            to="/quote"
            className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-md bg-white px-7 font-black text-zinc-950 hover:bg-zinc-200"
          >
            Text Photos for a Recommendation <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
