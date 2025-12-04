<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'


/* ===============================
🔹 ACTUALITÉS
 =============================== */
const actualites = ref([]);
const isLoadingActu = ref(true);
const errorMessageActu = ref(null);

const API_PATH_ACTUALITES = 'Actualite';

/* Formatage de date */
function formatDate(dateString) {
  if (!dateString) return 'Date non spécifiée';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}

async function fetchActualites() {
  try {
    isLoadingActu.value = true;
    errorMessageActu.value = null;

    // Utilisation de 'api' pour l'appel à l'API
    const reponse = await api.get(API_PATH_ACTUALITES);
    const actuAPI = reponse.data;


    if (!Array.isArray(actuAPI)) {
      errorMessageActu.value = "Erreur : données invalides reçues.";
      return;
    }

    const maintenant = new Date();

    // 🔥 Filtrer seulement les actualités à venir
    const actuFutures = actuAPI.filter(a =>
      a.dateDePublication && new Date(a.dateDePublication) >= maintenant
    );

    if (actuFutures.length === 0) {
      errorMessageActu.value = "Aucune actualité à venir pour le moment.";
      actualites.value = [];
      return;
    }

    // Trier par date ASC (plus proche en premier)
    actuFutures.sort((a, b) =>
      new Date(a.dateDePublication) - new Date(b.dateDePublication)
    );

    // Limiter à 3 actualités
    actualites.value = actuFutures.slice(0, 3);

  } catch (error) {
    errorMessageActu.value = "Erreur lors du chargement des actualités.";
    console.error(error);
  } finally {
    isLoadingActu.value = false;
  }
}


/* ===============================
 🔹 ÉVÉNEMENTS JUDO
 =============================== */

const evenements = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);

const API_PATH_EVENEMENT = 'Evenement';
const JUDO_DISCIPLINE_ID = 1;

/* Icônes */
const iconMap = {
  1: 'https://placehold.co/50x50/ffc107/343a40?text=JD',
  2: 'https://placehold.co/50x50/ffc107/343a40?text=AK',
  3: 'https://placehold.co/50x50/ffc107/343a40?text=JT',
};

function getIconUrl(disciplineId) {
  return iconMap[disciplineId] || 'https://placehold.co/50x50/cccccc/343a40?text=N/A';
}

async function fetchEvenement() {
  try {
    isLoading.value = true;
    errorMessage.value = null;

    const reponse = await api.get(API_PATH_EVENEMENT);
    const evenementsAPI = reponse.data;
    const maintenant = new Date();
    const evenementsFiltres = evenementsAPI.filter(e =>
      e.disciplineId === JUDO_DISCIPLINE_ID &&
      new Date(e.dateDebut) >= maintenant
    );

    if (evenementsFiltres.length === 0) {
      errorMessage.value = "Aucun événement de Judo à venir trouvé.";
      evenements.value = [];
      return;
    }

    evenementsFiltres.sort((a, b) =>
      new Date(a.dateDebut) - new Date(b.dateDebut)
    );

    evenements.value = evenementsFiltres.slice(0, 3);

  } catch (error) {
    errorMessage.value = "Erreur lors du chargement des événements.";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchActualites();
  fetchEvenement();
});
</script>


<template>
  <div class="container-fluid mt-5 bg-dark text-light min-vh-100 p-4">
    <div class="row">
      <!-- Colonne Actualités -->
      <div class="col-lg-6 col-md-6 col-sm-12 p-3 news-section">
        <h2 class="text-center text-warning mb-5 display-5">Actualités</h2>

        <div v-if="isLoadingActu" class="text-center text-light p-4">
          Chargement des actualités... 🔄
        </div>

        <div v-else-if="errorMessageActu" class="text-center text-danger p-4">
          {{ errorMessageActu }}
        </div>

        <div v-else-if="actualites.length === 0" class="text-center text-secondary p-4">
          Aucune actualité n’a encore été publiée. Restez a l'affut !
        </div>

        <div v-else class="row g-4 justify-content-center">
          <div v-for="actu in actualites" :key="actu.actualiteId" class="col-lg-4 col-md-12 col-sm-12">
            <div class="card event-card h-100 shadow-lg">
              <div class="card-body">

                <p class="date-text mb-2">
                  {{ formatDate(actu.dateDePublication) }}
                </p>

                <h5 class="card-title text-warning">
                  {{ actu.titre || 'Actualité' }}
                </h5>

                <p class="card-text text-light description-text text-truncate">
                  {{ actu.contenu || 'Aucune description disponible.' }}
                </p>

                <img :src="actu.imageUrl
                  ? `http://localhost:5070${actu.imageUrl}`
                  : 'http://localhost:5070/images/actualites/placeholder-styling.jpg'" alt="Événement"
                  class="news-image mb-3">
                <router-link :to="`/actualite/${actu.actualiteId}`" class="btn btn-danger fw-bold">
                  Lire l'actualité
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- Colonne Événements -->
      <div class="col-lg-6 col-md-6 col-sm-12 p-3 events-section border-start border-secondary">
        <h2 class="text-center text-warning mb-5 display-5">Évènements de Judo à Venir</h2>
        <div v-if="isLoading" class="text-center text-light p-4">
          Chargement des événements... 🔄
        </div>
        <div v-else-if="errorMessage" class="text-center text-danger p-4">
          {{ errorMessage }}
        </div>
        <div v-else-if="evenements.length === 0" class="text-center text-secondary p-4">
          Aucun évènement de Judo à venir n'est planifié. Restez à l'affût !
        </div>

        <div v-else class="row cards g-4 justify-content-center">
          <div v-for="evenement in evenements" :key="evenement.evenementId" class="col-12">
            <div class="card event-card h-100 shadow-lg">
              <div class="card-body">
                <!-- Date et Discipline -->
                <div class="d-flex justify-content-between align-items-center mb-3 w-100">
                  <p class="date-text mb-0">{{ formatDate(evenement.dateDebut) }}</p>
                  <img :src="getIconUrl(evenement.disciplineId)" alt="Discipline Icon" class="discipline-icon">
                </div>

                <!-- Titre et Description -->
                <h5 class="card-title text-warning">{{ evenement.titre || 'Evénement' }}</h5>
                <p class="card-text text-light description-text">{{ evenement.description || 'Pas de description disponible.' }}</p>

                <!-- Bouton -->
                <router-link :to="`/evenement/${evenement.evenementId}`"
                  class="btn btn-danger fw-bold mt-auto stretched-link">
                  Lire l'actualité
                </router-link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Conteneur principal */
.container-fluid {
  padding-top: 40px;
  padding-bottom: 40px;
}

/* Sections */
.events-section {
  /* Style pour séparer la section Événements des Actualités */
  padding-left: 30px;
}

/* Cartes des événements */
.event-card {
  background-color: #2b2e31;
  /* Un peu plus clair que le fond dark */
  color: white;
  border: 1px solid #495057;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}

.card-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-align: left;
}

.date-text {
  font-weight: 600;
  color: #ced4da;
  /* Gris clair pour la date */
  font-size: 0.95rem;
}

.discipline-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  /* Ajoutez des styles spécifiques si vos icônes sont des logos */
}

.card-title {
  font-weight: 700;
  font-size: 1.3rem;
}

.news-image {
width: 100%;
height: 200px;
object-fit: cover;
border-radius: 6px;
}


.description-text {
  flex-grow: 1;
  /* Permet à la description de prendre tout l'espace avant le bouton */
  margin-bottom: 15px;
  font-size: 0.9rem;
}



/* Responsive pour la bordure de séparation */
@media (max-width: 991px) {

  /* Pour les écrans < lg */
  .events-section {
    border-top: 1px solid #495057 !important;
    border-left: none !important;
    margin-top: 30px;
  }
}
</style>
