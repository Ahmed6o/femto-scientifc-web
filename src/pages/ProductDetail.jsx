import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import BASE_URL from '../config';
import './ProductDetail.css';

const DEFAULT_CONTACT_GLOBALS = {
  contact: { phone: '+20 123 456 7890' },
  contactBar: { text: 'Need expert advice?', buttonText: 'Get in touch' },
};

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('product');
  const [activeImage, setActiveImage] = useState(0);
  const [globals, setGlobals] = useState(DEFAULT_CONTACT_GLOBALS);

  useEffect(() => {
    fetch(`${BASE_URL}/api/settings`)
      .then(r => r.json())
      .then(settings => {
        const saved = settings.site_globals;
        if (saved) {
          setGlobals({
            contact: { ...DEFAULT_CONTACT_GLOBALS.contact, ...(saved.contact || {}) },
            contactBar: { ...DEFAULT_CONTACT_GLOBALS.contactBar, ...(saved.contactBar || {}) },
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.slug === slug);
        setProduct(found);
        if (found) {
          setRelated(data.filter(p => p.category === found.category && p.id !== found.id).slice(0, 3));
          
          let parsedImages = [];
          if (found.image) {
            if (typeof found.image === 'string' && found.image.startsWith('[')) {
               try { parsedImages = JSON.parse(found.image); } catch(e) { parsedImages = [found.image]; }
            } else {
               parsedImages = [found.image];
            }
          }
          if (parsedImages.length === 0) {
            setActiveImage(0);
          } else {
            setActiveImage(0);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  // Reset tab when product changes
  useEffect(() => {
    setActiveTab('product');
    setActiveImage(0);
  }, [slug]);

  const images = (() => {
    if (!product || !product.image) return [];
    if (typeof product.image === 'string' && product.image.startsWith('[')) {
      try { return JSON.parse(product.image); } catch(e) { return [product.image]; }
    }
    return [product.image];
  })();

  // Auto-slide images
  useEffect(() => {
    if (images.length > 1) {
      const timer = setInterval(() => {
        setActiveImage(prev => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [images.length]);

  if (loading) {
    return (
      <main>
        <div className="pd-loading">
          <div className="pd-spinner" />
          <p>Loading product details...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main>
        <div className="not-found">
          <i className="fas fa-flask" />
          <h2>Product Not Found</h2>
          <p>The product you are looking for doesn&apos;t exist or has been removed.</p>
          <Link to="/products" className="btn btn-primary">Browse All Products</Link>
        </div>
      </main>
    );
  }

  // Group specifications by category if they have a "group" field, otherwise flat list
  const specGroups = (() => {
    if (!product.specifications || product.specifications.length === 0) return [];
    // Check if any spec has a group
    const hasGroups = product.specifications.some(s => s.group);
    if (!hasGroups) return [{ title: 'Technical Specifications', specs: product.specifications }];
    // Group by "group" field
    const map = {};
    product.specifications.forEach(s => {
      const g = s.group || 'General';
      if (!map[g]) map[g] = [];
      map[g].push(s);
    });
    return Object.entries(map).map(([title, specs]) => ({ title, specs }));
  })();

  return (
    <main>
      {/* ── Breadcrumb ── */}
      <div className="pd-breadcrumb">
        <div className="container pd-breadcrumb-inner">
          <nav className="pd-breadcrumb-nav">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" />
            <Link to="/products">Products & Services</Link>
            <i className="fas fa-chevron-right" />
            <span>{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Hero Section ── */}
      <section className="pd-hero">
        <div className="container pd-hero-inner">
          {/* Left: Info */}
          <div className="pd-info">
            <span className="pd-category-label">
              {product.category.replace(/-/g, ' ')}
            </span>
            <h1 className="pd-title">{product.name}</h1>
            <p className="pd-tagline">{product.excerpt || product.description?.slice(0, 120)}</p>

            {/* Downloads / links */}
            <div className="pd-links">
              <a href="/contact" className="pd-link-item">
                <i className="fas fa-file-pdf" />
                <span>Brochure</span>
              </a>
              <a href="/contact" className="pd-link-item">
                <i className="fas fa-file-alt" />
                <span>Data Sheet</span>
              </a>
            </div>

            {/* Action buttons */}
            <div className="pd-actions">
              <a href="/contact" className="pd-btn-primary">
                <i className="fas fa-envelope" />
                Send request
              </a>
              <a href="/contact" className="pd-btn-outline">
                <i className="fas fa-phone" />
                Schedule Discovery Call
              </a>
            </div>

            {/* Industry tags */}
            {product.industry && product.industry.length > 0 && (
              <div className="pd-industries">
                {product.industry.map(ind => (
                  <span key={ind} className="pd-industry-tag">{ind}</span>
                ))}
              </div>
            )}
          </div>

          {/* Right: Image */}
          <div className="pd-media">
            <div className="pd-media-card">
              {images.length > 0 ? (
                <img
                  src={images[activeImage] || images[0]}
                  alt={product.name}
                  className="pd-product-img"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/560x420/eef2ff/1a5db5?text=${encodeURIComponent(product.name)}`;
                  }}
                />
              ) : (
                <div className="pd-no-image" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontSize: 48}}><i className="fas fa-cube"/></div>
              )}
              <div className="pd-brand-badge">
                <i className="fas fa-certificate" />
                {product.brand}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div className="pd-gallery-thumbs">
                {images.map((img, idx) => (
                  <button 
                    key={idx} 
                    className={`pd-thumb-btn ${activeImage === idx ? 'active' : ''}`}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Tabs Navigation ── */}
      <div className="pd-tabs-bar">
        <div className="container pd-tabs-inner">
          <nav className="pd-tabs-nav">
            <button
              className={`pd-tab ${activeTab === 'product' ? 'active' : ''}`}
              onClick={() => setActiveTab('product')}
            >
              PRODUCT
            </button>
            {specGroups.length > 0 && (
              <button
                className={`pd-tab ${activeTab === 'specifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('specifications')}
              >
                SPECIFICATIONS
              </button>
            )}
            {related.length > 0 && (
              <button
                className={`pd-tab ${activeTab === 'related' ? 'active' : ''}`}
                onClick={() => setActiveTab('related')}
              >
                RELATED PRODUCTS
              </button>
            )}
          </nav>
          <a href="/contact" className="pd-compare-link">
            <i className="fas fa-balance-scale" /> Compare &rarr;
          </a>
        </div>
      </div>

      {/* ── Tab: Product ── */}
      {activeTab === 'product' && (
        <section className="pd-tab-content section">
          <div className="container">
            <div className="pd-product-section">
              <div className="pd-product-description">
                <p>{product.description}</p>
              </div>

              {/* Product Video */}
              {product.video_url && (
                <div className="pd-product-video" style={{ marginBottom: '36px' }}>
                  {product.video_url.includes('youtube.com') || product.video_url.includes('youtu.be') ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${product.video_url.split('v=')[1]?.split('&')[0] || product.video_url.split('/').pop()}`}
                      frameBorder="0"
                      allowFullScreen
                      style={{ width: '100%', aspectRatio: '16/9', borderRadius: '12px' }}
                    ></iframe>
                  ) : (
                    <video
                      src={product.video_url}
                      controls
                      style={{ width: '100%', borderRadius: '12px', display: 'block' }}
                    />
                  )}
                </div>
              )}

              {/* Key Features */}
              {product.industry && product.industry.length > 0 && (
                <div className="pd-feature-grid">
                  {product.industry.map((feat, i) => (
                    <div key={i} className="pd-feature-card">
                      <div className="pd-feature-icon">
                        <i className="fas fa-check-circle" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Contact bar */}
              <div className="pd-contact-bar">
                <div className="pd-contact-icon">
                  <i className="fas fa-headset" />
                </div>
                <div className="pd-contact-text">
                  <small>{globals.contactBar.text}</small>
                  <strong>{globals.contact.phone}</strong>
                </div>
                <a href="/contact" className="pd-btn-primary pd-contact-cta">
                  <i className="fas fa-envelope" /> {globals.contactBar.buttonText}
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Tab: Specifications ── */}
      {activeTab === 'specifications' && (
        <section className="pd-tab-content section">
          <div className="container">
            {specGroups.length > 0 ? (
              <div className="pd-specs-grid">
                {specGroups.map((group, gi) => (
                  <div key={gi} className="pd-spec-group">
                    <div className="pd-spec-group-header">
                      <i className="fas fa-sliders-h" />
                      <h3>{group.title}</h3>
                    </div>
                    <table className="pd-spec-table">
                      <tbody>
                        {group.specs.map((spec, si) => (
                          <tr key={si}>
                            <td className="pd-spec-key">{spec.key}</td>
                            <td className="pd-spec-val">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ) : (
              <div className="pd-no-specs">
                <i className="fas fa-info-circle" />
                <p>No specifications available for this product.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Tab: Related Products ── */}
      {activeTab === 'related' && (
        <section className="pd-tab-content section bg-alt">
          <div className="container">
            <div className="pd-related-header">
              <h2>Related <span>Products</span></h2>
              <Link to="/products" className="pd-view-all">View all products &rarr;</Link>
            </div>
            <div className="pd-related-grid">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Always show related at bottom if not in tab ── */}
      {activeTab !== 'related' && related.length > 0 && (
        <section className="section bg-alt">
          <div className="container">
            <div className="pd-related-header">
              <span className="subtitle">You May Also Like</span>
              <h2>Related <span>Products</span></h2>
            </div>
            <div className="pd-related-grid">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
