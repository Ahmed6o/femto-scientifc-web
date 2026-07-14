import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/products';
import BASE_URL from '../config';
import './Products.css';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [activeBrand, setActiveBrand] = useState('all');
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    fetch(`${BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setAllProducts(data);
        setDisplayedProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Sync URL params
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const q = searchParams.get('search') || '';
    const brand = searchParams.get('brand') || 'all';
    setActiveCategory(cat);
    setSearch(q);
    setActiveBrand(brand);
  }, [searchParams]);

  useEffect(() => {
    let filtered = allProducts;
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
    if (activeBrand !== 'all') {
      filtered = filtered.filter(p => p.brand === activeBrand);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q))
      );
    }
    setDisplayedProducts(filtered);
  }, [activeCategory, search, activeBrand, allProducts]);

  const allBrands = ['all', ...new Set(allProducts.map(p => p.brand).filter(Boolean))];

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setSearchParams(prev => {
      const newP = new URLSearchParams(prev);
      if (catId === 'all') newP.delete('category');
      else newP.set('category', catId);
      return newP;
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(prev => {
      const newP = new URLSearchParams(prev);
      if (!search) newP.delete('search');
      else newP.set('search', search);
      return newP;
    });
  };

  return (
    <main>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container breadcrumb-content">
          <h1>Our Products</h1>
          <nav className="breadcrumb-nav">
            <a href="/">Home</a>
            <i className="fas fa-chevron-right" style={{fontSize:'10px'}} />
            <span>Products</span>
          </nav>
        </div>
      </div>

      <section className="section products-page">
        <div className="container">
          {/* Top Bar */}
          <div className="products-topbar">
            <div className="products-result-info">
              <strong>{displayedProducts.length}</strong> product{displayedProducts.length !== 1 ? 's' : ''} found
            </div>
            <form className="products-search" onSubmit={handleSearch}>
              <i className="fas fa-search" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button type="button" className="clear-search" onClick={() => { setSearch(''); setSearchParams({}); }}>
                  <i className="fas fa-times" />
                </button>
              )}
            </form>
          </div>

          <div className="products-layout">
            {/* Sidebar */}
            <aside className="products-sidebar">
              {/* Categories */}
              <div className="sidebar-widget">
                <h3 className="sidebar-title"><i className="fas fa-th-list" /> Product Categories</h3>
                <ul className="sidebar-list">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        className={`sidebar-link ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => handleCategoryChange(cat.id)}
                      >
                        <span>{cat.name}</span>
                        <span className="cat-count">
                          {cat.id === 'all' ? allProducts.length : allProducts.filter(p => p.category === cat.id).length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Brands Filter */}
              <div className="sidebar-widget">
                <h3 className="sidebar-title"><i className="fas fa-tag" /> Filter by Brand</h3>
                <ul className="sidebar-list">
                  {allBrands.map((brand) => (
                    <li key={brand}>
                      <button
                        className={`sidebar-link ${activeBrand === brand ? 'active' : ''}`}
                        onClick={() => setActiveBrand(brand)}
                      >
                        <span>{brand === 'all' ? 'All Brands' : brand}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact CTA */}
              <div className="sidebar-cta">
                <i className="fas fa-headset" />
                <h4>Can&apos;t Find What You Need?</h4>
                <p>Our experts are ready to help you find the right solution.</p>
                <a href="/contact" className="btn btn-primary">Contact Us</a>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="products-main">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <i className="fas fa-spinner fa-spin fa-2x" style={{ color: 'var(--primary-color)' }}></i>
                  <p style={{ marginTop: '10px' }}>Loading products...</p>
                </div>
              ) : displayedProducts.length > 0 ? (
                <div className="products-grid-page">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="no-products">
                  <i className="fas fa-search" />
                  <h3>No Products Found</h3>
                  <p>Try adjusting your search or filter criteria.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => { setSearch(''); setActiveCategory('all'); setActiveBrand('all'); setSearchParams({}); }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
