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
  <div class="p-4 max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4">Se Connecter</h2>
    
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required class="border p-2 w-full" />
      </div>
      <div>
        <label for="password">Mot de passe:</label>
        <input type="password" v-model="password" required class="border p-2 w-full" />
      </div>
      
      <button type="submit" class="bg-blue-500 text-white p-2 rounded w-full">Connexion</button>
      
      <p v-if="loginError" class="text-red-500">Identifiants incorrects ou API injoignable.</p>
    </form>
  </div>
</template>