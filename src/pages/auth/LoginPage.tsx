// src/pages/auth/LoginPage.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { updateAuthState } from '../../store/authSlice';
import { setAuthToken, setUserData } from '../../services/auth';

interface LoginFormData {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
}).required();

const LoginPage: React.FC = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [localError, setLocalError] = useState<string | null>(null);
  const dispatch = useDispatch();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });
  
  const onSubmit = async (data: LoginFormData) => {
    try {
      setLocalError(null);
      const result = await login({
        email: data.email,
        password: data.password
      });
      // Save tokens and user data before navigation
      setAuthToken(result.token);
      setUserData(result.user);
      dispatch(updateAuthState());
      const from = (location.state as any)?.from?.pathname || '/';
      if (data.email.endsWith('@shophub.com')) {
        navigate('/admin');
      } else {
        navigate('/products');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setLocalError(err.message || 'Login failed');
      alert('Login failed: ' + (err.message || 'Unknown error'));
    }
  };
  
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md mt-8">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
          Sign in to your account
        </h2>
        
        {(error || localError) && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {localError || error}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label="Email address"
            type="email"
            autoComplete="email"
            {...register('email')}
            error={errors.email?.message}
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