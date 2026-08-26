<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

// ===============================
// 🔹 ÉTATS
// ===============================
const evenements = ref([])
const isLoading = ref(true)
const errorMessage = ref(null)

// ===============================
// 🔹 CONSTANTES & MAPPINGS
// ===============================
const API_PATH_EVENEMENT = 'Evenement'

const DISCIPLINE_MAPPING = {
  1: 'judo',
  2: 'aikido',
  3: 'jujitsu',
  4: 'judo-detente',
};

// Couleurs dynamiques par discipline
function getDisciplineColor(disciplineKey) {
  switch (disciplineKey) {
    case 'judo':
    case 1:
      return '#d9534f';       // Rouge
    case 'aikido':
    case 2:
      return '#31b3d0';     // Bleu Aïkido
    case 'jujitsu':
    case 3:
      return '#5cb85c';    // Vert
    case 'judo-detente':
    case 4:
      return '#f0ad4e'; // Jaune / Orange
    default:
      return '#ffc107';           // Défaut (Jaune warning)
  }
}

// ===============================
// 🔹 FONCTIONS DE GESTION DES DONNÉES
// ===============================
async function fetchEvenement() {
  try {
    isLoading.value = true
    const reponse = await api.get(API_PATH_EVENEMENT)
    const evenementsAPI = reponse.data

    const maintenant = new Date()

    const evenementsFuturs = evenementsAPI.filter(event => {
      return event.dateFin && new Date(event.dateFin) >= maintenant
    })

    evenementsFuturs.sort((a, b) => {
      return new Date(a.dateDebut) - new Date(b.dateDebut)
    })

    evenements.value = evenementsFuturs.slice(0, 3)
  } catch (error) {
    console.error('❌ Erreur lors du chargement des événements :', error)
    errorMessage.value = "Erreur lors du chargement des événements."
  } finally {
    isLoading.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return 'Date non spécifiée'
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}

function getIconUrl(disciplineId) {
  const icons = {
    1: 'https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-judo-sport-fitness-vol3-microdots-premium-microdot-graphic.png',
    2: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-aikido-martial-arts-flaticons-lineal-color-flat-icons-3.png',
    3: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-jiu-jitsu-martial-arts-flaticons-lineal-color-flat-icons-3.png',
    4: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-judo-martial-arts-flaticons-lineal-color-flat-icons-3.png',
  }
  return icons[disciplineId] || 'https://img.icons8.com/ios-filled/64/ffffff/star.png'
}

function getDisciplineName(disciplineId) {
  const names = {
    1: 'Judo',
    2: 'Aïkido',
    3: 'Jujitsu',
    4: 'Judo-Détente'
  }
  return names[disciplineId] || 'Événement'
}

onMounted(fetchEvenement)
</script>

<template>
  <div class="container-fluid py-5 bg-dark text-light">
    <div class="container py-3">

      <!-- En-tête de section -->
      <div class="text-center mb-5">
        <span class="text-uppercase tracking-wider fs-7 fw-bold text-warning d-block mb-2">Agenda</span>
        <h3 class="display-3 text-white m-0">Prochains Évènements</h3>
      </div>

      <!-- États de chargement / erreur / vide -->
      <div v-if="isLoading" class="text-center text-light py-5">
        <div class="spinner-border text-warning mb-3" role="status"></div>
        <p class="m-0 text-muted">Chargement des événements...</p>
      </div>

      <div v-else-if="errorMessage" class="text-center text-danger py-5">
        <p class="m-0">{{ errorMessage }}</p>
      </div>

      <div v-else-if="evenements.length === 0" class="text-center text-light py-5">
        <i class="bi bi-calendar-x fs-2 d-block mb-2"></i>
        <p class="m-0">Aucun événement ou actualité à venir pour le moment.</p>
      </div>

      <!-- Grille des événements -->
      <div v-else class="row g-4 justify-content-center">
        <div v-for="evenement in evenements" :key="evenement.evenementId" class="col-lg-4 col-md-6 col-sm-12 d-flex">

          <div class="card event-card w-100 p-4 rounded-4 bg-dark-card border border-secondary border-opacity-10 d-flex flex-column justify-content-between shadow-lg"
               :style="{ '--discipline-color': getDisciplineColor(evenement.disciplineId) }">

            <div class="card-body p-0 d-flex flex-column align-items-center text-center">

              <!-- Icône de discipline avec contour dynamique -->
              <div class="icon-wrapper mb-3 p-2 rounded-3 bg-surface border"
                   :style="{ borderColor: getDisciplineColor(evenement.disciplineId) + '40 !important' }">
                <img width="48" height="48" :src="getIconUrl(evenement.disciplineId)" alt="logo discipline" loading="lazy" />
              </div>

              <!-- Badge coloré selon la discipline -->
              <span class="badge px-3 py-1 rounded-pill fw-semibold fs-7 mb-2 text-uppercase shadow-sm"
                    :style="{ backgroundColor: getDisciplineColor(evenement.disciplineId) + '20', color: getDisciplineColor(evenement.disciplineId) }">
                {{ getDisciplineName(evenement.disciplineId) }} • {{ formatDate(evenement.dateDebut) }}
              </span>

              <h5 class="card-title text-white fw-bold fs-5 mb-2 ellipsis-3">
                {{ evenement.titre || 'Événement' }}
              </h5>

              <p class="card-text text-light fs-6 mb-4 d-flex align-items-center gap-1 ellipsis-3">
                <i class="bi bi-geo-alt-fill" :style="{ color: getDisciplineColor(evenement.disciplineId) }"></i>
                <span>{{ evenement.lieu || 'Pas de lieu disponible.' }}</span>
              </p>
            </div>

            <div class="card-footer bg-transparent border-0 p-0 text-center mt-auto">
              <router-link :to="`/evenement/${evenement.evenementId}`"
                           class="btn w-100 rounded-pill py-2 fw-semibold btn-dynamic-outline">
                Voir le détail
              </router-link>
            </div>

          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.bg-dark-card {
  background-color: #1a1d21;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.bg-surface {
  background-color: #141619;
}

/* Effet de survol avec la couleur dynamique de la discipline */
.event-card:hover {
  transform: translateY(-6px);
  border-color: var(--discipline-color) !important;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.5);
}

/* Bouton dynamique qui s'illumine à la couleur de la discipline au survol */
.btn-dynamic-outline {
  color: var(--discipline-color);
  border: 1px solid var(--discipline-color);
  background-color: transparent;
  transition: all 0.3s ease;
}

.btn-dynamic-outline:hover {
  background-color: var(--discipline-color);
  color: #1a1d21;
  box-shadow: 0 4px 12px var(--discipline-color);
}

.ellipsis-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
}

.tracking-wider {
  letter-spacing: 0.1em;
}

.fs-7 {
  font-size: 0.75rem;
}
</style>
