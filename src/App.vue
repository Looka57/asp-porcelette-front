<script setup>

import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AppHeader from '@/components/AppHeader.vue'; // La barre du haut (pour l'instant, c'est votre déconnexion)
import AppSidebar from '@/components/AppSidebar.vue'; // Le nouveau composant

const authStore = useAuthStore();
const $route = useRoute();

// Déterminez si l'utilisateur est dans la zone protégée (Back-Office)
const isInBackOffice = computed(() => {
  // Vérifie si l'utilisateur est connecté ET si le chemin est /admin/... ou /sensei/...
  return authStore.isLoggedIn && (
    $route.path.startsWith('/admin') || $route.path.startsWith('/sensei')
  );
});
</script>

<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <template v-if="isInBackOffice">
      <div class="d-flex flex-grow-1">
        <!-- Sidebar -->
        <AppSidebar />

        <!-- Main content -->
        <div class="flex-grow-1 d-flex flex-column bg-dark">
          <AppHeader />

          <main class="custom-shadow flex-grow-1 max-vh-100 p-3 border border-1 border-light border-opacity-50 rounded text-light mt-3 mx-3 overflow-auto ">
            <RouterView />
          </main>

        </div>
      </div>
      <footer class="bg-dark p-3 text-center text-light ">
        ASP Porcelette © 2025. Tous droits réservés.
      </footer>
    </template>

    <template v-else>
      <RouterView />
    </template>
  </div>
</template>

<style>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}


html, body {
  overflow-x: hidden !important;
}



.custom-shadow {
  box-shadow: -5px -2px 40px rgba(238, 238, 238, 0.266);
}
</style>
