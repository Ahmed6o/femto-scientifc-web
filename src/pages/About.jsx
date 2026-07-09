import { Link } from 'react-router-dom';
import { pageAbout } from '../data/pages';
import './About.css';

export default function About() {
  return (
    <main>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container breadcrumb-content">
          <h1>{pageAbout?.hero?.title}</h1>
          <nav className="breadcrumb-nav">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" style={{fontSize:'10px'}} />
            <span>{pageAbout?.hero?.title}</span>
          </nav>
        </div>
      </div>

      {/* WHO WE ARE */}
      <section className="section">
        <div className="container">
          <div className="about-detail-grid">
            <div className="about-detail-img">
              <img
                src="/images/logo.svg"
                alt="Femto Scientific Team"
              />
              <div className="about-detail-shape" />
            </div>
            <div className="about-detail-text">
              <span className="subtitle">{pageAbout?.whoWeAre?.subtitle}</span>
              <h2>{pageAbout?.whoWeAre?.title}</h2>
              <div className="divider" />
              <p>{pageAbout?.whoWeAre?.p1}</p>
              <p>{pageAbout?.whoWeAre?.p2}</p>
              <p>{pageAbout?.whoWeAre?.p3}</p>
              <div className="about-highlight-cards">
                <div className="about-highlight">
                  <strong>Our Mission</strong>
                  <p>{pageAbout?.whoWeAre?.mission}</p>
                </div>
                <div className="about-highlight">
                  <strong>Our Vision</strong>
                  <p>{pageAbout?.whoWeAre?.vision}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="about-stats-section">
        <div className="container">
          <div className="about-stats-grid">
            {pageAbout?.stats?.map((stat) => (
              <div key={stat.label} className="about-stat-card">
                <div className="about-stat-icon"><i className={`fas ${stat.icon}`} /></div>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section bg-alt">
        <div className="container">
          <div className="section-title">
            <span className="subtitle">What Drives Us</span>
            <h2>Our Core <span>Values</span></h2>
          </div>
          <div className="values-grid">
            {pageAbout?.values?.map((val) => (
              <div key={val.title} className="value-card">
                <div className="value-icon"><i className={`fas ${val.icon}`} /></div>
                <h3>{val.title}</h3>
                <p>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <span className="subtitle">Our Services</span>
            <h2>What We <span>Do</span></h2>
            <p>End-to-end scientific instrument services from supply to ongoing support.</p>
          </div>
          <div className="services-grid">
            {pageAbout?.services?.map((service) => (
              <div key={service.title} className="service-card">
                <div className="service-icon"><i className={`fas ${service.icon}`} /></div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <h2>Ready to Partner With Us?</h2>
          <p>Contact our team for expert advice and personalized solutions.</p>
          <div className="cta-btns">
            <Link to="/contact" className="btn btn-white btn-lg">
              <i className="fas fa-envelope" /> Contact Us
            </Link>
            <Link to="/products" className="btn btn-outline btn-lg" style={{borderColor:'rgba(255,255,255,0.4)', color:'white'}}>
              <i className="fas fa-th-large" /> Explore Products
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
