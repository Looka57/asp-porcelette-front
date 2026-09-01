<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';

// ===============================
// 🔹 ÉTATS
// ===============================
const disciplines = ref([])
const isLoading = ref(false)
const errorMessage = ref(null)

// ===============================
// 🔹 CONSTANTES D’API
// ===============================
const API_PATH_DISCIPLINE = '/Discipline'

// ===============================
// 🔹 COULEURS DES DISCIPLINES
// ===============================
const disciplineColors = {
  Judo: '#FF6384',
  Aïkido: '#3B82F6',
  Jujitsu: '#10B981',
  'Judo Détente': '#efd844ff',
}

function getDisciplineColor(nom) {
  return disciplineColors[nom] || '#FFC107' // Jaune par défaut
}

// ===============================
// 🔹 FONCTIONS
// ===============================
async function fetchDisciplines() {
  try {
    isLoading.value = true
    const response = await api.get(API_PATH_DISCIPLINE)
    disciplines.value = response.data
  } catch (error) {
    console.error('❌ Erreur lors du chargement des disciplines :', error)
    errorMessage.value = "Erreur lors du chargement des disciplines."
  } finally {
    isLoading.value = false
  }
}

// ===============================
// 🔹 ICONES PAR DÉFAUT
// ===============================
const disciplineIcons = {
  1: 'https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-judo-sport-fitness-vol3-microdots-premium-microdot-graphic.png',
  2: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-aikido-martial-arts-flaticons-lineal-color-flat-icons-3.png',
  3: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-jiu-jitsu-martial-arts-flaticons-lineal-color-flat-icons-3.png',
  4: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-judo-martial-arts-flaticons-lineal-color-flat-icons-3.png',
}

function getIconUrl(disciplineId) {
  const defaultIcon = 'https://img.icons8.com/color/96/martial-arts.png'
  return disciplineIcons[disciplineId] || defaultIcon
}

// ===============================
// 🔹 MONTAGE
// ===============================
onMounted(fetchDisciplines)
</script>

<template>
  <div class="py-5 px-3 md:px-6 surface-ground min-vh-100 text-white">

    <!-- En-tête -->
    <div class="text-center mb-6">
      <h1 class="text-4xl font-bold text-warning mb-2 flex align-items-center justify-content-center gap-3">
        <i class="pi pi-shield text-3xl"></i> Ce que le club propose
      </h1>
      <p class="text-400 text-lg m-0">Découvrez l'ensemble des arts martiaux enseignés au club.</p>
    </div>

    <!-- 🔄 Chargement -->
    <div v-if="isLoading" class="flex flex-column align-items-center justify-content-center py-8">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      <span class="text-500 mt-3 font-medium">Chargement des disciplines...</span>
    </div>

    <!-- ❌ Erreur -->
    <Message v-else-if="errorMessage" severity="error" :closable="false" class="max-w-md mx-auto mb-5">
      {{ errorMessage }}
    </Message>

    <!-- ✅ Liste des disciplines -->
    <div v-else class="max-w-7xl mx-auto grid grid-nogutter gap-4 justify-content-center">
      <div
        v-for="discipline in disciplines"
        :key="discipline.disciplineId"
        class="col-12 sm:col-6 lg:col-4 xl:col-3 flex"
      >
        <div
          class="discipline-card w-full p-4 border-round-xl border-1 flex flex-column justify-content-between text-center"
          :style="{ '--card-theme-color': getDisciplineColor(discipline.nom) }"
        >

          <div class="flex flex-column align-items-center">
            <!-- Icone avec fond à la couleur de la discipline -->
            <div
              class="icon-wrapper p-3 border-round-circle mb-3 flex align-items-center justify-content-center"

            >
              <img
                width="64"
                height="64"
                :src="getIconUrl(discipline.disciplineId)"
                :alt="`Icône ${discipline.nom}`"
                class="discipline-icon"
              />
            </div>

            <!-- Titre coloré dynamiquement -->
            <h3
              class="text-2xl font-bold m-0 mb-2"
              :style="{ color: getDisciplineColor(discipline.nom) }"
            >
              {{ discipline.nom }}
            </h3>

            <!-- Description -->
            <p class="text-300 text-sm line-height-3 m-0">
              {{ discipline.description || 'Aucune description disponible.' }}
            </p>
          </div>

          <!-- Actions d'administration -->
          <!-- <div class="flex justify-content-center gap-2 mt-4 pt-3 border-top-1 border-white-alpha-10">
            <Button icon="pi pi-pencil" class="p-button-text p-button-warning p-button-sm" v-tooltip.top="'Modifier'" />
            <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" v-tooltip.top="'Supprimer'" />
          </div> -->

        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.discipline-card {
  background: #2a2e35;
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.discipline-card:hover {
  transform: translateY(-5px);
  border-color: var(--card-theme-color);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
}



.discipline-icon {
  object-fit: contain;
}
</style>
