import React, { useState, useEffect } from 'react';
import { Star, Quote, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ReviewsAPI } from '../services/api';

interface Review {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

const FALLBACK_REVIEWS: Review[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Premium Detail Customer",
    content: "Bryan came right to my office and did an incredible job. My car looks better than the day I first bought it. The convenience of having him come to me while I worked was amazing.",
    rating: 5,
    image: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Interior Reset Customer",
    content: "I use my truck for work and it was an absolute mess. Bryan's interior restoration literally saved my seats. It smells like a brand new truck again. Highly recommend his services!",
    rating: 5,
    image: "https://ui-avatars.com/api/?name=Michael+Chen&background=random"
  },
  {
    id: 3,
    name: "Jessica Miller",
    role: "Paint Correction Customer",
    content: "The paint correction removed all the swirl marks from previous automatic car washes. The depth of the black paint is stunning now. Professional, punctual, and very skilled. Will be booking a maintenance wash soon.",
    rating: 5,
    image: "https://ui-avatars.com/api/?name=Jessica+Miller&background=random"
  }
];

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await ReviewsAPI.getReviews();
        if (data.success && data.reviews && data.reviews.length > 0) {
          // Take up to 3 reviews
          setReviews(data.reviews.slice(0, 3));
        } else {
          // Fallback if success is false (e.g. config error) or no reviews found
          if (data.message) {
            console.warn('Backend reported issue fetching reviews:', data.message);
          }
          setReviews(FALLBACK_REVIEWS);
        }
      } catch (error) {
        console.warn('Falling back to local testimonials due to error:', error);
        setReviews(FALLBACK_REVIEWS);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {reviews.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 flex flex-col relative"
        >
          <Quote className="absolute top-6 right-8 h-12 w-12 text-zinc-50 opacity-50" />
          
          <div className="flex gap-1 mb-4">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>

          <p className="text-zinc-600 italic mb-8 flex-grow leading-relaxed">
            "{review.content}"
          </p>

          <div className="flex items-center gap-4 pt-6 border-t border-zinc-50">
            <img 
              src={review.image} 
              alt={review.name} 
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div>
              <p className="font-bold text-zinc-900 text-sm">{review.name}</p>
              <p className="text-xs text-zinc-500 font-medium">{review.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
