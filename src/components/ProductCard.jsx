import { Link } from 'react-router-dom';
import './ProductCard.css';

/**
 * layout: 'grid' | 'wide' | 'list' | 'compact'
 */
export default function ProductCard({ product, layout = 'grid' }) {
  if (layout === 'list') {
    return (
      <div className="pc-list-card">
        <div className="pc-list-img">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.target.src = `https://placehold.co/300x220/eef2ff/1a5db5?text=${encodeURIComponent(product.name)}`;
            }}
          />
          <span className="product-badge">{product.brand}</span>
        </div>
        <div className="pc-list-body">
          <span className="product-category-tag">
            <i className="fas fa-tag" /> {product.category.replace(/-/g, ' ')}
          </span>
          <h3 className="pc-list-title">
            <Link to={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="pc-list-excerpt">{product.excerpt}</p>
          <div className="pc-list-footer">
            <div className="product-industries">
              {(product.industry || []).slice(0, 3).map((ind) => (
                <span key={ind} className="industry-chip">{ind}</span>
              ))}
              {(product.industry || []).length > 3 && (
                <span className="industry-chip">+{product.industry.length - 3}</span>
              )}
            </div>
            <Link to={`/products/${product.slug}`} className="pc-list-btn">
              View Details <i className="fas fa-arrow-right" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <div className="pc-compact-card">
        <div className="pc-compact-img">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.target.src = `https://placehold.co/60x60/eef2ff/1a5db5?text=${encodeURIComponent(product.name[0])}`;
            }}
          />
        </div>
        <div className="pc-compact-info">
          <span className="pc-compact-cat">{product.category.replace(/-/g, ' ')}</span>
          <Link to={`/products/${product.slug}`} className="pc-compact-name">
            {product.name}
          </Link>
          <span className="pc-compact-brand">{product.brand}</span>
        </div>
        <div className="pc-compact-chips">
          {(product.industry || []).slice(0, 2).map((ind) => (
            <span key={ind} className="industry-chip">{ind}</span>
          ))}
        </div>
        <Link to={`/products/${product.slug}`} className="pc-compact-btn">
          <i className="fas fa-chevron-right" />
        </Link>
      </div>
    );
  }

  // 'grid' | 'wide' — same card, wide just gets bigger via CSS column count
  return (
    <div className={`product-card ${layout === 'wide' ? 'product-card--wide' : ''}`}>
      <div className="product-card-img-wrap">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/400x300/eef2ff/1a5db5?text=${encodeURIComponent(product.name)}`;
          }}
        />
        <div className="product-card-overlay">
          <Link to={`/products/${product.slug}`} className="btn btn-white btn-sm">
            <i className="fas fa-eye" /> View Details
          </Link>
        </div>
        <span className="product-badge">{product.brand}</span>
      </div>

      <div className="product-card-body">
        <span className="product-category-tag">
          <i className="fas fa-tag" /> {product.category.replace(/-/g, ' ')}
        </span>
        <h3 className="product-card-title">
          <Link to={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="product-card-excerpt">{product.excerpt}</p>

        <div className="product-card-footer">
          <div className="product-industries">
            {(product.industry || []).slice(0, 2).map((ind) => (
              <span key={ind} className="industry-chip">{ind}</span>
            ))}
            {(product.industry || []).length > 2 && (
              <span className="industry-chip">+{product.industry.length - 2}</span>
            )}
          </div>
          <Link to={`/products/${product.slug}`} className="read-more-btn">
            Read More <i className="fas fa-arrow-right" />
          </Link>
        </div>
      </div>
    </div>
  );
}
