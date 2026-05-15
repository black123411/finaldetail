import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Camera, Award } from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { Helmet } from 'react-helmet-async';
import { GALLERY_IMAGES, BEFORE_AFTERS } from '@/shared/data/photos';

const CATEGORIES = [
  { id: 'all', label: 'All Work' },
  { id: 'interior', label: 'Interior' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'paint', label: 'Paint Correction' },
  { id: 'ceramic', label: 'Ceramic Coating' },
  { id: 'specialty', label: 'Specialty' },
];

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filteredImages =
    filter === 'all'
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === filter);

  return (
    <div className="min-h-screen bg-zinc-950 py-16">
      <Helmet>
        <title>Before & After Auto Detailing Gallery | Bryan's Detailing Omaha & Bellevue NE</title>
        <meta
          name="description"
          content="See real before & after results from Bryan's Showroom Quality Detailing in Bellevue and Omaha. Paint correction, ceramic coating, and interior restoration photo gallery."
        />
        <link rel="canonical" href="https://bryansdetailingomaha.com/gallery" />
        <meta property="og:title" content="Auto Detailing Gallery – Bryan's Showroom Quality Detailing" />
        <meta property="og:description" content="Real before & after results: paint correction, ceramic coating, and interior restoration in Bellevue & Omaha NE." />
        <meta property="og:image" content="https://lh3.googleusercontent.com/p/AF1QipNBh1JPkPPvuM9a6ZAEqUVD-q_ngfoeYPE03bev=w1200-h630-k-no" />
      </Helmet>

      {/* Hero */}
      <section className="container mx-auto px-4 mb-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <Camera className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Real Results. Real Customers.</span>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none"
          >
            The <span className="text-emerald-400 italic font-normal">Transformation</span>
            <br />Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400 max-w-2xl mx-auto font-medium"
          >
            Every photo is from a real customer job in Bellevue and Omaha. No stock photos. No filters.
            Just honest craftsmanship.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-6 text-sm text-zinc-500 font-medium"
          >
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-400" />
              <span>4.9★ Google Rating</span>
            </div>
            <div className="w-px h-4 bg-zinc-700" />
            <span>43+ Reviews</span>
            <div className="w-px h-4 bg-zinc-700" />
            <span>System X Certified</span>
          </motion.div>
        </div>
      </section>

      {/* Before & After Sliders */}
      <section className="mb-24 bg-zinc-900/50">
        <div className="container mx-auto px-4 py-16">
          <div className="flex items-center gap-3 mb-12 justify-center">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <h2 className="text-3xl font-black text-white tracking-tight">Before & After</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {BEFORE_AFTERS.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <BeforeAfterSlider beforeImage={t.before} afterImage={t.after} />
                <div className="text-center">
                  <p className="font-black text-white text-lg tracking-tight">{t.label}</p>
                  <p className="text-sm text-zinc-400 mt-1">{t.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter + Grid */}
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                filter === cat.id
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredImages.map((img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
                onClick={() => setLightbox(img.src)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-black text-sm tracking-tight">{img.label}</p>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-black/60 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full capitalize">
                    {img.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={lightbox}
              alt="Auto detailing result Bryan's Showroom Quality Detailing Omaha Bellevue NE"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white text-4xl font-thin leading-none"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
