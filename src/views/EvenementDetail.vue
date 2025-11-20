<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/axios';

import PlaceholderImage from '@/assets/img/placeholder-styling.jpg';

const route = useRoute();
const evenement = ref(null);
const isLoading = ref(true);
const errorMessage = ref(null);

async function fetchEvenement() {
  const evenementId = route.params.id;
  if (!evenementId) {
    errorMessage.value = "Identifiant d'evenement manquant.";
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    const response = await api.get(`/Evenement/${evenementId}`);
    evenement.value = response.data;

  } catch (_error) {
    console.error("Erreur API lors du chargement de l'evenement:", _error);
    errorMessage.value = "Impossible de charger cette evenement ou elle n'existe pas.";
  } finally {
    isLoading.value = false;
  }
}

function getPhotoUrl(photoPath) {
  const baseUrl = 'http://localhost:5067';

  if (photoPath && typeof photoPath === 'string' && photoPath.startsWith('/')) {
    return `${baseUrl}${photoPath}`;
  }
  return null;
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
}

onMounted(fetchEvenement);
</script>
<template>
  <div class="container py-5 bg-dark text-light min-vh-100">

    <div class="mb-4">
      <router-link to="/evenements" class="btn btn-outline-warning btn-sm retour">
        <i class="bi bi-arrow-left"></i> ← Retour aux événements
      </router-link>
    </div>

    <div v-if="isLoading" class="text-center text-warning p-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
      <p>Chargement des détails de l'evenement...</p>
    </div>

    <div v-else-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

    <div v-else-if="evenement">

      <header class="mb-5">
        <h1 class="text-warning display-4">{{ evenement.titre }}</h1>

        <p class="text-light fs-2">Prévu du :
          <time :datetime="evenement.dateDebut">{{ formatDate(evenement.dateDebut) }}</time>
          au
          <time :datetime="evenement.dateDebut">{{ formatDate(evenement.dateFin) }}</time>
        </p>
      </header>

      <figure class="mb-5">
        <img :src="getPhotoUrl(evenement.imageUrl) || PlaceholderImage" class="img-fluid rounded shadow-lg"
          alt="Image de l'actualité" style="max-height: 500px; width: 100%; object-fit: cover;" />
      </figure>

      <article class="evenement-contenu mb-5">
        <p class="lead text-secondary">{{ evenement.description }}</p>
      </article>

      <footer class="text-end">
        <span class="badge bg-danger p-2" v-if="evenement.discipline">
          Discipline: {{ evenement.discipline }}
        </span>
      </footer>

    </div>

    <div v-else class="alert alert-info">
      Evenement non trouvée.
    </div>

  </div>
</template>



<style scoped>
.container {
  max-width: 900px;
}

.evenement-contenu p {
  line-height: 1.8;
  color: #ccc;
  font-size: 1.1rem;
}

.shadow-lg {
  box-shadow: 0 1rem 3rem rgba(220, 53, 69, 0.175) !important;
}

.text-danger {
  color: #dc3545 !important;
}

.retour {
  margin-top: 100px;
}
</style>
