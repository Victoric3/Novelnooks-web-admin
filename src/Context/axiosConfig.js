import axios from 'axios';
import configData from '../config.json';

const instance = axios.create({
  baseURL: configData.dev ? 'http://localhost:8000' : configData.baseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Get initial token if it exists
const token = localStorage.getItem('authToken') || 
  document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];

if (token) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add request interceptor to ensure credentials and token are always sent
instance.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    const token = localStorage.getItem('authToken') || 
      document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized response
      localStorage.removeItem('authToken');
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict';
      delete instance.defaults.headers.common['Authorization'];
    }
    return Promise.reject(error);
  }
);

export default instance;