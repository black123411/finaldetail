import { motion } from "motion/react";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

export default function Hero({ onStartQuiz, onStartScan }: { onStartQuiz: () => void, onStartScan: () => void }) {
  return (
    <section className="relative pt-40 pb-20 overflow-hidden px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-radial-[at_50%_0%] from-brand-gold/40 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-semibold uppercase tracking-widest mb-8">
            <Sparkles size={14} /> Based in Bellevue, Nebraska
          </span>
          <h1 className="sr-only">Showroom Quality Mobile Auto Detailing & Ceramic Coating in Omaha and Bellevue, NE</h1>
          <div className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-[0.9]">
            I DON'T JUST CLEAN.<br />
            <span className="text-brand-gold italic font-light">I RESTORE.</span>
          </div>
          <p className="max-w-2xl mx-auto text-white/50 text-lg md:text-xl font-light mb-12">
            Real skill. Real results. I provide premium restoration and long-term protection for car owners who value perfection. No "assembly line" cleanings here.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStartScan}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 group"
            >
              <Zap size={18} fill="currentColor" />
              AI SURFACE SCAN
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={onStartQuiz}
              className="btn-secondary w-full sm:w-auto"
            >
              USE SMART ESTIMATOR
            </button>
          </div>
        </motion.div>
      </div>

      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto border-y border-white/5 py-12">
        {[
          { label: "Operation", value: "Solo Driven" },
          { label: "Focus", value: "Restoration" },
          { label: "Protection", value: "Ceramic Pro" },
          { label: "Service Area", value: "Greater Omaha" }
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">{stat.label}</p>
            <p className="text-lg font-medium">{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
