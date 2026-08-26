<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import JujitsuCoursView from '@/components/Jujitsu/JujitsuCoursView.vue'
import ActEventJujitsu from '@/components/Jujitsu/ActEventJujitsu.vue'

// ===============================
// 🔹 ÉTATS
// ===============================
const jujitsuDiscipline = ref(null)
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
    const foundJujitsu = allDiscipline.find(d => d.nom === 'Jujitsu')
    if (foundJujitsu) {
      jujitsuDiscipline.value = foundJujitsu
    } else {
      errorMessage.value = "Discipline Jujitsu non trouvée."
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
    <div class="imgBaniereJujitsu">
      <div class="overlay">
        <div class="container text-center">
          <span class="text-uppercase tracking-wider fs-7 fw-bold text-success d-block mb-2">Art Martial & Self-Défense</span>
          <h1 class="display-3 fw-black text-white text-uppercase mb-3">JUJITSU</h1>
          <p class="fs-4 text-light opacity-88 text-uppercase m-0">Le combat intelligent, la technique avant la force.</p>
        </div>
      </div>
    </div>

    <!-- Section Description -->
    <div class="container py-5">
      <div class="defDisciplineCard p-4 p-md-5 rounded-4 bg-dark-card border border-secondary border-opacity-10 shadow-lg">
        <h2 class="text-white fw-bold mb-4 position-relative pb-2 title-underline">Qu'est-ce que le Jujitsu ?</h2>

        <div v-if="isLoading" class="text-center py-4">
          <div class="spinner-border text-success mb-2" role="status"></div>
          <p class="m-0 text-muted fs-6">Chargement de la description...</p>
        </div>

        <div v-else-if="errorMessage" class="alert alert-danger bg-danger bg-opacity-15 text-danger border-0">
          {{ errorMessage }}
        </div>

        <p v-else-if="jujitsuDiscipline" class="fs-5 text-light lh-lg m-0 opacity-90">
          {{ jujitsuDiscipline.description }}
        </p>
      </div>
    </div>

    <!-- Sous-composants -->
    <div class="container-fluid px-0">
      <JujitsuCoursView />
      <ActEventJujitsu />
    </div>
  </div>
</template>

<style scoped>
/* --- BANNIÈRE HERO --- */
.imgBaniereJujitsu {
  position: relative;
  background-image: url('@/assets/img/bannierJujitsu.png');
  background-size: cover;
  background-position: center 20%;
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
  border-left: 6px solid #38ef7d !important; /* Bordure verte caractéristique du Jujitsu */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.bg-dark-card:hover {
  border-color: rgba(56, 239, 125, 0.4) !important;
  box-shadow: 0 16px 35px rgba(0, 0, 0, 0.5);
}

.title-underline::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50px;
  height: 3px;
  background-color: #38ef7d;
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
