import React, { useState, useEffect } from 'react';
import BASE_URL from '../../config';
import './ProductsManager.css';

const EMPTY_FORM = {
  slug: '', name: '', category: '', brand: '', image: [], video_url: '',
  description: '', excerpt: '', featured: false, url: '',
  specifications: [], industry: []
};

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null); // product id or 'new'
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeSection, setActiveSection] = useState('basic');
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState({ image: false, video: false });
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // inline spec / industry
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');
  const [newIndustry, setNewIndustry] = useState('');

  /* ── Data ── */
  const loadProducts = () =>
    fetch(`${BASE_URL}/api/products`, { cache: 'no-store' })
      .then(r => r.json()).then(setProducts).catch(console.error);

  useEffect(() => { loadProducts(); }, []);

  /* ── Toast ── */
  const flash = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Edit / Cancel ── */
  const handleEdit = (p) => {
    setEditing(p.id);
    let parsedImage = [];
    if (p.image) {
      if (typeof p.image === 'string' && p.image.startsWith('[')) {
        try { parsedImage = JSON.parse(p.image); } catch(e) { parsedImage = [p.image]; }
      } else {
        parsedImage = [p.image];
      }
    }
    setFormData({
      ...EMPTY_FORM, ...p,
      image: parsedImage,
      specifications: Array.isArray(p.specifications) ? p.specifications : [],
      industry: Array.isArray(p.industry) ? p.industry : [],
    });
    setActiveSection('basic');
    setNewSpecKey(''); setNewSpecVal(''); setNewIndustry('');
  };

  const handleNew = () => {
    setEditing('new');
    setFormData(EMPTY_FORM);
    setActiveSection('basic');
    setNewSpecKey(''); setNewSpecVal(''); setNewIndustry('');
  };

  const handleCancel = () => { setEditing(null); setFormData(EMPTY_FORM); };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!confirm('Delete this product permanently?')) return;
    const res = await fetch(`${BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    });
    res.ok ? (flash('Product deleted.'), loadProducts()) : flash('Delete failed.', 'error');
    if (editing === id) handleCancel();
  };

  /* ── Upload ── */
  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const key = field === 'image' ? 'image' : 'video';
    setUploading(u => ({ ...u, [key]: true }));
    const body = new FormData();
    body.append('image', file);
    try {
      const res = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
        body
      });
      const data = await res.json();
      if (data.url) {
        if (field === 'image') {
          setFormData(p => ({ ...p, image: [...(p.image || []), data.url] }));
        } else {
          setFormData(p => ({ ...p, [field]: data.url }));
        }
      } else {
        flash('Upload failed', 'error');
      }
    } catch { flash('Upload error', 'error'); }
    setUploading(u => ({ ...u, [key]: false }));
  };

  /* ── Specs ── */
  const addSpec = () => {
    if (!newSpecKey.trim()) return;
    setFormData(p => ({ ...p, specifications: [...p.specifications, { key: newSpecKey.trim(), value: newSpecVal.trim() }] }));
    setNewSpecKey(''); setNewSpecVal('');
  };
  const removeSpec = (i) => setFormData(p => ({ ...p, specifications: p.specifications.filter((_, j) => j !== i) }));
  const updateSpec = (i, f, v) => setFormData(p => ({ ...p, specifications: p.specifications.map((s, j) => j === i ? { ...s, [f]: v } : s) }));

  /* ── Industries ── */
  const addIndustry = () => { if (!newIndustry.trim()) return; setFormData(p => ({ ...p, industry: [...p.industry, newIndustry.trim()] })); setNewIndustry(''); };
  const removeIndustry = (i) => setFormData(p => ({ ...p, industry: p.industry.filter((_, j) => j !== i) }));

  /* ── Save ── */
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const isNew = editing === 'new';
    let resError = null;
    
    const payload = {
      ...formData,
      image: Array.isArray(formData.image) && formData.image.length > 0 
             ? (formData.image.length === 1 ? formData.image[0] : JSON.stringify(formData.image)) 
             : ''
    };

    const res = await fetch(
      isNew ? `${BASE_URL}/api/products` : `${BASE_URL}/api/products/${editing}`,
      {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
        body: JSON.stringify(payload)
      }
    ).catch((err) => { resError = err.message; return null; });
    
    setSaving(false);
    
    if (!res || !res.ok) { 
      let errorMsg = resError || 'Save failed. Please try again.';
      if (res) {
        try {
          const errData = await res.json();
          errorMsg = errData.error || errorMsg;
        } catch(e) {
          errorMsg = `Server returned an invalid response (not JSON). ${e.message}`;
        }
      }
      flash(`Error: ${errorMsg}`, 'error'); 
      console.error("Save error:", errorMsg);
      return; 
    }
    flash(isNew ? '✅ Product published!' : '✅ Product updated!');
    handleCancel();
    loadProducts();
  };

  /* ── AI Import ── */
  const handleAIImport = async () => {
    if (!importUrl) { flash('Please enter a URL first', 'error'); return; }
    setIsImporting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/scrape`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ url: importUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Scraping failed');
      
      setFormData(prev => ({
        ...prev,
        ...data,
        image: data.image ? [data.image] : [],
        industry: data.industry || [],
        specifications: data.specifications || []
      }));
      flash('✅ AI successfully imported the product!');
      setImportUrl('');
    } catch (err) {
      flash(err.message, 'error');
    }
    setIsImporting(false);
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: 'fa-info-circle' },
    { id: 'media', label: 'Media', icon: 'fa-images' },
    { id: 'content', label: 'Description', icon: 'fa-align-left' },
    { id: 'specs', label: 'Specifications', icon: 'fa-sliders-h' },
    { id: 'apps', label: 'Applications', icon: 'fa-industry' },
  ];

  /* ── Render ── */
  return (
    <div className="pm-root">

      {/* ── Toast ── */}
      {toast && (
        <div className={`pm-toast pm-toast--${toast.type}`}>
          <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
          {toast.text}
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="pm-header">
        <div className="pm-header-left">
          <h1 className="pm-title">
            <i className="fas fa-box-open" />
            Products
          </h1>
          <span className="pm-count">{products.length} products</span>
        </div>
        <button className="pm-btn-new" onClick={handleNew}>
          <i className="fas fa-plus" /> New Product
        </button>
      </div>

      {/* ── Split Layout ── */}
      <div className={`pm-split ${editing ? 'pm-split--open' : ''}`}>

        {/* ─── LEFT: Products List ─── */}
        <div className="pm-list-panel">
          {/* Search */}
          <div className="pm-search-wrap">
            <i className="fas fa-search pm-search-icon" />
            <input
              className="pm-search-input"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* List */}
          <div className="pm-product-list">
            {filtered.length === 0 && (
              <div className="pm-list-empty">
                <i className="fas fa-box-open" />
                <p>No products found</p>
              </div>
            )}
            {filtered.map(p => (
              <div
                key={p.id}
                className={`pm-product-card ${editing === p.id ? 'pm-product-card--active' : ''}`}
                onClick={() => handleEdit(p)}
              >
                <div className="pm-product-thumb">
                  {(() => {
                    if (!p.image) return <i className="fas fa-cube" />;
                    if (typeof p.image === 'string' && p.image.startsWith('[')) {
                      try {
                        const arr = JSON.parse(p.image);
                        return <img src={arr[0]} alt={p.name} />;
                      } catch(e) {
                        return <img src={p.image} alt={p.name} />;
                      }
                    }
                    return <img src={p.image} alt={p.name} />;
                  })()}
                </div>
                <div className="pm-product-meta">
                  <span className="pm-product-name">{p.name}</span>
                  <span className="pm-product-cat">{p.category} · {p.brand}</span>
                  <div className="pm-product-badges">
                    {p.featured && <span className="pm-badge pm-badge--star">⭐ Featured</span>}
                    {(p.specifications || []).length > 0 && (
                      <span className="pm-badge">{(p.specifications || []).length} specs</span>
                    )}
                  </div>
                </div>
                <button
                  className="pm-delete-btn"
                  title="Delete"
                  onClick={ev => { ev.stopPropagation(); handleDelete(p.id); }}
                >
                  <i className="fas fa-trash" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ─── RIGHT: Editor ─── */}
        {editing && (
          <div className="pm-editor-panel">
            {/* Editor Header */}
            <div className="pm-editor-header">
              <div>
                <h2 className="pm-editor-title">
                  {editing === 'new' ? 'New Product' : formData.name || 'Edit Product'}
                </h2>
                <span className="pm-editor-sub">
                  {editing === 'new' ? 'Fill in the details below' : `Editing · ${formData.slug}`}
                </span>
              </div>
              <button className="pm-close-btn" onClick={handleCancel} title="Close editor">
                <i className="fas fa-times" />
              </button>
            </div>

            {/* Section Tabs */}
            <div className="pm-section-tabs">
              {sections.map(s => (
                <button
                  key={s.id}
                  className={`pm-section-tab ${activeSection === s.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(s.id)}
                  type="button"
                >
                  <i className={`fas ${s.icon}`} />
                  <span>{s.label}</span>
                  {s.id === 'specs' && formData.specifications.length > 0 && (
                    <span className="pm-tab-count">{formData.specifications.length}</span>
                  )}
                  {s.id === 'apps' && formData.industry.length > 0 && (
                    <span className="pm-tab-count">{formData.industry.length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="pm-editor-form">

              {/* ─── Basic Info ─── */}
              {activeSection === 'basic' && (
                <div className="pm-fields-wrap">
                  {/* AI Import Box */}
                  <div className="pm-ai-import-box">
                    <div className="pm-ai-import-header">
                      <i className="fas fa-magic" style={{ color: '#8b5cf6' }}></i>
                      <span>Auto-fill with AI</span>
                    </div>
                    <div className="pm-ai-import-body">
                      <input 
                        type="url" 
                        className="pm-input" 
                        placeholder="Paste product URL (e.g. from Kruss website)"
                        value={importUrl}
                        onChange={e => setImportUrl(e.target.value)}
                        disabled={isImporting}
                      />
                      <button 
                        type="button" 
                        className="pm-btn-ai" 
                        onClick={handleAIImport}
                        disabled={isImporting || !importUrl}
                      >
                        {isImporting ? <><i className="fas fa-spinner fa-spin"></i> Extracting...</> : 'Import Data'}
                      </button>
                    </div>
                  </div>

                  <div className="pm-field-group pm-field-group--2">
                    <div className="pm-field">
                      <label className="pm-label">Product Name <span className="pm-required">*</span></label>
                      <input type="text" className="pm-input" required
                        placeholder="e.g. Tensíio Force Tensiometer"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="pm-field">
                      <label className="pm-label">Slug <span className="pm-required">*</span></label>
                      <div className="pm-input-addon">
                        <span className="pm-addon">/products/</span>
                        <input type="text" className="pm-input pm-input--addon" required
                          placeholder="product-slug"
                          value={formData.slug}
                          onChange={e => setFormData({ ...formData, slug: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <div className="pm-field-group pm-field-group--2">
                    <div className="pm-field">
                      <label className="pm-label">Category <span className="pm-required">*</span></label>
                      <input type="text" className="pm-input" required
                        placeholder="e.g. surface-science"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })} />
                    </div>
                    <div className="pm-field">
                      <label className="pm-label">Brand <span className="pm-required">*</span></label>
                      <input type="text" className="pm-input" required
                        placeholder="e.g. KRÜSS"
                        value={formData.brand}
                        onChange={e => setFormData({ ...formData, brand: e.target.value })} />
                    </div>
                  </div>

                  <div className="pm-field">
                    <label className="pm-label">Manufacturer URL</label>
                    <input type="url" className="pm-input"
                      placeholder="https://manufacturer.com/product"
                      value={formData.url}
                      onChange={e => setFormData({ ...formData, url: e.target.value })} />
                  </div>

                  <div className="pm-toggle-field">
                    <button
                      type="button"
                      className={`pm-toggle ${formData.featured ? 'pm-toggle--on' : ''}`}
                      onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                    >
                      <span className="pm-toggle-knob" />
                    </button>
                    <div>
                      <span className="pm-toggle-label">Featured Product</span>
                      <span className="pm-toggle-desc">Show this product on the homepage hero section</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Media ─── */}
              {activeSection === 'media' && (
                <div className="pm-fields-wrap">
                  {/* Image Gallery */}
                  <div className="pm-field">
                    <label className="pm-label">Product Images</label>
                    <div className="pm-gallery">
                      {(formData.image || []).map((img, idx) => (
                        <div key={idx} className="pm-gallery-item">
                           <img src={img} alt={`preview ${idx}`} />
                           <button type="button" className="pm-gallery-remove" onClick={() => {
                               setFormData(p => ({...p, image: p.image.filter((_, i) => i !== idx)}));
                           }}>
                             <i className="fas fa-times" />
                           </button>
                        </div>
                      ))}
                      
                      <label className="pm-gallery-upload" htmlFor="upload-image">
                        <i className="fas fa-plus" />
                        <span>Add Image</span>
                      </label>
                      <input id="upload-image" type="file" accept="image/*" hidden
                        onChange={e => handleUpload(e, 'image')} />
                    </div>

                    {/* Or paste URL */}
                    <div className="pm-field" style={{ marginTop: 12 }}>
                      <label className="pm-label" style={{ fontSize: 12, color: '#999' }}>Or paste image URL (Press Enter to add)</label>
                      <input type="text" className="pm-input pm-input--sm"
                        placeholder="https://..."
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                             e.preventDefault();
                             const val = e.target.value.trim();
                             if (val) {
                                setFormData(p => ({...p, image: [...(p.image || []), val]}));
                                e.target.value = '';
                             }
                          }
                        }} />
                    </div>
                  </div>

                  {/* Video */}
                  <div className="pm-field" style={{ marginTop: 24 }}>
                    <label className="pm-label">Product Video <span className="pm-optional">optional</span></label>
                    <div className="pm-field" style={{ marginBottom: 12 }}>
                      <input type="text" className="pm-input pm-input--sm"
                        placeholder="Paste YouTube or Video URL (e.g. https://youtube.com/watch?v=...)"
                        value={formData.video_url || ''}
                        onChange={e => setFormData({ ...formData, video_url: e.target.value })} />
                    </div>
                    <div className="pm-upload-zone pm-upload-zone--video">
                      {formData.video_url ? (
                        <div className="pm-upload-preview pm-upload-preview--video">
                          {formData.video_url.includes('youtube.com') || formData.video_url.includes('youtu.be') ? (
                            <iframe 
                              src={`https://www.youtube.com/embed/${formData.video_url.split('v=')[1]?.split('&')[0] || formData.video_url.split('/').pop()}`}
                              frameBorder="0" allowFullScreen
                              style={{ width: '100%', height: 200, borderRadius: 8 }}></iframe>
                          ) : (
                            <video src={formData.video_url} controls style={{ width: '100%', borderRadius: 8 }} />
                          )}
                          <button type="button" className="pm-upload-remove"
                            onClick={() => setFormData({ ...formData, video_url: '' })}>
                            <i className="fas fa-times" /> Remove video
                          </button>
                        </div>
                      ) : (
                        <label className="pm-upload-trigger" htmlFor="upload-video">
                          <i className="fas fa-film" />
                          <span>{uploading.video ? 'Uploading…' : 'Or upload a product video'}</span>
                          <small>MP4, WEBM up to 50MB</small>
                        </label>
                      )}
                      <input id="upload-video" type="file" accept="video/*" hidden
                        onChange={e => handleUpload(e, 'video_url')} />
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Description ─── */}
              {activeSection === 'content' && (
                <div className="pm-fields-wrap">
                  <div className="pm-field">
                    <label className="pm-label">
                      Short Tagline
                      <span className="pm-label-hint">Shown in the hero section under the product title</span>
                    </label>
                    <input type="text" className="pm-input"
                      placeholder="One-liner that captures the product value…"
                      value={formData.excerpt}
                      onChange={e => setFormData({ ...formData, excerpt: e.target.value })} />
                  </div>
                  <div className="pm-field" style={{ marginTop: 20 }}>
                    <label className="pm-label">
                      Full Description
                      <span className="pm-label-hint">Displayed in the PRODUCT tab on the product detail page</span>
                    </label>
                    <textarea className="pm-textarea"
                      rows={10}
                      placeholder="Describe the product in detail — features, technology, use cases, advantages…"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                    <div className="pm-char-count">{formData.description.length} characters</div>
                  </div>
                </div>
              )}

              {/* ─── Specifications ─── */}
              {activeSection === 'specs' && (
                <div className="pm-fields-wrap">
                  <p className="pm-section-hint">
                    <i className="fas fa-info-circle" />
                    These rows appear in the <strong>SPECIFICATIONS</strong> tab on the product page.
                  </p>

                  {formData.specifications.length > 0 ? (
                    <div className="pm-specs-list">
                      {formData.specifications.map((spec, i) => (
                        <div key={i} className="pm-spec-row">
                          <span className="pm-spec-num">{i + 1}</span>
                          <input
                            className="pm-input pm-spec-input"
                            placeholder="Specification name"
                            value={spec.key}
                            onChange={e => updateSpec(i, 'key', e.target.value)}
                          />
                          <span className="pm-spec-sep">→</span>
                          <input
                            className="pm-input pm-spec-input"
                            placeholder="Value"
                            value={spec.value}
                            onChange={e => updateSpec(i, 'value', e.target.value)}
                          />
                          <button type="button" className="pm-spec-del" onClick={() => removeSpec(i)}>
                            <i className="fas fa-trash-alt" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="pm-empty-state">
                      <i className="fas fa-sliders-h" />
                      <p>No specifications yet</p>
                    </div>
                  )}

                  {/* Add row */}
                  <div className="pm-add-spec-row">
                    <input
                      className="pm-input"
                      placeholder="Specification name (e.g. Measurement range)"
                      value={newSpecKey}
                      onChange={e => setNewSpecKey(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSpec())}
                    />
                    <input
                      className="pm-input"
                      placeholder="Value (e.g. 0–100 mN/m)"
                      value={newSpecVal}
                      onChange={e => setNewSpecVal(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSpec())}
                    />
                    <button type="button" className="pm-add-btn" onClick={addSpec}>
                      <i className="fas fa-plus" /> Add Row
                    </button>
                  </div>
                </div>
              )}

              {/* ─── Applications ─── */}
              {activeSection === 'apps' && (
                <div className="pm-fields-wrap">
                  <p className="pm-section-hint">
                    <i className="fas fa-info-circle" />
                    Tags shown in the hero section and as feature cards in the <strong>PRODUCT</strong> tab.
                  </p>

                  <div className="pm-tags-wrap">
                    {formData.industry.map((tag, i) => (
                      <span key={i} className="pm-tag">
                        {tag}
                        <button type="button" onClick={() => removeIndustry(i)}>
                          <i className="fas fa-times" />
                        </button>
                      </span>
                    ))}
                    {formData.industry.length === 0 && (
                      <span className="pm-tag-empty">No tags added yet</span>
                    )}
                  </div>

                  <div className="pm-add-tag-row">
                    <input
                      className="pm-input"
                      placeholder="e.g. Pharmaceutical, Food & Beverage, Cosmetics…"
                      value={newIndustry}
                      onChange={e => setNewIndustry(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addIndustry())}
                    />
                    <button type="button" className="pm-add-btn" onClick={addIndustry}>
                      <i className="fas fa-plus" /> Add Tag
                    </button>
                  </div>
                </div>
              )}

              {/* ─── Footer Actions ─── */}
              <div className="pm-editor-footer">
                <div className="pm-footer-left">
                  {editing !== 'new' && (
                    <button type="button" className="pm-btn-danger"
                      onClick={() => handleDelete(editing)}>
                      <i className="fas fa-trash" /> Delete
                    </button>
                  )}
                </div>
                <div className="pm-footer-right">
                  <button type="button" className="pm-btn-ghost" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="pm-btn-save" disabled={saving}>
                    {saving
                      ? <><i className="fas fa-spinner fa-spin" /> Saving…</>
                      : <><i className="fas fa-save" /> {editing === 'new' ? 'Publish' : 'Save Changes'}</>
                    }
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
}
