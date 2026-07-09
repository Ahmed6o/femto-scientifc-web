import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';

import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductsManager from './pages/admin/ProductsManager';
import PagesManager from './pages/admin/PagesManager';

import { pageApp, pageSol } from './data/pages';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Scroll-to-top button component
function ScrollTopBtn() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      className={`scroll-top ${visible ? 'visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
    >
      <i className="fas fa-arrow-up" />
    </button>
  );
}

// Simple placeholder pages
function Application() {
  return (
    <main>
      <div className="breadcrumb">
        <div className="container breadcrumb-content">
          <h1>{pageApp?.title}</h1>
          <nav className="breadcrumb-nav">
            <a href="/">Home</a>
            <i className="fas fa-chevron-right" style={{fontSize:'10px'}} />
            <span>Application</span>
          </nav>
        </div>
      </div>
      <div className="section container text-center">
        <i className="fas fa-file-alt" style={{fontSize:'60px', color:'#4e97fd', marginBottom:'20px'}} />
        <h2>{pageApp?.title}</h2>
        <p className="text-muted">{pageApp?.desc}</p>
      </div>
    </main>
  );
}

function Solutions() {
  return (
    <main>
      <div className="breadcrumb">
        <div className="container breadcrumb-content">
          <h1>{pageSol?.title}</h1>
          <nav className="breadcrumb-nav">
            <a href="/">Home</a>
            <i className="fas fa-chevron-right" style={{fontSize:'10px'}} />
            <span>Solutions</span>
          </nav>
        </div>
      </div>
      <div className="section container text-center">
        <i className="fas fa-lightbulb" style={{fontSize:'60px', color:'#4e97fd', marginBottom:'20px'}} />
        <h2>{pageSol?.title}</h2>
        <p className="text-muted">{pageSol?.desc}</p>
      </div>
    </main>
  );
}

function NotFound() {
  return (
    <main style={{textAlign:'center', padding:'120px 20px'}}>
      <i className="fas fa-exclamation-triangle" style={{fontSize:'60px', color:'#e4573d', marginBottom:'20px'}} />
      <h2 style={{fontSize:'3rem', marginBottom:'10px'}}>404</h2>
      <h3 style={{marginBottom:'10px'}}>Page Not Found</h3>
      <p className="text-muted" style={{marginBottom:'30px'}}>The page you are looking for doesn&apos;t exist.</p>
      <a href="/" className="btn btn-primary">Back to Home</a>
    </main>
  );
}

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <ScrollTopBtn />
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsManager />} />
          <Route path="pages" element={<PagesManager />} />
        </Route>

        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
        <Route path="/products/:slug" element={<PublicLayout><ProductDetail /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/application" element={<PublicLayout><Application /></PublicLayout>} />
        <Route path="/solutions" element={<PublicLayout><Solutions /></PublicLayout>} />
        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </>
  );
}
