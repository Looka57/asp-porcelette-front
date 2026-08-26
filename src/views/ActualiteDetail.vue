<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/axios';
import PlaceholderImage from '@/assets/img/placeholder-styling.jpg';

const route = useRoute();
const actualite = ref(null);
const isLoading = ref(true);
const errorMessage = ref(null);

const DISCIPLINE_MAPPING = {
  1: 'judo',
  2: 'aikido',
  3: 'jujitsu',
  4: 'judo-detente',
};

async function fetchActualite() {
  const actualiteId = route.params.id;
  if (!actualiteId) {
    errorMessage.value = "Identifiant d'actualité manquant.";
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    const response = await api.get(`/Actualite/${actualiteId}`);

    const data = response.data;
    const disciplineSlug = data.disciplineId
      ? DISCIPLINE_MAPPING[data.disciplineId]?.toLowerCase()
      : (data.discipline ? data.discipline.toLowerCase() : 'unknown');

    actualite.value = {
      ...data,
      discipline: disciplineSlug
    };

  } catch (_error) {
    console.error("Erreur API lors du chargement de l'actualité:", _error);
    errorMessage.value = "Impossible de charger cette actualité ou elle n'existe pas.";
  } finally {
    isLoading.value = false;
  }
}

function getPhotoUrl(photoPath) {
  if (photoPath && typeof photoPath === 'string' && photoPath.startsWith('/')) {
    return photoPath;
  }
  return photoPath;
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
}

// Couleurs dynamiques par discipline
function getDisciplineColor(discipline) {
  switch (discipline) {
    case 'judo': return '#d9534f';       // Rouge
    case 'aikido': return '#31b3d0';     // Bleu Aïkido
    case 'jujitsu': return '#5cb85c';    // Vert
    case 'judo-detente': return '#f0ad4e'; // Jaune / Orange
    default: return '#6c757d';           // Gris
  }
}

const disciplineColor = computed(() => {
  return actualite.value ? getDisciplineColor(actualite.value.discipline) : '#31b3d0';
});

onMounted(fetchActualite);
</script>

<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100 pb-5 pt-navbar">

    <!-- En-tête avec bouton de retour -->
    <div class="container pt-5">
      <router-link to="/actualites" class="btn rounded-pill px-4 py-2 fw-semibold btn-outline-custom-muted mb-4 shadow-sm">
        <i class="bi bi-arrow-left me-2"></i> Retour aux actualités
      </router-link>
    </div>

    <!-- Chargement -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-info-custom mb-3" role="status"></div>
      <p class="m-0 text-muted">Chargement des détails de l'actualité...</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="errorMessage" class="container py-4">
      <div class="alert alert-danger bg-danger bg-opacity-15 text-danger border-0 text-center py-4 rounded-4 shadow">
        {{ errorMessage }}
      </div>
    </div>

    <!-- Contenu de l'Actualité -->
    <div v-else-if="actualite" class="container my-4">
      <div class="row justify-content-center">
        <div class="col-lg-10">

          <div class="card bg-dark-card text-light rounded-4 shadow-lg border-secondary border-opacity-50 p-4 p-md-5">

            <!-- En-tête de l'actualité -->
            <header class="mb-4 pb-4 border-bottom border-secondary border-opacity-50">
              <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <span class="badge text-uppercase px-3 py-2 rounded-pill shadow"
                      :style="{ backgroundColor: disciplineColor, color: (actualite.discipline === 'judo-detente' || actualite.discipline === 'aikido' ? '#1a1d21' : '#fff') }">
                  {{ actualite.discipline }}
                </span>

                <div class="text-light fs-6 fw-medium">
                  <i class="bi bi-calendar-event me-2" :style="{ color: disciplineColor }"></i>
                  Publié le <time :datetime="actualite.dateDePublication" class="text-white fw-semibold">{{ formatDate(actualite.dateDePublication) }}</time>
                </div>
              </div>

              <h1 class="display-5 text-white fw-bold mb-0">
                {{ actualite.titre }}
              </h1>
            </header>

            <!-- Image Principale -->
            <figure class="mb-5 text-center imageDiscipline bg-black bg-opacity-25 rounded-4 p-3 border border-secondary border-opacity-25">
              <img :src="getPhotoUrl(actualite.imageUrl) || PlaceholderImage"
                class="img-fluid rounded-4 shadow object-fit-cover w-100 max-h-500" alt="Image de l'actualité" />
            </figure>

            <!-- Description / Contenu -->
            <article class="actualite-contenu mb-5">
              <p class="lead text-light opacity-85 text-justify">
                {{ actualite.contenu || 'Aucun contenu détaillé fourni pour cette actualité.' }}
              </p>
            </article>

            <!-- Pied de page de la carte -->
            <footer class="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-50">
              <router-link to="/actualites" class="btn rounded-pill px-4 py-2 btn-outline-custom-muted fw-semibold">
                <i class="bi bi-arrow-left me-1"></i> Voir toutes les actualités
              </router-link>

              <span class="text-light fs-8">
                AS Porcelette Arts Martiaux
              </span>
            </footer>

          </div>

        </div>
      </div>
    </div>

    <div v-else class="container py-4">
      <div class="alert alert-dark bg-dark-card text-light border-secondary text-center py-5 rounded-4 shadow">
        <h4>Actualité non trouvée.</h4>
      </div>
    </div>

  </div>
</template>

<style scoped>

.pt-navbar {
  padding-top: 90px !important; /* Ajuste cette valeur selon la hauteur exacte de ta navbar fixe */
}
/* --- DESIGN & CARTES --- */
.bg-dark-card {
  background-color: #1a1d21;
}

.actualite-contenu p {
  line-height: 1.8;
  color: #d1d5db;
  font-size: 1.1rem;
  white-space: pre-line;
}

/* --- IMAGE --- */
.imageDiscipline {
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.max-h-500 {
  max-height: 480px;
  object-fit: cover;
}

/* --- BOUTONS & STYLES --- */
.btn-outline-custom-muted {
  background-color: #1a1d21;
  color: #adb5bd;
  border: 1px solid #343a40;
}

.btn-outline-custom-muted:hover {
  background-color: #2c3034;
  color: #ffffff;
}

.text-info-custom {
  color: #31b3d0 !important;
}

.fs-8 {
  font-size: 0.75rem;
}
</style>
