import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Camera, X } from 'lucide-react';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import { GALLERY_IMAGES, BEFORE_AFTERS } from '@/shared/data/photos';
import RelatedGuides from '../components/RelatedGuides';

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

  const filteredImages = filter === 'all' ? GALLERY_IMAGES : GALLERY_IMAGES.filter((image) => image.category === filter);

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Helmet><meta property="og:image" content="https://bryansdetailingomaha.com/gallery/takeout/20260502_192636.webp" /></Helmet>

      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto grid gap-10 px-4 py-14 lg:grid-cols-[.8fr_1.2fr] lg:items-end lg:py-20">
          <div>
            <div className="flex items-center gap-2 text-sm font-black text-blue-700"><Camera className="h-4 w-4" /> Real customer vehicles</div>
            <h1 className="mt-4 text-5xl font-black leading-[.98] tracking-tight sm:text-6xl">Car Detailing Before &amp; After</h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">See actual interior detailing, paint correction, exterior detailing and specialty-vehicle work from Bellevue and the Omaha metro. The before-and-after examples use matching photos from the same vehicle and work area.</p>
        </div>
      </section>

      <section className="bg-slate-950 py-14 text-white lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl"><h2 className="text-4xl font-black tracking-tight">Before &amp; After Results</h2><p className="mt-4 text-lg leading-8 text-slate-300">Use the sliders to compare the condition before and after the detailing work.</p></div>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {BEFORE_AFTERS.map((item) => (
              <article key={item.id}>
                <BeforeAfterSlider beforeImage={item.before} afterImage={item.after} />
                <h3 className="mt-4 text-xl font-black">{item.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><h2 className="text-4xl font-black tracking-tight">Detailing Portfolio</h2><p className="mt-3 max-w-2xl leading-7 text-slate-600">Filter the gallery by the type of work you want to see.</p></div>
            <div className="flex max-w-full gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter gallery">
              {CATEGORIES.map((category) => (
                <button key={category.id} type="button" onClick={() => setFilter(category.id)} aria-pressed={filter === category.id} className={`min-h-11 shrink-0 border px-4 text-sm font-black ${filter === category.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-700'}`}>{category.label}</button>
              ))}
            </div>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {filteredImages.map((image) => (
              <button key={image.id} type="button" onClick={() => setLightbox(image.src)} className="group relative aspect-[4/3] overflow-hidden bg-slate-100 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                <img src={image.src} alt={image.alt} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" referrerPolicy="no-referrer" loading="lazy" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-10"><p className="text-sm font-black text-white">{image.label}</p></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4" role="dialog" aria-modal="true" aria-label="Expanded detailing photo" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Expanded detailing result" className="max-h-[90vh] max-w-full object-contain" referrerPolicy="no-referrer" onClick={(event) => event.stopPropagation()} />
          <button type="button" onClick={() => setLightbox(null)} className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center border border-white/30 bg-black/60 text-white hover:bg-white hover:text-black" aria-label="Close photo"><X className="h-6 w-6" /></button>
        </div>
      )}

      <section className="border-y border-slate-200 bg-slate-50 py-14 lg:py-20">
        <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[1fr_.8fr] lg:items-start">
          <div><h2 className="text-3xl font-black tracking-tight">What these photos can tell you</h2><p className="mt-4 max-w-2xl leading-7 text-slate-600">Results depend on the starting condition, material, paint thickness and defect depth. The gallery is useful for seeing the type of work I perform, but it is not a promise that every stain or paint defect can be removed completely.</p></div>
          <aside className="border-l-4 border-blue-600 bg-white p-7"><h3 className="text-xl font-black">Want a recommendation for your vehicle?</h3><p className="mt-3 leading-7 text-slate-600">Compare the services or send photos of your vehicle so I can recommend the appropriate level of work.</p><div className="mt-5 flex flex-wrap gap-2"><Link to="/services" className="inline-flex min-h-11 items-center bg-blue-600 px-5 font-black text-white hover:bg-blue-700">View Services &amp; Pricing</Link><Link to="/quote" className="inline-flex min-h-11 items-center border border-slate-300 px-5 font-black hover:border-blue-600 hover:text-blue-700">Send Vehicle Details</Link></div></aside>
        </div>
      </section>

      <RelatedGuides topic="gallery" heading="Understand the work behind the results" intro="See how interior detailing, paint correction and ceramic protection differ before comparing the gallery to your vehicle." />
    </div>
  );
}
