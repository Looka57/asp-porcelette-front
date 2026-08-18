<!-- src/views/ForbiddenView.vue -->
<template>
  <div class="forbidden">
    <div class="forbidden-content">

      <!-- Logo -->
      <div class="dojo-mark">
        <span>AS</span>
      </div>

      <p class="error-label">ERREUR 403</p>

      <h1>403</h1>

      <h2>Accès interdit.</h2>

      <p class="description">
        Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
        Si vous pensez qu'il s'agit d'une erreur, contactez un administrateur.
      </p>

      <div class="forbidden-actions">

        <RouterLink to="/" class="btn-home">
          <i class="pi pi-home"></i>
          Retour à l'accueil
        </RouterLink>

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
.forbidden {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background:
    radial-gradient(circle at center,
      rgba(212, 175, 55, 0.08),
      transparent 45%),
    #111111;
  color: white;
  text-align: center;
}

.forbidden-content {
  width: 100%;
  max-width: 650px;
}


/* =========================================================
   LOGO
   ========================================================= */

.dojo-mark {
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #FF4D4D;
  border-radius: 50%;
  color: #FF4D4D;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 2px;
  box-shadow:
    0 0 30px rgba(212, 175, 55, 0.15);
}


/* =========================================================
   LABEL
   ========================================================= */

.error-label {
  margin: 0 0 10px;
  color: #FF4D4D;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
}


/* =========================================================
   403
   ========================================================= */

h1 {
  margin: 0;
  font-size: clamp(7rem, 20vw, 12rem);
  line-height: 0.9;
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 2px #FF4D4D;
  text-shadow:
    0 0 40px rgba(212, 55, 55, 0.15);
}


/* =========================================================
   TITRE
   ========================================================= */

h2 {
  margin: 30px 0 15px;
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 700;
}


/* =========================================================
   DESCRIPTION
   ========================================================= */

.description {
  max-width: 520px;
  margin: 0 auto;
  color: #a3a3a3;
  font-size: 1rem;
  line-height: 1.7;
}


/* =========================================================
   BOUTONS
   ========================================================= */

.forbidden-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 35px;
}

.btn-home,
.btn-logout {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 35px;
  padding: 13px 25px;
  background: #FF4D4D;
  color: #111;
  border: 2px solid #FF4D4D;
  border-radius: 6px;
  font-weight: 700;
  text-decoration: none;
  transition:
    background-color 0.25s ease,
    color 0.25s ease,
    transform 0.25s ease,
    box-shadow 0.25s ease;
}


/* =========================================================
   RETOUR ACCUEIL
   ========================================================= */

.btn-home {
  background: #FF4D4D;
  color: #111;
  border: 2px solid #FF4D4D;
}

.btn-home:hover {
  background: transparent;
  color: #FF4D4D;
  transform: translateY(-2px);
  box-shadow:
    0 8px 25px rgba(212, 60, 55, 0.2);
}


/* =========================================================
   DÉCONNEXION
   ========================================================= */

.btn-logout {
  background: transparent;
  color: #d64545;
  border: 2px solid #d64545;
}

.btn-logout:hover {
  background: #d64545;
  color: white;
  transform: translateY(-2px);
  box-shadow:
    0 8px 25px rgba(214, 69, 69, 0.2);
}


/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 600px) {

  .forbidden {
    padding: 30px 20px;
  }

  .dojo-mark {
    width: 65px;
    height: 65px;
    margin-bottom: 25px;
    font-size: 20px;
  }

  h2 {
    margin-top: 25px;
  }

  .description {
    font-size: 0.95rem;
  }

  .forbidden-actions {
    flex-direction: column;
  }

  .btn-home,
  .btn-logout {
    width: 100%;
    max-width: 280px;
  }
}
</style>
