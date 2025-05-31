// src/pages/auth/RegisterPage.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
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
  Zap,
  Check,
  X,
  Gift,
  Star
} from 'lucide-react';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import useAuth from '../../hooks/useAuth';
import { RegisterRequest } from '../../types';

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
  const { register: registerUser, loading, error } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterRequest & { confirmPassword: string }>({
    resolver: yupResolver(schema),
  });
  
  const onSubmit = async (data: RegisterRequest & { confirmPassword: string }) => {
    if (!acceptTerms) {
      setLocalError('Please accept the Terms of Service and Privacy Policy');
      return;
    }
    
    try {
      setLocalError(null);
      const { confirmPassword, ...registerData } = data;
      
      await registerUser(registerData);
      if (data.email.endsWith('@shophub.com')) {
        navigate('/admin');
      } else {
        navigate('/products');
      }
    } catch (err: any) {
      setLocalError(err.message || 'Registration failed. Please try again.');
    }
  };
  
  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');
  const emailValue = watch('email');
  const firstNameValue = watch('firstName');
  const lastNameValue = watch('lastName');
  
  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score === 0) return { score: 0, label: '', color: '' };
    if (score <= 2) return { score, label: 'Weak', color: 'text-red-600' };
    if (score <= 3) return { score, label: 'Fair', color: 'text-yellow-600' };
    if (score <= 4) return { score, label: 'Good', color: 'text-blue-600' };
    return { score, label: 'Strong', color: 'text-green-600' };
  };
  
  const passwordStrength = getPasswordStrength(passwordValue || '');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="text-3xl font-bold">
              Shop<span className="text-orange-400">Hub</span>
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Join ShopHub today
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account and start shopping with exclusive benefits
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Benefits Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Member Benefits</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full p-1">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Free shipping on all orders</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full p-1">
                    <Gift className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Exclusive member discounts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full p-1">
                    <Star className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Early access to sales</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full p-1">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Priority customer support</span>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center space-x-2 mb-2">
                <Gift className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-orange-900">Welcome Offer</span>
              </div>
              <p className="text-sm text-orange-800">
                Get 20% off your first order when you sign up today!
              </p>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Progress Bar */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
                <div className="flex items-center justify-between text-white text-sm">
                  <span>Create Account</span>
                  <span>Step 1 of 1</span>
                </div>
                <div className="mt-2 bg-white/20 rounded-full h-1">
                  <div className="bg-white h-1 rounded-full w-full transition-all duration-300"></div>
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
                          Registration Failed
                        </h3>
                        <p className="text-sm text-red-700 mt-1">
                          {localError || error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          autoComplete="given-name"
                          {...register('firstName')}
                          className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                            errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                          placeholder="First name"
                        />
                        {firstNameValue && !errors.firstName && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      {errors.firstName && (
                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.firstName.message}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          autoComplete="family-name"
                          {...register('lastName')}
                          className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                            errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                          }`}
                          placeholder="Last name"
                        />
                        {lastNameValue && !errors.lastName && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                      {errors.lastName && (
                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4" />
                          <span>{errors.lastName.message}</span>
                        </p>
                      )}
                    </div>
                  </div>

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
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
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
                        autoComplete="new-password"
                        {...register('password')}
                        className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Create a strong password"
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
                    
                    {/* Password Strength Indicator */}
                    {passwordValue && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Password strength:</span>
                          <span className={`text-xs font-medium ${passwordStrength.color}`}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full ${
                                i < passwordStrength.score
                                  ? passwordStrength.score <= 2
                                    ? 'bg-red-500'
                                    : passwordStrength.score <= 3
                                    ? 'bg-yellow-500'
                                    : passwordStrength.score <= 4
                                    ? 'bg-blue-500'
                                    : 'bg-green-500'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.password.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        {...register('confirmPassword')}
                        className={`block w-full pl-10 pr-10 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        placeholder="Confirm your password"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center">
                        {confirmPasswordValue && passwordValue && confirmPasswordValue === passwordValue && !errors.confirmPassword && (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-8" />
                        )}
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.confirmPassword.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Terms and Newsletter */}
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="accept-terms"
                          type="checkbox"
                          checked={acceptTerms}
                          onChange={(e) => setAcceptTerms(e.target.checked)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="accept-terms" className="text-gray-700">
                          I agree to the{' '}
                          <Link to="/terms" className="text-purple-600 hover:text-purple-500 font-medium">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-purple-600 hover:text-purple-500 font-medium">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="subscribe-newsletter"
                          type="checkbox"
                          checked={subscribeNewsletter}
                          onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="subscribe-newsletter" className="text-gray-700">
                          Subscribe to our newsletter for exclusive deals and updates
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Register Button */}
                  <Button
                    type="submit"
                    fullWidth
                    isLoading={loading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Create Account
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
                      <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                    </div>
                  </div>
                </div>

                {/* Social Registration Options */}
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
              </div>
            </div>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8">
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>10M+ Members</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4" />
              <span>Verified Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;