import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import ServiceMap from '../components/ServiceMap';
import Testimonials from '../components/Testimonials';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import RelatedGuides from '../components/RelatedGuides';
import { SERVICES } from '@/shared/data/services';
import { BEFORE_AFTERS } from '@/shared/data/photos';

const HOME_BEFORE_AFTER_IDS = new Set([1, 2, 6, 7]);
const HOME_BEFORE_AFTERS = BEFORE_AFTERS.filter(({ id }) => HOME_BEFORE_AFTER_IDS.has(id));
import { CITIES } from '@/shared/data/cities';
import { trackEvent } from '../lib/analytics';
import { formatCurrency } from '../lib/utils';

const HOME_CONVERSION_PATHS = [
  {
    eyebrow: 'Stains, pet hair, spills, or odors',
    title: 'Clean my interior',
    description: 'Compare everyday interior cleaning, deeper restoration, and odor-treatment options.',
    primaryLabel: 'View Interior Details',
    primaryPath: '/services/category/interior-detailing',
  },
  {
    eyebrow: 'Inside and outside care',
    title: 'Detail my entire vehicle',
    description: 'Choose a complete detail for a daily driver, neglected vehicle, new car, or pre-sale reset.',
    primaryLabel: 'View Full Details',
    primaryPath: '/services/category/full-detailing',
  },
  {
    eyebrow: 'Swirls, oxidation, gloss, or protection',
    title: 'Restore or protect my paint',
    description: 'Compare correction for visible defects with ceramic protection for easier long-term care.',
    primaryLabel: 'Explore Paint Correction',
    primaryPath: '/services/category/paint-correction',
    secondaryLabel: 'View Ceramic Coating',
    secondaryPath: '/services/category/ceramic-coating',
  },
] as const;

export default function Home() {
  const trustPoints = [
    { label: 'Customer Feedback', value: 'Google Reviews', detail: 'Read current ratings and customer experiences' },
    { label: 'Certified Protection', value: 'System X', detail: 'Professional ceramic installer' },
    { label: 'Service Options', value: 'Mobile + Drop-off', detail: 'Bellevue base, Omaha metro service' },
    { label: 'Quality Control', value: 'Owner-Operated', detail: 'Clear scope before additional work' },
  ];

  const packageRows = [
    {
      service: SERVICES.find(s => s.id === 'maintenance-interior'),
      label: 'Maintenance Interior',
      bestFor: 'Well-kept vehicles needing a refresh without shampooing or extraction',
      outcome: 'Light interior refresh, glass cleaning, dash and mat care'
    },
    {
      service: SERVICES.find(s => s.id === 'interior-detail'),
      label: 'Signature Interior Detail',
      bestFor: 'Vehicles with normal dirt, dust, crumbs, and light staining',
      outcome: 'Vacuuming, compressed-air blowout, interior surfaces, mats, cupholders, dashboard, console, doors, plastics, glass, and light spot treatment'
    },
    {
      service: SERVICES.find(s => s.id === 'full-detail-package'),
      label: 'Signature Full Detail',
      bestFor: 'Seasonal cleanups, daily drivers, family vehicles, and routine professional care',
      outcome: 'Interior detailing plus exterior hand washing, wheels, tires, paint decontamination, and protective finishing'
    },
    {
      service: SERVICES.find(s => s.id === 'showroom-package'),
      label: 'Showroom Package',
      bestFor: 'Neglected, pre-sale, trade-in, or recently purchased vehicles',
      outcome: 'Interior restoration plus exterior decontamination and machine polishing to improve gloss and presentation'
    },
    {
      service: SERVICES.find(s => s.id === 'system-x-pro-plus'),
      label: 'System X Pro+ Signature',
      bestFor: 'Daily drivers seeking durable protection and easier maintenance washing',
      outcome: 'Paint enhancement plus certified System X Pro+ and Glass+ protection'
    }
  ].filter(row => row.service);

  const heroPrices = {
    interiorDetail: SERVICES.find(s => s.id === 'interior-detail')?.price.car ?? 179,
    interiorReset: SERVICES.find(s => s.id === 'interior-reset')?.price.car ?? 249,
    fullDetail: SERVICES.find(s => s.id === 'full-detail-package')?.price.car ?? 279,
  };

  const packageCards = [
    {
      service: SERVICES.find(s => s.id === 'interior-detail'),
      title: 'Interior Detail',
      description: 'Signature interior refresh for dust, crumbs, light stains, and glass cleaning.',
      detailPath: '/services/interior-detail',
      bookPath: '/book?serviceId=interior-detail',
    },
    {
      service: SERVICES.find(s => s.id === 'interior-reset'),
      title: 'Interior Restoration',
      description: 'Deep restoration for pet hair, embedded stains, and stale cabin odors.',
      detailPath: '/services/interior-reset',
      bookPath: '/book?serviceId=interior-reset',
    },
    {
      service: SERVICES.find(s => s.id === 'full-detail-package'),
      title: 'Inside & Out Detail',
      description: 'Complete inside-and-out detail for a showroom-ready finish.',
      detailPath: '/services/full-detail-package',
      bookPath: '/book?serviceId=full-detail-package',
    },
  ].filter(item => item.service);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] bg-zinc-950 text-white overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <picture className="block h-full w-full">
            <source srcSet="/hero-detailing-optimized.webp" type="image/webp" />
            <img
              src="/hero-detailing-optimized.jpg"
              alt="Professional auto detailing and paint correction"
              width="1024"
              height="1024"
              loading="eager"
              decoding="async"
              sizes="100vw"
              className="w-full h-full object-cover opacity-50 scale-105"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-xs font-black uppercase tracking-[0.2em] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
              <span>Mobile + Bellevue Drop-Off Detailing</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-[5.25rem] font-black tracking-tight leading-[0.92] uppercase">
              Mobile Car Detailing <span className="text-zinc-400 italic block font-normal normal-case">in Omaha & Bellevue, NE.</span>
            </h1>

          <p className="text-lg md:text-2xl text-zinc-300 max-w-2xl leading-relaxed font-medium mt-6">
            Professional interior detailing, complete inside-and-out details, paint correction, and ceramic coatings for cars, trucks, and SUVs.
            <span className="block mt-3">I provide mobile detailing throughout Bellevue and the Omaha metro when the service, weather, and location are a good fit. Bellevue drop-off and pickup options are also available for services that benefit from controlled working conditions.</span>
          </p>
          <p className="text-lg md:text-2xl text-emerald-300 max-w-2xl leading-relaxed font-semibold mt-4">
            Interior Detail ${heroPrices.interiorDetail} · Interior Restoration ${heroPrices.interiorReset} · Inside & Out Detail ${heroPrices.fullDetail}
          </p>
          <p className="mt-6 text-sm text-zinc-300 max-w-2xl leading-relaxed">
            View current appointment availability and choose an open date and time.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {packageCards.map((item) => (
              <article key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-xl shadow-black/20">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-300">{item.title}</p>
                    <p className="mt-2 text-3xl font-black tracking-tight text-white">${item.service?.price.car}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-zinc-300">{item.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button size="sm" variant="outline" className="h-11 rounded-xl border-zinc-700 bg-zinc-950/60 text-white hover:bg-zinc-900" asChild>
                    <Link to={item.detailPath}>View Details</Link>
                  </Button>
                  <Button size="sm" className="h-11 rounded-xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400" asChild>
                    <Link to={item.bookPath}>Book Now</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-6">
              <Button size="lg" className="h-16 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black uppercase tracking-widest text-sm shadow-2xl shadow-emerald-500/20" asChild>
                <Link
                  to="/book"
                  onClick={() => trackEvent('begin_booking', { location: 'home_hero' })}
                  className="flex items-center gap-3"
                >
                  <Calendar className="h-5 w-5" />
                  View Current Availability
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl border-zinc-700 bg-white/5 backdrop-blur-md text-white hover:bg-white hover:text-zinc-950 font-black uppercase tracking-widest text-sm" asChild>
                <Link
                  to="/services"
                  onClick={() => trackEvent('view_pricing', { location: 'home_hero' })}
                >
                  View Services & Pricing
                </Link>
              </Button>
              <Button size="lg" className="h-16 px-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950 font-black uppercase tracking-widest text-sm shadow-xl" asChild>
                <a
                  href="sms:+17123056313?body=Hi%20Bryan%2C%20I'd%20like%20a%20detailing%20quote%20for%20my%20car.%20Here%20are%20some%20photos%3A"
                  onClick={() => trackEvent('click_text_quote', { location: 'home_hero' })}
                  className="flex items-center gap-3"
                >
                  <MessageSquare className="h-5 w-5" />
                  Text Photos to Bryan
                </a>
              </Button>
            </div>


          </motion.div>
        </div>
      </section>

      {/* Trust + Price Clarity Section */}
      <section className="bg-white border-b border-zinc-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-200 border-x border-zinc-200">
            {trustPoints.map((point) => (
              <div key={point.label} className="bg-white px-5 py-7 md:px-8 md:py-9">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600 mb-2">{point.label}</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900">{point.value}</p>
                <p className="text-sm text-zinc-500 font-medium mt-2 leading-snug">{point.detail}</p>
              </div>
            ))}
          </div>

          <div className="py-24 lg:py-28 border-b border-zinc-200">
            <div className="max-w-3xl mb-12 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700">Choose Your Starting Point</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 leading-none">
                What does your vehicle need?
              </h2>
              <p className="text-lg text-zinc-600 font-medium leading-relaxed">
                Start with one clear path. Each page explains the right package, current pricing, and what to expect before you book.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {HOME_CONVERSION_PATHS.map((path, index) => (
                <article
                  key={path.title}
                  className={`rounded-[2rem] border p-7 md:p-8 flex flex-col min-h-[340px] ${index === 1 ? 'bg-zinc-950 border-zinc-950 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'}`}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-black ${index === 1 ? 'bg-emerald-500 text-zinc-950' : 'bg-white border border-zinc-200 text-zinc-500'}`}>
                    {index + 1}
                  </div>
                  <p className={`mt-8 text-[10px] font-black uppercase tracking-[0.22em] ${index === 1 ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    {path.eyebrow}
                  </p>
                  <h3 className="mt-3 text-3xl font-black tracking-tight">{path.title}</h3>
                  <p className={`mt-4 font-medium leading-relaxed ${index === 1 ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    {path.description}
                  </p>
                  <div className="mt-auto pt-8 flex flex-col gap-3">
                    <Link
                      to={path.primaryPath}
                      onClick={() => trackEvent('view_service_category', { location: 'home_conversion_path', category: path.primaryPath })}
                      className={`inline-flex min-h-12 items-center justify-between gap-3 rounded-xl px-5 py-3 text-xs font-black uppercase tracking-widest transition-colors ${index === 1 ? 'bg-white text-zinc-950 hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
                    >
                      {path.primaryLabel}
                      <ArrowRight className="h-4 w-4 shrink-0" />
                    </Link>
                    {'secondaryPath' in path ? (
                      <Link
                        to={path.secondaryPath}
                        onClick={() => trackEvent('view_service_category', { location: 'home_conversion_path', category: path.secondaryPath })}
                        className="inline-flex min-h-11 items-center justify-between gap-3 px-2 py-2 text-xs font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-950 transition-colors"
                      >
                        {path.secondaryLabel}
                        <ArrowRight className="h-4 w-4 shrink-0" />
                      </Link>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="py-24 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16 items-start">
              <div className="space-y-6 lg:sticky lg:top-24">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700">Package Clarity</span>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 leading-none">
                  Compare popular packages.
                </h2>
                <p className="text-lg text-zinc-600 font-medium leading-relaxed">
                  Most customers only need one of these four packages. Compare the starting price and choose the result that matches your vehicle.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button className="h-14 px-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 font-black uppercase tracking-widest text-xs" asChild>
                    <Link
                      to="/book"
                      onClick={() => trackEvent('begin_booking', { location: 'package_matrix' })}
                    >
                      Book Online
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-14 px-8 rounded-xl font-black uppercase tracking-widest text-xs border-zinc-200" asChild>
                    <a
                      href="sms:+17123056313?body=Hi%20Bryan%2C%20I%20need%20help%20choosing%20a%20detailing%20package.%20Here%20are%20photos%20of%20my%20vehicle%3A"
                      onClick={() => trackEvent('click_text_quote', { location: 'package_matrix' })}
                    >
                      Text Photos
                    </a>
                  </Button>
                </div>
              </div>

              <div className="bg-zinc-950 rounded-[2rem] overflow-hidden border border-zinc-800 shadow-2xl">
                <div className="hidden md:grid grid-cols-[1.2fr_0.85fr_1.35fr_0.65fr] gap-4 px-6 py-4 bg-zinc-900 text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">
                  <span>Package</span>
                  <span>Starts At</span>
                  <span>Best For</span>
                  <span>Action</span>
                </div>
                <div className="divide-y divide-zinc-800">
                  {packageRows.map((row, index) => {
                    const service = row.service!;
                    const startingPrice = service.price.car || service.price.suv || service.price.rv || Object.values(service.price)[0];

                    return (
                      <div key={service.id} className="grid grid-cols-1 md:grid-cols-[1.2fr_0.85fr_1.35fr_0.65fr] gap-4 px-6 py-6 md:items-center">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-black ${index === 1 ? 'bg-emerald-500 text-zinc-950' : 'bg-white/5 text-zinc-400 border border-white/10'}`}>
                              {index + 1}
                            </span>
                            <h3 className="text-xl font-black text-white tracking-tight">{row.label}</h3>
                          </div>
                          <p className="text-sm text-zinc-300 font-medium leading-relaxed md:hidden">{row.outcome}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300 md:hidden mb-1">Starts At</p>
                            <p className="text-2xl font-black text-white">{formatCurrency(startingPrice)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-300 font-bold leading-relaxed">{row.bestFor}</p>
                          <p className="text-xs text-zinc-500 font-medium leading-relaxed mt-1 hidden md:block">{row.outcome}</p>
                        </div>
                        <Button size="sm" className="h-11 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-black uppercase tracking-widest text-[10px]" asChild>
                          <Link
                            to={`/book?serviceId=${service.id}`}
                            onClick={() => trackEvent('begin_booking', { location: 'package_matrix_row', service_id: service.id })}
                          >
                            Book
                          </Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
                <div className="px-6 py-5 bg-zinc-900/80 border-t border-zinc-800">
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                    Final price depends on vehicle size, condition, pet hair, odor, and add-ons. You will see package pricing before confirming.
                  </p>
                  <p className="mt-3 text-xs text-zinc-300 font-medium leading-relaxed">
                    Book now to see live appointment availability for your vehicle and secure a weekend or evening slot.
                  </p>
                  <p className="mt-3 text-xs text-zinc-400 font-medium leading-relaxed">
                    Already detailed or ceramic coated? <Link to="/services/maintenance-detail" className="font-bold text-emerald-400 hover:text-emerald-300">Maintenance plans start at $119</Link> and are reserved for returning or recently detailed vehicles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before & After Section */}
      <section className="py-32 bg-zinc-900 text-white overflow-hidden relative border-t border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Before-and-After Results</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none uppercase">
              Real <span className="text-emerald-400 italic font-normal">Detailing</span> Results.
            </h2>
            <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Hover or slide to see results from paint correction and interior restoration services on Bellevue and Omaha client vehicles.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {HOME_BEFORE_AFTERS.map((t) => (
              <div key={t.id} className="space-y-4">
                <div className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative">
                  <BeforeAfterSlider beforeImage={t.before} afterImage={t.after} />
                </div>
                <div className="text-center">
                  <h3 className="font-black text-white text-lg tracking-tight">{t.label}</h3>
                  <p className="text-sm text-zinc-400 mt-1">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Me Section */}
      <section className="py-32 bg-zinc-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(52,211,153,0.05),transparent)] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Owner-Operated Auto Detailing</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none uppercase">
                   Clear Scope. <span className="text-zinc-500 italic block font-normal normal-case">Careful Work.</span>
                </h2>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-xl">
                  Every vehicle is inspected before work begins and matched with the service it actually needs. I do not rush vehicles through an assembly-line process or recommend unnecessary upgrades.
                </p>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-xl">
                  Bryan's Showroom Quality Detailing has served Bellevue and the Omaha metro since 2017. I bring years of professional detailing and paint-preparation experience to every job, from daily-driver interiors to paint correction and certified ceramic coatings.
                </p>
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-xl">
                  If the vehicle's condition changes the expected price or service, I explain it before additional work begins.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                       <ShieldCheck className="h-6 w-6 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold">Flexible Options</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed font-medium">I offer mobile detailing when the location and service are a good fit, plus Bellevue drop-off and pickup by appointment for controlled-condition work.</p>
                 </div>
                 <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                       <Sparkles className="h-6 w-6 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold">Material-Safe Process</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed font-medium">Products and tools are selected for the paint, fabric, leather, plastics, and trim being cleaned.</p>
                 </div>
              </div>

              <div className="pt-8">
                <Button size="lg" className="h-16 px-12 rounded-2xl bg-white text-zinc-950 font-black uppercase tracking-widest text-xs hover:bg-zinc-200" asChild>
                  <Link to="/services">View Services & Pricing</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] relative z-10 border border-white/10 group">
                <img 
                  src="/interior-detailing.png" 
                  alt="Precision detailing work" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              
              <div className="absolute bottom-4 right-4 md:-bottom-10 md:-right-10 bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl z-20 border border-zinc-100 text-zinc-950 group">
                <div className="flex items-center gap-6">
                  <div className="text-5xl font-black tracking-tighter">2017</div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 leading-tight">
                    Serving Bellevue and the Omaha metro since
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6 mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Customer Reviews</span>
            <h2 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tight leading-none uppercase">
               What <span className="text-emerald-700 italic font-medium tracking-tight normal-case">Customers</span> Say.
            </h2>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* Comprehensive SEO Content Section */}
      <section className="py-32 bg-white overflow-hidden border-t border-zinc-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700 mb-6 block">Professional Auto Detailing Bellevue & Omaha</span>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight mb-8">
              Why Choose Bryan's Showroom Quality Mobile Detailing?
            </h2>
            <div className="prose prose-lg prose-zinc max-w-none space-y-6 text-zinc-600 font-medium">
              <p>
                When it comes to <strong>auto detailing in Bellevue and Omaha</strong>, the right service depends on the vehicle condition. Bryan's Showroom Quality Mobile Detailing provides interior car detailing, hot water extraction, exterior hand washing, clay bar treatment, paint correction, ceramic coating, and maintenance detailing for daily drivers and specialty vehicles.
              </p>
              <h3 className="text-2xl font-bold text-zinc-900 mt-12 mb-4">Advanced Ceramic Coating and Paint Correction</h3>
              <p>
                Midwest weather is hard on clear coat. A professional <strong>ceramic coating</strong> can add water beading, UV resistance, gloss, and easier maintenance washing. Before applying long-term protection, Bryan can perform <strong>paint correction</strong> to reduce swirl marks, light scratches, wash haze, and oxidation.
              </p>
              <h3 className="text-2xl font-bold text-zinc-900 mt-12 mb-4">Interior Restoration and Odor Removal</h3>
              <p>
                A clean interior is essential for a comfortable driving experience. <strong>Interior detailing</strong> services can include vacuuming, compressed-air blowout, pet hair removal, stain treatment, hot water extraction, steam cleaning where safe, glass cleaning, mat cleaning, and odor source cleaning.
              </p>
              <h3 className="text-2xl font-bold text-zinc-900 mt-12 mb-4">Flexible Mobile & Drop-Off Options</h3>
              <p>
                I offer Bellevue drop-off for services that need controlled conditions, like ceramic coating and paint correction, as well as <strong>mobile auto detailing</strong> throughout the Omaha metro area when the service, weather, space, and vehicle condition are a good fit.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedGuides
        topic="home"
        heading="Plan your next detail with confidence"
        intro="Compare service formats, build a realistic maintenance schedule, and prepare your vehicle for Nebraska weather before choosing a package."
      />

      {/* Service Area Grid */}
      <section className="py-32 bg-zinc-50 border-t border-zinc-200">
         <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6 mb-16 text-center">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Local Operations</span>
               <h2 className="text-5xl md:text-6xl font-black text-zinc-900 tracking-tight leading-none uppercase">
                  Service <span className="text-emerald-700 italic font-medium tracking-tight normal-case">Radius.</span>
               </h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto font-medium">Based in Bellevue with drop-off and pickup by appointment, plus mobile options throughout the Omaha metro when conditions allow.</p>
            </div>
            <ServiceMap />
         </div>
      </section>

      {/* Local SEO / Service Area Section */}
      <section className="py-24 lg:py-28 bg-white border-t border-zinc-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-700">Omaha Metro Detailing</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 leading-none">
              Mobile detailing in Omaha. <span className="text-emerald-700 italic font-medium">Bellevue drop-off.</span>
            </h2>
            <p className="text-lg md:text-xl text-zinc-600 font-medium leading-relaxed">
              Bryan's Showroom Quality Mobile Detailing is based in Bellevue and serves drivers around the Omaha metro.
              Mobile appointments are available where the vehicle and site are suitable, while the Bellevue location is
              available for intensive interior restoration, paint correction, ceramic coating, and other work that benefits
              from a controlled setting.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <article className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Omaha</p>
              <h3 className="mt-3 text-3xl font-black text-zinc-900">Mobile Car Detailing in Omaha, NE</h3>
              <p className="mt-4 text-zinc-600 leading-7">
                Interior detailing, full details, paint correction, ceramic coating, maintenance care, and
                condition-based specialty work for Omaha drivers.
              </p>
              <Link to="/areas/omaha-ne" className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-900 hover:text-emerald-700">
                Explore Omaha Detailing <ArrowRight className="h-4 w-4" />
              </Link>
            </article>

            <article className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Bellevue</p>
              <h3 className="mt-3 text-3xl font-black text-zinc-900">Car Detailing in Bellevue, NE</h3>
              <p className="mt-4 text-zinc-600 leading-7">
                Convenient Bellevue drop-off plus mobile service for routine detailing, with specialized paint and
                ceramic-coating services for vehicles that need more intensive preparation.
              </p>
              <Link to="/areas/bellevue-ne" className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-900 hover:text-emerald-700">
                Explore Bellevue Detailing <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-semibold text-zinc-500">
            {['Papillion', 'La Vista', 'Ralston', 'Gretna', 'Elkhorn', 'Council Bluffs', 'Offutt AFB'].map((area) => (
              <span key={area} className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2">{area}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-zinc-50 overflow-hidden border-t border-zinc-200">
        <div className="container mx-auto px-4 max-w-4xl">
           <div className="text-center space-y-6 mb-16">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Common Questions</span>
             <h2 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tight leading-none uppercase">
                Common <span className="text-emerald-700 italic font-medium tracking-tight normal-case">Questions.</span>
             </h2>
           </div>
           
           <div className="space-y-4">
              {[
                  { q: "How long does a Full Detail take?", a: "Most full details require several hours. Exact timing depends on vehicle size, condition, package selection, and any additional treatment required." },
                  { q: "Do you come to me or do I drop it off?", a: "Both options are available. I offer mobile service when the location and conditions are suitable, plus Bellevue drop-off and pickup by appointment for intensive work such as paint correction and ceramic coating." },
                  { q: "What's the difference between Wax and Ceramic Coating?", a: "Wax is a temporary protective layer. A professional ceramic coating is applied to properly prepared paint and can provide more durable gloss, chemical resistance, water behavior, and easier maintenance washing. Neither replaces safe washing or prevents every defect." },
                  { q: "Can every interior stain be removed?", a: "Not always. Hot-water extraction and professional stain treatment can improve many stains, but permanent dye transfer, material damage, or old chemical reactions may remain. Bryan explains realistic expectations after inspecting the vehicle." },
              ].map((faq, i) => (
                 <div key={i} className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm transition-all hover:shadow-md">
                    <h3 className="text-lg font-black text-zinc-900 mb-3">{faq.q}</h3>
                    <p className="text-zinc-500 font-medium leading-relaxed">{faq.a}</p>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-zinc-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
           <img src="/methodology-workspace.png" className="w-full h-full object-cover" alt="Detailing background" loading="lazy" />
        </div>
        <div className="container mx-auto px-4 max-w-4xl relative z-10 space-y-12">
          <div className="space-y-6">
             <h2 className="text-5xl md:text-[5rem] font-black tracking-tighter leading-none uppercase">Ready to get your <span className="text-zinc-500 italic block font-normal normal-case">vehicle back in shape?</span></h2>
             <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto">
               Choose a service and request an available appointment time online. Bryan confirms the booking details through Square.
             </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
            <Button size="lg" className="h-16 px-12 bg-white text-zinc-950 hover:bg-zinc-200 rounded-2xl font-black uppercase tracking-widest text-xs" asChild>
              <Link
                to="/book"
                onClick={() => trackEvent('begin_booking', { location: 'home_footer_cta' })}
              >
                View Availability
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-12 border-zinc-700 text-white hover:bg-zinc-800 rounded-2xl font-black uppercase tracking-widest text-xs" asChild>
              <a
                href="tel:712-305-6313"
                className="flex items-center gap-3"
                onClick={() => trackEvent('click_call', { location: 'home_footer_cta' })}
              >
                 Call (712) 305-6313
              </a>
            </Button>
          </div>
           <p className="text-zinc-600 text-xs font-bold tracking-[0.3em] uppercase">Bellevue | Omaha | Papillion | La Vista</p>
        </div>
      </section>
    </div>
  );
}
