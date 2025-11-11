<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
// ===============================
// 🔹 ÉTATS
// ===============================
const disciplines = ref([]);
// const actualites = ref([]);
// const evenements = ref([]);

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
    const reponse = await api.get(API_PATH_DISCIPLINE);
    disciplines.value = reponse.data;
    console.log('Discipline chargé', disciplines.value)
  } catch (error) {
    console.error('❌ Erreur lors du chargement des disciplines :', error)
    errorMessage.value = "Erreur lors du chargement des disciplines."
  } finally {
    isLoading.value = false
  }
}

// ===============================
// 🔹 ICONES + TEXTE PAR DÉFAUT
// ===============================
const textDiscipline = {
  1: "Force technique et maîtrise délivre le corps et d'esprit.",
  2: "Harmonie énergie et contrôle de soi.",
  3: "Self-défense complète, adaptabilité et résilience.",
  4: "Entretien du corps et de l'esprit."
}

function getTextDiscipline(disciplineId) {
  return textDiscipline[disciplineId] || "Description non disponible.";
}

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

const imageDiscipline = {
  1: new URL('@/assets/img/judo.png', import.meta.url).href,
  2: new URL('@/assets/img/aikido.png', import.meta.url).href,
  3: new URL('@/assets/img/jujitsu.png', import.meta.url).href,
  4: new URL('@/assets/img/judodetente.png', import.meta.url).href
}

function getimageDiscipline(disciplineId) {
  return imageDiscipline[disciplineId] || "Image non disponible.";
}


function getCardClass(disciplineId) {
  switch (disciplineId) {
    case 1:
      return 'first'; // Judo
    case 2:
      return 'second'; // Aïkido
    case 3:
      return 'third'; // Jujitsu
    case 4:
      return 'quatre'; // Judo détente
    default:
      return '';
  }
}

// ===============================
// 🔹 MONTAGE
// ===============================
onMounted(fetchDisciplines)
</script>

<template>
  <div v-if="isLoading" class="text-center text-light p-4">
    <p>Chargement des disciplines...</p>
  </div>

  <div v-else-if="errorMessage" class="text-center text-danger p-4">
    <p>{{ errorMessage }}</p>
  </div>

  <div v-else class="container-fluid p-0 bg-dark text-light">
    <div class="container-fluid my-5">
      <h2 class="my-4 fs-1 text-center">Nos disciplines</h2>
      <div class="row p-2">
        <div
          v-for="discipline in disciplines"
          :key="discipline.disciplineId"
          class="col-lg-4 col-md-12 col-sm-12 p-0 hero"
          :class="getCardClass(discipline.disciplineId)"
        >
          <img
            :src="getimageDiscipline(discipline.disciplineId)"
            alt="image de la discipline"
            class="image"
          >
          <div class="text"></div>
          <div class="logo">
            <img
              :src="getIconUrl(discipline.disciplineId)"
              alt="icone de la discipline"
            >
          </div>
          <div class="main-text">
            <p>{{ getTextDiscipline(discipline.disciplineId) }}</p>
          </div>
          <div class="btn btn-outline-light hero-btn">
            <a href="#">{{ discipline.nom }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.hero {
  display: block;
  position: relative;
  max-width: 400px;
  height: 400px;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.3);
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px;
  margin-bottom: 30px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}


.hero:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(48, 48, 48, 0.4);
}

.image {
  height: 120%;
  position: absolute;
  top: -22%;
  left: -12%;
  object-position: center;
}

.third .image {
  height: 120%;
  position: absolute;
  top: -15%;
  left: -33%;
  object-position: center;
}

.text {
  background-image: linear-gradient(0deg, #091030, #31b3d0);
  border-radius: 30px;
  position: absolute;
  top: 62%;
  left: -5px;
  height: 65%;
  width: 108%;
  transform: skew(19deg, -9deg);
}

.second .text{
  background-image: linear-gradient(0deg, #091030, #31b3d0);
}

.third .text {
  background-image: linear-gradient(-20deg, #673f08, #e7d25c)
}

.quatre .text {
  background-image: linear-gradient(-20deg, #082d2a, #38ef7d)
}

.first .text {
  background-image: linear-gradient(-20deg, #3a0909, #ef3838)
}

.logo {
  height: 80px;
  width: 80px;
  border-radius: 20px;
  background-color: #fff;
  position: absolute;
  bottom: 25%;
  left: 30px;
  overflow: hidden;
  padding: 5px;
  box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.7);
}

.logo img {
  height: 100%;
}

.main-text {
  position: absolute;
  color: #fff;
  font-weight: 900;
  left: 150px;
  bottom: 22%;
}

.hero-btn {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  border: 2px solid #fff;
  padding: 10px 20px;
  border-radius: 30px;
  text-transform: uppercase;
  font-weight: 600;
  transition: all 0.3s ease;
}

.hero-btn a {
  color: inherit;
  text-decoration: none;
}

.hero-btn:hover {
  background-color: #fff;
  color: #1e2f84;
  /* ou autre couleur selon la carte */
  text-decoration: none;
}
</style>
