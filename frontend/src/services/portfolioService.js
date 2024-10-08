import axios from 'axios';
import { getAuthToken } from './authService';

const API_URL = 'http://localhost:3000/api/portfolio'; // Adjust this to match your backend URL

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('Portfolio Service - Request config:', config);
    return config;
  },
  (error) => {
    console.error('Portfolio Service - Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.data);
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
      throw new Error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
      throw new Error('Error setting up the request');
    }
  }
);

export const getInvestments = async () => {
  const response = await api.get('/');
  return response.data;
};

export const addInvestment = async (investmentData) => {
  const response = await api.post('/', investmentData);
  return response.data;
};

export const getRecentActivities = async () => {
  try {
    const response = await api.get('/activities');
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    if (error.response && error.response.status === 404) {
      // If the endpoint is not found, return an empty array instead of throwing an error
      return [];
    }
    throw error;
  }
};

export const updateInvestment = async (id, investmentData) => {
  const response = await api.put(`/${id}`, investmentData);
  return response.data;
};

export const deleteInvestment = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};