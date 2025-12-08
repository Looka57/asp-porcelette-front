<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/axios';

// Assurez-vous que le chemin d'accès à l'image par défaut est correct
import PlaceholderImage from '@/assets/img/placeholder-styling.jpg';

const route = useRoute();
const evenement = ref(null);
const isLoading = ref(true);
const errorMessage = ref(null);

// **AJOUT D'OBJETS ET FONCTIONS POUR LES ICÔNES DE DISCIPLINE**


const imageDiscipline = {
  1: new URL('@/assets/img/icones/judo.png', import.meta.url).href,
  2: new URL('@/assets/img//icones/aikido.png', import.meta.url).href,
  3: new URL('@/assets/img//icones/jujitsu.png', import.meta.url).href,
  4: new URL('@/assets/img//icones/judo-detente.png', import.meta.url).href
}

function getImageIconDiscipline(disciplineId) {
  // Utilise l'icône de la discipline si l'ID est valide, sinon l'image par défaut générique
  return imageDiscipline[disciplineId] || PlaceholderImage;
}

// **FIN AJOUT**


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
    // NOTE: L'objet evenement.value doit contenir 'disciplineId' pour que l'icône fonctionne.

  } catch (_error) {
    console.error("Erreur API lors du chargement de l'evenement:", _error);
    errorMessage.value = "Impossible de charger cette evenement ou elle n'existe pas.";
  } finally {
    isLoading.value = false;
  }
}

function getPhotoUrl(photoPath) {
  // L'URL de base n'est plus nécessaire en production derrière Nginx/HTTPS.

  if (photoPath && typeof photoPath === 'string' && photoPath.startsWith('/')) {
    // Si le chemin est déjà relatif (ex: /images/profiles/...), on le retourne directement.
    return photoPath;
  }

  // Retourne le chemin original (soit null, soit une URL complète externe)
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

      <figure class="mb-5 imageDiscipline">
        <img :src="getPhotoUrl(evenement.imageUrl) || getImageIconDiscipline(evenement.disciplineId)"
          class="img-fluid rounded shadow-lg" alt="Image de l'actualité" />
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

.imageDiscipline{
 display: flex;
 justify-content: center;
}

.imageDiscipline img{
      max-height: 500px;
      width: 50%;
      object-fit: cover;
}

.retour {
  margin-top: 100px;
}
</style>
