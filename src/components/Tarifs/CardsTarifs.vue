<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue'
import api from '@/api/axios'

// ===============================
// 🔹 ÉTATS
// ===============================
const disciplines = ref([])
const tarifs = ref([]);
const isLoading = ref(false)
const errorMessage = ref(null)

// ===============================
// 🔹 CONSTANTES D’API
// ===============================
const API_PATH_DISCIPLINE = '/Discipline'
const API_PATH_TARIF = '/Tarif'

// ===============================
// 🔹 FONCTIONS
// ===============================
async function fetchDisciplines() {
  try {
    isLoading.value = true
    const response = await api.get(API_PATH_DISCIPLINE)
    disciplines.value = response.data
    console.log('✅ Disciplines chargées :', disciplines.value)
  } catch (error) {
    console.error('❌ Erreur lors du chargement des disciplines :', error)
    errorMessage.value = "Erreur lors du chargement des disciplines."
  } finally {
    isLoading.value = false
  }
}

async function fetchTarifs() {
  try {
    isLoading.value = true
    const reponse = await api.get(API_PATH_TARIF)
    tarifs.value = reponse.data
    console.log('✅ Tarifs chargées :', tarifs.value)
  } catch (error) {
    console.error('❌ Erreur lors du chargement des tarifs :', error)
    errorMessage.value = "Erreur lors du chargement des tarifs."
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

// ===============================
// 🔹 MONTAGE
// ===============================
onMounted(() => {
  fetchDisciplines()
  fetchTarifs()
})

</script>

<template>
  <div class="container-fluid py-4">

    <!-- 🔄 Chargement -->
    <div v-if="isLoading" class="text-center text-light p-4">
      <p>Chargement des disciplines...</p>
    </div>

    <!-- ❌ Erreur -->
    <div v-else-if="errorMessage" class="text-center text-danger p-4">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- ✅ Liste des disciplines -->
  <!-- ✅ Liste des disciplines -->
<div v-else class="discipline-grid">
  <div
    v-for="discipline in disciplines"
    :key="discipline.disciplineId"
    class="discipline-card text-white p-4 rounded d-flex flex-column align-items-center"
  >
    <h3 class="mb-3">{{ discipline.nom }}</h3>
    <img
      width="64"
      height="64"
      :src="getIconUrl(discipline.disciplineId)"
      :alt="`Icône ${discipline.nom}`"
      class="mb-3"
    />

    <!-- Liste des tarifs pour cette discipline -->
    <div
      v-for="tarif in tarifs.filter(t => t.disciplineId === discipline.disciplineId)"
      :key="tarif.tarifId"
      class="tarif-block text-center mb-3 w-100"
    >
      <h5 class="tarif-periode mb-1 text-warning">
        {{ tarif.periodicite }}
      </h5>
      <p class="tarif-nom mb-0">
        {{ tarif.nom }}
      </p>
      <p class="tarif-montant fw-bold">
        {{ tarif.montant }} €
      </p>

      <!-- Trait entre les périodes -->
      <hr class="tarif-separator w-75 mx-auto" />
    </div>

    <!-- Aucun tarif -->
    <p
      v-if="tarifs.filter(t => t.disciplineId === discipline.disciplineId).length === 0"
      class="text-muted mt-2"
    >
      Aucun tarif disponible.
    </p>
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
/* ======================================================
🎨 STYLE DE LA SECTION DES DISCIPLINES
===================================================== */

.discipline-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  justify-items: center;
  align-items: stretch;
}

.discipline-card {
  background-color: #343a40;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  text-align: center;
}

.discipline-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.tarif-block {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
}

.tarif-periode {
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: capitalize;
}

.tarif-nom {
  font-size: 0.9rem;
  opacity: 0.9;
}

.tarif-montant {
  font-size: 1rem;
  color: #ffd700; /* or whatever fits ton thème */
}

.tarif-separator {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  margin-top: 0.5rem;
}




</style>
