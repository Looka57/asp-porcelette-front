<script setup>

import { ref, onMounted } from 'vue';
import api from '@/api/axios';

import Badge from 'primevue/badge';
import Tag from 'primevue/tag';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';

const disciplines = ref([]);
const isLoading = ref(false);
const errorMessage = ref(null);

const API_PATH_DISCIPLINE = '/Discipline';

// ===============================
// 🔹 COULEURS DES DISCIPLINES
// ===============================
const disciplineColors = {
  Judo: '#FF6384',
  Aïkido: '#3B82F6',
  Jujitsu: '#10B981',
  'Judo Détente': '#efd844',
};

async function fetchDisciplines() {
  isLoading.value = true;
  try {
    const res = await api.get(API_PATH_DISCIPLINE);
    disciplines.value = res.data || [];
  } catch (error) {
    console.error('❌ Erreur :', error);
    errorMessage.value = "Erreur lors du chargement des disciplines.";
  } finally {
    isLoading.value = false;
  }
}

// ===============================
// 🔹 ICÔNES PAR DÉFAUT
// ===============================
const disciplineIcons = {
  1: 'https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-judo-sport-fitness-vol3-microdots-premium-microdot-graphic.png',
  2: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-aikido-martial-arts-flaticons-lineal-color-flat-icons-3.png',
  3: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-jiu-jitsu-martial-arts-flaticons-lineal-color-flat-icons-3.png',
  4: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-judo-martial-arts-flaticons-lineal-color-flat-icons-3.png',
};

function getIconUrl(disciplineId) {
  const defaultIcon = 'https://img.icons8.com/color/96/martial-arts.png';
  return disciplineIcons[disciplineId] || defaultIcon;
}

// Nettoyage du format d'heure (Ex: "18:30:00" -> "18h30")
function formatTime(timeStr) {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  if (parts.length >= 2) {
    return `${parts[0]}h${parts[1]}`;
  }
  return timeStr;
}

onMounted(fetchDisciplines);
</script>

<template>
  <div class="py-5 px-3 md:px-6 surface-ground min-vh-100 text-white">

    <!-- En-tête de page -->
    <div class="text-center mb-6">
      <Badge value="Saison en cours" severity="warning" class="mb-2 uppercase tracking-wider font-semibold" />
      <h1 class="text-4xl font-bold text-white mb-2 flex align-items-center justify-content-center gap-3">
        <i class="pi pi-calendar-plus text-warning text-3xl"></i> Planning & Disciplines
      </h1>
      <p class="text-400 text-lg m-0 max-w-2xl mx-auto">
        Consultez l'ensemble des cours dispensés et leurs horaires d'entraînement par discipline.
      </p>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="flex flex-column align-items-center justify-content-center py-8">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      <span class="text-500 mt-3 font-medium">Chargement des plannings...</span>
    </div>

    <!-- Message d'erreur -->
    <Message v-else-if="errorMessage" severity="error" :closable="false" class="max-w-md mx-auto mb-5">
      {{ errorMessage }}
    </Message>

    <!-- Liste des disciplines -->
    <div v-else class="max-w-7xl mx-auto flex flex-column gap-6">
      <div v-for="discipline in disciplines" :key="discipline.disciplineId"
        class="discipline-block p-4 md:p-5 border-round-xl border-1 surface-border">
        <!-- Header discipline -->
        <div
          class="flex flex-column sm:flex-row align-items-center justify-content-between mb-4 pb-3 border-bottom-1 border-white-alpha-10 gap-3">
          <div class="flex align-items-center gap-3">
            <div class="icon-wrapper p-3 border-round-circle flex align-items-center justify-content-center">
              <img :src="getIconUrl(discipline.disciplineId)" :alt="`Icône ${discipline.nom}`"
                class="discipline-icon" />
            </div>
            <div class="text-center sm:text-left">
              <!-- TITRE DE LA DISCIPLINE COUPLÉ À SA COULEUR -->
              <h2
                class="text-2xl font-bold m-0 flex align-items-center justify-content-center sm:justify-content-start gap-2"
                :style="{ color: disciplineColors[discipline.nom] || '#FFC107' }">
                {{ discipline.nom }}
              </h2>
              <span class="text-400 text-sm">
                {{ discipline.cours?.length || 0 }} cours disponible(s)
              </span>
            </div>
          </div>

          <Tag :value="`${discipline.cours?.length || 0} Cours`" severity="warning" class="px-3 py-1 font-bold" />
        </div>

        <!-- Aucun cours disponible -->
        <div v-if="!discipline.cours || discipline.cours.length === 0" class="text-center py-5 text-500">
          <i class="pi pi-calendar-times text-3xl mb-2 block"></i>
          <span>Aucun cours planifié pour le moment dans cette discipline.</span>
        </div>

        <!-- Grille des cours -->
        <div v-else class="grid">
          <div v-for="cours in discipline.cours" :key="cours.coursId" class="col-12 md:col-6 lg:col-4 flex">
            <div
              class="cours-card w-full p-4 border-round-xl flex flex-column justify-content-between position-relative overflow-hidden"
              :style="{ borderLeft: `5px solid ${disciplineColors[discipline.nom] || '#FFC107'}` }">
              <div>
                <div class="flex align-items-center justify-content-between mb-3">
                  <!-- TITRE DU COURS AVEC LA COULEUR DE LA DISCIPLINE -->
                  <h3 class="text-lg font-bold m-0">
                    {{ cours.libelle }}
                  </h3>
                  <i class="pi pi-bookmark text-warning text-sm"></i>
                </div>

                <!-- Liste des horaires -->
                <div v-if="cours.horaires && cours.horaires.length > 0" class="flex flex-column gap-2 mt-3">
                  <div v-for="horaire in cours.horaires" :key="horaire.horaireId"
                    class="horaire-item p-2 px-3 border-round-lg flex align-items-center justify-content-between">
                    <span class="font-semibold text-warning flex align-items-center gap-2 text-sm">
                      <i class="pi pi-calendar text-xs"></i> {{ horaire.jour }}
                    </span>
                    <span
                      class="font-mono text-xs text-300 bg-black-alpha-30 px-2 py-1 border-round flex align-items-center gap-1">
                      <i class="pi pi-clock text-xs text-warning"></i>
                      {{ formatTime(horaire.heureDebut) }} - {{ formatTime(horaire.heureFin) }}
                    </span>
                  </div>
                </div>

                <div v-else class="text-xs text-400 my-2 italic">
                  Aucun horaire renseigné.
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
/* Section principale par discipline */
.discipline-block {
  background: #2a2e35;
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}


.discipline-icon {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

/* Carte d'un cours */
.cours-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.25s ease-in-out;
}

.cours-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
}

/* Élément d'horaire */
.horaire-item {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
