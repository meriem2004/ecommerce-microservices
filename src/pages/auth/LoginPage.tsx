import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { LoginRequest } from '../../types';

const schema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
}).required();

const LoginPage: React.FC = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
  });
  
  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data);
      
      // Get the return URL from location state, or default to home page
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by the hook
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