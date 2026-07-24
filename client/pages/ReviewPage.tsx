import { motion } from 'motion/react';
import { Star, ExternalLink, MessageSquare, Share2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { PHOTOS } from '@/shared/data/photos';

// Direct link to Bryan's Google review form
const GOOGLE_REVIEW_URL =
  'https://search.google.com/local/writereview?placeid=ChIJVVU5ibSJk4cRCK2ex-dRYIg';

const REVIEW_STEPS = [
  { step: '1', label: 'Click the button below', desc: "It opens Google's review form directly." },
  { step: '2', label: 'Select your star rating', desc: '5 stars goes a long way — thank you!' },
  { step: '3', label: 'Share your experience', desc: 'Even a sentence or two helps other customers find us.' },
];

export default function ReviewPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center py-24 px-4">
      <div className="max-w-lg w-full text-center space-y-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-10 w-10 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-tight">
            Enjoyed your detail?
          </h1>
          <p className="text-zinc-400 font-medium text-lg leading-relaxed">
            Your Google review helps other Bellevue and Omaha drivers discover our service — and means the world to a small local business.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 text-left"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Takes 60 seconds</p>
          {REVIEW_STEPS.map((s) => (
            <div key={s.step} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-black text-sm shrink-0">
                {s.step}
              </div>
              <div>
                <p className="font-black text-white text-sm">{s.label}</p>
                <p className="text-zinc-400 text-xs font-medium mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <Button
            asChild
            className="w-full h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-base uppercase tracking-widest shadow-xl shadow-emerald-500/30"
          >
            <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
              <Star className="h-5 w-5 fill-black" />
              Leave a Google Review
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>

          {/* Social share */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              asChild
              variant="outline"
              className="flex-1 h-12 rounded-2xl border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 font-black text-xs uppercase tracking-widest"
            >
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=https://bryansdetailingomaha.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share on Facebook
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 h-12 rounded-2xl border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 font-black text-xs uppercase tracking-widest"
            >
              <a href="sms:?body=Check%20out%20Bryan%27s%20Showroom%20Quality%20Detailing%20in%20Bellevue%3A%20https%3A%2F%2Fbryansdetailingomaha.com" className="flex items-center justify-center gap-2">
                <MessageSquare className="h-3.5 w-3.5" />
                Text a Friend
              </a>
            </Button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
