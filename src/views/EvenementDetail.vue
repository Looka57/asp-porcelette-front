<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/axios';
import PlaceholderImage from '@/assets/img/placeholder-styling.jpg';

const route = useRoute();
const evenement = ref(null);
const isLoading = ref(true);
const errorMessage = ref(null);

const DISCIPLINE_MAPPING = {
  1: 'judo',
  2: 'aikido',
  3: 'jujitsu',
  4: 'judo-detente',
};

const imageDiscipline = {
  1: new URL('@/assets/img/icones/judo.png', import.meta.url).href,
  2: new URL('@/assets/img/icones/aikido.png', import.meta.url).href,
  3: new URL('@/assets/img/icones/jujitsu.png', import.meta.url).href,
  4: new URL('@/assets/img/icones/judo-detente.png', import.meta.url).href
};

function getImageIconDiscipline(disciplineId) {
  return imageDiscipline[disciplineId] || PlaceholderImage;
}

async function fetchEvenement() {
  const evenementId = route.params.id;
  if (!evenementId) {
    errorMessage.value = "Identifiant d'événement manquant.";
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    const response = await api.get(`/Evenement/${evenementId}`);

    // Normalisation de la discipline pour correspondre au design system
    const data = response.data;
    const disciplineSlug = data.disciplineId
      ? DISCIPLINE_MAPPING[data.disciplineId]?.toLowerCase()
      : (data.discipline ? data.discipline.toLowerCase() : 'unknown');

    evenement.value = {
      ...data,
      discipline: disciplineSlug
    };

  } catch (_error) {
    console.error("Erreur API lors du chargement de l'événement:", _error);
    errorMessage.value = "Impossible de charger cet événement ou il n'existe pas.";
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
    case 'judo': return '#d9534f';      // Rouge
    case 'aikido': return '#31b3d0';    // Bleu Aïkido
    case 'jujitsu': return '#5cb85c';    // Vert
    case 'judo-detente': return '#f0ad4e'; // Jaune / Orange
    default: return '#6c757d';          // Gris
  }
}

const disciplineColor = computed(() => {
  return evenement.value ? getDisciplineColor(evenement.value.discipline) : '#31b3d0';
});

onMounted(fetchEvenement);
</script>

<template>
  <!-- Ajout de 'pt-navbar' pour décaler le contenu sous la navbar fixe -->
  <div class="container-fluid p-0 bg-dark text-light min-vh-100 pb-5 pt-navbar">

    <!-- En-tête avec bouton de retour -->
    <div class="container pt-4">
      <router-link to="/evenements" class="btn rounded-pill px-4 py-2 fw-semibold btn-outline-custom-muted shadow-sm">
        <i class="bi bi-arrow-left me-2"></i> Retour aux événements
      </router-link>
    </div>

    <!-- Chargement -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-info-custom mb-3" role="status"></div>
      <p class="m-0 text-muted">Chargement des détails de l'événement...</p>
    </div>

    <!-- Erreur -->
    <div v-else-if="errorMessage" class="container py-4">
      <div class="alert alert-danger bg-danger bg-opacity-15 text-danger border-0 text-center py-4 rounded-4 shadow">
        {{ errorMessage }}
      </div>
    </div>

    <!-- Contenu de l'Événement -->
    <div v-else-if="evenement" class="container my-4">
      <div class="row justify-content-center">
        <div class="col-lg-10">

          <div class="card bg-dark-card text-light rounded-4 shadow-lg border-secondary border-opacity-55 p-4 p-md-5">

            <!-- En-tête de l'événement -->
            <header class="mb-4 pb-4 border-bottom border-secondary border-opacity-50">
              <div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <span class="badge text-uppercase px-3 py-2 rounded-pill shadow"
                      :style="{ backgroundColor: disciplineColor, color: '#fff' }">
                  {{ evenement.discipline }}
                </span>

                <div v-if="evenement.lieu" class="text-info-custom fw-semibold fs-6">
                  <i class="bi bi-geo-alt-fill me-1"></i> {{ evenement.lieu }}
                </div>
              </div>

              <h1 class="display-5 text-white fw-bold mb-3">
                {{ evenement.titre }}
              </h1>

              <div class="d-flex align-items-center text-muted fs-6 fw-medium">
                <i class="bi bi-calendar-event me-2 text-info-custom" :style="{ color: disciplineColor }"></i>
                <span class="text-light">
                  Prévu du : <time :datetime="evenement.dateDebut" class="text-white fw-semibold">{{ formatDate(evenement.dateDebut) }}</time>
                  <template v-if="evenement.dateFin">
                    au <time :datetime="evenement.dateFin" class="text-white fw-semibold">{{ formatDate(evenement.dateFin) }}</time>
                  </template>
                </span>
              </div>
            </header>

            <!-- Image Principale / Icône -->
            <figure class="mb-5 text-center imageDiscipline bg-black bg-opacity-25 rounded-4 p-3 border border-secondary border-opacity-25">
              <img :src="getPhotoUrl(evenement.imageUrl) || getImageIconDiscipline(evenement.disciplineId)"
                class="img-fluid rounded-4 shadow" alt="Image de l'événement" />
            </figure>

            <!-- Description / Contenu -->
            <article class="evenement-contenu mb-5">
              <p class="lead text-light opacity-85 text-justify">
                {{ evenement.description || 'Aucune description détaillée fournie pour cet événement.' }}
              </p>
            </article>

            <!-- Pied de page de la carte -->
            <footer class="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-50">
              <router-link to="/evenements" class="btn rounded-pill px-4 py-2 btn-outline-custom-muted fw-semibold">
                <i class="bi bi-arrow-left me-1"></i> Voir tous les événements
              </router-link>

              <span class="text-muted fs-8">
                AS Porcelette Arts Martiaux
              </span>
            </footer>

          </div>

        </div>
      </div>
    </div>

    <div v-else class="container py-4">
      <div class="alert alert-dark bg-dark-card text-light border-secondary text-center py-5 rounded-4 shadow">
        <h4>Événement non trouvé.</h4>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* --- ESPACEMENT NAVBAR --- */
.pt-navbar {
  padding-top: 90px !important; /* Ajuste cette valeur selon la hauteur exacte de ta navbar fixe */
}

/* --- DESIGN & CARTES --- */
.bg-dark-card {
  background-color: #1a1d21;
}

.evenement-contenu p {
  line-height: 1.8;
  color: #d1d5db;
  font-size: 1.1rem;
  white-space: pre-line;
}

/* --- IMAGE --- */
.imageDiscipline {
  display: flex;
  justify-content: center;
  max-height: 450px;
  overflow: hidden;
}

.imageDiscipline img {
  max-height: 400px;
  width: auto;
  max-width: 100%;
  object-fit: contain;
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
