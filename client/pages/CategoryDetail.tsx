import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowLeft, Calendar, ShieldCheck, Sparkles, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { SERVICES, CATEGORIES } from '@/shared/data/services';
import { BOOKING_LINK } from '../lib/constants';
import { formatCurrency } from '../lib/utils';
import { trackEvent } from '../lib/analytics';
import RelatedGuides, { guideTopicForCategory } from '../components/RelatedGuides';

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const category = CATEGORIES.find(c => c.slug === slug);
  
  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Button asChild>
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    );
  }

  const categoryServices = SERVICES.filter(s => s.categoryId === category.id);
  const maintenanceService = SERVICES.find(s => s.id === 'maintenance-interior');

  const localHeadingByCategory: Record<string, string> = {
    'interior-detailing': 'Interior Car Detailing in Omaha & Bellevue',
    'exterior-detailing': 'Exterior Car Detailing in Omaha & Bellevue',
    'full-detailing': 'Full Car Detailing in Omaha & Bellevue',
    'paint-correction': 'Paint Correction in Omaha & Bellevue',
    'ceramic-coating': 'Ceramic Coating in Omaha & Bellevue',
    'maintenance-plans': 'Maintenance Car Detailing in Omaha & Bellevue',
    'rv-boat-detailing': 'RV & Boat Detailing in Omaha & Bellevue',
    'tractor-farm-equipment': 'Specialty Vehicle Detailing in Omaha & Bellevue',
  };

  const localHeading = localHeadingByCategory[category.slug] || `${category.name} in Omaha & Bellevue`;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={category.image} 
            alt={category.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl space-y-6"
          >
            <Button variant="ghost" className="text-white hover:bg-white/10 -ml-4" asChild>
              <Link to="/services">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Services
              </Link>
            </Button>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              {category.name}
              <span className="block text-2xl md:text-4xl text-zinc-500 font-medium italic mt-2">
                Owner-operated detailing in Bellevue & Omaha
              </span>
            </h1>
            <p className="text-xl text-zinc-300 leading-relaxed">
              {category.description}
            </p>
            {category.slug === 'interior-detailing' ? (
              <div className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-emerald-100">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-300 mb-2">New Lower Entry Option</p>
                <p className="text-lg font-semibold text-white leading-relaxed">
                  Maintenance Interior starts at <strong>${maintenanceService?.price.car ?? 139}</strong> for well-kept vehicles that need a light cabin refresh before stepping up to Signature Interior Detail or Deep Interior Restoration.
                </p>
              </div>
            ) : null}
            <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950/75 p-6 text-zinc-200">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-zinc-400 mb-2">Check current availability</p>
              <p className="text-lg font-semibold leading-relaxed">
                Online availability is updated live. Select the open date and time that works for your vehicle and schedule.
              </p>
              <div className="mt-5">
                <Button asChild className="inline-flex h-14 items-center justify-center rounded-md bg-emerald-500 px-7 font-black text-zinc-950 hover:bg-emerald-400">
                  <Link to="/book" onClick={() => trackEvent('begin_booking', { location: 'category_hero', category: category.slug })}>Book a Detail</Link>
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                Clear service scope
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                Condition-based service
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] items-center">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Local service guide</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-black tracking-tight text-zinc-950">
                {category.name} for Omaha and Bellevue drivers
              </h2>
              <p className="mt-4 text-lg leading-8 text-zinc-600">
                Compare the options below by vehicle condition, desired result, starting price, and time.
                Mobile service is available for suitable jobs around the metro; Bellevue drop-off is recommended
                for intensive paint correction, ceramic coating, and other controlled-setting work.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild className="h-12 rounded-xl bg-zinc-950 px-6 font-black uppercase tracking-widest text-xs">
                <Link to="/areas/omaha-ne">Omaha Detailing</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-xl px-6 font-black uppercase tracking-widest text-xs">
                <Link to="/areas/bellevue-ne">Bellevue Detailing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Listing */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-24">
            {categoryServices.map((service, index) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="space-y-8">
                    <div className="space-y-4">
                      {service.badge && (
                        <span className="inline-block px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-bold uppercase tracking-widest border border-zinc-200">
                          {service.badge}
                        </span>
                      )}
                      <h2 className="text-4xl font-bold text-zinc-900 tracking-tight">{service.name}</h2>
                      <p className="text-lg text-zinc-600 leading-relaxed">
                        {service.shortDescription}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm text-zinc-700">
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-zinc-900" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-8 pt-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Starting Price</span>
                        <span className="text-3xl font-black text-zinc-900">
                          {(service.isSpecialty ? service.price.rv : service.price.car)
                            ? `From ${formatCurrency(service.isSpecialty ? service.price.rv : service.price.car)}`
                            : 'Custom quote'}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Duration</span>
                        <div className="flex items-center gap-2 text-zinc-900 font-bold">
                          <Clock className="h-4 w-4" />
                          {typeof service.duration === "string" ? service.duration : `${service.duration.car || service.duration.rv || Object.values(service.duration)[0]} (varies)`}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-4">
                      <Button size="lg" className="h-14 px-10 text-lg flex gap-2" asChild>
                        <Link to={`/book?serviceId=${service.id}`} onClick={() => trackEvent('begin_booking', { location: 'category_card', service_id: service.id, category: category.slug })}>
                          <Calendar className="h-5 w-5" />
                          Book This Service
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" className="h-14 px-10 text-lg" asChild>
                        <Link to={`/services/${service.id}`}>Learn More</Link>
                      </Button>
                      <Button variant="ghost" className="h-14 px-6 text-zinc-500" asChild>
                        <Link to="/quote">Custom Quote</Link>
                      </Button>
                    </div>

                    {/* Service Fit Logic */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
                      <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3" /> Best For
                        </h4>
                        <ul className="space-y-2 text-xs text-zinc-700 font-medium">
                          <li>• Vehicles with {category.name.toLowerCase()} concerns</li>
                          <li>• Drivers looking for this specific result</li>
                          <li>• Vehicles whose condition matches the listed scope</li>
                        </ul>
                      </div>
                      <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
                          <ArrowRight className="h-3 w-3" /> Consider a different package if
                        </h4>
                        <ul className="space-y-2 text-xs text-zinc-500 font-medium">
                          <li>• Your vehicle only needs routine maintenance cleaning</li>
                          <li>• Surface damage requires a body-shop repair</li>
                          <li>• The condition needs a custom inspection before booking</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="aspect-4/3 rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10">
                    <img 
                      src={service.image || category.image} 
                      alt={service.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Decorative backgrounds */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-zinc-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" />
                  <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-zinc-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <RelatedGuides
        topic={guideTopicForCategory(category.id)}
        heading={`${category.name} guides and comparisons`}
        intro="Understand the process, expected results, and maintenance considerations before selecting a package."
      />

      {/* Trust Bar */}
      <section className="py-20 bg-zinc-50 border-t border-zinc-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-zinc-100">
                <MapPin className="h-6 w-6 text-zinc-900" />
              </div>
              <h4 className="font-bold text-zinc-900">Flexible Service</h4>
              <p className="text-xs text-zinc-500">Mobile or Bellevue drop-off</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-zinc-100">
                <ShieldCheck className="h-6 w-6 text-zinc-900" />
              </div>
              <h4 className="font-bold text-zinc-900">Owner-Operated</h4>
              <p className="text-xs text-zinc-500">Direct quality control</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-zinc-100">
                <Calendar className="h-6 w-6 text-zinc-900" />
              </div>
              <h4 className="font-bold text-zinc-900">Easy Booking</h4>
              <p className="text-xs text-zinc-500">View current Square availability</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-zinc-100">
                <Sparkles className="h-6 w-6 text-zinc-900" />
              </div>
              <h4 className="font-bold text-zinc-900">Premium Products</h4>
              <p className="text-xs text-zinc-500">Products matched to each material</p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-24 bg-zinc-900 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to choose the right service?</h2>
          <p className="text-xl text-zinc-400">
            Compare the service scope, then view current appointment availability. Bryan provides owner-operated detailing with mobile service and Bellevue drop-off options.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-14 px-10 text-lg bg-white text-zinc-950 hover:bg-zinc-200" asChild>
              <Link to="/book" onClick={() => trackEvent('begin_booking', { location: 'category_footer', category: category.slug })}>Book Appointment Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-zinc-700 hover:bg-zinc-800" asChild>
              <Link to="/services">Explore More Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
