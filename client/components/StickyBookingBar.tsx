import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

export default function StickyBookingBar() {
  const { pathname } = useLocation();
  const serviceId = pathname.match(/^\/services\/([a-z0-9-]+)$/)?.[1];
  const isPpfInquiry = serviceId === 'ppf-inquiry';
  const target = isPpfInquiry
    ? '/quote'
    : serviceId
      ? `/book?serviceId=${serviceId}`
      : '/book';
  const label = isPpfInquiry
    ? 'Request a PPF Quote'
    : serviceId
      ? 'Book This Service'
      : 'Check Availability';

  if (pathname === '/book' || pathname === '/booking' || pathname === '/quote' || pathname.startsWith('/admin') || pathname === '/login') {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
    >
      <div className="bg-zinc-950 border-t border-zinc-800 px-4 py-3 safe-area-bottom">
        <div className="flex items-center">
          {/* CTA button */}
          <Link
            to={target}
            onClick={() => trackEvent(isPpfInquiry ? 'begin_quote' : 'begin_booking', { location: 'sticky_mobile_bar', service_id: serviceId })}
            aria-label={label}
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-500/30 transition-colors"
          >
            <Calendar className="h-4 w-4" />
            {label}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
