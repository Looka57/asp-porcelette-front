import axios from 'axios';

// Détection Docker vs local
// const isDocker = window.location.hostname !== 'localhost';
const baseURL = window.location.port === '8080'
  ? 'http://localhost:5070/api/'  // Via Docker (frontend sur port 8080)
  : 'http://localhost:5070/api/'; // En local direct

const api = axios.create({
  baseURL,
});

// Intercepteur JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
