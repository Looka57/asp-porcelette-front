<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api/axios';

import PlaceholderImage from '@/assets/img/placeholder-styling.jpg';

const actualites = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);
const selectedDiscipline = ref('all');

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

    // --- CORRECTION CLÉ : Utilisation de .map pour enrichir l'objet actualité ---
    actualites.value = response.data
      // 1. S'assurer que les clés critiques existent
      .filter(a => a.actualiteId && a.dateDePublication)

      // 2. MAPPING : Ajouter la disciplineId et le nom au niveau racine
      .map(actu => ({
        ...actu,
        // Récupère l'ID du user.disciplineId (peut être null)
        disciplineId: actu.user?.disciplineId,
        // Mappe l'ID vers le nom en utilisant le dictionnaire (pour le filtre)
        discipline: actu.user?.disciplineId
          ? DISCIPLINE_MAPPING[actu.user.disciplineId]?.toLowerCase()
          : 'unknown', // Cas par défaut si l'ID n'est pas trouvé
      }))

      // 3. Trier en utilisant la bonne clé de date
      .sort((a, b) => new Date(b.dateDePublication) - new Date(a.dateDePublication));

  } catch (_error) {
    console.error("Erreur API:", _error);
    errorMessage.value = "Impossible de charger les actualités.";
  } finally {
    isLoading.value = false;
  }
}

// ... (Sous vos déclarations ref/const)



// ... (fetchActualites inchangée)

// 1. La liste filtrée par DISCIPLINE (étape 1)
const filteredActualites = computed(() => {
    // Si 'all' est sélectionné, on retourne toutes les actualités (déjà triées par date la plus récente par fetchActualites)
    if (selectedDiscipline.value === 'all') return actualites.value;

    // Sinon, on filtre par la discipline sélectionnée
    return actualites.value.filter(a =>
        a.discipline?.toLowerCase() === selectedDiscipline.value
    );
});

// --- Séparation des Actualités Passées et Futures au sein du filtre de discipline ---

// Liste des actualités Passées (DateDePublication < Aujourd'hui) pour la discipline sélectionnée
const actualitesPassees = computed(() => {
    return filteredActualites.value
        .filter(a => new Date(a.dateDePublication) < today)
        // Tri descendant : le plus récent d'abord (14, 12, 10...)
        .sort((a, b) => new Date(b.dateDePublication) - new Date(a.dateDePublication));
});

// Liste des actualités Futures (DateDePublication >= Aujourd'hui) pour la discipline sélectionnée
const actualitesFutures = computed(() => {
    return filteredActualites.value
        .filter(a => new Date(a.dateDePublication) >= today)
        // Tri ascendant : le plus proche dans le futur d'abord (20, 21, 29...)
        .sort((a, b) => new Date(a.dateDePublication) - new Date(b.dateDePublication));
});


// 2. À la une (Le prochain événement de la discipline sélectionnée)
const actualitePrincipale = computed(() => actualitesFutures.value[0]);

// 3. Actus secondaires (4 max - Les 4 actualités passées les plus récentes de la discipline sélectionnée)
const actualitesSecondaires = computed(() => {
    // On prend les 4 premières actualités passées
    return actualitesPassees.value.slice(0, 4);
});

// REMARQUE: Vous n'avez plus besoin de la propriété 'filteredActualites' si elle n'est utilisée que pour générer les deux computed ci-dessus.
// ===============================
// 🔹 CONSTRUCTION DE L’URL DE LA PHOTO
// ===============================
function getPhotoUrl(photoPath) {
  const baseUrl = 'http://localhost:5067'; // ✅ pas de https

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





onMounted(fetchActualites);
</script>


<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100">
    <div class="imgBaniereJudo">
      <div class="overlay">
        <h1 class="display-3 text-white text-center">ACTUALITÉS DU CLUB</h1>
        <p class="lead text-white text-center mb-4">
          Restez informés des derniers événements et nouvelles de l'ASP Porcelette
        </p>

      </div>
    </div>

    <div class="text-center my-5">
      <button :class="['btn mx-2', selectedDiscipline === 'all' ? 'btn-danger text-light' : 'btn-outline-light']"
        @click="selectedDiscipline = 'all'">Toutes</button>
      <button :class="['btn mx-2', selectedDiscipline === 'judo' ? 'btn-danger text-light' : 'btn-outline-light']"
        @click="selectedDiscipline = 'judo'">Judo</button>
      <button :class="['btn mx-2', selectedDiscipline === 'aikido' ? 'btn-danger text-light' : 'btn-outline-light']"
        @click="selectedDiscipline = 'aikido'">Aïkido</button>
      <button :class="['btn mx-2', selectedDiscipline === 'jujitsu' ? 'btn-danger text-light' : 'btn-outline-light']"
        @click="selectedDiscipline = 'jujitsu'">Jujitsu</button>
      <button
        :class="['btn mx-2', selectedDiscipline === 'judo-detente' ? 'btn-danger text-light' : 'btn-outline-light']"
        @click="selectedDiscipline = 'judo-detente'">Judo Détente</button>
    </div>

    <div v-if="isLoading" class="text-center text-danger p-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
      <p>Chargement des actualités...</p>
    </div>
    <div v-else-if="errorMessage" class="alert alert-danger mx-5">{{ errorMessage }}</div>
    <div v-else-if="filteredActualites.length === 0" class="alert alert-info mx-5 text-center">
      Aucune actualité trouvée pour cette discipline.
    </div>

    <div v-else class="container-fluid p-5 my-5">
      <div class="row">
        <div class="col-lg-7 mb-4 mb-lg-0">
          <h2 class="text-white border-bottom border-danger pb-2 mb-3">ACTUALITÉ A LA UNE</h2>
          <div v-if="actualitePrincipale" class="card bg-dark border-secondary h-100 shadow-lg actu-principale-card">
            <h3 class="text-light p-3">{{ actualitePrincipale.titre }}</h3>
            oui
            <img :src="getPhotoUrl(actualitePrincipale.imageUrl) || PlaceholderImage"
              class="card-img-top object-fit-cover p-4" :alt="actualitePrincipale.titre" />
            <div class="card-body d-flex flex-column justify-content-between p-4">
              <div>
                <p class="text-light small mb-3">Publié le {{ formatDate(actualitePrincipale.dateDePublication) }}</p>

              </div>
              <router-link :to="`/actualite/${actualitePrincipale.actualiteId}`" class="btn btn-danger mt-3">
                Voir l'actu
              </router-link>
            </div>
          </div>
        </div>


        <div class="col-lg-5">
          <h2 class="text-white border-bottom border-danger pb-2 mb-3">ACTUALITÉS RÉCENTES</h2>
          <div v-for="actu in actualitesSecondaires" :key="actu.actualiteId"
            class="card bg-dark border-secondary mb-3 shadow-sm actu-secondaire-card">
            <div class="row g-0 align-items-center">
              <div class="col-5">
                <img :src="getPhotoUrl(actu.imageUrl) || PlaceholderImage"
                class="img-fluid rounded-start object-fit-cover w-100 h-100"
                :alt="actu.titre" />
              </div>
              <div class="col-7">
                <div class="card-body p-3">
                  <span :class="['badge mb-1', getBadgeClass(actu.discipline)]">
                    {{ actu.discipline }}
                  </span>
                  <h5 class="card-title text-light mb-1">{{ actu.titre }}</h5>

                  <p class="card-text text-light small mb-2">{{ formatDate(actu.dateDePublication) }}</p>
                  <router-link :to="`/actualite/${actu.actualiteId}`" class="btn btn-outline-danger btn-sm">
                    Voir l'actu
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
.imgBaniereJudo {
  background-image: url('@/assets/img/banniereActualite.png');
  /* Utilisez votre image */
  background-size: cover;
  background-position: center 32%;
  /* Ajustez si besoin */
  width: 100%;
  height: 600px;
  /* Hauteur ajustée pour le contenu */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  /* Pour positionner l'overlay */
  color: white;
  text-align: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  /* Overlay sombre pour lire le texte */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
}

.overlay h1 {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.overlay p {
  max-width: 800px;
  margin-bottom: 2rem;
}

/* Styles pour les cartes d'actualité */
.actu-principale-card .card-body {
  background-color: #212529;
  /* Couleur de fond pour le corps de la carte principale */
}

.actu-secondaire-card .card-body {
  background-color: #212529;
  /* Couleur de fond pour le corps des cartes secondaires */
}

/* Ajustements Bootstrap pour les boutons de filtre */
.btn-danger {
  background-color: #dc3545;
  /* Rouge pour les boutons actifs */
  border-color: #dc3545;
}

.btn-outline-light:hover {
  color: #dc3545 !important;
  border-color: #dc3545 !important;
}

/* Styles des cartes */
.card.bg-dark {
  background-color: #1a1a1a !important;
  /* Un noir légèrement moins pur que le fond général */
  border: 1px solid #333 !important;
  /* Bordure plus discrète */
}

.card .badge {
  text-transform: uppercase;
  font-weight: bold;
}

.actu-principale-card img,
.actu-secondaire-card img {
  filter: grayscale(80%) brightness(0.8);
  /* Effet noir et blanc pour les images */
  transition: filter 0.3s ease;
}

.actu-principale-card:hover img,
.actu-secondaire-card:hover img {
  filter: grayscale(0%) brightness(1);
  /* Couleur au survol */
}



/* Badges couleurs par discipline */
.badge-judo {
  background-color: #d32f2f; /* Rouge judo */
  color: white;
}

.badge-aikido {
  background-color: #1976d2; /* Bleu aïkido */
  color: white;
}

.badge-jujitsu {
  background-color: #388e3c; /* Vert jujitsu */
  color: white;
}

.badge-judo-detente {
  background-color: #fbc02d; /* Jaune détente */
  color: black;
}

.badge-unknown {
  background-color: #757575; /* Gris si discipline inconnue */
  color: white;
}

</style>
