<script setup>
import BarnavHome from './components/Barnav/BarnavHome.vue';
import { RouterView } from 'vue-router';

</script>

<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100">
    <BarnavHome />

    <main class="flex-grow-1">
      <RouterView />

    </main>
  </div>

  <!-- FOOTER -->
  <footer class="bg-dark text-center text-light d-flex flex-column align-items-center">
    ASP Porcelette © 2025. Tous droits réservés.
    <router-link to="/login"
      class=" inline-block bg-green-500 text-dark py-2 px-4 rounded hover:bg-green-600 transition">
      Accéder à l'Espace Membre
    </router-link>
  </footer>



</template>
<style>

</style>
