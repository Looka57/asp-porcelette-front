<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import BarnavHome from './components/Barnav/BarnavHome.vue';
import { RouterView } from 'vue-router';

const dateYear = new Date().getFullYear();

</script>
<!-- ===============================
🔹 BODY
=============================== -->
<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100">
    <BarnavHome />

    <main class="flex-grow-1">
      <RouterView />

    </main>
  </div>
  <!-- ===============================
🔹 FOOTER
 =============================== -->
  <footer class="bg-dark text-center text-light d-flex flex-column align-items-center">


    <!-- // **********************
// 🔹 Reseau
// ********************** -->
    <div class="reseau">
      <a href="https://www.facebook.com/groups/387110822915291/?ref=share" target="_blank" rel="noopener noreferrer"
        aria-label="Rejoignez notre groupe Facebook">
        <img width="80" height="80" src="https://img.icons8.com/bubbles/100/facebook-new.png" alt="Logo Facebook"
          loading="lazy" />
      </a>

      <a href="https://www.instagram.com/TON_COMPTE" target="_blank" rel="noopener noreferrer"
        aria-label="Suivez-nous sur Instagram">
        <img width="80" height="80" src="https://img.icons8.com/bubbles/100/instagram-new--v2.png" alt="Logo Instagram"
          loading="lazy" />
      </a>
    </div>
    <!-- // **********************
// 🔹 Mentions legales
// ********************** -->
    <div class="legal d-flex gap-4 mb-3">
      <router-link to="/mentions-legales" class="link-light link-underline-opacity-0 link-underline-opacity-100-hover">
        Mentions légales
      </router-link>
      <router-link to="/politique-confidentialite"
        class="link-light link-underline-opacity-0 link-underline-opacity-100-hover">
        Politique de confidentialité
      </router-link>
      <router-link to="/politique-cookies" class="link-light link-underline-opacity-0 link-underline-opacity-100-hover">
        Politique de cookies
      </router-link>
    </div>

    <p class="fs-6 text-white-50">© Tous droits réservés.<br>AS Porcelette Art Martiaux {{ dateYear }}. </p>
    <!-- // **********************
// 🔹 Login dash
// ********************** -->
    <router-link to="/login" class=" inline-block text-dark py-2 px-4 rounded  transition" target="_blank">
      Accéder à l'Espace Membre
    </router-link>

  </footer>



</template>
<style></style>
