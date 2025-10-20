<!-- PageEvenements.vue -->
<script setup>
import { ref } from 'vue'
import CardsEvent from '@/components/Events/CardsEvent.vue' // adapte le chemin
import HeaderCards from '@/components/Events/HeaderCards.vue';



const eventTitle = ref('')
</script>

<template>
  <div class="container-fluid text-white min-h-screen">
  <h1 class="m-3 text-center">Gestion des Evenements</h1>
  <HeaderCards />
  <CardsEvent v-model="eventTitle" />

  </div>
</template>
