<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import AikidoCoursView from '@/components/Aikido/AikidoCoursView.vue';
import ActEventAikidoView from '@/components/Aikido/ActEventAikidoView.vue';

// ===============================
// 🔹 ÉTATS
// ===============================
const discipline = ref([]);
const aikidoDiscipline = ref(null);
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
    const foundAikido = allDiscipline.find(d => d.nom === 'Aïkido');
    if (foundAikido) {
      aikidoDiscipline.value = foundAikido;
    } else {
      errorMessage.value = "Discipline Aikido non trouvée.";
    }
    console.log("Discipline chargés", discipline.value);
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
        <h2 class="fs-1 text-uppercase ">AIKIDO</h2>
        <p class="fs-3 text-uppercase">L’art de l’harmonie et du mouvement.</p>
      </div>
    </div>

    <div class="container defDisciplineAikido mt-5">
      <div class="defDiscipline ">
        <h2>Qu'est ce que l'Aïkido ?</h2>
        <p v-if="isLoading" class="fs-5 text-warning">Chargement de la description...</p>
        <p v-else-if="errorMessage" class="fs-5 text-danger">{{ errorMessage }}</p>
        <p v-else-if="aikidoDiscipline" class="fs-5">
          {{ aikidoDiscipline.description }}
        </p>
      </div>
    </div>

    <div class="container-fluid">
      <AikidoCoursView />
      <ActEventAikidoView />
    </div>
  </div>
</template>


<style scoped>
.imgBaniereJudo {
  background-image: url('@/assets/img/baniereAikido.png');
  background-size: cover;
  background-position: center 32%;
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
  color: #31b3d0;
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
