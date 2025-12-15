<!-- src/views/ForbiddenView.vue -->
<template>
  <div class="forbidden-container">
    <div class="forbidden-content">
      <div class="forbidden-icon">🚫</div>
      <h1>Accès interdit</h1>
      <p>Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>
      <div class="forbidden-actions">
        <router-link to="/" class="btn-home">Retour au site</router-link>
        <button v-if="isLoggedIn" @click="logout" class="btn-logout">
          Se déconnecter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isLoggedIn)

const logout = () => {
  authStore.logout()
}
</script>

<style scoped>
.forbidden-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 20px;
}

.forbidden-content {
  background: white;
  border-radius: 16px;
  padding: 60px 40px;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.forbidden-icon {
  font-size: 80px;
  margin-bottom: 20px;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.forbidden-content h1 {
  color: #2d3748;
  font-size: 32px;
  margin-bottom: 16px;
}

.forbidden-content p {
  color: #718096;
  font-size: 16px;
  margin-bottom: 30px;
  line-height: 1.6;
}

.forbidden-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-home,
.btn-logout {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.btn-home {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.btn-logout {
  background: white;
  color: #e53e3e;
  border: 2px solid #e53e3e;
}

.btn-home:hover,
.btn-logout:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
</style>
