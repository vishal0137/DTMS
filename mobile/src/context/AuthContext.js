import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', email);
      console.log('API URL:', axios.defaults.baseURL);
      
      const response = await axios.post('/api/auth/login', {
        email: email,
        password: password,
      });

      console.log('Login response:', response.data);
      const { access_token, token_type } = response.data;
      
      await AsyncStorage.setItem('token', access_token);
      
      // Fetch user data after login
      console.log('Fetching user data...');
      const userResponse = await axios.get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      
      console.log('User data:', userResponse.data);
      await AsyncStorage.setItem('user', JSON.stringify(userResponse.data));
      setUser(userResponse.data);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message || 'Login failed. Please check your network connection.' 
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
