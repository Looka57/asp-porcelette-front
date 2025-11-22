<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api/axios';

const evenements = ref([]);
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

// **CHEMIN API CORRIGÉ**
const API_PATH_EVENEMENT = '/Evenement';

// Format date FR
function formatDate(dateString) {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
}

async function fetchEvenements() {
  try {
    isLoading.value = true;
    const response = await api.get(API_PATH_EVENEMENT);

    evenements.value = response.data
      // 1. FILTRE : S'assurer que les clés critiques existent (EvenementId et DateDebut)
      .filter(e => e.evenementId && e.dateDebut)

      // 2. MAPPING : Reformater l'objet pour la compatibilité du template
      .map(event => ({
        ...event,
        // Clés renommées pour la clarté dans le template (mais EventId n'a pas bougé)
        evenementId: event.evenementId,
        titre: event.titre,
        contenu: event.description, // Mappe la description au "contenu" utilisé dans le template
        dateDePublication: event.dateDebut, // Utilise la DateDebut comme date principale pour le tri/affichage
        disciplineId: event.disciplineId,
        discipline: event.disciplineId
          ? DISCIPLINE_MAPPING[event.disciplineId]?.toLowerCase()
          : 'unknown',
      }))

      // 3. Trier par date de début (dateDePublication) décroissante par défaut (la plus récente d'abord)
      .sort((a, b) => new Date(b.dateDePublication) - new Date(a.dateDePublication));

  } catch (_error) {
    console.error("Erreur API:", _error);
    errorMessage.value = "Impossible de charger les événements.";
  } finally {
    isLoading.value = false;
  }
}

// 1. La liste filtrée par DISCIPLINE
const filteredEvenements = computed(() => {
  if (selectedDiscipline.value === 'all') return evenements.value;

  return evenements.value.filter(a =>
    a.discipline?.toLowerCase() === selectedDiscipline.value
  );
});

// --- Séparation des Événements Passés et Futures au sein du filtre de discipline ---

// Liste des événements Passés (DateDePublication < Aujourd'hui)
const evenementsPasses = computed(() => {
  return filteredEvenements.value
    .filter(a => new Date(a.dateDePublication) < today)
    .sort((a, b) => new Date(b.dateDePublication) - new Date(a.dateDePublication));
});

// Liste des événements Futures (DateDePublication >= Aujourd'hui), triées de la plus proche à la plus éloignée
const evenementsFutures = computed(() => {
  return filteredEvenements.value
    .filter(a => {
      // Rendre la date de l'événement 'J-J' pour la comparaison
      const actuDate = new Date(a.dateDePublication);
      actuDate.setHours(0, 0, 0, 0);
      return actuDate >= today;
    })
    .sort((a, b) => new Date(a.dateDePublication) - new Date(b.dateDePublication));
});


// 2. À la une (Le prochain événement de la discipline sélectionnée)
const evenementPrincipal = computed(() => evenementsFutures.value[0]);

// 3. Actus secondaires (4 max - Les 4 événements passés les plus récents)
const evenementsSecondaires = computed(() => {
  // On prend les 4 premiers événements passés
  return evenementsPasses.value.slice(0, 4);
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

const imageDiscipline = {
  1: new URL('@/assets/img/icones/judo.png', import.meta.url).href,
  2: new URL('@/assets/img//icones/aikido.png', import.meta.url).href,
  3: new URL('@/assets/img//icones/jujitsu.png', import.meta.url).href,
  4: new URL('@/assets/img//icones/judo-detente.png', import.meta.url).href
}

function getImageIconDiscipline(disciplineId) {
  return imageDiscipline[disciplineId] || "Image non disponible.";
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


onMounted(fetchEvenements);
</script>

<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100">
    <div class="imgBaniereJudo">
      <div class="overlay">
        <h1 class="display-3 text-white text-center">ÉVÉNEMENTS DU CLUB</h1>
        <p class="lead text-white text-center mb-4">
          Restez informés des événements à venir et des nouvelles récentes de l'ASP Porcelette.
        </p>
      </div>
    </div>
    <div class="text-center my-5">
      <div class="d-flex flex-wrap justify-content-center gap-2">
        <button :class="['btn btn-lg', selectedDiscipline === 'all' ? 'btn-warning text-dark' : 'btn-outline-warning']"
          @click="selectedDiscipline = 'all'">Toutes</button>
        <button :class="['btn btn-lg', selectedDiscipline === 'judo' ? 'btn-warning text-dark' : 'btn-outline-warning']"
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
      <p>Chargement des événements...</p>
    </div>
    <div v-else-if="errorMessage" class="alert alert-danger mx-5">{{ errorMessage }}</div>

    <div v-else-if="filteredEvenements.length === 0" class="alert alert-info mx-5 text-center">
      Aucun événement trouvé pour cette discipline.
    </div>

    <div v-else class="container-fluid p-5 my-5">
      <div class="row g-5">

        <div class="col-lg-7 mb-4 mb-lg-0">
          <h2 class="text-warning border-bottom border-danger pb-2 mb-4 display-5">
            <i class="bi bi-calendar-check-fill"></i> PROCHAIN ÉVÉNEMENT
          </h2>

          <div v-if="evenementPrincipal" class="card bg-dark border-secondary shadow-lg actu-principale-card">
            <div class="card-body p-0 d-flex flex-column">
              <img
                :src="getPhotoUrl(evenementPrincipal.imageUrl) || getImageIconDiscipline(evenementPrincipal.disciplineId)"
                class="card-img-top object-fit-cover actu-principale-img" :alt="evenementPrincipal.titre" />

              <div class="p-4 flex-grow-1">
                <span :class="['badge mb-2', getBadgeClass(evenementPrincipal.discipline)]">
                  {{ evenementPrincipal.discipline }}
                </span>
                <h3 class="card-title text-warning mb-2 display-6">
                  {{ evenementPrincipal.titre }}
                </h3>
                <p class="text-light small mb-3 fw-bold">
                  Prévu le : {{ formatDate(evenementPrincipal.dateDePublication) }}
                </p>

                <p class="card-text text-light description-text mb-4">
                  {{ evenementPrincipal.contenu || 'Description de l’événement à venir...' }}
                </p>

                <router-link :to="`/evenement/${evenementPrincipal.evenementId}`"
                  :class="['btn btn-lg w-100 fw-bold', getButtonClass(evenementPrincipal.discipline)]">
                  Voir les détails de l'événement
                </router-link>
              </div>
            </div>
          </div>

          <div v-else class="card bg-dark border-secondary shadow-lg actu-principale-card text-center p-5">
            <i class="bi bi-info-circle-fill text-warning display-1 mb-3"></i>
            <h3 class="text-light mt-3">Aucun événement à venir.</h3>
            <p class="text-light">
              De nouveaux événements seront bientôt disponibles pour cette discipline.
            </p>
          </div>
        </div>


        <div class="col-lg-5">
          <h2 class="text-warning border-bottom border-danger pb-2 mb-4 display-5">
            <i class="bi bi-clock-history"></i> ARCHIVES RÉCENTES
          </h2>

          <div v-for="event in evenementsSecondaires" :key="event.evenementId"
            class="card bg-dark border-secondary mb-3 shadow-sm actu-secondaire-card">
            <div class="row g-0 align-items-center">
              <div class="col-5 actu-secondaire-img-container">
                <img :src="getPhotoUrl(event.imageUrl) || getImageIconDiscipline(event.disciplineId)"
                  class="img-fluid rounded-start object-fit-cover w-100 h-100 actu-secondaire-img" :alt="event.titre" />
              </div>
              <div class="col-7">
                <div class="card-body p-3">
                  <span :class="['badge mb-1', getBadgeClass(event.discipline)]">
                    {{ event.discipline }}
                  </span>
                  <h5 class="card-title text-light actu-secondaire-title">{{ event.titre }}</h5>
                  <p class="card-text text-light small mb-2">{{ formatDate(event.dateDePublication) }}</p>
                  <router-link :to="`/evenement/${event.evenementId}`"
                    :class="['btn btn-outline', 'btn-sm', getButtonClass(event.discipline)]">
                    Voir l'archive
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <div v-if="evenementsSecondaires.length === 0 && evenementPrincipal"
            class="alert alert-secondary text-center">
            Aucune archive d'événement trouvée pour cette discipline.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Les styles CSS n'ont pas été modifiés car ils utilisent des classes Bootstrap et des classes custom qui n'étaient pas liées aux noms des variables JS. */
/* --- BANNIÈRE --- */
.imgBaniereJudo {
  background-image: url('@/assets/img/banniereEvent.png');
  /* Utilisez votre image */
  background-size: cover;
  background-position: center 45%;
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
  margin: 20px auto;
  border-radius: 12px 12px 0 0;
  width: 45%;
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

/* --- CARTES SECONDAIRES (NEWS RÉCENTES/ARCHIVES) --- */
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

  /* Les deux colonnes s'empilent naturellement sur mobile */
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
