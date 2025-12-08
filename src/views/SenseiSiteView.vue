<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const senseis = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);

const disciplines = ref([]);

const API_PATH_USER = 'User/admin/list';

// --- Fetch des sensei
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
  // En production derrière Nginx, nous retournons le chemin relatif.

  if (photoPath && typeof photoPath === 'string' && photoPath.startsWith('/')) {
    // Si le chemin dans la BDD est relatif (/images/...), on le retourne directement.
    return photoPath;
  }

  // Si le chemin n'existe pas ou n'est pas relatif, on retourne l'image par défaut relative.
  return '/img/default-profile.png';
}

// Retourne le nom de la discipline selon l'id
function getDisciplineName(id) {
  const disciplineFound = disciplines.value.find(d => d.disciplineId === id);
  return disciplineFound ? disciplineFound.nom : 'Toutes disciplines';
}


// --- Couleur selon disciplineId
function getDisciplineColorId(id) {
  switch (id) {
    case 1: return '#d9534f';      // Judo
    case 2: return '#0275d8';      // Aikido
    case 3: return '#5cb85c';      // Jujitsu
    case 4: return '#f0ad4e';      // Judo détente
    default: return '#ffc107';      // Jaune par défaut
  }
}

onMounted(async () => {
  await Promise.all([fetchSensei(), fetchDisciplines()]);
});
</script>

<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100">
    <div class="imgBaniereJudo">
      <div class="titlePrincipal">
        <div class="overlay">
          <h1 class="display-3 text-uppercase text-warning">Nos Senseis</h1>
          <p class="lead text-white fw-light mb-4">Expertise, passion et transmission.</p>
          <p class="text-white px-5 intro-text">
            Découvrez l'équipe d'encadrement de l'AS Porcelette Art Martiaux  qui vous guidera tout au long de votre parcours.
          </p>
        </div>
      </div>
    </div>

    <div class="container-fluid py-5">
      <div class="containerSensei">
        <h3 class="section-title text-uppercase display-5 text-warning text-center mb-5">L'ÉQUIPE PÉDAGOGIQUE</h3>

        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-warning" role="status"></div>
          <p class="mt-3">Chargement des Sensei...</p>
        </div>
        <div v-else-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>

        <div v-else class="row g-4 justify-content-center">
          <div v-for="sensei in senseis" :key="sensei.userId" class="col-lg-4 col-md-6 col-sm-12">
            <div class="card card-sensei h-100 bg-dark text-light" :style="{
              border: '3px solid ' + getDisciplineColorId(sensei.disciplineId),
              '--discipline-color': getDisciplineColorId(sensei.disciplineId)
            }">
              <div class="card-img-container">
                <img :src="getPhotoUrl(sensei.photoUrl)" :alt="sensei.nom" class="card-img-top-sensei" />
              </div>
              <div class="card-body text-center pt-4">
                <h5 class="card-title fw-bold">{{ sensei.prenom }} {{ sensei.nom }}</h5>
                <p class="card-subtitle mb-2">{{ sensei.grade || 'Ceinture Noire - Grade non précisé' }}</p>
                <p class="card-text disciplines">
                  Discipline : <span>{{ getDisciplineName(sensei.disciplineId) }}</span>
                </p>

                <router-link :to="`/equipeDetailView/${sensei.id}`" class="btn mt-3"
                  :class="`btn-discipline-${sensei.disciplineId}`" :style="{
                    backgroundColor: 'var(--discipline-color)',
                    borderColor: 'var(--discipline-color)',
                    color: '#1a1a1a'
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
.imgBaniereJudo {
  position: relative;
  background-image: url('@/assets/img/banniereSensei.png');
  background-size: cover;
  background-position: center 22%;
  width: 100%;
  height: 650px;
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
  text-shadow: 2px 2px 6px #000;
}

.overlay p {
  font-weight: 500;
  letter-spacing: 1px;
  text-shadow: 1px 1px 3px #000;
}

.overlay .intro-text {
  font-size: 1.1rem;
  max-width: 800px;
  margin-top: 15px;
}





.containerSensei {
  width: 90%;
  max-width: 1200px;
  margin: 50px auto;
}

.card-sensei {
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  background-color: #1a1a1a !important;
}

.card-sensei:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(255, 254, 252, 0.2);
}

.card-img-container {
  position: relative;
  padding: 15px;
  overflow: hidden;
  border-radius: 12px;
  filter: grayscale(1);
  margin: 15px;
}

.card-img-top-sensei {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
  border-radius: 8px;
  filter: brightness(0.9);
}

.card-body {
  padding: 1.5rem;
  padding-top: 0;
}

.card-title {
  font-size: 1.6rem;
  color: #fff;
  text-shadow: 0 1px 2px #000;
}

.card-subtitle {
  font-style: normal;
  font-size: 0.9rem;
  color: #ccc;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.disciplines {
  font-size: 0.9rem;
  font-weight: 500;
  color: #999;
}

.disciplines span {
  font-weight: bold;
}

/* Styles généraux des boutons outline */
.btn[class^="btn-discipline-"] {
  background-color: transparent;
  border-width: 2px;
  border-style: solid;
  color: inherit;
  font-weight: 700;
  transition: all 0.3s ease;
}

/* Couleurs par discipline */
.btn-discipline-1 {
  border-color: #d9534f;
  color: #d9534f;
}

/* Judo */
.btn-discipline-2 {
  border-color: #0275d8;
  color: #0275d8;
}

/* Aikido */
.btn-discipline-3 {
  border-color: #5cb85c;
  color: #5cb85c;
}

/* Jujitsu */
.btn-discipline-4 {
  border-color: #f0ad4e;
  color: #f0ad4e;
}

/* Judo détente */

/* Hover */
.btn-discipline-1:hover {
  background-color: #d9534f;
  color: #1a1a1a;
}

.btn-discipline-2:hover {
  background-color: #0275d8;
  color: #1a1a1a;
}

.btn-discipline-3:hover {
  background-color: #5cb85c;
  color: #1a1a1a;
}

.btn-discipline-4:hover {
  background-color: #f0ad4e;
  color: #1a1a1a;
}
</style>
