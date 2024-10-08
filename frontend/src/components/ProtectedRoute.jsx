import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { refreshToken } from '../services/authService';
import { setCredentials } from '../store/slices/authSlice';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkTokenValidity = async () => {
      if (!isAuthenticated) {
        try {
          const newToken = await refreshToken();
          dispatch(setCredentials({ token: newToken }));
        } catch (error) {
          // Token refresh failed, redirect to login
          console.error('Token refresh failed:', error);
        }
      }
    };

    checkTokenValidity();
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;