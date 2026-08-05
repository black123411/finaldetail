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
        <meta property="og:image" content="https://bryansdetailingomaha.com/gallery/takeout/20260502_192636.webp" />
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
              <span>Customer Reviews on Google</span>
            </div>
            <div className="w-px h-4 bg-zinc-700" />
            <span>Owner-Operated</span>
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
                className="relative aspect-[4/3] rounded-lg overflow-hidden group cursor-pointer"
                onClick={() => setLightbox(img.src)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 md:p-4">
                  <p className="text-white font-black text-sm tracking-tight">{img.label}</p>
                </div>
                <div className="absolute top-3 right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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
              alt="Auto detailing result Bryan's Showroom Quality Mobile Detailing Omaha Bellevue NE"
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
      {/* SEO Content Block */}
      <section className="py-24 bg-zinc-950 border-t border-zinc-900 mt-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-black tracking-tight text-white mb-6 text-center">
            Bryan's Bellevue & Omaha Detailing Portfolio
          </h2>
          <p className="text-zinc-400 leading-relaxed font-medium mb-4">
            These are real customer vehicles from interior detailing, exterior detailing, paint correction, headlight restoration, boat, motorcycle, classic car, and specialty jobs around Bellevue and Omaha. Each photo is labeled by what is actually visible in the image.
          </p>
          <p className="text-zinc-400 leading-relaxed font-medium mb-4">
            The before-and-after section uses matching photos from the same vehicle and work area. The main gallery separates interior, exterior, paint correction, and specialty vehicle results.
          </p>
          <p className="text-zinc-400 leading-relaxed font-medium">
            When you book with Bryan's Showroom Quality Mobile Detailing, the goal is clear service matching: interior cleaning for dirty cabins, paint correction for swirl marks, ceramic coating for protection, and mobile detailing where the job is a good fit.
          </p>
        </div>
      </section>
    </div>
  );
}
