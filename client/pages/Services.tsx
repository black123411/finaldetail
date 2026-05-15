import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Info, ArrowRight, Calendar as CalendarIcon, Check, Sparkles, AlertCircle, HelpCircle, Loader2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { SERVICES, VEHICLE_SIZES, SPECIALTY_SIZES, type Service } from '@/shared/data/services';
import { ServiceAPI } from '../services/api';

interface SquareService {
  id: string;
  name: string;
  variations: {
    id: string;
    name: string;
    price: number;
  }[];
}

export default function Services() {
  const [squareServices, setSquareServices] = useState<SquareService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSquareData() {
      try {
        const data = await ServiceAPI.getCatalogServices();
        setSquareServices(data);
      } catch (err) {
        console.error("Failed to fetch Square services:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSquareData();
  }, []);

  const fullServices = SERVICES.filter(s => s.categoryId === 'full-detailing');
  const interiorServices = SERVICES.filter(s => s.categoryId === 'interior-detailing');
  const exteriorServices = SERVICES.filter(s => s.categoryId === 'exterior-detailing');
  const correctionServices = SERVICES.filter(s => s.categoryId === 'paint-correction');
  const ceramicServices = SERVICES.filter(s => s.categoryId === 'protection');
  const specialtyServices = SERVICES.filter(s => ['rv-boat-detailing', 'tractor-detailing'].includes(s.categoryId));
  const maintenanceServices = SERVICES.filter(s => s.categoryId === 'maintenance');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": SERVICES.map((service, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": service.name,
        "description": service.shortDescription,
        "url": `https://bryansdetailing.com/services/${service.id}`,
        "provider": {
          "@type": "LocalBusiness",
          "name": "Bryan's Showroom Quality Detailing",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Bellevue",
            "addressRegion": "NE"
          }
        },
        "areaServed": ["Bellevue, NE", "Omaha, NE", "Papillion, NE"],
        "offers": {
          "@type": "Offer",
          "priceCurrency": "USD",
          "price": service.price['car'] || 0,
          "availability": "https://schema.org/InStock"
        }
      }
    }))
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-16">
      <Helmet>
        <title>Car Detailing Services & Paint Correction Pricing | Bellevue & Omaha</title>
        <meta name="description" content="View our professional car detailing packages. Specializing in interior detailing, exterior paint correction, ceramic coating, and more for cars, RVs, and boats." />
        <script type="application/ld+json">
          {JSON.stringify(servicesSchema)}
        </script>
      </Helmet>
      {/* Service Selection Strategy */}
      <section className="mb-32">
        <div className="bg-zinc-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
            <Sparkles className="h-64 w-64" />
          </div>
          <div className="relative z-10 max-w-3xl">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-6 block">Auto Detailing Strategy</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-none">Which <span className="italic text-zinc-500 font-normal">Service</span> do you need?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0 italic font-black text-xl">1</div>
                   <h3 className="text-2xl font-black tracking-tighter">Maintenance Detail</h3>
                </div>
                <p className="text-zinc-400 font-medium leading-relaxed">Best for vehicles detailed in the last 3-6 months. We focus on removing dust and light grime to restore that clean, factory-fresh interior and exterior.</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center italic font-black text-xl text-zinc-950">2</div>
                   <h3 className="text-2xl font-black tracking-tighter">Full Car Detailing</h3>
                </div>
                <p className="text-zinc-400 font-medium leading-relaxed">Our most popular auto detailing level. Includes deep interior cleaning, stain removal, and technical exterior decontamination with iron fallout removal.</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0 italic font-black text-xl">3</div>
                   <h3 className="text-2xl font-black tracking-tighter">Paint Correction</h3>
                </div>
                <p className="text-zinc-400 font-medium leading-relaxed">For neglected vehicles or pre-sale prep. Hot water extraction for carpets and multi-stage machine polishing to remove swirls and scratches from your clear coat.</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0 italic font-black text-xl">4</div>
                   <h3 className="text-2xl font-black tracking-tighter">Ceramic Coating</h3>
                </div>
                <p className="text-zinc-400 font-medium leading-relaxed">Long-term paint protection. Professional-grade ceramic coatings that make car washing 80% easier, repel water, and add a permanent gloss to your paint.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="max-w-4xl mx-auto text-center mb-24 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4"
          >
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isLoading ? 'bg-zinc-100 text-zinc-400' : 'bg-emerald-50 text-emerald-600'}`}>
              {isLoading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Syncing Prices...
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Square Pricing Active
                </>
              )}
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black tracking-tighter text-zinc-900 leading-[0.9]"
          >
            Professional Detailing in <span className="text-zinc-400 italic font-normal">Bellevue & Omaha</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-500 max-w-2xl mx-auto font-medium"
          >
            Expert ceramic coating, paint correction, interior restoration, and specialty detailing for RVs, boats, and tractors.
          </motion.p>
        </div>

        {/* Maintenance Section */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black tracking-tighter text-zinc-900 italic">Maintenance Detailing</h2>
            <div className="h-px bg-zinc-200 flex-grow"></div>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {maintenanceServices.map((service) => (
              <ServiceCard key={service.id} service={service} squareServices={squareServices} />
            ))}
          </motion.div>
        </section>

        {/* Full Detailing */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black tracking-tighter text-zinc-900 italic">Full Detailing Packages</h2>
            <div className="h-px bg-zinc-200 flex-grow"></div>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {fullServices.map((service) => (
              <ServiceCard key={service.id} service={service} squareServices={squareServices} />
            ))}
          </motion.div>
        </section>

        {/* Interior & Exterior */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
          <section className="space-y-12">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black tracking-tighter text-zinc-900 italic">Interior</h2>
              <div className="h-px bg-zinc-200 flex-grow"></div>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-8"
            >
              {interiorServices.map((service) => (
                <ServiceCard key={service.id} service={service} squareServices={squareServices} />
              ))}
            </motion.div>
          </section>
          <section className="space-y-12">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black tracking-tighter text-zinc-900 italic">Exterior</h2>
              <div className="h-px bg-zinc-200 flex-grow"></div>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-8"
            >
              {exteriorServices.map((service) => (
                <ServiceCard key={service.id} service={service} squareServices={squareServices} />
              ))}
            </motion.div>
          </section>
        </div>

        {/* Paint Correction & Ceramic */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
          <section className="space-y-12">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black tracking-tighter text-zinc-900 italic">Correction</h2>
              <div className="h-px bg-zinc-200 flex-grow"></div>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-8"
            >
              {correctionServices.map((service) => (
                <ServiceCard key={service.id} service={service} squareServices={squareServices} />
              ))}
            </motion.div>
          </section>
          <section className="space-y-12">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black tracking-tighter text-zinc-900 italic">Ceramic</h2>
              <div className="h-px bg-zinc-200 flex-grow"></div>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-8"
            >
              {ceramicServices.map((service) => (
                <ServiceCard key={service.id} service={service} squareServices={squareServices} />
              ))}
            </motion.div>
          </section>
        </div>

        {/* RV, Boat & Tractor Section */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black tracking-tighter text-zinc-900 italic">Specialty Vehicles</h2>
            <div className="h-px bg-zinc-200 flex-grow"></div>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {specialtyServices.map((service) => (
              <ServiceCard key={service.id} service={service} squareServices={squareServices} />
            ))}
          </motion.div>
        </section>
      </div>
    </div>
  );
}

function ServiceCard({ service, squareServices }: { service: Service; squareServices: SquareService[] }) {
  const sizesToDisplay = service.isSpecialty ? SPECIALTY_SIZES : VEHICLE_SIZES;
  
  const getPrice = (sizeId: string) => {
    const squareMatch = squareServices.find(ss => 
      ss.name.toLowerCase().includes(service.name.toLowerCase()) ||
      service.name.toLowerCase().includes(ss.name.toLowerCase())
    );

    if (squareMatch) {
      const sizeName = sizesToDisplay.find(s => s.id === sizeId)?.name;
      const variation = squareMatch.variations.find(v => 
        v.name.toLowerCase().includes(sizeName?.toLowerCase() || '')
      ) || squareMatch.variations[0];
      return variation ? variation.price : service.price[sizeId];
    }
    return service.price[sizeId];
  };

  const startingPrice = getPrice(sizesToDisplay[0].id);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      variants={cardVariants}
      whileHover={{ y: -10 }}
      className={`rounded-[2.5rem] p-8 flex flex-col relative transition-all duration-500 h-full group ${
        service.highlight 
          ? 'bg-zinc-900 text-white shadow-2xl shadow-zinc-300 border border-zinc-800' 
          : 'bg-white text-zinc-900 shadow-xl shadow-zinc-200/50 border border-zinc-100 hover:border-zinc-300'
      }`}
    >
      {service.id === 'full-detail-package' && (
        <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest z-10 shadow-lg shadow-emerald-500/20">
          Save $50+ Bundle
        </div>
      )}
      
      {service.badge && (
        <div className={`absolute top-0 left-10 -translate-y-1/2 px-5 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase z-10 shadow-xl ${
          service.badge === 'Most Popular' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
          service.badge === 'Best Choice' ? 'bg-amber-400 text-black shadow-amber-400/20' :
          'bg-zinc-100 text-zinc-800 border border-zinc-200'
        }`}>
          {service.badge}
        </div>
      )}
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-3xl font-black tracking-tighter mb-2 group-hover:text-zinc-600 transition-colors duration-300">{service.name}</h3>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1 rounded-full w-fit">
            <CalendarIcon className="h-3 w-3" />
            <span>Est. {typeof service.duration === "string" ? service.duration : `${service.duration.car || service.duration.rv || Object.values(service.duration)[0]} (varies)`}</span>
          </div>
        </div>
      </div>

      <p className={`text-sm leading-relaxed mb-8 font-medium ${service.highlight ? 'text-zinc-400' : 'text-zinc-500'}`}>
        {service.shortDescription}
      </p>

      {service.bestFor && (
        <div className={`p-5 rounded-3xl border mb-10 transition-colors duration-300 ${service.highlight ? 'bg-zinc-800/40 border-zinc-700 group-hover:bg-zinc-800' : 'bg-zinc-50 border-zinc-100 group-hover:bg-zinc-100'}`}>
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-xl shrink-0 ${service.highlight ? 'bg-zinc-700/50' : 'bg-white shadow-sm'}`}>
              <Sparkles className={`h-4 w-4 ${service.highlight ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 ${service.highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>Ideal For</p>
              <p className={`text-xs font-bold leading-relaxed tracking-tight ${service.highlight ? 'text-zinc-300' : 'text-zinc-700'}`}>{service.bestFor}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6 mb-10">
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${service.highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>The Process</p>
        <div className="grid gap-3">
          {service.features.slice(0, 5).map((feature: string, idx: number) => (
            <div key={idx} className="flex items-center gap-4 group/item">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/item:scale-110 ${service.highlight ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                <Check className={`h-3 w-3 ${service.highlight ? 'text-emerald-400' : 'text-zinc-900'}`} />
              </div>
              <span className={`text-sm font-bold tracking-tight transition-colors duration-300 ${service.highlight ? 'text-zinc-200 group-hover/item:text-white' : 'text-zinc-700 group-hover/item:text-zinc-900'}`}>{feature}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className={`mt-auto pt-10 border-t ${service.highlight ? 'border-zinc-800' : 'border-zinc-100'}`}>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <span className={`text-xs font-black uppercase tracking-[0.2em] ${service.highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>Starting At</span>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tighter">${startingPrice}{service.pricingType === 'variable' && <span className="text-sm">/ft</span>}</span>
            </div>
          </div>
          
          <div className={`grid grid-cols-2 gap-3 p-5 rounded-[2rem] transition-colors duration-300 ${service.highlight ? 'bg-zinc-800/50 group-hover:bg-zinc-800/80' : 'bg-zinc-50 group-hover:bg-zinc-100'}`}>
            {sizesToDisplay.slice(0, 4).map((size) => (
              <div key={size.id} className="flex flex-col">
                <span className={`text-[9px] font-black uppercase tracking-widest mb-1 ${service.highlight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  {size.name.split('/')[0]}
                </span>
                <span className={`text-sm font-black ${service.highlight ? 'text-white' : 'text-zinc-900'}`}>
                  {getPrice(size.id) ? `$${getPrice(size.id)}` : 'Quote'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            className={`w-full h-16 rounded-[1.5rem] text-base font-black uppercase tracking-widest transition-all duration-300 shadow-xl group/btn ${
              service.highlight 
                ? 'bg-white text-zinc-950 hover:bg-zinc-200 shadow-white/10' 
                : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-zinc-900/20'
            }`}
            asChild
          >
            <Link to={`/book?serviceId=${service.id}`} className="flex items-center justify-center gap-3">
              <CalendarIcon className="h-5 w-5 transition-transform group-hover/btn:scale-110" />
              Book Appointment
            </Link>
          </Button>
          
          <Link 
            to={`/services/${service.id}`}
            className="group/more block"
          >
            <div className={`w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${
              service.highlight ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'
            }`}>
              Learn More
              <div className={`p-1.5 rounded-lg transition-all duration-300 ${service.highlight ? 'bg-zinc-800 group-hover/more:bg-zinc-700' : 'bg-white shadow group-hover/more:bg-zinc-900 group-hover/more:text-white'}`}>
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
