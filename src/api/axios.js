import axios from 'axios';

// L'URL de base sera désormais relative au domaine actuel.
// Toutes les requêtes commenceront par /api/, qui sera intercepté par Nginx.
const baseURL = '/api/';

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
