import { useEffect, useState } from 'react'; // Add useEffect
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import api from '../api/axios';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 👇 Apply dark background like login page
  useEffect(() => {
    document.body.classList.add('login-page');
    return () => document.body.classList.remove('login-page');
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/register', form);
      alert('Registered successfully');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="register-link">
          <Link to="/login">Already have an account? Login</Link>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
