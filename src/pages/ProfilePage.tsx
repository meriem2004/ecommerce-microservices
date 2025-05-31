// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Settings, 
  Shield, 
  Bell,
  CreditCard,
  Package,
  Heart,
  Calendar,
  Camera,
  CheckCircle,
  Award,
  Star,
  TrendingUp
} from 'lucide-react';
import { STORAGE_KEYS } from '../config';
import Button from '../components/common/Button';

// Define User interface if it's not already imported
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  address?: string;
  [key: string]: any; // For any other properties
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setLoading(false);
  }, []);

  // Redirect to login if no user found
  if (!loading && !user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const memberSince = new Date(2023, 0, 15); // Mock data
  const totalOrders = 12; // Mock data
  const totalSpent = 1245.67; // Mock data
  const loyaltyPoints = 850; // Mock data

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Profile Header with Purple Gradient */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-8 text-white relative">
                <div className="absolute top-4 right-4">
                  <button className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-purple-100 text-sm mt-1">{user?.email}</p>
                  <div className="flex items-center justify-center mt-3">
                    <Award className="h-4 w-4 mr-1" />
                    <span className="text-sm">Premium Member</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{totalOrders}</div>
                    <div className="text-sm text-gray-600">Total Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{loyaltyPoints}</div>
                    <div className="text-sm text-gray-600">Loyalty Points</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 rounded-full p-2">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Total Spent</p>
                        <p className="text-sm text-gray-600">${totalSpent.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 rounded-full p-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Member Since</p>
                        <p className="text-sm text-gray-600">{memberSince.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link 
                  to="/orders" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Package className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">View Orders</span>
                </Link>
                <Link 
                  to="/wishlist" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Heart className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">My Wishlist</span>
                </Link>
                <Link 
                  to="/addresses" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Addresses</span>
                </Link>
                <Link 
                  to="/payment-methods" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Payment Methods</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{user?.firstName}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{user?.email}</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{user?.lastName}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{user?.phoneNumber || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            {user?.address && (
              <div className="bg-white rounded-xl shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Default Address</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-900">{user.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Settings */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive updates about your orders</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      Enable
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Settings className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Privacy Settings</p>
                        <p className="text-sm text-gray-600">Manage your data and privacy</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Loyalty Program */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-purple-500 rounded-full p-2">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">ShopHub Rewards</h3>
                    <p className="text-sm text-gray-600">You have {loyaltyPoints} points available</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress to next tier</span>
                    <span className="text-sm font-medium text-purple-600">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Spend $255 more to reach Gold status</p>
                </div>
                
                <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                  View Rewards
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;