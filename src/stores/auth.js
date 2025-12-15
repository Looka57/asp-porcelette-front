// src/stores/auth.js
import { defineStore } from 'pinia'
import api from '@/api/axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('jwt_token') || null,
    user: null, // Contient les données du profil et les rôles
  }),

  getters: {
    // ✅ Getter pour vérifier si l'utilisateur est vraiment connecté
    isLoggedIn: (state) => !!state.token && !!state.user,

    // ✅ Getter pour récupérer les rôles facilement
    userRoles: (state) => state.user?.roles || [],

    // ✅ Vérifier si l'utilisateur a un rôle spécifique
    hasRole: (state) => (role) => {
      return state.user?.roles?.includes(role) || false
    }
  },

  actions: {
    async login(email, password) {
      try {
        // 🎯 Appel à votre endpoint C# /api/Auth/login
        const response = await api.post('Auth/login', { email, password })
        const newToken = response.data.token

        // 1. Stocke le jeton
        this.token = newToken
        localStorage.setItem('jwt_token', newToken)

        // 2. Récupère le profil (avec les rôles) immédiatement après
        await this.fetchProfile()

        return { success: true }
      } catch (error) {
        console.error('Échec de la connexion:', error)
        return {
          success: false,
          message: error.response?.data?.message || 'Email ou mot de passe incorrect'
        }
      }
    },

    async fetchProfile() {
      if (!this.token) {
        throw new Error('Aucun token disponible')
      }

      try {
        // 🎯 Appel à votre endpoint C# /api/User/profile
        const response = await api.get('User/profile')
        this.user = response.data // Contient les rôles (Admin, Sensei)

        return this.user
      } catch (error) {
        console.error('Échec de la récupération du profil:', error)

        // ❌ Si le token est invalide (401), on déconnecte
        if (error.response?.status === 401) {
          this.logout()
        }

        throw error
      }
    },

    logout() {
      // Nettoyer l'état
      this.token = null
      this.user = null

      // Nettoyer le localStorage
      localStorage.removeItem('jwt_token')

      // Rediriger vers la page de connexion
      router.push('/login')
    },

    // 🔄 Initialiser l'authentification au démarrage de l'app
    async initAuth() {
      // Si un token existe dans le localStorage
      if (this.token) {
        try {
          // Tenter de récupérer le profil utilisateur
          await this.fetchProfile()
        } catch (error) {
          // Si échec (token invalide/expiré), déconnexion propre
          console.error('Token invalide au démarrage:', error)
          this.logout()
        }
      }
    }
  }
})
