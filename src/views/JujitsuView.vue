<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import JujitsuCoursView from '@/components/Jujitsu/JujitsuCoursView.vue';
import ActEventJujitsu from '@/components/Jujitsu/ActEventJujitsu.vue';

// ===============================
// 🔹 ÉTATS
// ===============================
const jujitsuDiscipline = ref(null);
const isLoading = ref(true);
const errorMessage = ref(null);

// ===============================
// 🔹 CONSTANTES D’API
// ===============================
const API_PATH_DISCIPLINE = 'Discipline';

// ===============================
// 🔹 FONCTIONS
// ===============================
async function fetchDiscipline() {
  try {
    isLoading.value = true;
    const reponse = await api.get(API_PATH_DISCIPLINE)
    const allDiscipline = reponse.data;
    const foundJujitsu = allDiscipline.find(d => d.nom === 'Jujitsu');
    if (foundJujitsu) {
      jujitsuDiscipline.value = foundJujitsu;
    } else {
      errorMessage.value = "Discipline Jujitsu non trouvée.";
    }
    console.log("Discipline chargée", jujitsuDiscipline.value); // Utilisez judoDiscipline ici
  } catch (error) {
    console.error('❌ Erreur lors du chargement des disciplines :', error);
    errorMessage.value = "Erreur lors du chargement des disciplines.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchDiscipline);

</script>

<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100">
    <div class="imgBaniereJudo">
      <div class="titlePrincipal">
        <div class="overlay">
          <h1 class="fs-1 text-uppercase ">JUJITSU</h1>
          <p class="fs-3 text-uppercase">Le combat intelligent, la technique avant la force.</p>
        </div>
      </div>
    </div>

    <div class="container defDisciplineJudo mt-5">
      <div class="defDiscipline ">
        <h2>Qu'est ce le Jujitsu ?</h2>
        <p v-if="isLoading" class="fs-5 text-warning">Chargement de la description...</p>
        <p v-else-if="errorMessage" class="fs-5 text-danger">{{ errorMessage }}</p>
        <p v-else-if="jujitsuDiscipline" class="fs-5">
          {{ jujitsuDiscipline.description }}
        </p>
      </div>
    </div>

    <div class="container-fluid">
      <JujitsuCoursView />
      <ActEventJujitsu />
    </div>
  </div>
</template>


<style scoped>
.imgBaniereJudo {
  position: relative;
  background-image: url('@/assets/img/bannierJujitsu.png');
  background-size: cover;
  background-position: center 20%;
  width: 100%;
  height: 650px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  text-align: center;
}

.titlePrincipal {
  margin-top: 100px;
  color:#38ef7d;
}


.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.35); /* Overlay sombre plus prononcé */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 2rem;
}

.overlay h1, .overlay p {
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 3px;
    text-shadow: 2px 2px 4px #000;
}


.defDisciplineJudo {
  display: flex;
}

.defDisciplineJudo img {
  width: 100px;
  margin: 10px;
}

.defDiscipline {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
