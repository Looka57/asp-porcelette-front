<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

// ===============================
// 🔹 ÉTATS
// ===============================
const senseis = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);
const disciplines = ref([]);

const API_PATH_USER = 'User/admin/list';

// ===============================
// 🔹 FONCTIONS
// ===============================
async function fetchSensei() {
  try {
    isLoading.value = true;
    const response = await api.get(API_PATH_USER);
    const allUsers = response.data;

    // Filtrer les Sensei
    const foundSensei = allUsers.filter(u => u.roles && u.roles.includes("Sensei"));

    if (foundSensei.length > 0) {
      senseis.value = foundSensei;
    } else {
      errorMessage.value = "Aucun Sensei trouvé.";
    }

  } catch (error) {
    console.error('❌ Erreur lors du chargement des Sensei :', error);
    errorMessage.value = "Erreur lors du chargement des Sensei.";
  } finally {
    isLoading.value = false;
  }
}

async function fetchDisciplines() {
  try {
    const response = await api.get('Discipline');
    disciplines.value = response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des disciplines :", error);
  }
}

// --- Construction de l’URL de la photo
function getPhotoUrl(photoPath) {
  if (photoPath && typeof photoPath === 'string' && photoPath.startsWith('/')) {
    return photoPath;
  }
  return '/img/default-profile.png';
}

// Retourne le nom de la discipline selon l'id
function getDisciplineName(id) {
  const disciplineFound = disciplines.value.find(d => d.disciplineId === id);
  return disciplineFound ? disciplineFound.nom : 'Toutes disciplines';
}

// --- Couleur selon disciplineId (Harmonisée avec le bleu Aïkido)
function getDisciplineColorId(id) {
  switch (id) {
    case 1: return '#d9534f';      // Judo
    case 2: return '#31b3d0';      // Aikido (Bleu Aïkido)
    case 3: return '#5cb85c';      // Jujitsu
    case 4: return '#f0ad4e';      // Judo détente
    default: return '#31b3d0';      // Par défaut
  }
}

onMounted(async () => {
  await Promise.all([fetchSensei(), fetchDisciplines()]);
});
</script>

<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100">

    <!-- Bannière -->
    <div class="imgBaniereAikido">
  <div class="overlay">
  <span class="text-uppercase tracking-wider fs-7 fw-bold text-warning d-block mb-3">
    Expertise & Transmission
  </span>

  <h1 class="display-3 text-uppercase text-white fw-black mb-3">
    Nos Senseis
  </h1>

  <p class="lead text-white fw-light mb-4">
    Transmettre. Accompagner. Faire progresser.
  </p>

  <p class="text-white px-5 intro-text opacity-85">
    Découvrez l'équipe qui vous accompagne dans votre pratique,
    de l'apprentissage des fondamentaux au perfectionnement,
    avec exigence, respect et bienveillance.
  </p>
</div>
    </div>

    <!-- Liste des Senseis -->
    <div class="container-fluid py-5">
      <div class="containerSensei container py-4">
        <div class="text-center mb-5">
          <span class="text-uppercase tracking-wider fs-7 fw-bold text-warning d-block mb-2">Encadrement</span>
          <h2 class="section-title text-uppercase display-5 text-white m-0">L'ÉQUIPE PÉDAGOGIQUE</h2>
        </div>

        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-info-custom mb-3" role="status"></div>
          <p class="m-0 text-muted">Chargement des Sensei...</p>
        </div>

        <div v-else-if="errorMessage" class="alert alert-danger bg-danger bg-opacity-15 text-danger border-0 text-center py-4">
          {{ errorMessage }}
        </div>

        <div v-else class="row g-4 justify-content-center">
          <div v-for="sensei in senseis" :key="sensei.userId" class="col-lg-4 col-md-6 col-sm-12">
            <div class="card card-sensei h-100 bg-dark-card text-light rounded-4 shadow-lg" :style="{
              border: '2px solid ' + getDisciplineColorId(sensei.disciplineId),
              '--discipline-color': getDisciplineColorId(sensei.disciplineId)
            }">
              <div class="card-img-container p-3">
                <img :src="getPhotoUrl(sensei.photoUrl)" :alt="sensei.nom" class="card-img-top-sensei rounded-3" />
              </div>
              <div class="card-body text-center pt-2 pb-4 px-4 d-flex flex-column">
                <h3 class="card-title fw-bold text-white fs-4 mb-1">{{ sensei.prenom }} {{ sensei.nom }}</h3>
                <p :style="{color: getDisciplineColorId(sensei.disciplineId)}" class="card-subtitle mb-3 fw-semibold">{{ sensei.grade || 'Grade non précisé' }}</p>
                <p class="card-text disciplines text-light opacity-80 mb-4">
                  Discipline : <span class="text-white fw-semibold">{{ getDisciplineName(sensei.disciplineId) }}</span>
                </p>

                <!-- Route conservée à l'identique (sensei.id) -->
                <router-link :to="`/equipeDetailView/${sensei.id}`" class="btn btn-discipline-custom mt-auto fw-bold rounded-pill py-2"
                  :style="{
                    backgroundColor: 'transparent',
                    borderColor: 'var(--discipline-color)',
                    color: 'var(--discipline-color)'
                  }">
                  VOIR LE PROFIL
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
.imgBaniereAikido {
  position: relative;
  background-image: url('@/assets/img/banniereSensei.png');
  background-size: cover;
  background-position: center 22%;
  width: 100%;
  height: 550px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  text-align: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(26, 29, 33, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
}

.overlay h1 {
  font-weight: 900;
  letter-spacing: 2px;
}

.overlay .intro-text {
  font-size: 1.05rem;
  max-width: 750px;
  line-height: 1.6;
  font-weight: 600;
}

.containerSensei {
  max-width: 1200px;
  margin: 0 auto;
}

.bg-dark-card {
  background-color: #1a1d21;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.card-sensei:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 35px rgba(0, 0, 0, 0.5);
}

.card-img-container {
  overflow: hidden;
}

.card-img-top-sensei {
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
  filter: grayscale(100%);
  transition: filter 0.4s ease, transform 0.4s ease;
}

.card-sensei:hover .card-img-top-sensei {
  filter: brightness(1) grayscale(0%);
  transform: scale(1.03);
}

/* Bouton personnalisé */
.btn-discipline-custom {
  border-width: 2px;
  border-style: solid;
  transition: all 0.3s ease;
}

.btn-discipline-custom:hover {
  background-color: var(--discipline-color) !important;
  color: #1a1d21 !important;
  box-shadow: 0 4px 15px rgba(49, 179, 208, 0.3);
}


.tracking-wider {
  letter-spacing: 0.15em;
}

.fw-black {
  font-weight: 900;
}

.fs-7 {
  font-size: 0.75rem;
}
</style>
