<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

const disciplines = ref([])
const tarifs = ref([])
const isLoading = ref(false)
const errorMessage = ref(null)

const API_PATH_DISCIPLINE = '/Discipline'
const API_PATH_TARIF = '/Tarif'

async function fetchDisciplines() {
  try {
    isLoading.value = true
    const res = await api.get(API_PATH_DISCIPLINE)
    disciplines.value = res.data
  } catch (err) {
    console.error(err)
    errorMessage.value = "Erreur lors du chargement des disciplines."
  } finally {
    isLoading.value = false
  }
}

async function fetchTarifs() {
  try {
    isLoading.value = true
    const res = await api.get(API_PATH_TARIF)
    tarifs.value = res.data
  } catch (err) {
    console.error(err)
    errorMessage.value = "Erreur lors du chargement des tarifs."
  } finally {
    isLoading.value = false
  }
}

// Fonction pour regrouper les tarifs par période pour une discipline
function groupTarifsByPeriod(disciplineId) {
  const tarifsDiscipline = tarifs.value.filter(t => t.disciplineId === disciplineId)
  const grouped = {}

  tarifsDiscipline.forEach(t => {
    if (!grouped[t.periodicite]) grouped[t.periodicite] = []
    grouped[t.periodicite].push({ nom: t.nom, montant: t.montant })
  })

  return grouped
}

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

onMounted(() => {
  fetchDisciplines()
  fetchTarifs()
})
</script>

<template>
  <div class="container-fluid py-4">
    <div v-if="isLoading" class="text-center text-light p-4">Chargement...</div>
    <div v-else-if="errorMessage" class="text-center text-danger p-4">{{ errorMessage }}</div>

    <div v-else class="discipline-grid">
      <div v-for="discipline in disciplines" :key="discipline.disciplineId" class="discipline-card p-4 rounded">
        <div class="discipline-header d-flex justify-content-center align-items-center mb-3">
          <img :src="getIconUrl(discipline.disciplineId)" width="48" height="48" class="me-3" />
          <h3 class="mb-0 text-warning">{{ discipline.nom }}</h3>
        </div>

        <!-- Tarifs regroupés par période -->
        <div class="tarifs-container d-flex flex-column gap-2">
          <div v-for="(tarifsPerPeriod, period) in groupTarifsByPeriod(discipline.disciplineId)" :key="period" class="tarif-card p-3 rounded">
            <h5 class="period-title mb-2 text-light">{{ period }}</h5>
            <div class="d-flex flex-wrap gap-2">
              <div v-for="tarif in tarifsPerPeriod" :key="tarif.nom" class="tarif-mini p-2 rounded bg-dark ">
                {{ tarif.nom }} : {{ tarif.montant }} €
              </div>
            </div>
          </div>
        </div>

        <p v-if="tarifs.filter(t => t.disciplineId === discipline.disciplineId).length === 0" class="text-muted mt-2">
          Aucun tarif disponible
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.discipline-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.discipline-card {
  background-color: #2c2f33;
  color: #fff;
  box-shadow: 0 6px 15px rgba(0,0,0,0.3);
  width: 100%;
  transition: transform 0.3s ease;
}

.discipline-card:hover {
  transform: translateY(-5px);
}

.discipline-header img {
  border-radius: 50%;
}

.tarif-card {
  background-color: rgba(255,255,255,0.05);
}

.tarif-mini {
  min-width: 100px;
  text-align: center;
  font-weight: 600;
  padding: 0.3rem 0.5rem;
}
</style>
