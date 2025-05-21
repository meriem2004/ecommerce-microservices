// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { STORAGE_KEYS } from '../config';

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
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-blue-600">
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
      </div>
      
      <div className="p-6">
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">First Name</p>
              <p className="text-gray-800">{user?.firstName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Name</p>
              <p className="text-gray-800">{user?.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-800">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-gray-800">{user?.phoneNumber || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Any other user information can be displayed here */}
        {user?.address && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Address</h2>
            <p className="text-gray-800">{user.address}</p>
          </div>
        )}

        <div className="text-sm text-gray-500 mt-4">
          <p>This information is stored locally and is read-only.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;