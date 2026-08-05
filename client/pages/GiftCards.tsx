import { Gift, MessageSquare, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function GiftCards() {
  return (
    <div className="min-h-screen bg-zinc-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">Detailing Gift Cards</h1>
          <p className="text-lg text-zinc-600">
                Give the gift of a professional vehicle reset for birthdays, holidays, or any occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
          {/* Image Side */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
            <img
              src="/gift-card-detailing-optimized.jpg"
              alt="Gift card presentation"
              width="1600"
              height="1200"
              loading="lazy"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent flex flex-col justify-end p-8 text-white">
              <Gift className="h-12 w-12 mb-4 text-emerald-400" />
              <h2 className="text-3xl font-bold mb-2">Bryan's Showroom Quality Mobile Detailing</h2>
              <p className="text-zinc-300">A gift tailored to their vehicle</p>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
              <h3 className="text-2xl font-bold text-zinc-900 mb-4">Purchase a Gift Card</h3>
              <p className="text-zinc-600 mb-6">
                Choose an amount or service, then contact Bryan to confirm the recipient details. Payment and fulfillment are handled securely through Square.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 text-sm text-zinc-700">
                  <MessageSquare className="h-5 w-5 mt-0.5 shrink-0 text-zinc-900" />
                  <span>Tell Bryan the amount, service, and recipient name</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-zinc-700">
                  <Gift className="h-5 w-5 mt-0.5 shrink-0 text-zinc-900" /> 
                  <span>Available for detailing, paint correction, or ceramic coating</span>
                </div>
              </div>

              <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 mb-6">
                <p className="text-sm text-zinc-600 text-center">Bryan will confirm availability, delivery details, and the secure Square payment step before purchase.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button className="h-14 text-base" asChild>
                  <a href="sms:+17123056313?body=Hi%20Bryan%2C%20I%27d%20like%20to%20purchase%20a%20detailing%20gift%20card.%20The%20amount%20or%20service%20I%20have%20in%20mind%20is%3A%20">
                    <MessageSquare className="mr-2 h-5 w-5" /> Text Bryan
                  </a>
                </Button>
                <Button variant="outline" className="h-14 text-base" asChild>
                  <a href="tel:+17123056313">
                    <Phone className="mr-2 h-5 w-5" /> Call Bryan
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
