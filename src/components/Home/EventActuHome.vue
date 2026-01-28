<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
// ===============================
// 🔹 ÉTATS
// ===============================
const evenements = ref([]);
const isLoading = ref(true); // Commencer à true
const errorMessage = ref(null);

// ===============================
// 🔹 CONSTANTES D’API
// ===============================
const API_PATH_EVENEMENT = 'Evenement';

// ===============================
// 🔹 FONCTIONS DE GESTION DES DONNÉES
// ===============================
async function fetchEvenement() {
  try {
    isLoading.value = true;
    const reponse = await api.get(API_PATH_EVENEMENT);
    let evenementsAPI = reponse.data;

    // --- LOGIQUE DE TRI ET FILTRAGE ---
    const maintenant = new Date();

    // 1. Filtrer les événements futurs en utilisant la colonne DateDebut
    const evenementsFuturs = evenementsAPI.filter(event => {
      // Utilise la colonne SQL 'DateDebut'
      return new Date(event.dateDebut) >= maintenant;
    });

    // 2. Trier par DateDebut (du plus proche au plus éloigné)
    evenementsFuturs.sort((a, b) => {
      return new Date(a.dateDebut) - new Date(b.dateDebut);
    });

    // 3. Limiter aux 3 événements les plus proches
    evenements.value = evenementsFuturs.slice(0, 3);
    // ----------------------------------

  } catch (error) {
    console.error('❌ Erreur lors du chargement des événements :', error);
    errorMessage.value = "Erreur lors du chargement des événements.";
  } finally {
    isLoading.value = false;
  }
}

// Fonction utilitaire pour formater la date
function formatDate(dateString) {
  if (!dateString) return 'Date non spécifiée';
  // Utilise un format lisible en français
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}


function getIconUrl(disciplineId) {
  const icons = {
    1: 'https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-judo-sport-fitness-vol3-microdots-premium-microdot-graphic.png',
    2: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-aikido-martial-arts-flaticons-lineal-color-flat-icons-3.png',
    3: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-jiu-jitsu-martial-arts-flaticons-lineal-color-flat-icons-3.png',
    4: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-judo-martial-arts-flaticons-lineal-color-flat-icons-3.png',
  };
  return icons[disciplineId] || 'https://img.icons8.com/ios-filled/64/ffffff/star.png';
}

onMounted(fetchEvenement);
</script>


<template>
  <div class="container-fluid p-0 bg-dark text-light ">
    <div class="container my-5">
      <h3 class="text-center text-warning display-5 mb-5">Évènements</h3>
      <div v-if="isLoading" class="text-center text-light p-4">
        Chargement des événements... 🔄
      </div>
      <div v-else-if="errorMessage" class="text-center text-danger p-4">
        {{ errorMessage }}
      </div>
      <div v-else-if="evenements.length === 0" class="text-center text-secondary p-4">
        Aucun événement ou actualité à venir.
      </div>

      <div v-else class="row cards g-3 justify-content-center">
        <div v-for="evenement in evenements" :key="evenement.evenementId" class="col-lg-4 col-md-6 col-sm-12">
          <div class="card h-100">
            <div class="card-body">
              <img class="w-25" :src="getIconUrl(evenement.disciplineId)" alt="logo">
              <p class="card-text mb-1  fw-bold">{{ formatDate(evenement.dateDebut) }}</p>
              <h5 class="card-title text-warning ellipsis-3">{{ evenement.titre || 'Evénement' }}</h5>
              <h6 class="card-text ellipsis-3 ">{{ evenement.lieu || 'Pas de lieu disponible.' }}</h6>
              <router-link :to="`/evenement/${evenement.evenementId}`" class="btn btn-outline-warning btn-sm">
                Voir le détail
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: #343a40;
  padding: 2px;
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
}

.card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.ellipsis-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-clamp: 3;
}
</style>
