<!-- PageEvenements.vue -->
<script setup>
import { ref } from 'vue'
import CardsEvent from '@/components/Events/CardsEvent.vue' // adapte le chemin
import HeaderCards from '@/components/Events/HeaderCards.vue';

const selectedFilter = ref('Tous')
const eventTitle = ref('')
</script>

<template>
  <div class="container-fluid min-h-screen p-4">
    <h1 class="m-3 text-center">Gestion des Evenements</h1>
    <HeaderCards @filter-selected="selectedFilter = $event" />
    <CardsEvent v-model="eventTitle" :filter="selectedFilter" />
  </div>
</template>
