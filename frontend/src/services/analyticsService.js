import axios from 'axios';
import { getAuthToken, refreshToken } from './authService';

const API_URL = 'http://localhost:3000/api/analytics'; // Adjust this to match your backend URL

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    let token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('Response interceptor error:', error);
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const getPortfolioSummary = async () => {
  try {
    const response = await api.get('/summary');
    return response.data;
  } catch (error) {
    console.error('getPortfolioSummary Error:', error.message, error.response?.data);
    throw error;
  }
};

export const getAssetAllocation = async () => {
  try {
    console.log('Fetching asset allocation...');
    const response = await api.get('/allocation');
    console.log('Asset allocation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('getAssetAllocation Error:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

export const getPerformanceMetrics = async () => {
  try {
    const response = await api.get('/performance');
    return response.data;
  } catch (error) {
    console.error('getPerformanceMetrics Error:', error.message, error.response?.data);
    throw error;
  }
};

export const getAIRecommendations = async () => {
  try {
    console.log('Fetching AI recommendations...');
    const response = await api.get('/recommendations');
    console.log('AI Recommendations raw response:', response);
    return response.data;
  } catch (error) {
    console.error('getAIRecommendations Error:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};