import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { heroSlides } from '../data/products';
import './HeroSlider.css';

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [current]);

  const goTo = (index) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 300);
  };

  const slide = heroSlides[current];

  return (
    <section className="hero-slider">
      {/* Background layers */}
      {heroSlides.map((s, i) => (
        <div
          key={s.id}
          className={`hero-bg ${i === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${s.image})` }}
        />
      ))}
      <div className="hero-overlay" />

      {/* Content */}
      <div className={`hero-content container ${animating ? 'fade-out' : 'fade-in'}`}>
        <div className="hero-text">
          <span className="hero-subtitle">
            <i className="fas fa-flask" /> {slide.subtitle}
          </span>
          <h1 className="hero-title">{slide.title}</h1>
          <div className="hero-divider" />
          <p className="hero-desc">{slide.description}</p>
          <div className="hero-btns">
            <Link to={slide.primaryBtn.link} className="btn btn-primary btn-lg">
              {slide.primaryBtn.text} <i className="fas fa-arrow-right" />
            </Link>
            <Link to={slide.secondaryBtn.link} className="btn btn-white btn-lg">
              {slide.secondaryBtn.text}
            </Link>
          </div>
        </div>

        <div className="hero-stats">
          {[
            { value: '15+', label: 'Years Experience' },
            { value: '2500+', label: 'Satisfied Clients' },
            { value: '150+', label: 'Products' },
          ].map((stat) => (
            <div key={stat.label} className="hero-stat-item">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="hero-nav">
        <button className="hero-arrow" onClick={() => goTo((current - 1 + heroSlides.length) % heroSlides.length)}>
          <i className="fas fa-chevron-left" />
        </button>
        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === current ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <button className="hero-arrow" onClick={() => goTo((current + 1) % heroSlides.length)}>
          <i className="fas fa-chevron-right" />
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>Scroll Down</span>
      </div>
    </section>
  );
}
