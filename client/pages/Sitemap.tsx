import React from 'react';
import { Link } from 'react-router-dom';
import { Map, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { CITIES } from '@/shared/data/cities';
import { BLOG_POSTS } from '@/shared/data/blog';

const STATIC_SECTIONS = [
  {
    title: 'Main Pages',
    items: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'Gallery', path: '/gallery' },
      { name: 'Blog', path: '/blog' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Membership', path: '/membership' },
      { name: 'Gift Cards', path: '/gift-cards' },
      { name: 'Ceramic Coating', path: '/ceramic-coating' },
      { name: 'Book Online', path: '/book' },
      { name: 'Get a Quote', path: '/quote' },
      { name: 'Leave a Review', path: '/review' },
    ]
  },
  {
    title: 'Legal',
    items: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
    ]
  }
];

export default function Sitemap() {
  return (
    <div className="min-h-screen bg-zinc-50 py-16 pt-32">
      <Helmet>
        <title>Sitemap | Bryan's Showroom Quality Detailing</title>
        <meta name="description" content="Full sitemap for Bryan's Showroom Quality Detailing — auto detailing in Omaha, Bellevue, and surrounding Sarpy County areas." />
      </Helmet>
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16 space-y-4">
          <div className="mx-auto w-16 h-16 bg-zinc-900 text-white rounded-full flex items-center justify-center mb-6">
            <Map className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 italic">Sitemap</h1>
          <p className="text-lg text-zinc-500 font-medium">
            Every page on Bryan's Showroom Quality Detailing — Bellevue & Omaha, NE.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Static pages */}
          {STATIC_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-200 pb-3">
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.items.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="group flex items-center gap-2 text-zinc-600 hover:text-emerald-600 transition-colors font-medium text-sm"
                    >
                      <ChevronRight className="h-3 w-3 text-zinc-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Service Areas */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-200 pb-3">
              Service Areas
            </h2>
            <ul className="space-y-3">
              {CITIES.map((city) => (
                <li key={city.slug}>
                  <Link
                    to={`/areas/${city.slug}`}
                    className="group flex items-center gap-2 text-zinc-600 hover:text-emerald-600 transition-colors font-medium text-sm"
                  >
                    <ChevronRight className="h-3 w-3 text-zinc-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                    <span>Detailing in {city.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog Posts */}
          <div className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-200 pb-3">
              Blog Posts
            </h2>
            <ul className="space-y-3">
              {BLOG_POSTS.map((post) => (
                <li key={post.slug}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group flex items-center gap-2 text-zinc-600 hover:text-emerald-600 transition-colors font-medium text-sm"
                  >
                    <ChevronRight className="h-3 w-3 text-zinc-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                    <span className="line-clamp-2">{post.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
