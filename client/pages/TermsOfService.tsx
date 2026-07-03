import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Shield, FileText, Scale, AlertCircle } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-24 font-sans">
      <Helmet>
        <title>Terms of Service | Bryan's Showroom Quality Detailing</title>
        <meta name="description" content="Read the terms of service and operating policies for Bryan's Showroom Quality Detailing, including deposit, cancellation, and weather policies." />
      </Helmet>
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[2rem] bg-zinc-900 flex items-center justify-center text-white italic shadow-2xl">
              <Scale className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-zinc-900 tracking-tighter italic">Terms of Service</h1>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Last Updated: April 2026</p>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-zinc-100 space-y-12 leading-relaxed">
            
            <section className="space-y-4">
              <h2 className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                1. Service Agreement
              </h2>
              <p className="text-zinc-600 font-medium">
                By booking a service with Bryan's Showroom Quality Detailing, you agree to my standard operating procedures. Please ensure all personal belongings are removed from the vehicle prior to your appointment time.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                2. Deposit & Cancellation
              </h2>
              <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100 space-y-4">
                <p className="text-sm font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-emerald-500" /> Important Deposit Policy
                </p>
                <p className="text-zinc-600 italic">
                  A non-refundable deposit ($50 for standard services, $100 for high-ticket restoration) is required to secure your appointment time. This deposit is applied towards your final balance. Cancellations made with less than 24 hours' notice will forfeit the deposit. One reschedule is permitted per deposit if requested at least 24 hours in advance.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                3. Weather Policy
              </h2>
              <p className="text-zinc-600 font-medium">
                If weather conditions prevent me from working safely at your location, I reserve the right to reschedule. Services performed at my Bellevue location are unaffected by weather conditions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                4. Liability & Inspection
              </h2>
              <p className="text-zinc-600 font-medium">
                I perform a pre-service inspection of each vehicle. Any pre-existing damage (mechanical or cosmetic) will be documented. Bryan's Showroom Quality Detailing is not responsible for damage resulting from pre-existing conditions, such as oxidized clear coat failure, loose trim pieces, or electrical issues unrelated to the detailing process.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                5. Satisfaction Guarantee
              </h2>
              <p className="text-zinc-600 font-medium">
                I stand behind my work. Any concerns must be reported at the time of final walkthrough upon completion. I will make every reasonable effort to correct any discrepancies before leaving the job site.
              </p>
            </section>

          </div>

          <div className="text-center">
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">
              Questions regarding these terms? Call <span className="text-zinc-900">(712) 305-6313</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
