<script setup>
import { ref } from 'vue'

// ===============================
// 🔹 ÉTATS & COMMUNICATION
// ===============================
const activeFiltre = ref('Tous')
const emit = defineEmits(['filter-selected'])

// ===============================
// 🔹 MÉTHODES
// ===============================
function selectFilter(filter) {
  activeFiltre.value = filter
  emit('filter-selected', filter)
}
</script>

<template>
  <div class="container-fluid">
    <div class="headerLink w-100 d-flex align-items-center my-4 p-3 rounded">
      <!-- Bouton d’ajout d’événement -->
      <button
        class="btn btn-outline-warning d-flex justify-content-center align-items-center mr-5"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#createEvent"
      >
        <i class="pi pi-calendar-plus me-2"></i>
        Ajouter un événement
      </button>

      <!-- Liens de navigation -->
      <ul class="nav mb-0">
        <li
          class="nav-item"
          v-for="filter in ['Tous', 'À venir', 'Judo', 'Judo Détente', 'Aïkido', 'Jujitsu', 'Archives']"
          :key="filter"
        >
          <a
            class="nav-link"
            :class="{ active: activeFiltre === filter }"
            href="#"
            @click.prevent="selectFilter(filter)"
          >
            {{ filter }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
a {
  color: white;
  font-weight: bold;
  position: relative;
  text-decoration: none;
  padding-bottom: 4px;
  transition: color 0.3s ease;
}

a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0%;
  height: 2px;
  background-color: orange;
  transition: width 0.3s ease;
}

/* Animation au survol */
a:hover::after {
  color: white;
  width: 100%;
}

.nav-link:hover,
.nav-link:focus {
  color: orange;
}

/* Lien actif (reste souligné) */
a.active::after {
  color: white;
  width: 100%;
}

a.active {
  color: white;
}
</style>
