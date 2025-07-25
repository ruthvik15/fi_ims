import { useEffect, useState } from 'react';
import api from '../api/axios';
import './Page.css';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const limit = 5;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/?page=${page}&limit=${limit}`);
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="products-container">
      <h2 className="products-title">📦 Product Inventory</h2>

      {loading ? (
        <p className="loading-msg">Loading...</p>
      ) : products.length === 0 ? (
        <p className="empty-msg">No products yet.</p>
      ) : (
        <>
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.quantity}</td>
                  <td>₹{p.price}</td>
                  <td>{p.type}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              className="nav-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Prev
            </button>
            <span className="page-number">
              Page {page} of {totalPages}
            </span>
            <button
              className="nav-btn"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
