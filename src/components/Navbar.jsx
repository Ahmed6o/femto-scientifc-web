import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/products', label: 'Products', hasDropdown: true },
  { path: '/application', label: 'Application' },
  { path: '/solutions', label: 'Solutions' },
  { path: '/contact', label: 'Contact Us' },
];

const productsByType = [
  { label: 'Tensiometers', path: '/products?category=tensiometers' },
  { label: 'Drop Shape Analyzers', path: '/products?category=drop-shape' },
  { label: 'Foam Analysis', path: '/products?category=foam-analysis' },
  { label: 'Density Meters', path: '/products?category=density-meter' },
  { label: 'Polarimeters', path: '/products?category=polarimeter' },
  { label: 'Refractometers', path: '/products?category=refractometers' },
  { label: 'Stability & Shelf-Life', path: '/products?category=stability' },
  { label: 'Particle Size Analyzers', path: '/products?category=particle-size' },
  { label: 'Flame Photometers', path: '/products?category=flame-photometers' },
  { label: 'Melting Point Meters', path: '/products?category=melting-point' },
  { label: 'Microscopes', path: '/products?category=microscopes' },
  { label: 'Glove Box / Isolator', path: '/products?category=glove-box' },
  { label: 'Flash Point Tester', path: '/products?category=flash-point' },
  { label: 'Thermal Analyzer', path: '/products?category=thermal-analyzer' },
  { label: 'Potentiostat-Galvanostat', path: '/products?category=potentiostat' },
];

const productsByIndustry = [
  { label: 'Pharmaceuticals & Cosmetics', path: '/products?industry=pharma' },
  { label: 'Food / Beverages', path: '/products?industry=food' },
  { label: 'Petroleum', path: '/products?industry=petroleum' },
  { label: 'Research / Education', path: '/products?industry=research' },
  { label: 'Chemicals', path: '/products?industry=chemicals' },
  { label: 'Electricity and Energy', path: '/products?industry=energy' },
  { label: 'Water Treatment', path: '/products?industry=water' },
  { label: 'Cement Manufacturing', path: '/products?industry=cement' },
  { label: 'Paints and Inks', path: '/products?industry=paints' },
  { label: 'Mineral / Mining', path: '/products?industry=mining' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setSearch('');
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-left">
            <a href="mailto:info@femto-scientific.com" className="topbar-link">
              <i className="fas fa-envelope" /> info@femto-scientific.com
            </a>
            <a href="tel:+201234567890" className="topbar-link">
              <i className="fas fa-phone" /> +20 123 456 7890
            </a>
          </div>
          <div className="topbar-right">
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="topbar-social"><i className="fab fa-facebook-f" /></a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="topbar-social"><i className="fab fa-linkedin-in" /></a>
            <a href="https://www.twitter.com" target="_blank" rel="noreferrer" className="topbar-social"><i className="fab fa-twitter" /></a>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="topbar-social"><i className="fab fa-youtube" /></a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <img
              src="/images/LOGO_PNG-removebg-preview-e1682507103259.png"
              alt="Femto Scientific Logo"
              height="55"
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="navbar-nav">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <li key={link.path} className="nav-item has-dropdown" ref={dropdownRef}>
                  <button
                    className={`nav-link nav-link-btn ${productsOpen ? 'active' : ''}`}
                    onClick={() => setProductsOpen(!productsOpen)}
                  >
                    {link.label}
                    <i className={`fas fa-chevron-down nav-arrow ${productsOpen ? 'rotate' : ''}`} />
                  </button>

                  {/* Mega Dropdown */}
                  <div className={`mega-dropdown ${productsOpen ? 'open' : ''}`}>
                    <div className="mega-dropdown-inner">
                      <div className="mega-col">
                        <h4 className="mega-col-title">
                          <i className="fas fa-flask" /> Product By Type
                        </h4>
                        <ul>
                          {productsByType.map((item) => (
                            <li key={item.path}>
                              <Link to={item.path} onClick={() => setProductsOpen(false)}>
                                <i className="fas fa-angle-right" /> {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mega-col">
                        <h4 className="mega-col-title">
                          <i className="fas fa-industry" /> Products by Industry
                        </h4>
                        <ul>
                          {productsByIndustry.map((item) => (
                            <li key={item.path}>
                              <Link to={item.path} onClick={() => setProductsOpen(false)}>
                                <i className="fas fa-angle-right" /> {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mega-col mega-col-featured">
                        <h4 className="mega-col-title">
                          <i className="fas fa-star" /> Featured Brands
                        </h4>
                        <div className="mega-brands">
                          {['Krüss Scientific', 'Formulaction', 'Microtrac MRB', 'AMEL', 'Mast Group'].map(b => (
                            <Link
                              key={b}
                              to={`/products?brand=${encodeURIComponent(b)}`}
                              className="mega-brand-tag"
                              onClick={() => setProductsOpen(false)}
                            >
                              {b}
                            </Link>
                          ))}
                        </div>
                        <div className="mega-cta">
                          <p>Can't find what you're looking for?</p>
                          <Link to="/contact" className="btn btn-primary btn-sm" onClick={() => setProductsOpen(false)}>
                            Request a Quote
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={link.path} className="nav-item">
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    {link.label}
                  </NavLink>
                </li>
              )
            )}
          </ul>

          {/* Actions */}
          <div className="navbar-actions">
            {/* Search */}
            <div className={`search-wrap ${searchOpen ? 'open' : ''}`}>
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus={searchOpen}
                />
                <button type="submit"><i className="fas fa-search" /></button>
              </form>
            </div>
            <button
              className="action-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <i className={`fas ${searchOpen ? 'fa-times' : 'fa-search'}`} />
            </button>
            <Link to="/contact" className="btn btn-primary btn-sm nav-quote-btn">
              <i className="fas fa-envelope" /> Request Quote
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className={`hamburger ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mobile-contact">
            <a href="tel:+201234567890"><i className="fas fa-phone" /> +20 123 456 7890</a>
            <a href="mailto:info@femto-scientific.com"><i className="fas fa-envelope" /> info@femto-scientific.com</a>
          </div>
        </div>
      </nav>
      <div className="navbar-spacer" />
    </>
  );
}
