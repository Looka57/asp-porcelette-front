<!-- ════════════════════════════════════════════════════════════════════════ -->
<!-- 🧩 NAVBAR ADMIN (ROLE-BASED) -->
<!-- ════════════════════════════════════════════════════════════════════════ -->
<script setup>
/* ════════════════════════════════════════════════════════════════════════ */
/* 📦 IMPORTS */
/* ════════════════════════════════════════════════════════════════════════ */
import { computed } from 'vue'; // ⬅️ Assurez-vous d'importer computed
import { useAuthStore } from '@/stores/auth';
// import { useRouter } from 'vue-router'; // Décommenter si vous utilisez useRouter

/* ════════════════════════════════════════════════════════════════════════ */
/* ⚙️ INITIALISATION DU STORE AUTH */
/* ════════════════════════════════════════════════════════════════════════ */
const authStore = useAuthStore();

/* ════════════════════════════════════════════════════════════════════════ */
/* 🎯 LIENS DE NAVIGATION */
/* ════════════════════════════════════════════════════════════════════════ */
const navItems = [
  { label: 'Tableau de bord', icon: 'pi pi-home', to: '/admin/dashboard', roles: ['Admin', 'Sensei'] },
  { label: 'Sensei', icon: 'pi pi-users', to: '/admin/sensei', roles: ['Admin'] },
  { label: 'Licencies', icon: 'pi pi-users', to: '/admin/licencies', roles: ['Admin'] },
  { label: 'Événements', icon: 'pi pi-calendar', to: '/admin/events', roles: ['Admin', 'Sensei'] },
  { label: 'Actualités', icon: 'pi pi-book', to: '/admin/actualite', roles: ['Admin'] },
  { label: 'Disciplines', icon: 'pi pi-cog', to: '/admin/discipline', roles: ['Admin'] },
  { label: 'Tarifs', icon: 'pi pi-money-bill', to: '/admin/tarifs', roles: ['Admin'] },
  { label: 'Comptabilité', icon: 'pi pi-building-columns', to: '/admin/compta', roles: ['Admin'] },
];

/* ════════════════════════════════════════════════════════════════════════ */
/* 🧠 PROPRIÉTÉ CALCULÉE - FILTRAGE PAR RÔLE */
/* ════════════════════════════════════════════════════════════════════════ */
const filteredNavItems = computed(() => {
  const userRoles = authStore.user?.roles || [];

  if (userRoles.length === 0) return [];

  return navItems.filter(item => {
    return item.roles.some(role => userRoles.includes(role));
  });
});
</script>

<!-- ════════════════════════════════════════════════════════════════════════ -->
<!-- 🎨 TEMPLATE -->
<!-- ════════════════════════════════════════════════════════════════════════ -->
<template>
  <nav class="custom-navbar d-flex flex-column p-4 max-vh-100 bg-dark">
    <!-- Logo -->
    <img class="w-25" src="../assets/img/Blason_Ville_fr_Porcelette.svg" alt="Logo ASP Porcelette" />
    <hr class="my-4 border-light opacity-50" />

    <!-- Liens filtrés -->
    <router-link v-for="item in filteredNavItems" :key="item.label" :to="item.to"
      class="d-flex align-items-center p-3 mb-2 text-secondary text-decoration-none rounded"
      :class="{ 'bg-secondary text-light': $route.path === item.to }"
      :aria-current="$route.path === item.to ? 'page' : null">
      <i :class="item.icon" class="me-3"></i>
      <span>{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<!-- ════════════════════════════════════════════════════════════════════════ -->
<!-- 💅 STYLE -->
<!-- ════════════════════════════════════════════════════════════════════════ -->
<style>
.custom-navbar {
  background-color: rgb(22, 22, 22) !important;
  width: 250px;
  text-align: center;
}

.custom-navbar a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white !important;
}

.custom-navbar a:focus {
  outline: 2px solid #ffffff;
  outline-offset: -2px;
}

.custom-navbar img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
}
</style>
