// src/stores/auth.js
import { defineStore } from 'pinia'
import api from '@/api/axios' // ⬅️ Le client API que vous venez de créer

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('jwt_token') || null,
    user: null, // Contient les données du profil et les rôles
    isLoggedIn: !!localStorage.getItem('jwt_token'),
  }),
  actions: {
    async login(email, password) {
      try {
        // 🎯 Appel à votre endpoint C# /api/Auth/login
        const response = await api.post('Auth/login', { email, password })

        const newToken = response.data.token // Le JWT de votre API

        // 1. Stocke le jeton pour l'utiliser dans les requêtes futures
        this.token = newToken
        this.isLoggedIn = true
        localStorage.setItem('jwt_token', newToken)

        // 2. Récupère le profil (avec les rôles) immédiatement après
        await this.fetchProfile()
        return true
      } catch (error) {
        // En cas d'échec de la connexion (401 Unauthorized de l'API C#)
        console.error('Échec de la connexion:', error)
        return false
      }
    },

    async fetchProfile() {
      if (!this.token) return
      try {
        // 🎯 Appel à votre endpoint C# /api/User/profile
        // L'intercepteur Axios ajoute le JWT automatiquement ici
        const response = await api.get('User/profile')
        this.user = response.data // Contient les rôles (Admin, Sensei)
      } catch (error) {
        console.error('Échec de la récupération du profil:', error)
        this.logout() // Si le jeton est invalide
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.isLoggedIn = false
      localStorage.removeItem('jwt_token')
      // Rediriger vers la page d'accueil/connexion
    },
  },
})
