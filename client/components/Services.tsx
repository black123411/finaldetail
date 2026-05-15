import { motion } from "motion/react";
import { SERVICES, SQUARE_BOOKING_URL } from "../constants";
import { Check, ArrowRight } from "lucide-react";

export default function Services() {
  const categories = ["Interior", "Exterior", "Paint", "Ceramic"];
  
  return (
    <section id="services" className="py-24 px-6 bg-brand-slate/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <span className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Catalog</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight italic">THE MENU.</h2>
          </div>
          <p className="max-w-md text-white/40 text-sm">
            From basic upkeep to full multi-stage restoration. I offer tiered pricing based on vehicle size and condition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.filter(s => s.category !== "Maintenance" && s.category !== "Package").map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`glass p-8 rounded-2xl flex flex-col justify-between group transition-all hover:border-brand-gold/40 ${service.popular ? 'border-brand-gold/20' : ''}`}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] text-white/30 uppercase tracking-wider bg-white/5 px-2 py-1 rounded">
                    {service.category}
                  </span>
                  {service.popular && (
                    <span className="text-[10px] text-brand-charcoal bg-brand-gold px-2 py-1 rounded font-bold uppercase tracking-wider">
                      Most Popular
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-4">{service.name}</h3>
                <p className="text-white/40 text-sm mb-8 leading-relaxed">
                  {service.description}
                </p>
              </div>
              
              <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-white/30 tracking-widest mb-1">Starts At</p>
                  <p className="text-2xl font-bold text-brand-gold">${service.priceMin}</p>
                </div>
                <a 
                  href={SQUARE_BOOKING_URL} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-charcoal transition-all"
                >
                  <ArrowRight size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
