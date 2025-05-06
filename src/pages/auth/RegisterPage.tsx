import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { RegisterRequest } from '../../types';
import axios from 'axios';

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
}).required();

const RegisterPage: React.FC = () => {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [debugResponse, setDebugResponse] = useState<any>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest & { confirmPassword: string }>({
    resolver: yupResolver(schema),
  });
  
  const onSubmit = async (data: RegisterRequest & { confirmPassword: string }) => {
    try {
      setError(null);
      // Remove confirmPassword from the data
      const { confirmPassword, ...registerData } = data;
      
      // Use direct axios call for debugging purposes
      try {
        console.log('Sending registration data:', registerData);
        const response = await axios.post('http://localhost:8086/api/auth/register', registerData);
        console.log('Registration success response:', response.data);
        setDebugResponse(response.data);
        
        // Now use the auth hook
        await registerUser(registerData);
        navigate('/');
      } catch (axiosErr: any) {
        console.error('Direct registration failed:', axiosErr.response?.data || axiosErr.message);
        setError(axiosErr.response?.data?.message || 'Registration failed. Please try again.');
        setDebugResponse(axiosErr.response?.data);
        throw axiosErr;
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };
  
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md mt-8">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
          Create an account
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {debugResponse && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-md text-sm overflow-auto max-h-40">
            <p>Debug response (will be removed in production):</p>
            <pre>{JSON.stringify(debugResponse, null, 2)}</pre>
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <FormInput
              label="First name"
              type="text"
              autoComplete="given-name"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            
            <FormInput
              label="Last name"
              type="text"
              autoComplete="family-name"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>
          
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
            autoComplete="new-password"
            {...register('password')}
            error={errors.password?.message}
          />
          
          <FormInput
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          
          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
            >
              Register
            </Button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <div className="text-sm">
            <span className="text-gray-500">Already have an account?</span>{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;