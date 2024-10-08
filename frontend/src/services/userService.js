import axios from 'axios';
import { getAuthToken } from './authService';

const API_URL = 'http://localhost:3000/api/user';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getUserPreferences = async () => {
  const response = await api.get('/preferences');
  return response.data;
};

export const updateUserPreferences = async (preferences) => {
  try {
    console.log('Sending PUT request to update preferences:', preferences);
    const response = await api.put('/preferences', preferences);
    console.log('Received response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in updateUserPreferences:', error.response?.data || error.message);
    throw error;
  }
};