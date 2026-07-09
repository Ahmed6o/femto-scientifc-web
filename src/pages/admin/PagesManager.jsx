import React, { useState, useEffect } from 'react';
import BASE_URL from '../../config';

export default function PagesManager() {
  const [settings, setSettings] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');

  const loadSettings = () => {
    fetch(`${BASE_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        // Ensure default structures if empty
        setSettings({
          ...data,
          page_home: data.page_home || { featuresStrip: [], about: { features: [] }, cta: {} },
          page_about: data.page_about || { hero: {}, whoWeAre: {}, stats: [], values: [], services: [] },
          page_contact: data.page_contact || { cards: [] },
          page_app: data.page_app || {},
          page_sol: data.page_sol || {}
        });
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await fetch(`${BASE_URL}/api/settings`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      },
      body: JSON.stringify(settings)
    });
    alert('Settings Saved Successfully! Changes are live on the website.');
  };

  const handleImageUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    try {
      const res = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
        body: data
      });
      const resData = await res.json();
      if (resData.url) callback(resData.url);
    } catch(err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  if (!settings) return <div>Loading...</div>;

  // Helpers for deep state updates
  const updateField = (path, value) => {
    const newSettings = { ...settings };
    let current = newSettings;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setSettings(newSettings);
  };

  const addArrayItem = (path, emptyItem) => {
    const newSettings = { ...settings };
    let current = newSettings;
    for (let i = 0; i < path.length; i++) {
      if (!current[path[i]]) current[path[i]] = [];
      current = current[path[i]];
    }
    current.push(emptyItem);
    setSettings(newSettings);
  };

  const removeArrayItem = (path, index) => {
    const newSettings = { ...settings };
    let current = newSettings;
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]];
    }
    current.splice(index, 1);
    setSettings(newSettings);
  };

  const updateArrayItem = (path, index, field, value) => {
    const newSettings = { ...settings };
    let current = newSettings;
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]];
    }
    current[index][field] = value;
    setSettings(newSettings);
  };

  return (
    <div>
      <h1 className="admin-page-title">Pages Manager</h1>
      
      <div className="admin-tabs" style={{display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap'}}>
        {['Home', 'About', 'Contact', 'Application', 'Solutions'].map(tab => (
          <button 
            key={tab}
            type="button"
            className={`admin-btn ${activeTab === tab ? 'primary' : 'secondary'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab} Page
          </button>
        ))}
      </div>

      <div className="admin-card">
        <form onSubmit={handleSave}>
          
          {activeTab === 'Home' && (
            <>
              <h2>Home Page Configuration</h2>
              
              <div className="admin-section-block">
                <h3>Global Stats (Numbers)</h3>
                {settings.stats?.map((stat, idx) => (
                  <div key={idx} style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
                    <input className="admin-input" placeholder="Label" value={stat.label || ''} onChange={e => updateArrayItem(['stats'], idx, 'label', e.target.value)} />
                    <input className="admin-input" type="number" placeholder="Value" value={stat.value || 0} onChange={e => updateArrayItem(['stats'], idx, 'value', parseInt(e.target.value))} />
                    <input className="admin-input" placeholder="Icon (e.g. fa-star)" value={stat.icon || ''} onChange={e => updateArrayItem(['stats'], idx, 'icon', e.target.value)} />
                    <button type="button" className="admin-btn danger" onClick={() => removeArrayItem(['stats'], idx)}>X</button>
                  </div>
                ))}
                <button type="button" className="admin-btn secondary" onClick={() => addArrayItem(['stats'], {label: 'New Stat', value: 0, icon: 'fa-star'})}>+ Add Stat</button>
              </div>

              <div className="admin-section-block">
                <h3>Hero Slides</h3>
                {settings.heroSlides?.map((slide, idx) => (
                  <div key={idx} style={{border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '5px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                      <strong>Slide {idx + 1}</strong>
                      <button type="button" className="admin-btn danger" onClick={() => removeArrayItem(['heroSlides'], idx)}>Remove Slide</button>
                    </div>
                    <div className="admin-form-group">
                      <label>Title</label>
                      <input className="admin-input" value={slide.title || ''} onChange={e => updateArrayItem(['heroSlides'], idx, 'title', e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                      <label>Subtitle</label>
                      <input className="admin-input" value={slide.subtitle || ''} onChange={e => updateArrayItem(['heroSlides'], idx, 'subtitle', e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                      <label>Description</label>
                      <textarea className="admin-input" value={slide.description || ''} onChange={e => updateArrayItem(['heroSlides'], idx, 'description', e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                      <label>Background Image</label>
                      <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                        <input type="file" accept="image/*" onChange={e => handleImageUpload(e, url => updateArrayItem(['heroSlides'], idx, 'image', url))} />
                        {slide.image && <img src={slide.image} style={{height:'40px'}} alt="preview"/>}
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="admin-btn secondary" onClick={() => addArrayItem(['heroSlides'], {title: 'New Slide', subtitle: '', description: '', image: '', primaryBtn: {text: 'Explore', link: '/products'}})}>+ Add Slide</button>
              </div>

              <div className="admin-section-block">
                <h3>Features Strip</h3>
                {settings.page_home?.featuresStrip?.map((feat, idx) => (
                  <div key={idx} style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
                    <input className="admin-input" placeholder="Icon" value={feat.icon || ''} onChange={e => updateArrayItem(['page_home', 'featuresStrip'], idx, 'icon', e.target.value)} />
                    <input className="admin-input" placeholder="Title" value={feat.title || ''} onChange={e => updateArrayItem(['page_home', 'featuresStrip'], idx, 'title', e.target.value)} />
                    <input className="admin-input" placeholder="Description" value={feat.desc || ''} onChange={e => updateArrayItem(['page_home', 'featuresStrip'], idx, 'desc', e.target.value)} />
                    <button type="button" className="admin-btn danger" onClick={() => removeArrayItem(['page_home', 'featuresStrip'], idx)}>X</button>
                  </div>
                ))}
                <button type="button" className="admin-btn secondary" onClick={() => addArrayItem(['page_home', 'featuresStrip'], {icon: 'fa-star', title: 'New Feature', desc: 'Description'})}>+ Add Feature</button>
              </div>

            </>
          )}

          {activeTab === 'About' && (
            <>
              <h2>About Page Configuration</h2>
              
              <div className="admin-section-block">
                <h3>Who We Are Section</h3>
                <div className="admin-form-group">
                  <label>Subtitle</label>
                  <input className="admin-input" value={settings.page_about?.whoWeAre?.subtitle || ''} onChange={e => updateField(['page_about', 'whoWeAre', 'subtitle'], e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label>Title</label>
                  <input className="admin-input" value={settings.page_about?.whoWeAre?.title || ''} onChange={e => updateField(['page_about', 'whoWeAre', 'title'], e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label>Paragraph 1</label>
                  <textarea className="admin-input" value={settings.page_about?.whoWeAre?.p1 || ''} onChange={e => updateField(['page_about', 'whoWeAre', 'p1'], e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label>Paragraph 2</label>
                  <textarea className="admin-input" value={settings.page_about?.whoWeAre?.p2 || ''} onChange={e => updateField(['page_about', 'whoWeAre', 'p2'], e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label>Paragraph 3</label>
                  <textarea className="admin-input" value={settings.page_about?.whoWeAre?.p3 || ''} onChange={e => updateField(['page_about', 'whoWeAre', 'p3'], e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label>Mission Statement</label>
                  <textarea className="admin-input" value={settings.page_about?.whoWeAre?.mission || ''} onChange={e => updateField(['page_about', 'whoWeAre', 'mission'], e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label>Vision Statement</label>
                  <textarea className="admin-input" value={settings.page_about?.whoWeAre?.vision || ''} onChange={e => updateField(['page_about', 'whoWeAre', 'vision'], e.target.value)} />
                </div>
              </div>

              <div className="admin-section-block">
                <h3>Core Values</h3>
                {settings.page_about?.values?.map((val, idx) => (
                  <div key={idx} style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
                    <input className="admin-input" placeholder="Icon" value={val.icon || ''} onChange={e => updateArrayItem(['page_about', 'values'], idx, 'icon', e.target.value)} />
                    <input className="admin-input" placeholder="Title" value={val.title || ''} onChange={e => updateArrayItem(['page_about', 'values'], idx, 'title', e.target.value)} />
                    <input className="admin-input" placeholder="Description" style={{flex:2}} value={val.desc || ''} onChange={e => updateArrayItem(['page_about', 'values'], idx, 'desc', e.target.value)} />
                    <button type="button" className="admin-btn danger" onClick={() => removeArrayItem(['page_about', 'values'], idx)}>X</button>
                  </div>
                ))}
                <button type="button" className="admin-btn secondary" onClick={() => addArrayItem(['page_about', 'values'], {icon: 'fa-star', title: 'New Value', desc: 'Description'})}>+ Add Value</button>
              </div>

              <div className="admin-section-block">
                <h3>Services / What We Do</h3>
                {settings.page_about?.services?.map((val, idx) => (
                  <div key={idx} style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
                    <input className="admin-input" placeholder="Icon" value={val.icon || ''} onChange={e => updateArrayItem(['page_about', 'services'], idx, 'icon', e.target.value)} />
                    <input className="admin-input" placeholder="Title" value={val.title || ''} onChange={e => updateArrayItem(['page_about', 'services'], idx, 'title', e.target.value)} />
                    <input className="admin-input" placeholder="Description" style={{flex:2}} value={val.desc || ''} onChange={e => updateArrayItem(['page_about', 'services'], idx, 'desc', e.target.value)} />
                    <button type="button" className="admin-btn danger" onClick={() => removeArrayItem(['page_about', 'services'], idx)}>X</button>
                  </div>
                ))}
                <button type="button" className="admin-btn secondary" onClick={() => addArrayItem(['page_about', 'services'], {icon: 'fa-star', title: 'New Service', desc: 'Description'})}>+ Add Service</button>
              </div>
            </>
          )}

          {activeTab === 'Contact' && (
            <>
              <h2>Contact Page Configuration</h2>
              <div className="admin-section-block">
                <h3>Page Headers</h3>
                <div className="admin-form-group">
                  <label>Subtitle</label>
                  <input className="admin-input" value={settings.page_contact?.subtitle || ''} onChange={e => updateField(['page_contact', 'subtitle'], e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label>Title</label>
                  <input className="admin-input" value={settings.page_contact?.title || ''} onChange={e => updateField(['page_contact', 'title'], e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea className="admin-input" value={settings.page_contact?.desc || ''} onChange={e => updateField(['page_contact', 'desc'], e.target.value)} />
                </div>
              </div>

              <div className="admin-section-block">
                <h3>Contact Info Cards</h3>
                {settings.page_contact?.cards?.map((card, idx) => (
                  <div key={idx} style={{border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '5px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                      <strong>Card {idx + 1}</strong>
                      <button type="button" className="admin-btn danger" onClick={() => removeArrayItem(['page_contact', 'cards'], idx)}>Remove Card</button>
                    </div>
                    <div className="admin-form-group">
                      <label>Icon Class (e.g. fa-phone-alt)</label>
                      <input className="admin-input" value={card.icon || ''} onChange={e => updateArrayItem(['page_contact', 'cards'], idx, 'icon', e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                      <label>Title</label>
                      <input className="admin-input" value={card.title || ''} onChange={e => updateArrayItem(['page_contact', 'cards'], idx, 'title', e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                      <label>Main Content</label>
                      <input className="admin-input" value={card.content || ''} onChange={e => updateArrayItem(['page_contact', 'cards'], idx, 'content', e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                      <label>Sub Text</label>
                      <input className="admin-input" value={card.sub || ''} onChange={e => updateArrayItem(['page_contact', 'cards'], idx, 'sub', e.target.value)} />
                    </div>
                  </div>
                ))}
                <button type="button" className="admin-btn secondary" onClick={() => addArrayItem(['page_contact', 'cards'], {icon: 'fa-star', title: 'New Card', content: 'Details', sub: 'Subdetails'})}>+ Add Contact Card</button>
              </div>
            </>
          )}

          {activeTab === 'Application' && (
            <>
              <h2>Application Page Configuration</h2>
              <div className="admin-section-block">
                <div className="admin-form-group">
                  <label>Title</label>
                  <input className="admin-input" value={settings.page_app?.title || ''} onChange={e => updateField(['page_app', 'title'], e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea className="admin-input" value={settings.page_app?.desc || ''} onChange={e => updateField(['page_app', 'desc'], e.target.value)} />
                </div>
              </div>
            </>
          )}

          {activeTab === 'Solutions' && (
            <>
              <h2>Solutions Page Configuration</h2>
              <div className="admin-section-block">
                <div className="admin-form-group">
                  <label>Title</label>
                  <input className="admin-input" value={settings.page_sol?.title || ''} onChange={e => updateField(['page_sol', 'title'], e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea className="admin-input" value={settings.page_sol?.desc || ''} onChange={e => updateField(['page_sol', 'desc'], e.target.value)} />
                </div>
              </div>
            </>
          )}

          <div style={{marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '20px'}}>
            <button type="submit" className="admin-btn primary" style={{fontSize: '16px', padding: '10px 20px', height: 'auto'}}>
              <i className="fas fa-save" style={{marginRight: '8px'}}></i> Save Changes
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .admin-section-block {
          background: #f9f9f9;
          border: 1px solid #e0e0e0;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .admin-section-block h3 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #333;
          font-size: 1.2rem;
          border-bottom: 2px solid #0056b3;
          display: inline-block;
          padding-bottom: 5px;
        }
      `}</style>
    </div>
  );
}
