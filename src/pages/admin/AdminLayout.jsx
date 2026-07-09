import { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import './Admin.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  if (loading) return null;

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/admin">
            <i className="fas fa-tachometer-alt" style={{marginRight:'8px'}}></i>
            Femto Dashboard
          </Link>
        </div>
        <ul className="admin-nav">
          <li>
            <Link to="/admin" className={isActive('/admin')}>
              <i className="fas fa-home"></i> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/products" className={isActive('/admin/products')}>
              <i className="fas fa-box"></i> Products
            </Link>
          </li>
          <li>
            <Link to="/admin/pages" className={isActive('/admin/pages')}>
              <i className="fas fa-file-alt"></i> Pages (Home)
            </Link>
          </li>
          <li>
            <Link to="/" target="_blank">
              <i className="fas fa-external-link-alt"></i> View Site
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="admin-topbar">
          <span>Howdy, admin</span>
          <a href="#" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Log Out</a>
        </div>
        <div className="admin-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
