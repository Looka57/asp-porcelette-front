<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

// ===============================
// 🔹 ÉTATS
// ===============================
const disciplines = ref([])
const isLoading = ref(false)
const errorMessage = ref(null)

// ===============================
// 🔹 CONSTANTES D’API
// ===============================
const API_PATH_DISCIPLINE = '/Discipline'

// ===============================
// 🔹 FONCTIONS
// ===============================
async function fetchDisciplines() {
  try {
    isLoading.value = true
    const response = await api.get(API_PATH_DISCIPLINE)
    disciplines.value = response.data
  } catch (error) {
    console.error('❌ Erreur lors du chargement des disciplines :', error)
    errorMessage.value = "Erreur lors du chargement des disciplines."
  } finally {
    isLoading.value = false
  }
}

// ===============================
// 🔹 ICONES PAR DÉFAUT
// ===============================
const disciplineIcons = {
  1: 'https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-judo-sport-fitness-vol3-microdots-premium-microdot-graphic.png', // Judo
  2: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-aikido-martial-arts-flaticons-lineal-color-flat-icons-3.png', // Aïkido
  3: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-jiu-jitsu-martial-arts-flaticons-lineal-color-flat-icons-3.png', // Jujitsu
  4: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-judo-martial-arts-flaticons-lineal-color-flat-icons-3.png', // Judo détente
}

function getIconUrl(disciplineId) {
  const defaultIcon = 'https://img.icons8.com/color/96/martial-arts.png'
  return disciplineIcons[disciplineId] || defaultIcon
}

// ===============================
// 🔹 MONTAGE
// ===============================
onMounted(fetchDisciplines)
</script>

<template>
  <div class="container-fluid py-4">

    <!-- 🔄 Chargement -->
    <div v-if="isLoading" class="text-center text-light p-4">
      <p>Chargement des disciplines...</p>
    </div>

    <!-- ❌ Erreur -->
    <div v-else-if="errorMessage" class="text-center text-danger p-4">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- ✅ Liste des disciplines -->
    <div v-else class="discipline-grid ">
      <div
        v-for="discipline in disciplines"
        :key="discipline.disciplineId"
        class="discipline-card text-white p-4 rounded d-flex flex-column align-items-center justify-content-center"
      >
        <h3>{{ discipline.nom }}</h3>
        <img
          width="64"
          height="64"
          :src="getIconUrl(discipline.disciplineId)"
          :alt="`Icône ${discipline.nom}`"
        />
        <p class="mt-2 text-justify ">
          {{ discipline.description || 'Aucune description disponible.' }}
        </p>
      </div>
    </div>

    <!-- 🔘 Boutons CRUD -->
    <!-- <div class="boutonCrud m-5 d-flex justify-content-around">
      <div class="crud">
        <button class="btn btn-outline-warning">
          <i class="pi pi-plus-circle me-2"></i> Ajouter
        </button>
      </div>
      <div class="crud">
        <button class="btn btn-outline-info">
          <i class="pi pi-file-edit me-2"></i> Modifier
        </button>
      </div>
      <div class="crud">
        <button class="btn btn-outline-danger">
          <i class="pi pi-trash me-2"></i> Supprimer
        </button>
      </div>
    </div> -->

  </div>
</template>

<style scoped>
/* ======================================================
🎨 STYLE DE LA SECTION DES DISCIPLINES
===================================================== */

.discipline-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  justify-items: center;
  align-items: stretch;
}

.discipline-card {
  background-color: #343a40;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  text-align: center;
}

.discipline-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
