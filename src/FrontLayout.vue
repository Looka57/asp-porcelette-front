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
    AS Porcelette Art Martiaux © 2025. Tous droits réservés.
    <div class="reseau">
      <a href=""><img width="80" height="80" src="https://img.icons8.com/bubbles/100/facebook-new.png" alt="facebook-new"/></a>
      <a href=""><img width="80" height="80" src="https://img.icons8.com/bubbles/100/instagram-new--v2.png" alt="instagram-new--v2"/></a>
      <a href=""><img width="80" height="80" src="https://img.icons8.com/bubbles/100/facebook-new.png" alt="facebook-new"/></a>
    </div>
    <router-link to="/login"
      class=" inline-block bg-green-500 text-dark py-2 px-4 rounded hover:bg-green-600 transition" target="_blank">
      Accéder à l'Espace Membre
    </router-link>
  </footer>



</template>
<style>

</style>
