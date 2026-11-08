import { Snowflake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WINTER_DROP_OFF_ONLY } from '../lib/seasonal';

export default function WinterNotice() {
  if (!WINTER_DROP_OFF_ONLY) return null;

  return (
    <div className="border-b border-slate-800 bg-slate-950 text-white">
      <div className="container mx-auto flex flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <Snowflake className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" aria-hidden="true" />
          <p><span className="font-black text-white">Winter service update:</span> All appointments are by drop-off at 1907 Arlington Cir, Bellevue, NE 68123. Drop-off is by appointment only. Mobile appointments are paused for the winter and will return when weather allows.</p>
        </div>
        <Link to="/services" className="shrink-0 font-black text-blue-300 underline underline-offset-4 hover:text-white">View services &amp; pricing</Link>
      </div>
    </div>
  );
}
