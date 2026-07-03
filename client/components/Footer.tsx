import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, MapPin, Phone, Mail, RefreshCw, Twitter, Youtube, Linkedin } from 'lucide-react';
import { ServiceAPI } from '../services/api';

export default function Footer() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const data = await ServiceAPI.syncSquare();
      
      if (data.success) {
        setSyncStatus('Successfully synced to Square!');
        setTimeout(() => setSyncStatus(null), 5000);
      } else {
        throw new Error(data.error || 'Sync failed');
      }
    } catch (error: any) {
      setSyncStatus(`Error: ${error.message}`);
      setTimeout(() => setSyncStatus(null), 5000);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 py-12 border-t border-zinc-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-100">Bryan's Showroom Quality Detailing</h3>
          <p className="text-sm leading-relaxed">
            Premium auto detailing services based in Bellevue, Nebraska. 10+ years of showroom quality car detailing, interior detailing, and professional paint correction. We bring the ultimate clean to Omaha and Bellevue.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" aria-label="Facebook" className="hover:text-zinc-100 transition-colors"><Facebook className="h-5 w-5" /></a>
            <a href="#" aria-label="Instagram" className="hover:text-zinc-100 transition-colors"><Instagram className="h-5 w-5" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-zinc-100 transition-colors"><Twitter className="h-5 w-5" /></a>
            <a href="#" aria-label="Youtube" className="hover:text-zinc-100 transition-colors"><Youtube className="h-5 w-5" /></a>
            <a href="#" aria-label="Linkedin" className="hover:text-zinc-100 transition-colors"><Linkedin className="h-5 w-5" /></a>
          </div>
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
          <h4 className="text-zinc-100 font-medium tracking-wide uppercase text-sm">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/membership" className="block py-1 hover:text-zinc-100 transition-colors">Membership Plans</Link></li>
            <li><Link to="/blog" className="block py-1 hover:text-zinc-100 transition-colors">Blog & Tips</Link></li>
            <li><Link to="/gift-cards" className="block py-1 hover:text-zinc-100 transition-colors">Gift Cards</Link></li>
            <li><Link to="/faq" className="block py-1 hover:text-zinc-100 transition-colors">FAQ</Link></li>
            <li><Link to="/review" className="block py-1 text-emerald-500 hover:text-emerald-400 font-bold transition-colors">Leave a Review</Link></li>
            <li><Link to="/admin" className="block py-1 hover:text-zinc-100 transition-colors font-bold text-zinc-300">Admin Dashboard</Link></li>
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
              <a href="tel:712-305-6313" className="hover:text-zinc-100 transition-colors">(712) 305-6313</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0" />
              <a href="mailto:bryansmobiledetailing@gmail.com" className="hover:text-zinc-100 transition-colors">bryansmobiledetailing@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-zinc-800 text-xs flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <Link to="/terms" className="hover:text-zinc-100 transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="hover:text-zinc-100 transition-colors">Privacy Policy</Link>
          <Link to="/sitemap" className="hover:text-zinc-100 transition-colors">Sitemap</Link>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 hover:text-zinc-100 transition-colors disabled:opacity-50 cursor-pointer ml-4 font-black uppercase text-zinc-500"
          >
            <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Catalog'}
          </button>
        </div>
        
        <p>&copy; {new Date().getFullYear()} Bryan's Showroom Quality Detailing. All rights reserved.</p>
        
        {syncStatus && (
          <p className={`fixed bottom-8 right-8 p-4 rounded-xl shadow-2xl bg-zinc-900 border border-zinc-800 z-50 text-xs font-black uppercase tracking-widest ${syncStatus.includes('Error') ? 'text-red-500' : 'text-emerald-500 animate-bounce'}`}>
            {syncStatus}
          </p>
        )}
      </div>
    </footer>
  );
}
