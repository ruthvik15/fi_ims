import { useState } from 'react';
import api from '../api/axios';
import './Page.css';

export default function AddProduct() {
  const [product, setProduct] = useState({
    name: '',
    type: '',
    sku: '',
    image_url: '',
    description: '',
    quantity: 0,
    price: 0,
  });

  const handleChange = e =>
    setProduct({ ...product, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/products', {
        ...product,
        quantity: parseInt(product.quantity),
        price: parseFloat(product.price),
      });
      alert(`✅ Product added with ID: ${res.data.product_id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Add failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2 className="form-title">➕ Add New Product</h2>
      {[
        { name: 'name', label: 'Name' },
        { name: 'type', label: 'Type' },
        { name: 'sku', label: 'SKU' },
        { name: 'image_url', label: 'Image URL' },
        { name: 'description', label: 'Description' },
        { name: 'quantity', label: 'Quantity', type: 'number' },
        { name: 'price', label: 'Price (₹)', type: 'number' }
      ].map(({ name, label, type = 'text' }) => (
        <div className="form-group" key={name}>
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
            name={name}
            type={type}
            value={product[name]}
            onChange={handleChange}
            required
          />
        </div>
      ))}
      <button type="submit" className="submit-btn">Add Product</button>
    </form>
  );
}
