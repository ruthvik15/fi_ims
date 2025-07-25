import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import api from '../api/axios';
import './Auth.css';
import { useAuth } from '../Auth'; // ✅ Make sure this is correct path

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Correct: use hook inside component

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      // Step 1: Login and set cookie
      await api.post('/login', form, { withCredentials: true });

      // Step 2: Get role from /me
      const res = await api.get('/me', { withCredentials: true });
      const userRole = res.data.user.role;

      // Step 3: Set context
      login(userRole);

      // Step 4: Navigate
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await api.get('/me', { withCredentials: true });
        if (res.data.loggedIn) {
          login(res.data.user.role); // Optional: update context on reload
          navigate('/products');
        } else {
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
      }
    };
    checkLogin();
  }, [navigate, login]);

  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  if (loading) return null;

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

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
          <Link to="/register">Don't have an account? Register</Link>
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
