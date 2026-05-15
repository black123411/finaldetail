import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Membership from './pages/Membership';
import GiftCards from './pages/GiftCards';
import Gallery from './pages/Gallery';
import Quote from './pages/Quote';
import FAQ from './pages/FAQ';
import FAQManager from './pages/FAQManager';
import Booking from './pages/Booking';
import Admin from './pages/Admin';
import AdminServiceManager from './pages/AdminServiceManager';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import BlogManager from './pages/BlogManager';
import Login from './pages/Login';
import Sitemap from './pages/Sitemap';
import { AuthProvider } from './context/AuthContext';
import { FirebaseProvider } from './components/FirebaseProvider';
import { AdminGuard } from './components/AdminGuard';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CategoryDetail from './pages/CategoryDetail';
import ServiceDetail from './pages/ServiceDetail';
import CityDetail from './pages/CityDetail';
import CeramicCoating from './pages/CeramicCoating';
import ReviewPage from './pages/ReviewPage';
import ChatAssistant from './components/ChatAssistant';
import StickyBookingBar from './components/StickyBookingBar';
import { CATEGORIES, SERVICES } from '@/shared/data/services';
import { CITIES } from '@/shared/data/cities';

function SEO() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const serviceMatch = pathname.match(/^\/services\/([a-z0-9-]+)$/);
  const categoryMatch = pathname.match(/^\/services\/category\/([a-z-]+)$/);
  const cityMatch = pathname.match(/^\/areas\/([a-z-]+)$/);
  let pageSeo = null;
  
  if (categoryMatch) {
    const slug = categoryMatch[1];
    const category = CATEGORIES.find(c => c.slug === slug);
    if (category) {
      pageSeo = {
        title: category.seo?.title || `${category.name} | Bryan's Showroom Quality Detailing`,
        description: category.seo?.description || category.description
      };
    }
  }

  if (serviceMatch) {
    const serviceId = serviceMatch[1];
    const service = SERVICES.find(s => s.id === serviceId);
    if (service) {
      pageSeo = {
        title: service.seo.title,
        description: service.seo.description
      };
    }
  }

  if (cityMatch) {
    const citySlug = cityMatch[1];
    const city = CITIES.find(c => c.slug === citySlug);
    if (city) {
      pageSeo = {
        title: city.seo.title,
        description: city.seo.description
      };
    }
  }

  const seoData: Record<string, { title: string; description: string }> = {
    '/': {
      title: "Bryan's Showroom Quality Detailing | Omaha & Bellevue Auto Detailing",
      description: "Premium auto detailing services in Bellevue and Omaha. Mobile and shop detailing, paint correction, ceramic coatings, and interior restoration."
    },
    '/services': {
      title: "Detailing Services | Paint Correction & Ceramic Coating Omaha",
      description: "Premium car detailing in Bellevue and Omaha. We offer comprehensive auto detailing services including interior detailing, exterior washes, multi-stage paint correction, and long-lasting ceramic coating."
    },
    '/book': {
      title: "Book Your Detail | Professional Auto Detailing Bellevue",
      description: "Schedule your professional car detail online. Instant availability for Bellevue and Omaha. Secure your spot with a deposit."
    },
    '/gallery': {
      title: "Before & After Gallery | Paint Correction & Ceramic Coating Omaha NE",
      description: "Real before & after photos from Bryan's Showroom Quality Detailing in Bellevue and Omaha. See paint correction, ceramic coating, and interior restoration results."
    },
    '/ceramic-coating': {
      title: 'Ceramic Coating Omaha & Bellevue NE | System X Certified Installer',
      description: 'Professional ceramic coating in Omaha and Bellevue NE. Bryan is a System X certified installer offering 3-year paint protection starting at $700.',
    },
    '/membership': {
      title: "Maintenance Detailing | Keep Your Car Showroom Ready",
      description: "Join our exclusive maintenance club for bi-weekly or monthly detailing at discounted rates. Keep your vehicle protected year-round."
    },
  };

  const current = pageSeo || seoData[pathname] || {
    title: "Bryan's Showroom Quality Detailing",
    description: "Premium professional auto detailing services in Bellevue and Omaha, Nebraska."
  };

  const domain = "https://bryansdetailingomaha.com";
  const url = `${domain}${pathname}`;
  const image = `${domain}/og-image.jpg`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "AutoBodyShop", // Better than AutoDetailing which isn't standard, AutoBodyShop or LocalBusiness
    "name": "Bryan's Showroom Quality Detailing",
    "image": image,
    "@id": domain,
    "url": domain,
    "telephone": "+17123056313",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Bellevue Garage Service",
      "addressLocality": "Bellevue",
      "addressRegion": "NE",
      "postalCode": "68005",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.1544,
      "longitude": -95.9153
    },
    "areaServed": [
      { "@type": "City", "name": "Bellevue" },
      { "@type": "City", "name": "Omaha" },
      { "@type": "City", "name": "Papillion" },
      { "@type": "City", "name": "La Vista" },
      { "@type": "City", "name": "Gretna" },
      { "@type": "City", "name": "Elkhorn" },
      { "@type": "City", "name": "Council Bluffs" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Auto Detailing Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Ceramic Coating",
            "description": "Long-term paint protection and extreme hydrophobic properties."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Paint Correction",
            "description": "Professional swirl and scratch removal to restore mirror-like gloss."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Interior Detailing",
            "description": "Deep cleaning and sanitization for vehicle interiors."
          }
        }
      ]
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "08:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.facebook.com/bryansdetailing",
      "https://www.instagram.com/bryansdetailing"
    ]
  };

  return (
    <Helmet>
      <title>{current.title}</title>
      <meta name="description" content={current.description} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={current.title} />
      <meta property="og:description" content={current.description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={current.title} />
      <meta property="twitter:description" content={current.description} />
      <meta property="twitter:image" content={image} />

      {/* JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <FirebaseProvider>
        <AuthProvider>
          <Router>
          <SEO />
          <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 font-sans">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:serviceId" element={<ServiceDetail />} />
                <Route path="/services/category/:slug" element={<CategoryDetail />} />
                <Route path="/areas/:slug" element={<CityDetail />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/gift-cards" element={<GiftCards />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/ceramic-coating" element={<CeramicCoating />} />
                <Route path="/quote" element={<Quote />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/book" element={<Booking />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPostDetail />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/admin" 
                  element={
                    <AdminGuard>
                      <Admin />
                    </AdminGuard>
                  } 
                />
                <Route 
                  path="/admin/services" 
                  element={
                    <AdminGuard>
                      <AdminServiceManager />
                    </AdminGuard>
                  } 
                />
                <Route 
                  path="/admin/blog" 
                  element={
                    <AdminGuard>
                      <BlogManager />
                    </AdminGuard>
                  } 
                />
                <Route 
                  path="/admin/faq" 
                  element={
                    <AdminGuard>
                      <FAQManager />
                    </AdminGuard>
                  } 
                />
                <Route path="/sitemap" element={<Sitemap />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/review" element={<ReviewPage />} />
              </Routes>
            </main>
            <ChatAssistant />
            <StickyBookingBar />
            <Footer />
          </div>
        </Router>
      </AuthProvider>
      </FirebaseProvider>
    </HelmetProvider>
  );
}
