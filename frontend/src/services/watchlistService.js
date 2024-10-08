import axios from 'axios';
import { getAuthToken, refreshToken } from './authService';

const API_URL = 'http://localhost:3000/api/watchlist';

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
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const getWatchlist = async () => {
  try {
    console.log('Fetching watchlist...');
    const response = await api.get('/');
    console.log('Watchlist response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching watchlist:', error.response?.data || error.message);
    throw error;
  }
};

export const addToWatchlist = async (item) => {
  const response = await api.post('/', item);
  return response.data;
};

export const removeFromWatchlist = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

export const updateWatchlistAlert = async (id, alertData) => {
  const response = await api.put(`/${id}/alert`, alertData);
  return response.data;
};

export const getWatchlistRecommendations = async () => {
  const response = await api.get('/recommendations');
  return response.data;
};