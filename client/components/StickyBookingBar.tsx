import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Star, Calendar } from 'lucide-react';

export default function StickyBookingBar() {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
    >
      <div className="bg-zinc-950 border-t border-zinc-800 px-4 py-3 safe-area-bottom">
        <div className="flex items-center gap-3">
          {/* Rating pill */}
          <div className="flex items-center gap-1.5 bg-zinc-900 rounded-xl px-3 py-2 shrink-0">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-white font-black text-sm">4.9</span>
            <span className="text-zinc-500 text-[10px] font-bold">(43)</span>
          </div>

          {/* CTA button */}
          <Link
            to="/book"
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-500/30 transition-colors"
          >
            <Calendar className="h-4 w-4" />
            Book Now — Starts at $119
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
