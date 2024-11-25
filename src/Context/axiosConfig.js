import axios from 'axios';
import configData from '../config.json';

const instance = axios.create({
  baseURL: configData.dev ? 'http://localhost:8000' : configData.baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Get initial token if it exists
const token = localStorage.getItem('authToken')

if (token) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add request interceptor to ensure credentials and token are always sent
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
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
    }
    return Promise.reject(error);
  }
);

export default instance;