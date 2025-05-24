// src/components/layout/MainLayout.tsx
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import { STORAGE_KEYS } from '../../config';
import * as authService from '../../services/auth';
import { updateAuthState } from '../../store/authSlice';

const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  
  // Initialize auth state and token on layout mount
  useEffect(() => {
    // Load token on component mount
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      console.log('MainLayout - Found token in localStorage, setting auth header');
      // Set auth header for all requests
      authService.loadToken();
      
      // Update Redux auth state to match localStorage
      dispatch(updateAuthState());
      
      console.log('MainLayout - Auth state synced with localStorage');
    }
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