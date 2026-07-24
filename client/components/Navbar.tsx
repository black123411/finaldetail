import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { BOOKING_LINK } from '../lib/constants';
import { trackEvent } from '../lib/analytics';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAdmin, user, logout } = useAuth();

  const navLinks = [
    { name: 'Services', path: '/services' },
    { name: 'Membership', path: '/membership' },
    { name: 'Gift Cards', path: '/gift-cards' },
    { name: 'Quote', path: '/quote' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight text-zinc-900">
            Bryan's Showroom Quality Mobile Detailing
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors",
                isActive(link.path) 
                  ? "text-zinc-900" 
                  : "text-zinc-600 hover:text-zinc-900"
              )}
            >
              {link.name}
              {isActive(link.path) && (
                <motion.div 
                  layoutId="activeNav"
                  className="h-0.5 bg-zinc-900 mt-0.5 rounded-full"
                />
              )}
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-4">
            <Button variant="outline" className="border-zinc-200 hover:bg-zinc-50" asChild>
              <a
                href="tel:712-305-6313"
                onClick={() => trackEvent('click_call', { location: 'desktop_nav' })}
                className="flex items-center gap-2 text-sm font-bold text-zinc-900 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>(712) 305-6313</span>
              </a>
            </Button>
            <Button asChild>
              <Link
                to="/book"
                onClick={() => trackEvent('begin_booking', { location: 'desktop_nav' })}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Book Now
              </Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="xl:hidden p-3 -mr-3 text-zinc-600 flex items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="xl:hidden border-t border-zinc-200 bg-white overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "block text-lg font-medium transition-colors py-3",
                    isActive(link.path) 
                      ? "text-zinc-900" 
                      : "text-zinc-600 hover:text-zinc-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center justify-between">
                    {link.name}
                    {isActive(link.path) && (
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                    )}
                  </div>
                </Link>
              ))}
              <div className="pt-6 border-t border-zinc-100 flex flex-col gap-3">
                <Button variant="outline" asChild className="w-full h-12 justify-start text-base">
                  <a
                    href="tel:712-305-6313"
                    onClick={() => trackEvent('click_call', { location: 'mobile_nav' })}
                  >
                    <Phone className="h-5 w-5 mr-3" />
                    Call Us
                  </a>
                </Button>
                <Button asChild className="w-full h-14 text-lg shadow-lg shadow-zinc-200">
                  <Link
                    to="/book"
                    onClick={() => {
                      trackEvent('begin_booking', { location: 'mobile_nav' });
                      setIsOpen(false);
                    }}
                    className="gap-3"
                  >
                    <Calendar className="h-6 w-6" />
                    Book Now
                  </Link>
                </Button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
