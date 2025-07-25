import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../Auth';
import './Page.css';

export default function UpdateProduct() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [updatedQuantities, setUpdatedQuantities] = useState({});

  const fetchMyProducts = async () => {
    try {
      const res = await api.get('/products/mine');
      setProducts(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load your products');
    }
  };

  const handleChange = (id, qty) => {
    setUpdatedQuantities(prev => ({ ...prev, [id]: qty }));
  };

  const handleUpdate = async (id) => {
    const quantity = updatedQuantities[id];
    if (quantity === undefined || quantity === '') return alert('Enter quantity');

    try {
      await api.put(`/products/${id}/quantity`, { quantity: parseInt(quantity) });
      alert('✅ Updated');
      fetchMyProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  return (
    <div className="update-container">
      <h2 className="update-heading">🔁 Update My Products</h2>

      {products.length === 0 ? (
        <p className="update-empty">You haven't added any products yet.</p>
      ) : (
        <div className="update-table-wrapper">
          <table className="update-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Current Qty</th>
                <th>New Qty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.quantity}</td>
                  <td>
                    <input
                      type="number"
                      className="update-input"
                      value={updatedQuantities[p.id] || ''}
                      onChange={e => handleChange(p.id, e.target.value)}
                    />
                  </td>
                  <td>
                    <button className="update-button" onClick={() => handleUpdate(p.id)}>
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
