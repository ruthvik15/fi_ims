import { createContext, useContext, useEffect, useState } from 'react';
import api from './api/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/me');
        setIsLoggedIn(true);
        setRole(res.data.user.role);
      } catch (err) {
        setIsLoggedIn(false);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (role) => {
    setIsLoggedIn(true);
    setRole(role);
  };

  const logout = async () => {
    await api.post('/logout');
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
