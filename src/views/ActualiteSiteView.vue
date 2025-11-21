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
      // 1. S'assurer que les clés critiques existent
      .filter(a => a.actualiteId && a.dateDePublication)

      // 2. MAPPING : Ajouter la disciplineId et le nom au niveau racine via l'objet user
      .map(actu => ({
        ...actu,
        disciplineId: actu.user?.disciplineId,
        discipline: actu.user?.disciplineId
          ? DISCIPLINE_MAPPING[actu.user.disciplineId]?.toLowerCase()
          : 'unknown',
      }))

      // 3. Trier par date de publication décroissante par défaut (la plus récente d'abord)
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

// --- Séparation des Actualités Passées et Futures au sein du filtre de discipline ---

// Liste des actualités Passées (DateDePublication < Aujourd'hui)
const actualitesPassees = computed(() => {
  return filteredActualites.value
    .filter(a => new Date(a.dateDePublication) < today)
    .sort((a, b) => new Date(b.dateDePublication) - new Date(a.dateDePublication));
});

// Liste des actualités Futures (DateDePublication >= Aujourd'hui), triées de la plus proche à la plus éloignée
const actualitesFutures = computed(() => {
  return filteredActualites.value
    .filter(a => {
      // Rendre la date de l'actualité 'J-J' pour la comparaison
      const actuDate = new Date(a.dateDePublication);
      actuDate.setHours(0, 0, 0, 0);
      return actuDate >= today;
    })
    .sort((a, b) => new Date(a.dateDePublication) - new Date(b.dateDePublication));
});


// 2. À la une (Le prochain événement de la discipline sélectionnée)
const actualitePrincipale = computed(() => actualitesFutures.value[0]);

// 3. Actus secondaires (4 max - Les 4 actualités passées les plus récentes)
const actualitesSecondaires = computed(() => {
  // On prend les 4 premières actualités passées
  return actualitesPassees.value.slice(0, 4);
});


// ===============================
// 🔹 CONSTRUCTION DE L’URL DE LA PHOTO
// ===============================
function getPhotoUrl(photoPath) {
  const baseUrl = 'http://localhost:5067';

  if (photoPath && typeof photoPath === 'string' && photoPath.startsWith('/')) {
    return `${baseUrl}${photoPath}`;
  }
  return null;
}


function getBadgeClass(discipline) {
  switch (discipline) {
    case 'judo':
      return 'badge-judo';
    case 'aikido':
      return 'badge-aikido';
    case 'jujitsu':
      return 'badge-jujitsu';
    case 'judo-detente':
      return 'badge-judo-detente';
    default:
      return 'badge-unknown';
  }
}


function getButtonClass(discipline) {
  switch (discipline) {
    case 'judo':
      return 'btn-outline-judo';
    case 'aikido':
      return 'btn-outline-aikido';
    case 'jujitsu':
      return 'btn-outline-jujitsu';
    case 'judo-detente':
      return 'btn-outline-judo-detente';
    default:
      return 'btn-outline-unknown';
  }
}


onMounted(fetchActualites);
</script>

<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100">
    <div class="imgBaniereJudo">
      <div class="overlay">
        <h1 class="display-3 text-white text-center">ACTUALITÉS DU CLUB</h1>
        <p class="lead text-white text-center mb-4">
          Restez informés des événements à venir et des nouvelles récentes de l'ASP Porcelette.
        </p>
      </div>
    </div>
<div class="text-center my-5">
    <div class="d-flex flex-wrap justify-content-center gap-2">
        <button
            :class="['btn btn-lg', selectedDiscipline === 'all' ? 'btn-warning text-dark' : 'btn-outline-warning']"
            @click="selectedDiscipline = 'all'">Toutes</button>
        <button
            :class="['btn btn-lg', selectedDiscipline === 'judo' ? 'btn-warning text-dark' : 'btn-outline-warning']"
            @click="selectedDiscipline = 'judo'">Judo</button>
        <button
            :class="['btn btn-lg', selectedDiscipline === 'aikido' ? 'btn-warning text-dark' : 'btn-outline-warning']"
            @click="selectedDiscipline = 'aikido'">Aïkido</button>
        <button
            :class="['btn btn-lg', selectedDiscipline === 'jujitsu' ? 'btn-warning text-dark' : 'btn-outline-warning']"
            @click="selectedDiscipline = 'jujitsu'">Jujitsu</button>
        <button
            :class="['btn btn-lg', selectedDiscipline === 'judo-detente' ? 'btn-warning text-dark' : 'btn-outline-warning']"
            @click="selectedDiscipline = 'judo-detente'">Judo Détente</button>
    </div>
</div>

    <div v-if="isLoading" class="text-center text-danger p-5">
      <div class="spinner-border text-warning" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
      <p>Chargement des actualités...</p>
    </div>
    <div v-else-if="errorMessage" class="alert alert-danger mx-5">{{ errorMessage }}</div>

    <div v-else-if="filteredActualites.length === 0" class="alert alert-info mx-5 text-center">
      Aucune actualité trouvée pour cette discipline.
    </div>

    <div v-else class="container-fluid p-5 my-5">
      <div class="row g-5">

        <div class="col-lg-7 mb-4 mb-lg-0">
          <h2 class="text-warning border-bottom border-danger pb-2 mb-4 display-5">
            <i class="pi pi-calendar-check-fill"></i> ACTUALITE À VENIR
          </h2>

          <div v-if="actualitePrincipale" class="card bg-dark border-secondary shadow-lg actu-principale-card">
            <div class="card-body p-0 d-flex flex-column">
              <img :src="getPhotoUrl(actualitePrincipale.imageUrl) || PlaceholderImage"
                class="card-img-top object-fit-cover actu-principale-img" :alt="actualitePrincipale.titre" />

              <div class="p-4 flex-grow-1">
                <span :class="['badge mb-2', getBadgeClass(actualitePrincipale.discipline)]">
                  {{ actualitePrincipale.discipline }}
                </span>
                <h3 class="card-title text-warning mb-2 display-6">
                  {{ actualitePrincipale.titre }}
                </h3>
                <p class="text-light small mb-3 fw-bold">
                  Prévu le : {{ formatDate(actualitePrincipale.dateDePublication) }}
                </p>

                <p class="card-text text-light description-text mb-4">
                  {{ actualitePrincipale.contenu || 'Description de l’événement à venir...' }}
                </p>

                <router-link :to="`/actualite/${actualitePrincipale.actualiteId}`"
                  :class="['btn btn-lg w-100 fw-bold', getButtonClass(actualitePrincipale.discipline)]">
                  Voir les détails de l'événement
                </router-link>
              </div>
            </div>
          </div>

          <div v-else class="card bg-dark border-secondary text-center p-5">
            <i class="pi pi-info-circle-fill text-warning display-1 mb-3"></i>

            <img :src="PlaceholderImage" class="w-100 mb-3 rounded" alt="Événement" />

            <h3 class="text-light mt-3">Aucune actualité à venir.</h3>
            <p class="text-light">
              De nouvelles actualités seront bientôt disponibles.
            </p>
          </div>
        </div>


        <div class="col-lg-5">
          <h2 class="text-warning border-bottom border-danger pb-2 mb-4 display-5">
            <i class="bi bi-clock-history"></i> NEWS RÉCENTES
          </h2>

          <div v-for="actu in actualitesSecondaires" :key="actu.actualiteId"
            class="card bg-dark border-secondary mb-3 shadow-sm actu-secondaire-card">
            <div class="row g-0 align-items-center">
              <div class="col-5 actu-secondaire-img-container">
                <img :src="getPhotoUrl(actu.imageUrl) || PlaceholderImage"
                  class="img-fluid rounded-start object-fit-cover w-100 h-100 actu-secondaire-img" :alt="actu.titre" />
              </div>
              <div class="col-7">
                <div class="card-body p-3">
                  <span :class="['badge mb-1', getBadgeClass(actu.discipline)]">
                    {{ actu.discipline }}
                  </span>
                  <h5 class="card-title text-light actu-secondaire-title">{{ actu.titre }}</h5>
                  <p class="card-text text-light small mb-2">{{ formatDate(actu.dateDePublication) }}</p>
                  <router-link :to="`/actualite/${actu.actualiteId}`"
                    :class="['btn btn-outline', 'btn-sm', getButtonClass(actu.discipline)]">
                    Lire l'article
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <div v-if="actualitesSecondaires.length === 0 && actualitePrincipale"
            class="alert alert-secondary text-center">
            Aucune archive d'actualité trouvée pour cette discipline.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- BANNIÈRE --- */
.imgBaniereJudo {
  background-image: url('@/assets/img/banniereActualite.png');
  /* Utilisez votre image */
  background-size: cover;
  background-position: center 30%;
  width: 100%;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  color: white;
  text-align: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65);
  /* Overlay sombre plus prononcé */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
}

.overlay h1 {
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 2px 2px 4px #000;
}




.text-center.my-5 button {
  transition: all 0.3s ease;
  border-radius: 50px;
  font-weight: 600;
}

.btn-outline-warning {
  color: #ffc107;
  border-color: #ffc107;
}

.btn-outline-warning:hover {
  color: #212529 !important;
  background-color: #ffc107;
}

/* --- CARTES GÉNÉRALES --- */
.card.bg-dark {
  background-color: #1a1a1a !important;
  border: 1px solid #333 !important;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
}

.card .badge {
  text-transform: uppercase;
  font-weight: bold;
  padding: 0.4em 0.8em;
  border-radius: 5px;
  font-size: 0.85rem;
}

/* --- CARTE PRINCIPALE (ÉVÉNEMENT À VENIR) --- */
.actu-principale-card {
  min-height: 550px;
  overflow: hidden;
}

.actu-principale-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
}

.actu-principale-img {
  height: 350px;
  border-radius: 12px 12px 0 0;
  width: 100%;
}

.actu-principale-card h3.display-6 {
  font-weight: 700;
}

.description-text {
  line-height: 1.6;
  font-size: 1rem;
  color: #ddd !important;
  overflow: hidden;
  text-overflow: ellipsis;
  /* Limiter à quelques lignes */
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

/* --- CARTES SECONDAIRES (NEWS RÉCENTES) --- */
.actu-secondaire-card {
  border-radius: 8px;
  overflow: hidden;
}

.actu-secondaire-card:hover {
  background-color: #2c3034 !important;
  transform: translateX(5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.actu-secondaire-img-container {
  height: 150px;
}

.actu-secondaire-img {
  border-radius: 8px 0 0 8px !important;
}

.actu-secondaire-title {
  font-size: 1.15rem;
  font-weight: 700;
}


/* --- EFFET IMAGE (Ajouté pour les deux types de cartes) --- */
.actu-principale-img,
.actu-secondaire-img {
  filter: grayscale(80%) brightness(0.7);
  transition: filter 0.5s ease;
}

.actu-principale-card:hover .actu-principale-img,
.actu-secondaire-card:hover .actu-secondaire-img {
  filter: grayscale(0%) brightness(1);
}

/* --- COULEURS DES DISCIPLINES (Badges et Boutons) --- */

/* Couleurs des disciplines (existant, mais vérifié) */
.badge-judo {
  background-color: #d32f2f;
  color: white;
}

.badge-aikido {
  background-color: #1976d2;
  color: white;
}

.badge-jujitsu {
  background-color: #388e3c;
  color: white;
}

.badge-judo-detente {
  background-color: #fbc02d;
  color: black;
}

.badge-unknown {
  background-color: #757575;
  color: white;
}

/* Judo */
.btn-outline-judo {
  border: 2px solid #d32f2f;
  color: #d32f2f;
}

.btn-outline-judo:hover {
  background-color: #d32f2f;
  color: white;
}

/* Aïkido */
.btn-outline-aikido {
  border: 2px solid #1976d2;
  color: #1976d2;
}

.btn-outline-aikido:hover {
  background-color: #1976d2;
  color: white;
}

/* Jujitsu */
.btn-outline-jujitsu {
  border: 2px solid #388e3c;
  color: #388e3c;
}

.btn-outline-jujitsu:hover {
  background-color: #388e3c;
  color: white;
}

/* Judo détente */
.btn-outline-judo-detente {
  border: 2px solid #fbc02d;
  color: #fbc02d;
}

.btn-outline-judo-detente:hover {
  background-color: #fbc02d;
  color: black;
}

/* Discipline inconnue */
.btn-outline-unknown {
  border: 2px solid #757575;
  color: #757575;
}

.btn-outline-unknown:hover {
  background-color: #757575;
  color: white;
}


/* --- RESPONSIVE --- */
@media (max-width: 991.98px) {
  .imgBaniereJudo {
    height: 400px;
  }

  .actu-principale-img {
    height: 250px;
  }

}

@media (max-width: 767.98px) {

  /* Sur mobile, les images des cartes secondaires prennent 100% */
  .actu-secondaire-img-container {
    height: 100px;
    width: 100%;
  }

  .actu-secondaire-img {
    border-radius: 8px 8px 0 0 !important;
  }

  .actu-secondaire-card .col-5,
  .actu-secondaire-card .col-7 {
    width: 100%;
  }
}
</style>
