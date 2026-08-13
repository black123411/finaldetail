import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { CITIES } from '@/shared/data/cities';
import { SERVICES } from '@/shared/data/services';
import { Button } from "../components/ui/button";
import RelatedGuides from '../components/RelatedGuides';

export default function CityDetail() {
  const { slug } = useParams<{ slug: string }>();
  const city = CITIES.find(c => c.slug === slug);

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-black italic tracking-tighter mb-4 text-zinc-900">City Not Found</h1>
          <p className="text-zinc-500 mb-8 font-black uppercase text-xs tracking-widest">Service availability for this area is not yet listed.</p>
          <Link to="/">
            <Button variant="default">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const region = city.name.includes('Council Bluffs') ? 'IA' : 'NE';
  const citySchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `Auto Detailing in ${city.name}`,
    "serviceType": "Auto detailing",
    "description": city.seo.description,
    "url": `https://bryansdetailingomaha.com/areas/${city.slug}`,
    "provider": {
      "@type": ["LocalBusiness", "AutomotiveBusiness"],
      "@id": "https://bryansdetailingomaha.com/#business",
      "name": "Bryan's Showroom Quality Mobile Detailing"
    },
    "areaServed": {
      "@type": "City",
      "name": city.name.replace(/, (NE|IA)$/, ''),
      "addressRegion": region,
      "addressCountry": "US"
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(citySchema)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-zinc-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-transparent to-zinc-900" />
          <img 
            src="/20211009_021727-COLLAGE.jpg" 
            alt="Detailing background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-[1px] bg-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Service Area: {city.name}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-8 leading-[0.9]">
              {city.content.title}
            </h1>
            <p className="text-xl text-zinc-400 font-medium leading-relaxed mb-10 max-w-2xl">
              {city.content.intro}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/book">
                <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-xs font-black uppercase tracking-widest bg-blue-600 text-zinc-950 hover:bg-blue-400 border-none shadow-[0_8px_30px_rgb(16,185,129,0.3)]">
                   {city.content.cta}
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-16 px-10 text-xs font-black uppercase tracking-widest border-white/30 text-white hover:bg-white/10 hover:border-white/60">
                  View Services &amp; Pricing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-black italic tracking-tighter text-zinc-900 mb-4">{city.content.servicesLabel}</h2>
            <div className="w-20 h-1 bg-blue-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              ...((city.content.featuredServiceIds || [])
                .map((id) => SERVICES.find((service) => service.id === id))
                .filter((service): service is typeof SERVICES[number] => Boolean(service))),
              ...SERVICES.filter((service) => !(city.content.featuredServiceIds || []).includes(service.id)),
            ].map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-3xl border border-zinc-100 bg-white hover:border-blue-600/20 hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">0{index + 1}</span>
                    <Link to={`/services/${service.id}`} className="text-zinc-300 group-hover:text-blue-600 transition-colors">
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                  <h3 className="text-xl font-black italic tracking-tighter text-zinc-900 mb-3">{service.name}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-6">
                    {service.shortDescription}
                  </p>
                </div>
                <Link to={`/services/${service.id}`} className="text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:translate-x-2 transition-transform inline-flex items-center">
                  Learn More <ArrowRight className="h-3 w-3 ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us & Areas */}
      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black italic tracking-tighter text-zinc-900 mb-8">{city.content.whyLabel}</h2>
              <div className="space-y-6">
                {city.content.whyPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="mt-1 bg-blue-100 p-1 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-lg font-bold text-zinc-800 italic">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <MapPin className="h-40 w-40" />
               </div>
               <h3 className="text-2xl font-black italic tracking-tighter mb-8">Service Areas Near {city.name}</h3>
               <ul className="grid grid-cols-2 gap-y-4 gap-x-8">
                 {city.content.serviceAreas.map((area, idx) => (
                   <li key={idx} className="flex items-center gap-3 text-zinc-400 hover:text-blue-600 transition-colors">
                     <MapPin className="h-4 w-4" />
                     <span className="text-sm font-black italic">{area}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Local service-intent links */}
      <section className="py-20 bg-white border-t border-zinc-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-3">
              Popular {city.name} searches
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-950 mb-5">
              Detailing services for {city.name} drivers
            </h2>
            <p className="text-lg leading-8 text-zinc-600 mb-8">
              Choose the service you are interested in, or text me photos if you are not sure.
              I can come to you for many services, and longer jobs can be dropped off in Bellevue.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(city.content.featuredServiceIds || []).slice(0, 6).map((serviceId) => {
                const service = SERVICES.find((item) => item.id === serviceId);
                if (!service) return null;
                return (
                  <Link
                    key={service.id}
                    to={`/services/${service.id}`}
                    className="rounded-2xl border border-zinc-200 p-5 hover:border-blue-400 hover:shadow-lg transition-all"
                  >
                    <span className="block font-black text-zinc-900">{service.name}</span>
                    <span className="mt-2 block text-sm leading-6 text-zinc-500">{service.shortDescription}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-zinc-50 border-t border-zinc-200">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">How it works</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-black tracking-tight text-zinc-950">
                A straightforward detailing process for {city.name}
              </h2>
              <p className="mt-5 text-lg leading-8 text-zinc-600">
                Choose an online appointment when you know the service you want, or text me photos when you need help.
                I will look at the vehicle and tell you which option makes sense.
              </p>
            </div>
            <div className="grid gap-4">
              {[
                ['1', 'Choose the right service', 'Compare interior, full-detail, paint-correction, ceramic-coating, and maintenance options.'],
                ['2', 'Confirm the appointment', 'Use online booking for available dates and times.'],
                ['3', 'Prepare the vehicle', 'For mobile service, make sure the vehicle is accessible and there is enough safe working space.'],
                ['4', 'Review the work', "For restoration and protection work, I explain what can improve based on the vehicle's actual condition."],
              ].map(([number, title, body]) => (
                <div key={number} className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-sm font-black text-white">{number}</span>
                  <div>
                    <h3 className="font-black text-zinc-900">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-zinc-600">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-t border-zinc-200">
        <div className="container mx-auto px-6 max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Local FAQ</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-black tracking-tight text-zinc-950">
            {city.name} detailing questions
          </h2>
          <div className="mt-8 space-y-4">
            {[
              {
                q: `Do you offer mobile car detailing in ${city.name}?`,
                a: `Mobile service is available around the Omaha metro when the vehicle is accessible and there is enough safe working space. Bellevue drop-off is available for intensive work.`
              },
              {
                q: `What detailing service should I choose in ${city.name}?`,
                a: `Choose interior detailing for cabin buildup, stains, pet hair, or spills; a full detail for inside-and-out cleaning; paint correction for visible paint defects; and ceramic coating when long-term paint protection is the goal.`
              },
              {
                q: `Can I get paint correction or ceramic coating near ${city.name}?`,
                a: `Yes. I offer paint correction and System X ceramic coating through my Bellevue operation. I confirm the work after inspecting the paint.`
              }
            ].map((faq) => (
              <article key={faq.q} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <h3 className="font-black text-zinc-900">{faq.q}</h3>
                <p className="mt-2 leading-7 text-zinc-600">{faq.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <RelatedGuides
        topic="local"
        heading={`Car-care guides for ${city.name} drivers`}
        intro={`Compare mobile and drop-off service, plan around Nebraska weather, and build a practical detailing schedule for a vehicle driven around ${city.name}.`}
      />

      {/* Link Map Section (Internal Linking Boost) */}
      <section className="py-12 bg-white border-t border-zinc-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Quick Links:</span>
            {city.content.serviceAreas.map(area => {
              const matchingCity = CITIES.find(c => c.name.includes(area));
              if (matchingCity && matchingCity.slug !== city.slug) {
                return (
                  <Link key={area} to={`/areas/${matchingCity.slug}`} className="text-xs font-black italic text-zinc-600 hover:text-blue-600 transition-colors">
                    Detailing in {area}
                  </Link>
                );
              }
              return null;
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
