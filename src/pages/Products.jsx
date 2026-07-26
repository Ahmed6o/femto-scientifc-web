import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/products';
import BASE_URL from '../config';
import './Products.css';

const LAYOUT_OPTIONS = [
  { id: 'grid',    icon: 'fa-th',          label: 'Grid',    title: '3-column grid' },
  { id: 'wide',    icon: 'fa-th-large',    label: 'Wide',    title: '2-column wide grid' },
  { id: 'list',    icon: 'fa-list',        label: 'List',    title: 'Horizontal list' },
  { id: 'compact', icon: 'fa-bars',        label: 'Compact', title: 'Compact table view' },
];

const SORT_OPTIONS = [
  { id: 'default',   label: 'Default Order' },
  { id: 'name-asc',  label: 'Name A → Z' },
  { id: 'name-desc', label: 'Name Z → A' },
  { id: 'featured',  label: 'Featured First' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search,          setSearch]         = useState('');
  const [activeBrand,     setActiveBrand]    = useState('all');
  const [allProducts,     setAllProducts]    = useState([]);
  const [displayed,       setDisplayed]      = useState([]);
  const [loading,         setLoading]        = useState(true);

  // Layout & sort — persisted in localStorage
  const [layout, setLayout] = useState(() => localStorage.getItem('pf-layout') || 'grid');
  const [sort,   setSort]   = useState('default');

  // Sidebar open on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ── Fetch ── */
  useEffect(() => {
    fetch(`${BASE_URL}/api/products`)
      .then(r => r.json())
      .then(data => { setAllProducts(data); setDisplayed(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  /* ── Sync URL ── */
  useEffect(() => {
    setActiveCategory(searchParams.get('category') || 'all');
    setSearch(searchParams.get('search') || '');
    setActiveBrand(searchParams.get('brand') || 'all');
  }, [searchParams]);

  /* ── Filter + Sort ── */
  useEffect(() => {
    let f = allProducts;
    if (activeCategory !== 'all') f = f.filter(p => p.category === activeCategory);
    if (activeBrand    !== 'all') f = f.filter(p => p.brand    === activeBrand);
    if (search) {
      const q = search.toLowerCase();
      f = f.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
      );
    }
    if (sort === 'name-asc')  f = [...f].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'name-desc') f = [...f].sort((a, b) => b.name.localeCompare(a.name));
    if (sort === 'featured')  f = [...f].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    setDisplayed(f);
  }, [activeCategory, search, activeBrand, allProducts, sort]);

  const allBrands = ['all', ...new Set(allProducts.map(p => p.brand).filter(Boolean))];

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      catId === 'all' ? p.delete('category') : p.set('category', catId);
      return p;
    });
    setSidebarOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      !search ? p.delete('search') : p.set('search', search);
      return p;
    });
  };

  const handleLayoutChange = (l) => {
    setLayout(l);
    localStorage.setItem('pf-layout', l);
  };

  const clearAll = () => {
    setSearch(''); setActiveCategory('all'); setActiveBrand('all'); setSort('default');
    setSearchParams({});
  };

  const activeFiltersCount = [
    activeCategory !== 'all', activeBrand !== 'all', !!search
  ].filter(Boolean).length;

  return (
    <main>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container breadcrumb-content">
          <h1>Our Products</h1>
          <nav className="breadcrumb-nav">
            <a href="/">Home</a>
            <i className="fas fa-chevron-right" style={{ fontSize: '10px' }} />
            <span>Products</span>
          </nav>
        </div>
      </div>

      <section className="section products-page">
        <div className="container">

          {/* ── Top Bar ── */}
          <div className="products-topbar">
            {/* Left: result + mobile sidebar btn */}
            <div className="products-topbar-left">
              <button
                className={`sidebar-toggle-btn ${sidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(o => !o)}
              >
                <i className="fas fa-sliders-h" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="filter-badge">{activeFiltersCount}</span>
                )}
              </button>
              <span className="products-result-info">
                <strong>{displayed.length}</strong> product{displayed.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Center: Search */}
            <form className="products-search" onSubmit={handleSearch}>
              <i className="fas fa-search" />
              <input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button type="button" className="clear-search" onClick={clearAll}>
                  <i className="fas fa-times" />
                </button>
              )}
            </form>

            {/* Right: Sort + Layout switcher */}
            <div className="products-topbar-right">
              <div className="sort-select-wrap">
                <i className="fas fa-sort-amount-down" />
                <select
                  className="sort-select"
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="layout-switcher" role="group" aria-label="View layout">
                {LAYOUT_OPTIONS.map(l => (
                  <button
                    key={l.id}
                    className={`layout-btn ${layout === l.id ? 'active' : ''}`}
                    onClick={() => handleLayoutChange(l.id)}
                    title={l.title}
                    aria-pressed={layout === l.id}
                  >
                    <i className={`fas ${l.icon}`} />
                    <span className="layout-btn-label">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Body: Sidebar + Main ── */}
          <div className={`products-layout ${sidebarOpen ? 'sidebar-visible' : ''}`}>

            {/* Sidebar */}
            <aside className="products-sidebar">
              {/* Mobile close */}
              <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
                <i className="fas fa-times" /> Close
              </button>

              {/* Categories */}
              <div className="sidebar-widget">
                <h3 className="sidebar-title">
                  <i className="fas fa-th-list" /> Categories
                </h3>
                <ul className="sidebar-list">
                  {categories.map(cat => (
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

              {/* Brands */}
              <div className="sidebar-widget">
                <h3 className="sidebar-title">
                  <i className="fas fa-tag" /> Brand
                </h3>
                <ul className="sidebar-list">
                  {allBrands.map(brand => (
                    <li key={brand}>
                      <button
                        className={`sidebar-link ${activeBrand === brand ? 'active' : ''}`}
                        onClick={() => setActiveBrand(brand)}
                      >
                        <span>{brand === 'all' ? 'All Brands' : brand}</span>
                        {brand !== 'all' && (
                          <span className="cat-count">
                            {allProducts.filter(p => p.brand === brand).length}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Active filters */}
              {activeFiltersCount > 0 && (
                <button className="clear-filters-btn" onClick={clearAll}>
                  <i className="fas fa-times-circle" /> Clear all filters
                </button>
              )}

              {/* CTA */}
              <div className="sidebar-cta">
                <i className="fas fa-headset" />
                <h4>Can&apos;t Find What You Need?</h4>
                <p>Our experts are ready to help you find the right solution.</p>
                <a href="/contact" className="btn btn-primary">Contact Us</a>
              </div>
            </aside>

            {/* ── Products Area ── */}
            <div className="products-main">
              {loading ? (
                <div className="products-loading">
                  <div className="products-spinner" />
                  <p>Loading products…</p>
                </div>
              ) : displayed.length > 0 ? (
                <>
                  {/* Layout label */}
                  <div className="layout-indicator">
                    <i className={`fas ${LAYOUT_OPTIONS.find(l => l.id === layout)?.icon}`} />
                    {LAYOUT_OPTIONS.find(l => l.id === layout)?.title}
                  </div>

                  {/* Grid / Wide */}
                  {(layout === 'grid' || layout === 'wide') && (
                    <div className={`products-grid-page ${layout === 'wide' ? 'products-grid-wide' : ''}`}>
                      {displayed.map(p => (
                        <ProductCard key={p.id} product={p} layout={layout} />
                      ))}
                    </div>
                  )}

                  {/* List */}
                  {layout === 'list' && (
                    <div className="products-list-view">
                      {displayed.map(p => (
                        <ProductCard key={p.id} product={p} layout="list" />
                      ))}
                    </div>
                  )}

                  {/* Compact */}
                  {layout === 'compact' && (
                    <div className="products-compact-view">
                      {displayed.map(p => (
                        <ProductCard key={p.id} product={p} layout="compact" />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="no-products">
                  <i className="fas fa-search" />
                  <h3>No Products Found</h3>
                  <p>Try adjusting your search or filter criteria.</p>
                  <button className="btn btn-primary" onClick={clearAll}>Clear Filters</button>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </main>
  );
}
