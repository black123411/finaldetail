import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Gift, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function GiftCards() {
  return (
    <div className="min-h-screen bg-zinc-50 py-16">
      <Helmet>
        <title>Auto Detailing Gift Cards Bellevue NE | Omaha Gift Certificates</title>
        <meta name="description" content="Give the gift of a showroom shine. Purchase digital auto detailing gift cards for Bryan's Showroom Quality Detailing in Bellevue and Omaha. Instant email delivery, never expires." />
      </Helmet>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">Digital Gift Cards</h1>
          <p className="text-lg text-zinc-600">
            Give the gift of a showroom shine. Perfect for birthdays, holidays, or just because.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
          {/* Image Side */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
            <img
              src="/20191020_062847.jpg"
              alt="Gift card presentation"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent flex flex-col justify-end p-8 text-white">
              <Gift className="h-12 w-12 mb-4 text-emerald-400" />
              <h2 className="text-3xl font-bold mb-2">Bryan's Showroom Quality Detailing</h2>
              <p className="text-zinc-300">Digital Gift Card</p>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200">
              <h3 className="text-2xl font-bold text-zinc-900 mb-4">Purchase a Gift Card</h3>
              <p className="text-zinc-600 mb-6">
                Our digital gift cards can be used towards any detailing service, paint correction, or ceramic coating. They never expire and can be sent directly to the recipient via email.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 text-sm text-zinc-700">
                  <Mail className="h-5 w-5 mt-0.5 shrink-0 text-zinc-900" /> 
                  <span>Instant email delivery to you or the recipient</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-zinc-700">
                  <Gift className="h-5 w-5 mt-0.5 shrink-0 text-zinc-900" /> 
                  <span>Redeemable for any service online or in-person</span>
                </div>
              </div>

              <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 mb-6">
                <p className="text-sm text-zinc-500 mb-4 text-center">Powered securely by Square Payments</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Button variant="outline" className="h-14 text-lg">$100</Button>
                  <Button variant="outline" className="h-14 text-lg">$250</Button>
                  <Button variant="outline" className="h-14 text-lg">$500</Button>
                  <Button variant="outline" className="h-14 text-lg">Custom</Button>
                </div>
              </div>

              <Button className="w-full h-14 text-lg" asChild>
                <a href="https://squareup.com/gift/placeholder/order" target="_blank" rel="noopener noreferrer">
                  Buy Gift Card Now <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
