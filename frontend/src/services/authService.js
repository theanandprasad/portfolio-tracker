import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const API_URL = 'http://localhost:3000/api/auth'; // Adjust this to match your backend URL

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.accessToken && response.data.refreshToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      showSuccessToast('Logged in successfully');
    }
    return { user: response.data.user, token: response.data.accessToken };
  } catch (error) {
    showErrorToast(error.response?.data?.message || 'Login failed');
    throw error;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { username, email, password });
    if (response.data.accessToken && response.data.refreshToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      showSuccessToast('Registered successfully');
    }
    return { user: response.data.user, token: response.data.accessToken };
  } catch (error) {
    showErrorToast(error.response?.data?.message || 'Registration failed');
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  showSuccessToast('Logged out successfully');
};

export const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await axios.post(`${API_URL}/refresh-token`, { refreshToken });
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      return response.data.accessToken;
    }
  } catch (error) {
    console.error('Failed to refresh token:', error);
    logout();
    throw error;
  }
};