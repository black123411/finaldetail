import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Quote, Sparkles, MapPin, Calendar, CheckCircle2, ArrowRight, Star, ShieldCheck, Clock, Plus, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { BOOKING_LINK } from '../lib/constants';
import DetailingQuiz from '../components/DetailingQuiz';
import ServiceMap from '../components/ServiceMap';
import Testimonials from '../components/Testimonials';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { SERVICES } from '@/shared/data/services';
import { BEFORE_AFTERS } from '@/shared/data/photos';
import { CITIES } from '@/shared/data/cities';

export default function Home() {
  const featuredServices = [
    SERVICES.find(s => s.id === 'express-detail'),
    SERVICES.find(s => s.id === 'full-detail-package'),
    SERVICES.find(s => s.id === 'showroom-package')
  ].filter(Boolean) as typeof SERVICES;

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Premium Auto Detailing in Bellevue & Omaha | Bryan's</title>
        <meta name="description" content="Top-rated auto detailing in Bellevue and Omaha, NE. Specializing in professional ceramic coating, paint correction, and interior detailing. Book today." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-zinc-950 text-white overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-detailing.png"
            alt="Professional auto detailing and paint correction"
            className="w-full h-full object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-xs font-black uppercase tracking-[0.2em] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
              <span>Omaha Metro Mobile Auto Detailing Expert</span>
            </div>

            <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tight leading-[0.85] uppercase">
              Premium <span className="text-zinc-500 italic block font-normal normal-case">Auto Detailing</span> in Omaha & Bellevue.
            </h1>

          <p className="text-xl md:text-2xl text-zinc-300 max-w-2xl leading-relaxed font-medium mt-6">
            10+ years of professional <strong className="font-bold">mobile car detailing</strong>, <strong className="font-bold">paint correction</strong>, and <strong className="font-bold">ceramic coating</strong>. I specialize in precision interior detailing and industrial-grade paint protection for residents across <strong className="font-bold">Omaha, Bellevue, Papillion, La Vista, and Council Bluffs.</strong>
          </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-6">
              <Button size="lg" className="h-16 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black uppercase tracking-widest text-sm shadow-2xl shadow-emerald-500/20" asChild>
                <Link to="/book" className="flex items-center gap-3">
                  <Calendar className="h-5 w-5" />
                  Book Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl border-zinc-700 bg-white/5 backdrop-blur-md text-white hover:bg-white hover:text-zinc-950 font-black uppercase tracking-widest text-sm" asChild>
                <Link to="/services">
                  See Prices
                </Link>
              </Button>
              <Button size="lg" className="h-16 px-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950 font-black uppercase tracking-widest text-sm shadow-xl" asChild>
                <a href="sms:+17123056313?body=Hi%20Bryan%2C%20I'd%20like%20a%20detailing%20quote%20for%20my%20car.%20Here%20are%20some%20photos%3A" className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5" />
                  Text Photos for Quote
                </a>
              </Button>
            </div>


          </motion.div>
        </div>
      </section>

      {/* Detailing Quiz Section */}
      <section className="py-32 bg-zinc-50 overflow-hidden border-b border-zinc-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Service Finder</span>
            <h2 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tight leading-none uppercase">
              Find Your <span className="text-emerald-500 italic font-medium tracking-tight normal-case block md:inline">Perfect Package.</span>
            </h2>
            <p className="text-xl text-zinc-600 leading-relaxed font-medium max-w-2xl mx-auto">
              Not sure which auto detailing service is right for you? Answer a few quick questions and I'll recommend the ideal solution for your vehicle's condition.
            </p>
          </div>
          <DetailingQuiz />
        </div>
      </section>

      {/* Popular Services - Data Driven */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-3xl space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">Catalog Highlights</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-none">
                Technical <span className="italic text-zinc-400 font-normal">Detailing</span> Packages.
              </h2>
            </div>
            <Button variant="outline" asChild className="h-14 px-8 rounded-xl font-black uppercase tracking-widest text-xs border-zinc-200 hover:bg-zinc-50">
              <Link to="/services" className="gap-2">
                All Services <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredServices.map((service, idx) => (
              <motion.div 
                key={service.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-[2.5rem] p-10 shadow-xl border flex flex-col relative group overflow-hidden ${
                  idx === 1 
                    ? 'bg-zinc-900 text-white border-zinc-800 shadow-zinc-900/20 transform lg:-translate-y-6 scale-[1.03]' 
                    : 'bg-white text-zinc-900 border-zinc-100 shadow-zinc-200/50 hover:border-zinc-300 hover:-translate-y-2'
                } transition-all duration-500`}
              >
                {idx === 1 && (
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                     <Sparkles className="h-48 w-48" />
                  </div>
                )}
                
                {idx === 1 && (
                  <div className="absolute top-6 right-10 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-emerald-500/20">
                    Best Value
                  </div>
                )}
                
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6 block">Level {idx + 1}</span>
                <h3 className="text-3xl font-black tracking-tighter mb-4">{service.name}</h3>
                <p className={`text-base mb-8 flex-grow font-medium leading-relaxed ${idx === 1 ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  {service.shortDescription}
                </p>
                <div className="space-y-4 mb-10">
                  {service.features.slice(0, 4).map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-bold">
                      <div className={`w-1.5 h-1.5 rounded-full ${idx === 1 ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-zinc-900'}`} />
                      <span className={idx === 1 ? 'text-zinc-300' : 'text-zinc-700'}>{f}</span>
                    </div>
                  ))}
                </div>
                <div className={`pt-10 border-t mt-auto ${idx === 1 ? 'border-zinc-800' : 'border-zinc-100'}`}>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${idx === 1 ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    Starting at <span className={`text-2xl font-black ml-2 ${idx === 1 ? 'text-white' : 'text-zinc-900'}`}>${service.price.car || service.price.rv || service.price.suv}</span>
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <Button className={`h-14 rounded-xl font-black uppercase tracking-widest text-xs ${idx === 1 ? 'bg-white text-zinc-900 hover:bg-zinc-200' : 'bg-zinc-900 hover:bg-zinc-800'}`} asChild>
                      <Link to="/book" className="flex items-center gap-2">Book Now <ArrowUpRight className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" className={`h-12 text-[10px] font-black uppercase tracking-widest transition-colors ${idx === 1 ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`} asChild>
                      <Link to={`/services/${service.id}`}>Detailed Scope</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After Section */}
      <section className="py-32 bg-zinc-900 text-white overflow-hidden relative border-t border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Visual Proof</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none uppercase">
              The <span className="text-emerald-400 italic font-normal">Transformation</span> Results.
            </h2>
            <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Hover or slide to see the actual results of our premium paint correction and deep interior restoration services. Real Bellevue and Omaha client vehicles.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {BEFORE_AFTERS.map((t) => (
              <div key={t.id} className="space-y-4">
                <div className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative">
                  <BeforeAfterSlider beforeImage={t.before} afterImage={t.after} />
                </div>
                <div className="text-center">
                  <h4 className="font-black text-white text-lg tracking-tight">{t.label}</h4>
                  <p className="text-sm text-zinc-400 mt-1">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Me Section */}
      <section className="py-32 bg-zinc-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(52,211,153,0.05),transparent)] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">My Methodology</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none uppercase">
                   Meticulous <span className="text-zinc-500 italic block font-normal normal-case">Preservation.</span>
                </h2>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-xl">
                  Bryan's Detailing isn't a quick wash. I focus on technical precision and heavy chemical decontamination to ensure every vehicle leaves with a durable, high-gloss finish.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                       <ShieldCheck className="h-6 w-6 text-emerald-400" />
                    </div>
                    <h4 className="text-xl font-bold">Flexible Options</h4>
                    <p className="text-sm text-zinc-500 leading-relaxed font-medium">I offer both fully mobile detailing at your location, and convenient drop-off at my home location in Bellevue.</p>
                 </div>
                 <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                       <Sparkles className="h-6 w-6 text-emerald-400" />
                    </div>
                    <h4 className="text-xl font-bold">Industrial Grade</h4>
                    <p className="text-sm text-zinc-500 leading-relaxed font-medium">I use pH-balanced chemicals and ceramic polymers that outlive standard wax by months.</p>
                 </div>
              </div>

              <div className="pt-8">
                <Button size="lg" className="h-16 px-12 rounded-2xl bg-white text-zinc-950 font-black uppercase tracking-widest text-xs hover:bg-zinc-200" asChild>
                  <Link to="/services">Explore My Standards</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] relative z-10 border border-white/10 group">
                <img 
                  src="/interior-detailing.png" 
                  alt="Precision detailing work" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              
              <div className="absolute -bottom-10 -right-10 bg-white p-10 rounded-[2.5rem] shadow-2xl z-20 border border-zinc-100 text-zinc-950 group">
                <div className="flex items-center gap-6">
                  <div className="text-6xl font-black tracking-tighter">10+</div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 leading-tight">
                    Years of Solo<br />Excellence in<br />Midwest NE
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6 mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">Social Proof</span>
            <h2 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tight leading-none uppercase">
               The <span className="text-emerald-500 italic font-medium tracking-tight normal-case">Verified</span> Verdict.
            </h2>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* Comprehensive SEO Content Section */}
      <section className="py-32 bg-white overflow-hidden border-t border-zinc-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-6 block">Professional Auto Detailing Bellevue & Omaha</span>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-8">
              Why Choose Bryan's Showroom Quality Detailing?
            </h2>
            <div className="prose prose-lg prose-zinc max-w-none space-y-6 text-zinc-600 font-medium">
              <p>
                When it comes to <strong>auto detailing in Bellevue and Omaha</strong>, you need a professional who understands the science behind paint preservation and interior restoration. Bryan's Showroom Quality Detailing goes beyond the standard car wash. We provide meticulous, multi-stage detailing services designed to protect your investment and restore your vehicle to its factory-fresh condition.
              </p>
              <h3 className="text-2xl font-bold text-zinc-900 mt-12 mb-4">Advanced Ceramic Coating and Paint Correction</h3>
              <p>
                The Midwest weather can be brutal on your vehicle's clear coat. Our specialized <strong>ceramic coating</strong> applications create a semi-permanent bond with your car's paint, offering years of protection against UV rays, road salt, bird droppings, and chemical stains. Before applying any protective layer, we perform rigorous <strong>paint correction</strong> to remove swirl marks, light scratches, and oxidation. This ensures the surface is absolutely flawless, sealing in a mirror-like gloss that outlasts traditional carnauba wax by magnitudes.
              </p>
              <h3 className="text-2xl font-bold text-zinc-900 mt-12 mb-4">Deep Interior Detailing and Odor Removal</h3>
              <p>
                A clean interior is essential for a comfortable driving experience. Our <strong>interior detailing</strong> services tackle everything from pet hair and tough carpet stains to embedded odors. We utilize hot water extraction, steam cleaning, and pH-balanced cleaners to sanitize every surface, crevice, and fabric in your vehicle. Whether it's reviving leather seats or resetting a heavily soiled family SUV, our goal is to achieve true showroom quality.
              </p>
              <h3 className="text-2xl font-bold text-zinc-900 mt-12 mb-4">Flexible Mobile & Drop-Off Options</h3>
              <p>
                We understand your time is valuable. That's why we offer convenient drop-off at my home location in Bellevue for intensive work like ceramic coatings, as well as <strong>mobile auto detailing</strong> throughout the Omaha metro area. Whether you are in Papillion, La Vista, Elkhorn, or Council Bluffs, we can bring the ultimate detailing experience directly to your driveway or workplace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Area Grid */}
      <section className="py-32 bg-zinc-50 border-t border-zinc-200">
         <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6 mb-16 text-center">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">Local Operations</span>
               <h2 className="text-5xl md:text-6xl font-black text-zinc-900 tracking-tight leading-none uppercase">
                  Service <span className="text-emerald-500 italic font-medium tracking-tight normal-case">Radius.</span>
               </h2>
               <p className="text-lg text-zinc-600 max-w-2xl mx-auto font-medium">Located in Bellevue for convenient drop-offs, and serving the entire Omaha metro with mobile options.</p>
            </div>
            <ServiceMap />
         </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-zinc-50 overflow-hidden border-t border-zinc-200">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="text-center space-y-6 mb-16">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Common Questions</span>
             <h2 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tight leading-none uppercase">
                Trust The <span className="text-emerald-500 italic font-medium tracking-tight normal-case">Process.</span>
             </h2>
           </div>
           
           <div className="space-y-4">
              {[
                  { q: "How long does a Full Detail take?", a: "Typically 4-6 hours. It depends on vehicle size and soil level. I prefer to not rush, ensuring every crack and crevice meets the showroom standard." },
                  { q: "Do you come to me or do I drop it off?", a: "Both! I offer convenient drop-off at my home location in Bellevue, which is great for intensive work like Paint Correction and Ceramic Coatings. I also offer fully mobile services where I bring the professional equipment directly to your driveway." },
                  { q: "What's the difference between Wax and Ceramic Coating?", a: "Wax lasts 1-3 months and sits on top of the paint as a temporary sacrificial layer. Ceramic coatings chemically bond to the clear coat, lasting years, repelling dirt, and making washing significantly easier." },
                  { q: "Can you guarantee the removal of all interior stains?", a: "I utilize hot water extraction and professional stain lifters that remove 95% of standard stains. Some materials permanently alter or dye, but I guarantee I will achieve the absolute best result technically possible." },
              ].map((faq, i) => (
                 <div key={i} className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm transition-all hover:shadow-md">
                    <h4 className="text-lg font-black text-zinc-900 mb-3">{faq.q}</h4>
                    <p className="text-zinc-500 font-medium leading-relaxed">{faq.a}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-zinc-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
           <img src="/methodology-workspace.png" className="w-full h-full object-cover" alt="Detailing background" loading="lazy" />
        </div>
        <div className="container mx-auto px-4 max-w-4xl relative z-10 space-y-12">
          <div className="space-y-6">
             <h2 className="text-5xl md:text-[5rem] font-black tracking-tighter leading-none uppercase">Ready for <span className="text-zinc-500 italic block font-normal normal-case">Showroom</span> Quality?</h2>
             <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto">
               Secure your appointment instantly. I professionalize the scheduling experience, ensuring your vehicle receives the dedicated time it deserves.
             </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
            <Button size="lg" className="h-16 px-12 bg-white text-zinc-950 hover:bg-zinc-200 rounded-2xl font-black uppercase tracking-widest text-xs" asChild>
              <Link to="/book">Secure My Spot</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-12 border-zinc-700 text-white hover:bg-zinc-800 rounded-2xl font-black uppercase tracking-widest text-xs" asChild>
              <a href="tel:712-305-6313" className="flex items-center gap-3">
                 Call (712) 305-6313
              </a>
            </Button>
          </div>
           <p className="text-zinc-600 text-xs font-bold tracking-[0.3em] uppercase">Bellevue | Omaha | Papillion | La Vista</p>
        </div>
      </section>
    </div>
  );
}

const ArrowUpRight = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);
