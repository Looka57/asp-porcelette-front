<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const disciplines = ref([]);
const isLoading = ref(false);
const errorMessage = ref(null);

const API_PATH_DISCIPLINE = '/Discipline';

async function fetchDisciplines() {
  isLoading.value = true;
  try {
    const res = await api.get(API_PATH_DISCIPLINE);
    disciplines.value = res.data;
  } catch (error) {
    console.error('❌ Erreur :', error);
    errorMessage.value = "Erreur lors du chargement des disciplines.";
  } finally {
    isLoading.value = false;
  }
}

// ===============================
// 🔹 ICONES PAR DÉFAUT
// ===============================
const disciplineIcons = {
  1: 'https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-judo-sport-fitness-vol3-microdots-premium-microdot-graphic.png', // Judo
  2: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-aikido-martial-arts-flaticons-lineal-color-flat-icons-3.png', // Aïkido
  3: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-jiu-jitsu-martial-arts-flaticons-lineal-color-flat-icons-3.png', // Jujitsu
  4: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-judo-martial-arts-flaticons-lineal-color-flat-icons-3.png', // Judo détente
}

function getIconUrl(disciplineId) {
  const defaultIcon = 'https://img.icons8.com/color/96/martial-arts.png'
  return disciplineIcons[disciplineId] || defaultIcon
}

onMounted(fetchDisciplines);
</script>

<template>
  <div class="container-fluid py-4">
    <div v-if="isLoading">Chargement...</div>
    <div v-else-if="errorMessage">{{ errorMessage }}</div>

    <div v-for="discipline in disciplines" :key="discipline.disciplineId" class="discipline-section">

      <!-- 🔹 Header discipline avec icône à gauche -->
      <div class="discipline-header">
        <img :src="getIconUrl(discipline.disciplineId)" :alt="`Icône ${discipline.nom}`" class="discipline-icon" />
        <h1 class="discipline-title text-warning">{{ discipline.nom }}</h1>
      </div>

      <div class="cours-flex">
        <div class="cours-card rounded" v-for="cours in discipline.cours" :key="cours.coursId">
          <h4 class="cours-title">{{ cours.libelle }}</h4>

          <div class="horaire-list">
            <div v-for="horaire in cours.horaires" :key="horaire.horaireId" class="horaire-item">
              <p><strong>Jour :</strong> {{ horaire.jour }}</p>
              <p><strong>Heure :</strong> {{ horaire.heureDebut }} - {{ horaire.heureFin }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 🔘 Boutons CRUD -->
    <div class="boutonCrud m-5 d-flex justify-content-around">
      <div class="crud">
        <button class="btn btn-outline-warning">
          <i class="pi pi-plus-circle me-2"></i> Ajouter
        </button>
      </div>
      <div class="crud">
        <button class="btn btn-outline-info">
          <i class="pi pi-file-edit me-2"></i> Modifier
        </button>
      </div>
      <div class="crud">
        <button class="btn btn-outline-danger">
          <i class="pi pi-trash me-2"></i> Supprimer
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.discipline-section {
  margin-bottom: 4rem;
}

/* 🔹 Header discipline avec icône */
.discipline-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.discipline-icon {
  width: 64px;
  height: 64px;
}

.discipline-title {
  font-weight: bold;
  font-size: 2rem;
}

.cours-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.cours-card {
  background-color: #343a40;
  color: #fff;
  padding: 1rem;
  width: 450px;
  min-height: 150px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 12px;
}

.cours-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
}

.horaire-list {
  margin-top: 0.5rem;
}

.horaire-item {
  background-color: rgba(255,255,255,0.15);
  border-radius: 8px;
  padding: 0.4rem 0.6rem;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}
</style>
