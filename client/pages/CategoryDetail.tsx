import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowLeft, Calendar, ShieldCheck, Sparkles, Clock, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { SERVICES, CATEGORIES } from '@/shared/data/services';
import { BOOKING_LINK, getSquareBookingLink, isInquiryOnlyService } from '../lib/constants';
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
  const isQuoteCategory = category.id === 'tractor-detailing';

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
      <section className="relative isolate flex min-h-[60vh] items-center overflow-hidden bg-zinc-950 py-14 sm:py-16 lg:py-20">
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
            className="max-w-4xl space-y-5 sm:space-y-6"
          >
            <Button variant="ghost" className="text-white hover:bg-white/10 -ml-4" asChild>
              <Link to="/services">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Services
              </Link>
            </Button>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              {category.name}
              <span className="mt-3 block text-xl font-medium italic leading-tight text-zinc-300 sm:text-2xl lg:text-3xl">
                Owner-operated detailing in Bellevue & Omaha
              </span>
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-zinc-200 sm:text-xl">
              {category.description}
            </p>
            <div className={`grid gap-4 ${category.slug === 'interior-detailing' ? 'lg:grid-cols-2' : 'max-w-2xl'}`}>
              {category.slug === 'interior-detailing' ? (
                <div className="rounded-2xl border border-blue-500/30 bg-blue-950/45 p-5 text-blue-100 sm:p-6">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Lower-priced option</p>
                  <p className="text-base font-semibold leading-7 text-white sm:text-lg">
                    Maintenance Interior starts at <strong>${maintenanceService?.price.car ?? 139}</strong> for well-kept vehicles that need a light cabin refresh.
                  </p>
                </div>
              ) : null}
              <div className="rounded-2xl border border-white/15 bg-black/55 p-5 text-zinc-200 sm:p-6">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">{isQuoteCategory ? 'Get an accurate quote' : 'Check current availability'}</p>
                <p className="text-base font-semibold leading-7 sm:text-lg">
                  {isQuoteCategory ? 'Text a few clear photos so I can review the equipment and access before pricing the work.' : 'Choose an open date and time that works for you.'}
                </p>
                <Button asChild className="mt-4 h-12 w-full bg-blue-600 px-6 font-black text-white hover:bg-blue-500 sm:w-auto">
                  {isQuoteCategory ? (
                    <Link to="/quote" onClick={() => trackEvent('begin_quote', { location: 'category_hero', category: category.slug })}>Text Photos / Request Quote</Link>
                  ) : (
                    <a href={BOOKING_LINK} onClick={() => trackEvent('begin_booking', { location: 'category_hero', category: category.slug })}>Book a Detail</a>
                  )}
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                <ShieldCheck className="h-5 w-5 text-blue-400" />
                See exactly what is included
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                <Sparkles className="h-5 w-5 text-blue-400" />
                I handle the work myself
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] items-center">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Services and pricing</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-black tracking-tight text-zinc-950">
                {category.name} for Omaha and Bellevue drivers
              </h2>
              <p className="mt-4 text-lg leading-8 text-zinc-600">
                See what each service includes, how long it usually takes, and where pricing starts.
                I can come to you for many jobs. Longer services such as paint correction and ceramic coatings
                are completed at my Bellevue drop-off location.
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
      <section className="overflow-hidden py-24">
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

                    <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2">
                      <Button size="lg" className="h-auto min-h-14 w-full whitespace-normal px-5 py-3 text-base sm:text-lg" asChild>
                        {isInquiryOnlyService(service.id) ? (
                          <Link to="/quote" onClick={() => trackEvent('begin_quote', { location: 'category_card', service_id: service.id, category: category.slug })}>
                            <Calendar className="h-5 w-5" />
                            Request Quote
                          </Link>
                        ) : (
                          <a href={getSquareBookingLink(service.id)} onClick={() => trackEvent('begin_booking', { location: 'category_card', service_id: service.id, category: category.slug })}>
                            <Calendar className="h-5 w-5" />
                            Book This Service
                          </a>
                        )}
                      </Button>
                      <Button size="lg" variant="outline" className="h-auto min-h-14 w-full whitespace-normal px-5 py-3 text-base sm:text-lg" asChild>
                        <Link to={`/services/${service.id}`}>Learn More</Link>
                      </Button>
                      <Button variant="ghost" className="h-12 w-full text-zinc-600 sm:col-span-2" asChild>
                        <Link to="/quote">Custom Quote</Link>
                      </Button>
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
        intro="See how the work is done, what it can improve, and how to care for the vehicle afterward."
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
              <p className="text-xs text-zinc-500">I do the work myself</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-zinc-100">
                <Calendar className="h-6 w-6 text-zinc-900" />
              </div>
              <h4 className="font-bold text-zinc-900">Easy Booking</h4>
              <p className="text-xs text-zinc-500">Choose an available time online</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-zinc-100">
                <Sparkles className="h-6 w-6 text-zinc-900" />
              </div>
              <h4 className="font-bold text-zinc-900">Since 2017</h4>
              <p className="text-xs text-zinc-500">Years of hands-on detailing experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-24 bg-zinc-900 text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{isQuoteCategory ? 'Ready for an accurate quote?' : 'Ready to book?'}</h2>
          <p className="text-xl text-zinc-400">
            {isQuoteCategory ? 'Send clear photos of the equipment, buildup, and work area so I can review the job before giving you a price.' : 'Choose a service and view available appointments. If you are unsure, send me a few photos and I will help.'}
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-14 px-10 text-lg bg-white text-zinc-950 hover:bg-zinc-200" asChild>
              {isQuoteCategory ? (
                <Link to="/quote" onClick={() => trackEvent('begin_quote', { location: 'category_footer', category: category.slug })}>Text Photos / Request Quote</Link>
              ) : (
                <a href={BOOKING_LINK} onClick={() => trackEvent('begin_booking', { location: 'category_footer', category: category.slug })}>Book Appointment Now</a>
              )}
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
