<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue';
import { LineChart, DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
import api from '@/api/axios';

// 💡 Composables
import { useFluxComptaChart } from '@/composables/comptaChartFlux';
import { useDepensesDisciplines } from '@/composables/useDepensesDisciplines';

// 🔹 Chart.js
Chart.register(...registerables);

// ===============================
// 🔹 ÉTATS
// ===============================
const comptes = ref([]);
const isLoading = ref(false);
const errorMessage = ref(null);
const loadingChart = ref(true);

// ===============================
// 🔹 API
// ===============================
const API_PATCH = '/Compte';

async function fetchCompte() {
  try {
    isLoading.value = true;
    const response = await api.get(API_PATCH);
    comptes.value = response.data;
  } catch (error) {
    console.error('❌ Erreur lors du chargement des comptes :', error);
    errorMessage.value = "Erreur lors du chargement des comptes.";
  } finally {
    isLoading.value = false;
  }
}

// ===============================
// 🔹 ICONES PAR DÉFAUT
// ===============================
const comptaIcons = {
  2: 'https://img.icons8.com/bubbles/100/bank.png',       // Compte courant
  3: 'https://img.icons8.com/bubbles/100/stack-of-money.png', // Compte épargne
};
function getIconUrl(compteId) {
  return comptaIcons[compteId] || 'https://img.icons8.com/color/96/money.png';
}

// ===============================
// 🔹 GRAPHIQUES
// ===============================
const { fluxComptaChart, chartOptions } = useFluxComptaChart();
const { depensesChart, chartOptions: depensesOptions } = useDepensesDisciplines();

// ===============================
// 🔹 MONTAGE
// ===============================
onMounted(async () => {
  await fetchCompte();
  setTimeout(() => loadingChart.value = false, 500);
});
</script>

<template>
  <div class="container-fluid py-4">
    <!-- 🔄 Chargement -->
    <div v-if="isLoading" class="text-center text-light p-4">
      <p>Chargement des comptes...</p>
    </div>

    <!-- ❌ Erreur -->
    <div v-else-if="errorMessage" class="text-center text-danger p-4">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- ✅ Comptes -->
    <div v-else>
      <div class="row g-4">
        <div v-for="compte in comptes" :key="compte.compteId" class="col-sm-12 col-md-12 col-lg-6">
          <router-link :to="{ name: 'admin-transactions-gestion', params: { compteId: compte.compteId } }"
            class="card-link">
            <div class="compta-card text-center p-4">
              <img :src="getIconUrl(compte.compteId)" :alt="`Icône ${compte.nom}`" width="100" height="100"
              class="mb-3" />
              <h3 class="compte-nom mb-2 ">{{ compte.nom }}</h3>
              <p class="compte-solde mb-0 fs-3">{{ compte.solde }} €</p>
            </div>
          </router-link>
        </div>
      </div>

      <!-- 📊 Graphiques -->
      <div class="row mt-5 g-4">
        <!-- Ligne chart -->
        <div class="col-lg-8">
          <div class="card bg-secondary text-white shadow-lg border-0 rounded-3 p-4 h-100">
            <h4 class="card-title mb-3 text-center">Évolution des Flux Financiers</h4>
            <div class="chart-container">
              <LineChart :chartData="fluxComptaChart" :options="chartOptions" />
            </div>
          </div>
        </div>

        <!-- Doughnut chart -->
        <div class="col-lg-4">
          <div class="card bg-secondary text-white shadow-lg border-0 rounded-3 p-4 h-100">
            <h4 class="card-title mb-3 text-center">Dépenses par Discipline</h4>
            <div class="chart-container">
              <DoughnutChart :chartData="depensesChart" :options="depensesOptions" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>

.card-link {
    text-decoration: none; /* Supprime le soulignement */
    color: inherit; /* Utilise la couleur du texte parent (blanc) */
    display: block; /* Important: s'assure que le lien prend toute la largeur de la colonne */
    height: 100%; /* S'assure que le lien englobe toute la carte */
}

.card{
  background-color: #343a40 !important;
  border-radius: 1rem;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}
.compta-card {
  background-color: #343a40;
  border-radius: 1rem;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.compta-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
}

.compte-nom {
  font-size: 1.2rem;
  font-weight: 600;
}

.compte-solde {
  color: #facc15;
  font-weight: 500;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 350px; /* garde une belle taille sur mobile */
}
</style>
