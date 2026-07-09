import { Link } from 'react-router-dom';
import './ProductCard.css';

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
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
          <Link
            to={`/products/${product.slug}`}
            className="btn btn-white btn-sm"
          >
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
            {product.industry.slice(0, 2).map((ind) => (
              <span key={ind} className="industry-chip">{ind}</span>
            ))}
            {product.industry.length > 2 && (
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
