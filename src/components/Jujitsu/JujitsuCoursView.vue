<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

// ===============================
// 🔹 ÉTATS
// ===============================
const coursJujitsu = ref([])
const isLoading = ref(true)
const errorMessage = ref(null)

// ===============================
// 🔹 CONSTANTES D’API
// ===============================
const API_PATH_COURS = 'Cours'

// ===============================
// 🔹 FONCTIONS
// ===============================
async function fetchCours() {
  try {
    isLoading.value = true
    const reponse = await api.get(API_PATH_COURS)
    const coursAllJujitsu = reponse.data
    const foundcoursJujitsu = coursAllJujitsu.filter(c => c.discipline.disciplineId === 3)
    if (foundcoursJujitsu && foundcoursJujitsu.length > 0) {
      coursJujitsu.value = foundcoursJujitsu
    } else {
      errorMessage.value = "Aucun cours de Jujitsu trouvé."
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement des cours :', error)
    errorMessage.value = "Erreur lors du chargement des cours."
  } finally {
    isLoading.value = false
  }
}

const imgCours = {
  20: new URL('@/assets/img/jujitsuAdulte.png', import.meta.url).href,
}

function getImgCours(coursId) {
  return imgCours[coursId] || "Image non disponible."
}

const descriptionCours = {
  20: "Le Jujitsu est une discipline complète qui combine techniques de défense, projections, immobilisations et travail au sol. Accessible à tous, il permet d’apprendre à se protéger efficacement tout en développant la coordination, la condition physique et la confiance en soi. Les pratiquants progressent à leur rythme dans un cadre sécurisant, en mettant l’accent sur le contrôle, la précision des gestes et le respect du partenaire."
}

function getDescriptionCours(coursId) {
  return descriptionCours[coursId]
}

function formatHeure(heure) {
  if (!heure) return ''
  return heure.slice(0, 5) // "18:30:00" → "18:30"
}

onMounted(fetchCours)
</script>

<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100 py-5">
    <div class="container py-4">
      <div class="text-center mb-5">
        <span class="text-uppercase tracking-wider fs-7 fw-bold text-success-custom d-block mb-2">Défense & Maîtrise</span>
        <h2 class="display-4 text-white text-uppercase m-0">NOS COURS</h2>
      </div>

      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-success-custom mb-3" role="status"></div>
        <p class="m-0 text-muted fs-6">Chargement des cours...</p>
      </div>

      <div v-else-if="errorMessage" class="alert alert-danger bg-danger bg-opacity-15 text-danger border-0 text-center py-4">
        {{ errorMessage }}
      </div>

      <div v-else class="cours-quinconce-container d-flex flex-column gap-5">
        <div v-for="(cours, index) in coursJujitsu" :key="cours.coursId"
             class="row align-items-center course-row bg-dark-card p-4 p-md-5 rounded-4 border border-secondary border-opacity-10 shadow-lg">

          <!-- Image -->
          <div class="col-lg-5 col-md-6 mb-4 mb-md-0" :class="{ 'order-lg-2': index % 2 === 1 }">
            <div class="designer-card h-100 overflow-hidden rounded-4 shadow-sm">
              <div class="image-wrapper position-relative">
                <img :src="getImgCours(cours.coursId)" :alt="'Image du cours ' + cours.libelle"
                     class="w-100 course-image">
              </div>
            </div>
          </div>

          <!-- Description & Infos -->
          <div class="col-lg-7 col-md-6" :class="{ 'order-lg-1': index % 2 === 1 }">
            <div class="course-description-block">
              <h3 class="display-6 fw-bold text-white mb-3 title-underline pb-2">{{ cours.libelle }}</h3>
              <p class="fs-6 text-light lh-lg opacity-90 mb-4">
                {{ getDescriptionCours(cours.coursId) }}
              </p>

              <div class="horaireSenseiCours row g-4 pt-3 border-top border-secondary border-opacity-20">
                <!-- Horaires -->
                <div class="horaireCours col-md-6">
                  <h4 class="fs-5 fw-bold text-success-custom mb-3 d-flex align-items-center">
                    <i class="pi pi-calendar-clock me-2"></i> Horaires
                  </h4>
                  <ul class="list-unstyled fs-6 horaire-list m-0 d-flex flex-column gap-2 text-light opacity-85">
                    <li v-for="horaire in cours.horaires" :key="horaire.horaireId">
                      <span class="fw-semibold text-white">Le {{ horaire.jour }} :</span>
                      de {{ formatHeure(horaire.heureDebut) }} à {{ formatHeure(horaire.heureFin) }}
                    </li>
                  </ul>
                </div>

                <!-- Sensei -->
                <div class="senseiCours col-md-6">
                  <h4 class="fs-5 fw-bold text-success-custom mb-3 d-flex align-items-center">
                    <i class="pi pi-user me-2"></i> Sensei
                  </h4>
                  <p class="fs-6 text-light opacity-85 m-0" v-if="cours.sensei">
                    <span class="fw-semibold text-white">{{ cours.sensei.prenom }} {{ cours.sensei.nom }}</span>
                  </p>
                  <p v-else class="text-secondary fs-6 m-0 fst-italic">
                    Professeur non attribué.
                  </p>
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
/* --- CARTE PRINCIPALE DU COURS --- */
.bg-dark-card {
  background-color: #1a1d21;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.bg-dark-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 35px rgba(0, 0, 0, 0.5);
  border-color: rgba(56, 239, 125, 0.4) !important;
}

/* --- TITRE SOULIGNÉ --- */
.title-underline {
  position: relative;
}

.title-underline::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50px;
  height: 3px;
  background-color: #38ef7d;
  border-radius: 2px;
}

/* --- IMAGE & EFFETS --- */
.image-wrapper {
  overflow: hidden;
  border-radius: 10px;
}

.course-image {
  display: block;
  height: 280px;
  object-fit: cover;
  filter: brightness(0.85) grayscale(30%);
  transition: filter 0.5s ease, transform 0.5s ease;
  width: 100%;
}

.bg-dark-card:hover .course-image {
  filter: brightness(1) grayscale(0%);
  transform: scale(1.03);
}

/* --- TYPO & UTILITAIRES --- */
.text-success-custom {
  color: #38ef7d !important;
}

.tracking-wider {
  letter-spacing: 0.15em;
}



.fs-7 {
  font-size: 0.75rem;
}

@media (max-width: 767.98px) {
  .horaireSenseiCours {
    flex-direction: column;
  }
}
</style>
