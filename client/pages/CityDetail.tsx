import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { MapPin, CheckCircle2, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { CITIES } from '@/shared/data/cities';
import { SERVICES } from '@/shared/data/services';
import { Button } from "../components/ui/button";

export default function CityDetail() {
  const { slug } = useParams<{ slug: string }>();
  const city = CITIES.find(c => c.slug === slug);

  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-4xl font-black italic tracking-tighter mb-4 text-zinc-900">City Not Found</h1>
          <p className="text-zinc-500 mb-8 font-black uppercase text-xs tracking-widest">We may not serve this area yet.</p>
          <Link to="/">
            <Button variant="default">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const citySchema = {
    "@context": "https://schema.org",
    "@type": "AutoBodyShop",
    "name": `Bryan's Showroom Quality Detailing - ${city.name}`,
    "image": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=2000",
    "description": city.seo.description,
    "url": `https://bryansdetailingomaha.com/areas/${city.slug}`,
    "telephone": "+17123056313",
    "priceRange": "$$",
    "areaServed": {
      "@type": "City",
      "name": city.name,
      "addressRegion": "NE" // Adjust region if necessary
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>{city.seo.title}</title>
        <meta name="description" content={city.seo.description} />
        <script type="application/ld+json">
          {JSON.stringify(citySchema)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-zinc-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-transparent to-zinc-900" />
          <img 
            src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=2000" 
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
              <div className="w-10 h-[1px] bg-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Service Area: {city.name}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-8 leading-[0.9]">
              {city.content.title}
            </h1>
            <p className="text-xl text-zinc-400 font-medium leading-relaxed mb-10 max-w-2xl">
              {city.content.intro}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/book">
                <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-xs font-black uppercase tracking-widest bg-emerald-500 text-zinc-950 hover:bg-emerald-400 border-none shadow-[0_8px_30px_rgb(16,185,129,0.3)]">
                   {city.content.cta}
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-16 px-10 text-xs font-black uppercase tracking-widest border-white/30 text-white hover:bg-white/10 hover:border-white/60">
                  View Our Services
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
            <div className="w-20 h-1 bg-emerald-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-3xl border border-zinc-100 bg-white hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">0{index + 1}</span>
                    <Link to={`/services/${service.id}`} className="text-zinc-300 group-hover:text-emerald-500 transition-colors">
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </div>
                  <h3 className="text-xl font-black italic tracking-tighter text-zinc-900 mb-3">{service.name}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-6">
                    {service.shortDescription}
                  </p>
                </div>
                <Link to={`/services/${service.id}`} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 group-hover:translate-x-2 transition-transform inline-flex items-center">
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
                    <div className="mt-1 bg-emerald-100 p-1 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="text-lg font-bold text-zinc-800 italic">{point}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 p-8 bg-white rounded-3xl border border-zinc-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-900">Local Area Favorites</span>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed mb-6 font-medium italic">
                  "Bryan did an amazing job on my car in Papillion. The interior looks brand new and he was so professional. Highly recommend his mobile services!"
                </p>
                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">— Local Customer Review</span>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <MapPin className="h-40 w-40" />
               </div>
               <h3 className="text-2xl font-black italic tracking-tighter mb-8">Service Areas Near {city.name}</h3>
               <ul className="grid grid-cols-2 gap-y-4 gap-x-8">
                 {city.content.serviceAreas.map((area, idx) => (
                   <li key={idx} className="flex items-center gap-3 text-zinc-400 hover:text-emerald-500 transition-colors">
                     <MapPin className="h-4 w-4" />
                     <span className="text-sm font-black italic">{area}</span>
                   </li>
                 ))}
               </ul>
               <div className="mt-12 flex items-center gap-4 p-6 bg-zinc-800/50 rounded-2xl border border-zinc-800">
                 <ShieldCheck className="h-6 w-6 text-emerald-500" />
                 <div>
                   <p className="text-xs font-black uppercase tracking-widest text-zinc-200">Fully Licensed & Insured</p>
                   <p className="text-[10px] text-zinc-500 font-medium">Protecting your vehicle in all Nebraska service areas.</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Link Map Section (Internal Linking Boost) */}
      <section className="py-12 bg-white border-t border-zinc-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Quick Links:</span>
            {city.content.serviceAreas.map(area => {
              const matchingCity = CITIES.find(c => c.name.includes(area));
              if (matchingCity && matchingCity.slug !== city.slug) {
                return (
                  <Link key={area} to={`/areas/${matchingCity.slug}`} className="text-xs font-black italic text-zinc-600 hover:text-emerald-500 transition-colors">
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
