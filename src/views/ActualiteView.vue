<!-- PageEvenements.vue -->
<script setup>
import ArticleActualite from '@/components/Actualites/ArticleActualite.vue';
import HeaderBarNav from '@/components/Actualites/HeaderBarNav.vue';
// import { ref } from 'vue'

</script>

<template>
  <div class="container-fluid min-h-screen p-4">
    <h1 class="m-3 text-center">Gestion des Actualités</h1>
    <HeaderBarNav />
    <ArticleActualite />

  </div>
</template>
