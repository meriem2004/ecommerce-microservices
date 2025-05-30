// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useDispatch } from 'react-redux';
import { syncAuthFromStorage } from './store/authSlice';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/products/ProductListingPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import CartPage from './pages/cart/CartPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminDashboard from './pages/admin';
import CheckoutPage from './pages/cart/CheckoutPage';
import PaymentPage from './pages/cart/PaymentPage';

const AuthSyncer = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(syncAuthFromStorage());
  }, [dispatch]);
  return null;
};

const App = () => (
  <Provider store={store}>
    <BrowserRouter>
      <AuthSyncer />
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Main Layout Routes */}
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<ProductListingPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment" element={<PaymentPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);

export default App;