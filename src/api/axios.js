// src/api/axios.js
import axios from 'axios';

// URL de base de votre API C# (port 5067 dans vos captures)
const api = axios.create({
    baseURL: 'http://localhost:5067/api/'
});

// INTERCEPTEUR : Ajoute automatiquement le JWT
api.interceptors.request.use(config => {
    // Récupère le jeton que vous stockez après la connexion
    const token = localStorage.getItem('jwt_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;
