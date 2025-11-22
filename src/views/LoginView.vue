<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const loginError = ref(false);

async function handleLogin() {
  loginError.value = false;
  const success = await authStore.login(email.value, password.value);

  if (success) {
    // Rediriger l'utilisateur après la connexion
    if (authStore.user?.roles.includes('Admin') || authStore.user?.roles.includes('Sensei')) {
      router.push('/admin/dashboard');
    } else {
      router.push('/profile');
    }
  } else {
    loginError.value = true;
  }
}
</script>

<template>
  <div class="bob min-h-screen flex items-center justify-center bg-dark text-light ">
    <div class="loginWrapper">
      <div class="loginForm">
        <div class="appHeader">
          <img src="../assets/img/Blason_Ville_fr_Porcelette.svg" alt="Blason AS Porcelette">
          <h1 class="text-2xl font-bold text-light mt-4">AS PORCELETTE</h1>
          <h2 class="text-xl font-extrabold text-primary mt-1">ARTS MARTIAUX</h2>
        </div>

        <h3 class="text-2xl font-bold mb-6 text-center text-primary">Connexion</h3>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label for="email" class="label">Email:</label>
            <input type="email" v-model="email" required class="input-field" />
          </div>
          <div>
            <label for="password" class="label">Mot de passe:</label>
            <input type="password" v-model="password" required class="input-field" />
            <!-- <div class="text-right mt-1">
              <router-link :to="{ name: 'forgot-password' }" class="text-link-blue text-sm hover:underline">Mot de passe
                oublié ?</router-link>
            </div> -->
          </div>

          <button type="submit" class="btn-primary mt-6 p-3 rounded-lg w-full font-semibold">
            Se Connecter
          </button>

          <p v-if="loginError" class="error-message text-red-500 text-center">
            ⚠️ Identifiants incorrects.
          </p>
        </form>
      </div>

      <div class="formImg">
        <img src="../assets/img/imgConnexion.png" alt="Illustration de connexion" />
      </div>

    </div>
  </div>
</template>

<style scoped>
.text-primary {
  color: var(--color-primary);
}

.text-light {
  color: var(--color-light-text);
}

/* ------------------------------------------------------------------- */


* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

/* Application des variables au corps */
.bob {
  background-color: var(--color-dark-bg);
  color: var(--color-light-text);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loginWrapper {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 4rem;
  /* Écart plus grand */
  background-color: var(--color-card-bg);
  padding: 0;
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  max-width: 1100px;
  width: 90%;
  border: 1px solid #30363d;
  overflow: hidden;
}

/* --- 3. Formulaire (loginForm) --- */
.loginForm {
  flex: 1;
  background-color: var(--color-form-bg);
  padding: 40px;
  border-top-left-radius: var(--radius-lg);
  border-bottom-left-radius: var(--radius-lg);
  min-width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}


/* En-tête de l'application (Logo/Titre) */
.appHeader {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #30363d;
}

.appHeader img {
  height: 150px;
  /* Ajustez la taille de votre blason ici */
  width: auto;
  margin-bottom: 10px;
}


/* Labels */
.label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: var(--color-light-text);
}

/* Champs de saisie (Inputs) */
.input-field {
  background-color: var(--color-dark-bg);
  border: 1px solid #30363d;
  color: var(--color-light-text);
  padding: 12px;
  border-radius: 6px;
  width: 100%;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-field:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.2);
  outline: none;
}

/* Bouton Principal */
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-dark-bg);
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s, box-shadow 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
}

.btn-primary:active {
  transform: scale(0.99);
}

/* Lien Mot de passe oublié */
.text-link-blue {
  color: #4da6ff;
}

/* Message d'erreur */
.error-message {
  color: var(--color-error);
  padding: 10px;
  border: 1px dashed var(--color-error);
  background-color: rgba(248, 81, 73, 0.1);
  border-radius: 6px;
  margin-top: 15px;
}

/* --- 4. Image (formImg) --- */
.formImg {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 400px;
  max-width: 500px;
  border-top-right-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-lg);
  padding: 0;
}

.formImg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}

/* --- 5. Responsive --- */
@media (max-width: 1024px) {
  .loginWrapper {
    gap: 2rem;
    max-width: 800px;
  }

  .formImg {
    min-width: 300px;
    max-width: 400px;
  }

  .loginForm {
    padding: 30px;
  }
}

@media (max-width: 768px) {
  .loginWrapper {
    flex-direction: column;
    padding: 0;
    width: 95%;
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .loginForm {
    min-width: auto;
    width: 100%;
    padding: 30px 20px;
    border-radius: var(--radius-lg);
  }

  .formImg {
    display: none;
  }
}
</style>
