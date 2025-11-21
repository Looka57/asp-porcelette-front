<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

// ===============================
// 🔹 ÉTATS
// ===============================

const coursJudo = ref([]);
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
    const coursAllJudo = reponse.data;
    console.log("👉 Tous les cours reçus de l'API :", coursAllJudo);
    const foundCoursJudo = coursAllJudo.filter(c => (c.discipline.disciplineId === 1))
    if (foundCoursJudo && foundCoursJudo.length > 0) {
      // 🎯 Stocker le tableau de résultats filtrés
      coursJudo.value = foundCoursJudo;
    } else {
      errorMessage.value = "Aucun cours de Judo trouvé.";
    }

    console.log("Cours chargés", coursJudo.value);
  } catch (error) {
    console.error('❌ Erreur lors du chargement des cours :', error);
    errorMessage.value = "Erreur lors du chargement des cours.";
  } finally {
    isLoading.value = false;
  }
}


const imgCours = {
  17: new URL('@/assets/img/coursbaby.png', import.meta.url).href,
  18: new URL('@/assets/img/coursenf.png', import.meta.url).href,
  19: new URL('@/assets/img/coursAdulte.png', import.meta.url).href,
}

function getImgCours(coursId) {
  return imgCours[coursId] || "Image non disponible.";
}

const descriptionCours = {
  17: "Le Judo Baby est une approche ludique et sécurisée du judo, spécialement conçue pour les tout-petits. À travers des jeux moteurs, des exercices d’équilibre et des mouvements simples, les enfants découvrent les bases du judo tout en développant leur coordination, leur confiance en eux et le respect des autres.Les séances sont courtes, rythmées et adaptées à leur âge afin de leur offrir un moment de découverte, d’amusement et d’éveil corporel dans un environnement bienveillant.",
  18: "Le Judo Enfant permet aux jeunes judokas de 6 à 9 ans de découvrir les techniques fondamentales du judo tout en développant leur motricité, leur équilibre et leur coordination. Les exercices deviennent plus précis et structurés, toujours dans un cadre bienveillant et ludique.Les enfants apprennent le respect, la discipline, la maîtrise de soi et la coopération, tout en s’initiant aux premières formes de combat contrôlé.À cet âge, les premières petites compétitions font leur apparition, offrant aux jeunes judokas une occasion motivante de se dépasser, de gagner en confiance et de mettre en pratique tout ce qu’ils ont appris.",
  19: "Le judo pour les plus de 10 ans et les adultes propose un enseignement complet mêlant technique, condition physique et développement personnel. Les entraînements deviennent plus approfondis, avec un travail détaillé sur les projections, les immobilisations, le ne-waza et la maîtrise du corps.Que l’objectif soit la progression technique, la remise en forme, la compétition ou simplement le plaisir de pratiquer, chacun avance à son rythme dans un cadre respectueux et motivant.Cette catégorie permet également d’aborder des randoris plus poussés, une meilleure connaissance de soi et une vraie montée en puissance sur le plan physique comme mental."
}

function getDescriptionCours(coursId) {
  return descriptionCours[coursId];
}

onMounted(fetchCours);
</script>

<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100">
    <h2 class="mb-5 text-center text-warning display-3">NOS COURS</h2>

    <div v-if="isLoading" class="text-center p-4">Chargement des cours...</div>
    <div v-else-if="errorMessage" class="text-danger text-center p-4">{{ errorMessage }}</div>

    <div v-else class="container-fluid cours-quinconce-container">

      <div v-for="(cours, index) in coursJudo" :key="cours.coursId" class="row align-items-center course-row">

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
  background: #ef3838;
  padding: 2rem;
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
