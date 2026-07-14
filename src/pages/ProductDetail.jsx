import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import BASE_URL from '../config';
import './ProductDetail.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.slug === slug);
        setProduct(found);
        if (found) {
          setRelated(data.filter(p => p.category === found.category && p.id !== found.id).slice(0, 3));
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <main>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <i className="fas fa-spinner fa-spin fa-3x" style={{ color: 'var(--primary-color)' }}></i>
          <p style={{ marginTop: '20px', fontSize: '18px' }}>Loading product details...</p>
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
          <p>The product you are looking for doesn't exist or has been removed.</p>
          <Link to="/products" className="btn btn-primary">Browse All Products</Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container breadcrumb-content">
          <h1>{product.name}</h1>
          <nav className="breadcrumb-nav">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" style={{fontSize:'10px'}} />
            <Link to="/products">Products</Link>
            <i className="fas fa-chevron-right" style={{fontSize:'10px'}} />
            <span>{product.name}</span>
          </nav>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="product-detail-grid">
            {/* Media */}
            <div className="product-detail-img">
              {product.video_url ? (
                <video 
                  src={product.video_url} 
                  controls 
                  style={{width: '100%', borderRadius: '8px', border: '1px solid #ddd'}}
                />
              ) : (
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = `https://placehold.co/600x500/eef2ff/1a5db5?text=${encodeURIComponent(product.name)}`;
                  }}
                />
              )}
              <div className="product-detail-brand">
                <i className="fas fa-certificate" /> {product.brand}
              </div>
            </div>

            {/* Info */}
            <div className="product-detail-info">
              <span className="product-detail-category">
                <i className="fas fa-tag" /> {product.category.replace(/-/g, ' ')}
              </span>
              <h1>{product.name}</h1>
              <div className="divider" />
              <p className="product-detail-desc">{product.description}</p>

              {/* Specs */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="product-specs">
                  <h3><i className="fas fa-list-ul" /> Technical Specifications</h3>
                  <table>
                    <tbody>
                      {product.specifications.map((spec) => (
                        <tr key={spec.key}>
                          <td className="spec-key">{spec.key}</td>
                          <td className="spec-val">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Industries */}
              {product.industry && product.industry.length > 0 && (
                <div className="product-detail-industries">
                  <h4><i className="fas fa-industry" /> Applications:</h4>
                  <div className="detail-industry-tags">
                    {product.industry.map((ind) => (
                      <span key={ind} className="detail-industry-tag">{ind}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="product-detail-actions">
                <a href="/contact" className="btn btn-primary btn-lg">
                  <i className="fas fa-envelope" /> Request a Quote
                </a>
                <a href={product.url} target="_blank" rel="noreferrer" className="btn btn-outline btn-lg">
                  <i className="fas fa-external-link-alt" /> Visit Manufacturer
                </a>
              </div>

              {/* Contact info */}
              <div className="product-contact-bar">
                <i className="fas fa-phone" />
                <div>
                  <small>Need help? Call our experts</small>
                  <strong>+20 123 456 7890</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="section bg-alt">
          <div className="container">
            <div className="section-title">
              <span className="subtitle">You May Also Like</span>
              <h2>Related <span>Products</span></h2>
            </div>
            <div className="related-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
