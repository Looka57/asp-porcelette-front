<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

// ===============================
// 🔹 ÉTATS - ACTUALITÉS
// ===============================
const actualites = ref([])
const isLoadingActu = ref(true)
const errorMessageActu = ref(null)

const API_PATH_ACTUALITES = 'Actualite'

/* Formatage de date */
function formatDate(dateString) {
  if (!dateString) return 'Date non spécifiée'
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}

async function fetchActualites() {
  try {
    isLoadingActu.value = true
    errorMessageActu.value = null

    const reponse = await api.get(API_PATH_ACTUALITES)
    const actuAPI = reponse.data

    if (!Array.isArray(actuAPI)) {
      errorMessageActu.value = "Erreur : données invalides reçues."
      return
    }

    const maintenant = new Date()

    // Filtrer seulement les actualités à venir
    const actuFutures = actuAPI.filter(a =>
      a.dateDePublication && new Date(a.dateDePublication) >= maintenant
    )

    if (actuFutures.length === 0) {
      errorMessageActu.value = "Aucune actualité à venir pour le moment."
      actualites.value = []
      return
    }

    // Trier par date ASC (plus proche en premier)
    actuFutures.sort((a, b) =>
      new Date(a.dateDePublication) - new Date(b.dateDePublication)
    )

    // Limiter à 3 actualités
    actualites.value = actuFutures.slice(0, 3)

  } catch (error) {
    errorMessageActu.value = "Erreur lors du chargement des actualités."
    console.error(error)
  } finally {
    isLoadingActu.value = false
  }
}

// ===============================
// 🔹 ÉTATS - ÉVÉNEMENTS JUDO
// ===============================
const evenements = ref([])
const isLoading = ref(true)
const errorMessage = ref(null)

const API_PATH_EVENEMENT = 'Evenement'
const JUDO_DISCIPLINE_ID = 1

/* Icônes */
const iconMap = {
  1: 'https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-judo-sport-fitness-vol3-microdots-premium-microdot-graphic.png',
  2: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-aikido-martial-arts-flaticons-lineal-color-flat-icons-3.png',
  3: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-jiu-jitsu-martial-arts-flaticons-lineal-color-flat-icons-3.png',
}

function getIconUrl(disciplineId) {
  return iconMap[disciplineId] || 'https://img.icons8.com/color/96/martial-arts.png'
}

async function fetchEvenement() {
  try {
    isLoading.value = true
    errorMessage.value = null

    const reponse = await api.get(API_PATH_EVENEMENT)
    const evenementsAPI = reponse.data
    const maintenant = new Date()
    const evenementsFiltres = evenementsAPI.filter(e =>
      e.disciplineId === JUDO_DISCIPLINE_ID &&
      new Date(e.dateFin) >= maintenant
    )

    if (evenementsFiltres.length === 0) {
      errorMessage.value = "Aucun événement de Judo à venir trouvé."
      evenements.value = []
      return
    }

    evenementsFiltres.sort((a, b) =>
      new Date(a.dateDebut) - new Date(b.dateDebut)
    )

    evenements.value = evenementsFiltres.slice(0, 3)

  } catch (error) {
    errorMessage.value = "Erreur lors du chargement des événements."
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchActualites()
  fetchEvenement()
})
</script>

<template>
  <div class="container-fluid py-5 bg-dark text-light border-top border-secondary border-opacity-10">
    <div class="container py-4">
      <div class="row g-5">

        <!-- Colonne Actualités -->
        <div class="col-lg-6 news-section">
          <div class="text-center mb-5">
            <span class="text-uppercase tracking-wider fs-7 fw-bold text-danger d-block mb-2">Informations</span>
            <h2 class="display-5 text-white m-0">Actualités</h2>
          </div>

          <div v-if="isLoadingActu" class="text-center text-light py-5">
            <div class="spinner-border text-danger mb-3" role="status"></div>
            <p class="m-0 text-muted">Chargement des actualités...</p>
          </div>

          <div v-else-if="errorMessageActu"
            class="alert alert-danger bg-danger bg-opacity-25 text-danger border-0 text-center py-4">
            {{ errorMessageActu }}
          </div>

          <div v-else class="row g-4 justify-content-center">
            <div v-for="actu in actualites" :key="actu.actualiteId" class="col-12">
              <div class="card event-card h-100 shadow-lg border border-secondary border-opacity-10 rounded-4 p-3">
                <div class="card-body d-flex flex-column">

                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="date-text text-danger fw-semibold fs-6">
                      {{ formatDate(actu.dateDePublication) }}
                    </span>
                  </div>

                  <h3 class="card-title text-white fs-5 fw-bold mb-3">
                    {{ actu.titre || 'Actualité' }}
                  </h3>

                  <div class="mb-3 overflow-hidden rounded-3 shadow-sm">
                    <img :src="actu.imageUrl ? actu.imageUrl : '/images/actualites/placeholder-styling.jpg'"
                      alt="Illustration actualité" class="news-image">
                  </div>

                  <p class="card-text text-light opacity-85 description-text text-truncate mb-4">
                    {{ actu.contenu || 'Aucune description disponible.' }}
                  </p>

                  <router-link :to="`/actualite/${actu.actualiteId}`"
                    class="btn btn-outline-danger fw-bold rounded-pill mt-auto align-self-start px-4 py-2">
                    Lire l'actualité
                  </router-link>

                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne Événements -->
        <div class="col-lg-6 events-section border-lg-start border-secondary border-opacity-10 ps-lg-5">
          <div class="text-center mb-5">
            <span class="text-uppercase tracking-wider fs-7 fw-bold text-danger d-block mb-2">Agenda</span>
            <h2 class="display-5 text-white m-0">Événements Judo</h2>
          </div>

          <div v-if="isLoading" class="text-center text-light py-5">
            <div class="spinner-border text-danger mb-3" role="status"></div>
            <p class="m-0 text-muted">Chargement des événements...</p>
          </div>

          <div v-else-if="errorMessage"
            class="alert alert-danger bg-danger bg-opacity-25 text-danger border-0 text-center py-4">
            {{ errorMessage }}
          </div>

          <div v-else class="row g-4 justify-content-center">
            <div v-for="evenement in evenements" :key="evenement.evenementId" class="col-12">
              <div class="card event-card h-100 shadow-lg border border-secondary border-opacity-10 rounded-4 p-3">
                <div class="card-body d-flex flex-column">

                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="date-text text-danger fw-semibold fs-6">
                      {{ formatDate(evenement.dateDebut) }}
                    </span>
                    <div class="discipline-icon-wrapper shadow-sm">
                      <img :src="getIconUrl(evenement.disciplineId)" alt="Discipline Icon" class="discipline-icon">
                    </div>
                  </div>

                  <h3 class="card-title text-white fs-5 fw-bold mb-3">
                    {{ evenement.titre || 'Événement' }}
                  </h3>

                  <p class="card-text text-light opacity-85 description-text mb-4">
                    {{ evenement.description || 'Pas de description disponible.' }}
                  </p>

                  <router-link :to="`/evenement/${evenement.evenementId}`"
                    class="btn btn-outline-danger fw-bold rounded-pill mt-auto align-self-start px-4 py-2">
                    En savoir plus
                  </router-link>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Cartes unifiées (Dark Card style) */
.event-card {
  background-color: #1a1d21;
  color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.4);
  border-color: rgba(239, 56, 56, 0.3) !important;
}

.card-body {
  text-align: left;
}

.date-text {
  font-size: 0.9rem;
}

.discipline-icon-wrapper {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: #2b2e31;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.discipline-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.news-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.4s ease;
}

.event-card:hover .news-image {
  transform: scale(1.03);
}

.description-text {
  font-size: 0.95rem;
  line-height: 1.5;
}

.tracking-wider {
  letter-spacing: 0.15em;
}

.fs-7 {
  font-size: 0.75rem;
}

/* Responsive pour la bordure de séparation */
@media (max-width: 991.98px) {
  .events-section {
    border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-left: none !important;
    padding-top: 3rem;
    padding-left: 0 !important;
    margin-top: 1rem;
  }
}
</style>
