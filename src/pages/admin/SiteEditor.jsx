import React, { useState, useEffect } from 'react';
import BASE_URL from '../../config';
import './SiteEditor.css';

const DEFAULT_GLOBALS = {
  contact: {
    email: 'info@femto-scientific.com',
    phone: '+20 123 456 7890',
    address: 'Cairo, Egypt',
  },
  social: {
    facebook: 'https://www.facebook.com',
    linkedin: 'https://www.linkedin.com',
    twitter: 'https://www.twitter.com',
    youtube: 'https://www.youtube.com',
  },
  companyDescription:
    'We are a leading company in Egypt for Supplying, Installing, Training, and after sales support for Scientific and Analytical instruments.',
  contactBar: {
    text: 'Need expert advice?',
    buttonText: 'Get in touch',
  },
  footer: {
    copyright: 'Femto-Scientific',
  },
};

export default function SiteEditor() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [openSections, setOpenSections] = useState({
    header: true,
    contactBar: false,
    footer: false,
  });

  // Load settings
  useEffect(() => {
    fetch(`${BASE_URL}/api/settings`)
      .then((r) => r.json())
      .then((settings) => {
        const saved = settings.site_globals || {};
        // Deep merge with defaults
        setData({
          contact: { ...DEFAULT_GLOBALS.contact, ...(saved.contact || {}) },
          social: { ...DEFAULT_GLOBALS.social, ...(saved.social || {}) },
          companyDescription: saved.companyDescription || DEFAULT_GLOBALS.companyDescription,
          contactBar: { ...DEFAULT_GLOBALS.contactBar, ...(saved.contactBar || {}) },
          footer: { ...DEFAULT_GLOBALS.footer, ...(saved.footer || {}) },
        });
      })
      .catch(() => {
        setData({ ...DEFAULT_GLOBALS });
      });
  }, []);

  // Save handler
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify({ site_globals: data }),
      });
      if (!res.ok) throw new Error('Save failed');
      showToast('Settings saved successfully!', 'success');
    } catch {
      showToast('Failed to save settings', 'error');
    }
    setSaving(false);
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Field updater
  const update = (path, value) => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <i className="fas fa-spinner fa-spin fa-2x" style={{ color: '#2271b1' }} />
        <p style={{ marginTop: 12, color: '#666' }}>Loading site settings...</p>
      </div>
    );
  }

  return (
    <div className="site-editor">
      {/* Header */}
      <div className="site-editor-header">
        <h1>
          <i className="fas fa-paint-brush" style={{ marginRight: 8, color: '#2271b1' }} />
          Site Editor
        </h1>
        <button
          className={`save-btn ${saving ? '' : ''}`}
          onClick={handleSave}
          disabled={saving}
        >
          <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'}`} />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {/* ═══════════════════ HEADER SECTION ═══════════════════ */}
      <div className="se-section">
        <div className="se-section-header" onClick={() => toggleSection('header')}>
          <h2>
            <i className="fas fa-window-maximize" /> Header (Top Bar + Navbar)
          </h2>
          <i className={`fas fa-chevron-down se-section-toggle ${openSections.header ? 'open' : ''}`} />
        </div>
        <div className={`se-section-body ${openSections.header ? 'open' : ''}`}>
          {/* Preview */}
          <div className="se-preview">
            <span className="se-preview-label"><i className="fas fa-eye" /> Live Preview</span>
            {/* Top Bar */}
            <div className="se-topbar-preview">
              <div className="se-topbar-left">
                <span><i className="fas fa-envelope" /> {data.contact.email}</span>
                <span><i className="fas fa-phone" /> {data.contact.phone}</span>
              </div>
              <div className="se-topbar-right">
                <a href="#"><i className="fab fa-facebook-f" /></a>
                <a href="#"><i className="fab fa-linkedin-in" /></a>
                <a href="#"><i className="fab fa-twitter" /></a>
                <a href="#"><i className="fab fa-youtube" /></a>
              </div>
            </div>
            {/* Navbar */}
            <div className="se-navbar-preview">
              <div className="se-navbar-logo">
                <img src="/images/LOGO_PNG-removebg-preview-e1682507103259.png" alt="Logo" />
              </div>
              <ul className="se-navbar-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Products ▾</a></li>
                <li><a href="#">Application</a></li>
                <li><a href="#">Solutions</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
              <a className="se-navbar-quote-btn" href="#">
                <i className="fas fa-envelope" /> Request Quote
              </a>
            </div>
          </div>

          {/* Edit Panel */}
          <div className="se-edit-panel">
            <h3><i className="fas fa-edit" /> Edit Header Information</h3>
            <div className="se-edit-row">
              <div className="se-edit-field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={data.contact.email}
                  onChange={(e) => update('contact.email', e.target.value)}
                />
              </div>
              <div className="se-edit-field">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={data.contact.phone}
                  onChange={(e) => update('contact.phone', e.target.value)}
                />
              </div>
            </div>
            <div className="se-separator" />
            <h3><i className="fas fa-share-alt" /> Social Media Links</h3>
            <div className="se-edit-row">
              <div className="se-edit-field">
                <label><i className="fab fa-facebook-f" style={{ color: '#1877f2' }} /> Facebook URL</label>
                <input
                  type="url"
                  value={data.social.facebook}
                  onChange={(e) => update('social.facebook', e.target.value)}
                />
              </div>
              <div className="se-edit-field">
                <label><i className="fab fa-linkedin-in" style={{ color: '#0a66c2' }} /> LinkedIn URL</label>
                <input
                  type="url"
                  value={data.social.linkedin}
                  onChange={(e) => update('social.linkedin', e.target.value)}
                />
              </div>
            </div>
            <div className="se-edit-row">
              <div className="se-edit-field">
                <label><i className="fab fa-twitter" style={{ color: '#1da1f2' }} /> Twitter URL</label>
                <input
                  type="url"
                  value={data.social.twitter}
                  onChange={(e) => update('social.twitter', e.target.value)}
                />
              </div>
              <div className="se-edit-field">
                <label><i className="fab fa-youtube" style={{ color: '#ff0000' }} /> YouTube URL</label>
                <input
                  type="url"
                  value={data.social.youtube}
                  onChange={(e) => update('social.youtube', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ CONTACT BAR SECTION ═══════════════════ */}
      <div className="se-section">
        <div className="se-section-header" onClick={() => toggleSection('contactBar')}>
          <h2>
            <i className="fas fa-headset" /> Contact Bar
          </h2>
          <i className={`fas fa-chevron-down se-section-toggle ${openSections.contactBar ? 'open' : ''}`} />
        </div>
        <div className={`se-section-body ${openSections.contactBar ? 'open' : ''}`}>
          {/* Preview */}
          <div className="se-preview">
            <span className="se-preview-label"><i className="fas fa-eye" /> Live Preview</span>
            <div style={{ padding: '20px' }}>
              <div className="se-contact-bar-preview">
                <div className="se-contact-bar-left">
                  <div className="se-contact-bar-icon">
                    <i className="fas fa-headset" />
                  </div>
                  <div className="se-contact-bar-text">
                    <p>{data.contactBar.text}</p>
                    <h3>{data.contact.phone}</h3>
                  </div>
                </div>
                <button className="se-contact-bar-btn">
                  <i className="fas fa-envelope" /> {data.contactBar.buttonText}
                </button>
              </div>
            </div>
          </div>

          {/* Edit Panel */}
          <div className="se-edit-panel">
            <h3><i className="fas fa-edit" /> Edit Contact Bar</h3>
            <div className="se-edit-row">
              <div className="se-edit-field">
                <label>Heading Text</label>
                <input
                  type="text"
                  value={data.contactBar.text}
                  onChange={(e) => update('contactBar.text', e.target.value)}
                />
              </div>
              <div className="se-edit-field">
                <label>Button Text</label>
                <input
                  type="text"
                  value={data.contactBar.buttonText}
                  onChange={(e) => update('contactBar.buttonText', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ FOOTER SECTION ═══════════════════ */}
      <div className="se-section">
        <div className="se-section-header" onClick={() => toggleSection('footer')}>
          <h2>
            <i className="fas fa-stream" /> Footer
          </h2>
          <i className={`fas fa-chevron-down se-section-toggle ${openSections.footer ? 'open' : ''}`} />
        </div>
        <div className={`se-section-body ${openSections.footer ? 'open' : ''}`}>
          {/* Preview */}
          <div className="se-preview">
            <span className="se-preview-label"><i className="fas fa-eye" /> Live Preview</span>
            <div className="se-footer-preview">
              <div className="se-footer-grid">
                {/* Brand col */}
                <div className="se-footer-brand">
                  <div className="se-footer-logo">
                    <img src="/images/LOGO_PNG-removebg-preview-e1682507103259.png" alt="Logo" />
                  </div>
                  <p>{data.companyDescription}</p>
                  <div className="se-footer-contact-item">
                    <div className="se-footer-contact-icon"><i className="fas fa-phone" /></div>
                    <span>{data.contact.phone}</span>
                  </div>
                  <div className="se-footer-contact-item">
                    <div className="se-footer-contact-icon"><i className="fas fa-envelope" /></div>
                    <span>{data.contact.email}</span>
                  </div>
                  <div className="se-footer-contact-item">
                    <div className="se-footer-contact-icon"><i className="fas fa-map-marker-alt" /></div>
                    <span>{data.contact.address}</span>
                  </div>
                  <div className="se-footer-socials">
                    <a href="#" className="fb"><i className="fab fa-facebook-f" /></a>
                    <a href="#" className="li"><i className="fab fa-linkedin-in" /></a>
                    <a href="#" className="tw"><i className="fab fa-twitter" /></a>
                    <a href="#" className="yt"><i className="fab fa-youtube" /></a>
                  </div>
                </div>

                {/* Products col */}
                <div className="se-footer-col">
                  <h3>Our Products</h3>
                  <ul>
                    <li><a href="#"><i className="fas fa-angle-right" /> Tensiometers</a></li>
                    <li><a href="#"><i className="fas fa-angle-right" /> Drop Shape Analyzers</a></li>
                    <li><a href="#"><i className="fas fa-angle-right" /> Foam Analyzers</a></li>
                    <li><a href="#"><i className="fas fa-angle-right" /> Stability Analyzers</a></li>
                    <li><a href="#"><i className="fas fa-angle-right" /> All Products</a></li>
                  </ul>
                </div>

                {/* Company col */}
                <div className="se-footer-col">
                  <h3>Company</h3>
                  <ul>
                    <li><a href="#"><i className="fas fa-angle-right" /> About Us</a></li>
                    <li><a href="#"><i className="fas fa-angle-right" /> Solutions</a></li>
                    <li><a href="#"><i className="fas fa-angle-right" /> Contact Us</a></li>
                  </ul>
                </div>

                {/* Industries col */}
                <div className="se-footer-col">
                  <h3>Industries Served</h3>
                  <ul>
                    <li><a href="#"><i className="fas fa-angle-right" /> Pharmaceuticals</a></li>
                    <li><a href="#"><i className="fas fa-angle-right" /> Food / Beverages</a></li>
                    <li><a href="#"><i className="fas fa-angle-right" /> Petroleum</a></li>
                  </ul>
                </div>
              </div>

              {/* Bottom */}
              <div className="se-footer-bottom">
                © {new Date().getFullYear()} <strong>{data.footer.copyright}</strong>. All rights reserved.
              </div>
            </div>
          </div>

          {/* Edit Panel */}
          <div className="se-edit-panel">
            <h3><i className="fas fa-edit" /> Edit Footer Information</h3>
            <div className="se-edit-row full">
              <div className="se-edit-field">
                <label>Company Description</label>
                <textarea
                  value={data.companyDescription}
                  onChange={(e) => update('companyDescription', e.target.value)}
                />
              </div>
            </div>
            <div className="se-edit-row">
              <div className="se-edit-field">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={data.contact.phone}
                  onChange={(e) => update('contact.phone', e.target.value)}
                />
              </div>
              <div className="se-edit-field">
                <label>Email Address</label>
                <input
                  type="email"
                  value={data.contact.email}
                  onChange={(e) => update('contact.email', e.target.value)}
                />
              </div>
            </div>
            <div className="se-edit-row">
              <div className="se-edit-field">
                <label>Address</label>
                <input
                  type="text"
                  value={data.contact.address}
                  onChange={(e) => update('contact.address', e.target.value)}
                />
              </div>
              <div className="se-edit-field">
                <label>Copyright Name</label>
                <input
                  type="text"
                  value={data.footer.copyright}
                  onChange={(e) => update('footer.copyright', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`se-toast ${toast.type}`}>
          <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
          {toast.msg}
        </div>
      )}
    </div>
  );
}
