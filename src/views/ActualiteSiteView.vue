<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api/axios';
import PlaceholderImage from '@/assets/img/placeholder-styling.jpg';

const actualites = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);
const selectedDiscipline = ref('all');

// Définition de 'aujourd'hui' à minuit pour une comparaison J-J stricte
const today = new Date();
today.setHours(0, 0, 0, 0);

const DISCIPLINE_MAPPING = {
  1: 'judo',
  2: 'aikido',
  3: 'jujitsu',
  4: 'judo-detente',
};

const API_PATH_ACTUALITE = '/Actualite';

// Format date FR
function formatDate(dateString) {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
}

async function fetchActualites() {
  try {
    isLoading.value = true;
    const response = await api.get(API_PATH_ACTUALITE);

    actualites.value = response.data
      .filter(a => a.actualiteId && a.dateDePublication)
      .map(actu => ({
        ...actu,
        disciplineId: actu.user?.disciplineId,
        discipline: actu.user?.disciplineId
          ? DISCIPLINE_MAPPING[actu.user.disciplineId]?.toLowerCase()
          : 'unknown',
      }))
      .sort((a, b) => new Date(b.dateDePublication) - new Date(a.dateDePublication));

  } catch (_error) {
    console.error("Erreur API:", _error);
    errorMessage.value = "Impossible de charger les actualités.";
  } finally {
    isLoading.value = false;
  }
}

// 1. La liste filtrée par DISCIPLINE
const filteredActualites = computed(() => {
  if (selectedDiscipline.value === 'all') return actualites.value;

  return actualites.value.filter(a =>
    a.discipline?.toLowerCase() === selectedDiscipline.value
  );
});

// --- Séparation des Actualités Passées et Futures ---
const actualitesPassees = computed(() => {
  return filteredActualites.value
    .filter(a => new Date(a.dateDePublication) < today)
    .sort((a, b) => new Date(b.dateDePublication) - new Date(a.dateDePublication));
});

const actualitesFutures = computed(() => {
  return filteredActualites.value
    .filter(a => {
      const actuDate = new Date(a.dateDePublication);
      actuDate.setHours(0, 0, 0, 0);
      return actuDate >= today;
    })
    .sort((a, b) => new Date(a.dateDePublication) - new Date(b.dateDePublication));
});

const actualitePrincipale = computed(() => actualitesFutures.value[0]);

const actualitesSecondaires = computed(() => {
  return actualitesPassees.value.slice(0, 4);
});

// ===============================
// 🔹 COULEURS & STYLES DYNAMIQUES
// ===============================
function getDisciplineColor(discipline) {
  switch (discipline) {
    case 'judo': return '#d9534f';       // Rouge
    case 'aikido': return '#31b3d0';     // Bleu Aïkido
    case 'jujitsu': return '#5cb85c';    // Vert
    case 'judo-detente': return '#f0ad4e'; // Jaune / Orange
    default: return '#6c757d';           // Gris
  }
}

function getPhotoUrl(photoPath) {
  if (photoPath && typeof photoPath === 'string' && photoPath.startsWith('/')) {
    return photoPath;
  }
  return photoPath;
}

onMounted(fetchActualites);
</script>

<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100">

    <!-- Bannière profil / actualité -->
    <div class="imgBaniereAikido">
      <div class="overlay">
        <span class="text-uppercase tracking-wider fs-7 fw-bold text-warning d-block mb-2">Informations & Événements</span>
        <h1 class="display-3 text-uppercase text-white fw-black">
          Actualités du Club
        </h1>
        <p class="lead text-light opacity-85 mt-2 mb-0 max-w-700">
          Restez informés des événements à venir et des actualités récentes de l'AS Porcelette Arts Martiaux.
        </p>
      </div>
    </div>

    <!-- Filtres par discipline -->
    <div class="container my-5">
      <div class="d-flex flex-wrap justify-content-center gap-2">
        <button
          :class="['btn rounded-pill px-4 py-2 fw-semibold transition-all', selectedDiscipline === 'all' ? 'btn btn-warning shadow' : 'btn-outline-custom-muted']"
          @click="selectedDiscipline = 'all'">
          Toutes
        </button>
        <button
          :class="['btn rounded-pill px-4 py-2 fw-semibold transition-all', selectedDiscipline === 'judo' ? 'btn-judo shadow' : 'btn-outline-custom-muted']"
          @click="selectedDiscipline = 'judo'">
          Judo
        </button>
        <button
          :class="['btn rounded-pill px-4 py-2 fw-semibold transition-all', selectedDiscipline === 'aikido' ? 'btn-aikido shadow' : 'btn-outline-custom-muted']"
          @click="selectedDiscipline = 'aikido'">
          Aïkido
        </button>
        <button
          :class="['btn rounded-pill px-4 py-2 fw-semibold transition-all', selectedDiscipline === 'jujitsu' ? 'btn-jujitsu shadow' : 'btn-outline-custom-muted']"
          @click="selectedDiscipline = 'jujitsu'">
          Jujitsu
        </button>
        <button
          :class="['btn rounded-pill px-4 py-2 fw-semibold transition-all', selectedDiscipline === 'judo-detente' ? 'btn-judo-detente shadow' : 'btn-outline-custom-muted']"
          @click="selectedDiscipline = 'judo-detente'">
          Judo Détente
        </button>
      </div>
    </div>

    <!-- Chargement & Erreurs -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-info-custom mb-3" role="status"></div>
      <p class="m-0 text-light">Chargement des actualités...</p>
    </div>

    <div v-else-if="errorMessage" class="alert alert-danger bg-danger bg-opacity-15 text-danger border-0 text-center py-4 mx-4">
      {{ errorMessage }}
    </div>

    <div v-else-if="filteredActualites.length === 0" class="container py-4">
      <div class="alert alert-dark bg-dark-card text-light border-secondary text-center py-5 rounded-4 shadow">
        <i class="bi bi-info-circle fs-1 text-info-custom d-block mb-3"></i>
        <h4>Aucune actualité trouvée</h4>
        <p class="text-light mb-0">Aucun article n'est disponible pour cette discipline pour le moment.</p>
      </div>
    </div>

    <!-- Contenu Principal -->
    <div v-else class="container pb-5 mb-5">
      <div class="row g-5">

        <!-- Colonne de Gauche : Actualité à venir -->
        <div class="col-lg-7 mb-4 mb-lg-0">
          <div class="d-flex align-items-center mb-4 pb-2 border-bottom border-secondary opacity-75">
            <h2 class="text-white h3 text-uppercase fw-bold m-0 tracking-wider">
              <i class="bi bi-calendar-check text-info-custom me-2"></i> Événement à venir
            </h2>
          </div>

          <div v-if="actualitePrincipale" class="card bg-dark-card text-light rounded-4 shadow-lg actu-card overflow-hidden"
               :style="{ border: '2px solid ' + getDisciplineColor(actualitePrincipale.discipline) }">
            <div class="card-body p-0 d-flex flex-column">

              <div class="img-wrapper position-relative">
                <img :src="getPhotoUrl(actualitePrincipale.imageUrl) || PlaceholderImage"
                  class="card-img-top object-fit-cover actu-principale-img" :alt="actualitePrincipale.titre" />
                <span class="badge position-absolute top-0 end-m-3 m-3 text-uppercase px-3 py-2 rounded-pill shadow"
                      :style="{ backgroundColor: getDisciplineColor(actualitePrincipale.discipline), color: '#fff' }">
                  {{ actualitePrincipale.discipline }}
                </span>
              </div>

              <div class="p-4 p-md-5 flex-grow-1">
                <div class="d-flex align-items-center text-muted fs-7 fw-bold mb-2">
                  <i class="bi bi-clock me-2 text-info-custom" :style="{ color: getDisciplineColor(actualitePrincipale.discipline) }"></i>
                  Prévu le : {{ formatDate(actualitePrincipale.dateDePublication) }}
                </div>

                <h3 class="card-title text-white fw-bold display-6 mb-3">
                  {{ actualitePrincipale.titre }}
                </h3>

                <p class="card-text text-light opacity-85 description-text mb-4">
                  {{ actualitePrincipale.contenu || 'Description de l’événement à venir...' }}
                </p>

                <router-link :to="`/actualite/${actualitePrincipale.actualiteId}`"
                  class="btn w-100 rounded-pill py-3 fw-bold shadow-sm transition-all text-white"
                  :style="{ backgroundColor: getDisciplineColor(actualitePrincipale.discipline) }">
                  Voir les détails de l'événement <i class="bi bi-arrow-right ms-2"></i>
                </router-link>
              </div>
            </div>
          </div>

          <div v-else class="card bg-dark-card text-center p-5 rounded-4 shadow border-secondary">
            <i class="bi bi-calendar-x display-1 text-muted mb-3"></i>
            <h3 class="text-light h4">Aucun événement à venir</h3>
            <p class="text-light mb-0">De nouvelles dates seront bientôt annoncées.</p>
          </div>
        </div>

        <!-- Colonne de Droite : News récentes / Passées -->
        <div class="col-lg-5">
          <div class="d-flex align-items-center mb-4 pb-2 border-bottom border-secondary opacity-75">
            <h2 class="text-white h3 text-uppercase fw-bold m-0 tracking-wider">
              <i class="bi bi-clock-history text-info-custom me-2"></i> News Récentes
            </h2>
          </div>

          <div v-if="actualitesSecondaires.length > 0">
            <div v-for="actu in actualitesSecondaires" :key="actu.actualiteId"
              class="card bg-dark-card text-light rounded-4 mb-3 shadow-sm actu-secondaire-card overflow-hidden border-secondary border-opacity-50">
              <div class="row g-0 align-items-center">
                <div class="col-4 position-relative h-100">
                  <img :src="getPhotoUrl(actu.imageUrl) || PlaceholderImage"
                    class="img-fluid object-fit-cover w-100 h-100 min-h-120" :alt="actu.titre" />
                </div>
                <div class="col-8">
                  <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <span class="badge fs-8 text-uppercase px-2 py-1 rounded"
                            :style="{ backgroundColor: getDisciplineColor(actu.discipline), color: '#fff' }">
                        {{ actu.discipline }}
                      </span>
                      <small class="text-muted fs-8">{{ formatDate(actu.dateDePublication) }}</small>
                    </div>

                    <h5 class="card-title text-white fw-bold fs-6 mb-2 text-truncate-2">
                      {{ actu.titre }}
                    </h5>

                    <router-link :to="`/actualite/${actu.actualiteId}`"
                      class="btn btn-sm rounded-pill px-3 py-1 fw-bold text-white transition-all"
                      :style="{ backgroundColor: 'transparent', border: '1px solid ' + getDisciplineColor(actu.discipline), color: getDisciplineColor(actu.discipline) }">
                      Lire l'article
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="alert alert-dark bg-dark-card text-light text-center py-4 rounded-4 border-secondary">
            Aucune archive récente trouvée.
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- BANNIÈRE --- */
.imgBaniereAikido {
  position: relative;
  background-image: url('@/assets/img/banniereActualite.png');
  background-size: cover;
  background-position: center 30%;
  width: 100%;
  height: 420px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  text-align: center;
}

.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(26, 29, 33, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
}

/* --- CARTES & DESIGN --- */
.bg-dark-card {
  background-color: #1a1d21;
}

.actu-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.actu-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
}

.actu-principale-img {
  height: 320px;
  width: 100%;
  filter: brightness(0.85);
  transition: filter 0.4s ease;
}

.actu-card:hover .actu-principale-img {
  filter: brightness(1);
}

.description-text {
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* --- CARTES SECONDAIRES --- */
.actu-secondaire-card {
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.actu-secondaire-card:hover {
  transform: translateX(4px);
  background-color: #22262b !important;
}

.min-h-120 {
  min-height: 120px;
  max-height: 140px;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* --- BOUTONS DE FILTRE & STYLES DISCIPLINES --- */
.btn-outline-custom-muted {
  background-color: #1a1d21;
  color: #adb5bd;
  border: 1px solid #343a40;
}

.btn-outline-custom-muted:hover {
  background-color: #2c3034;
  color: #ffffff;
}



.btn-judo {
  background-color: #d9534f !important;
  color: #fff !important;
}

.btn-aikido {
  background-color: #31b3d0 !important;
  color: #1a1d21 !important;
}

.btn-jujitsu {
  background-color: #5cb85c !important;
  color: #fff !important;
}

.btn-judo-detente {
  background-color: #f0ad4e !important;
  color: #1a1d21 !important;
}

/* --- UTILITAIRES --- */
.text-info-custom {
  color: #31b3d0 !important;
}

.tracking-wider {
  letter-spacing: 0.1em;
}

.fw-black {
  font-weight: 900;
}

.fs-7 {
  font-size: 0.8rem;
}

.fs-8 {
  font-size: 0.7rem;
}

.max-w-700 {
  max-width: 700px;
}

@media (max-width: 991px) {
  .imgBaniereAikido {
    height: 350px;
  }
}
</style>
