<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Tooltip from 'primevue/tooltip'

// Si vous utilisez la directive v-tooltip de PrimeVue,
// vous pouvez l'enregistrer localement ou globalement (selon votre configuration) :
const vTooltip = Tooltip

// ===============================
// 🔹 ÉTATS
// ===============================
const disciplines = ref([])
const tarifs = ref([])
const isLoading = ref(false)
const errorMessage = ref(null)

// ===============================
// 🔹 CONSTANTES D’API
// ===============================
const API_PATH_DISCIPLINE = '/Discipline'
const API_PATH_TARIF = '/Tarif'

// ===============================
// 🔹 COULEURS DES DISCIPLINES
// ===============================
const disciplineColors = {
  Judo: '#FF6384',
  Aïkido: '#3B82F6',
  Jujitsu: '#10B981',
  'Judo Détente': '#efd844ff'
}

function getDisciplineColor(nom) {
  return disciplineColors[nom] || '#FFC107'
}

// ===============================
// 🔹 CHARGEMENT DES DONNÉES
// ===============================
async function loadData() {
  isLoading.value = true
  errorMessage.value = null
  try {
    const [resDisciplines, resTarifs] = await Promise.all([
      api.get(API_PATH_DISCIPLINE),
      api.get(API_PATH_TARIF)
    ])
    disciplines.value = resDisciplines.data
    tarifs.value = resTarifs.data
  } catch (err) {
    console.error('❌ Erreur lors du chargement :', err)
    errorMessage.value = "Erreur lors du chargement des données de tarification."
  } finally {
    isLoading.value = false
  }
}

// ===============================
// 🔹 REGROUPEMENT DES TARIFS
// ===============================
function groupTarifsByPeriod(disciplineId) {
  const tarifsDiscipline = tarifs.value.filter(t => t.disciplineId === disciplineId)
  const grouped = {}

  tarifsDiscipline.forEach(t => {
    if (!grouped[t.periodicite]) grouped[t.periodicite] = []
    grouped[t.periodicite].push({ nom: t.nom, montant: t.montant })
  })

  return grouped
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

onMounted(loadData)
</script>

<template>
  <div class="py-5 px-3 md:px-6 surface-ground min-vh-100 text-white">

    <!-- En-tête -->
    <div class="text-center mb-6">
      <h1 class="text-4xl font-bold text-warning mb-2 flex align-items-center justify-content-center gap-3">
        <i class="pi pi-tags text-3xl"></i> Grille Tarifaire
      </h1>
      <p class="text-400 text-lg m-0">Retrouvez les cotisations et formules d'abonnement par discipline.</p>
    </div>

    <!-- 🔄 Chargement -->
    <div v-if="isLoading" class="flex flex-column align-items-center justify-content-center py-8">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      <span class="text-500 mt-3 font-medium">Chargement des tarifs...</span>
    </div>

    <!-- ❌ Erreur -->
    <Message v-else-if="errorMessage" severity="error" :closable="false" class="max-w-md mx-auto mb-5">
      {{ errorMessage }}
    </Message>

    <!-- ✅ Liste des disciplines et leurs tarifs -->
    <div v-else class="max-w-7xl mx-auto grid grid-nogutter gap-4 justify-content-center">
      <div
        v-for="discipline in disciplines"
        :key="discipline.disciplineId"
        class="col-12 sm:col-6 lg:col-4 flex"
      >
        <div
          class="discipline-card w-full p-4 border-round-xl border-1 flex flex-column justify-content-between"
          :style="{ '--card-theme-color': getDisciplineColor(discipline.nom) }"
        >
          <div>
            <!-- Header carte discipline -->
            <div class="flex align-items-center gap-3 mb-4 pb-3 border-bottom-1 border-white-alpha-10">
              <div
                class="icon-wrapper p-2 border-round-circle flex align-items-center justify-content-center flex-shrink-0"
              >
                <img :src="getIconUrl(discipline.disciplineId)" :alt="discipline.nom" width="40" height="40" />
              </div>
              <h3
                class="text-2xl font-bold m-0"
                :style="{ color: getDisciplineColor(discipline.nom) }"
              >
                {{ discipline.nom }}
              </h3>
            </div>

            <!-- Tarifs regroupés par période -->
            <div
              v-if="Object.keys(groupTarifsByPeriod(discipline.disciplineId)).length > 0"
              class="flex flex-column gap-3"
            >
              <div
                v-for="(tarifsPerPeriod, period) in groupTarifsByPeriod(discipline.disciplineId)"
                :key="period"
                class="period-box p-3 border-round-lg"
              >
                <div class="flex align-items-center gap-2 mb-2">
                  <i class="pi pi-calendar text-xs text-400"></i>
                  <span class="text-xs font-semibold text-400 uppercase tracking-wider">{{ period }}</span>
                </div>

                <div class="flex flex-column gap-2">
                  <div
                    v-for="tarif in tarifsPerPeriod"
                    :key="tarif.nom"
                    class="tarif-item p-2 border-round-md flex align-items-center justify-content-between"
                  >
                    <span class="text-sm text-200 font-medium">{{ tarif.nom }}</span>
                    <Tag
                      severity="warning"
                      class="font-bold text-sm px-2 py-1"
                      :style="{ backgroundColor: getDisciplineColor(discipline.nom), color: '#1e222a' }"
                    >
                      {{ tarif.montant }} €
                    </Tag>
                  </div>
                </div>
              </div>
            </div>

            <!-- Aucun tarif disponible -->
            <div v-else class="text-center py-4 text-500 italic">
              <i class="pi pi-info-circle text-2xl mb-2 block"></i>
              <span>Aucun tarif renseigné pour cette discipline.</span>
            </div>
          </div>

          <!-- Actions d'administration -->
          <div class="flex justify-content-end gap-2 mt-4 pt-3 border-top-1 border-white-alpha-10">
            <Button icon="pi pi-plus" class="p-button-text p-button-warning p-button-sm" v-tooltip.top="'Ajouter un tarif'" />
          </div>

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
}

.period-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.tarif-item {
  background: rgba(0, 0, 0, 0.2);
}
</style>
