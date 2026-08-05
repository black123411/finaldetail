import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplets, Zap, Shield, ChevronRight, Calendar, AlertCircle, Sparkles, Info, Loader2, CheckCircle2, Send, Camera } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { SERVICES, VEHICLE_SIZES, SPECIALTY_SIZES, ADD_ONS, type VehicleSize } from '@/shared/data/services';
import { QuoteAPI } from '../services/api';
import { trackEvent } from '../lib/analytics';

export default function Quote() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Core Quote State
  const [vehicleSize, setVehicleSize] = useState<VehicleSize | ''>('');
  const [vehicleYear, setVehicleYear] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [condition, setCondition] = useState<string>('good');
  const [redFlags, setRedFlags] = useState({ petHair: false, odor: false, biohazard: false });

  // Step-based Wizard State
  const [step, setStep] = useState(1);
  const [contactInfo, setContactInfo] = useState({ name: '', phone: '', email: '' });
  const [expectation, setExpectation] = useState('value');

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleRedFlag = (key: keyof typeof redFlags) => {
    setRedFlags(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateEstimate = () => {
    if (!vehicleSize || selectedServices.length === 0) return { min: 0, max: 0, anchor: 0 };
    
    let base = 0;
    selectedServices.forEach(id => {
      const service = SERVICES.find(s => s.id === id);
      if (service) {
        let servicePrice = (service.price as any)[vehicleSize] || Object.values(service.price)[0] || 0;
        
        // Handle variable pricing (e.g. per foot)
        if (service.pricingType === 'variable') {
           // Default to 25ft for RV/Boat estimates if not specified
           servicePrice = servicePrice * 25;
        }
        
        base += servicePrice;
      }
    });

    let addOnTotal = 0;
    selectedAddOns.forEach(id => {
      const addOn = ADD_ONS.find(a => a.id === id);
      if (addOn) addOnTotal += addOn.price;
    });

    const subtotal = base + addOnTotal;

    return {
      min: Math.floor(subtotal),
      max: Math.ceil(subtotal * 1.2),
      anchor: Math.round(subtotal * 1.1)
    };
  };

  const { min, max, anchor } = calculateEstimate();

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', contactInfo.name);
    formData.append('phone', contactInfo.phone);
    formData.append('email', contactInfo.email);
    formData.append('vehicleSize', vehicleSize);
    formData.append('vehicleYear', vehicleYear);
    formData.append('condition', condition);
    formData.append('expectation', expectation);
    formData.append('services', JSON.stringify(selectedServices));
    formData.append('addons', JSON.stringify(selectedAddOns));
    formData.append('redFlags', JSON.stringify(redFlags));
    formData.append('estimatedRange', `${min}-${max}`);

    try {
      const data = await QuoteAPI.submitQuote(formData);

      if (data.success) {
        trackEvent('generate_lead', {
          form_name: 'quote',
          selected_service_count: selectedServices.length,
          vehicle_size: vehicleSize,
          estimate: anchor
        });

        setSubmitted(true);
      } else {
        throw new Error(data.error || 'Failed to submit quote request');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-50 py-24 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-zinc-900 p-8 md:p-12 rounded-[3.5rem] text-center max-w-2xl mx-4 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8">
            <Sparkles className="h-32 w-32 text-emerald-500/10 -mr-16 -mt-16" />
          </div>

          <div className="relative z-10">
            <div className="mx-auto w-24 h-24 bg-emerald-500 text-zinc-950 rounded-[2rem] flex items-center justify-center mb-8 rotate-3 shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="h-12 w-12" />
            </div>

            <h2 className="text-4xl font-black text-white italic tracking-tighter mb-4">Quote Request Received</h2>
            <p className="text-zinc-400 mb-8 leading-relaxed max-w-md mx-auto">
              Your preliminary range is <strong className="text-white">${min} - ${max}</strong>. The request is saved in Square for Bryan to review and follow up with the recommended service and final price.
            </p>
            <Button asChild variant="outline" className="mb-4 h-14 w-full border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white">
              <a href="sms:+17123056313?body=Hi%20Bryan%2C%20I%20just%20submitted%20a%20website%20quote.%20Here%20are%20photos%20of%20my%20vehicle%3A">
                <Camera className="mr-2 h-5 w-5" /> Text Vehicle Photos
              </a>
            </Button>
            <Button asChild className="w-full h-16 text-xl font-bold bg-white text-zinc-950 shadow-xl shadow-zinc-800/40">
              <Link to="/book">View Online Availability</Link>
            </Button>

            <Button variant="ghost" asChild className="text-zinc-500 hover:text-white mt-8">
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-24 font-sans">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Wizard */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">
                <Sparkles className="h-3 w-3" />
                <span>Personalized Detailing Quote</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900">
                Transparent <span className="text-zinc-400 italic">Results.</span>
              </h1>
              <div className="flex items-center gap-4 py-4">
                  {[1, 2, 3, 4].map(s => (
                      <div key={s} className="flex flex-col gap-2 flex-grow">
                          <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'bg-zinc-900' : 'bg-zinc-200'}`} />
                          <span className={`text-[8px] font-black uppercase tracking-widest ${step >= s ? 'text-zinc-900' : 'text-zinc-400'}`}>
                              {s === 1 ? 'Vehicle' : s === 2 ? 'Services' : s === 3 ? 'Contact' : 'Review'}
                          </span>
                      </div>
                  ))}
              </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl border border-zinc-100 p-8 md:p-12 min-h-[500px] flex flex-col">
              <AnimatePresence mode="wait">
                {step === 3 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-10"
                    >
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black tracking-tighter italic">Who am I working with?</h2>
                            <p className="text-zinc-500 font-medium">Bryan will use these details only to follow up about your quote request.</p>
                        </div>
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <label htmlFor="quote-full-name" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 pl-2">Full Name</label>
                                <input 
                                    id="quote-full-name"
                                    type="text" 
                                    placeholder="e.g. John Wick"
                                    value={contactInfo.name}
                                    onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                                    className="w-full p-6 rounded-2xl bg-zinc-50 border-2 border-zinc-50 focus:bg-white focus:border-zinc-900 outline-none transition-all font-bold text-lg" 
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="quote-phone" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 pl-2">Mobile Number</label>
                                    <input 
                                        id="quote-phone"
                                        type="tel" 
                                        placeholder="(712) 305-6313"
                                        value={contactInfo.phone}
                                        onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                                        className="w-full p-6 rounded-2xl bg-zinc-50 border-2 border-zinc-50 focus:bg-white focus:border-zinc-900 outline-none transition-all font-bold text-lg" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="quote-email" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 pl-2">Email Address</label>
                                    <input 
                                        id="quote-email"
                                        type="email" 
                                        placeholder="your@email.com"
                                        value={contactInfo.email}
                                        onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                                        className="w-full p-6 rounded-2xl bg-zinc-50 border-2 border-zinc-50 focus:bg-white focus:border-zinc-900 outline-none transition-all font-bold text-lg" 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pt-6 flex gap-4">
                            <Button variant="ghost" className="h-20 px-8 rounded-2xl" onClick={handleBack}>Back</Button>
                            <Button className="flex-grow h-20 text-xl font-black rounded-2xl gap-2" onClick={handleNext} disabled={!contactInfo.name || !contactInfo.phone}>
                                Continue to Vehicle Details <ChevronRight className="h-6 w-6" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 1 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-10"
                    >
                         <div className="space-y-4">
                            <h2 className="text-4xl font-black tracking-tighter italic">Tell me about the car.</h2>
                            <p className="text-zinc-500 font-medium">Pricing is built on labor hours. Select the closest match for accuracy.</p>
                        </div>
                        
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 pl-1 italic">Vitals</label>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="quote-vehicle-year" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-2">Vehicle Year</label>
                                        <input 
                                            id="quote-vehicle-year"
                                            type="number" 
                                            placeholder="e.g. 2024"
                                            value={vehicleYear}
                                            onChange={(e) => setVehicleYear(e.target.value)}
                                            className="w-full p-4 rounded-xl bg-zinc-50 border-2 border-zinc-50 focus:bg-white focus:border-zinc-900 outline-none transition-all font-bold text-lg" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 pl-1 italic">1. Dimension Profile</label>
                                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                                {[...VEHICLE_SIZES, ...SPECIALTY_SIZES].map(size => (
                                    <button
                                    key={size.id}
                                    onClick={() => setVehicleSize(size.id as any)}
                                    className={`p-4 rounded-2xl border-2 transition-all text-center ${
                                        vehicleSize === size.id ? 'border-zinc-900 bg-zinc-900 text-white shadow-xl scale-105' : 'border-zinc-50 bg-zinc-50 text-zinc-400 hover:border-zinc-100'
                                    }`}
                                    >
                                        <div className="text-2xl mb-1">{size.icon}</div>
                                        <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{size.name}</p>
                                    </button>
                                ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 pl-1 italic">2. Surface History</label>
                                <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'excellent', label: 'Maintained', desc: 'No stains/light dust' },
                                    { id: 'good', label: 'Average', desc: 'Typical use / Dog hair' },
                                    { id: 'fair', label: 'Neglected', desc: 'Heavy dirt / Spills' },
                                    { id: 'poor', label: 'Restoration', desc: 'Mold / Odor / Bio' }
                                ].map(c => (
                                    <button
                                    key={c.id}
                                    onClick={() => setCondition(c.id)}
                                    className={`p-5 rounded-2xl border-2 transition-all text-left ${
                                        condition === c.id ? 'border-zinc-900 bg-zinc-900 text-white shadow-xl translate-x-1' : 'border-zinc-50 bg-zinc-50 text-zinc-400 hover:border-zinc-100'
                                    }`}
                                    >
                                        <p className="text-sm font-black italic">{c.label}</p>
                                        <p className={`text-[10px] mt-0.5 ${condition === c.id ? 'text-zinc-400' : 'text-zinc-400'}`}>{c.desc}</p>
                                    </button>
                                ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 pl-1 italic">3. Expectation Setting</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'efficiency', label: 'Budget/Speed', icon: <Zap className="h-4 w-4" /> },
                                        { id: 'value', label: 'Balance/Value', icon: <Droplets className="h-4 w-4" /> },
                                        { id: 'perfection', label: 'Highest gloss target', icon: <Sparkles className="h-4 w-4" /> }
                                    ].map(ex => (
                                        <button
                                            key={ex.id}
                                            onClick={() => setExpectation(ex.id)}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                                                expectation === ex.id ? 'border-emerald-500 bg-emerald-50/20 text-zinc-900 font-black' : 'border-zinc-50 text-zinc-400'
                                            }`}
                                        >
                                            {ex.icon}
                                            <span className="text-[10px] font-black uppercase text-center tracking-tighter">{ex.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 pl-1 italic">4. Vehicle Photos (Optional)</label>
                                <p className="text-xs text-zinc-500 font-medium pl-1">Submit the quote first, then text photos directly to Bryan so they arrive with full image quality.</p>
                                <Button asChild variant="outline" className="h-14 w-full rounded-2xl border-zinc-200 font-bold">
                                    <a href="sms:+17123056313?body=Hi%20Bryan%2C%20I%27m%20working%20on%20a%20website%20quote.%20Here%20are%20photos%20of%20my%20vehicle%3A">
                                        <Camera className="mr-2 h-5 w-5" /> Text Photos to Bryan
                                    </a>
                                </Button>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 mt-auto">
                            <Button className="flex-grow h-16 text-lg font-black rounded-2xl gap-2" onClick={handleNext} disabled={!vehicleSize}>
                                Analyze Labor Requirements <ChevronRight className="h-6 w-6" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                     <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-10"
                    >
                         <div className="space-y-4">
                            <h2 className="text-4xl font-black tracking-tighter italic">Select Restoration Path.</h2>
                            <p className="text-zinc-500 font-medium">Which package builds the result you're looking for?</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {SERVICES.filter(s => 
                             s.highlight || 
                             ['full-detailing', 'paint-correction', 'rv-boat-detailing', 'tractor-detailing'].includes(s.categoryId)
                           ).map(service => (
                                <button
                                    key={service.id}
                                    onClick={() => toggleService(service.id)}
                                    className={`relative p-8 rounded-[2rem] border-2 text-left transition-all ${
                                        selectedServices.includes(service.id)
                                        ? 'border-zinc-900 bg-zinc-950 text-white shadow-2xl scale-[1.03] z-10'
                                        : 'border-zinc-50 hover:border-zinc-200'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-black italic tracking-tighter leading-none">{service.name}</h4>
                                            <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedServices.includes(service.id) ? 'text-zinc-500' : 'text-zinc-400'}`}>Est. {typeof service.duration === "string" ? service.duration : `${service.duration.car || service.duration.rv || Object.values(service.duration)[0]} (varies)`}</p>
                                        </div>
                                        {selectedServices.includes(service.id) && <div className="p-1 bg-emerald-500 rounded-full"><CheckCircle2 className="h-4 w-4 text-zinc-950" /></div>}
                                    </div>
                                    <p className={`text-xs leading-relaxed mb-6 ${selectedServices.includes(service.id) ? 'text-zinc-400' : 'text-zinc-500'}`}>{service.shortDescription}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{service.pricingType === 'variable' ? 'Starting at' : 'Investment'}</span>
                                            <span className={`text-2xl font-black ${selectedServices.includes(service.id) ? 'text-white' : 'text-zinc-900'}`}>
                                                ${(service.price as any)[vehicleSize || 'car']}
                                                {service.pricingType === 'variable' && <span className="text-xs ml-1">/ft</span>}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                           ))}
                        </div>

                         <div className="flex gap-4 pt-4 mt-auto">
                            <Button variant="ghost" className="h-16 px-8 rounded-2xl" onClick={handleBack}>Back</Button>
                            <Button className="flex-grow h-16 text-lg font-black rounded-2xl gap-2" onClick={handleNext} disabled={selectedServices.length === 0}>
                                Review & Lock-In Range <ChevronRight className="h-6 w-6" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-10"
                    >
                         <div className="space-y-4">
                            <h2 className="text-4xl font-black tracking-tighter italic">Ready to finalize?</h2>
                            <p className="text-zinc-500 font-medium">Review your selection before sending it to Bryan.</p>
                        </div>

                        <div className="bg-zinc-50 rounded-[2rem] p-8 border border-zinc-100 flex flex-col gap-6">
                            <div className="flex justify-between items-end pb-6 border-b border-zinc-200">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Your Est. Range</p>
                                    <p className="text-5xl font-black italic italic tracking-tighter">${min} - ${max}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Anchor Price</p>
                                    <p className="text-2xl font-black text-emerald-600 italic">${anchor}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">Disclosures (Select if applicable)</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {[
                                            { id: 'petHair', label: 'Pet Hair' },
                                            { id: 'odor', label: 'Odor/Smoke' },
                                            { id: 'biohazard', label: 'Biohazard' }
                                        ].map(f => (
                                            <button 
                                                key={f.id}
                                                onClick={() => toggleRedFlag(f.id as any)}
                                                className={`p-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    redFlags[f.id as keyof typeof redFlags] ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-white bg-white text-zinc-400'
                                                }`}
                                            >
                                                {f.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3 bg-zinc-900 text-white p-6 rounded-[2rem] shadow-xl">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-zinc-950 font-black shrink-0">?</div>
                                <p className="text-sm font-medium leading-relaxed italic">
                                    "I've built this estimate around <span className="text-emerald-400 font-bold">{expectation}</span>. Ready to lock this in and see my availability?"
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button variant="ghost" className="h-20 px-10 rounded-2xl" onClick={handleBack}>Wait, Go Back</Button>
                                <Button className="flex-grow h-20 text-2xl font-black rounded-3xl gap-3 shadow-2xl shadow-zinc-200" onClick={() => handleSubmit()}>
                                    Yes, Lock In This Quote <ChevronRight className="h-8 w-8" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Side Info Cards */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
             <div className="bg-zinc-900 rounded-[3rem] p-8 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8">
                    <Shield className="h-32 w-32 text-zinc-800 -mr-16 -mt-16" />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <h3 className="text-2xl font-black italic leading-tight italic">Why condition details matter.</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                        Vehicle size, paint condition, stains, pet hair, odor, and oxidation all affect the right service and the final price. A short quote form helps Bryan recommend the correct interior detail, paint correction, ceramic coating, or specialty detail without guessing.
                    </p>
                    <div className="space-y-3 pt-6 border-t border-zinc-800">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Bellevue and Omaha Detailing</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Clear Service Recommendations</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Paint Correction Certified</span>
                        </div>
                    </div>
                  </div>
              </div>

          </div>
        </div>
      </div>
    </div>
  );
}
