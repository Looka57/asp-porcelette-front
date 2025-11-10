<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

function handleLogout() {
  authStore.logout();
  router.push('/login');
}

// Récupérer le nom de l'utilisateur pour le message de bienvenue
const userName = computed(() => {
  // Si l'utilisateur a un rôle Admin, on affiche le message "Administrateur"
  if (authStore.user?.roles.includes('Admin')) {
    return 'Administrateur';
  }
  // Sinon, on affiche son prénom s'il est disponible
  return authStore.user?.prenom || 'Membre';
});
</script>

<template>
  <header class=" bg-dark text-white p-4 d-flex justify-content-between align-items-center border-bottom">
    <div class="bob fs-1 fw-bold mb-0">
      Bienvenue, {{ userName }} !
    </div>

    <div class="d-flex align-items-center">
      <router-link to="profile" class="btn btn-outline-light me-2">
        <i class="pi pi-user"></i>
      </router-link>

      <button type="button" class="btn btn-outline-danger button-logout" @click="handleLogout">
        <i class="pi pi-sign-out"></i>
        <span class="d-none d-sm-inline">
          Déconnexion
        </span>
      </button>
    </div>
  </header>
</template>

<style scoped>
/* 💻 MEDIA QUERY - Mobile */

@media (max-width: 767.98px) {

  /* Styles pour le titre */
  header .bob {
    font-size: 1.5rem !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 50px;
    align-self: center;
  }

  /* Styles pour les boutons - Réduire la taille du bouton de déconnexion */
  .button-logout,
  .button-profile {
    width: 40px;
    /* Taille fixe pour ne montrer que l'icône */
    padding: 0.5rem;
    display: flex;
    /* Assure que l'icône est centrée */
    justify-content: center;
    align-items: center;
  }
}
</style>
