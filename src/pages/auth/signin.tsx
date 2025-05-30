import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const handleSignIn = async (email, password) => {
    // ... your sign-in logic ...
    // After successful sign-in:
    if (email.endsWith('@shophub.com')) {
      navigate('/admin');
    } else {
      navigate('/products');
    }
  };

  return (
    <div>
      {/* ... existing code ... */}
    </div>
  );
};

export default SignIn; 