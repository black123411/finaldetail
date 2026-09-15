import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Check, MessageSquare, ShieldCheck } from 'lucide-react';
import { PHOTOS } from '@/shared/data/photos';
import { SERVICES, type Service } from '@/shared/data/services';
import { formatCurrency } from '../lib/utils';
import RelatedGuides from '../components/RelatedGuides';
import { getSquareBookingLink } from '../lib/constants';
import { trackBookingHandoff, trackEvent } from '../lib/analytics';

const coatingIds = ['system-x-crystal-plus', 'system-x-pro-plus', 'system-x-max-g-plus', 'system-x-phantom-2k'] as const;
const packages = coatingIds.map((id) => SERVICES.find((service) => service.id === id)).filter((service): service is Service => Boolean(service));
const textPhotosLink = 'sms:+17123056313?body=Hi%20Bryan%2C%20I%27m%20interested%20in%20ceramic%20coating.%20Here%20are%20photos%20of%20my%20vehicle%20and%20paint%20condition%3A';

const warrantyLabels: Record<string, string> = {
  'system-x-crystal-plus': '2-year System X warranty',
  'system-x-pro-plus': '6-year System X warranty',
  'system-x-max-g-plus': 'Lifetime-warranty eligibility',
  'system-x-phantom-2k': 'Flagship two-part System X coating',
};

const faqs = [
  {
    question: 'Does my vehicle need paint correction before ceramic coating?',
    answer: 'The paint is inspected before coating. The amount of polishing or correction depends on the package and the condition of the finish. Coating over visible swirls, oxidation or bonded contamination would lock those defects underneath the coating, so preparation comes first.',
  },
  {
    question: 'How much does ceramic coating cost in Bellevue and Omaha?',
    answer: 'System X packages currently start at $699 for Crystal+ Essential, $1,099 for Pro+ Signature, $1,599 for MAX G+ Ultimate and $1,999 for Phantom 2K Bespoke on a car. Larger vehicles and paint that requires additional correction cost more.',
  },
  {
    question: 'Is ceramic coating scratch-proof?',
    answer: 'No. Ceramic coating improves chemical resistance, water behavior, gloss retention and ease of maintenance, but it does not make paint immune to scratches, rock chips or improper washing.',
  },
  {
    question: 'Do ceramic coating appointments require a deposit?',
    answer: 'Yes. Ceramic coating appointments require a deposit when the booking is reserved. The current booking flow shows the applicable appointment and payment requirements before confirmation.',
  },
  {
    question: 'How should a ceramic-coated vehicle be maintained?',
    answer: 'Use coating-safe hand washing or another low-contact wash method, remove contamination promptly and follow the aftercare guidance provided after installation. Warranty eligibility can also depend on System X registration and required inspections for the selected coating.',
  },
];

function startPrice(service: Service) {
  const prices = Object.values(service.price).filter((price) => price > 0);
  return prices.length ? Math.min(...prices) : 0;
}

export default function CeramicCoating() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'System X Ceramic Coating in Bellevue & Omaha',
    description: 'Certified System X ceramic coating installation with paint preparation, correction options and aftercare for Bellevue and Omaha-area vehicles.',
    provider: {
      '@type': 'AutomotiveBusiness',
      '@id': 'https://bryansdetailingomaha.com/#business',
      name: "Bryan's Showroom Quality Mobile Detailing",
    },
    areaServed: ['Bellevue, NE', 'Omaha, NE', 'Papillion, NE', 'La Vista, NE'],
    offers: packages.map((service) => ({
      '@type': 'Offer',
      name: service.name,
      priceCurrency: 'USD',
      price: String(startPrice(service)),
      url: `https://bryansdetailingomaha.com/services/${service.id}`,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Helmet>
        <meta property="og:image" content={PHOTOS.vwGolfBlue} />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto grid gap-10 px-4 py-14 lg:grid-cols-[1fr_.95fr] lg:items-center lg:py-20">
          <div className="max-w-3xl">
            <p className="font-black text-blue-700">System X Certified Installer</p>
            <h1 className="mt-4 text-5xl font-black leading-[.98] tracking-tight sm:text-6xl">Ceramic Coating in Bellevue &amp; Omaha</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Certified System X ceramic coating for drivers who want longer-lasting paint protection, stronger water behavior, easier maintenance and improved gloss. I inspect and prepare the paint before coating it so the protection is installed over a properly prepared surface.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#packages" className="inline-flex min-h-14 items-center justify-center bg-blue-600 px-7 font-black text-white hover:bg-blue-700">Compare Coating Packages</a>
              <a href={textPhotosLink} onClick={() => trackEvent('click_text_quote', { location: 'ceramic_hero' })} className="inline-flex min-h-14 items-center justify-center gap-2 border border-slate-300 px-7 font-black text-slate-900 hover:border-blue-600 hover:text-blue-700"><MessageSquare className="h-5 w-5" /> Text Paint Photos</a>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">Ceramic coating appointments require a deposit. Final preparation depends on the paint condition and selected package.</p>
          </div>
          <img src={PHOTOS.vwGolfBlue} alt="System X ceramic coating result on a blue vehicle in Bellevue Nebraska" className="aspect-[4/3] w-full object-cover" referrerPolicy="no-referrer" />
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="container mx-auto grid px-4 md:grid-cols-4">
          {[
            'Certified System X installation',
            'Paint preparation before coating',
            'CARFAX registration where applicable',
            'Aftercare guidance included',
          ].map((item) => <div key={item} className="flex min-h-20 items-center gap-3 border-b border-slate-800 py-4 last:border-b-0 md:border-b-0 md:border-r md:px-5 first:pl-0 last:border-r-0"><Check className="h-5 w-5 shrink-0 text-blue-400" /><span className="text-sm font-black">{item}</span></div>)}
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[.78fr_1.22fr]">
          <div><h2 className="text-4xl font-black tracking-tight">What ceramic coating does</h2><p className="mt-4 text-lg leading-8 text-slate-600">A professionally installed coating becomes the protective surface over prepared paint. It is designed to improve gloss retention, water behavior and resistance to common environmental contamination while making routine washing easier.</p></div>
          <div className="grid gap-px bg-slate-200 sm:grid-cols-2">
            {[
              ['Water behavior', 'Water beads and releases more readily from the coated surface, helping reduce how strongly routine road film clings.'],
              ['Chemical resistance', 'The coating adds resistance to common environmental contamination such as bug residue, bird droppings and road grime. Prompt removal still matters.'],
              ['Gloss retention', 'Proper preparation and coating can improve the finished appearance and help the paint maintain gloss when it is cared for correctly.'],
              ['Easier maintenance', 'A slicker coated surface is generally easier to wash than unprotected paint, but the vehicle still needs proper maintenance.'],
            ].map(([title, body]) => <article key={title} className="bg-white p-6"><h3 className="text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-slate-600">{body}</p></article>)}
          </div>
        </div>
      </section>

      <section id="packages" className="scroll-mt-28 border-y border-slate-200 bg-slate-50 py-14 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-7 border-b-2 border-slate-950 pb-7 lg:grid-cols-[.72fr_1.28fr]">
            <h2 className="text-4xl font-black tracking-tight">System X Ceramic Coating Packages</h2>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">Choose the level of preparation and protection that fits the vehicle. Every package has its own service page with vehicle-size pricing and the work included.</p>
          </div>

          <div className="divide-y divide-slate-300 border-b border-slate-300">
            {packages.map((service) => (
              <article key={service.id} className="grid gap-6 py-8 lg:grid-cols-[.8fr_1.3fr_auto] lg:items-start">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.14em] text-blue-700">{warrantyLabels[service.id]}</p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight">{service.name}</h3>
                  <p className="mt-2 text-lg font-black">From {formatCurrency(startPrice(service))}</p>
                </div>
                <div>
                  <p className="font-semibold leading-7 text-slate-800">{service.shortDescription}</p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">{service.features.slice(0, 6).map((feature) => <li key={feature} className="flex gap-2 text-sm leading-6 text-slate-700"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />{feature}</li>)}</ul>
                </div>
                <div className="flex flex-wrap gap-2 lg:flex-col">
                  <a href={getSquareBookingLink(service.id)} onClick={(event) => trackBookingHandoff(event, { location: 'ceramic_packages', service_id: service.id })} className="inline-flex min-h-11 items-center justify-center bg-blue-600 px-5 font-black text-white hover:bg-blue-700">Check Availability</a>
                  <Link to={`/services/${service.id}`} className="inline-flex min-h-11 items-center justify-center border border-slate-300 bg-white px-5 font-bold hover:border-blue-600 hover:text-blue-700">View Package Details</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[1fr_.85fr] lg:items-start">
          <div>
            <h2 className="text-4xl font-black tracking-tight">Paint preparation comes first</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Ceramic coating should not be used to hide defects. I wash and decontaminate the paint, inspect the finish and use the polishing or correction appropriate for the selected package and the actual condition of the vehicle.</p>
            <div className="mt-7 divide-y divide-slate-200 border-y border-slate-200">
              {[
                'Wash and remove bonded contamination before coating.',
                'Inspect the finish for swirls, oxidation, scratches and previous paint damage.',
                'Polish or correct the paint according to the selected package and safe limits of the finish.',
                'Prepare the surface and install the selected System X coating.',
                'Provide registration and aftercare information when applicable.',
              ].map((item, index) => <div key={item} className="grid gap-3 py-4 sm:grid-cols-[36px_1fr]"><span className="flex h-8 w-8 items-center justify-center bg-slate-950 text-xs font-black text-white">{index + 1}</span><p className="leading-7 text-slate-700">{item}</p></div>)}
            </div>
          </div>
          <aside className="border-l-4 border-blue-600 bg-slate-50 p-7">
            <ShieldCheck className="h-8 w-8 text-blue-700" />
            <h3 className="mt-4 text-2xl font-black">What coating does not do</h3>
            <ul className="mt-5 space-y-4 text-slate-700">
              {['It does not make paint scratch-proof.', 'It does not stop rock chips or impact damage.', 'It does not replace proper washing and maintenance.', 'It does not correct defects that were left in the paint before installation.'].map((item) => <li key={item} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" /><span className="leading-7">{item}</span></li>)}
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-14 lg:py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[.65fr_1.35fr]">
          <div><h2 className="text-4xl font-black tracking-tight">Ceramic coating questions</h2><p className="mt-4 leading-7 text-slate-600">The paint condition, vehicle size and selected package all affect the final preparation and appointment.</p></div>
          <div className="divide-y divide-slate-300 border-y border-slate-300">{faqs.map((faq) => <article key={faq.question} className="py-5"><h3 className="text-lg font-black">{faq.question}</h3><p className="mt-2 leading-7 text-slate-600">{faq.answer}</p></article>)}</div>
        </div>
      </section>

      <RelatedGuides topic="ceramic" heading="Ceramic coating guides and comparisons" intro="Learn how ceramic coating differs from wax, why paint preparation matters and how to maintain protected paint after installation." />

      <section className="bg-slate-950 py-14 text-white">
        <div className="container mx-auto flex flex-col justify-between gap-7 px-4 md:flex-row md:items-center">
          <div className="max-w-2xl"><h2 className="text-3xl font-black tracking-tight">Not sure which coating package fits?</h2><p className="mt-3 leading-7 text-slate-300">Send paint photos and tell me the year, make, model and what you want from the coating. I can recommend the appropriate package before you reserve it.</p></div>
          <div className="flex flex-col gap-3 sm:flex-row"><a href={textPhotosLink} onClick={() => trackEvent('click_text_quote', { location: 'ceramic_footer' })} className="inline-flex min-h-14 items-center justify-center gap-2 bg-blue-600 px-7 font-black text-white hover:bg-blue-700"><MessageSquare className="h-5 w-5" /> Text Paint Photos</a><Link to="/services/category/paint-correction" className="inline-flex min-h-14 items-center justify-center gap-2 border border-slate-600 px-7 font-black text-white hover:border-blue-400">Compare Paint Correction <ArrowRight className="h-5 w-5" /></Link></div>
        </div>
      </section>
    </div>
  );
}
