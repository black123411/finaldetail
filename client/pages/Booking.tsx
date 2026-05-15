import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  CheckCircle2, 
  Loader2,
  Phone,
  Mail,
  User,
  Info,
  CreditCard as CardIcon,
  Star
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { VEHICLE_SIZES, SPECIALTY_SIZES, SERVICES, CATEGORIES, ADD_ONS } from '@/shared/data/services';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfToday, parseISO } from 'date-fns';
import { getSquareAppId, getSquareLocationId } from '../lib/config';
import { BookingAPI } from '../services/api';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';

type Step = 'service' | 'size' | 'addons' | 'datetime' | 'details' | 'payment' | 'success';

interface SquareService {
  id: string;
  name: string;
  description: string;
  categoryId?: string;
  variations: {
    id: string;
    name: string;
    duration: string;
    price: number;
  }[];
}

const formatDuration = (input: number | string) => {
  // If it's already a human-readable string like "2-3.5 hours" or "45 mins", return it directly
  if (typeof input === 'string' && (input.includes('hour') || input.includes('min') || input.includes('Day'))) {
    return input;
  }
  
  const num = Number(input);
  if (isNaN(num) || num === 0) {
    // Fallback: return the raw string if it exists
    return typeof input === 'string' ? input : 'N/A';
  }
  
  // Treat as milliseconds (from Square catalog)
  const mins = Math.floor(num / (60 * 1000));
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  
  if (hours > 0 && remainingMins > 0) return `${hours}h ${remainingMins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
};

export default function Booking() {
  const [searchParams] = useSearchParams();
  const preSelectedServiceId = searchParams.get('serviceId');

  const [step, setStep] = useState<Step>('service');
  const [services, setServices] = useState<SquareService[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection states
  const [selectedServices, setSelectedServices] = useState<SquareService[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<any>(null);

  // Calendar state
  const [viewDate, setViewDate] = useState(new Date());

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (services.length > 0 && preSelectedServiceId && selectedServices.length === 0) {
      const localService = SERVICES.find(s => s.id === preSelectedServiceId);
      if (localService) {
        const targetName = (localService.squareName || localService.name.split(' (')[0]).toLowerCase();
        const matched = services.find(s => s.name.toLowerCase().includes(targetName));
        if (matched) {
          setSelectedServices([matched]);
          setSelectedCategory(localService.categoryId);
          setStep('size');
        }
      }
    }
  }, [services, preSelectedServiceId, selectedServices]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      // Fallback/override to use local SERVICES directly mapped to square-like structure
      // to avoid 'no service found in category' issues.
      const localFormattedServices = SERVICES.map(ls => ({
        id: ls.id,
        name: ls.name,
        description: ls.shortDescription,
        categoryId: ls.categoryId,
        variations: Object.keys(ls.price).map((size, idx) => ({
          id: `${ls.id}-var-${idx}`,
          name: size,
          duration: typeof ls.duration === 'string' ? ls.duration : (ls.duration as any)[size] || '2h',
          price: (ls.price as any)[size]
        }))
      }));

      const localFormattedAddons = ADD_ONS.map((addon, idx) => ({
        id: addon.id,
        name: addon.name,
        description: addon.description,
        categoryId: 'add-ons',
        variations: [{
          id: `addon-var-${idx}`,
          name: 'Regular',
          duration: addon.duration,
          price: addon.price
        }]
      }));
      
      setServices([...localFormattedServices, ...localFormattedAddons]);
      

    } catch (err) {
      setError('Failed to load services. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const mainServices = services.filter(s => {
    const category = s.categoryId ? s.categoryId.toLowerCase() : '';
    const name = s.name.toLowerCase();
    const isAddon = category.includes('add-on') || name.includes('add-on');
    
    if (isAddon) return false;
    
    // Show services if no category selected or match selected category
    if (!selectedCategory) {
      return true;
    }
    return s.categoryId === selectedCategory;
  });

  const availableAddons = services.filter(s => {
    const category = s.categoryId ? s.categoryId.toLowerCase() : '';
    const name = s.name.toLowerCase();
    return category.includes('add-on') || name.includes('add-on');
  });

  const fetchAvailability = async (date: Date) => {
    if (selectedServices.length === 0 || !selectedSize) return;
    
    setSlotsLoading(true);
    setError(null);
    try {
      const serviceVariationIds: string[] = [];
      selectedServices.forEach(srv => {
        const variation = srv.variations.find(v => v.name === selectedSize);
        serviceVariationIds.push(variation?.id || srv.variations[0].id);
      });
      selectedAddons.forEach(id => {
        const addon = availableAddons.find(a => a.id === id);
        if (addon && addon.variations.length > 0) {
          serviceVariationIds.push(addon.variations[0].id);
        }
      });
      
      const start = format(date, "yyyy-MM-dd'T'00:00:00'Z'");
      const end = format(date, "yyyy-MM-dd'T'23:59:59'Z'");
      
      try {
        const data = await BookingAPI.getAvailability(start, end, serviceVariationIds);
        if (data && data.length > 0) {
          setSlots(data);
          return;
        } else {
          throw new Error('Empty availability, fallback to mock');
        }
      } catch (e) {
        // Mock fallback for availability if Square is not configured or uses local mocked ids
        const mockSlots = [9, 11, 13, 15].map(hour => {
          const slotTime = new Date(date);
          slotTime.setHours(hour, 0, 0, 0);
          return {
            startAt: slotTime.toISOString(),
            locationId: 'MOCK_LOC'
          };
        });
        setSlots(mockSlots);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error checking availability. Please try another date.');
    } finally {
      setSlotsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate && step === 'datetime') {
      fetchAvailability(selectedDate);
    }
  }, [selectedDate, step, selectedServices, selectedAddons, selectedSize]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot) return;

    setBookingLoading(true);
    setError(null);
    try {
      const serviceVariationIds: string[] = [];
      selectedServices.forEach(srv => {
        const variation = srv.variations.find(v => v.name === selectedSize);
        serviceVariationIds.push(variation?.id || srv.variations[0].id);
      });
      selectedAddons.forEach(id => {
        const addon = availableAddons.find(a => a.id === id);
        if (addon && addon.variations.length > 0) {
          serviceVariationIds.push(addon.variations[0].id);
        }
      });

      const booking = await BookingAPI.createBooking({
        startAt: selectedSlot.startAt,
        serviceVariationIds,
        customer: customerInfo
      });

      setPendingBooking(booking);
      
      setStep('success'); // Skip payment, go straight to success
    } catch (err: any) {
      setError(err.message || 'Booking failed. My schedule might have just filled up. Please refresh or call me.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePayment = async (token: any) => {
    if (!pendingBooking) return;
    setPaymentLoading(true);
    setError(null);

    try {
      await BookingAPI.createPayment({
        sourceId: token.token,
        amount: 5000, // $50.00 in cents
        customerId: pendingBooking.customerId,
        bookingId: pendingBooking.id
      });

      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try another card or contact me.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 'service') setStep('size');
    else if (step === 'size') setStep('addons');
    else if (step === 'addons') setStep('datetime');
    else if (step === 'datetime') setStep('details');
  };

  const prevStep = () => {
    if (step === 'size') setStep('service');
    else if (step === 'addons') setStep('size');
    else if (step === 'datetime') setStep('addons');
    else if (step === 'details') setStep('datetime');
  };

  const getPriceBreakdown = () => {
    if (selectedServices.length === 0 || !selectedSize) return { base: 0, sizeAdjustment: 0, addons: [], total: 0 };
    
    let basePrice = 0;
    selectedServices.forEach(srv => {
      const variation = srv.variations.find(v => v.name === selectedSize);
      basePrice += (variation?.price || srv.variations[0].price || 0);
    });
    
    const selectedAddonList = selectedAddons.map(id => {
      const addon = availableAddons.find(a => a.id === id);
      return {
        name: addon?.name || 'Add-on',
        price: addon?.variations?.[0]?.price || 0
      };
    });
    
    const addonsTotal = selectedAddonList.reduce((sum, a) => sum + a.price, 0);
    
    return {
      base: basePrice,
      addons: selectedAddonList,
      total: basePrice + addonsTotal
    };
  };

  const priceBreakdown = getPriceBreakdown();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-zinc-900 animate-spin mx-auto mb-4" />
          <p className="text-zinc-600 font-medium">Initializing Booking System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-20">
      <Helmet>
        <title>Book Auto Detailing in Bellevue & Omaha | Fast & Easy Scheduling</title>
        <meta name="description" content="Book your auto detailing, paint correction, or ceramic coating appointment online. Fast scheduling for Bellevue and Omaha car detailing." />
      </Helmet>
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-3 tracking-tighter italic">Secure Your Spot</h1>
          <p className="text-zinc-500 font-medium max-w-xl mx-auto">Select your service, choose a convenient time, and lock in your appointment.</p>
        </div>

        {/* Urgency Banner */}
        <div className="max-w-3xl mx-auto mb-8 px-4">
          <div className="bg-red-50 border border-red-100 text-red-700 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-sm animate-in fade-in zoom-in duration-500">
            <Flame className="w-5 h-5" />
            High Demand: Currently booking out 1-2 weeks in advance. Claim your spot now.
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="relative mb-16 max-w-3xl mx-auto px-4">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-200 -translate-y-1/2 rounded-full hidden sm:block"></div>
          <div className="relative flex justify-between">
            {['Service', 'Details', 'Success'].map((label, i) => {
              const steps: Step[] = ['service', 'details', 'success'];
              // If current step is 'size', 'addons', or 'datetime', it's technically in between 'service' and 'details'
              // but I'll consider it part of "Service" phase for the progress bar visual focus, or 
              // 'details' phase. Let's simplify and make the progress logic robust.
              let currentIndex = steps.indexOf(step as any);
              if (step === 'size' || step === 'addons' || step === 'datetime') currentIndex = 0; 
              if (step === 'details') currentIndex = 1;
              if (step === 'success') currentIndex = 2;

              const isCompleted = currentIndex > i;
              const isCurrent = currentIndex === i;
              const isActive = isCompleted || isCurrent;

              return (
                <div key={label} className="flex flex-col items-center gap-3 relative z-10 bg-zinc-50 sm:px-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted ? 'bg-zinc-900 border-zinc-900 text-white' :
                    isCurrent ? 'bg-white border-zinc-900 text-zinc-900 shadow-md scale-110' :
                    'bg-white border-zinc-200 text-zinc-300'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-black">{i + 1}</span>}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 'service' && (
                <motion.div
                  key="service"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900 mb-1">Select a Service</h2>
                    <p className="text-xs text-zinc-500">Pick your baseline service package.</p>
                  </div>

                  {/* Category Tabs */}
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                        selectedCategory === null 
                          ? 'bg-zinc-900 border-zinc-900 text-white shadow-md' 
                          : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300'
                      }`}
                    >
                      All Services
                    </button>
                    {CATEGORIES.filter(c => !['maintenance', 'rv-boat-detailing', 'tractor-detailing'].includes(c.id))
                      .filter(cat => services.some(s => s.categoryId === cat.id && !s.name.toLowerCase().includes('add-on')))
                      .map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                          selectedCategory === cat.id 
                            ? 'bg-zinc-900 border-zinc-900 text-white shadow-md' 
                            : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  <div className="grid gap-3">
                    {mainServices.length > 0 ? (
                      mainServices.map(s => {
                        const isSelected = !!selectedServices.find(ss => ss.id === s.id);
                        return (
                          <button
                            key={s.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedServices(selectedServices.filter(ss => ss.id !== s.id));
                              } else {
                                setSelectedServices([...selectedServices, s]);
                              }
                            }}
                            className={`p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-4 group ${
                              isSelected 
                                ? 'border-zinc-900 bg-white shadow-lg' 
                                : 'border-transparent bg-white hover:border-zinc-200 shadow-sm'
                            }`}
                          >
                            <div className={`mt-0.5 w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${isSelected ? 'bg-zinc-900 border-zinc-900' : 'border-zinc-300'}`}>
                              {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-bold text-zinc-900 text-lg group-hover:text-zinc-700 transition-colors">{s.name}</h3>
                                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-zinc-400 mt-1">
                                    <Clock className="h-3 w-3" />
                                    <span>Est. {s.variations?.[0] ? formatDuration(s.variations[0].duration) : 'N/A'}</span>
                                  </div>
                                </div>
                                {s.variations?.[0] && (
                                  <div className="text-right">
                                    <span className="text-zinc-900 font-bold bg-zinc-50 px-3 py-1 rounded-full text-sm">
                                      From ${Math.min(...s.variations.map(v => v.price))}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{s.description}</p>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-zinc-100">
                        <p className="text-zinc-400 text-sm italic">No services found in this category. Try another tab.</p>
                      </div>
                    )}
                  </div>
                  {selectedServices.length > 0 && (
                    <div className="sticky bottom-4 mt-6 z-10">
                      <Button className="w-full h-14 text-base font-bold shadow-2xl bg-zinc-900 text-white hover:bg-zinc-800" onClick={nextStep}>
                        Continue to Vehicle Size
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 'size' && (
                <motion.div
                  key="size"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="icon" onClick={prevStep}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h2 className="text-xl font-bold text-zinc-900">Vehicle Size</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {(selectedServices.some(s => s.variations?.some(v => v.name.includes('RV'))) ? SPECIALTY_SIZES : VEHICLE_SIZES).map(v => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSelectedSize(v.id);
                          nextStep();
                        }}
                        className={`p-6 rounded-2xl border-2 text-center transition-all ${
                          selectedSize === v.id 
                            ? 'border-zinc-900 bg-white shadow-md' 
                            : 'border-white bg-white hover:border-zinc-200'
                        }`}
                      >
                        <span className="text-3xl mb-3 block">{v.icon}</span>
                        <h3 className="font-bold text-zinc-900 text-sm">{v.name}</h3>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 'addons' && (
                <motion.div
                  key="addons"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="icon" onClick={prevStep}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h2 className="text-xl font-bold text-zinc-900">Add-ons (Optional)</h2>
                  </div>
                  <p className="text-xs text-zinc-500 mb-4 px-1">Enhance your detail with these specialized services.</p>
                  
                  <div className="grid gap-3">
                    {availableAddons.map(a => {
                      const isSelected = selectedAddons.includes(a.id);
                      const price = a.variations?.[0]?.price || 0;
                      const duration = a.variations?.[0]?.duration ? formatDuration(a.variations[0].duration) : '';
                      
                      return (
                        <button
                          key={a.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedAddons(selectedAddons.filter(id => id !== a.id));
                            } else {
                              setSelectedAddons([...selectedAddons, a.id]);
                            }
                          }}
                          className={`p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-4 ${
                            isSelected 
                              ? 'border-zinc-900 bg-white shadow-md' 
                              : 'border-transparent bg-white hover:border-zinc-200'
                          }`}
                        >
                          <div className={`mt-1 w-5 h-5 rounded border-2 shrink-0 ${isSelected ? 'bg-zinc-900 border-zinc-900' : 'border-zinc-300'} flex items-center justify-center transition-colors`}>
                            {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-bold text-zinc-900 text-sm tracking-tight">{a.name}</h3>
                              <span className="font-bold text-zinc-900 text-sm">+${price}</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 line-clamp-1 mb-2">{a.description}</p>
                            {duration && (
                              <div className="flex items-center gap-1 text-[9px] text-zinc-400 font-bold uppercase">
                                <Clock className="h-2.5 w-2.5" />
                                <span>Adds approx. {duration}</span>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <Button className="w-full h-14 mt-6 text-base font-bold shadow-lg" onClick={nextStep}>
                    Continue to Schedule
                  </Button>
                </motion.div>
              )}

              {(step === 'datetime' || step === 'details') && (
                <motion.div
                  key="final-steps"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Button variant="ghost" size="icon" onClick={prevStep}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h2 className="text-xl font-bold text-zinc-900">Final Details</h2>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Select Date & Time
                      </h3>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => setViewDate(addMonths(viewDate, -1))}
                          disabled={isBefore(startOfMonth(addMonths(viewDate, -1)), startOfMonth(new Date()))}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-bold min-w-[100px] text-center">
                          {format(viewDate, 'MMMM yyyy')}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => setViewDate(addMonths(viewDate, 1))}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 mb-6">
                      {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                        <div key={d} className="text-center text-[10px] font-bold text-zinc-400 py-2">{d}</div>
                      ))}
                      
                      {/* Blank days for start of month */}
                      {Array.from({ length: startOfMonth(viewDate).getDay() }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-10 w-full" />
                      ))}

                      {/* Actual days */}
                      {eachDayOfInterval({
                        start: startOfMonth(viewDate),
                        end: endOfMonth(viewDate)
                      }).map((date) => {
                        const isPast = isBefore(date, startOfToday());
                        const isSelected = selectedDate && isSameDay(date, selectedDate);
                        const isToday = isSameDay(date, new Date());
                        
                        return (
                          <button
                            key={date.toString()}
                            disabled={isPast}
                            onClick={() => setSelectedDate(date)}
                            className={`h-10 w-full rounded-lg text-xs font-bold transition-all relative ${
                              isSelected ? 'bg-zinc-900 text-white z-10' : 
                              isPast ? 'text-zinc-200 cursor-not-allowed' : 'text-zinc-600 hover:bg-zinc-100'
                            }`}
                          >
                            {format(date, 'd')}
                            {isToday && !isSelected && (
                              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-zinc-900" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {selectedDate && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                        <h4 className="text-sm font-bold text-zinc-900">Available Slots for {format(selectedDate, 'MMM do')}</h4>
                        {slotsLoading ? (
                          <div className="flex items-center gap-2 text-zinc-500 py-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-xs">Checking availability...</span>
                          </div>
                        ) : slots.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {slots.map((slot, idx) => {
                              const time = format(parseISO(slot.startAt), 'h:mm a');
                              const isSelected = selectedSlot?.startAt === slot.startAt;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                                    isSelected 
                                      ? 'bg-zinc-900 border-zinc-900 text-white' 
                                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-900'
                                  }`}
                                >
                                  {time}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4 bg-zinc-50 rounded-xl text-center">
                            <p className="text-xs text-zinc-500">No availability for this date. Please try another.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
                    <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-1">
                        <label htmlFor="firstName" className="text-[10px] font-bold uppercase text-zinc-400 mb-1 block">First Name</label>
                        <input 
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="John"
                          value={customerInfo.firstName}
                          onChange={e => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                          className="w-full bg-zinc-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-900"
                        />
                      </div>
                      <div className="col-span-1">
                        <label htmlFor="lastName" className="text-[10px] font-bold uppercase text-zinc-400 mb-1 block">Last Name</label>
                        <input 
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Doe"
                          value={customerInfo.lastName}
                          onChange={e => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                          className="w-full bg-zinc-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-900"
                        />
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="email" className="text-[10px] font-bold uppercase text-zinc-400 mb-1 block">Email</label>
                        <input 
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={customerInfo.email}
                          onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})}
                          className="w-full bg-zinc-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-900"
                        />
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="phone" className="text-[10px] font-bold uppercase text-zinc-400 mb-1 block">Phone</label>
                        <input 
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={customerInfo.phone}
                          onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                          className="w-full bg-zinc-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-900"
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-14 text-lg font-bold shadow-xl shadow-zinc-200"
                    disabled={!selectedSlot || !customerInfo.firstName || !customerInfo.email || bookingLoading}
                    onClick={handleBooking}
                  >
                    {bookingLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      'Confirm Booking'
                    )}
                  </Button>
                </motion.div>
              )}



              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-10 text-center shadow-xl border border-zinc-100"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900 mb-2">Booking Confirmed!</h2>
                  <p className="text-zinc-500 mb-8 max-w-sm mx-auto">
                    I've received your booking. You'll receive a confirmation email shortly with the details.
                  </p>
                  <Button asChild variant="outline" className="w-full max-w-xs h-12">
                    <a href="/">Return Home</a>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar / Summary */}
          {step !== 'success' && (
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm sticky top-24">
                <h3 className="font-bold text-zinc-900 mb-6 flex items-center gap-2 px-1">
                  <Info className="h-4 w-4 text-zinc-400" />
                  Booking Summary
                </h3>
                
                <div className="space-y-4">
                  {selectedServices.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Services</p>
                      {selectedServices.map(srv => (
                        <p key={srv.id} className="text-sm font-bold text-zinc-900">{srv.name}</p>
                      ))}
                    </div>
                  )}
                  {selectedSize && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Vehicle Size</p>
                      <p className="text-sm font-bold text-zinc-900">{selectedSize}</p>
                    </div>
                  )}
                  {selectedAddons.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Add-ons</p>
                      <ul className="space-y-1">
                        {selectedAddons.map(id => (
                          <li key={id} className="text-xs text-zinc-600">• {availableAddons.find(a => a.id === id)?.name || 'Add-on'}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedDate && selectedSlot && (
                    <div className="animate-in fade-in slide-in-from-right-4">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Date & Time</p>
                      <p className="text-sm font-bold text-zinc-900">
                        {format(selectedDate, 'PPP')} @ {format(parseISO(selectedSlot.startAt), 'h:mm a')}
                      </p>
                    </div>
                  )}

                  <div className="pt-6 border-t border-zinc-100 mt-6 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500">Base Service & Size</span>
                        <span className="text-xs font-bold text-zinc-900">${priceBreakdown.base}</span>
                    </div>
                    {priceBreakdown.addons.map((a, i) => (
                      <div key={i} className="flex items-center justify-between animate-in fade-in slide-in-from-right-4">
                        <span className="text-xs text-zinc-400 italic">+ {a.name}</span>
                        <span className="text-xs font-bold text-zinc-900">${a.price}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-50 mt-2">
                        <span className="text-sm font-bold text-zinc-900">Estimated Total</span>
                        <span className="text-lg font-black text-zinc-900">${priceBreakdown.total}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-4 leading-relaxed bg-zinc-50 p-3 rounded-lg border border-zinc-100 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        <span>No upfront deposit required. Payment is collected upon completion of the service. Final price may vary based on actual vehicle condition.</span>
                    </p>
                    <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-center gap-2">
                      <div className="flex -space-x-2">
                        {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />)}
                      </div>
                      <span className="text-xs font-bold text-zinc-900">Highly Rated Local Detailer</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 hidden lg:block sticky top-[480px]">
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 text-emerald-500 fill-emerald-500" />)}
                </div>
                <p className="text-sm font-medium text-emerald-900 leading-relaxed italic mb-4">
                  "Bryan is a wizard. My truck looked like it had been through a mud bog and an inside tornado. It looks better than when I bought it off the lot."
                </p>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center font-black text-emerald-800 text-xs text-center">M</div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Mark T. (Bellevue)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

