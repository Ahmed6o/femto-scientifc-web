import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, brands: 0 });

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        const categories = new Set(data.map(d => d.category)).size;
        const brands = new Set(data.map(d => d.brand)).size;
        setStats({ products: data.length, categories, brands });
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <div className="admin-card">
        <h2>Welcome to Femto Scientific Admin</h2>
        <p>Use the sidebar to navigate and edit your site's content.</p>
        <div style={{display: 'flex', gap: '20px', marginTop: '20px'}}>
          <div style={{border: '1px solid #ddd', padding: '20px', flex: 1, textAlign: 'center'}}>
            <h3 style={{fontSize: '2rem', margin: 0, color: '#2271b1'}}>{stats.products}</h3>
            <p>Products</p>
          </div>
          <div style={{border: '1px solid #ddd', padding: '20px', flex: 1, textAlign: 'center'}}>
            <h3 style={{fontSize: '2rem', margin: 0, color: '#2271b1'}}>{stats.categories}</h3>
            <p>Categories</p>
          </div>
          <div style={{border: '1px solid #ddd', padding: '20px', flex: 1, textAlign: 'center'}}>
            <h3 style={{fontSize: '2rem', margin: 0, color: '#2271b1'}}>{stats.brands}</h3>
            <p>Brands</p>
          </div>
        </div>
      </div>
    </div>
  );
}
