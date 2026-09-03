<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

// ===============================
// 🔹 ÉTATS
// ===============================
const senseis = ref([])
const isLoading = ref(false)
const errorMessage = ref(null)

// ===============================
// 🔹 CONSTANTES D’API
// ===============================
const API_PATH_USER = 'User/public/senseis'

// ===============================
// 🔹 FONCTIONS
// ===============================
async function fetchSensei() {
  try {
    isLoading.value = true
    const reponse = await api.get(API_PATH_USER)
    senseis.value = reponse.data



  } catch (error) {
    console.error('❌ Erreur lors du chargement des senseis :', error)
    errorMessage.value = "Erreur lors du chargement des senseis."
  } finally {
    isLoading.value = false
  }
}

// ===============================
// 🔹 MAPPAGE DISCIPLINE → COULEUR DE BORDURE
// ===============================
const disciplineBorderMap = {
  1: 'border-judo',    // Judo
  2: 'border-aikido',  // Aïkido
  3: 'border-jujitsu', // Jujitsu
  4: 'border-detente'  // Judo détente
}

const disciplineColorMap = {
  1: '#ef3838',  // Judo
  2: '#31b3d0',  // Aïkido
  3: '#38ef7d',  // Jujitsu
  4: '#e7d25c'   // Judo détente
}

function getDisciplineColor(disciplineId) {
  return disciplineColorMap[disciplineId] || '#ffffff'
}

function getBorderClass(disciplineId) {
  return disciplineBorderMap[disciplineId] || 'border-judo'
}

// ===============================
// 🔹 CONSTRUCTION DE L’URL DE LA PHOTO
// ===============================
function getPhotoUrl(photoPath) {
  if (photoPath && typeof photoPath === 'string' && photoPath.startsWith('/')) {
    return photoPath
  }
  return '/img/default-profile.png'
}

onMounted(fetchSensei)
</script>

<template>
  <div v-if="isLoading" class="text-center text-light py-5">
    <div class="spinner-border text-warning mb-3" role="status"></div>
    <p class="m-0 text-muted">Chargement des Senseis...</p>
  </div>

  <div v-else-if="errorMessage" class="text-center text-danger py-5">
    <p class="m-0">{{ errorMessage }}</p>
  </div>

  <div v-else class="container py-5 text-center">
    <div class="text-center mb-5">
      <span class="text-uppercase tracking-wider fs-7 fw-bold text-warning d-block mb-2">Encadrement</span>
      <h2 class="display-3 text-white m-0">Nos Senseis</h2>
    </div>

    <div class="row g-4 justify-content-center">
      <div v-for="sensei in senseis" :key="sensei.userId" class="col-xl-3 col-lg-4 col-md-6 col-sm-6 teacher-card">
        <div class="sensei-card-wrapper p-3 rounded-4 bg-dark-card border border-secondary border-opacity-10 h-100">

          <div class="sensei-photo-container shadow-md" :class="getBorderClass(sensei.disciplineId)">
            <img :src="getPhotoUrl(sensei.photoUrl)" :alt="'Photo de ' + sensei.prenom + ' ' + sensei.nom"
              :title="sensei.prenom + ' ' + sensei.nom" class="sensei-photo" width="626" height="626" loading="lazy" />
          </div>

          <h3 class="mt-4 mb-1 text-white fs-5 fw-bold">{{ sensei.prenom }} {{ sensei.nom }}</h3>
          <p :style="{ color: getDisciplineColor(sensei.disciplineId) }" class="fs-6 fw-medium m-0">
            {{ sensei.grade || 'Grade non précisé' }}
          </p>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- SECTION SENSEI --- */
.teacher-card {
  transition: transform 0.3s ease;
}

.teacher-card:hover {
  transform: translateY(-6px);
}

.bg-dark-card {
  background-color: #1a1d21;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.teacher-card:hover .bg-dark-card {
  border-color: rgba(255, 193, 7, 0.3) !important;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
}

.sensei-photo-container {
  width: 160px;
  height: 160px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;
}

/* CLASSES DE COULEURS DE BORDURE */
.border-judo {
  border: 4px solid #ef3838;
}

.border-aikido {
  border: 4px solid #31b3d0;
}

.border-jujitsu {
  border: 4px solid #38ef7d;
}

.border-detente {
  border: 4px solid #e7d25c;
}

.sensei-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: grayscale(1);
  transition: filter 0.4s ease, transform 0.4s ease;
}

.teacher-card:hover .sensei-photo {
  filter: grayscale(0);
  transform: scale(1.08);
}

.tracking-wider {
  letter-spacing: 0.1em;
}

.fw-black {
  font-weight: 900;
}

.fs-7 {
  font-size: 0.75rem;
}
</style>
