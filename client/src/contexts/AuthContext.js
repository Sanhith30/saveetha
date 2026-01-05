import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

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
  const [loading, setLoading] = useState(true);

  // Set up axios interceptors
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Response interceptor for handling token expiration
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
          toast.error('Session expired. Please login again.');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      
      if (token && userType) {
        try {
          let response;
          if (userType === 'student') {
            response = await axios.get('/api/auth/profile');
            setUser({
              type: 'student',
              ...response.data.student
            });
          } else if (userType === 'admin') {
            // For admin, we'll store user data in localStorage
            const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
            setUser({
              type: 'admin',
              ...adminData
            });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials, userType = 'student') => {
    try {
      const endpoint = userType === 'admin' ? '/api/auth/admin/login' : '/api/auth/login';
      const response = await axios.post(endpoint, credentials);
      
      const { token } = response.data;
      const userData = userType === 'admin' ? response.data.admin : response.data.student;

      // Store token and user type
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      
      if (userType === 'admin') {
        localStorage.setItem('adminData', JSON.stringify(userData));
      }

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Set user state
      setUser({
        type: userType,
        ...userData
      });

      toast.success(`Welcome ${userType === 'admin' ? userData.name : 'back'}!`);
      return { success: true };

    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      
      const { token, student } = response.data;

      // Store token and user type
      localStorage.setItem('token', token);
      localStorage.setItem('userType', 'student');

      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Set user state
      setUser({
        type: 'student',
        ...student
      });

      toast.success('Registration successful! Welcome to Saveetha Portal.');
      return { success: true };

    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('adminData');

    // Clear axios default header
    delete axios.defaults.headers.common['Authorization'];

    // Clear user state
    setUser(null);

    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/auth/profile', profileData);
      
      setUser(prev => ({
        ...prev,
        ...response.data.student
      }));

      toast.success('Profile updated successfully');
      return { success: true };

    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      await axios.put('/api/auth/change-password', passwordData);
      toast.success('Password changed successfully');
      return { success: true };

    } catch (error) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};