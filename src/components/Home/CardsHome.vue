<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const disciplines = ref([])
const isLoading = ref(false)
const errorMessage = ref(null)

const API_PATH_DISCIPLINE = '/Discipline'

async function fetchDisciplines() {
  try {
    isLoading.value = true
    const reponse = await api.get(API_PATH_DISCIPLINE)
    disciplines.value = reponse.data
  } catch (error) {
    console.error('❌ Erreur lors du chargement des disciplines :', error)
    errorMessage.value = "Erreur lors du chargement des disciplines."
  } finally {
    isLoading.value = false
  }
}

const textDiscipline = {
  1: "Force technique délivre le corps et l'esprit.",
  2: "Harmonie, énergie et contrôle de soi.",
  3: "Self-défense, maitrise, stratégie et puissance.",
  4: "Entretien du corps complet et de l'esprit."
}

function getTextDiscipline(disciplineId) {
  return textDiscipline[disciplineId] || "Description non disponible."
}

const disciplineIcons = {
  1: 'https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-judo-sport-fitness-vol3-microdots-premium-microdot-graphic.png',
  2: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-aikido-martial-arts-flaticons-lineal-color-flat-icons-3.png',
  3: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-jiu-jitsu-martial-arts-flaticons-lineal-color-flat-icons-3.png',
  4: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-judo-martial-arts-flaticons-lineal-color-flat-icons-3.png',
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
  return imageDiscipline[disciplineId] || "Image non disponible."
}

function getCardClass(disciplineId) {
  switch (disciplineId) {
    case 1: return 'first'
    case 2: return 'second'
    case 3: return 'third'
    case 4: return 'quatre'
    default: return ''
  }
}

onMounted(fetchDisciplines)
</script>

<template>
  <div v-if="isLoading" class="text-center text-light py-5">
    <div class="spinner-border text-warning mb-3" role="status"></div>
    <p class="m-0 text-muted">Chargement des disciplines...</p>
  </div>

  <div v-else-if="errorMessage" class="text-center text-danger py-5">
    <p class="m-0">{{ errorMessage }}</p>
  </div>

  <div v-else class="container-fluid py-5 bg-dark text-light">
    <div class="container py-3">
      <div class="text-center mb-5">
        <span class="text-uppercase tracking-wider fs-7 fw-bold text-warning d-block mb-2">Nos pratiques</span>
        <h2 class="display-3 text-white m-0">Découvrez nos disciplines</h2>
      </div>

      <div class="row g-4 justify-content-center">
        <div v-for="discipline in disciplines" :key="discipline.disciplineId"
          class="col-xl-3 col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center">

          <div class="hero shadow-lg" :class="getCardClass(discipline.disciplineId)">
            <img :src="getimageDiscipline(discipline.disciplineId)" :alt="'Image ' + discipline.nom"
              :title="discipline.nom" class="image" loading="lazy">

            <div class="text"></div>

            <div class="logo shadow-md">
              <img :src="getIconUrl(discipline.disciplineId)" alt="icone de la discipline" :title="discipline.nom" loading="lazy">
            </div>

            <div class="main-text">
              <p class="m-0 text-sm lh-sm">{{ getTextDiscipline(discipline.disciplineId) }}</p>
            </div>

            <router-link :to="
              '/' + discipline.nom
                .toLowerCase()
                .replace('ï', 'i')
                .replace('é', 'e')
                .replace(/ /g, '-')
            " class="btn btn-outline-light hero-btn">
              {{ discipline.nom }}
            </router-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  display: block;
  position: relative;
  width: 100%;
  height: 420px;
  border-radius: 24px;
  overflow: hidden;
  background-color: #1a1d21;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hero:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 193, 7, 0.3);
}

.image {
  height: 120%;
  width: 130%;
  object-fit: cover;
  position: absolute;
  top: -15%;
  left: -15%;
  object-position: center;
  transition: transform 0.5s ease, object-position 0.3s ease;
}

.hero:hover .image {
  transform: scale(1.05);
}

.third .image {
  top: -10%;
  left: -25%;
}

/* Ajustement pour voir l'homme sur la photo Judo Détente (Discipline 4) */
.quatre .image {
  object-position: 25% center;
}

.text {
  border-radius: 24px;
  position: absolute;
  top: 58%;
  left: -5px;
  height: 70%;
  width: 110%;
  transform: skew(19deg, -9deg);
  opacity: 0.95;
}

.first .text {
  background-image: linear-gradient(-20deg, #3a0909, #ef3838);
}

.second .text {
  background-image: linear-gradient(0deg, #091030, #31b3d0);
}

.third .text {
  background-image: linear-gradient(-20deg, #673f08, #38ef7d);
}

.quatre .text {
  background-image: linear-gradient(-20deg, #082d2a, #e7d25c);
}




.logo {
  height: 64px;
  width: 64px;
  border-radius: 16px;
  background-color: #ffffff;
  position: absolute;
  bottom: 24%;
  left: 24px;
  overflow: hidden;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  z-index: 2;
}

.logo img {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.main-text {
  position: absolute;
  color: #fff;
  font-weight: 700;
  left: 104px;
  right: 20px;
  bottom: 23%;
  font-size: 0.85rem;
  z-index: 2;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.hero-btn {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.8);
  padding: 8px 24px;
  border-radius: 50px;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  text-decoration: none;
  z-index: 2;
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  white-space: nowrap;
}

.hero-btn:hover {
  background-color: #fff;
  color: #1a1d21;
  border-color: #fff;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
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

@media (max-width: 767.98px) {
  .hero {
    max-width: 100%;
  }
}
</style>
