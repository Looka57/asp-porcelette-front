<script setup>

import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import { LineChart, BarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import { useDepensesGeneralesChart } from '@/composables/graphDepensesGenerales'
import { useDepensesDisciplinesChart } from '@/composables/graphDepensesDisciplines'

Chart.register(...registerables)

// 🔹 Récupération des données et options
const { depensesData, chartOptions } = useDepensesGeneralesChart()
const { depensesDisciplinesData, chartOptions: chartOptionsDisciplines } = useDepensesDisciplinesChart()

// ===============================
// 🔹 ÉTATS
// ===============================
const comptes = ref([]);
const isLoading = ref(false);
const errorMessage = ref(null);
const loadingChart = ref(true);

const API_PATCH = '/Compte';

async function fetchCompte() {
  try {
    isLoading.value = true;
    const response = await api.get(API_PATCH)
    comptes.value = response.data;
    console.log('Compte recuperer:', comptes.value)
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
  2: 'https://img.icons8.com/bubbles/100/money.png',       // Compte courant
  3: 'https://img.icons8.com/bubbles/100/cash-in-hand.png', // Compte épargne
};
function getIconUrl(compteId) {
  return comptaIcons[compteId] || 'https://img.icons8.com/color/96/money.png';
}



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
    <!-- ══════ Cartes Hautes ══════ -->
    <div class="gestionTransaction-grid">

      <div v-for="compte in comptes.filter(c => c.typeCompte === 1)" :key="compte.compteId"
        class="gestionTransaction-card rounded">
        <h4 class="fs-2">Chiffre d'affaires</h4>
        <img :src="getIconUrl(compte.compteId)" :alt="`Icône ${compte.nom}`" width="100" height="100" class="mb-3" />

        <div>
          <p class="fs-3">{{ compte.nom }}</p>
          <p class="fs-4"> Solde Actuel: {{ compte.solde }} €</p>
        </div>
      </div>
      <div v-for="compte in comptes.filter(c => c.typeCompte === 1)" :key="compte.compteId"
        class="gestionTransaction-card rounded">
        <h4 class="fs-2">Dépenses</h4>
        <img width="100" height="100" src="https://img.icons8.com/bubbles/100/cash-in-hand.png" alt="cash-in-hand" />

        <div>
          <p class="fs-3">Montant Annuel de la depense:<br> 5235.14 € </p>
        </div>
      </div>

    </div>


    <!-- ══════ Graphiques ══════ -->
    <div class="gestionTransactionGraphs">
      <div class="graphs-container">
        <div class="graph-item">
          <h4>Dépenses Mensuelles</h4>
          <LineChart :chartData="depensesData" :options="chartOptions" />
        </div>

        <div class="graph-item">
          <h4>Dépenses par Discipline</h4>
          <BarChart :chartData="depensesDisciplinesData" :options="chartOptionsDisciplines" />
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ══════════════════════════════ */
/* Grid pour les cartes hautes */
/* ══════════════════════════════ */
.gestionTransaction-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  justify-items: center;
}

/* Cartes statistiques */
.gestionTransaction-card {
  background-color: #343a40;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  text-align: center;
  padding: 1.5rem;
  color: #fff;
}

.gestionTransaction-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* ══════════════════════════════ */
/* Grid responsive pour les graphiques */
/* ══════════════════════════════ */
.graphs-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  align-items: stretch;
}

.graph-item {
  background-color: #343a40;
  border-radius: 1rem;
  padding: 1rem;
  height: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* Titres graphiques */
.graph-item h4 {
  color: #fff;
  text-align: center;
  margin-bottom: 1rem;
}

/* ══════════════════════════════ */
/* Mobile */
@media (max-width: 768px) {
  .graph-item {
    height: 350px;
  }
}
</style>
