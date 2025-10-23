<script setup>
const emit = defineEmits(['create-actualite']);

function openCreateModal() {
  emit('create-actualite');
}
// import { ref } from 'vue'

// ===============================
// 🔹 ÉTATS & COMMUNICATION
// ===============================
// const activeFiltre = ref('Tous')
// const emit = defineEmits(['filter-selected'])

// ===============================
// 🔹 MÉTHODES
// ===============================
// function selectFilter(filter) {
//   activeFiltre.value = filter
//   emit('filter-selected', filter)
// }
</script>

<template>

  <div class="headerLink w-100 d-flex flex-column my-4 p-3 rounded">

    <!-- 🎯 Bouton d’ajout d’actualité -->
    <div class="headerSearchBtn d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

      <!-- 🎯 Bouton d’ajout d’actualité -->
     <button class="btn btn-outline-warning d-flex align-items-center shadow-sm"
        type="button"
        @click="openCreateModal">
    <i class="pi pi-calendar-plus me-2"></i>
    Ajouter une actualité
</button>

      <!-- 🔍 Champ de recherche -->
      <div class="input-group w-auto" style="min-width: 250px;">
        <span class="input-group-text bg-light border-end-0">
          <i class="pi pi-search text-secondary"></i>
        </span>
        <input type="text" class="form-control border-start-0" placeholder="Rechercher..." aria-label="Search" />
      </div>
    </div>

    <!-- 🧾 Cartes de statistiques -->
    <div class="row row-cols-1 row-cols-md-3 g-4 mb-3 cardsOrganisation">

      <!-- 📰 Total articles -->
      <div class="col">
        <div class="card d-flex align-items-center justify-content-between w-100 p-3 flex-row">
          <div class="d-flex align-items-center gap-3 ">
            <img width="80" height="80" src="https://img.icons8.com/bubbles/100/news.png" alt="news" />
            <h3 class="mb-0">Total articles</h3>
          </div>
          <p class="mb-0 fs-2 fw-bold text-end">250</p>
        </div>
      </div>

      <!-- ✏️ Articles publiés -->
      <div class="col">
        <div class="card d-flex align-items-center justify-content-between w-100 p-3 flex-row">
          <div class="d-flex align-items-center gap-3">
            <img width="80" height="80" src="https://img.icons8.com/bubbles/100/edit-file.png" alt="edit-file" />
            <h3 class="mb-0">Articles publiés</h3>
          </div>
          <p class="mb-0 fs-2 fw-bold text-end">25</p>
        </div>
      </div>
    </div>



  </div>
</template>

<style scoped>
.cardsOrganisation .card {
  background-color: #343a40;
  color: white;
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.cardsOrganisation img {
  flex-shrink: 0;
}

.cardsOrganisation h4 {
  font-size: 1.25rem;
}
</style>
