<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/axios';
import { LineChart, BarChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';

import { useDepensesGeneralesChart } from '@/composables/graphDepensesGenerales';
import { useDepensesDisciplinesChart } from '@/composables/useDepensesDisciplines';

Chart.register(...registerables);

// ===============================
// 🔹 ROUTE & ID DU COMPTE
// ===============================
const route = useRoute();
const currentCompteId = computed(() => parseInt(route.params.compteId));

// ===============================
// 🔹 ÉTATS
// ===============================
const comptes = ref([]);
const transactions = ref([]);
const isLoading = ref(false);
const errorMessage = ref(null);
const loadingChart = ref(true);

const API_PATCH = '/Compte';
const API_TRANSACTIONS = '/Transaction';

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

async function fetchTransactions() {
  try {
    isLoading.value = true;
    const response = await api.get(API_TRANSACTIONS);
    transactions.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

// ===============================
// 🔹 DONNÉES FILTRÉES & CALCULÉES
// ===============================
const currentCompte = computed(() => {
  return comptes.value.find(c => c.compteId === currentCompteId.value);
});

const filteredTransactions = computed(() => {
  return transactions.value.filter(t => t.compte?.compteId === currentCompteId.value);
});

const currentYear = computed(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  return month >= 8 ? year : year - 1;
});

const totalDepensesAnnuelle = computed(() => {
  const annualTransactions = filteredTransactions.value.filter(t =>
    new Date(t.dateTransaction).getFullYear() === currentYear.value
  );

  return annualTransactions
    .filter(t => t.montant < 0)
    .reduce((total, t) => total + Math.abs(t.montant), 0)
    .toLocaleString('fr-FR', { minimumFractionDigits: 2 });
});

// ===============================
// 🔹 COMPOSABLES CHARTS
// ===============================
const { depensesData, chartOptions: chartOptionsGenerales } =
  useDepensesGeneralesChart(filteredTransactions, currentYear);

const { depensesDisciplinesData, chartOptions: chartOptionsDisciplines } =
  useDepensesDisciplinesChart(filteredTransactions, currentYear);

// ===============================
// 🔹 ICONS DYNAMIQUES
// ===============================
const comptaIcons = {
  1: 'https://img.icons8.com/bubbles/100/money.png',
  2: 'https://img.icons8.com/bubbles/100/stack-of-money.png',
};

function getIconUrl(compteId) {
  return comptaIcons[compteId] || 'https://img.icons8.com/color/96/money.png';
}

const depensesIconUrl = 'https://img.icons8.com/bubbles/100/cash-in-hand.png';

// ===============================
// 🔹 MONTAGE
// ===============================
onMounted(async () => {
  await fetchCompte();
  await fetchTransactions();
  setTimeout(() => loadingChart.value = false, 500);
});
</script>

<template>
  <div class="dashboard-container">
    <!-- State: Compte non trouvé ou Chargement -->
    <div v-if="!currentCompte && isLoading" class="state-card loading-state">
      <div class="spinner"></div>
      <span>Chargement des informations du compte...</span>
    </div>

    <div v-else-if="!currentCompte" class="state-card error-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>Compte introuvable ou inaccessible.</p>
    </div>

    <div v-else class="dashboard-content">
      <!-- ══════ Cartes Hautes ══════ -->
      <section class="summary-grid">
        <!-- Carte Solde -->
        <div class="stat-card">
          <div class="card-icon-wrapper">
            <img :src="getIconUrl(currentCompte.compteId)" :alt="`Icône ${currentCompte.nom}`" width="72" height="72" />
          </div>
          <div class="card-info">
            <span class="card-subtitle">Solde Actuel · {{ currentCompte.nom }}</span>
            <div class="card-value font-highlight">{{ currentCompte.solde }} €</div>
          </div>
          <button class="btn-card-action" @click="$router.push(`/admin/comptes/${currentCompte.compteId}`)">
            <span>Voir le détail</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <!-- Carte Dépenses -->
        <div class="stat-card">
          <div class="card-icon-wrapper">
            <img :src="depensesIconUrl" alt="Icône Dépenses" width="72" height="72" />
          </div>
          <div class="card-info">
            <span class="card-subtitle">Dépenses Cumulées (Saison {{ currentYear }})</span>
            <div class="card-value text-danger font-highlight">- {{ totalDepensesAnnuelle }} €</div>
          </div>
          <div class="card-badge">
            Saison en cours
          </div>
        </div>
      </section>

      <!-- ══════ Graphiques ══════ -->
      <section class="charts-section">
        <div v-if="!loadingChart" class="charts-grid">
          <div class="chart-card">
            <div class="chart-header">
              <h3>Dépenses Mensuelles</h3>
              <span class="chart-tag">Saison {{ currentYear }}</span>
            </div>
            <div class="chart-wrapper">
              <LineChart :chartData="depensesData" :options="chartOptionsGenerales" />
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <h3>Dépenses par Discipline</h3>
              <span class="chart-tag">Saison {{ currentYear }}</span>
            </div>
            <div class="chart-wrapper">
              <BarChart :chartData="depensesDisciplinesData" :options="chartOptionsDisciplines" />
            </div>
          </div>
        </div>

        <!-- Loader pour graphiques -->
        <div v-else class="chart-loading-card">
          <div class="spinner"></div>
          <span>Génération des graphiques financiers...</span>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* ===============================
   🔹 LAYOUT PRINCIPAL
   =============================== */
.dashboard-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeIn 0.3s ease-out;
}

/* ===============================
   🔹 CARTES DE SYNTHÈSE (GRID)
   =============================== */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: #1e2126;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 187, 51, 0.3);
}

.card-icon-wrapper {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1.25rem;
}

.card-subtitle {
  font-size: 0.85rem;
  font-weight: 500;
  color: #8a919e;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.card-value {
  font-size: 2.1rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.font-highlight {
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
}

.text-danger {
  color: #ff4757;
}

.card-badge {
  align-self: flex-start;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.06);
  color: #a0a6b1;
  padding: 0.35rem 0.75rem;
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.btn-card-action {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f1f3f5;
  padding: 0.65rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-card-action:hover {
  background: #ffbb33;
  color: #121417;
  border-color: #ffbb33;
}

/* ===============================
   🔹 SECTION GRAPHIQUES
   =============================== */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(440px, 1fr));
  gap: 1.5rem;
}

.chart-card {
  background: #1e2126;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.chart-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.chart-tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: #ffbb33;
  background: rgba(255, 187, 51, 0.1);
  padding: 0.25rem 0.6rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(255, 187, 51, 0.2);
}

.chart-wrapper {
  position: relative;
  height: 340px;
  width: 100%;
}

/* ===============================
   🔹 ÉTATS DE CHARGEMENT & ERREUR
   =============================== */
.state-card, .chart-loading-card {
  background: #1e2126;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #8a919e;
  font-size: 0.95rem;
}

.error-state {
  color: #ff4757;
  border-color: rgba(255, 71, 87, 0.2);
  background: rgba(255, 71, 87, 0.05);
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(255, 187, 51, 0.15);
  border-top-color: #ffbb33;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  .chart-wrapper {
    height: 260px;
  }
}
</style>
