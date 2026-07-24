import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, HelpCircle, Loader2 } from 'lucide-react';
import { FAQAPI } from '../services/api';

const DEFAULT_FAQS = [
  {
    question: 'How long does auto detailing take?',
    answer: 'The time required depends on the auto detailing service package and the condition of your vehicle. An Essential Interior Detail typically takes 1.5 - 2.5 hours, while a Full Car Detailing Package can take 4 - 6 hours. Paint Correction and Ceramic Coating services may require your vehicle for 1 to 3 days to ensure proper curing and perfection.',
    order: 1
  },
  {
    question: 'What is your rain or weather policy for mobile detailing?',
    answer: 'For mobile car detailing, your appointment is weather-dependent. If rain, snow, or extreme temperatures are forecasted, I will contact you at least 24 hours in advance to reschedule. If you have a garage or covered area, I can often still perform interior detailing or minor exterior car wash services.',
    order: 2
  },
  {
    question: 'Do I need to provide water or electricity for mobile detailing?',
    answer: 'No! For my mobile auto detailing, I am fully self-contained. I bring my own professional-grade spot-free water and silent power generators. As long as I have enough space to park my van near your vehicle, I don\'t need to plug into your home to complete your car detailing service.',
    order: 3
  }
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
    const fetchFaqs = async () => {
      try {
        const data = await FAQAPI.getFaqs();
        setFaqs(Array.isArray(data) && data.length > 0 ? data : DEFAULT_FAQS);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setFaqs(DEFAULT_FAQS);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loading) {
     return (
        <div className="min-h-screen bg-zinc-50 py-16 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
        </div>
     );
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-16">
      <Helmet>
        {faqs.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
      </Helmet>
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16 space-y-4">
          <div className="mx-auto w-16 h-16 bg-zinc-100 text-zinc-900 rounded-full flex items-center justify-center mb-6">
            <HelpCircle className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">Auto Detailing FAQ</h1>
          <p className="text-lg text-zinc-600">
            Everything you need to know about my car detailing services, paint correction processes, and ceramic coating policies for Bellevue and Omaha.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="text-lg font-semibold text-zinc-900 pr-8">{faq.question}</span>
                <ChevronDown 
                  className={`h-5 w-5 text-zinc-500 shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 pt-0 text-zinc-600 leading-relaxed border-t border-zinc-100 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-zinc-900 text-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-zinc-400 mb-6">I'm here to help. Contact me directly for personalized advice about your vehicle.</p>
          <div className="flex justify-center gap-4">
            <a href="tel:712-305-6313" className="px-6 py-3 bg-white text-zinc-900 rounded-lg font-medium hover:bg-zinc-200 transition-colors">
              Call Me
            </a>
            <a href="mailto:bryansmobiledetailing@gmail.com" className="px-6 py-3 border border-zinc-700 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors">
              Email Me
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
