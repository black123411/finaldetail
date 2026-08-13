import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Shield, Droplets, Sun, Zap, Star, CheckCircle2, ArrowRight, Award, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { PHOTOS } from '@/shared/data/photos';
import { formatCurrency } from '../lib/utils';
import RelatedGuides from '../components/RelatedGuides';

const BENEFITS = [
  {
    icon: Droplets,
    title: 'Hydrophobic Water Beading',
    desc: 'Water beads and releases more readily, helping rain, mud, and road spray wash away more easily between maintenance washes.',
  },
  {
    icon: Sun,
    title: 'UV & Oxidation Protection',
    desc: "Nebraska sun is hard on paint. Ceramic coating helps reduce the effects of UV exposure and supports gloss retention when the vehicle is maintained.",
  },
  {
    icon: Shield,
    title: 'Chemical Resistance',
    desc: 'The coating helps reduce how strongly bird droppings, tree sap, bug splatter, and road salt cling to prepared paint. Prompt removal is still important.',
  },
  {
    icon: Zap,
    title: 'Easier Maintenance Washing',
    desc: 'Contaminants are less likely to cling to the coated surface, which can make routine washing easier when the vehicle is maintained correctly.',
  },
];

const PACKAGES = [
  {
    serviceId: 'system-x-crystal-plus',
    name: 'Crystal+ Essential',
    price: { car: 699, suv: 799, truck: 899, xl: 999 },
    duration: '1 Day',
    features: [
      'System X Crystal+ paint coating',
      '2-year warranty registration',
      'CARFAX coating registration',
      'Wash, iron removal & clay prep',
      'Light gloss-enhancement polish',
      'Coating aftercare guide',
    ],
    badge: 'Best Entry Value',
    highlight: false,
  },
  {
    serviceId: 'system-x-pro-plus',
    name: 'Pro+ Signature',
    price: { car: 1099, suv: 1249, truck: 1399, xl: 1549 },
    duration: '1–2 Days',
    features: [
      'System X Pro+ paint coating',
      'Up to 6 years of protection',
      'Single-stage paint enhancement',
      'System X Glass+ windshield coating',
      'CARFAX coating registration',
      'Full decontamination & aftercare',
    ],
    badge: 'Most Popular',
    highlight: true,
  },
  {
    serviceId: 'system-x-max-g-plus',
    name: 'MAX G+ Ultimate',
    price: { car: 1599, suv: 1749, truck: 1899, xl: 2099 },
    duration: '2 Days',
    features: [
      'System X MAX G+ paint coating',
      'Lifetime-warranty eligibility',
      'Single-stage paint correction',
      'System X Wheel+ on wheel faces',
      'System X Glass+ on windshield',
      'CARFAX registration & aftercare',
    ],
    badge: 'Complete Exterior',
    highlight: false,
  },
  {
    serviceId: 'system-x-phantom-2k',
    name: 'Phantom 2K Bespoke',
    price: { car: 1999, suv: 2199, truck: 2399, xl: 2599 },
    duration: '2–3 Days',
    features: [
      'System X Phantom 2K two-part coating',
      'One- or two-stage correction plan',
      'System X Wheel+ on wheel faces',
      'System X Glass+ on windshield',
      'Badges & applicable trim coated',
      'CARFAX registration & aftercare',
    ],
    badge: 'Flagship',
    highlight: false,
  },
];

const SYSTEM_X_ADDONS = [
  {
    name: 'Glass+ Windshield',
    price: '$149',
    serviceId: 'system-x-glass-plus',
    description: 'Hydrophobic windshield protection for clearer wet-weather driving and easier removal of bugs, ice, and road film.',
    included: 'Included with Pro+, MAX G+, and Phantom 2K',
  },
  {
    name: 'Wheel+ Face Protection',
    price: '$299–$379',
    serviceId: 'system-x-wheel-plus',
    description: 'Wheel-face decontamination and high-temperature protection against brake dust, pitting, and corrosion.',
    included: 'Included with MAX G+ and Phantom 2K',
  },
  {
    name: 'Complete Interior Protection',
    price: '$399–$499',
    serviceId: 'system-x-interior-protection',
    description: 'LVP protection for leather, vinyl, and plastic plus Textile protection for carpet and fabric surfaces.',
    included: 'Add to a fresh interior detail or coating package',
  },
  {
    name: 'Revive Trim Restoration',
    price: '$199–$279',
    serviceId: 'system-x-revive-trim',
    description: 'Restores faded unpainted exterior plastic and adds lasting UV and hydrophobic protection.',
    included: 'Quoted by the amount and condition of exterior trim',
  },
];

const SYSTEM_X_LINEUP = [
  {
    name: 'Crystal+',
    term: '2-Year Warranty',
    fit: 'Accessible professional protection',
    description: 'A slick, self-cleaning System X coating with CARFAX registration for drivers ready to move beyond wax and short-term sealants.',
    highlight: false,
  },
  {
    name: 'Pro+',
    term: 'Up to 6 Years',
    fit: 'Premium daily-driver protection',
    description: 'System X\'s high-gloss, ultra-hydrophobic 9H coating for owners who want a longer protection term and easier routine care.',
    highlight: true,
  },
  {
    name: 'MAX G+',
    term: 'Highest-Level Gloss',
    fit: 'Paint, gel coat, wraps and PPF',
    description: 'A premium MAX-resin coating focused on gloss retention, slickness and long-term presentation across multiple exterior surfaces.',
    highlight: false,
  },
  {
    name: 'Phantom 2K',
    term: 'Flagship Two-Part Coating',
    fit: 'Maximum-strength ceramic protection',
    description: 'System X\'s professional two-part coating for customers seeking its strongest cross-linked ceramic system and premium finish.',
    highlight: false,
  },
];

const SPECIALTY_COATINGS = [
  {
    name: 'Marine Protection',
    products: 'Phantom 2K Marine · Xtreme SS',
    description: 'Purpose-built options for boats, gel coat, UV exposure, exhaust soot and harsh marine environments.',
  },
  {
    name: 'Exterior Upgrades',
    products: 'Wheel+ · Glass+ · Revive',
    description: 'Targeted protection for wheels, windshields, exterior glass and faded plastic or trim.',
  },
  {
    name: 'Interior Protection',
    products: 'LVP · Textile',
    description: 'Flexible protection for leather, vinyl, plastic, carpet and fabric seating surfaces.',
  },
];

const FAQS = [
  {
    q: 'How long does ceramic coating last?',
    a: 'System X offers multiple professional coatings. Crystal+ carries a 2-year warranty and Pro+ offers up to 6 years, while MAX G+ and Phantom 2K serve premium applications. The right product depends on the surface, paint preparation, maintenance plan, and protection goal.',
  },
  {
    q: 'Does my car need paint correction before ceramic coating?',
    a: 'Every package includes the preparation listed for that tier. Pro+ includes a paint enhancement, MAX G+ includes single-stage correction, and Phantom 2K receives a vehicle-specific one- or two-stage correction plan after inspection.',
  },
  {
    q: 'How much does ceramic coating cost in Omaha?',
    a: 'System X Crystal+ Essential starts at $699 for a sedan, Pro+ Signature at $1,099, MAX G+ Ultimate at $1,599, and Phantom 2K Bespoke at $1,999. Vehicle size and paint condition determine the final price and prep work.',
  },
  {
    q: 'How do I maintain a ceramic-coated vehicle?',
    a: "Avoid automatic car washes — brushes and harsh chemicals can shorten coating life. Hand washing or a touchless wash is safer. A maintenance plan from $119 uses coating-safe wash methods to help keep the vehicle clean and the protection performing as expected.",
  },
  {
    q: 'Are you a certified ceramic coating installer?',
    a: 'Yes — Bryan is a System X certified installer and can recommend automotive, marine, glass, wheel, trim, leather, vinyl, plastic, carpet, and fabric protection options from the current System X product line.',
  },
];

const schemaData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Ceramic Coating Omaha NE',
  description:
    "Professional System X ceramic coating installation in Bellevue and Omaha, Nebraska. Certified Crystal+, Pro+, MAX G+, and Phantom 2K packages with proper paint preparation.",
  provider: {
    '@type': 'LocalBusiness',
    name: "Bryan's Showroom Quality Mobile Detailing",
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
      name: 'System X Crystal+ Essential',
      priceCurrency: 'USD',
      price: '699',
      availability: 'https://schema.org/PreOrder',
    },
    {
      '@type': 'Offer',
      name: 'System X Pro+ Signature',
      priceCurrency: 'USD',
      price: '1099',
      availability: 'https://schema.org/PreOrder',
    },
    { '@type': 'Offer', name: 'System X MAX G+ Ultimate', priceCurrency: 'USD', price: '1599', availability: 'https://schema.org/PreOrder' },
    { '@type': 'Offer', name: 'System X Phantom 2K Bespoke', priceCurrency: 'USD', price: '1999', availability: 'https://schema.org/PreOrder' },
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
        <meta property="og:image" content={PHOTOS.vwGolfBlue} />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={PHOTOS.vwGolfBlue}
            alt="Ceramic coating result on blue car showing mirror-like reflection - Bryan's Showroom Quality Mobile Detailing Bellevue NE"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-24">
          <div className="max-w-2xl space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 bg-blue-600/10 border border-blue-600/30 px-4 py-2 rounded-full">
                  <Award className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-black uppercase tracking-widest text-blue-400">System X Certified Installer</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
                Ceramic Coating<br />
                <span className="text-blue-400 italic font-normal">Omaha & Bellevue</span>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-xl text-zinc-300 font-medium leading-relaxed max-w-xl"
            >
              System X ceramic protection that improves water behavior, helps resist routine contamination and UV exposure, and makes regular washing easier when it is maintained correctly.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button asChild className="h-16 px-10 bg-blue-600 hover:bg-blue-400 text-black font-black text-base uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/30">
                <Link to="/book?serviceId=system-x-pro-plus">Book Pro+ Signature</Link>
              </Button>
              <Button asChild variant="outline" className="h-16 px-10 border-white/30 bg-zinc-950/70 text-white hover:border-white hover:bg-white hover:text-zinc-950 font-black text-sm uppercase tracking-widest rounded-2xl">
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
              <span className="text-zinc-300 font-bold text-sm">Read current customer reviews on Google</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is Ceramic Coating */}
      <section className="py-24 bg-zinc-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-4 block">What It Is</span>
              <h2 className="text-4xl font-black tracking-tighter text-white mb-6 leading-tight">
                Not wax. Not a quick spray.<br />
                <span className="text-zinc-400 italic font-normal">Long-term paint protection.</span>
              </h2>
              <p className="text-zinc-400 leading-relaxed font-medium mb-6">
                Ceramic coating is applied after proper washing, decontamination, and paint prep. It adds water beading,
                UV resistance, gloss, and easier maintenance washing compared with wax or basic sealants.
              </p>
              <p className="text-zinc-400 leading-relaxed font-medium mb-8">
                Unlike wax that lasts weeks or sealant that lasts months, a professional System X ceramic coating
                is designed for multi-year protection when it is installed and maintained correctly.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ['Wax', '4–8 Weeks'],
                  ['Sealant', '4–6 Months'],
                  ['Consumer Ceramic', '1 Year'],
                  ['Crystal+ / Pro+', '2–6 Years ✅'],
                ].map(([type, duration]) => (
                  <div key={type} className={`p-4 rounded-xl border ${type === 'Crystal+ / Pro+' ? 'bg-blue-600/10 border-blue-600/30' : 'bg-zinc-800/50 border-zinc-700'}`}>
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${type === 'Crystal+ / Pro+' ? 'text-blue-400' : 'text-zinc-500'}`}>{type}</p>
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
              <div className="absolute -bottom-4 -left-4 bg-blue-600 rounded-2xl px-6 py-4 shadow-xl">
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
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-4 block">Why Ceramic</span>
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
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-blue-600/30 transition-colors duration-300"
              >
                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6">
                  <b.icon className="h-6 w-6 text-blue-400" />
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
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-4 block">Pricing</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Ceramic Coating Packages</h2>
            <p className="text-zinc-400 mt-4 font-medium">Starting prices by package are shown below. Choose your vehicle size during booking; paint condition is confirmed before work begins.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-[2.5rem] p-10 relative flex flex-col ${pkg.highlight ? 'bg-zinc-900 border-2 border-blue-600/40 shadow-2xl shadow-blue-600/10' : 'bg-zinc-800/50 border border-zinc-700'}`}
              >
                {pkg.badge && (
                  <div className="absolute -top-4 left-10">
                    <span className="bg-blue-600 text-black text-xs font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg">
                      {pkg.badge}
                    </span>
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-white tracking-tight mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">{formatCurrency(pkg.price.car)}</span>
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
                      <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                      <span className="text-zinc-300 font-medium text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm ${pkg.highlight ? 'bg-blue-600 text-black hover:bg-blue-400 shadow-lg shadow-blue-600/20' : 'bg-zinc-700 text-white hover:bg-zinc-600'}`}
                >
                  <Link to={`/book?serviceId=${pkg.serviceId}`} className="flex items-center justify-center gap-2">
                    Book This Package <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Strip */}
      <section className="py-24 bg-zinc-950 border-y border-zinc-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-3xl mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-4 block">Certified Product Line</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-none">
              The right System X coating.<br />
              <span className="text-zinc-500 italic font-normal">Not one coating for every car.</span>
            </h2>
            <p className="mt-6 text-lg text-zinc-400 font-medium leading-relaxed">
              I install the current System X automotive and specialty lineup. I inspect the paint first, then explain the coating, correction work, warranty term, and price that fit the vehicle.
            </p>
          </div>

          <div className="border-t border-zinc-800">
            {SYSTEM_X_LINEUP.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className={`grid grid-cols-1 md:grid-cols-[0.8fr_1.4fr_auto] gap-5 md:gap-10 items-center py-9 border-b border-zinc-800 transition-colors ${product.highlight ? 'bg-blue-600/[0.06] -mx-4 px-4 md:-mx-8 md:px-8' : ''}`}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-3xl font-black tracking-tight text-white">{product.name}</h3>
                    {product.highlight && (
                      <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black">Recommended</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-black uppercase tracking-widest text-blue-400">{product.term}</p>
                </div>
                <div>
                  <p className="font-black text-zinc-200">{product.fit}</p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{product.description}</p>
                </div>
                <Button asChild variant="outline" className="h-12 border-zinc-700 text-white hover:bg-zinc-800 hover:border-blue-600/50 rounded-xl">
                  <Link to="/quote" className="flex items-center gap-2">
                    Get My Quote <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 mt-16 border-t border-zinc-800">
            {SPECIALTY_COATINGS.map((group, index) => (
              <motion.div
                key={group.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="py-8 md:px-8 md:first:pl-0 md:last:pr-0 border-b md:border-b-0 md:border-r md:last:border-r-0 border-zinc-800"
              >
                <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{group.name}</p>
                <h3 className="mt-3 text-xl font-black text-white">{group.products}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{group.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-l-4 border-blue-600 pl-6">
            <div>
              <p className="text-xl font-black text-white">Not sure which coating fits?</p>
              <p className="mt-1 text-zinc-400">Text photos or request a quote. I will match the product to the vehicle instead of pushing the longest warranty.</p>
            </div>
            <Button asChild className="h-14 shrink-0 bg-blue-600 hover:bg-blue-400 text-black font-black uppercase tracking-widest rounded-xl">
              <a href="sms:+17123056313?body=Hi%20Bryan%2C%20I%27d%20like%20a%20System%20X%20coating%20quote.%20My%20vehicle%20is%3A%20">Text Photos</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Certified upgrades */}
      <section className="border-y border-zinc-800 bg-zinc-950 py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <span className="mb-4 block text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Certified upgrades</span>
              <h2 className="text-4xl font-black tracking-tighter text-white md:text-5xl">Protect the surfaces you touch and clean most.</h2>
              <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-zinc-400">Add only what your vehicle needs. The package notes make it clear when Glass+ or Wheel+ is already included.</p>
            </div>

            <div className="border-t border-zinc-800">
              {SYSTEM_X_ADDONS.map((addon, index) => (
                <motion.div
                  key={addon.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="grid gap-5 border-b border-zinc-800 py-8 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                      <h3 className="text-2xl font-black tracking-tight text-white">{addon.name}</h3>
                      <span className="text-lg font-black text-blue-400">{addon.price}</span>
                    </div>
                    <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-zinc-400">{addon.description}</p>
                    <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">{addon.included}</p>
                  </div>
                  <Button asChild variant="outline" className="h-12 shrink-0 rounded-xl border-zinc-700 text-white hover:border-blue-600/50 hover:bg-zinc-800">
                    <Link to={`/book?addonId=${addon.serviceId}`} className="flex items-center gap-2">
                      Add to Booking <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>
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
                  alt={`Auto detailing result Bryan's Showroom Quality Mobile Detailing Omaha Bellevue NE ${i + 1}`}
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

      <RelatedGuides
        topic="ceramic"
        theme="dark"
        heading="Ceramic coating and paint-protection guides"
        intro="Compare ceramic coating with wax, understand paint correction before coating, and plan for Nebraska road conditions."
      />

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
            <span className="text-blue-400 italic font-normal">your paint?</span>
          </h2>
          <p className="text-zinc-400 font-medium mb-10 text-lg">
            Request a ceramic-coating inspection. I'll review your paint, answer your questions, and
            recommend the preparation and System X package that fits your vehicle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="h-16 px-12 bg-blue-600 hover:bg-blue-400 text-black font-black text-base uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/30">
              <Link to="/book?serviceId=system-x-pro-plus">Book Pro+ Signature</Link>
            </Button>
            <Button asChild variant="outline" className="h-16 px-12 border-zinc-600 text-white hover:bg-zinc-800 font-black text-sm uppercase tracking-widest rounded-2xl">
              <a href="tel:7123056313">(712) 305-6313</a>
            </Button>
          </div>
        </div>
      </section>
      
      {/* SEO Content Block */}
      <section className="py-24 bg-zinc-950 border-t border-zinc-900">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-white mb-6">
            The Science Behind System X Ceramic Coatings
          </h2>
          <p className="text-zinc-400 leading-relaxed font-medium mb-4 text-left">
            Wax and synthetic sealants provide shorter-term protection. A professional ceramic coating is applied to properly prepared paint to create a more durable protective layer with different maintenance and aftercare requirements.
          </p>
          <p className="text-zinc-400 leading-relaxed font-medium mb-4 text-left">
            As a certified System X installer in Bellevue, Nebraska, Bryan's Showroom Quality Mobile Detailing can match the current System X product line to automotive paint, marine surfaces, wheels, glass, trim, leather, vinyl, plastic, carpet, and fabric. Each surface receives the preparation and product intended for that application instead of a one-size-fits-all spray.
          </p>
          <p className="text-zinc-400 leading-relaxed font-medium text-left">
            A professional ceramic coating can improve gloss, water behavior, chemical resistance, and routine maintenance when the paint is properly prepared. It does not replace safe washing, prevent every defect, or guarantee a flawless finish.
          </p>
        </div>
      </section>
    </div>
  );
}
