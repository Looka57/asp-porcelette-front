<script setup>
/* ════════════════════════════════════════════════════════════════════════ */
/* 📦 IMPORTS */
/* ════════════════════════════════════════════════════════════════════════ */
import { ref } from 'vue'; // Gestion d'état réactif
import ArticleActualite from '@/components/Actualites/ArticleActualite.vue'; // Composant qui affiche la liste + modales
import HeaderBarNav from '@/components/Actualites/HeaderBarNav.vue'; // Composant d'entête avec bouton + recherche

/* ════════════════════════════════════════════════════════════════════════ */
/* 🎯 VARIABLES RÉACTIVES */
/* ════════════════════════════════════════════════════════════════════════ */
const isCreateModalOpen = ref(false); // État de la modale de création (true = ouverte)
const searchTerm = ref(''); // Terme de recherche saisi dans le HeaderBarNav
const stats = ref({
  total: 0,
  publies: 0,
  archives: 0,
});




/* ════════════════════════════════════════════════════════════════════════ */
/* 🧭 FONCTIONS DE GESTION */
/* ════════════════════════════════════════════════════════════════════════ */
function handleOpenCreateModal() {
  isCreateModalOpen.value = true;
  console.log('📢 PageActualite : Ouverture de la modale de création déclenchée');
}

/**
 * Met à jour le terme de recherche à partir de la barre du Header.
 * @param {string} term - Le texte saisi dans le champ de recherche.
 */
function handleSearch(term) {
  searchTerm.value = term;
}

function handleUpdateStats(newStats) {
  stats.value = newStats;
}

function handleFilterStatus(status) {
  stats.value.currentFilter = status;
}

</script>

<template>
  <!-- ════════════════════════════════════════════════════════════════════ -->
  <!-- 📰 PAGE DE GESTION DES ACTUALITÉS -->
  <!-- ════════════════════════════════════════════════════════════════════ -->
  <div class="container-fluid min-h-screen p-4">

    <!-- 🏷️ Titre principal -->
    <h1 class="m-3 text-center">Gestion des Actualités</h1>

    <!-- 🔹 En-tête : bouton de création + barre de recherche -->
    <!-- Événements émis :
         - @create-actualite : ouvre la modale d'ajout
         - @search-updated : transmet le terme de recherche -->
    <HeaderBarNav @create-actualite="handleOpenCreateModal" @search-updated="handleSearch"
      @filter-status="handleFilterStatus" :stats="stats" />
    <ArticleActualite :is-modal-open="isCreateModalOpen" @update:is-modal-open="isCreateModalOpen = $event"
      :searchTerm="searchTerm" :currentFilter="stats.currentFilter" @update-stats="handleUpdateStats" />


  </div>
</template>
