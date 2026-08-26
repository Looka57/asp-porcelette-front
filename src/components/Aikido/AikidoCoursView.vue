<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

// ===============================
// 🔹 ÉTATS
// ===============================
const coursAikido = ref([])
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
    const coursAllAikido = reponse.data
    const foundCoursAikido = coursAllAikido.filter(c => c.discipline.disciplineId === 2)
    if (foundCoursAikido && foundCoursAikido.length > 0) {
      coursAikido.value = foundCoursAikido
    } else {
      errorMessage.value = "Aucun cours d'Aïkido trouvé."
    }
  } catch (error) {
    console.error('❌ Erreur lors du chargement des cours :', error)
    errorMessage.value = "Erreur lors du chargement des cours."
  } finally {
    isLoading.value = false
  }
}

const imgCours = {
  9: new URL('@/assets/img/coursbabyAikido.png', import.meta.url).href,
  10: new URL('@/assets/img/coursenfAikido.png', import.meta.url).href,
  8: new URL('@/assets/img/coursAdulteAikido.png', import.meta.url).href,
  11: new URL('@/assets/img/aikitaiso.png', import.meta.url).href,
  12: new URL('@/assets/img/grade.png', import.meta.url).href,
}

function getImgCours(coursId) {
  return imgCours[coursId] || "Image non disponible."
}

const descriptionCours = {
  9: "L'Aïkido pour enfant est une initiation ludique et sécurisée à l’Aïkido pour les enfants de 5 à 9 ans. À travers des jeux moteurs, des exercices d’équilibre et des mouvements simples, les enfants découvrent les bases de cette discipline tout en développant leur coordination, leur motricité et leur confiance en eux. Les séances, rythmées et adaptées à leur âge, favorisent l’éveil corporel, le respect des autres et le plaisir de bouger dans un cadre bienveillant.",
  10: "L'Aïkido pour les enfants de 10 à 13 ans permet de renforcer les bases de la discipline tout en abordant des techniques plus précises et structurées. Les jeunes pratiquants apprennent à coordonner mouvements et respiration, à contrôler leurs gestes et à travailler avec un partenaire en toute sécurité. Les séances favorisent le respect, la discipline, la concentration et la coopération, tout en offrant aux enfants l'occasion de participer à leurs premières démonstrations ou rencontres amicales pour mettre en pratique ce qu’ils ont appris.",
  8: "L'Aïkido pour les adolescents et adultes (+14 ans) propose un apprentissage complet mêlant technique, maîtrise du corps et fluidité des mouvements. Les pratiquants approfondissent les projections, immobilisations et enchaînements, tout en développant leur souplesse, leur force et leur coordination. Que ce soit pour progresser techniquement, se remettre en forme ou pratiquer régulièrement, chacun avance à son rythme dans un cadre respectueux, motivant et sécurisant.",
  11: "L'Aïkitaiso est une pratique douce et accessible qui combine les principes de l’Aïkido avec des exercices de gym corporelle. Elle permet de développer la souplesse, l’équilibre, la coordination et la tonicité musculaire, tout en favorisant la concentration et la relaxation. Adaptée à tous les âges et tous les niveaux, cette discipline offre un moment de bien-être physique et mental dans un cadre sécurisant et respectueux.",
  12: "Le passage de grade permet aux pratiquants d’évaluer leurs acquis et de progresser dans leur discipline. Il s’agit d’un moment important où technique, discipline, concentration et respect sont mis en valeur. Chaque participant présente les compétences apprises lors des cours, sous le regard attentif des enseignants, et reçoit un retour constructif pour continuer à évoluer à son rythme."
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
        <span class="text-uppercase tracking-wider fs-7 fw-bold text-info-custom d-block mb-2">Harmonie & Mouvement</span>
        <h2 class="display-3 text-white  text-uppercase m-0">NOS COURS</h2>
      </div>

      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-info-custom mb-3" role="status"></div>
        <p class="m-0 text-muted fs-6">Chargement des cours...</p>
      </div>

      <div v-else-if="errorMessage" class="alert alert-danger bg-danger bg-opacity-15 text-danger border-0 text-center py-4">
        {{ errorMessage }}
      </div>

      <div v-else class="cours-quinconce-container d-flex flex-column gap-5">
        <div v-for="(cours, index) in coursAikido" :key="cours.coursId"
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
                  <h4 class="fs-5 fw-bold text-info-custom mb-3 d-flex align-items-center">
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
                  <h4 class="fs-5 fw-bold text-info-custom mb-3 d-flex align-items-center">
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
  border-color: rgba(49, 179, 208, 0.4) !important;
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
  background-color: #31b3d0;
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
.text-info-custom {
  color: #31b3d0 !important;
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
