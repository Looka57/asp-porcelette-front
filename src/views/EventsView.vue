<!-- PageEvenements.vue -->
<script setup>
import { ref } from 'vue'
import CardsEvent from '@/components/Events/CardsEvent.vue'
import HeaderCards from '@/components/Events/HeaderCards.vue';
import Tag from 'primevue/tag';

const selectedFilter = ref('Tous')
const eventTitle = ref('')
</script>

<template>
  <div class="container-fluid min-h-screen p-4">
    <!-- ════════════ 🏷️ EN-TÊTE ADMIN PREMIUM ════════════ -->
    <div class="header-banner position-relative overflow-hidden p-4 p-md-5 mb-5 border-round-xl shadow-4">
      <div class="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-3">
        <div>
          <div class="flex align-items-center gap-2 mb-2">
            <Tag value="Espace Admin" severity="danger" class="uppercase tracking-wider font-semibold px-3 py-1" />
            <Tag value="Communication & Presse" severity="secondary" class="border-1 border-white-alpha-20 px-3 py-1" />
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-white m-0 mb-2">
            Gestion des <span class="text-warning">Evénements</span>
          </h1>
          <p class="text-400 text-sm md:text-base m-0 flex align-items-center gap-2">
            <i class="pi pi-calendar text-warning"></i>
            Publiez, modifiez et gérez la visibilité des événements de l'association.
          </p>
        </div>
      </div>
    </div>
    <HeaderCards @filter-selected="selectedFilter = $event" />
    <CardsEvent v-model="eventTitle" :filter="selectedFilter" />
  </div>
</template>

<style scoped>
.header-banner {
  background: linear-gradient(135deg, #1e2530 0%, #2b3035 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
