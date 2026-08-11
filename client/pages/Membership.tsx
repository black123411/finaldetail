import { CheckCircle2, Shield, Star, Crown, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import RelatedGuides from '../components/RelatedGuides';

const membershipTextLink = (plan: string) =>
  `sms:+17123056313?body=${encodeURIComponent(`Hi Bryan, I'm interested in the ${plan} maintenance plan. Can you confirm availability, eligibility, and billing details?`)}`;

export default function Membership() {
  return (
    <div className="min-h-screen bg-zinc-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">Maintenance Detailing</h1>
          <p className="text-lg text-zinc-600">
            Maintenance plans start at $119 and are reserved for returning or recently detailed vehicles. Bryan confirms eligibility, what is included, scheduling, and billing before enrollment.
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
            
            <p className="text-sm text-zinc-600 mb-8 leading-relaxed">For daily drivers that need consistent care after a full detail.</p>
            
            <div className="mb-8 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-zinc-900">$119</span>
                <span className="text-zinc-500 text-sm font-medium">starting price</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-tighter">Billed Monthly</p>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              {[
                "1 Maintenance Detail / mo",
                "Repeat-service scheduling",
                "Add-ons discussed before work",
                "Text-based appointment updates"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="h-4 w-4 text-zinc-900" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Button className="w-full h-12 rounded-xl" asChild>
              <a href={membershipTextLink('Standard monthly')}><MessageSquare className="mr-2 h-4 w-4" /> Ask About Monthly</a>
            </Button>
          </div>

          {/* Bi-Weekly Plan */}
          <div className="bg-zinc-900 text-white rounded-[2rem] p-8 shadow-2xl border border-zinc-800 flex flex-col relative scale-105 z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
              Showroom Club
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white text-zinc-950 rounded-2xl flex items-center justify-center">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Bi-Weekly</h2>
                <p className="text-xs text-emerald-400 uppercase tracking-widest font-bold">Bi-Weekly Care</p>
              </div>
            </div>
            
            <p className="text-sm text-zinc-400 mb-8 leading-relaxed">For drivers who want regular interior upkeep and safe exterior washing. Bryan will confirm what is included and how often your vehicle should be serviced before enrollment.</p>
            
            <div className="mb-8 p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">Custom plan</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tighter">Bi-weekly service</p>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              {[
                "2 Maintenance Details / mo (Bi-Weekly)",
                "Repeat-service scheduling",
                "Service matched to your vehicle",
                "Add-ons discussed before work",
                "Mobile or Bellevue drop-off when suitable"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Button className="w-full h-12 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 shadow-xl shadow-zinc-950/50" asChild>
              <a href={membershipTextLink('Bi-Weekly Showroom Club')}><MessageSquare className="mr-2 h-4 w-4" /> Ask About The Club</a>
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
            
            <p className="text-sm text-zinc-600 mb-8 leading-relaxed">For vehicles that need seasonal restoration and protection refreshes after a qualifying detail.</p>
            
            <div className="mb-8 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-zinc-900">Custom plan</span>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-tighter">Billed Quarterly</p>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              {[
                "1 Full Detail Refresh / Quarter",
                "Seasonal Sealant Refresh",
                "Service matched to your vehicle",
                "Protection refresh when needed"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-zinc-700">
                  <CheckCircle2 className="h-4 w-4 text-zinc-900" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Button className="w-full h-12 rounded-xl" asChild>
              <a href={membershipTextLink('Seasonal Protector')}><MessageSquare className="mr-2 h-4 w-4" /> Ask About Seasonal</a>
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
            To qualify for a maintenance plan, your vehicle must first undergo a Full Detail Package or higher to establish a baseline of cleanliness and protection.
          </p>
          <p className="text-zinc-600">
            Bryan will confirm plan availability, vehicle eligibility, scheduling, cancellation terms, and Square billing details with you before enrollment.
          </p>
        </div>
        {/* SEO Content Block */}
        <div className="max-w-3xl mx-auto mt-16 bg-zinc-50 p-8 rounded-2xl border border-zinc-200">
          <h2 className="text-2xl font-black text-zinc-900 mb-4">The Importance of Consistent Car Care</h2>
          <p className="text-zinc-600 leading-relaxed mb-4">
            Routine vehicle maintenance extends beyond oil changes and tire rotations. Maintaining your vehicle's exterior clear coat and interior surfaces helps preserve resale value and driving comfort. Auto detailing membership plans in Bellevue and Omaha provide scheduled cleaning for vehicles that have already been professionally detailed.
          </p>
          <p className="text-zinc-600 leading-relaxed">
            Monthly or bi-weekly maintenance helps remove dust, road film, salt, and light interior mess before it becomes a full reset. Maintenance visits include safe washing, quick interior upkeep, glass cleaning, tire dressing, and protection refreshes when appropriate.
          </p>
        </div>
      </div>
      <RelatedGuides
        topic="maintenance"
        heading="Build a practical maintenance plan"
        intro="Learn how often to detail, how winter driving affects upkeep, and when longer-lasting paint protection makes sense."
      />
    </div>
  );
}
