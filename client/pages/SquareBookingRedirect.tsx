import { useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { getSquareBookingLink, isInquiryOnlyService } from '../lib/constants';

const LEGACY_SERVICE_IDS: Record<string, string> = {
  'ceramic-3yr': 'system-x-crystal-plus',
  'protection-package': 'system-x-pro-plus',
};

export default function SquareBookingRedirect() {
  const [searchParams] = useSearchParams();
  const requestedServiceId = searchParams.get('serviceId') || undefined;
  const serviceId = requestedServiceId ? LEGACY_SERVICE_IDS[requestedServiceId] || requestedServiceId : undefined;
  const target = isInquiryOnlyService(serviceId) ? '/quote' : getSquareBookingLink(serviceId);

  useEffect(() => {
    window.location.replace(target);
  }, [target]);

  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-slate-50 px-4 py-20">
      <div className="max-w-xl border-t-4 border-blue-600 bg-white p-8 text-center shadow-sm sm:p-12">
        <Calendar className="mx-auto h-10 w-10 text-blue-600" aria-hidden="true" />
        <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950">Opening secure Square booking</h1>
        <p className="mt-4 leading-7 text-slate-600">
          Choose your vehicle option and an available appointment time directly with Square.
        </p>
        <a href={target} className="mt-7 inline-flex min-h-12 items-center justify-center bg-blue-600 px-6 font-black text-white hover:bg-blue-700">
          Continue to Square
        </a>
      </div>
    </main>
  );
}
