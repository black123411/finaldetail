import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../lib/analytics';
import { BOOKING_LINK } from '../lib/constants';

const serviceLinks = [
  ['Interior Detailing', '/services/category/interior-detailing'],
  ['Full Details', '/services/category/full-detailing'],
  ['Paint Correction', '/services/category/paint-correction'],
  ['Ceramic Coating', '/services/category/ceramic-coating'],
  ['Specialty Vehicles', '/services/category/rv-boat-detailing'],
] as const;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setServicesOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const linkClass = (path: string) =>
    `inline-flex min-h-11 items-center border-b-2 px-1 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
      location.pathname === path ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-600 hover:text-slate-950'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="container mx-auto flex h-18 items-center justify-between gap-6 px-4">
        <Link to="/" className="text-xl font-black tracking-tight text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          Bryan's Detailing
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-stretch gap-7 lg:flex">
          <div ref={menuRef} className="relative flex items-stretch" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
            <button
              type="button"
              aria-expanded={servicesOpen}
              aria-haspopup="menu"
              onClick={() => setServicesOpen(true)}
              onKeyDown={(event) => event.key === 'Escape' && setServicesOpen(false)}
              className={`${linkClass('/services')} gap-1.5`}
            >
              Services <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
            </button>
            {servicesOpen && (
              <div role="menu" className="absolute left-0 top-full w-72 border border-slate-200 bg-white p-2 shadow-xl">
                {serviceLinks.map(([label, path]) => (
                  <Link key={path} role="menuitem" to={path} className="block min-h-11 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                    {label}
                  </Link>
                ))}
                <Link role="menuitem" to="/services" className="mt-2 block min-h-11 border-t border-slate-200 px-4 py-3 text-sm font-black text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                  View All Services & Pricing
                </Link>
              </div>
            )}
          </div>
          <Link to="/gallery" className={linkClass('/gallery')}>Gallery</Link>
          <Link to="/about" className={linkClass('/about')}>About</Link>
          <Link to="/quote" className={linkClass('/quote')}>Contact</Link>
          {isAdmin && <Link to="/admin" className={linkClass('/admin')}>Admin</Link>}
          <a
            href={BOOKING_LINK}
            onClick={() => trackEvent('begin_booking', { location: 'desktop_nav' })}
            className="my-3 inline-flex min-h-11 items-center justify-center bg-blue-600 px-6 text-sm font-black text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            Book Now
          </a>
        </nav>

        <button type="button" aria-label="Toggle menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)} className="flex h-11 w-11 items-center justify-center text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden">
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} aria-label="Mobile navigation" className="overflow-hidden border-t border-slate-200 bg-white lg:hidden">
            <div className="container mx-auto px-4 py-5">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-blue-700">Services</p>
              <div className="border-l-2 border-blue-200 pl-3">
                {serviceLinks.map(([label, path]) => <Link key={path} to={path} className="block min-h-11 py-3 font-semibold text-slate-700">{label}</Link>)}
                <Link to="/services" className="block min-h-11 py-3 font-black text-blue-700">All Services & Pricing</Link>
              </div>
              <div className="mt-4 border-t border-slate-200 pt-3">
                <Link to="/gallery" className="block min-h-11 py-3 font-bold text-slate-800">Gallery</Link>
                <Link to="/about" className="block min-h-11 py-3 font-bold text-slate-800">About</Link>
                <Link to="/quote" className="block min-h-11 py-3 font-bold text-slate-800">Contact</Link>
                {isAdmin && <Link to="/admin" className="block min-h-11 py-3 font-bold text-slate-800">Admin</Link>}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
