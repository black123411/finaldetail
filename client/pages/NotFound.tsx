import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Calendar, Sparkles, HelpCircle, Image, Compass, ChevronRight } from 'lucide-react';
import { BOOKING_LINK } from '../lib/constants';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center py-20 px-4 relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-2xl w-full text-center z-10 space-y-8">
        {/* Large 404 / Speedometer design */}
        <div className="relative inline-flex flex-col items-center">
          <div className="text-[120px] sm:text-[150px] font-black tracking-tighter text-zinc-900 leading-none select-none relative italic">
            404
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />
          </div>
          
          {/* Dashboard Redline Graphic */}
          <div className="absolute bottom-6 flex flex-col items-center space-y-1">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-red-500 bg-red-950/50 px-3 py-1 rounded-full border border-red-500/20 backdrop-blur-sm animate-pulse">
              Page Not Found
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white italic">
            We couldn't find that page
          </h1>
          <p className="text-zinc-400 max-w-md mx-auto text-base sm:text-lg">
            The page you requested may have moved or the address may be incorrect. Use one of the options below to continue.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-wider text-xs px-8 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20"
          >
            <Home className="w-4 h-4 shrink-0" />
            Return Home
          </Link>
          <a
            href={BOOKING_LINK}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Calendar className="w-4 h-4 shrink-0 text-emerald-500" />
            Book a Detail
          </a>
        </div>

        {/* Quick Links */}
        <div className="pt-10 border-t border-zinc-900 mt-10">
          <p className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center justify-center gap-2">
            <Compass className="w-3.5 h-3.5 text-emerald-500" /> Explore Services and Resources
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto">
            <Link
              to="/services"
              className="group p-4 bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-900 hover:border-emerald-500/20 rounded-xl transition-all duration-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-800/80 rounded-lg group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">Bryan's Services</h3>
                  <p className="text-xs text-zinc-500">Paint correction & ceramic coating</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              to="/gallery"
              className="group p-4 bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-900 hover:border-emerald-500/20 rounded-xl transition-all duration-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-800/80 rounded-lg group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                  <Image className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">Before & Afters</h3>
                  <p className="text-xs text-zinc-500">See detailing results</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              to="/faq"
              className="group p-4 bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-900 hover:border-emerald-500/20 rounded-xl transition-all duration-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-800/80 rounded-lg group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">Help & FAQ</h3>
                  <p className="text-xs text-zinc-500">Pricing, timing, and details</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              to="/quote"
              className="group p-4 bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-900 hover:border-emerald-500/20 rounded-xl transition-all duration-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-800/80 rounded-lg group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">Get an Estimate</h3>
                  <p className="text-xs text-zinc-500">Custom pricing for your vehicle</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
