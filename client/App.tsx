import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect, useLayoutEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';
import { AdminGuard } from './components/AdminGuard';
import ChatAssistant from './components/ChatAssistant';
import StickyBookingBar from './components/StickyBookingBar';
import { CATEGORIES, SERVICES } from '@/shared/data/services';
import { CITIES } from '@/shared/data/cities';
import {
  DEFAULT_SOCIAL_IMAGE,
  NOT_FOUND_SEO,
  SITE_ORIGIN,
  STATIC_PAGE_SEO,
  BUSINESS,
  type SeoRoute,
} from '@/shared/data/seo';
import { trackEvent } from './lib/analytics';

const Services = lazy(() => import('./pages/Services'));
const Membership = lazy(() => import('./pages/Membership'));
const GiftCards = lazy(() => import('./pages/GiftCards'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Quote = lazy(() => import('./pages/Quote'));
const FAQ = lazy(() => import('./pages/FAQ'));
const FAQManager = lazy(() => import('./pages/FAQManager'));
const Booking = lazy(() => import('./pages/Booking'));
const Admin = lazy(() => import('./pages/Admin'));
const AdminServiceManager = lazy(() => import('./pages/AdminServiceManager'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPostDetail = lazy(() => import('./pages/BlogPostDetail'));
const BlogManager = lazy(() => import('./pages/BlogManager'));
const Login = lazy(() => import('./pages/Login'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
const NotFound = lazy(() => import('./pages/NotFound'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const CategoryDetail = lazy(() => import('./pages/CategoryDetail'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const CityDetail = lazy(() => import('./pages/CityDetail'));
const CeramicCoating = lazy(() => import('./pages/CeramicCoating'));
const ReviewPage = lazy(() => import('./pages/ReviewPage'));
const About = lazy(() => import('./pages/About'));

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  useEffect(() => {
    trackEvent('route_view', { page_path: `${pathname}${search}` });
  }, [pathname, search]);

  return null;
}

function SEO() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Blog articles load their SEO data with the post. Let BlogPostDetail own
  // those tags so the global fallback cannot mark valid articles as 404/noindex.
  if (/^\/blog\/[a-z0-9-]+$/.test(pathname)) {
    return null;
  }

  const serviceMatch = pathname.match(/^\/services\/([a-z0-9-]+)$/);
  const categoryMatch = pathname.match(/^\/services\/category\/([a-z-]+)$/);
  const cityMatch = pathname.match(/^\/areas\/([a-z-]+)$/);
  let pageSeo: SeoRoute | null = null;
  
  if (categoryMatch) {
    const slug = categoryMatch[1];
    const category = CATEGORIES.find(c => c.slug === slug);
    if (category) {
      pageSeo = {
        title: category.seo?.title || `${category.name} | Bryan's Showroom Quality Mobile Detailing`,
        description: category.seo?.description || category.description,
        canonicalPath: `/services/category/${category.slug}`,
        imagePath: category.image,
      };
    }
  }

  if (serviceMatch) {
    const serviceId = serviceMatch[1];
    const service = SERVICES.find(s => s.id === serviceId);
    if (service) {
      pageSeo = {
        title: service.seo.title,
        description: service.seo.description,
        canonicalPath: `/services/${service.id}`,
        imagePath: service.image,
      };
    }
  }

  if (cityMatch) {
    const citySlug = cityMatch[1];
    const city = CITIES.find(c => c.slug === citySlug);
    if (city) {
      pageSeo = {
        title: city.seo.title,
        description: city.seo.description,
        canonicalPath: `/areas/${city.slug}`,
      };
    }
  }

  const current = pageSeo || STATIC_PAGE_SEO[pathname] || {
    ...NOT_FOUND_SEO,
    canonicalPath: pathname,
  };

  const domain = SITE_ORIGIN;
  const url = `${domain}${current.canonicalPath || pathname}`;
  const image = `${domain}${current.imagePath || DEFAULT_SOCIAL_IMAGE}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'AutomotiveBusiness'],
    '@id': `${SITE_ORIGIN}/#business`,
    name: BUSINESS.name,
    url: BUSINESS.url,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    priceRange: BUSINESS.priceRange,
    image,
    address: {
      '@type': 'PostalAddress',
      ...BUSINESS.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    areaServed: BUSINESS.areaServed.map((name) => ({
      '@type': 'Place',
      name,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Auto Detailing Services',
      itemListElement: SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          description: s.shortDescription,
          areaServed: BUSINESS.areaServed.map((name) => ({ '@type': 'Place', name })),
         },
       })),
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '07:00',
      closes: '19:00',
    },
  };

  return (
    <Helmet>
      <title>{current.title}</title>
      <meta name="description" content={current.description} />
      <link rel="canonical" href={url} />
      {current.robots && <meta name="robots" content={current.robots} />}
      
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
      <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <SEO />
          <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 font-sans">
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading page"><div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900" /></div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/services/ceramic-3yr" element={<Navigate replace to="/services/system-x-crystal-plus" />} />
                <Route path="/services/protection-package" element={<Navigate replace to="/services/system-x-pro-plus" />} />
                <Route path="/services/maintenance-interior" element={<Navigate replace to="/services/maintenance-detail" />} />
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
                <Route path="/booking" element={<Booking />} />
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
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
            </main>
            <ChatAssistant />
            <StickyBookingBar />
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
