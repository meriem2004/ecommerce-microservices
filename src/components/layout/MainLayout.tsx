// src/components/layout/MainLayout.tsx
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import { updateAuthState } from '../../store/authSlice';
import * as authService from '../../services/auth';

const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Initialize auth state when layout mounts
    authService.initializeAuth();
    dispatch(updateAuthState());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;