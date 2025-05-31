// src/pages/auth/LoginPage.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
  Users,
  Zap
} from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<LoginFormData>({
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
    }
  };
  
  const emailValue = watch('email');
  const passwordValue = watch('password');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="text-3xl font-bold">
              Shop<span className="text-orange-400">Hub</span>
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue shopping
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Benefits Bar */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-center space-x-6 text-white text-sm">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-4 w-4" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>

          <div className="px-6 py-8">
            {/* Error Message */}
            {(error || localError) && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">
                      Login Failed
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      {localError || error}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    autoComplete="email"
                    {...register('email')}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter your email"
                  />
                  {emailValue && !errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.email.message}</span>
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...register('password')}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.password.message}</span>
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link 
                  to="/forgot-password" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              
              {/* Sign In Button */}
              <Button
                type="submit"
                fullWidth
                isLoading={loading}
                className="bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold py-3 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Social Login Options */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="ml-2">Facebook</span>
              </button>
            </div>

            {/* Demo Accounts */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Accounts</h4>
              <div className="space-y-2 text-xs text-blue-800">
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-mono">user@demo.com / demo123</span>
                </div>
                <div className="flex justify-between">
                  <span>Admin:</span>
                  <span className="font-mono">admin@shophub.com / admin123</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Create one now
            </Link>
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8">
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>10M+ Users</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4" />
              <span>Trusted Platform</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;