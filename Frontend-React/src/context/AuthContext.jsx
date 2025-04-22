import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : null;
  })
  const isAuthenticated = Boolean(user);
  const login = (credentials) => {
    api.post("/auth/login", credentials)
      .then((response) => {
        localStorage.setItem('auth', JSON.stringify({
          id: response.data.id,
          name: response.data.name
        }));
        localStorage.setItem('authToken', response.data.token);
        setUser(response.data);
        navigate('/home');
        return { success: true };
      })
      .catch((error) => {
        return { success: false, error: error.response?.data?.message };
      });
  };

  const register = (userData) => {
    api.post("/auth/register", userData)
      .then((response) => {
        console.log('register success');
        navigate('/login');
      })
      .catch((error) => {
        console.log('registerr error', error.message);
      });
  };

  const logout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 