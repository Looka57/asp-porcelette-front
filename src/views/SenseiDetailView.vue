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
    errorMessage.value = "Sensei introuvable ou erreur de chargement. (Vérifiez l'authentification si vous utilisez la route /admin/)";
  } finally {
    isLoading.value = false;
  }
}

// ===============================
// 🔹 LOGIQUE DE COULEUR ET NOM
// ===============================

// Retourne le nom de la discipline selon l'id
function getDisciplineName(id) {
  const disciplineFound = disciplines.value.find(d => d.disciplineId === id);
  return disciplineFound ? disciplineFound.nom : 'Discipline non spécifiée';
}

// Retourne la couleur selon disciplineId (Automatique par discipline)
function getDisciplineColorId(id) {
  switch (id) {
    case 1: return '#d9534f';   // Judo (Rouge)
    case 2: return '#31b3d0';   // Aikido (Bleu)
    case 3: return '#5cb85c';   // Jujitsu (Vert)
    case 4: return '#f0ad4e';   // Judo détente (Jaune / Orange)
    default: return '#31b3d0';   // Bleu par défaut si inconnu
  }
}

function getPhotoUrl(photoPath) {
  if (photoPath && typeof photoPath === 'string' && photoPath.startsWith('/')) {
    return photoPath;
  }
  return '/img/default-profile.png';
}

// ===============================
// 🔹 LOGIQUE DISCIPLINE
// ===============================
function getHorairesForSensei() {
  const coursSensei = getCoursForSensei();
  const horairesSenseiEnrichis = [];

  for (const h of horaires.value) {
    const coursCorrespondant = coursSensei.find(c => c.coursId === h.coursId);

    if (coursCorrespondant) {
      horairesSenseiEnrichis.push({
        ...h,
        nomDuCours: coursCorrespondant.libelle || 'Cours sans nom',
        disciplineIdCours: coursCorrespondant.disciplineId
      });
    }
  }

  return horairesSenseiEnrichis;
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

    <!-- Bannière profil -->
    <div class="imgBaniereAikido">
      <div class="overlay">
        <span class="text-uppercase tracking-wider fs-7 fw-bold text-warning d-block mb-2">Encadrement & Pédagogie</span>
        <h1 class="display-3 text-uppercase text-white fw-black">
          Profil du Sensei
        </h1>
      </div>
    </div>

    <div class="container py-5">
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-info-custom mb-3" :style="{ color: sensei ? getDisciplineColorId(sensei.disciplineId) : '#31b3d0' }" role="status"></div>
        <p class="m-0 text-muted">Chargement des détails...</p>
      </div>

      <div v-else-if="errorMessage" class="alert alert-danger bg-danger bg-opacity-15 text-danger border-0 text-center py-4">
        {{ errorMessage }}
      </div>

      <div v-else-if="sensei" class="row justify-content-center">
        <div class="col-lg-10 col-md-12">
          <div class="profile-card bg-dark-card text-light p-4 p-md-5 rounded-4 shadow-lg"
            :style="{
              border: '2px solid ' + getDisciplineColorId(sensei.disciplineId),
              '--discipline-color': getDisciplineColorId(sensei.disciplineId)
            }">

            <div class="text-center mb-4">
              <img
                :src="getPhotoUrl(sensei.photoUrl)"
                :alt="sensei.prenom + ' ' + sensei.nom"
                class="profile-img rounded-circle shadow"
                :style="{ border: '4px solid ' + getDisciplineColorId(sensei.disciplineId) }"
              />
            </div>

            <div class="text-center">
              <h2 class="fw-bold display-5 text-white mb-1">{{ sensei.prenom }} {{ sensei.nom }}</h2>
              <p class="grade-text lead mb-4 fw-semibold" :style="{ color: getDisciplineColorId(sensei.disciplineId) }">
                {{ sensei.grade || "Grade non renseigné" }}
              </p>

              <hr class="border-secondary opacity-25 my-4">

              <div class="row text-start details-row align-items-center g-4">
                <div class="col-sm-6 mb-3 textDiscipline">
                  <h6 class="text-light text-uppercase fs-7 fw-bold tracking-wider mb-2">Discipline principale</h6>
                  <p :style="{ color: getDisciplineColorId(sensei.disciplineId) }" class="fw-bold fs-5 mb-3">{{ getDisciplineName(sensei.disciplineId) }}</p>
                  <SenseiBulleView class="iconDiscipline" :discipline-id="sensei.disciplineId" />
                </div>

                <div class="col-sm-6 mb-3">
                  <h4 class="text-uppercase fs-6 fw-bold tracking-wider mb-2" :style="{ color: getDisciplineColorId(sensei.disciplineId) }">Biographie</h4>
                  <p class="bio-text text-light opacity-85 text-justify">
                    {{ sensei.bio || "Aucune biographie disponible pour l'instant." }}
                  </p>
                </div>

                <div class="col-lg-6 col-md-12 mb-4">
                  <h6 class="text-light text-uppercase fs-7 fw-bold tracking-wider mb-3">Horaires Entraînements</h6>
                  <div v-if="getHorairesForSensei().length > 0" class="table-responsive rounded-3 overflow-hidden">
                    <table class="table table-dark table-striped mb-0">
                      <thead>
                        <tr>
                          <th class="py-3" :style="{ color: getDisciplineColorId(sensei.disciplineId) }">Cours</th>
                          <th class="py-3" :style="{ color: getDisciplineColorId(sensei.disciplineId) }">Jour</th>
                          <th class="py-3" :style="{ color: getDisciplineColorId(sensei.disciplineId) }">Début</th>
                          <th class="py-3" :style="{ color: getDisciplineColorId(sensei.disciplineId) }">Fin</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="h in getHorairesForSensei()" :key="h.horaireId">
                          <td class="align-middle text-light">{{ h.nomDuCours }}</td>
                          <td class="align-middle text-light">{{ h.jour }}</td>
                          <td class="align-middle text-light">{{ h.heureDebut.substring(0, 5) }}</td>
                          <td class="align-middle text-light">{{ h.heureFin.substring(0, 5) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p v-else class="text-light fst-italic">
                    Aucun horaire disponible
                  </p>
                </div>

                <div class="logoDiscipline col-sm-6 mb-3">
                  <SenseiBulleLogoView :discipline-id="sensei.disciplineId" />
                </div>
              </div>

              <button @click="$router.back()" class="btn btn-outline-custom mt-4 rounded-pill px-4 py-2 fw-bold"
                :style="{
                  borderColor: getDisciplineColorId(sensei.disciplineId),
                  color: getDisciplineColorId(sensei.disciplineId)
                }">
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
.imgBaniereAikido {
  position: relative;
  background-image: url('@/assets/img/banniereSensei.png');
  background-size: cover;
  background-position: center 22%;
  width: 100%;
  height: 450px;
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
  text-transform: uppercase;
}

/* CARTE DE PROFIL */
.bg-dark-card {
  background-color: #1a1d21;
}

.profile-img {
  width: 220px;
  height: 220px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.profile-img:hover {
  transform: scale(1.02);
}

.grade-text {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.details-row {
  display: flex;
  flex-direction: row;
}

.bio-text {
  line-height: 1.6;
  white-space: pre-wrap;
}

/* Bouton Outline personnalisé */
.btn-outline-custom {
  background-color: transparent;
  border-width: 2px;
  border-style: solid;
  transition: all 0.3s ease;
}

.btn-outline-custom:hover {
  background-color: var(--discipline-color) !important;
  color: #1a1d21 !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.textDiscipline {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.logoDiscipline {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 180px;
  border-radius: 8px;
}

.iconDiscipline {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

/* Utilitaires */
.text-info-custom {
  color: #31b3d0 !important;
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

@media (max-width: 440px) {
  .iconDiscipline {
    flex-wrap: wrap;
    width: 100%;
  }
}
</style>
