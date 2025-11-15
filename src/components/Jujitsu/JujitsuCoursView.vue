<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

// ===============================
// 🔹 ÉTATS
// ===============================

const coursJujitsu = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);

// ===============================
// 🔹 CONSTANTES D’API
// ===============================
const API_PATH_COURS = 'Cours';

// ===============================
// 🔹 FONCTIONS
// ===============================

async function fetchCours() {
  try {
    isLoading.value = true;
    const reponse = await api.get(API_PATH_COURS);
    const coursAllJujitsu = reponse.data;
    console.log("👉 Tous les cours reçus de l'API :", coursAllJujitsu);
    const foundcoursJujitsu = coursAllJujitsu.filter(c => (c.discipline.disciplineId === 3))
    if (foundcoursJujitsu && foundcoursJujitsu.length > 0) {
      // 🎯 Stocker le tableau de résultats filtrés
      coursJujitsu.value = foundcoursJujitsu;
    } else {
      errorMessage.value = "Aucun cours de Judo trouvé.";
    }

    console.log("Cours chargés", coursJujitsu.value);
  } catch (error) {
    console.error('❌ Erreur lors du chargement des cours :', error);
    errorMessage.value = "Erreur lors du chargement des cours.";
  } finally {
    isLoading.value = false;
  }
}


const imgCours = {
  20: new URL('@/assets/img/jujitsuAdulte.png', import.meta.url).href,
}

function getImgCours(coursId) {
  return imgCours[coursId] || "Image non disponible.";
}

const descriptionCours = {
  20: "  Le Jujitsu est une discipline complète qui combine techniques de défense, projections, immobilisations et travail au sol. Accessible à tous, il permet d’apprendre à se protéger efficacement tout en développant la coordination, la condition physique et la confiance en soi. Les pratiquants progressent à leur rythme dans un cadre sécurisant, en mettant l’accent sur le contrôle, la précision des gestes et le respect du partenaire."
}

function getDescriptionCours(coursId) {
  return descriptionCours[coursId];
}

onMounted(fetchCours);
</script>

<template>
  <div class="container-fluid p-0 bg-dark text-light max-vh-100">
    <h2 class="mb-5 text-center">NOS COURS DE JUJITSU</h2>

    <div v-if="isLoading" class="text-center p-4">Chargement des cours...</div>
    <div v-else-if="errorMessage" class="text-danger text-center p-4">{{ errorMessage }}</div>

    <div v-else class="container-fluid cours-quinconce-container">

      <div v-for="(cours, index) in coursJujitsu" :key="cours.coursId" class="row align-items-center course-row">

        <div class="col-lg-4 col-md-6" :class="{ 'order-lg-2': index % 2 === 1 }">
          <div class="designer-card h-100">
            <div class="image-wrapper">
              <img :src="getImgCours(cours.coursId)" :alt="'Image du cours ' + cours.libelle"
                class="w-100 course-image">
              <div class="card-content-overlay">
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-8 col-md-6 mb-4">
          <div class="course-description-block text-justify">
            <h3 class="display-5 mb-4 text-warning">{{ cours.libelle }}</h3>
            <p class="mb-5">
              {{ getDescriptionCours(cours.coursId) }}
            </p>
            <div class="horaireSenseiCours">
              <div class="horaireCours row">
                <h4 class="display-6 text-warning mb-3">Horaires</h4>
                <ul class="list-unstyled horaire-list">
                  <li v-for="horaire in cours.horaires" :key="horaire.horaireId">
                    <i class="pi pi-calendar-clock me-2 text-warning"></i>
                    Le {{ horaire.jour }} : de {{ horaire.heureDebut }} à {{ horaire.heureFin }}
                  </li>
                </ul>
              </div>
              <div class="senseiCours ">
                <h4 class="display-6 text-warning mb-3">Sensei</h4>
                <p class="fs-5" v-if="cours.sensei">
                  {{ cours.sensei.prenom }} {{ cours.sensei.nom }}
                </p>
                <p v-else class="text-secondary">
                  Professeur non attribué.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>




<style scoped>
h2 {
  margin: 50px 0px;
}

/* -------------------- */
/* Styles de la Carte */
/* -------------------- */
.card {
  background-color: #343a40;
  color: #fff;
  padding: 0;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

/* ------------------------------------- */
/* NOUVEAUX STYLES pour la Banderole */
/* ------------------------------------- */
.image-container {
  position: relative;
  /* 🎯 Conteneur de référence pour positionner la banderole */
  overflow: hidden;
}

.image-container img {
  display: block;
}

.title-banner {
  /* Positionnement */
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;



  /* Centrage du Texte */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title-banner h3 {

  font-size: 1.2rem;
  font-weight: 600;
}

/* ------------------------------------- */
/* Conteneur et carte de base */
/* ------------------------------------- */

.cards-judo-container {
  padding-bottom: 50px;
}

.designer-card {
  background-color: #343a40;
  color: #fff;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease;
  padding: 0;

}

.designer-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

/* ------------------------------------- */
/* Image et Effets (N&B, Hover) */
/* ------------------------------------- */
.image-wrapper {
  position: relative;
  overflow: hidden;

}

.course-image {
  display: block;
  height: auto;
  filter: brightness(0.7) grayscale(100%);
  transition: filter 0.5s ease;
  width: 100%;
}

.designer-card:hover .course-image {
  filter: brightness(1) grayscale(0%);
}

/* ------------------------------------- */
/* Bandeau de Titre (Overlay) */
/* ------------------------------------- */
.card-content-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #38ef7d;
  padding: 1.5rem;
  text-align: left;
  display: flex;
  align-items: center;
}

.course-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #ffffffff;
}


.horaireSenseiCours {
  display: flex;
}

@media (max-width: 767px) {

  /* Pour les écrans jusqu'à la taille 'sm' */
  .horaireSenseiCours {
    flex-direction: column;
    /* Empile verticalement */
  }

  .senseiCours {
    margin-top: 20px;
    text-align: left;
  }
}
</style>
