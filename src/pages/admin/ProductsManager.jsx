import React, { useState, useEffect } from 'react';
import BASE_URL from '../../config';

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    slug: '', name: '', category: '', brand: '', image: '', video_url: '', description: '', excerpt: '', featured: false, url: ''
  });

  const loadProducts = () => {
    fetch(`${BASE_URL}/api/products`)
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleEdit = (p) => {
    setEditing(p.id);
    setFormData(p);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`${BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` }
    });
    loadProducts();
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file); // using same endpoint for all files
    
    try {
      const res = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token')}` },
        body: data
      });
      const resData = await res.json();
      if (resData.url) {
        setFormData(prev => ({ ...prev, [field]: resData.url }));
      }
    } catch(err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = editing ? `${BASE_URL}/api/products/${editing}` : `${BASE_URL}/api/products`;
    const method = editing ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      },
      body: JSON.stringify(formData)
    });
    
    setEditing(null);
    setFormData({ slug: '', name: '', category: '', brand: '', image: '', video_url: '', description: '', excerpt: '', featured: false, url: '' });
    loadProducts();
  };

  return (
    <div>
      <h1 className="admin-page-title">Products</h1>
      <div style={{display: 'flex', gap: '20px'}}>
        
        {/* Table */}
        <div className="admin-card" style={{flex: 2}}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Media</th>
                <th>Name</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    {p.image && <img src={p.image} alt={p.name} style={{width: '50px', height: '50px', objectFit:'contain'}} />}
                    {p.video_url && <i className="fas fa-video" style={{marginLeft: '5px', color: '#666'}}></i>}
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.brand}</td>
                  <td>
                    <button className="admin-btn secondary" onClick={() => handleEdit(p)} style={{marginRight: '5px'}}>Edit</button>
                    <button className="admin-btn danger" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Editor */}
        <div className="admin-card" style={{flex: 1}}>
          <h2>{editing ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSave}>
            <div className="admin-form-group">
              <label>Name</label>
              <input type="text" className="admin-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label>Slug</label>
              <input type="text" className="admin-input" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label>Category</label>
              <input type="text" className="admin-input" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label>Brand</label>
              <input type="text" className="admin-input" required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
            </div>
            
            <div className="admin-form-group">
              <label>Image Upload</label>
              <input type="file" accept="image/*" className="admin-input" onChange={e => handleFileUpload(e, 'image')} />
              {formData.image && <img src={formData.image} alt="preview" style={{width:'100px', marginTop:'10px'}}/>}
            </div>

            <div className="admin-form-group">
              <label>Video Upload (Optional)</label>
              <input type="file" accept="video/*" className="admin-input" onChange={e => handleFileUpload(e, 'video_url')} />
              {formData.video_url && <div style={{marginTop:'10px', fontSize:'12px', color:'green'}}><i className="fas fa-check-circle"></i> Video Selected</div>}
            </div>

            <div className="admin-form-group">
              <label>Excerpt</label>
              <textarea className="admin-input" value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} />
            </div>
            <div className="admin-form-group">
              <label>
                <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} /> Featured
              </label>
            </div>
            <div style={{display:'flex', gap:'10px'}}>
              <button type="submit" className="admin-btn primary">{editing ? 'Update' : 'Publish'}</button>
              {editing && <button type="button" className="admin-btn secondary" onClick={() => {setEditing(null); setFormData({slug: '', name: '', category: '', brand: '', image: '', video_url: '', description: '', excerpt: '', featured: false, url: ''});}}>Cancel</button>}
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
