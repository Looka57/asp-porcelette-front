<script setup>
import { ref, onMounted, computed } from 'vue';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
import api from '@/api/axios';
import { useFluxComptaChart } from '@/composables/comptaChartFlux';

Chart.register(...registerables);

// 🔹 États
const comptes = ref([]);
const transactions = ref([]);
const isLoading = ref(false);
const errorMessage = ref(null);
const loadingChart = ref(true);

// 🔹 API
const API_COMPTES = '/Compte';
const API_TRANSACTIONS = '/Transaction';

// 🔹 Fonctions API
async function fetchComptes() {
  try {
    isLoading.value = true;
    const res = await api.get(API_COMPTES);
    comptes.value = res.data;
  } catch (err) {
    console.error(err);
    errorMessage.value = "Erreur lors du chargement des comptes.";
  } finally {
    isLoading.value = false;
  }
}

async function fetchTransactions() {
  try {
    const res = await api.get(API_TRANSACTIONS);
    transactions.value = res.data;
  } catch (err) {
    console.error(err);
    errorMessage.value = "Erreur lors du chargement des transactions.";
  }
}

// 🔹 Calcul de l'année de référence
const currentYearGlobal = computed(() => {
  if (transactions.value.length === 0) return new Date().getFullYear();
  const latestDate = transactions.value.reduce((latest, t) => {
    const d = new Date(t.dateTransaction);
    return isNaN(d.getTime()) ? latest : (d > latest ? d : latest);
  }, new Date(0));
  return latestDate.getFullYear();
});

// 🔹 Icônes
const comptaIcons = {
  1: 'https://img.icons8.com/bubbles/100/bank.png',
  2: 'https://img.icons8.com/bubbles/100/stack-of-money.png',
};
function getIconUrl(compteId) {
  return comptaIcons[compteId] || 'https://img.icons8.com/color/96/money.png';
}

// 🔹 Graphique
const { fluxComptaChart, chartOptions } = useFluxComptaChart(transactions, comptes, currentYearGlobal);

// 🔹 Montage
// <script setup> (dans votre composant principal)
// ...
// 🔹 Montage
onMounted(async () => {
  loadingChart.value = true;
  // Ceci est crucial : on attend que les données soient fetchées
  await Promise.all([fetchComptes(), fetchTransactions()]);
  // Le watch s'exécute, puis on désactive le loading
  setTimeout(() => loadingChart.value = false, 500);
});
// ...
</script>

<template>
<div class="container-fluid py-4">
  <div v-if="isLoading || loadingChart" class="text-center text-light p-4">
    <p>Chargement des données...</p>
  </div>

  <div v-else-if="errorMessage" class="text-center text-danger p-4">
    <p>{{ errorMessage }}</p>
  </div>

  <div v-else>
    <div class="row g-4">
      <div v-for="compte in comptes" :key="compte.compteId" class="col-sm-12 col-md-12 col-lg-6">
        <router-link :to="{ name: 'admin-transactions-gestion', params: { compteId: compte.compteId } }" class="card-link">
          <div class="compta-card text-center p-4">
            <img :src="getIconUrl(compte.compteId)" :alt="`Icône ${compte.nom}`" width="100" height="100" class="mb-3" />
            <h3 class="compte-nom mb-2">{{ compte.nom }}</h3>
            <p class="compte-solde mb-0 fs-3">{{ compte.solde }} €</p>
          </div>
        </router-link>
      </div>
    </div>

    <div class="row mt-5 g-4">
      <div class="col-lg-12">
        <div class="card bg-secondary text-white shadow-lg border-0 rounded-3 p-4 h-100">
          <h4 class="card-title mb-3 text-center">Évolution des Flux Financiers: {{ currentYearGlobal }}</h4>
          <div class="chart-container">
            <LineChart :chartData="fluxComptaChart" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>

    <pre class="text-white mt-4">Année de référence : {{ currentYearGlobal }}</pre>
  </div>
</div>
</template>

<style scoped>
.card-link { text-decoration: none; color: inherit; display: block; height: 100%; }
.compta-card { background-color: #343a40; border-radius: 1rem; color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.4); transition: transform 0.2s ease, box-shadow 0.2s ease; }
.compta-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0,0,0,0.5); }
.compte-nom { font-size: 1.2rem; font-weight: 600; }
.compte-solde { color: #facc15; font-weight: 500; }
.chart-container { position: relative; width: 100%; height: 100%; min-height: 350px; }
</style>


<style scoped>
.card-link {
 text-decoration: none;
 color: inherit;
 display: block;
 height: 100%;
}

.card {
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
 min-height: 350px;
}
</style>
