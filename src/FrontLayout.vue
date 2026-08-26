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
  <div class="container-fluid p-0 bg-dark text-light min-vh-100 d-flex flex-column">

    <!-- Barre de navigation fixe -->
    <BarnavHome />

    <!-- Contenu principal avec padding-top automatique pour éviter la superposition de la navbar -->
    <main class="flex-grow-1 main-content-wrapper">
      <RouterView />
    </main>

    <!-- ===============================
    🔹 FOOTER
    =============================== -->
    <footer class="bg-dark text-center text-light d-flex flex-column align-items-center py-5 border-top border-secondary border-opacity-25 mt-auto">

      <!-- Réseaux Sociaux -->
      <div class="reseau mb-3">
        <a href="https://www.facebook.com/groups/387110822915291/?ref=share" target="_blank" rel="noopener noreferrer"
          aria-label="Rejoignez notre groupe Facebook" class="mx-2">
          <img width="60" height="60" src="https://img.icons8.com/bubbles/100/facebook-new.png" alt="Logo Facebook"
            loading="lazy" />
        </a>

        <a href="https://www.instagram.com/TON_COMPTE" target="_blank" rel="noopener noreferrer"
          aria-label="Suivez-nous sur Instagram" class="mx-2">
          <img width="60" height="60" src="https://img.icons8.com/bubbles/100/instagram-new--v2.png" alt="Logo Instagram"
            loading="lazy" />
        </a>
      </div>

      <!-- Mentions légales -->
      <div class="legal d-flex flex-wrap justify-content-center gap-4 mb-4">
        <router-link to="/mentions-legales" class="link-light link-underline-opacity-0 link-underline-opacity-100-hover small">
          Mentions légales
        </router-link>
        <router-link to="/politique-confidentialite"
          class="link-light link-underline-opacity-0 link-underline-opacity-100-hover small">
          Politique de confidentialité
        </router-link>
        <router-link to="/politique-cookies" class="link-light link-underline-opacity-0 link-underline-opacity-100-hover small">
          Politique de cookies
        </router-link>
      </div>

      <!-- Copyright -->
      <p class="fs-7 text-white-50 mb-3">
        © Tous droits réservés.<br>AS Porcelette Arts Martiaux {{ dateYear }}.
      </p>

      <!-- Espace Membre / Login -->
    <!-- Accès Comité discret -->
      <div class="mt-2">
        <router-link to="/login" class="text-muted text-decoration-none small opacity-50 hover-opacity-100 transition">
          <i class="bi bi-shield-lock me-1"></i> Espace Comité
        </router-link>
      </div>

    </footer>

  </div>
</template>

<style scoped>
/* --- ESPACEMENT GLOBAL NAVBAR --- */
/* Garantit que toutes les vues qui s'affichent via RouterView démarrent sous la navbar fixe */
.main-content-wrapper {
  padding-top: 85px; /* Ajuste cette valeur selon la hauteur exacte de ton composant BarnavHome */
}

/* --- STYLES PERSONNALISÉS --- */
.btn-outline-custom-muted {
  background-color: #1a1d21;
  color: #adb5bd;
  border: 1px solid #343a40;
}

.btn-outline-custom-muted:hover {
  background-color: #2c3034;
  color: #ffffff;
  border-color: #495057;
}

.text-info-custom {
  color: #31b3d0 !important;
}

.fs-7 {
  font-size: 0.8rem;
}
</style>
