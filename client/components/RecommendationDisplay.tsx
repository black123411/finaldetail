import { motion } from "motion/react";
import { RecommendationResult } from '@/shared/types';
import { SQUARE_BOOKING_URL } from "../constants";
import { CheckCircle2, ShieldCheck, Zap, ArrowRight, AlertTriangle } from "lucide-react";

export default function RecommendationDisplay({ result, onReset }: { result: RecommendationResult, onReset: () => void }) {
  const depositAmount = 50;

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl overflow-hidden"
      >
        <div className="bg-brand-gold p-8 text-brand-charcoal">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={20} fill="currentColor" />
            <span className="text-xs font-bold uppercase tracking-widest">Recommended Integration</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none mb-4">
            {result.service.name}
          </h2>
          {result.service.reasoning && (
            <p className="text-brand-charcoal/80 text-sm max-w-xl leading-relaxed font-medium">
              <span className="font-bold">AI Analysis:</span> {result.service.reasoning}
            </p>
          )}
        </div>

        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <div className="mb-8">
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Vehicle Condition</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xl font-bold ${
                    result.condition === "Severe" ? "text-red-500" : 
                    result.condition === "Moderate" ? "text-orange-500" : 
                    "text-green-500"
                  }`}>
                    {result.condition}
                  </span>
                  <span className="text-white/20">|</span>
                  <span className="text-white/40 text-sm flex items-center gap-2">
                    Identified by AI
                    {result.confidence && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-bold">
                        {Math.round(result.confidence * 100)}% Match
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {result.visibleIssues && result.visibleIssues.length > 0 && (
                <div className="mb-8">
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Visible Issues</p>
                  <ul className="space-y-2">
                    {result.visibleIssues.map((issue, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                        <CheckCircle2 size={14} className="text-brand-gold" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-start gap-3">
                <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                <p className="text-xs font-medium leading-relaxed">
                  A ${depositAmount} non-refundable deposit is required to secure your appointment. This will be applied to your final total.
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div className="glass p-6 rounded-2xl mb-8">
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2 text-center">Estimated Price Range</p>
                <p className="text-5xl font-bold text-center tracking-tight">
                  ${result.service.priceRange.min}—${result.service.priceRange.max}
                </p>
                <p className="text-[10px] text-white/20 mt-4 text-center">Final price determined by vehicle size and complexity.</p>
              </div>

              <div className="space-y-4">
                <a 
                  href={`${SQUARE_BOOKING_URL}?serviceId=${result.service.squareServiceId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-2 py-5 text-lg group"
                >
                  BOOK THIS SERVICE
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <button 
                  onClick={onReset}
                  className="w-full text-white/40 text-xs font-bold uppercase tracking-widest hover:text-brand-gold transition-colors"
                >
                  Disagree with AI? Manual Override
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-12 flex items-center justify-center gap-8">
        <div className="flex items-center gap-2 text-white/30">
          <ShieldCheck size={18} />
          <span className="text-[10px] uppercase tracking-widest font-bold">Licensed & Insured</span>
        </div>
        <div className="flex items-center gap-2 text-white/30">
          <CheckCircle2 size={18} />
          <span className="text-[10px] uppercase tracking-widest font-bold">Showroom Standard</span>
        </div>
      </div>
    </div>
  );
}
