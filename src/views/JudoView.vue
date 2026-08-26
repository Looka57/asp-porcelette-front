<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import JudoCoursView from '@/components/Judo/JudoCoursView.vue'
import ActualitesJudo from '@/components/Judo/ActualiteJudo.vue'

// ===============================
// 🔹 ÉTATS
// ===============================
const judoDiscipline = ref(null)
const isLoading = ref(true)
const errorMessage = ref(null)

// ===============================
// 🔹 CONSTANTES D’API
// ===============================
const API_PATH_DISCIPLINE = 'Discipline'

// ===============================
// 🔹 FONCTIONS
// ===============================
async function fetchDiscipline() {
  try {
    isLoading.value = true
    const reponse = await api.get(API_PATH_DISCIPLINE)
    const allDiscipline = reponse.data
    const foundJudo = allDiscipline.find(d => d.nom === 'Judo')
    if (foundJudo) {
      judoDiscipline.value = foundJudo
    } else {
      errorMessage.value = "Discipline Judo non trouvée."
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement des disciplines :', error)
    errorMessage.value = "Erreur lors du chargement des disciplines."
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchDiscipline)
</script>

<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100">
    <!-- Bannière Hero Modernisée -->
    <div class="imgBaniereJudo">
      <div class="overlay">
        <div class="container text-center">
          <span class="text-uppercase tracking-wider fs-7 fw-bold text-danger d-block mb-2">Art Martial</span>
          <h1 class="display-3 fw-black text-white text-uppercase mb-3">JUDO</h1>
          <p class="fs-4 text-light opacity-88 text-uppercase m-0">Discipline, respect et dépassement de soi.</p>
        </div>
      </div>
    </div>

    <!-- Section Description -->
    <div class="container py-5">
      <div class="defDisciplineCard p-4 p-md-5 rounded-4 bg-dark-card border border-secondary border-opacity-10 shadow-lg">
        <h2 class="text-white fw-bold mb-4 position-relative pb-2 title-underline">Qu'est-ce que le Judo ?</h2>

        <div v-if="isLoading" class="text-center py-4">
          <div class="spinner-border text-danger mb-2" role="status"></div>
          <p class="m-0 text-muted fs-6">Chargement de la description...</p>
        </div>

        <div v-else-if="errorMessage" class="alert alert-danger bg-danger bg-opacity-15 text-danger border-0">
          {{ errorMessage }}
        </div>

        <p v-else-if="judoDiscipline" class="fs-5 text-light lh-lg m-0 opacity-90">
          {{ judoDiscipline.description }}
        </p>
      </div>
    </div>

    <!-- Sous-composants -->
    <div class="container-fluid px-0">
      <JudoCoursView />
      <ActualitesJudo />
    </div>
  </div>
</template>

<style scoped>
/* --- BANNIÈRE HERO --- */
.imgBaniereJudo {
  position: relative;
  background-image: url('@/assets/img/baniereJudo.png');
  background-size: cover;
  background-position: center 15%;
  width: 100%;
  height: 550px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(26, 29, 33, 0.95));
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

/* --- CARTE DE DESCRIPTION --- */
.bg-dark-card {
  background-color: #1a1d21;
  border-left: 6px solid #ef3838 !important; /* Touche de rappel couleur judo à gauche */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.bg-dark-card:hover {
  border-color: rgba(239, 56, 56, 0.4) !important;
  box-shadow: 0 16px 35px rgba(0, 0, 0, 0.5);
}

.title-underline::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50px;
  height: 3px;
  background-color: #ef3838;
  border-radius: 2px;
}

/* --- TYPO & UTILITAIRES --- */
.tracking-wider {
  letter-spacing: 0.15em;
}

.fw-black {
  font-weight: 900;
}

.fs-7 {
  font-size: 0.75rem;
}
</style>
