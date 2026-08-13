import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Jason Meredith',
    quote: 'Amazing job done detailing the inside of my car. Outstanding results. Fantastic communication.',
  },
  {
    name: 'Karl M.',
    quote: 'Great service! Car always looks new after coming here.',
  },
  {
    name: 'Melinda F.',
    quote: "Bryan did an amazing job detailing our son's car. The car looks brand new.",
  },
];

export default function Testimonials() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {reviews.map((review) => (
        <figure key={review.name} className="flex h-full flex-col border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex gap-1" role="img" aria-label="Five-star customer review">
            {[...Array(5)].map((_, index) => (
              <Star key={index} className="h-5 w-5 fill-amber-400 text-amber-400" aria-hidden="true" />
            ))}
          </div>
          <blockquote className="flex-1 text-base leading-7 text-slate-700">“{review.quote}”</blockquote>
          <figcaption className="mt-6 border-t border-slate-200 pt-4 text-sm font-black text-slate-950">
            {review.name}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
