import { ExternalLink, Star } from 'lucide-react';
import { Button } from './ui/button';
import { trackEvent } from '../lib/analytics';

const GOOGLE_REVIEWS_URL = "https://www.google.com/search?q=Bryan%27s+Showroom+Quality+Mobile+Detailing#lrd=0x879389b489395555:0x82615171e79faed,1,,,";

export default function Testimonials() {
  return (
    <div className="mx-auto max-w-3xl rounded-[2rem] border border-zinc-200 bg-zinc-50 p-8 md:p-12">
      <div className="mb-6 flex justify-center gap-1" role="img" aria-label="Five stars; customer reviews are available on Google">
        {[...Array(5)].map((_, index) => (
          <Star key={index} className="h-6 w-6 fill-yellow-400 text-yellow-400" aria-hidden="true" />
        ))}
      </div>
      <h3 className="mb-4 text-2xl font-black text-zinc-900">Read verified customer feedback</h3>
      <p className="mx-auto mb-8 max-w-xl leading-relaxed text-zinc-600">
        See current ratings, customer photos, and reviews directly on Bryan's Google Business Profile.
      </p>
      <Button size="lg" className="h-14 rounded-2xl bg-[#1a73e8] px-8 font-bold text-white hover:bg-[#1557b0]" asChild>
        <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('click_google_reviews', { location: 'testimonials' })}>
          View Reviews on Google <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}
