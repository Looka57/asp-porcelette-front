<script setup>

import { ref, onMounted } from 'vue';
import api from '@/api/axios'


// ===============================
// 🔹 ÉTATS
// ===============================
const disciplines = ref([]);
const horaires = ref([]);
// const cours = ref([]);

const isLoading = ref(false)
const errorMessage = ref(null)

// ===============================
// 🔹 CONSTANTES D’API
// ===============================
const API_PATH_DISCIPLINE = '/Discipline'
const API_PATH_HORAIRE = '/Horaire'

// ===============================
// 🔹 FONCTIONS
// ===============================

async function fetchDisciplines() {
  try {
    const reponse = await api.get(API_PATH_DISCIPLINE);
    disciplines.value = reponse.data
    console.log('✅ Disciplines chargées :', disciplines.value)
  } catch (error) {
    console.error('❌ Erreur lors du chargement des disciplines :', error)
    errorMessage.value = "Erreur lors du chargement des disciplines."
  } finally {
    isLoading.value = false
  }
}
async function fetchHoraires() {
  try {
    const reponse = await api.get(API_PATH_HORAIRE);
    horaires.value = reponse.data
    console.log('✅ horaires chargées :', horaires.value)
  } catch (error) {
    console.error('❌ Erreur lors du chargement des horaires :', error)
    errorMessage.value = "Erreur lors du chargement des horaires."
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDisciplines()
  fetchHoraires()
})


</script>

<template>
  <div class="container-fluid py-4">
    <div v-for="discipline in disciplines" :key="discipline.disciplineId" class="cours-discipline-section">
      <h1 class="text-center">{{ discipline.nom }}</h1>

      <div class="cours-grid">
        <div class="cours-card" v-for="cours in discipline.cours" :key="cours.coursId">
          <h4 class="cours-title">{{ cours.libelle }}</h4>
          <p><strong>Jour :</strong> {{ cours.horaire.jour }}</p>
          <p><strong>Horaire :</strong> {{ cours.horaire.heureDebut }} - {{ cours.horaire.heureFin }}</p>
          <p><strong>Sensei :</strong> {{ cours.sensei.nom }}</p>
        </div>
      </div>
    </div>
  </div>
</template>






















<style scoped>
/* ======================================================
🎨 STYLE DE LA SECTION DES DISCIPLINES
===================================================== */

.cours-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  justify-items: center;
  align-items: stretch;
}

.cours-card {
  background-color: #343a40;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  text-align: center;
}

.cours-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.cours-discipline-section {
  margin-bottom: 3rem;
}

.cours-title {
  margin-bottom: 0.5rem;
  color: #495057;
  font-weight: 600;
}
</style>
