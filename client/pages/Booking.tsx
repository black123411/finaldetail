import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
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
  Star,
  Flame
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { VEHICLE_SIZES, SPECIALTY_SIZES, SERVICES, ADD_ONS } from '@/shared/data/services';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfToday, parseISO } from 'date-fns';
import { BookingAPI, ServiceAPI } from '../services/api';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { trackEvent } from '../lib/analytics';
import { formatCurrency } from '../lib/utils';

type Step = 'service' | 'size' | 'addons' | 'datetime' | 'details' | 'success';
type BookingPathId = 'interior' | 'full-detail' | 'exterior-paint' | 'ceramic' | 'specialty';

const BOOKING_PATHS: Array<{
  id: BookingPathId;
  label: string;
  description: string;
  categoryIds: string[];
}> = [
  {
    id: 'interior',
    label: 'Interior',
    description: 'Maintenance cleaning, deeper interior detailing, stains, pet hair, spills, or odors.',
    categoryIds: ['interior-detailing'],
  },
  {
    id: 'full-detail',
    label: 'Full Detail',
    description: 'Inside-and-out packages, new-car preparation, pre-sale work, or ongoing maintenance.',
    categoryIds: ['full-detailing', 'maintenance'],
  },
  {
    id: 'exterior-paint',
    label: 'Exterior / Paint',
    description: 'Wash and wax, paint enhancement, swirl reduction, or multi-stage paint correction.',
    categoryIds: ['exterior-detailing', 'paint-correction'],
  },
  {
    id: 'ceramic',
    label: 'Ceramic Coating',
    description: 'System X coating packages and paint-protection consultations.',
    categoryIds: ['protection'],
  },
  {
    id: 'specialty',
    label: 'Specialty / Not Sure',
    description: 'RV, boat, tractor, equipment, or another job that needs photos before booking.',
    categoryIds: ['rv-boat-detailing', 'tractor-detailing'],
  },
];

const getBookingPathForCategory = (categoryId: string) =>
  BOOKING_PATHS.find(path => path.categoryIds.includes(categoryId))?.id || null;

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

const normalizeName = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
const LEGACY_SERVICE_IDS: Record<string, string> = {
  'ceramic-3yr': 'system-x-crystal-plus',
  'protection-package': 'system-x-pro-plus',
};
const isRealSquareVariationId = (id?: string) => !!id && !id.startsWith('local-') && !id.startsWith('addon-var-') && !id.includes('-var-');


const getSizeLabel = (sizeId: string | null) => {
  const map: Record<string, string> = {
    car: 'Sedan / Coupe',
    suv: 'Small SUV / Crossover',
    truck: 'Truck / Large SUV',
    largeSuv: 'XL Vehicle / Van',
    rv: 'RV / Boat / Trailer',
    tractor: 'Tractor / Equipment',
  };
  return sizeId ? map[sizeId] || sizeId : 'Select size';
};

const getSizeAliases = (sizeId: string) => {
  switch (sizeId) {
    case 'car':
      return ['car', 'sedan', 'sedancoupe', 'carsedan', 'coupe'];
    case 'suv':
      return ['suv', 'smallsuv', 'smallsuvcrossover', 'suvcrossover', 'crossover'];
    case 'truck':
      return ['truck', 'trucklargesuv', 'largesuv'];
    case 'largeSuv':
      return ['largesuv', 'largeSUV', 'xlvehicle', 'van', 'largesuvvan', 'xlvehiclevan'];
    case 'rv':
      return ['rv', 'rvboat', 'rvboattrailer', 'boat', 'trailer'];
    case 'tractor':
      return ['tractor', 'equipment', 'tractorfarm', 'tractorfarmequipment'];
    default:
      return [sizeId];
  }
};

const isMatchingVariation = (variationName: string, sizeId: string) => {
  const normalizedVariation = normalizeName(variationName);
  if (!normalizedVariation) return false;

  return getSizeAliases(sizeId).some((alias) => {
    const normalizedAlias = normalizeName(alias);
    return normalizedVariation === normalizedAlias || normalizedVariation.includes(normalizedAlias) || normalizedAlias.includes(normalizedVariation);
  });
};

const getAddonVariation = (addon: SquareService | undefined, sizeId: string | null) => {
  if (!addon?.variations?.length) return undefined;
  return (sizeId ? addon.variations.find(variation => variation.name === sizeId) : undefined) || addon.variations[0];
};

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

const getServiceDisplayDuration = (service: SquareService) => {
  const squareDuration = service.variations?.[0]?.duration;
  const numericDuration = Number(squareDuration);
  const squareMinutes = Number.isFinite(numericDuration) ? numericDuration / 60000 : Number.POSITIVE_INFINITY;
  if (squareDuration && squareMinutes >= 15) return formatDuration(squareDuration);

  const local = SERVICES.find(candidate =>
    normalizeName(candidate.squareName || candidate.name) === normalizeName(service.name)
  );
  if (!local) return squareDuration ? formatDuration(squareDuration) : 'Contact for timing';
  const duration = typeof local.duration === 'string' ? local.duration : Object.values(local.duration)[0];
  return duration || 'Contact for timing';
};

const getServicePriceLabel = (service: SquareService) => {
  const prices = service.variations.map(variation => variation.price).filter(price => Number.isFinite(price));
  const minimum = prices.length ? Math.min(...prices) : 0;
  const local = SERVICES.find(candidate =>
    normalizeName(candidate.squareName || candidate.name) === normalizeName(service.name)
  );
  if (local?.pricingType === 'custom') return 'Custom quote';
  if (minimum <= 0 && local) {
    const localPrices = Object.values(local.price).filter(price => price > 0);
    const localMinimum = localPrices.length ? Math.min(...localPrices) : 0;
    if (!localMinimum) return 'Custom quote';
    return local.pricingType === 'variable' ? `From $${localMinimum}/ft` : `From $${localMinimum}`;
  }
  if (minimum <= 0) return 'Custom quote';
  if (local?.pricingType === 'variable') return `From $${minimum}/ft`;
  return `From $${minimum}`;
};

export default function Booking() {
  const [searchParams] = useSearchParams();
  const requestedServiceId = searchParams.get('serviceId');
  const preSelectedServiceId = requestedServiceId ? LEGACY_SERVICE_IDS[requestedServiceId] || requestedServiceId : null;
  const isDirectBooking = Boolean(preSelectedServiceId && SERVICES.some((service) => service.id === preSelectedServiceId));
  const preSelectedAddonId = searchParams.get('addonId');

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
    notes: '',
    locationType: 'drop-off' as 'drop-off' | 'mobile',
    address: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const trackedSteps = useRef<Set<Step>>(new Set());

  // Calendar state
  const [viewDate, setViewDate] = useState(new Date());

  const [selectedPath, setSelectedPath] = useState<BookingPathId | null>(null);
  const requiresDropOff =
    selectedServices.some((service) => service.id === 'odor-elimination') ||
    selectedAddons.includes('smoke-odor');

  useEffect(() => {
    if (!requiresDropOff || customerInfo.locationType === 'drop-off') return;
    setCustomerInfo((current) => ({ ...current, locationType: 'drop-off', address: '' }));
  }, [requiresDropOff, customerInfo.locationType]);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (trackedSteps.current.has(step)) return;

    trackedSteps.current.add(step);
    trackEvent('booking_step_view', {
      step,
      selected_service_count: selectedServices.length,
      total: priceBreakdown.total
    });

    if (step === 'details') {
      trackEvent('form_start', {
        form_name: 'booking',
        selected_service_count: selectedServices.length,
        total: priceBreakdown.total
      });
    }
  }, [step]);

  useEffect(() => {
    if (services.length > 0 && preSelectedServiceId && selectedServices.length === 0) {
      const localService = SERVICES.find(s => s.id === preSelectedServiceId);
      if (localService) {
        const targetName = (localService.squareName || localService.name.split(' (')[0]).toLowerCase();
        const matched = services.find(s => s.name.toLowerCase().includes(targetName));
        if (matched) {
          setSelectedServices([matched]);
          setSelectedPath(getBookingPathForCategory(localService.categoryId));
          setStep('size');
        }
      }
    }
  }, [services, preSelectedServiceId, selectedServices]);

  useEffect(() => {
    if (!preSelectedAddonId || !ADD_ONS.some(addon => addon.id === preSelectedAddonId)) return;
    setSelectedAddons(current => current.includes(preSelectedAddonId) ? current : [...current, preSelectedAddonId]);
  }, [preSelectedAddonId]);

  const fetchServices = async () => {
    try {
      setLoading(true);

      const squareServices = await ServiceAPI.getCatalogServices().catch(() => []);
      const findSquareService = (name: string) => {
        const normalized = normalizeName(name);
        return squareServices.find((svc: SquareService) => {
          const squareName = normalizeName(svc.name || '');
          return squareName === normalized || squareName.includes(normalized) || normalized.includes(squareName);
        });
      };

      const localFormattedServices = SERVICES.map(ls => ({
        id: ls.id,
        name: ls.name,
        description: ls.shortDescription,
        categoryId: ls.categoryId,
        variations: Object.keys(ls.price).map((size) => {
          const sizeLabel = [...VEHICLE_SIZES, ...SPECIALTY_SIZES].find(v => v.id === size)?.name || size;
          const squareMatch = findSquareService(ls.squareName || ls.name);
          const squareVariation = squareMatch?.variations?.find((variation: any) => isMatchingVariation(variation.name || '', size));

          return {
            id: squareVariation?.id || `local-${ls.id}-${size}`,
            name: size,
            duration: squareVariation?.duration || (typeof ls.duration === 'string' ? ls.duration : (ls.duration as any)[size] || '2h'),
            price: squareVariation?.price ?? (ls.price as any)[size]
          };
        })
      }));

      const localFormattedAddons = ADD_ONS.map((addon) => {
        const squareMatch = findSquareService(addon.name);
        const variations = addon.priceBySize
          ? VEHICLE_SIZES
              .filter((size) => addon.priceBySize?.[size.id as keyof typeof addon.priceBySize] !== undefined)
              .map((size) => {
                const squareVariation = squareMatch?.variations?.find((variation: any) => isMatchingVariation(variation.name || '', size.id));
                return {
                  id: squareVariation?.id || `local-addon-${addon.id}-${size.id}`,
                  name: size.id,
                  duration: squareVariation?.duration || addon.duration,
                  price: squareVariation?.price ?? addon.priceBySize![size.id as keyof typeof addon.priceBySize]!
                };
              })
          : [{
              id: squareMatch?.variations?.[0]?.id || `local-addon-${addon.id}`,
              name: 'Regular',
              duration: squareMatch?.variations?.[0]?.duration || addon.duration,
              price: squareMatch?.variations?.[0]?.price ?? addon.price
            }];
        return {
          id: addon.id,
          name: addon.name,
          description: addon.description,
          categoryId: 'add-ons',
          variations
        };
      });
      
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
    
    const path = BOOKING_PATHS.find(candidate => candidate.id === selectedPath);
    if (!path) return false;
    return !!s.categoryId && path.categoryIds.includes(s.categoryId);
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
        const variation = getAddonVariation(addon, selectedSize);
        if (variation) {
          serviceVariationIds.push(variation.id);
        }
      });
      
      const start = format(date, "yyyy-MM-dd'T'00:00:00'Z'");
      const end = format(date, "yyyy-MM-dd'T'23:59:59'Z'");

      if (serviceVariationIds.some(id => !isRealSquareVariationId(id))) {
        setSlots([]);
        setError('Online booking is not connected to Square for this service yet. Please call (712) 305-6313 to book.');
        return;
      }

      const data = await BookingAPI.getAvailability(start, end, serviceVariationIds);
      setSlots(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      trackEvent('form_error', {
        form_name: 'booking',
        step: 'availability',
        message: err.message || 'Error checking availability'
      });
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
        const variation = getAddonVariation(addon, selectedSize);
        if (variation) {
          serviceVariationIds.push(variation.id);
        }
      });

      if (serviceVariationIds.some(id => !isRealSquareVariationId(id)) || !selectedSlot.appointmentSegments?.length) {
        throw new Error('This time slot is not connected to Square. Please choose a real available slot or call (712) 305-6313.');
      }

      const booking = await BookingAPI.createBooking({
        startAt: selectedSlot.startAt,
        locationId: selectedSlot.locationId,
        serviceVariationIds,
        appointmentSegments: selectedSlot.appointmentSegments,
        customer: customerInfo,
        serviceName: selectedServices.map(s => s.name).join(', '),
        priceTotal: priceBreakdown.total,
        addons: selectedAddons.map(id => availableAddons.find(a => a.id === id)?.name).filter(Boolean)
      });

      trackEvent('booking_confirmed', {
        selected_service_count: selectedServices.length,
        location_type: customerInfo.locationType,
        total: priceBreakdown.total
      });
      
      setStep('success');
    } catch (err: any) {
      trackEvent('form_error', {
        form_name: 'booking',
        step: 'confirm_booking',
        message: err.message || 'Booking failed'
      });
      setError(err.message || 'Booking failed. My schedule might have just filled up. Please refresh or call me.');
    } finally {
      setBookingLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 'service') {
      trackEvent('begin_booking', {
        location: 'booking_wizard',
        selected_service_count: selectedServices.length
      });
      setStep('size');
    }
    else if (step === 'size') {
      setStep(isDirectBooking ? 'datetime' : 'addons');
    }
    else if (step === 'addons') {
      trackEvent('booking_addons_complete', {
        addon_count: selectedAddons.length,
        total: priceBreakdown.total
      });
      setStep('datetime');
    }
    else if (step === 'datetime') setStep('details');
  };

  const prevStep = () => {
    if (step === 'size' && !isDirectBooking) setStep('service');
    else if (step === 'addons') setStep('size');
    else if (step === 'datetime') setStep(isDirectBooking ? 'size' : 'addons');
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
      const variation = getAddonVariation(addon, selectedSize);
      return {
        name: addon?.name || 'Add-on',
        price: variation?.price || 0
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
    <div className={`min-h-screen bg-zinc-50 pb-20 ${isDirectBooking ? 'pt-10' : 'pt-24'}`}>
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-3 tracking-tighter italic">Book Your Detail</h1>
          <p className="text-zinc-500 font-medium max-w-xl mx-auto">{isDirectBooking ? 'Your service is selected. Choose your vehicle size, then pick an available time and enter your contact information.' : 'Choose a service, vehicle size, and an available appointment time.'}</p>
        </div>

        {/* Trust and process summary for the general booking entry */}
        {!isDirectBooking && <div className="max-w-3xl mx-auto mb-8 px-4">
          <div className="mb-4 flex items-center justify-center gap-2 border border-blue-100 bg-blue-50 px-4 py-3 text-center text-sm font-bold text-blue-800 animate-in fade-in duration-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Owner-operated since 2017 • Mobile and Bellevue drop-off options
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
            {[
              { title: '1. Pick package', copy: 'Choose the service and vehicle size that match your condition.' },
              { title: '2. See pricing', copy: 'Add-ons and the running total stay visible before confirmation.' },
              { title: '3. Confirm time', copy: 'I review the booking and send the appointment details.' },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-zinc-100 rounded-2xl p-4 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900">{item.title}</p>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed mt-2">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>}

        {/* Progress Tracker */}
        <div className={`relative max-w-3xl mx-auto px-4 ${isDirectBooking ? 'mb-8' : 'mb-16'}`}>
          <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-200 -translate-y-1/2 rounded-full hidden sm:block"></div>
          <div className="relative flex justify-between">
            {(isDirectBooking ? ['Vehicle Size', 'Date & Time', 'Contact', 'Confirm'] : ['Service', 'Details', 'Confirm']).map((label, i) => {
              let currentIndex = 0;
              if (isDirectBooking) {
                if (step === 'datetime') currentIndex = 1;
                if (step === 'details') currentIndex = 2;
                if (step === 'success') currentIndex = 3;
              } else {
                if (step === 'size' || step === 'addons' || step === 'datetime' || step === 'details') currentIndex = 1;
                if (step === 'success') currentIndex = 2;
              }

              const displayIndex = isDirectBooking && step === 'success' ? 3 : currentIndex;
              const isCompleted = displayIndex > i;
              const isCurrent = displayIndex === i;
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
                    <h2 className="text-xl font-bold text-zinc-900 mb-1">
                      {selectedPath ? 'Choose Your Package' : 'What Does Your Vehicle Need?'}
                    </h2>
                    <p className="text-xs text-zinc-500">
                      {selectedPath ? 'Compare the packages in this service type.' : 'Choose one of five service types. You will see the detailed packages next.'}
                    </p>
                  </div>

                  {!selectedPath ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {BOOKING_PATHS.map((path, index) => (
                        <button
                          key={path.id}
                          type="button"
                          onClick={() => {
                            setSelectedServices([]);
                            setSelectedPath(path.id);
                            trackEvent('booking_select_path', { path_id: path.id, path_label: path.label });
                          }}
                          className="group flex min-h-36 items-start gap-4 rounded-2xl border-2 border-transparent bg-white p-5 text-left shadow-sm transition-all hover:border-zinc-300 hover:shadow-md"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-sm font-black text-white">
                            {index + 1}
                          </span>
                          <span>
                            <span className="block text-lg font-black text-zinc-900 group-hover:text-blue-700">{path.label}</span>
                            <span className="mt-2 block text-xs leading-relaxed text-zinc-500">{path.description}</span>
                            <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-700">
                              View options <ChevronRight className="h-3.5 w-3.5" />
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPath(null);
                          setSelectedServices([]);
                        }}
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-950"
                      >
                        <ChevronLeft className="h-4 w-4" /> Change service type
                      </button>
                        <p className="text-sm font-bold text-zinc-900">
                          {BOOKING_PATHS.find(path => path.id === selectedPath)?.label}
                        </p>
                      </div>

                      {selectedPath === 'specialty' && (
                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-relaxed text-blue-950">
                          Not sure which service fits? <Link to="/quote" className="font-black underline underline-offset-2">Send vehicle details and photos for my recommendation.</Link>
                        </div>
                      )}

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
                                trackEvent('booking_select_service', {
                                  service_id: s.id,
                                  action: 'removed',
                                });
                              } else {
                                setSelectedServices([...selectedServices, s]);
                                trackEvent('booking_select_service', {
                                  service_id: s.id,
                                  action: 'selected',
                                });
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
                                    <span>Est. {getServiceDisplayDuration(s)}</span>
                                  </div>
                                </div>
                                {s.variations?.[0] && (
                                  <div className="text-right">
                                    <span className="text-zinc-900 font-bold bg-zinc-50 px-3 py-1 rounded-full text-sm">
                                      {getServicePriceLabel(s)}
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
                    </>
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
                    {!isDirectBooking && <Button variant="ghost" size="icon" onClick={prevStep} aria-label="Back to service selection"><ChevronLeft className="h-5 w-5" /></Button>}
                    <h2 className="text-xl font-bold text-zinc-900">Vehicle Size</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {(selectedServices.some(s => s.variations?.some(v => v.name.includes('RV'))) ? SPECIALTY_SIZES : VEHICLE_SIZES).map(v => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSelectedSize(v.id);
                          trackEvent('booking_select_size', {
                            vehicle_size: v.id,
                            location: 'booking_wizard',
                          });
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
                      const variation = getAddonVariation(a, selectedSize);
                      const price = variation?.price || 0;
                      const duration = variation?.duration ? formatDuration(variation.duration) : '';
                      
                      return (
                        <button
                          key={a.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedAddons(selectedAddons.filter(id => id !== a.id));
                          } else {
                            setSelectedAddons([...selectedAddons, a.id]);
                          }
                          trackEvent('booking_select_addon', {
                            addon_id: a.id,
                            addon_name: a.name,
                            selected: !isSelected,
                          });
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
                              <span className="font-bold text-zinc-900 text-sm">+{formatCurrency(price)}</span>
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
                        <span className="text-sm font-bold min-w-25 text-center">
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
                            onClick={() => {
                              setSelectedDate(date);
                              trackEvent('booking_select_date', { date: format(date, 'yyyy-MM-dd') });
                            }}
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
                                  onClick={() => {
                                    setSelectedSlot(slot);
                                    if (selectedDate) {
                                      trackEvent('booking_select_date', {
                                        date: format(selectedDate, 'yyyy-MM-dd'),
                                        location: 'booking_wizard',
                                      });
                                    }
                                    trackEvent('booking_select_time', {
                                      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
                                      time,
                                      total: priceBreakdown.total
                                    });
                                  }}
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
                          <div className="space-y-4">
                            <div className="p-4 bg-zinc-50 rounded-xl text-center">
                              <p className="text-xs text-zinc-500">No availability for this date. Please try another.</p>
                            </div>
                            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-amber-900 text-sm">
                              <p className="font-bold">Need help finding a time?</p>
                              <p className="mt-1">Call me at <a href="tel:712-305-6313" className="underline font-semibold" onClick={() => trackEvent('click_call', { location: 'booking_no_slots' })}>712-305-6313</a> and I will help you find the next available appointment.</p>
                            </div>
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
                      
                      <div className="col-span-2 mt-4">
                        <label className="text-[10px] font-bold uppercase text-zinc-400 mb-2 block">Service Location</label>
                        {requiresDropOff ? (
                          <div role="status" className="border border-violet-200 bg-violet-50 p-4 text-sm leading-6 text-violet-950">
                            <p className="font-black">Bellevue drop-off required</p>
                            <p className="mt-1">Odor and ozone treatments cannot be completed as a mobile appointment. The vehicle must remain unoccupied during treatment and be aired out before pickup.</p>
                          </div>
                        ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setCustomerInfo({...customerInfo, locationType: 'drop-off'});
                              trackEvent('booking_select_location_type', { location_type: 'drop-off' });
                            }}
                            className={`p-3 text-sm font-bold rounded-lg border-2 transition-all ${
                              customerInfo.locationType === 'drop-off'
                                ? 'bg-zinc-900 border-zinc-900 text-white'
                                : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                            }`}
                          >
                            Vehicle Drop-off
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCustomerInfo({...customerInfo, locationType: 'mobile'});
                              trackEvent('booking_select_location_type', { location_type: 'mobile' });
                            }}
                            className={`p-3 text-sm font-bold rounded-lg border-2 transition-all ${
                              customerInfo.locationType === 'mobile'
                                ? 'bg-zinc-900 border-zinc-900 text-white'
                                : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                            }`}
                          >
                            Mobile Details
                          </button>
                        </div>
                        )}
                        {customerInfo.locationType === 'mobile' && (
                          <div className="mt-3">
                            <label htmlFor="address" className="text-[10px] font-bold uppercase text-zinc-400 mb-1 block">Your Address</label>
                            <input 
                              id="address"
                              name="address"
                              type="text"
                              placeholder="123 Main St, City, Zip"
                              value={customerInfo.address}
                              onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})}
                              className="w-full bg-zinc-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-900"
                            />
                            <p className="text-[10px] text-zinc-500 mt-1">Must be within Omaha/Bellevue metro area. Ensure access to power and water.</p>
                          </div>
                        )}
                        {customerInfo.locationType === 'drop-off' && (
                          <div className="mt-3 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                            <p className="text-xs text-zinc-600">
                              <span className="font-bold">Drop-off Location:</span><br/>
                              1907 Arlington Cir, Bellevue NE 68123<br/>
                              <span className="text-[10px]">Appointment-only drop-off; this is not an open public storefront.</span>
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="col-span-2">
                        <label htmlFor="notes" className="text-[10px] font-bold uppercase text-zinc-400 mb-1 block">Vehicle Details & Notes (Optional)</label>
                        <textarea 
                          id="notes"
                          name="notes"
                          placeholder="Year, Make, Model and any specific concerns..."
                          rows={2}
                          value={customerInfo.notes}
                          onChange={e => setCustomerInfo({...customerInfo, notes: e.target.value})}
                          className="w-full bg-zinc-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-900 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-14 text-lg font-bold shadow-xl shadow-zinc-200"
                    disabled={
                      !selectedSlot || 
                      !customerInfo.firstName || 
                      !customerInfo.email || 
                      !customerInfo.phone ||
                      (customerInfo.locationType === 'mobile' && !customerInfo.address) ||
                      bookingLoading
                    }
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
                  
                  <div className="mt-4 text-center">
                    <p className="text-[10px] text-zinc-400 font-medium">
                      By confirming, you are requesting the selected Square appointment time. <br/>
                      A secure connection is used to send your booking request.
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-10 text-center shadow-xl border border-zinc-100"
                >
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-blue-600" />
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
                      <p className="text-sm font-bold text-zinc-900">{getSizeLabel(selectedSize)}</p>
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
                        <span className="text-xs font-bold text-zinc-900">{formatCurrency(priceBreakdown.base)}</span>
                    </div>
                    {priceBreakdown.addons.map((a, i) => (
                      <div key={i} className="flex items-center justify-between animate-in fade-in slide-in-from-right-4">
                        <span className="text-xs text-zinc-400 italic">+ {a.name}</span>
                        <span className="text-xs font-bold text-zinc-900">{formatCurrency(a.price)}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-50 mt-2">
                        <span className="text-sm font-bold text-zinc-900">Estimated Total</span>
                        <span className="text-lg font-black text-zinc-900">{formatCurrency(priceBreakdown.total)}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-4 leading-relaxed bg-zinc-50 p-3 rounded-lg border border-zinc-100 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>No upfront payment is required online. Final price may vary with vehicle size, condition, and approved add-ons. I will confirm any changes before work begins.</span>
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

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
