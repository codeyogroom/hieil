import React, { useEffect, Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import './index.css';

const Home = lazy(() => import('./pages/Home/Home'));
const About = lazy(() => import('./pages/About/About'));
const WhyChooseUs = lazy(() => import('./pages/About/WhyChooseUs'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Product = lazy(() => import('./pages/Product/Product')); 
const Enquiry = lazy(() => import('./pages/Enquiry/Enquiry'));
const Shop = lazy(() => import('./pages/Shop/Shop'));
const HowWeWork = lazy(() => import('./pages/HowWeWork/HowWeWork'));
const CustomProductDevelopment = lazy(() => import('./pages/Services/CustomProductDevelopment'));
const BulkWholesaleSupply = lazy(() => import('./pages/Services/BulkWholesaleSupply'));
const PartnershipForm = lazy(() => import('./pages/Services/PartnershipForm'));
const ExportLogistics = lazy(() => import('./pages/Services/ExportLogistics'));
const QualityAssurance = lazy(() => import('./pages/Services/QualityAssurance'));
const PrivateLabeling = lazy(() => import('./pages/Services/PrivateLabeling'));
const B2BPartnerships = lazy(() => import('./pages/Services/B2BPartnerships'));
const AffiliateProgram = lazy(() => import('./pages/Services/AffiliateProgram'));
const Blog = lazy(() => import('./pages/Blog/Blog'));
const Gallery = lazy(() => import('./pages/Gallery/Gallery'));
const Testimonials = lazy(() => import('./pages/Testimonials/Testimonials'));
const AuthPage = lazy(() => import('./pages/Auth/AuthPage'));
const UserDashboard = lazy(() => import('./pages/Account/UserDashboard'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService/TermsOfService'));
const LegalInfo = lazy(() => import('./pages/LegalInfo/LegalInfo'));
import Breadcrumb from './components/common/Breadcrumb/Breadcrumb';
import GlobalLoader from './components/common/GlobalLoader/GlobalLoader';

import AOS from 'aos';
import 'aos/dist/aos.css';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    }
  }, [pathname, hash]);

  return null;
}

const AdminApp = lazy(() => import('./admin/AdminApp'));
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <>
      <Header />
      <Breadcrumb />
      <Outlet />
      <Footer />
      {/* WhatsApp Floating Button */}
      <a href="https://wa.me/919050001972?text=Hi!%20I%20would%20like%20to%20inquire%20about%20your%20products%20and%20services." target="_blank" rel="noopener noreferrer" className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>
    </>
  );
}

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
    });
  }, []);

  return (
    <AuthProvider>
    <Router>
      <ScrollToTop />
      <GlobalLoader />
      <div className="app-container">
        <Suspense fallback={<div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><div className="hieil-spinner"></div></div>}>
          <Routes>
            {/* Main Website Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about/us" element={<About />} />
              <Route path="/about/why-choose-us" element={<WhyChooseUs />} />
              <Route path="/about/how-we-work" element={<HowWeWork />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/products" element={<Shop />} />
              <Route path="/products/:categoryId" element={<Shop />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/product/:id/enquiry" element={<Enquiry />} />
              <Route path="/services/custom" element={<CustomProductDevelopment />} />
              <Route path="/services/wholesale" element={<BulkWholesaleSupply />} />
              <Route path="/services/wholesale/partnership-form" element={<PartnershipForm />} />
              <Route path="/services/export" element={<ExportLogistics />} />
              <Route path="/services/quality" element={<QualityAssurance />} />
              <Route path="/services/private-labeling" element={<PrivateLabeling />} />
              <Route path="/services/b2b" element={<B2BPartnerships />} />
              <Route path="/services/affiliate" element={<AffiliateProgram />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/account" element={<UserDashboard />} />


              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/legal-info" element={<LegalInfo />} />
              
              {/* Catch-all route to redirect /index or any unknown URL to Home */}
              <Route path="/index" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>

            {/* Admin Panel Route */}
            <Route path="/admin/*" element={<AdminApp />} />


        </Routes>
        </Suspense>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
