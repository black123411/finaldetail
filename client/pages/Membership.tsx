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
            These plans are for vehicles I have already detailed or vehicles that are still in good condition. They start at $119 and are meant to keep the vehicle from getting back to square one between appointments.
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
            
            <p className="text-sm text-zinc-600 mb-8 leading-relaxed">For a daily driver that needs one solid upkeep visit each month.</p>
            
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
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
              Showroom Club
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white text-zinc-950 rounded-2xl flex items-center justify-center">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Bi-Weekly</h2>
                <p className="text-xs text-blue-400 uppercase tracking-widest font-bold">Bi-Weekly Care</p>
              </div>
            </div>
            
            <p className="text-sm text-zinc-400 mb-8 leading-relaxed">For vehicles that get used hard enough to need attention about every two weeks. I set the plan around the vehicle instead of pretending every car needs the exact same checklist.</p>
            
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
                "A plan we agree on before enrollment",
                "Add-ons discussed before work",
                "Mobile or Bellevue drop-off, depending on the service and weather"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
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
            
            <p className="text-sm text-zinc-600 mb-8 leading-relaxed">For vehicles that stay fairly clean but need a bigger cleanup and protection refresh a few times a year.</p>
            
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
                "A plan we agree on before enrollment",
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
            <h3 className="text-xl font-bold text-zinc-900">Before starting a maintenance plan</h3>
          </div>
          <p className="text-zinc-600 mb-4">
            Maintenance only works when the vehicle starts clean. If it needs a full detail first, I will tell you before putting it on a plan.
          </p>
          <p className="text-zinc-600">
            Before anything is recurring, I will go over the price, schedule, what is included, and how cancellation works.
          </p>
        </div>
        {/* SEO Content Block */}
        <div className="max-w-3xl mx-auto mt-16 bg-zinc-50 p-8 rounded-2xl border border-zinc-200">
          <h2 className="text-2xl font-black text-zinc-900 mb-4">Why maintenance is cheaper than starting over</h2>
          <p className="text-zinc-600 leading-relaxed mb-4">
            A little upkeep keeps salt, spills, pet hair, road film, and everyday mess from turning into another restoration job.
          </p>
          <p className="text-zinc-600 leading-relaxed">
            Monthly or bi-weekly visits are for staying ahead of the mess. What I do each visit depends on the plan we agreed on and what the vehicle actually needs that day.
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
