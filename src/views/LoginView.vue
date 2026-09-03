<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const loginError = ref(false);
const errorMessage = ref('');

async function handleLogin() {
  loginError.value = false;
  errorMessage.value = '';

  // On récupère l'objet { success, message } retourné par le store
  const result = await authStore.login(email.value, password.value);

  if (result.success && authStore.user) {
    // Redirection uniquement en cas de VRAI succès
  if (
  authStore.user.roles?.includes('Admin') ||
  authStore.user.roles?.includes('Sensei') ||
  authStore.user.roles?.includes('Comité') ||
  authStore.user.roles?.includes('Secrétaire') ||
  authStore.user.roles?.includes('Trésorière')
) {

  router.push('/admin/dashboard');

} else {

  router.push('/profile');

}
  } else {
    // Affichage du message d'erreur retourné par le backend
    loginError.value = true;
    errorMessage.value = result.message || 'Email ou mot de passe incorrect.';
  }
}
</script>

<template>
  <div class="bob min-h-screen flex items-center justify-center bg-dark text-light">

    <!-- Bouton de retour accueil discret en haut (optionnel mais pratique) -->
    <div class="position-absolute top-0 start-0 p-4">
      <router-link to="/" class="btn rounded-pill px-3 py-2 fw-semibold btn-outline-custom-muted shadow-sm small">
        <i class="bi bi-arrow-left me-1"></i> Accueil
      </router-link>
    </div>

    <div class="loginWrapper shadow-lg">
      <div class="loginForm">

        <!-- En-tête -->
        <div class="appHeader">
          <img src="../assets/img/logo2.png" alt="Blason AS Porcelette" class="img-fluid">
          <h1 class="h5 fw-bold text-white mt-3 mb-1 text-center">AS PORCELETTE</h1>
          <span class="text-uppercase tracking-wider fs-7 fw-bold text-gold">Arts Martiaux</span>
        </div>

        <h3 class="h4 font-weight-bold mb-4 text-center text-gold">Espace Connexion</h3>

        <form @submit.prevent="handleLogin" class="d-flex flex-column gap-3">
          <div>
            <label for="email" class="label mb-2 small fw-semibold text-light opacity-85">Adresse email</label>
            <div class="input-group-custom">
              <span class="input-icon"><i class="bi bi-envelope"></i></span>
              <input type="email" id="email" v-model="email" required class="input-field" placeholder="votre@email.com" />
            </div>
          </div>

          <div>
            <label for="password" class="label mb-2 small fw-semibold text-light opacity-85">Mot de passe</label>
            <div class="input-group-custom">
              <span class="input-icon"><i class="bi bi-lock"></i></span>
              <input type="password" id="password" v-model="password" required class="input-field" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" class="btn btn-gold mt-4 py-3 rounded-pill fw-bold w-100 shadow-sm">
            <i class="bi bi-box-arrow-in-right me-2"></i> Se Connecter
          </button>

          <div v-if="loginError" class="alert alert-danger bg-danger bg-opacity-25 text-danger border-0 p-3 rounded-3 small mt-2 text-center">
            <i class="bi bi-exclamation-triangle-fill me-1"></i> {{ errorMessage }}
          </div>
        </form>

      </div>

      <!-- Illustration latérale -->
      <div class="formImg">
        <img src="../assets/img/imgConnexion.png" alt="Illustration de connexion" />
      </div>

    </div>
  </div>
</template>

<style scoped>
/* --- MISE EN PAGE GLOBALE & DESIGN SYSTEM --- */
.bob {
  background-color: #121417;
  color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.loginWrapper {
  display: flex;
  align-items: stretch;
  justify-content: center;
  background-color: #1a1d21;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  max-width: 1000px;
  width: 90%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

/* --- FORMULAIRE --- */
.loginForm {
  flex: 1;
  background-color: #1a1d21;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 350px;
}

/* En-tête */
.appHeader {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.appHeader img {
  height: 130px;
  width: auto;
  object-fit: contain;
}

/* Inputs avec icônes intégrées */
.input-group-custom {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 15px;
  color: #adb5bd;
}

.input-field {
  background-color: #121417;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #f8f9fa;
  padding: 12px 15px 12px 45px;
  border-radius: 0.75rem;
  width: 100%;
  font-size: 0.95rem;
  transition: all 0.2s ease-in-out;
}

.input-field:focus {
  border-color: #ffc107;
  box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.25);
  outline: none;
}

/* Bouton principal Doré */
.btn-gold {
  background-color: #ffc107;
  color: #121417;
  border: none;
  transition: all 0.2s ease-in-out;
}

.btn-gold:hover {
  background-color: #ffca2c;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}

.btn-gold:active {
  transform: translateY(0);
}

/* Bouton retour muted */
.btn-outline-custom-muted {
  background-color: #1a1d21;
  color: #adb5bd;
  border: 1px solid #343a40;
}

.btn-outline-custom-muted:hover {
  background-color: #2c3034;
  color: #ffffff;
}

/* Classes utilitaires de cohérence */
.text-gold {
  color: #ffc107 !important;
}

.tracking-wider {
  letter-spacing: 0.1em;
}

.fs-7 {
  font-size: 0.75rem;
}

/* --- IMAGE LATÉRALE --- */
.formImg {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 350px;
  background-color: #000;
}

.formImg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* --- RESPONSIVE --- */
@media (max-width: 992px) {
  .loginWrapper {
    max-width: 700px;
  }
  .formImg {
    display: none; /* Cache l'image sur tablettes portrait / mobiles pour garder un formulaire centré et fluide */
  }
}
</style>
