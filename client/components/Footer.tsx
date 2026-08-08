import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-12 border-t border-zinc-800">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-100">Bryan's Showroom Quality Mobile Detailing</h3>
          <p className="text-sm leading-relaxed">
            Auto detailing services based in Bellevue, Nebraska. Interior detailing, full car details, paint correction, ceramic coating, and mobile detailing options for Omaha, Bellevue, Papillion, La Vista, and Council Bluffs.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-zinc-100 font-medium tracking-wide uppercase text-sm">Services</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services/category/interior-detailing" className="block py-1 hover:text-zinc-100 transition-colors">Interior Detailing</Link></li>
            <li><Link to="/services/category/exterior-detailing" className="block py-1 hover:text-zinc-100 transition-colors">Exterior Detailing</Link></li>
            <li><Link to="/services/category/paint-correction" className="block py-1 hover:text-zinc-100 transition-colors">Paint Correction</Link></li>
            <li><Link to="/services/category/ceramic-coating" className="block py-1 hover:text-zinc-100 transition-colors">Ceramic Coating</Link></li>
            <li><Link to="/services/category/full-detailing" className="block py-1 hover:text-zinc-100 transition-colors">Full Detailing Packages</Link></li>
            <li><Link to="/services/category/rv-boat-detailing" className="block py-1 hover:text-zinc-100 transition-colors">RV, Boat & Equipment Detailing</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-zinc-100 font-medium tracking-wide uppercase text-sm">Service Areas</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/areas/omaha-ne" className="block py-1 hover:text-zinc-100 transition-colors">Omaha, NE</Link></li>
            <li><Link to="/areas/bellevue-ne" className="block py-1 hover:text-zinc-100 transition-colors">Bellevue, NE</Link></li>
            <li><Link to="/areas/papillion-ne" className="block py-1 hover:text-zinc-100 transition-colors">Papillion, NE</Link></li>
            <li><Link to="/areas/la-vista-ne" className="block py-1 hover:text-zinc-100 transition-colors">La Vista, NE</Link></li>
            <li><Link to="/areas/council-bluffs-ia" className="block py-1 hover:text-zinc-100 transition-colors">Council Bluffs, IA</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-zinc-100 font-medium tracking-wide uppercase text-sm">Helpful Guides</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/blog/what-does-interior-car-detailing-include-omaha-bellevue" className="block py-1 hover:text-zinc-100 transition-colors">Interior Detailing Guide</Link></li>
            <li><Link to="/blog/paint-correction-swirl-marks-scratches-omaha" className="block py-1 hover:text-zinc-100 transition-colors">Paint Correction Guide</Link></li>
            <li><Link to="/blog/ceramic-coating-vs-wax-nebraska" className="block py-1 hover:text-zinc-100 transition-colors">Ceramic vs. Wax</Link></li>
            <li><Link to="/blog/winter-road-salt-car-care-omaha-nebraska" className="block py-1 hover:text-zinc-100 transition-colors">Winter Car Care</Link></li>
            <li><Link to="/blog/mobile-vs-drop-off-car-detailing-omaha-bellevue" className="block py-1 hover:text-zinc-100 transition-colors">Mobile vs. Drop-Off</Link></li>
            <li><Link to="/blog/how-often-detail-car-omaha-nebraska" className="block py-1 hover:text-zinc-100 transition-colors">Detailing Frequency</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-zinc-100 font-medium tracking-wide uppercase text-sm">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="block py-1 hover:text-zinc-100 transition-colors">Meet Bryan</Link></li>
            <li><Link to="/membership" className="block py-1 hover:text-zinc-100 transition-colors">Membership Plans</Link></li>
            <li><Link to="/blog" className="block py-1 hover:text-zinc-100 transition-colors">Blog & Tips</Link></li>
            <li><Link to="/gift-cards" className="block py-1 hover:text-zinc-100 transition-colors">Gift Cards</Link></li>
            <li><Link to="/faq" className="block py-1 hover:text-zinc-100 transition-colors">FAQ</Link></li>
            <li><Link to="/review" className="block py-1 text-emerald-500 hover:text-emerald-400 font-bold transition-colors">Leave a Review</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-zinc-100 font-medium tracking-wide uppercase text-sm">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>1907 Arlington Cir, Bellevue, NE 68123</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0" />
              <a
                href="tel:712-305-6313"
                className="hover:text-zinc-100 transition-colors"
                onClick={() => trackEvent('click_call', { location: 'footer' })}
              >
                (712) 305-6313
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0" />
              <a
                href="mailto:bryansmobiledetailing@gmail.com"
                className="hover:text-zinc-100 transition-colors"
                onClick={() => trackEvent('click_email', { location: 'footer' })}
              >
                bryansmobiledetailing@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-zinc-800 text-xs flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <Link to="/terms" className="hover:text-zinc-100 transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-zinc-100 transition-colors">Privacy Policy</Link>
          <Link to="/sitemap" className="hover:text-zinc-100 transition-colors">Sitemap</Link>
        </div>
        
        <p>&copy; {new Date().getFullYear()} Bryan's Showroom Quality Mobile Detailing. All rights reserved.</p>
        
      </div>
    </footer>
  );
}
