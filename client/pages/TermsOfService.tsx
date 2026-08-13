import React from 'react';
import { motion } from 'motion/react';
import { Scale } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-24 font-sans">
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
                By booking a service with Bryan's Showroom Quality Mobile Detailing, you agree to my standard operating procedures. Please ensure all personal belongings are removed from the vehicle prior to your appointment time.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                2. Weather Policy
              </h2>
              <p className="text-zinc-600 font-medium">
                If weather makes it unsafe to work at your location, I may need to reschedule. Drop-off appointments in Bellevue are less likely to be affected by weather.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                3. Liability & Inspection
              </h2>
              <p className="text-zinc-600 font-medium">
                I perform a pre-service inspection of each vehicle. Any pre-existing damage (mechanical or cosmetic) will be documented. Bryan's Showroom Quality Mobile Detailing is not responsible for damage resulting from pre-existing conditions, such as oxidized clear coat failure, loose trim pieces, or electrical issues unrelated to the detailing process.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                4. Final Walkthrough
              </h2>
              <p className="text-zinc-600 font-medium">
                I review the completed work with you at pickup or before leaving the mobile appointment. Please raise any concerns during that walkthrough so I can address reasonable discrepancies before the appointment is closed.
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
