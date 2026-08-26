<script setup>
/* ════════════════════════════════════════════════════════════════════════ */
/* 📦 IMPORTS */
/* ════════════════════════════════════════════════════════════════════════ */
import { ref } from 'vue';
import ArticleActualite from '@/components/Actualites/ArticleActualite.vue';
import HeaderBarNav from '@/components/Actualites/HeaderBarNav.vue';

import Tag from 'primevue/tag';
/* ════════════════════════════════════════════════════════════════════════ */
/* 🎯 VARIABLES RÉACTIVES */
/* ════════════════════════════════════════════════════════════════════════ */
const isCreateModalOpen = ref(false);
const searchTerm = ref('');
const stats = ref({
  total: 0,
  publies: 0,
  archives: 0,
  currentFilter: 'all'
});

/* ════════════════════════════════════════════════════════════════════════ */
/* 🧭 FONCTIONS DE GESTION */
/* ════════════════════════════════════════════════════════════════════════ */
function handleOpenCreateModal() {
  isCreateModalOpen.value = true;
}

function handleSearch(term) {
  searchTerm.value = term;
}

function handleUpdateStats(newStats) {
  stats.value = { ...stats.value, ...newStats };
}

function handleFilterStatus(status) {
  stats.value.currentFilter = status;
}
</script>

<template>
  <div class="py-5 px-3 md:px-6 surface-ground min-vh-100 text-white">

    <!-- ════════════ 🏷️ EN-TÊTE ADMIN PREMIUM ════════════ -->
    <div class="header-banner position-relative overflow-hidden p-4 p-md-5 mb-5 border-round-xl shadow-4">
      <div class="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-3">
        <div>
          <div class="flex align-items-center gap-2 mb-2">
            <Tag value="Espace Admin" severity="danger" class="uppercase tracking-wider font-semibold px-3 py-1" />
            <Tag value="Communication & Presse" severity="secondary" class="border-1 border-white-alpha-20 px-3 py-1" />
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-white m-0 mb-2">
            Gestion des <span class="text-warning">Actualités</span>
          </h1>
          <p class="text-400 text-sm md:text-base m-0 flex align-items-center gap-2">
            <i class="pi pi-newspaper text-warning"></i>
            Publiez, modifiez et gérez la visibilité des articles de l'association.
          </p>
        </div>
      </div>
    </div>

    <!-- ════════════ 📰 CONTENU DE LA PAGE ════════════ -->
    <div class="max-w-7xl mx-auto flex flex-column gap-5">

      <!-- Barre de navigation / Filtres & Recherche -->
      <HeaderBarNav
        :stats="stats"
        @create-actualite="handleOpenCreateModal"
        @search-updated="handleSearch"
        @filter-status="handleFilterStatus"
      />

      <!-- Liste des articles & Modale d'édition/création -->
      <ArticleActualite
        :is-modal-open="isCreateModalOpen"
        :searchTerm="searchTerm"
        :currentFilter="stats.currentFilter"
        @update:is-modal-open="isCreateModalOpen = $event"
        @update-stats="handleUpdateStats"
      />

    </div>

  </div>
</template>

<style scoped>
/* Bannière d'en-tête harmonisée */
.header-banner {
  background: linear-gradient(135deg, #1e2530 0%, #2b3035 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.tracking-wider {
  letter-spacing: 0.08em;
}
</style>
