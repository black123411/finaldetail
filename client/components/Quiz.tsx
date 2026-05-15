import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VehicleType, QuizState } from '@/shared/types';
import { Check, ArrowRight, ArrowLeft } from "lucide-react";

const STEPS = [
  "Vehicle Type",
  "Interior State",
  "Exterior State",
  "Focus Points",
  "Service Goal"
];

const VEHICLE_TYPES = [
  { value: VehicleType.Car, label: "Sedan / Coupe", icon: "🚗" },
  { value: VehicleType.SUV, label: "Medium SUV", icon: "🚙" },
  { value: VehicleType.Truck, label: "Truck / Van", icon: "🛻" },
  { value: VehicleType.LargeSUV, label: "Large SUV / 3-Row", icon: "🚐" }
];

const CONDITIONS = [
  { value: 1, label: "Clean / Well Maintained", desc: "Just needs some love." },
  { value: 2, label: "Normal Use", desc: "Standard daily dirt." },
  { value: 3, label: "Dirty / Neglected", desc: "Noticeable stains or buildup." },
  { value: 4, label: "Rough / Heavy Soil", desc: "Deep cleaning required." }
];

const PROBLEM_AREAS = [
  "Pet hair", "Stains", "Odor", "Bugs / tar", "Water spots", "Oxidation"
];

const GOALS = [
  "Basic cleanup", "Improve appearance", "Full restoration", "Long-term protection"
];

export default function Quiz({ onComplete, onCancel }: { onComplete: (state: QuizState) => void, onCancel: () => void }) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<QuizState>({
    vehicleType: VehicleType.Car,
    interiorCondition: 2,
    exteriorCondition: 2,
    problemAreas: [],
    goal: "Improve appearance"
  });

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else onComplete(state);
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
    else onCancel();
  };

  const toggleProblemArea = (area: string) => {
    setState(s => ({
      ...s,
      problemAreas: s.problemAreas.includes(area)
        ? s.problemAreas.filter(a => a !== area)
        : [...s.problemAreas, area]
    }));
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-bold">Step {step + 1} of {STEPS.length}</span>
          <span className="text-sm font-medium text-white/40">{STEPS[step]}</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-brand-gold"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-[400px]"
        >
          {step === 0 && (
            <div className="grid grid-cols-2 gap-4">
              {VEHICLE_TYPES.map((v) => (
                <button
                  key={v.value}
                  onClick={() => { setState({ ...state, vehicleType: v.value }); next(); }}
                  className={`p-8 rounded-xl border flex flex-col items-center gap-4 transition-all ${state.vehicleType === v.value ? 'bg-brand-gold/10 border-brand-gold' : 'bg-brand-slate border-white/5 hover:border-white/20'}`}
                >
                  <span className="text-4xl">{v.icon}</span>
                  <span className="font-medium text-sm">{v.label}</span>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-6">How's the interior?</h3>
              {CONDITIONS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setState({ ...state, interiorCondition: c.value })}
                  className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${state.interiorCondition === c.value ? 'bg-brand-gold/10 border-brand-gold' : 'bg-brand-slate border-white/5 hover:border-white/20'}`}
                >
                  <div>
                    <p className="font-medium">{c.label}</p>
                    <p className="text-xs text-white/40">{c.desc}</p>
                  </div>
                  {state.interiorCondition === c.value && <div className="w-5 h-5 rounded-full bg-brand-gold flex items-center justify-center"><Check size={12} className="text-brand-charcoal" /></div>}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-6">How's the exterior?</h3>
              {CONDITIONS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setState({ ...state, exteriorCondition: c.value })}
                  className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${state.exteriorCondition === c.value ? 'bg-brand-gold/10 border-brand-gold' : 'bg-brand-slate border-white/5 hover:border-white/20'}`}
                >
                  <div>
                    <p className="font-medium">{c.label}</p>
                    <p className="text-xs text-white/40">{c.desc}</p>
                  </div>
                  {state.exteriorCondition === c.value && <div className="w-5 h-5 rounded-full bg-brand-gold flex items-center justify-center"><Check size={12} className="text-brand-charcoal" /></div>}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-6">Any specific problem areas?</h3>
              <div className="grid grid-cols-2 gap-4">
                {PROBLEM_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => toggleProblemArea(area)}
                    className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${state.problemAreas.includes(area) ? 'bg-brand-gold/10 border-brand-gold' : 'bg-brand-slate border-white/5 hover:border-white/20'}`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${state.problemAreas.includes(area) ? 'bg-brand-gold border-brand-gold' : 'border-white/20'}`}>
                      {state.problemAreas.includes(area) && <Check size={12} className="text-brand-charcoal" />}
                    </div>
                    <span className="text-sm font-medium">{area}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-6">What is your main goal?</h3>
              {GOALS.map((g) => (
                <button
                  key={g}
                  onClick={() => setState({ ...state, goal: g as any })}
                  className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${state.goal === g ? 'bg-brand-gold/10 border-brand-gold' : 'bg-brand-slate border-white/5 hover:border-white/20'}`}
                >
                  <span className="font-medium">{g}</span>
                  {state.goal === g && <div className="w-5 h-5 rounded-full bg-brand-gold flex items-center justify-center"><Check size={12} className="text-brand-charcoal" /></div>}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex items-center justify-between">
        <button onClick={back} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold">
          <ArrowLeft size={16} /> {step === 0 ? "Cancel" : "Back"}
        </button>
        <button onClick={next} className="btn-primary flex items-center gap-2 group">
          {step === STEPS.length - 1 ? "Get My Estimate" : "Next Step"}
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
