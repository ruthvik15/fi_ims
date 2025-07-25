import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './Auth';
import './AppLayout.css';

export default function AppLayout() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();             
      navigate('/login');         
    } catch (err) {
      alert('Logout failed');
    }
  };

  return (
    <div className="layout-container">
      <h1 className="app-title">Inventory App</h1>
      <nav className="app-nav">
        {role === 'admin' && <Link to="/dashboard">Dashboard</Link>}
        <Link to="/products">Products</Link>
        <Link to="/add-product">Add Product</Link>
        <Link to="/update">Update</Link>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>
      <Outlet />
    </div>
  );
}
