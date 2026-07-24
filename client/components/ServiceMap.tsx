import React from 'react';
import { MapPin, Navigation, Phone, Mail, Clock } from 'lucide-react';

export default function ServiceMap() {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden flex flex-col lg:flex-row max-w-5xl mx-auto">
      {/* Map Info */}
      <div className="lg:w-1/3 p-8 bg-zinc-900 text-white flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Navigation className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter">Service Area</h3>
          </div>
          
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            We provide premium detailing based in Bellevue, serving the entire Omaha metro area. Pick-up and drop-off available!
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-1">Primary Zones</p>
                <p className="text-sm font-medium">Bellevue, Omaha, Papillion, La Vista</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-1">Operating Hours</p>
                <p className="text-sm font-medium">Daily: 7:00 AM - 7:00 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                <Phone className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-300 mb-1">Contact</p>
                <p className="text-sm font-medium">(712) 305-6313</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800">
          <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-[0.2em]">Showroom Quality Guaranteed</p>
        </div>
      </div>

      {/* Map Embed */}
      <div className="lg:w-2/3 relative bg-zinc-100 min-h-[400px] overflow-hidden">
        <iframe
          title="Bryan's detailing service area around Bellevue and Omaha"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d192131.6429302636!2d-96.10443048593748!3d41.1396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87938997a6619623%3A0xc3b82142d75f284d!2sBellevue%2C%20NE!5e0!3m2!1sen!2sus!4v1714375000000!5m2!1sen!2sus`}
          className="absolute inset-0 w-full h-full"
        ></iframe>
        
        {/* No-key fallback overlay removed as standard embed works */}

        {/* Legend */}
        <div className="absolute bottom-6 right-6 bg-white p-3 rounded-xl shadow-lg border border-zinc-200 z-10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest">Service Coverage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
