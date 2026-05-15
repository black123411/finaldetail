import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, Server } from 'lucide-react';

export default function PrivacyPolicy() {
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
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-zinc-900 tracking-tighter italic">Privacy Policy</h1>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Effective Date: April 2026</p>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl border border-zinc-100 space-y-12 leading-relaxed">
            
            <section className="space-y-4">
              <h2 className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                <Lock className="h-6 w-6 text-emerald-500" />
                Data Collection
              </h2>
              <p className="text-zinc-600 font-medium">
                I collect personal information necessary to provide professional detailing services, including your name, phone number, email address, and vehicle details. This information is gathered when you request a quote or book an appointment.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                <Server className="h-6 w-6 text-emerald-500" />
                Payment Security
              </h2>
              <p className="text-zinc-600 font-medium">
                Payment processing is handled securely through Square. I do not store full credit card numbers on my servers. Square's secure infrastructure ensures your financial data is protected using industry-standard encryption.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                <Eye className="h-6 w-6 text-emerald-500" />
                Information Usage
              </h2>
              <p className="text-zinc-600 font-medium">
                Your data is used strictly for scheduling, service reminders, and follow-up communications related to your vehicle restoration. I do not sell or share your personal information with third-party marketing agencies.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                <Shield className="h-6 w-6 text-emerald-500" />
                Photos & Social Media
              </h2>
              <p className="text-zinc-600 font-medium">
                I may take "before and after" photos of your vehicle for quality control and marketing purposes. Licenses plates are always blurred or cropped out of shared marketing materials unless explicit permission is granted by the vehicle owner.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                Your Rights
              </h2>
              <p className="text-zinc-600 font-medium">
                You have the right to request access to the information I hold about you or request its deletion from my scheduling system at any time by contacting me directly.
              </p>
            </section>

          </div>

          <div className="text-center">
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">
              Security is my priority. <span className="text-zinc-900">Showroom Quality standards applied to your data.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
