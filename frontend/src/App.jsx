import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import ProductsList from './pages/ProductsList';
import UpdateProduct from './pages/UpdateProduct';

import { useAuth } from './Auth';
import AppLayout from './AppLayout';

export default function App() {
  const { role } = useAuth();

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          
            <AppLayout />
      
      }>
        <Route path="products" element={<ProductsList />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="update" element={<UpdateProduct />} />

        {role === 'admin' && (
          <>
            <Route
              path="dashboard"
              element={
            
                  <Dashboard />
        
              }
            />
          </>
        )}

        <Route path="*" element={<ProductsList />} />
      </Route>

      {/* Fallback for unknown routes if user is not logged in */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
