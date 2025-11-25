import axios from 'axios';

// Détection Docker vs local
const isDocker = window.location.hostname !== 'localhost';
const baseURL = isDocker
  ? 'http://backend:8080/api/'   // FRONTEND -> BACKEND (réseau Docker)
  : 'http://localhost:5067/api/'; // PC local (BDD pleine)


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
