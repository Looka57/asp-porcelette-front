<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isOpen = ref(true); // Navbar ouverte par défaut sur desktop
// Utilisation du breakpoint 'lg' de Bootstrap (992px) pour le CSS, mais
// nous allons conserver 768px pour la logique Vue si c'est votre standard.
const isMobile = ref(window.innerWidth < 768);

/* 🧠 Détection du resize pour adapter le comportement */
const handleResize = () => {
  const wasMobile = isMobile.value;
  isMobile.value = window.innerWidth < 768;

  // Si on passe de mobile à desktop, forcer l'ouverture
  if (wasMobile && !isMobile.value) {
    isOpen.value = true;
  }
  // Si on passe de desktop à mobile, forcer la fermeture
  else if (!wasMobile && isMobile.value) {
    isOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  // Initialiser l'état d'ouverture correct au chargement
  if (isMobile.value) {
      isOpen.value = false;
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

/* 🔹 Liens de navigation (inchangés) */
const navItems = [
  { label: 'Tableau de bord', icon: 'pi pi-home', to: '/admin/dashboard', roles: ['Admin', 'Sensei'] },
  { label: 'Sensei', icon: 'pi pi-users', to: '/admin/sensei', roles: ['Admin' , 'Sensei'] },
  { label: 'Licencies', icon: 'pi pi-users', to: '/admin/licencies', roles: ['Admin' , 'Sensei'] },
  { label: 'Cours', icon: 'pi pi-slack', to: '/admin/cours', roles: ['Admin' , 'Sensei'] },
  { label: 'Événements', icon: 'pi pi-calendar', to: '/admin/events', roles: ['Admin' , 'Sensei'] },
  { label: 'Actualités', icon: 'pi pi-book', to: '/admin/actualite', roles: ['Admin' , 'Sensei'] },
  { label: 'Disciplines', icon: 'pi pi-cog', to: '/admin/discipline', roles: ['Admin' , 'Sensei'] },
  { label: 'Tarifs', icon: 'pi pi-money-bill', to: '/admin/tarifs', roles: ['Admin' , 'Sensei'] },
  { label: 'Comptabilité', icon: 'pi pi-building-columns', to: '/admin/compta', roles: ['Admin' , 'Sensei'] },
];

/* 🔹 Filtrage par rôle (inchangé) */
const filteredNavItems = computed(() => {
  const userRoles = authStore.user?.roles || [];
  if (userRoles.length === 0) return [];
  return navItems.filter(item => item.roles.some(role => userRoles.includes(role)));
});

/* 🔹 Toggle burger (inchangé) */
const toggleNavbar = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <div> <button class="btn btn-outline-light position-fixed top-0 start-0 m-3 z-3 d-md-none" type="button"
      @click="toggleNavbar" v-if="isMobile">
      <i :class="isOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
    </button>

    <div v-if="isMobile && isOpen" class="overlay" @click="toggleNavbar"></div>

    <nav class="custom-navbar bg-dark text-light p-4" :class="{
          'open': isOpen,
          'mobile-mode': isMobile,
          'collapsed': !isOpen && !isMobile
      }">
      <div class="d-flex justify-content-center align-items-center mb-4">
        <img class="w-25" src="../assets/img/Blason_Ville_fr_Porcelette.svg" alt="Logo ASP Porcelette" />
        <hr class="my-4 border-light opacity-50" />
      </div>


      <hr class="border-light opacity-50" />

      <div class="nav-links">
        <router-link v-for="item in filteredNavItems" :key="item.label" :to="item.to"
          class="d-flex align-items-center p-3 mb-2 text-secondary text-decoration-none rounded"
          :class="{ 'bg-secondary text-light': $route.path === item.to }" @click="isMobile && toggleNavbar()">
          <i :class="item.icon" class="me-3"></i>
          <span>{{ item.label }}</span>
        </router-link>
      </div>
    </nav>

    <main class="main-content" :class="{
          // Ajuster la marge pour le mode desktop rétracté
          'collapsed-margin': !isOpen && !isMobile,
          // Si ouvert en desktop, la marge est de la taille de la nav ouverte
          'open-margin': isOpen && !isMobile
      }">
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
/* ========= NAVBAR DEFAUT (Desktop) ========= */
.custom-navbar {
  width: 250px;
  min-height: 100vh;
  transition: all 0.3s ease;
  flex-shrink: 0;
  z-index: 1001;
  position: fixed; /* Fixer la navbar sur desktop */
  top: 0;
  left: 0;
}

/* Desktop : Rétraction */
.custom-navbar.collapsed {
  width: 70px;
}

/* Desktop : Éléments masqués/réduits lors de la rétraction */
.custom-navbar.collapsed .nav-links span {
  display: none; /* Masque les labels des liens */
}
.custom-navbar.collapsed .logo {
  width: 40px; /* Réduit la taille du logo */
  margin: 0 auto;
}
.custom-navbar.collapsed .d-flex.justify-content-between {
    justify-content: center !important; /* Centre l'icône / logo */
}


/* ========= MAIN CONTENT MARGINS (Desktop) ========= */
/* Gère l'espace à gauche du contenu principal */
.main-content {
    width: 100%; /* Débute comme pleine largeur */
    min-height: 100vh;
    padding-left: 250px; /* Marge pour la navbar ouverte */
    transition: padding-left 0.3s ease;
}

.main-content.collapsed-margin {
    padding-left: 70px; /* Marge pour la navbar rétractée */
}

/* ========= MOBILE (< 768px) ========= */
.custom-navbar.mobile-mode {
  position: fixed;
  top: 0;
  left: 0;
  transform: translateX(-250px); /* Cachée par défaut */
  height: 100vh;
  width: 250px;
  /* Assurez-vous que la transition est uniquement sur le transform */
  transition: transform 0.3s ease-in-out;
}

.custom-navbar.mobile-mode.open {
  transform: translateX(0); /* Apparaît */
}

/* L'overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

/* Le contenu principal doit utiliser la pleine largeur sur mobile */
@media (max-width: 767.98px) {
    .main-content {
        padding-left: 0 !important; /* Pas de marge à gauche sur mobile */
    }
}

/* ========= LIENS (inchangés) ========= */
.custom-navbar a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white !important;
}
</style>
