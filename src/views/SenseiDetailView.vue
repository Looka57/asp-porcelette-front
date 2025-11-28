<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import SenseiBulleLogoView from '@/components/Senseis/SenseiBulleLogoView.vue';
import SenseiBulleView from '@/components/Senseis/SenseiBulleView.vue';

// 1. Déclarer l'ID comme prop. Nécessite props: true dans le routeur.
const props = defineProps({
  id: {
    type: [String, Number], // L'ID peut être un nombre ou une chaîne UUID
    required: true
  }
});

// ===============================
// 🔹 ÉTATS
// ===============================
const sensei = ref(null);
const disciplines = ref([]);
const horaires = ref([]);
const cours = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);

// ===============================
// 🔹 FONCTIONS DE DATA
// ===============================


async function fetchDisciplines() {
  try {
    const response = await api.get('Discipline');
    disciplines.value = response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des disciplines :", error);
  }
}

async function fetchHoraire() {
  try {
    const response = await api.get('Horaire');
    horaires.value = response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des horaires :", error);
  }
}

async function fetchCours() {
  try {
    const response = await api.get('Cours');
    cours.value = response.data;
  } catch (error) {
    console.error("Erreur lors du chargement des cours :", error);
  }
}



async function fetchSensei() {
  try {
    const senseiId = props.id;

    if (!senseiId) {
      errorMessage.value = "ID du Sensei manquant.";
      isLoading.value = false;
      return;
    }


    const response = await api.get(`User/${senseiId}`);
    sensei.value = response.data;

  } catch (error) {
    console.error("Erreur chargement Sensei :", error);
    // Important : Si le 404 persiste, vérifiez que l'ID est bien un Sensei ou Adhérent existant.
    // Si c'est un 401, vérifiez que l'utilisateur est bien connecté avec le rôle Admin/Sensei.
    errorMessage.value = "Sensei introuvable ou erreur de chargement. (Vérifiez l'authentification si vous utilisez la route /admin/)";
  } finally {
    isLoading.value = false;
  }

  console.log('Liste des senseis:', sensei.value);
}

// ===============================
// 🔹 LOGIQUE DE COULEUR ET NOM
// ===============================

// Retourne le nom de la discipline selon l'id
function getDisciplineName(id) {
  const disciplineFound = disciplines.value.find(d => d.disciplineId === id);
  return disciplineFound ? disciplineFound.nom : 'Discipline non spécifiée';
}

// Retourne la couleur selon disciplineId (Doit être la même logique que SenseiSiteView)
function getDisciplineColorId(id) {
  switch (id) {
    case 1: return '#d9534f';   // Judo (Rouge)
    case 2: return '#0275d8';   // Aikido (Bleu)
    case 3: return '#5cb85c';   // Jujitsu (Vert)
    case 4: return '#f0ad4e';   // Judo détente (Orange)
    default: return '#ffc107';   // Jaune par défaut
  }
}

// ===============================
// 🔹 LOGIQUE DISCIPLINE
// ===============================
function getHorairesForSensei() {
  const coursSensei = getCoursForSensei();
  const horairesSensei = [];

  for (const c of coursSensei) {
    const h = horaires.value.filter(h => h.coursId === c.coursId);
    horairesSensei.push(...h);
  }

  return horairesSensei;
}

function getCoursForSensei() {
  if (!sensei.value) return [];
  return cours.value.filter(c => c.sensei?.id === sensei.value.id);
}

onMounted(async () => {
  await Promise.all([
    fetchDisciplines(),
    fetchSensei(),
    fetchHoraire(),
    fetchCours()
  ]);
});
</script>

<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100">

    <div class="imgBaniereJudo">
      <div class="titlePrincipal">
        <div class="overlay">
          <h1 class="display-3 text-uppercase text-warning">
            Profil du Sensei
          </h1>
        </div>
      </div>
    </div>

    <div class="container py-5">
      <div v-if="isLoading" class="text-center">
        <div class="spinner-border text-warning" role="status"></div>
        <p class="mt-3">Chargement des détails...</p>
      </div>
      <div v-else-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>
      <div v-else-if="sensei" class="row justify-content-center ">
        <div class="col-lg-10 col-md-12">
          <div class="profile-card bg-dark text-light p-4 rounded shadow-lg"
            :style="{ border: '3px solid ' + getDisciplineColorId(sensei.disciplineId) }">
            <div class="text-center mb-4">
              <img :src="'http://localhost:5070' + sensei.photoUrl" :alt="sensei.prenom + ' ' + sensei.nom"
                class="profile-img rounded-circle" :style="{
                  'border': '5px solid ' + getDisciplineColorId(sensei.disciplineId)
                }" />
            </div>
            <div class="text-center">
              <h2 class="fw-bold display-5 mb-1">{{ sensei.prenom }} {{ sensei.nom }}</h2>
              <p class="grade-text lead mb-4" :style="{ color: getDisciplineColorId(sensei.disciplineId) }">
                {{ sensei.grade || "Grade non renseigné" }}
              </p>
              <hr class="text-warning">
              <div class="row text-start details-row">
                <div class="col-sm-6 mb-3 bob">
                  <h6 class="text-muted">Discipline principale</h6>
                  <p class="fw-bold ">{{ getDisciplineName(sensei.disciplineId) }}</p>
                  <SenseiBulleView class="iconDiscipline" :discipline-id="sensei.disciplineId" />
                </div>
                <div class="col-sm-6 mb-3">
                  <h4 class="text-warning  mt-4 mb-2">Biographie</h4>
                  <p class="bio-text text-justify">{{ sensei.bio || "Aucune biographie disponible pour l'instant." }}
                  </p>
                </div>
                <div class="col-lg-6 col-md-12 mb-4">
                  <h6 class="text-muted">Horaires Entrainements</h6>
                  <div v-if="getHorairesForSensei().length > 0">
                    <table class="table table-dark table-striped">
                      <thead>
                        <tr>
                          <th class="text-warning">Jour</th>
                          <th class="text-warning">Début</th>
                          <th class="text-warning">Fin</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="h in getHorairesForSensei()" :key="h.horaireId">
                          <td>{{ h.jour }}</td>
                          <td>{{ h.heureDebut.substring(0, 5) }}</td>
                          <td>{{ h.heureFin.substring(0, 5) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p v-else class="fw-bold">
                    Aucun horaire disponible
                  </p>
                </div>
                <div class="logoDiscipline col-sm-6 mb-3 ">
                  <SenseiBulleLogoView :discipline-id="sensei.disciplineId" />
                </div>
              </div>
              <button @click="$router.back()" class="btn btn-outline-warning mt-4">
                Retour aux Senseis
              </button>
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
  /* Ajusté pour le profil */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  text-align: center;
}

.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.overlay h1 {
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 2px 2px 6px #000;
}

/* CARTE DE PROFIL */
.profile-card {
  background-color: #1a1a1a !important;
  /* Couleur sombre */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7);
}

.profile-img {
  width: 250px;
  height: 250px;
  object-fit: cover;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  /* Ombre douce */
}

.grade-text {
  font-weight: 700;
  text-transform: uppercase;
}

.details-row h6 {
  text-transform: uppercase;
  font-size: 0.8rem;
  color: #999 !important;
  margin-bottom: 0.2rem;
}

.details-row p {
  font-size: 1.1rem;
  color: #fff;
}

.bio-text {
  line-height: 1.6;
  color: #ccc;
  white-space: pre-wrap;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #1a1a1a;
  font-weight: bold;
  transition: all 0.2s;
}

.btn-warning:hover {
  background-color: #e0b320;
  border-color: #e0b320;
}

.bob {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 20px;
}

.logoDiscipline {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  border-radius: 8px;
}


.iconDiscipline {
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
