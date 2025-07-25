import { useEffect, useState } from 'react';
import api from '../api/axios';
import './Page.css';

export default function Dashboard() {
  const [tab, setTab] = useState('users');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  const [total, setTotal] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchData = async () => {
    try {
      if (tab === 'category') {
        const res = await api.get('/products/category-breakdown');
        setCategories(res.data);
        return;
      }

      if (tab === 'users') {
        const res = await api.get(`/users?page=${page}&limit=${limit}`);
        setUsers(res.data.users);
        setTotalUsers(res.data.total);
        return;
      }

      let endpoint = '';
      if (tab === 'recent') endpoint = '/products/recent';
      else if (tab === 'valuable') endpoint = '/products/valuable';
      else endpoint = '/products/';

      const res = await api.get(`${endpoint}?page=${page}&limit=${limit}`);
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (err) {
      alert('Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab, page]);

  const totalPages = Math.ceil((tab === 'users' ? totalUsers : total) / limit);
  const showingFrom = (page - 1) * limit + 1;
  const showingTo = Math.min(page * limit, tab === 'users' ? totalUsers : total);

  return (
    <div className="dashboard-root">
      <h2 className="dashboard-title">📊 Admin Dashboard</h2>

      <div className="dashboard-tabs">
        {[
          { key: 'users', label: 'All Users' },
          { key: 'recent', label: 'Recent Products' },
          { key: 'valuable', label: 'Most Valuable' },
          { key: 'category', label: 'Category Breakdown' }
        ].map(t => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setPage(1);
            }}
            className={`tab-button ${tab === t.key ? 'active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {tab === 'category' ? (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Quantity</th>
                <th>Product Count</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c, i) => (
                <tr key={i}>
                  <td>{c.type}</td>
                  <td>{c.total_quantity}</td>
                  <td>{c.product_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : tab === 'users' ? (
          <>
            <p className="item-count-text">
              Showing {showingFrom}–{showingTo} of {totalUsers} users
            </p>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <p className="item-count-text">
              Showing {showingFrom}–{showingTo} of {total} items
            </p>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Qty</th>
                  <th>Price</th>
                  {tab === 'valuable' && <th>Total Value</th>}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.sku}</td>
                    <td>{p.quantity}</td>
                    <td>₹{p.price}</td>
                    {tab === 'valuable' && <td>₹{p.price * p.quantity}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {(tab !== 'category') && (
          <div className="pagination-wrapper">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="nav-button"
            >
              ⬅ Prev
            </button>
            <span className="page-indicator">Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={showingTo >= (tab === 'users' ? totalUsers : total)}
              className="nav-button"
            >
              Next ➡
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
