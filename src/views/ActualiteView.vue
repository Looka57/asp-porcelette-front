<script setup>
import { ref } from 'vue'; // 👈 Import de ref
import ArticleActualite from '@/components/Actualites/ArticleActualite.vue';
import HeaderBarNav from '@/components/Actualites/HeaderBarNav.vue';

// 🎯 1. État de la modale géré au niveau du parent
const isCreateModalOpen = ref(false);

// 🎯 2. Fonction pour ouvrir la modale, appelée par l'événement
function handleOpenCreateModal() {
  isCreateModalOpen.value = true;
  console.log('PageEvenements : Ouverture de la modale déclenchée');
}
</script>

<template>
  <div class="container-fluid min-h-screen p-4">
    <h1 class="m-3 text-center">Gestion des Actualités</h1>

    <HeaderBarNav @create-actualite="handleOpenCreateModal" />

    <ArticleActualite :is-modal-open="isCreateModalOpen" @update:is-modal-open="isCreateModalOpen = $event" />

  </div>
</template>
