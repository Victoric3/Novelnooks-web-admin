// axiosConfig.js
import axios from 'axios';
import configData from '../config.json';

const instance = axios.create({
  baseURL: configData.dev ? 'http://localhost:8000' : configData.baseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to ensure credentials are always sent
instance.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add response interceptor to handle common errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      
    }
    return Promise.reject(error);
  }
);

export default instance;