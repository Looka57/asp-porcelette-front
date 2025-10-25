<script setup>
import { ref } from 'vue';

/* -------------------------------------------------------------------------- */
/* 🎯 PROPS ET EMITS */
/* -------------------------------------------------------------------------- */
const props = defineProps({
    // stats contient le nombre total d'articles, le nombre d'articles publiés, d'archives,
    // et la catégorie actuellement sélectionnée (currentFilter)
    stats: {
        type: Object,
        default: () => ({ total: 0, publies: 0, archives: 0, currentFilter: 'total' })
    }
});

// Définition des événements émis vers le parent
const emit = defineEmits([
    'create-actualite',  // Événement pour ouvrir la modale de création d'article
    'search-updated',    // Événement pour transmettre la valeur du champ de recherche
    'filter-status'      // Événement pour transmettre le filtre choisi (total, publies, archives)
]);

/* -------------------------------------------------------------------------- */
/* 💾 VARIABLES LOCALES RÉACTIVES */
/* -------------------------------------------------------------------------- */
const localSearchTerm = ref(''); // Stocke la valeur saisie dans le champ de recherche localement

/* -------------------------------------------------------------------------- */
/* 🧭 FONCTIONS DE GESTION */
/* -------------------------------------------------------------------------- */

// Fonction pour ouvrir la modale de création d'actualité
function openCreateModal() {
  emit('create-actualite');
}

// Fonction appelée à chaque saisie dans le champ de recherche
function updateSearch() {
  emit('search-updated', localSearchTerm.value);
}

// Fonction appelée lors du clic sur l'un des filtres (Total / Publiés / Archives)
function filterStatus(status) {
  emit('filter-status', status);
}
</script>

<template>
  <div class="headerLink ">
    <!-- ====================================================== -->
    <!-- 🎴 CARDS DE FILTRAGE ET STATISTIQUES DES ARTICLES -->
    <!-- ====================================================== -->
    <div class="row row-cols-1 row-cols-md-3 g-4 mb-5 cardsOrganisation">

      <!-- Total articles -->
      <div class="col">
        <div
          class="card d-flex align-items-center justify-content-between w-100 p-3 flex-row"
          :class="{ 'border-warning border-3': props.stats.currentFilter === 'total' }"
          @click="filterStatus('total')"
        >
          <div class="d-flex align-items-center gap-3">
            <img width="80" height="80" src="https://img.icons8.com/bubbles/100/news.png" alt="news" />
            <h3 class="mb-0">Total articles</h3>
          </div>
          <p class="mb-0 fs-2 fw-bold text-end">{{ props.stats.total }}</p>
        </div>
      </div>

      <!-- Articles publiés -->
      <div class="col">
        <div
          class="card d-flex align-items-center justify-content-between w-100 p-3 flex-row"
          :class="{ 'border-warning border-3': props.stats.currentFilter === 'publies' }"
          @click="filterStatus('publies')"
        >
          <div class="d-flex align-items-center gap-3">
            <img width="80" height="80" src="https://img.icons8.com/bubbles/100/edit-file.png" alt="edit-file" />
            <h3 class="mb-0">Articles publiés</h3>
          </div>
          <p class="mb-0 fs-2 fw-bold text-end">{{ props.stats.publies }}</p>
        </div>
      </div>

      <!-- Archives -->
      <div class="col">
        <div
          class="card d-flex align-items-center justify-content-between w-100 p-3 flex-row"
          :class="{ 'border-warning border-3': props.stats.currentFilter === 'archives' }"
          @click="filterStatus('archives')"  
        >
          <div class="d-flex align-items-center gap-3">
            <img width="80" height="80" src="https://img.icons8.com/bubbles/100/archive-folder.png" alt="archive-folder"/>
            <h3 class="mb-0">Archives</h3>
          </div>
          <p class="mb-0 fs-2 fw-bold text-end">{{ props.stats.archives }}</p>
        </div>
      </div>

    </div>

    <!-- ====================================================== -->
    <!-- 🔍 BARRE DE RECHERCHE ET BOUTON AJOUT -->
    <!-- ====================================================== -->
    <div class="headerSearchBtn d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

      <!-- Bouton pour créer une nouvelle actualité -->
      <button class="btn btn-outline-warning d-flex align-items-center shadow-sm" type="button"
        @click="openCreateModal">
        <i class="pi pi-calendar-plus me-2"></i>
        Ajouter une actualité
      </button>

      <!-- Champ de recherche -->
      <div class="input-group w-auto" style="min-width: 250px;">
        <span class="input-group-text bg-light border-end-0">
          <i class="pi pi-search text-secondary"></i>
        </span>
        <input type="text" class="form-control border-start-0" placeholder="Rechercher..."
          v-model="localSearchTerm" @input="updateSearch" />
      </div>

    </div>
  </div>
</template>

<style scoped>
/* ===================================================== */
/* 🎨 STYLE DES CARDS DE FILTRAGE */
/* ===================================================== */
.cardsOrganisation .card {
  background-color: #343a40;
  color: white;
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: transform 0.15s ease;
}
.cardsOrganisation .card:hover {
  transform: translateY(-3px);
}
</style>
