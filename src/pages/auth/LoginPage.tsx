// src/pages/auth/LoginPage.tsx - Direct navigation approach
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import axios from 'axios';
import { STORAGE_KEYS } from '../../config';

// Define LoginRequest type if not imported
interface LoginRequest {
  username: string;
  password: string;
}

const schema = yup.object({
  username: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
}).required();

// Direct login approach without using the complex hooks and Redux
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
  });
  
  const onSubmit = async (data: LoginRequest) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('LoginPage - Directly sending login request');
      
      // Direct API call without going through complex services
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: data.username,
        password: data.password
      });
      
      console.log('Login response:', response.data);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
        
        // Also set the Authorization header for subsequent requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      // Store user data
      if (response.data.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
      }
      
      // Store refresh token if available
      if (response.data.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
      }
      
      console.log('Auth data stored in localStorage');
      console.log('Token in localStorage:', Boolean(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)));
      console.log('User in localStorage:', Boolean(localStorage.getItem(STORAGE_KEYS.USER)));
      
      // Get the return URL from location state, or default to home page
      const from = (location.state as any)?.from?.pathname || '/';
      
      // Navigate after a small delay to ensure localStorage is updated
      setTimeout(() => {
        console.log('Navigating to:', from);
        navigate(from, { replace: true });
      }, 100);
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md mt-8">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
          Sign in to your account
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label="Email address"
            type="email"
            autoComplete="email"
            {...(register('username'))} 
            error={errors.username?.message}
          />
          
          <FormInput
            label="Password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
            error={errors.password?.message}
          />
          
          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
            >
              Sign in
            </Button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>
            <div className="text-sm">
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;