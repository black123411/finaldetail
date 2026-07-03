import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronRight, ArrowLeft, Sparkles, Car, Shield, Droplets, Wind, Trash2, Zap, User, Users, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { BOOKING_LINK } from '../lib/constants';

const QUESTIONS = [
  {
    id: 'vehicle_type',
    question: "What type of vehicle do I need to transform?",
    options: [
      { id: 'car', label: 'Sedan / Coupe', icon: <Car className="h-5 w-5" /> },
      { id: 'suv', label: 'Small SUV / Crossover', icon: <Users className="h-5 w-5" /> },
      { id: 'truck', label: 'Truck / Large SUV', icon: <Users className="h-5 w-5" /> },
      { id: 'largeSuv', label: 'XL Vehicle / Van', icon: <Users className="h-5 w-5" /> },
      { id: 'rv', label: 'RV / Motorhome / Boat', icon: <Shield className="h-5 w-5" /> },
    ]
  },
  {
    id: 'exterior_condition',
    question: "How would you describe the exterior paint condition?",
    options: [
      { id: 'clean', label: 'Mostly Clean (Light dust only)', icon: <CheckCircle2 className="h-5 w-5" />, weight: 1 },
      { id: 'dirty', label: 'Average (Road grime, bugs)', icon: <Droplets className="h-5 w-5" />, weight: 2 },
      { id: 'rough', label: 'Rough (Swirls, scratches, gritty)', icon: <Wind className="h-5 w-5" />, weight: 3 },
      { id: 'neglected', label: 'Severe (Oxidation, heavy damage)', icon: <Trash2 className="h-5 w-5" />, weight: 5 },
    ]
  },
  {
    id: 'interior_condition',
    question: "What's the current state of the interior?",
    options: [
      { id: 'pristine', label: 'Pristine (Like new)', icon: <Sparkles className="h-5 w-5" />, weight: 1 },
      { id: 'moderate', label: 'Moderate (Crumbs, light dust)', icon: <User className="h-5 w-5" />, weight: 2 },
      { id: 'messy', label: 'Messy (Pet hair, stains, spills)', icon: <Users className="h-5 w-5" />, weight: 3 },
      { id: 'severe', label: 'Severe (Odors, mold, heavy neglect)', icon: <Trash2 className="h-5 w-5" />, weight: 5 },
    ]
  },
  {
    id: 'primary_goal',
    question: "What is your primary goal for this service?",
    options: [
      { id: 'maintenance', label: 'Periodic Maintenance', icon: <Zap className="h-5 w-5" /> },
      { id: 'rejuvenate', label: 'Deep Refresh / Restoration', icon: <Sparkles className="h-5 w-5" /> },
      { id: 'protection', label: 'Extreme Protection & Gloss', icon: <Shield className="h-5 w-5" /> },
      { id: 'selling', label: 'Maximize Value for Sale', icon: <CheckCircle2 className="h-5 w-5" /> },
    ]
  }
];

export default function DetailingQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { id: string, weight?: number }>>({});
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (questionId: string, optionId: string, weight?: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: { id: optionId, weight } }));
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setIsFinished(true);
    }
  };

  const getRecommendation = () => {
    const vehicleType = answers['vehicle_type']?.id || 'car';
    const exteriorWeight = answers['exterior_condition']?.weight || 1;
    const interiorWeight = answers['interior_condition']?.weight || 1;
    const goal = answers['primary_goal']?.id;

    // Specialty handling
    if (vehicleType === 'rv') {
      return {
        title: "Specialty Restoration",
        desc: "RVs and Boats require specialized industrial-grade decontamination and gelcoat protection to combat oxidation.",
        package: "RV & Boat Wash & Wax",
        id: "rv-boat-wash-wax",
        priceRange: "$299+",
        highTicket: true
      };
    }

    // Logic Tree
    if (goal === 'protection' || exteriorWeight >= 3) {
      return {
        title: "Extreme Protection Armor",
        desc: "To achieve permanent gloss and protection, I recommend my Ceramic Coating package paired with precision paint correction.",
        package: "3-Year Ceramic Coating",
        id: "ceramic-3yr",
        priceRange: "$599 - $849",
        highTicket: true
      };
    }

    if (goal === 'selling' || interiorWeight >= 3 || exteriorWeight === 2) {
      return {
        title: "The Showroom Reset",
        desc: "Your vehicle needs a deep technical decontamination and interior restoration to bring back that new-car feeling.",
        package: "Showroom Package",
        id: "showroom-package",
        priceRange: "$399 - $549",
        highTicket: false
      };
    }

    if (goal === 'maintenance' && interiorWeight <= 2 && exteriorWeight <= 2) {
      return {
        title: "Maintenance Advantage",
        desc: "Your vehicle is well-maintained! Keep it that way with my premium maintenance plan to prevent long-term wear.",
        package: "Maintenance Detail",
        id: "maintenance-detail",
        priceRange: "$89 - $149",
        highTicket: false
      };
    }

    return {
      title: "Signature Full Detail",
      desc: "A thorough seasonal reset to remove light grime, deep clean the interior, and protect your investment.",
      package: "Signature Full Detail",
      id: "full-detail-package",
      priceRange: "$229 - $329",
      highTicket: false
    };
  };

  const recommendation = getRecommendation();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-[3rem] shadow-xl border border-zinc-100 overflow-hidden">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-10"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">Restoration AI Quiz</span>
                </div>
                <div className="h-1 flex-grow mx-8 bg-zinc-100 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-zinc-900"
                        initial={{ width: 0 }}
                        animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                    />
                </div>
              </div>

              <h2 className="text-3xl font-black text-zinc-900 mb-10 italic tracking-tight">{QUESTIONS[step].question}</h2>

              <div className="grid gap-3">
                {QUESTIONS[step].options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(QUESTIONS[step].id, opt.id, opt.weight)}
                    className="flex items-center justify-between p-4 rounded-2xl border-2 border-zinc-100 hover:border-zinc-900 hover:bg-zinc-50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                        {opt.icon}
                      </div>
                      <span className="font-bold text-zinc-900">{opt.label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-zinc-900" />
                  </button>
                ))}
              </div>

              {step > 0 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="mt-8 flex items-center text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors py-3 pr-4 -ml-3 pl-3 rounded-xl hover:bg-zinc-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Sparkles className="h-10 w-10 text-emerald-600" />
              </div>

              <h2 className="text-3xl font-black text-zinc-900 mb-2">{recommendation.title}</h2>
              <p className="text-zinc-600 mb-8 max-w-sm mx-auto leading-relaxed">
                {recommendation.desc}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Recommended Package</p>
                  <p className="text-lg font-black text-zinc-900 leading-tight">{recommendation.package}</p>
                </div>
                <div className="bg-zinc-900 p-6 rounded-3xl text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Estimated Range</p>
                  <p className="text-2xl font-black">{recommendation.priceRange}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button className="w-full h-16 text-lg font-bold shadow-xl shadow-emerald-100 bg-zinc-900 hover:bg-zinc-800" asChild>
                  <Link to={`/book?serviceId=${recommendation.id}`}>
                    Secure This Estimate Now
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full h-12 text-zinc-500" onClick={() => {
                  setStep(0);
                  setAnswers({});
                  setIsFinished(false);
                }}>
                  Retake Quiz
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
