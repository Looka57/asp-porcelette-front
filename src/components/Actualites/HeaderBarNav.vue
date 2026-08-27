<script setup>

import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

/* -------------------------------------------------------------------------- */
/* 🎯 PROPS ET EMITS */
/* -------------------------------------------------------------------------- */
const props = defineProps({
  stats: {
    type: Object,
    default: () => ({ total: 0, publies: 0, archives: 0, currentFilter: 'total' })
  }
});

const emit = defineEmits([
  'create-actualite',
  'search-updated',
  'filter-status'
]);

/* -------------------------------------------------------------------------- */
/* 💾 VARIABLES LOCALES ET FONCTIONS */
/* -------------------------------------------------------------------------- */
const localSearchTerm = ref('');

function openCreateModal() {
  emit('create-actualite');
}

function updateSearch() {
  emit('search-updated', localSearchTerm.value);
}

function filterStatus(status) {
  emit('filter-status', status);
}
</script>

<template>
  <div class="flex flex-column gap-4">

    <!-- 🎴 CARDS DE FILTRAGE ET STATISTIQUES DES ARTICLES -->
    <div class="grid grid-nogutter gap-3">

      <!-- Total articles -->
      <div class="col-12 md:col">
        <div
          class="stat-card p-4 border-round-xl flex align-items-center justify-content-between cursor-pointer transition-all duration-200"
          :class="{ 'active-card': props.stats.currentFilter === 'total' }" @click="filterStatus('total')">
          <div class="flex align-items-center gap-3">
            <img width="64" height="64" src="https://img.icons8.com/bubbles/100/news.png" alt="news" />
            <div>
              <span class="text-400 text-sm font-medium uppercase tracking-wider block">Tous les articles</span>
              <h3 class="text-xl font-bold text-white m-0">Total</h3>
            </div>
          </div>
          <span class="text-3xl font-black text-warning">{{ props.stats.total }}</span>
        </div>
      </div>

      <!-- Articles publiés -->
      <div class="col-12 md:col">
        <div
          class="stat-card p-4 border-round-xl flex align-items-center justify-content-between cursor-pointer transition-all duration-200"
          :class="{ 'active-card': props.stats.currentFilter === 'publies' }" @click="filterStatus('publies')">
          <div class="flex align-items-center gap-3">
            <img width="64" height="64" src="https://img.icons8.com/bubbles/100/edit-file.png" alt="edit-file" />
            <div>
              <span class="text-400 text-sm font-medium uppercase tracking-wider block">Visibles en ligne</span>
              <h3 class="text-xl font-bold text-white m-0">Publiés</h3>
            </div>
          </div>
          <span class="text-3xl font-black text-green-400">{{ props.stats.publies }}</span>
        </div>
      </div>

      <!-- Archives -->
      <div class="col-12 md:col">
        <div
          class="stat-card p-4 border-round-xl flex align-items-center justify-content-between cursor-pointer transition-all duration-200"
          :class="{ 'active-card': props.stats.currentFilter === 'archives' }" @click="filterStatus('archives')">
          <div class="flex align-items-center gap-3">
            <img width="64" height="64" src="https://img.icons8.com/bubbles/100/archive-folder.png"
              alt="archive-folder" />
            <div>
              <span class="text-400 text-sm font-medium uppercase tracking-wider block">Masqués / Masquage</span>
              <h3 class="text-xl font-bold text-white m-0">Archives</h3>
            </div>
          </div>
          <span class="text-3xl font-black text-500">{{ props.stats.archives }}</span>
        </div>
      </div>

    </div>

    <!-- 🔍 BARRE DE RECHERCHE ET BOUTON D'ACTION -->
    <div
      class="flex flex-column sm:flex-row justify-content-between align-items-center gap-3 bg-dark-eval p-3 border-round-xl border-1 border-white-alpha-10">

      <!-- Bouton d'ajout -->
<Button
  label="Ajouter une actualité"
  icon="pi pi-plus-circle"
  severity="warn"
  variant="outlined"
  class="btn-add-actualite w-full sm:w-auto px-4 py-2 gap-3"
  @click="openCreateModal"
/>

      <!-- Champ de recherche PrimeVue -->
      <div
        class="p-input-icon-left w-full sm:w-auto min-w-18rem flex align-items-center gap-4 border-round-xl border-1 border-white-alpha-20 p-2">
        <i class="pi pi-search text-warning" />
        <InputText v-model="localSearchTerm" placeholder="Rechercher une actualité..."
          class="w-full p-inputtext-sm p-inputtext" @input="updateSearch" />
      </div>

    </div>

  </div>
</template>

<style scoped>
/* Cartes de statistiques */
.stat-card {
  background: #2a2e35;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-add-actualite {
  border: 1px solid #ffbb33 !important;
  color: #ffbb33 !important;
  border-radius: 5px;
  background: transparent !important;
  transition: all 0.2s ease;
}

.btn-add-actualite:hover {
  background: rgba(255, 187, 51) !important;
  border-color: #ffbb33 !important;
  color: #070707 !important;
  box-shadow: 0 0 12px rgba(255, 187, 51, 0.2);
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 193, 7, 0.4);
}

/* Carte active sélectionnée */
.active-card {
  border: 1px solid #ffc107 !important;
  background: linear-gradient(135deg, #2a2e35 0%, #353b45 100%);
  box-shadow: 0 0 15px rgba(255, 193, 7, 0.15);
}

/* Arrière-plan du conteneur de recherche */
.bg-dark-eval {
  background: rgba(255, 255, 255, 0.02);
}

.tracking-wider {
  letter-spacing: 0.05em;
}
</style>
