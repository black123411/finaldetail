import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, Shield, Star, Crown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { BOOKING_LINK } from '../lib/constants';

export default function Membership() {
  return (
    <div className="min-h-screen bg-zinc-50 py-16">
      <Helmet>
        <title>Auto Detailing Membership Plans Bellevue NE | Monthly Car Care Omaha</title>
        <meta name="description" content="Join Bryan's exclusive auto detailing membership plans in Bellevue and Omaha. Monthly, bi-weekly, and quarterly maintenance packages with priority scheduling and discounted add-ons." />
      </Helmet>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">Maintenance Detailing</h1>
          <p className="text-lg text-zinc-600">
            Keep your vehicle in showroom condition year-round. Our maintenance plans offer priority booking, discounted add-ons, and consistent protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Monthly Plan */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-200 flex flex-col relative transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900">Standard</h2>
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Maintenance</p>
              </div>
            </div>
            
            <p className="text-sm text-zinc-600 mb-8 leading-relaxed">Perfect for daily drivers that need consistent care to maintain their appearance and value.</p>
            
            <div className="mb-8 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-zinc-900">$129</span>
                <span className="text-zinc-500 text-sm font-medium">/mo</span>
                <div className="ml-auto bg-zinc-900 text-white text-[8px] font-bold px-2 py-1 rounded-full uppercase">Save $40+</div>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-tighter">Billed Monthly</p>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              {[
                "1 Maintenance Detail / mo",
                "Priority Scheduling",
                "10% Off All Add-ons",
                "Text Reminder Concierge"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="h-4 w-4 text-zinc-900" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Button className="w-full h-12 rounded-xl" asChild>
              <Link to="/book">Join Monthly</Link>
            </Button>
          </div>

          {/* Bi-Weekly Plan - THE NEW ELITE OPTION */}
          <div className="bg-zinc-900 text-white rounded-[2rem] p-8 shadow-2xl border border-zinc-800 flex flex-col relative scale-105 z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
              Showroom Club
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white text-zinc-950 rounded-2xl flex items-center justify-center">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Elite</h2>
                <p className="text-xs text-emerald-400 uppercase tracking-widest font-bold">Bi-Weekly Care</p>
              </div>
            </div>
            
            <p className="text-sm text-zinc-400 mb-8 leading-relaxed">For the enthusiast who wants their car to look brand new every single day without lifting a finger.</p>
            
            <div className="mb-8 p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">$239</span>
                <span className="text-zinc-400 text-sm font-medium">/mo</span>
                <div className="ml-auto bg-emerald-500 text-white text-[8px] font-bold px-2 py-1 rounded-full uppercase">Save $100+</div>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tighter">Ultimate Convenience</p>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              {[
                "2 Maintenance Details / mo (Bi-Weekly)",
                "Concierge Scheduling",
                "25% Off All Add-ons",
                "Complimentary Engine Detail",
                "Pick-up & Drop-off Available"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Button className="w-full h-12 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 shadow-xl shadow-zinc-950/50" asChild>
              <Link to="/book">Join The Club</Link>
            </Button>
          </div>

          {/* Quarterly Plan */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-200 flex flex-col relative transition-transform hover:-translate-y-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-zinc-100 text-zinc-900 rounded-2xl flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900">Protector</h2>
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Seasonal</p>
              </div>
            </div>
            
            <p className="text-sm text-zinc-600 mb-8 leading-relaxed">Ideal for premium vehicles that need seasonal restoration and protection refreshes.</p>
            
            <div className="mb-8 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-zinc-900">$249</span>
                <span className="text-zinc-500 text-sm font-medium">/quarter</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-tighter">Billed Quarterly</p>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              {[
                "1 Full Detail Refresh / Quarter",
                "Seasonal Sealant Refresh",
                "15% Off All Add-ons",
                "Premium Protection Plan"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="h-4 w-4 text-zinc-900" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Button className="w-full h-12 rounded-xl" asChild>
              <Link to="/book">Join Seasonal</Link>
            </Button>
          </div>
        </div>

        {/* Requirements */}
        <div className="max-w-3xl mx-auto mt-16 bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-zinc-900" />
            <h3 className="text-xl font-bold text-zinc-900">Membership Requirements</h3>
          </div>
          <p className="text-zinc-600 mb-4">
            To qualify for our maintenance plans, your vehicle must first undergo a Full Detail Package or higher to establish a baseline of cleanliness and protection.
          </p>
          <p className="text-zinc-600">
            Memberships are billed automatically to your card on file via Square Payments. You can cancel or pause your membership at any time with 7 days notice before your next billing cycle.
          </p>
        </div>
        {/* SEO Content Block */}
        <div className="max-w-3xl mx-auto mt-16 bg-zinc-50 p-8 rounded-2xl border border-zinc-200">
          <h2 className="text-2xl font-black text-zinc-900 mb-4">The Importance of Consistent Car Care</h2>
          <p className="text-zinc-600 leading-relaxed mb-4">
            Routine vehicle maintenance extends far beyond oil changes and tire rotations. Maintaining your vehicle's exterior clear coat and interior surfaces is critical for preserving its resale value and driving comfort. Our exclusive auto detailing membership plans in Bellevue and Omaha are designed to provide unparalleled convenience and continuous protection.
          </p>
          <p className="text-zinc-600 leading-relaxed">
            By enrolling in a monthly or bi-weekly maintenance plan, you protect your car against the degrading effects of Nebraska's extreme seasonal shifts—from winter road salt to intense summer UV rays. Our recurring services prevent dirt and contaminants from bonding to the paint, drastically reducing the need for intensive and costly paint correction in the future. Enjoy priority scheduling, discounted premium add-ons, and the peace of mind that comes with driving a flawlessly clean vehicle every single day.
          </p>
        </div>
      </div>
    </div>
  );
}
