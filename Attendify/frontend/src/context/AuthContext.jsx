import React, { createContext, useContext, useState } from 'react';
import { setAuthToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setAuthToken(userToken); // Set token in API service
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null); // Clear token from API service
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isTeacher = () => {
    return user?.role === 'teacher';
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isTeacher,
    setIsLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};