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


onMounted(fetchCours);

</script>
<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100">
    <h2 class="mb-5">Nos cours de Judo</h2>
    <div v-if="isLoading" class="text-center p-4">Chargement des cours...</div>
    <div v-else-if="errorMessage" class="text-danger text-center p-4">{{ errorMessage }}</div>


   <div v-else class="cardsJudo row justify-content-center">
      <div
        v-for="cours in coursJudo"
        :key="cours.coursId"
        class="col-lg-4 col-md-6 col-sm-12 mb-4"
      >
        <div class="card h-100">

          <div class="image-container">
            <img class="w-100" :src="getImgCours(cours.coursId)" :alt="'Image du cours ' + cours.libelle">

            <div class="title-banner">
              <h3>{{ cours.libelle }}</h3>
            </div>
          </div>
          </div>
      </div>
    </div>
  </div>





</template>

<style scoped>
/* -------------------- */
/* Styles de la Carte */
/* -------------------- */
.card {
  background-color: #343a40;
  color: #fff;
  padding: 0; /* 🎯 ENLEVER LE PADDING de 1rem pour coller la photo aux bords de la carte */
  box-shadow: 0 6px 15px rgba(0,0,0,0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
  overflow: hidden; /* 🎯 TRÈS IMPORTANT pour que l'image respecte le border-radius */
}

/* ------------------------------------- */
/* NOUVEAUX STYLES pour la Banderole */
/* ------------------------------------- */

.image-container {
  position: relative; /* 🎯 Conteneur de référence pour positionner la banderole */
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

  /* Style de la Banderole */
  background-color: rgba(225, 70, 70, 1); /* Fond semi-transparent pour lire le texte */
  color: #fff;
  padding: 0.5rem 1rem;

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
</style>
