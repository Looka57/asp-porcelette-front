<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import JudoCoursView from '@/components/Judo/JudoCoursView.vue';
// ===============================
// 🔹 ÉTATS
// ===============================
const discipline = ref([]);
const judoDiscipline = ref('null');
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
  try{
    isLoading.value = true;
    const reponse = await api.get(API_PATH_DISCIPLINE)
    const allDiscipline = reponse.data;
    const foundJudo = allDiscipline.find(d => d.nom === 'Judo');
    if (foundJudo) {
            judoDiscipline.value = foundJudo;
        } else {
            errorMessage.value = "Discipline Judo non trouvée.";
        }
    console.log("Discipline chargés", discipline.value);
  }catch (error) {
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
        <h2 class="fs-1 text-uppercase ">JUDO</h2>
        <p class="fs-3 text-uppercase">Discipline, respect et dépassement de soi.</p>
      </div>
    </div>

    <div class="container defDisciplineJudo mt-5">
      <div class="defDiscipline ">
        <h2>Qu'est ce le judo ?</h2>
        <p class="fs-5">{{ judoDiscipline.description }}</p>
      </div>
    </div>

    <div class="container-fluid">
      <JudoCoursView></JudoCoursView>
    </div>

  </div>
</template>


<style scoped>
.imgBaniereJudo {
  background-image: url('@/assets/img/baniereJudo.png');
  background-size: cover;
  background-position: center 15%;
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
  color: red !important;
}


.defDisciplineJudo{
  display: flex;

}

.defDisciplineJudo img{
  width: 100px;
  margin: 10px;
}

.defDiscipline{
  display: flex;
  flex-direction: column;
  justify-content: center;
}




</style>
