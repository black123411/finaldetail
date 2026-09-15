import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, Loader2, MessageSquare } from 'lucide-react';
import { FAQAPI } from '../services/api';
import RelatedGuides from '../components/RelatedGuides';
import { trackEvent } from '../lib/analytics';

const textPhotosLink = 'sms:+17123056313?body=Hi%20Bryan%2C%20I%20have%20a%20question%20about%20detailing%20my%20vehicle.%20Here%20are%20photos%3A';

const DEFAULT_FAQS = [
  {
    question: 'How much does car detailing cost?',
    answer: 'Pricing depends on the service, vehicle size and condition. Maintenance Interior starts at $139, Signature Interior Detail starts at $179, Interior Restoration starts at $249 and Signature Full Detail starts at $279. Paint correction and ceramic coating are priced separately because the paint condition and preparation required can vary.',
    order: 1,
  },
  {
    question: 'Do you offer mobile car detailing?',
    answer: 'Yes. Mobile detailing is available throughout Bellevue, Omaha and surrounding communities when the selected service, weather, access and work area are suitable. Appointment-only Bellevue drop-off is available for longer or weather-sensitive services.',
    order: 2,
  },
  {
    question: 'How long does auto detailing take?',
    answer: 'Timing depends on the service, vehicle size and condition. Interior services commonly take about 2 to 6 hours, full details commonly take 4 to 6 hours, and paint correction or ceramic coating may require the vehicle for one to three days when preparation and curing time are needed.',
    order: 3,
  },
  {
    question: 'How do I know which interior detail to choose?',
    answer: 'Maintenance Interior is for an already well-kept vehicle. Signature Interior Detail is intended for normal daily use. Interior Restoration is designed for heavier buildup, stains, pet hair and interiors that need shampooing or extraction. Send photos if you are unsure.',
    order: 4,
  },
  {
    question: 'Can every stain or scratch be removed?',
    answer: 'No. Stain results depend on the material, substance, age of the stain and previous cleaning attempts. Paint correction can reduce many clear-coat defects, but scratches that are too deep may only improve rather than disappear completely.',
    order: 5,
  },
  {
    question: 'What is your weather policy for mobile detailing?',
    answer: 'Mobile appointments depend on weather and a safe place to work. If rain, snow or extreme temperatures make the service impractical, the appointment may need to move or be rescheduled. Bellevue drop-off is available for longer or weather-sensitive work.',
    order: 6,
  },
];

interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  order: number;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    FAQAPI.getFaqs()
      .then((data) => setFaqs(Array.isArray(data) && data.length > 0 ? data : DEFAULT_FAQS))
      .catch(() => setFaqs(DEFAULT_FAQS))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex min-h-[65vh] items-center justify-center bg-white" role="status" aria-label="Loading frequently asked questions"><Loader2 className="h-8 w-8 animate-spin text-blue-700" /></div>;
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Helmet>{faqs.length > 0 && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}</Helmet>

      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto grid gap-8 px-4 py-14 lg:grid-cols-[.8fr_1.2fr] lg:items-end lg:py-20">
          <div><h1 className="text-5xl font-black leading-[.98] tracking-tight sm:text-6xl">Car Detailing FAQ</h1></div>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">Answers about detailing prices, mobile service, Bellevue drop-off, vehicle condition, paint correction, ceramic coating and choosing the right service.</p>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[.65fr_1.35fr]">
          <aside>
            <h2 className="text-3xl font-black tracking-tight">Need an answer about your vehicle?</h2>
            <p className="mt-4 leading-7 text-slate-600">If the answer depends on stains, pet hair, odor, paint condition or another visible problem, photos usually help more than a long description.</p>
            <a href={textPhotosLink} onClick={() => trackEvent('click_text_quote', { location: 'faq_intro' })} className="mt-6 inline-flex min-h-12 items-center gap-2 bg-blue-600 px-5 font-black text-white hover:bg-blue-700"><MessageSquare className="h-5 w-5" /> Text Vehicle Photos</a>
          </aside>

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((faq, index) => (
              <div key={faq.id || faq.question}>
                <button type="button" onClick={() => setOpenIndex(openIndex === index ? null : index)} className="flex w-full items-center justify-between gap-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2" aria-expanded={openIndex === index}>
                  <span className="text-lg font-black">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
                </button>
                {openIndex === index && <p className="pb-6 pr-8 leading-7 text-slate-600">{faq.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-14">
        <div className="container mx-auto flex flex-col justify-between gap-7 px-4 md:flex-row md:items-center">
          <div><h2 className="text-3xl font-black tracking-tight">Ready to compare services?</h2><p className="mt-3 max-w-2xl leading-7 text-slate-600">See current service descriptions, starting prices and the vehicle conditions each package is designed for.</p></div>
          <Link to="/services" className="inline-flex min-h-14 shrink-0 items-center justify-center bg-slate-950 px-7 font-black text-white hover:bg-blue-700">View Services &amp; Pricing</Link>
        </div>
      </section>

      <RelatedGuides topic="all" heading="Detailed answers beyond the FAQ" intro="Read the full guides for service comparisons, maintenance timing, seasonal care and the results different services can deliver." />
    </div>
  );
}
