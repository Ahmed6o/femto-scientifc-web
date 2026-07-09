import { useState } from 'react';
import { Link } from 'react-router-dom';
import { pageContact } from '../data/pages';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', product: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', phone: '', company: '', product: '', message: '' });
  };

  return (
    <main>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container breadcrumb-content">
          <h1>Contact Us</h1>
          <nav className="breadcrumb-nav">
            <Link to="/">Home</Link>
            <i className="fas fa-chevron-right" style={{fontSize:'10px'}} />
            <span>Contact Us</span>
          </nav>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info">
              <span className="subtitle">{pageContact?.subtitle}</span>
              <h2>{pageContact?.title?.split(' ')[0]} {pageContact?.title?.split(' ').slice(1).join(' ')}</h2>
              <div className="divider" />
              <p>{pageContact?.desc}</p>

              <div className="contact-cards">
                {pageContact?.cards?.map((card) => (
                  <div key={card.title} className="contact-card">
                    <div className="contact-card-icon"><i className={`fas ${card.icon}`} /></div>
                    <div>
                      <h4>{card.title}</h4>
                      <p>{card.content}</p>
                      <small>{card.sub}</small>
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-socials">
                <h4>Follow Us</h4>
                <div className="contact-social-btns">
                  {['fb fa-facebook-f', 'li fa-linkedin-in', 'tw fa-twitter', 'yt fa-youtube'].map((s) => {
                    const [cls, icon] = s.split(' ');
                    return (
                      <a key={icon} href="#" className={`contact-social ${cls}`}>
                        <i className={`fab ${icon}`} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form-wrap">
              <div className="contact-form-header">
                <h3><i className="fas fa-paper-plane" /> Send Us a Message</h3>
                <p>Fill out the form below and we&apos;ll respond promptly.</p>
              </div>

              {submitted ? (
                <div className="form-success">
                  <i className="fas fa-check-circle" />
                  <h3>Message Sent Successfully!</h3>
                  <p>Thank you for contacting us. Our team will reach out to you within 24 hours.</p>
                  <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name"><i className="fas fa-user" /> Full Name *</label>
                      <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email"><i className="fas fa-envelope" /> Email Address *</label>
                      <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone"><i className="fas fa-phone" /> Phone Number</label>
                      <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+20 1XX XXX XXXX" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="company"><i className="fas fa-building" /> Company / Institution</label>
                      <input id="company" name="company" type="text" value={form.company} onChange={handleChange} placeholder="Your company name" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="product"><i className="fas fa-flask" /> Product of Interest</label>
                    <input id="product" name="product" type="text" value={form.product} onChange={handleChange} placeholder="E.g., Tensiometer K100, Turbiscan Lab..." />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message"><i className="fas fa-comment-alt" /> Your Message *</label>
                    <textarea id="message" name="message" required value={form.message} onChange={handleChange} placeholder="Please describe your inquiry or requirement..." rows={6} />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg submit-btn">
                    <i className="fas fa-paper-plane" /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <div className="contact-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.848509891893!2d31.2243!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzM5LjgiTiAzMcKwMTMnMjcuNSJF!5e0!3m2!1sen!2seg!4v1234567890"
          width="100%"
          height="380"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Femto Scientific Location"
        />
      </div>
    </main>
  );
}
