import { Link, useLocation } from 'react-router-dom';
import { Calendar, MessageSquare } from 'lucide-react';
import { trackBookingHandoff, trackEvent } from '../lib/analytics';
import { getSquareBookingLink, isInquiryOnlyService } from '../lib/constants';

export default function StickyBookingBar() {
  const { pathname } = useLocation();
  const serviceId = pathname.match(/^\/services\/([a-z0-9-]+)$/)?.[1];
  const isInquiryOnly = isInquiryOnlyService(serviceId);
  const isGeneralPage = !serviceId;
  if (pathname === '/book' || pathname === '/booking' || pathname === '/quote' || pathname.startsWith('/admin') || pathname === '/login') return null;

  const target = isInquiryOnly ? '/quote' : serviceId ? getSquareBookingLink(serviceId) : '/services';
  const label = isInquiryOnly ? 'Request Quote' : serviceId ? 'Book This Service' : 'Choose Service';

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-950 p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="mx-auto flex max-w-lg gap-2">
        <a href="sms:+17123056313?body=Hi%20Bryan%2C%20I%27d%20like%20help%20with%20my%20vehicle.%20Here%20are%20some%20photos%3A" onClick={() => trackEvent('click_text_quote', { location: 'sticky_mobile_bar' })} className="flex min-h-12 flex-1 items-center justify-center gap-2 border border-slate-700 bg-slate-900 px-3 text-sm font-black text-white">
          <MessageSquare className="h-4 w-4" /> Text Me
        </a>
        {isInquiryOnly || isGeneralPage ? (
          <Link
            to={target}
            onClick={() => trackEvent(isInquiryOnly ? 'begin_quote' : 'view_services', { location: 'sticky_mobile_bar', service_id: serviceId })}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 bg-blue-600 px-3 text-center text-sm font-black text-white"
          >
            <Calendar className="h-4 w-4 shrink-0" /> {label}
          </Link>
        ) : (
          <a href={target} onClick={(event) => trackBookingHandoff(event, { location: 'sticky_mobile_bar', service_id: serviceId })} className="flex min-h-12 flex-1 items-center justify-center gap-2 bg-blue-600 px-3 text-center text-sm font-black text-white">
            <Calendar className="h-4 w-4 shrink-0" /> {label}
          </a>
        )}
      </div>
    </div>
  );
}
