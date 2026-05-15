import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Shield, Droplets, Sun, Zap, Star, CheckCircle2, ArrowRight, Award, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { PHOTOS } from '@/shared/data/photos';

const BENEFITS = [
  {
    icon: Droplets,
    title: 'Hydrophobic Water Beading',
    desc: 'Water sheets off instantly. Rain, mud, and road spray bead up and roll away — keeping your car cleaner longer.',
  },
  {
    icon: Sun,
    title: 'UV & Oxidation Protection',
    desc: "Nebraska sun is brutal. Ceramic coating blocks UV rays that fade and oxidize clear coat, preserving your paint's depth and color.",
  },
  {
    icon: Shield,
    title: 'Chemical Resistance',
    desc: 'Bird droppings, tree sap, bug splatter, road salt — all repelled by the ceramic layer before they can etch your paint.',
  },
  {
    icon: Zap,
    title: '80% Easier Maintenance',
    desc: 'Contaminants have no grip on the ceramic surface. Your car stays cleaner between washes and washes faster when it needs one.',
  },
];

const PACKAGES = [
  {
    name: '3-Year Ceramic Coating',
    price: { car: 700, suv: 800, truck: 900, xl: 1000 },
    duration: '1–2 Days',
    features: [
      'Professional System X Coating',
      '3-Year Durability Guarantee',
      'Hydrophobic Water Beading',
      'UV & Chemical Resistance',
      'Full Decontamination Prep Wash',
      'Gloss Enhancement Included',
    ],
    badge: null,
    highlight: false,
  },
  {
    name: 'Protection Package',
    price: { car: 999, suv: 1199, truck: 1399, xl: 1599 },
    duration: '2 Days',
    features: [
      'Everything in 3-Year Coating',
      'Full Paint Correction First',
      'Permanent Defect Removal',
      'Windshield Coating Included',
      'Wheel Face Coating Included',
      'Maximum Gloss & Depth',
    ],
    badge: 'Most Popular',
    highlight: true,
  },
];

const FAQS = [
  {
    q: 'How long does ceramic coating last?',
    a: "Our System X professional coating is rated for 3 years of durability with proper maintenance. With our quarterly maintenance wash plan, it can protect your vehicle's paint even longer.",
  },
  {
    q: 'Does my car need paint correction before ceramic coating?',
    a: "If your paint has visible swirl marks or scratches, yes — ceramic coating will lock those in permanently. Our Protection Package includes a full paint correction first to guarantee a flawless result.",
  },
  {
    q: 'How much does ceramic coating cost in Omaha?',
    a: 'Our professional ceramic coating starts at $700 for a sedan and goes up based on vehicle size. Our Protection Package (paint correction + ceramic) starts at $999. Both include a prep wash and are significantly less expensive than paint protection film (PPF).',
  },
  {
    q: 'How do I maintain a ceramic-coated vehicle?',
    a: "Avoid automatic car washes — the brushes and harsh chemicals degrade the coating. Hand washing or touchless car washes are safe. We offer a monthly Maintenance Plan ($119+) that uses coating-safe wash methods to preserve and refresh your investment.",
  },
  {
    q: 'Are you a certified ceramic coating installer?',
    a: 'Yes — Bryan is a System X certified installer. System X is a professional-grade ceramic coating brand available only through certified installers, which ensures a higher quality application than DIY consumer coatings.',
  },
];

const schemaData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Ceramic Coating Omaha NE',
  description:
    "Professional System X ceramic coating installation in Bellevue and Omaha, Nebraska. Bryan's Showroom Quality Detailing is a certified installer offering 3-year and permanent protection packages.",
  provider: {
    '@type': 'LocalBusiness',
    name: "Bryan's Showroom Quality Detailing",
    telephone: '(712) 305-6313',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bellevue',
      addressRegion: 'NE',
      postalCode: '68123',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 41.156, longitude: -95.896 },
    areaServed: ['Bellevue, NE', 'Omaha, NE', 'Papillion, NE', 'La Vista, NE', 'Ralston, NE'],
    priceRange: '$$$',
  },
  offers: [
    {
      '@type': 'Offer',
      name: '3-Year Ceramic Coating',
      priceCurrency: 'USD',
      price: '700',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Protection Package (Paint Correction + Ceramic)',
      priceCurrency: 'USD',
      price: '999',
      availability: 'https://schema.org/InStock',
    },
  ],
  areaServed: ['Bellevue, NE', 'Omaha, NE', 'Papillion, NE'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Ceramic Coating Services',
  },
};

export default function CeramicCoating() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Helmet>
        <title>Ceramic Coating Omaha & Bellevue NE | System X Certified Installer</title>
        <meta
          name="description"
          content="Professional ceramic coating in Omaha and Bellevue NE. Bryan is a System X certified installer offering 3-year paint protection starting at $700. Book a free assessment today."
        />
        <link rel="canonical" href="https://bryansdetailingomaha.com/ceramic-coating" />
        <meta property="og:title" content="Ceramic Coating Omaha NE – System X Certified | Bryan's Detailing" />
        <meta property="og:description" content="Professional ceramic coating starting at $700. System X certified installer serving Bellevue and Omaha NE. Real results, real durability." />
        <meta property="og:image" content={PHOTOS.vwGolfBlue} />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={PHOTOS.vwGolfBlue}
            alt="Ceramic coating result on blue car showing mirror-like reflection - Bryan's Showroom Quality Detailing Bellevue NE"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-24">
          <div className="max-w-2xl space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full">
                  <Award className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-400">System X Certified Installer</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
                Ceramic Coating<br />
                <span className="text-emerald-400 italic font-normal">Omaha & Bellevue</span>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-xl text-zinc-300 font-medium leading-relaxed max-w-xl"
            >
              Professional-grade ceramic protection that repels water, resists UV damage, and keeps
              your car looking showroom-new for years — not weeks.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button asChild className="h-16 px-10 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-base uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/30">
                <Link to="/book?serviceId=ceramic-3yr">Book a Free Assessment</Link>
              </Button>
              <Button asChild variant="outline" className="h-16 px-10 border-zinc-600 text-white hover:bg-zinc-800 font-black text-sm uppercase tracking-widest rounded-2xl">
                <Link to="/gallery">View Real Results →</Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 pt-4"
            >
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-zinc-300 font-bold text-sm">4.9 / 5.0 — 43 Google Reviews</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is Ceramic Coating */}
      <section className="py-24 bg-zinc-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-4 block">What It Is</span>
              <h2 className="text-4xl font-black tracking-tighter text-white mb-6 leading-tight">
                Not wax. Not a sealant.<br />
                <span className="text-zinc-400 italic font-normal">A permanent bond.</span>
              </h2>
              <p className="text-zinc-400 leading-relaxed font-medium mb-6">
                Ceramic coating is a liquid polymer that chemically bonds to your vehicle's clear coat at a
                molecular level — creating a permanent, glass-hard protective layer that doesn't wash away.
              </p>
              <p className="text-zinc-400 leading-relaxed font-medium mb-8">
                Unlike wax (lasts weeks) or sealant (lasts months), a professional System X ceramic coating
                lasts 3+ years and delivers protection that keeps getting better as the coating cures fully.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Wax', '4–8 Weeks'],
                  ['Sealant', '4–6 Months'],
                  ['Consumer Ceramic', '1 Year'],
                  ['System X Pro', '3+ Years ✅'],
                ].map(([type, duration]) => (
                  <div key={type} className={`p-4 rounded-xl border ${type === 'System X Pro' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-zinc-800/50 border-zinc-700'}`}>
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${type === 'System X Pro' ? 'text-emerald-400' : 'text-zinc-500'}`}>{type}</p>
                    <p className={`font-black text-lg ${type === 'System X Pro' ? 'text-white' : 'text-zinc-300'}`}>{duration}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src={PHOTOS.classicCarGloss}
                alt="Classic car with ceramic coating showing deep gloss and mirror reflection - Bellevue NE"
                className="rounded-3xl w-full object-cover aspect-square shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-4 -left-4 bg-emerald-500 rounded-2xl px-6 py-4 shadow-xl">
                <p className="text-black font-black text-sm uppercase tracking-wider">System X Certified</p>
                <p className="text-black/70 text-xs font-bold">Professional Grade Only</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-4 block">Why Ceramic</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">What You Actually Get</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-emerald-500/30 transition-colors duration-300"
              >
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <b.icon className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-black text-white mb-3 tracking-tight">{b.title}</h3>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-4 block">Pricing</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Ceramic Coating Packages</h2>
            <p className="text-zinc-400 mt-4 font-medium">All prices shown for sedans/coupes. SUVs +$100, trucks +$200, XL vehicles +$300.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-[2.5rem] p-10 relative flex flex-col ${pkg.highlight ? 'bg-zinc-900 border-2 border-emerald-500/40 shadow-2xl shadow-emerald-500/10' : 'bg-zinc-800/50 border border-zinc-700'}`}
              >
                {pkg.badge && (
                  <div className="absolute -top-4 left-10">
                    <span className="bg-emerald-500 text-black text-xs font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
                      {pkg.badge}
                    </span>
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-white tracking-tight mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">${pkg.price.car}</span>
                    <span className="text-zinc-400 font-medium">sedan</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-zinc-500 text-sm font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{pkg.duration}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-10 flex-grow">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="text-zinc-300 font-medium text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm ${pkg.highlight ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20' : 'bg-zinc-700 text-white hover:bg-zinc-600'}`}
                >
                  <Link to={`/book?serviceId=${pkg.highlight ? 'protection-package' : 'ceramic-3yr'}`} className="flex items-center justify-center gap-2">
                    Book This Package <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Strip */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white tracking-tight">Real Results from Real Jobs</h2>
            <p className="text-zinc-400 mt-2 font-medium">Photos taken right here in Bellevue and Omaha, NE</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[PHOTOS.vwGolfBlue, PHOTOS.corvetteRed, PHOTOS.classicCarGloss, PHOTOS.exteriorGloss, PHOTOS.detailWork, PHOTOS.interiorAfter1].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="aspect-square rounded-2xl overflow-hidden"
              >
                <img
                  src={src}
                  alt={`Auto detailing result Bryan's Showroom Quality Detailing Omaha Bellevue NE ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="border-zinc-600 text-white hover:bg-zinc-800 rounded-2xl px-8 h-14 font-black uppercase tracking-widest text-sm">
              <Link to="/gallery">View Full Gallery →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-zinc-900">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter text-white">Ceramic Coating FAQ</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-8"
              >
                <h3 className="font-black text-white text-lg tracking-tight mb-3">{faq.q}</h3>
                <p className="text-zinc-400 font-medium leading-relaxed text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-zinc-950">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 leading-tight">
            Ready to protect<br />
            <span className="text-emerald-400 italic font-normal">your investment?</span>
          </h2>
          <p className="text-zinc-400 font-medium mb-10 text-lg">
            Book a free ceramic coating assessment. I'll inspect your paint, answer your questions, and
            recommend the right package for your vehicle and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="h-16 px-12 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-base uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/30">
              <Link to="/book?serviceId=ceramic-3yr">Book Free Assessment</Link>
            </Button>
            <Button asChild variant="outline" className="h-16 px-12 border-zinc-600 text-white hover:bg-zinc-800 font-black text-sm uppercase tracking-widest rounded-2xl">
              <a href="tel:7123056313">(712) 305-6313</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
