import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import { featuredProducts, stats, categories } from '../data/products';
import { partners, clients } from '../data/logos';
import { pageHome } from '../data/pages';
import './Home.css';

// Animated counter hook
function useCounter(end, duration = 2000, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, started]);
  return count;
}

function StatItem({ icon, value, label }) {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const count = useCounter(value, 2000, started);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="stat-item" ref={ref}>
      <div className="stat-icon"><i className={`fas ${icon}`} /></div>
      <h3 className="stat-value">{count.toLocaleString()}+</h3>
      <p className="stat-label">{label}</p>
    </div>
  );
}

const sectors = [
  { icon: 'fa-pills', label: 'Pharmaceuticals & Cosmetics' },
  { icon: 'fa-utensils', label: 'Food & Beverages' },
  { icon: 'fa-oil-can', label: 'Petroleum' },
  { icon: 'fa-microscope', label: 'Research & Education' },
  { icon: 'fa-flask', label: 'Chemicals' },
  { icon: 'fa-bolt', label: 'Electricity & Energy' },
  { icon: 'fa-tint', label: 'Water Treatment' },
  { icon: 'fa-industry', label: 'Cement Manufacturing' },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <main>
      {/* Hero Slider */}
      <HeroSlider />

      {/* ===== FEATURES STRIP ===== */}
      <section className="features-strip">
        <div className="container features-strip-inner">
          {pageHome?.featuresStrip?.map((item) => (
            <div key={item.title} className="feature-strip-item">
              <div className="feature-strip-icon"><i className={`fas ${item.icon}`} /></div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section products-section">
        <div className="container">
          <div className="section-title">
            <span className="subtitle">Our Catalog</span>
            <h2>Featured <span>Products</span></h2>
            <p>Explore our top scientific and analytical instruments from world-leading manufacturers.</p>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs">
            <button
              className={`cat-tab ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Products
            </button>
            {categories.slice(1, 7).map((cat) => (
              <button
                key={cat.id}
                className={`cat-tab ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-40">
            <Link to="/products" className="btn btn-primary btn-lg">
              <i className="fas fa-th-large" /> View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="section about-section bg-alt">
        <div className="container">
          <div className="about-grid">
            <div className="about-img-col">
              <div className="about-img-wrap">
                <img
                  src="/images/logo.svg"
                  alt="About Femto Scientific"
                />
                <div className="about-img-badge">
                  <strong>15+</strong>
                  <span>Years of Experience</span>
                </div>
              </div>
            </div>

            <div className="about-text-col">
              <span className="subtitle">Who We Are</span>
              <h2>{pageHome?.about?.title1} <span>{pageHome?.about?.title2}</span></h2>
              <div className="divider" />
              <p>{pageHome?.about?.p1}</p>
              <p>{pageHome?.about?.p2}</p>

              <div className="about-features">
                {pageHome?.about?.features?.map((item) => (
                  <div key={item.text} className="about-feature-item">
                    <i className={`fas ${item.icon}`} />
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>

              <Link to="/about" className="btn btn-primary">
                Learn More About Us <i className="fas fa-arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS COUNTER ===== */}
      <section className="stats-section">
        <div className="stats-bg" />
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat) => (
              <StatItem key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTORS ===== */}
      <section className="section sectors-section">
        <div className="container">
          <div className="section-title">
            <span className="subtitle">Industries We Serve</span>
            <h2>Our <span>Sectors</span></h2>
            <p>Providing analytical solutions across a wide range of industries and applications.</p>
          </div>
          <div className="sectors-grid">
            {sectors.map((sector) => (
              <Link
                key={sector.label}
                to={`/products?industry=${encodeURIComponent(sector.label)}`}
                className="sector-card"
              >
                <div className="sector-icon"><i className={`fas ${sector.icon}`} /></div>
                <p>{sector.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section testimonials-section bg-alt">
        <div className="container">
          <div className="section-title text-left">
            <h2 className="testimonial-title">Satisfied voices</h2>
            <span className="subtitle testimonial-subtitle">What our customers say</span>
          </div>

          <div className="testimonial-box">
            <div className="quote-mark"><i className="fas fa-quote-left"></i></div>
            <div className="testimonial-content">
              <div className="testimonial-logo">
                <span style={{color: 'red', fontWeight: '900', fontSize: '3rem', fontFamily: 'Arial', fontStyle: 'italic', letterSpacing: '-2px'}}>3M</span>
              </div>
              <p className="testimonial-text">
                I like the quality and reliability of KRÜSS instruments, and the
                knowledgeable and rapid response from their team is always
                appreciated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PARTNERS ===== */}
      <section className="section partners-section">
        <div className="container">
          <div className="section-title text-center">
            <h2 style={{color: '#444', textTransform: 'uppercase', letterSpacing: '1px'}}>OUR PARTNERS</h2>
          </div>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="logos-slider"
          >
            {partners?.map((logo, idx) => (
              <SwiperSlide key={idx} className="logo-slide">
                <img src={logo} alt={`Partner ${idx}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ===== CLIENTS ===== */}
      <section className="section clients-section">
        <div className="container">
          <div className="section-title text-center">
            <h2 style={{color: '#444', textTransform: 'uppercase', letterSpacing: '1px'}}>OUR Clients</h2>
          </div>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
            }}
            autoplay={{ delay: 3500, disableOnInteraction: false, reverseDirection: true }}
            pagination={{ clickable: true }}
            className="logos-slider"
          >
            {clients?.map((logo, idx) => (
              <SwiperSlide key={idx} className="logo-slide">
                <img src={logo} alt={`Client ${idx}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <div className="cta-bg" />
        <div className="container">
          <div className="cta-content">
            <span className="subtitle" style={{color:'rgba(255,255,255,0.8)'}}>
              {pageHome?.cta?.subtitle}
            </span>
            <h2>{pageHome?.cta?.title}</h2>
            <p>{pageHome?.cta?.desc}</p>
            <div className="cta-btns">
              <Link to="/contact" className="btn btn-white btn-lg">
                <i className="fas fa-envelope" /> {pageHome?.cta?.btn1}
              </Link>
              <Link to="/products" className="btn btn-outline btn-lg" style={{borderColor:'rgba(255,255,255,0.4)', color:'white'}}>
                <i className="fas fa-th-large" /> {pageHome?.cta?.btn2}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
