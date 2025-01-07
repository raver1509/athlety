import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const RequireAuth = ({ children }) => {
    const { user, loading } = useAuth();
    
    console.log('User from RequireAuth:', user);  // Sprawdzamy, co jest w user
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (!user) {
      return <Navigate to="/login" />;
    }
  
    return children;
  };
  

export default RequireAuth;
