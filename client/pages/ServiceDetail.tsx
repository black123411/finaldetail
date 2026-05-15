import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Helmet } from "react-helmet-async";
import {
  CheckCircle2,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Sparkles,
  Clock,
  MapPin,
  ChevronRight,
  ArrowRight,
  Car,
  Info,
  AlertTriangle,
  Lightbulb,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  SERVICES,
  CATEGORIES,
  VEHICLE_SIZES,
  SPECIALTY_SIZES,
  ADD_ONS,
  type Service,
} from '@/shared/data/services';
import { BOOKING_LINK } from "../lib/constants";
import BeforeAfterSlider from "../components/BeforeAfterSlider";

export default function ServiceDetail() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = SERVICES.find((s) => s.id === serviceId);
  const category = service
    ? CATEGORIES.find((c) => c.id === service.categoryId)
    : null;

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [service]);

  const allSizes = [...VEHICLE_SIZES, ...SPECIALTY_SIZES];

  if (!service || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center bg-white p-12 rounded-[2.5rem] shadow-xl border border-zinc-100 max-w-md w-full">
          <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-zinc-300" />
          </div>
          <h1 className="text-3xl font-black text-zinc-900 mb-4 tracking-tight">
            Service Not Found
          </h1>
          <p className="text-zinc-500 mb-8 font-medium">
            The service you're looking for might have been moved or renamed.
          </p>
          <Button
            asChild
            className="w-full h-14 rounded-2xl text-base font-black uppercase tracking-widest bg-zinc-900"
          >
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get suggested add-ons (first 3)
  const suggestedAddOns = ADD_ONS.slice(0, 3);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Helmet>
        <title>{service.seo.title}</title>
        <meta name="description" content={service.seo.description} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": service.name,
            "description": service.longDescription,
            "provider": {
              "@type": "AutoBodyShop",
              "name": "Bryan's Showroom Quality Detailing",
              "image": "https://images.unsplash.com/photo-1552930294-6b595f4c2974?auto=format&fit=crop&q=80&w=1200"
            },
            "url": `https://bryansdetailing.com/services/${service.id}`
          })}
        </script>
      </Helmet>
      
      {/* Dynamic Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
            <Link
              to="/services"
              className="hover:text-zinc-900 transition-colors"
            >
              Services
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              to={`/services/category/${category.slug}`}
              className="hover:text-zinc-900 transition-colors"
            >
              {category.name}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-900">
              {service.name.split(" (")[0].split(" -")[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                {service.badge && (
                  <span
                    className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase ${
                      ["Most Popular", "Best Value", "Popular Choice"].includes(service.badge)
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                        : service.badge === "Top Choice" || service.badge === "Deep Restoration"
                          ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20"
                          : "bg-zinc-100 text-zinc-800 border border-zinc-200"
                    }`}
                  >
                    {service.badge}
                  </span>
                )}
                <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[0.9]">
                  {service.name}
                </h1>
                <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-xl">
                  {service.longDescription}
                </p>
              </div>

              <div className="flex flex-wrap gap-8 py-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                    Duration
                  </span>
                  <div className="flex items-center gap-3 text-zinc-900 font-black">
                    <div className="w-8 h-8 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100">
                      <Clock className="h-4 w-4" />
                    </div>
                    {typeof service.duration === "string"
                      ? service.duration
                      : `${service.duration.car || service.duration.rv || Object.values(service.duration)[0]} (varies)`}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                    Standards
                  </span>
                  <div className="flex items-center gap-3 text-zinc-900 font-black">
                    <div className="w-8 h-8 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </div>
                    Showroom Quality
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="h-16 px-12 text-lg font-black uppercase tracking-widest rounded-2xl bg-zinc-900 text-white shadow-xl shadow-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  asChild
                >
                  <Link
                    to={`/book?serviceId=${service.id}`}
                    className="flex items-center gap-3"
                  >
                    <Calendar className="h-5 w-5" />
                    Configure & Book
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 px-12 text-lg font-black uppercase tracking-widest rounded-2xl border-zinc-200 hover:bg-zinc-50 transition-all font-bold"
                  asChild
                >
                  <Link to="/quote">Custom Quote</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-[12px] border-white group">
                <img
                  src={service.image || category.image}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                   <p className="text-white font-bold tracking-tight italic">Professional {service.name} in Bellevue, NE.</p>
                </div>
              </div>
              {/* Abstract decorative elements */}
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-100/50 rounded-full filter blur-3xl opacity-60 mix-blend-multiply" />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-zinc-200/50 rounded-full filter blur-3xl opacity-60 mix-blend-multiply" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visual Proof Section */}
      <section className="py-24 bg-zinc-900 overflow-hidden">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                 <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Visual Results</span>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none">The <span className="italic text-zinc-500 font-normal">Showroom</span> Standard.</h2>
                 </div>
                 <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-md">
                    No magic tricks. Just technical cleaning, proper machine polishing, and industrial-grade protection. Slide to see the difference for yourself.
                 </p>
                 <div className="grid grid-cols-2 gap-8 pt-8">
                    <div className="space-y-2">
                       <p className="text-3xl font-black text-white tracking-tighter">100%</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Satisfaction Rate</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-3xl font-black text-white tracking-tighter">5.0</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Google Rating</p>
                    </div>
                 </div>
              </div>
              <div className="relative">
                 <BeforeAfterSlider 
                    beforeImage="/20191020_062847.jpg" 
                    afterImage="/20191020_062924.jpg" 
                 />
                 <div className="absolute -bottom-6 -right-6 bg-emerald-500 text-white p-6 rounded-3xl shadow-xl shadow-emerald-500/20 z-20">
                    <Sparkles className="h-6 w-6" />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Pricing & Selection Section */}
      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-2/3 space-y-20">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-black tracking-tight text-zinc-900 italic uppercase">Pricing Matrix</h2>
                  <div className="h-px flex-grow bg-zinc-200" />
                </div>

                <div className="overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-100">
                        <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-zinc-400">
                          Vehicle Size
                        </th>
                        <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-zinc-400">
                          Est. Duration
                        </th>
                        <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-zinc-400 text-right">
                          Base Investment
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {Object.entries(service.price).map(([slug, price]) => {
                        const sizeInfo = allSizes.find((s) => s.id === slug);
                        if (!sizeInfo) return null;

                        return (
                          <tr
                            key={slug}
                            className="group hover:bg-zinc-50/50 transition-all duration-300"
                          >
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <span className="text-3xl grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all leading-none duration-500">
                                  {sizeInfo.icon}
                                </span>
                                <span className="text-base font-black text-zinc-900">
                                  {sizeInfo.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-3 text-sm font-bold text-zinc-500">
                                <Clock className="h-4 w-4 text-zinc-300" />
                                {typeof service.duration === "string" 
                                  ? service.duration 
                                  : service.duration[slug] || 'Custom'}
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <span className="text-2xl font-black text-zinc-900">
                                ${price}{service.pricingType === 'variable' && <span className="text-xs font-medium text-zinc-400">/ft</span>}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="bg-zinc-50 p-6 border-t border-zinc-100 flex items-center justify-between">
                     <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Final quote provided upon on-site inspection
                     </p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Secure Booking Active</p>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-black tracking-tight text-zinc-900 italic uppercase">The Process</h2>
                  <div className="h-px flex-grow bg-zinc-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {service.features.map((feature, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-4 group"
                    >
                      <div className="w-8 h-8 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all duration-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-base font-bold text-zinc-700 leading-tight group-hover:text-zinc-950 transition-colors pt-1">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* suggested add-ons (Cross-sell) */}
              <div className="space-y-12 pt-12 border-t border-zinc-200">
                 <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-black tracking-tight text-zinc-900 italic uppercase">Recommended Upgrades</h2>
                    <div className="h-px flex-grow bg-zinc-200" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {suggestedAddOns.map((addon) => (
                       <div key={addon.id} className="p-6 rounded-[2rem] bg-white border border-zinc-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 group">
                          <div className="flex justify-between items-start mb-4">
                             <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                                <Plus className="h-5 w-5 text-zinc-400 group-hover:text-emerald-500" />
                             </div>
                             <span className="text-xl font-black text-zinc-900">${addon.price}</span>
                          </div>
                          <h4 className="font-black text-zinc-900 mb-2 truncate">{addon.name}</h4>
                          <p className="text-xs text-zinc-500 font-medium leading-relaxed mb-4 line-clamp-2">{addon.description}</p>
                          <Link to="/book" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                             Add in Booking
                             <ArrowRight className="h-3 w-3" />
                          </Link>
                       </div>
                    ))}
                 </div>
              </div>
            </div>

            <aside className="lg:w-1/3 space-y-8">
              <div className="bg-zinc-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group sticky top-32">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                   <ShieldCheck className="h-48 w-48" />
                </div>
                
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <ShieldCheck className="h-6 w-6 text-emerald-400" />
                  <h3 className="text-xl font-black tracking-tight uppercase italic">
                    The Promise
                  </h3>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="space-y-3">
                    {[
                      "Technical Decontamination Included",
                      "pH-Neutral Chemical Selection",
                      "Industrial Grade UV Protection",
                      "100% Satisfaction Guarantee",
                      "Fully Insured Professional Service"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-xs font-bold text-zinc-300 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-white/10">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-6 leading-relaxed">
                      * Most standard condition vehicles fit these price points. Heavy dirt or specialty needs may require adjusted quotes.
                    </p>
                    <Button className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs" asChild>
                       <Link to="/book" className="flex items-center gap-2">
                          Start Reservation
                          <ArrowUpRight className="h-4 w-4" />
                       </Link>
                    </Button>
                  </div>
                </div>
              </div>

              {service.bestFor && (
                <div className="p-8 rounded-[2.5rem] bg-amber-50 border border-amber-100 shadow-sm">
                   <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-4 flex items-center gap-2">
                       <Sparkles className="h-3 w-3" />
                       Who it's for
                   </p>
                   <p className="text-lg font-black italic tracking-tighter text-amber-900 leading-tight">
                       {service.bestFor}
                   </p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-24 bg-white border-t border-zinc-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900 leading-none">
              Explore <span className="italic text-zinc-400 font-normal">Other</span> Packages
            </h2>
            <Button variant="ghost" asChild className="gap-2 font-bold uppercase tracking-widest text-xs">
              <Link to="/services">
                View Catalog <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.filter(
              (s) => s.categoryId === service.categoryId && s.id !== service.id,
            )
              .slice(0, 3)
              .map((relService) => (
                <Link
                  key={relService.id}
                  to={`/services/${relService.id}`}
                  className="group bg-white p-10 rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-zinc-200/20 hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">{category.name}</span>
                        <h3 className="text-2xl font-black tracking-tighter text-zinc-900 group-hover:text-emerald-600 transition-colors">
                        {relService.name.split(" (")[0].split(" -")[0]}
                        </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500">
                        <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-8 line-clamp-2">
                    {relService.shortDescription}
                  </p>
                  <div className="mt-auto pt-8 border-t border-zinc-50 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                      Starting at
                    </span>
                    <span className="text-2xl font-black text-zinc-900">
                      $
                      {relService.isSpecialty
                        ? relService.price.rv
                        : relService.price.car}
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Sticky Bottom Booking Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-zinc-200 z-50 lg:hidden flex items-center justify-between gap-4">
         <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Refresh</p>
            <p className="text-xl font-black text-zinc-900">${service.price.car || Object.values(service.price)[0]}</p>
         </div>
         <Button className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-xs bg-zinc-900 text-white shrink-0" asChild>
            <Link to={`/book?serviceId=${service.id}`}>Book Now</Link>
         </Button>
      </div>
    </div>
  );
}
