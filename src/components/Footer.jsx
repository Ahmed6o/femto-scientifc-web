import { Link } from 'react-router-dom';
import './Footer.css';

const footerLinks = {
  products: [
    { label: 'Tensiometers', path: '/products?category=tensiometers' },
    { label: 'Drop Shape Analyzers', path: '/products?category=drop-shape' },
    { label: 'Foam Analyzers', path: '/products?category=foam-analysis' },
    { label: 'Stability Analyzers', path: '/products?category=stability' },
    { label: 'Particle Size Analyzers', path: '/products?category=particle-size' },
    { label: 'Thermal Analyzers', path: '/products?category=thermal-analyzer' },
    { label: 'Glove Box / Isolator', path: '/products?category=glove-box' },
    { label: 'All Products', path: '/products' },
  ],
  company: [
    { label: 'About Us', path: '/about' },
    { label: 'Application Notes', path: '/application' },
    { label: 'Solutions', path: '/solutions' },
    { label: 'Maintenance & Repair', path: '/maintenance' },
    { label: 'Knowledge Center', path: '/knowledge' },
    { label: 'News & Events', path: '/news' },
    { label: 'Contact Us', path: '/contact' },
  ],
};

const industries = [
  'Pharmaceuticals & Cosmetics',
  'Food / Beverages',
  'Petroleum',
  'Research / Education',
  'Chemicals',
  'Electricity and Energy',
  'Water Treatment',
  'Cement Manufacturing',
];

export default function Footer() {
  return (
    <footer className="footer">
      {/* Main Footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Col */}
            <div className="footer-brand">
              <Link to="/">
                <img
                  src="/images/LOGO_PNG-removebg-preview-e1682507103259.png"
                  alt="Femto Scientific"
                  height="60"
                  className="footer-logo"
                />
              </Link>
              <p className="footer-desc">
                We are a leading company in Egypt for Supplying, Installing, Training,
                and after sales support for Scientific and Analytical instruments.
              </p>
              <div className="footer-contact-list">
                <a href="tel:+201234567890" className="footer-contact-item">
                  <div className="footer-contact-icon"><i className="fas fa-phone" /></div>
                  <span>+20 123 456 7890</span>
                </a>
                <a href="mailto:info@femto-scientific.com" className="footer-contact-item">
                  <div className="footer-contact-icon"><i className="fas fa-envelope" /></div>
                  <span>info@femto-scientific.com</span>
                </a>
                <div className="footer-contact-item">
                  <div className="footer-contact-icon"><i className="fas fa-map-marker-alt" /></div>
                  <span>Cairo, Egypt</span>
                </div>
              </div>
              <div className="footer-socials">
                <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="social-btn fb"><i className="fab fa-facebook-f" /></a>
                <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="social-btn li"><i className="fab fa-linkedin-in" /></a>
                <a href="https://www.twitter.com" target="_blank" rel="noreferrer" className="social-btn tw"><i className="fab fa-twitter" /></a>
                <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="social-btn yt"><i className="fab fa-youtube" /></a>
              </div>
            </div>

            {/* Products Col */}
            <div className="footer-col">
              <h3 className="footer-title">Our Products</h3>
              <ul className="footer-links">
                {footerLinks.products.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path}>
                      <i className="fas fa-angle-right" /> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Col */}
            <div className="footer-col">
              <h3 className="footer-title">Company</h3>
              <ul className="footer-links">
                {footerLinks.company.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path}>
                      <i className="fas fa-angle-right" /> {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Industries Col */}
            <div className="footer-col">
              <h3 className="footer-title">Industries Served</h3>
              <div className="industries-tags">
                {industries.map((ind) => (
                  <span key={ind} className="industry-tag">{ind}</span>
                ))}
              </div>

              <div className="footer-newsletter">
                <h4>Stay Updated</h4>
                <p>Subscribe for latest product news and updates.</p>
                <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                  <input type="email" placeholder="Your email address..." />
                  <button type="submit" className="btn btn-primary btn-sm">
                    <i className="fas fa-paper-plane" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} <strong>Femto-Scientific</strong>. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <span>|</span>
            <Link to="/terms">Terms of Use</Link>
            <span>|</span>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
