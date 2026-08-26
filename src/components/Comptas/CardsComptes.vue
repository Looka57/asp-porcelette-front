<script setup>
import { ref, onMounted, computed } from 'vue';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
import api from '@/api/axios';
import { useFluxComptaChart } from '@/composables/comptaChartFlux';

Chart.register(...registerables);

// ===============================
// 🔹 ÉTATS
// ===============================
const comptes = ref([]);
const transactions = ref([]);
const isLoading = ref(false);
const errorMessage = ref(null);
const loadingChart = ref(true);

// ===============================
// 🔹 API
// ===============================
const API_COMPTES = '/Compte';
const API_TRANSACTIONS = '/Transaction';

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

// ===============================
// 🔹 CALCULS DE SAISON
// ===============================
const currentYearGlobal = computed(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  return month >= 8 ? year : year - 1;
});

const currentSeasonLabel = computed(() => {
  return `${currentYearGlobal.value}-${currentYearGlobal.value + 1}`;
});

// ===============================
// 🔹 ICÔNES DYNAMIQUES
// ===============================
const comptaIcons = {
  1: 'https://img.icons8.com/bubbles/100/bank.png',
  2: 'https://img.icons8.com/bubbles/100/stack-of-money.png',
};

function getIconUrl(compteId) {
  return comptaIcons[compteId] || 'https://img.icons8.com/color/96/money.png';
}

// ===============================
// 🔹 COMPOSABLE CHART
// ===============================
const { fluxComptaChart, chartOptions } = useFluxComptaChart(transactions, comptes, currentYearGlobal);

// ===============================
// 🔹 MONTAGE
// ===============================
onMounted(async () => {
  loadingChart.value = true;
  await Promise.all([fetchComptes(), fetchTransactions()]);
  setTimeout(() => loadingChart.value = false, 500);
});
</script>

<template>
  <div class="cards-comptes-container">
    <!-- State: Chargement global -->
    <div v-if="isLoading || loadingChart" class="state-card loading-state">
      <div class="spinner"></div>
      <span>Chargement des données comptables...</span>
    </div>

    <!-- State: Erreur -->
    <div v-else-if="errorMessage" class="state-card error-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Content -->
    <div v-else class="cards-comptes-content">
      <!-- ══════ Grid des Comptes ══════ -->
      <section class="comptes-grid">
        <router-link
          v-for="compte in comptes"
          :key="compte.compteId"
          :to="{ name: 'admin-transactions-gestion', params: { compteId: compte.compteId } }"
          class="card-link"
        >
          <div class="stat-card">
            <!-- Zone Icône centrée au-dessus -->
            <div class="card-icon-wrapper">
              <img
                :src="getIconUrl(compte.compteId)"
                :alt="`Icône ${compte.nom}`"
                width="84"
                height="84"
                class="card-top-icon"
              />
            </div>

            <div class="card-info">
              <span class="card-subtitle">{{ compte.nom }}</span>
              <div class="card-value font-highlight">{{ compte.solde }} €</div>
            </div>

            <div class="btn-card-action">
              <span>Gérer le compte</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        </router-link>
      </section>

      <!-- ══════ Graphique Évolution ══════ -->
      <section class="chart-section">
        <div class="chart-card">
          <div class="chart-header">
            <h3>Évolution des Flux Financiers</h3>
            <span class="chart-tag">Saison {{ currentSeasonLabel }}</span>
          </div>

          <div class="chart-wrapper">
            <LineChart :chartData="fluxComptaChart" :options="chartOptions" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* ===============================
   🔹 LAYOUT PRINCIPAL
   =============================== */
.cards-comptes-container {
  width: 100%;
}

.cards-comptes-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: fadeIn 0.3s ease-out;
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

/* ===============================
   🔹 GRID COMPTES
   =============================== */
.comptes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: #1b1d22;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.75rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, border-color 0.2s ease;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 187, 51, 0.3);
}

/* Icône au-dessus */
.card-icon-wrapper {
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-top-icon {
  width: 84px;
  height: 84px;
  object-fit: contain;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.25));
}

.card-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
  width: 100%;
}

.card-subtitle {
  font-size: 0.95rem;
  font-weight: 600;
  color: #8a919e;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.card-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: #ffbb33;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.font-highlight {
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
}

.btn-card-action {
  display: flex;
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
  transition: all 0.2s ease;
  margin-top: auto;
}

.stat-card:hover .btn-card-action {
  background: #ffbb33;
  color: #121417;
  border-color: #ffbb33;
}

/* ===============================
   🔹 GRAPHIQUE
   =============================== */
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
  height: 380px;
  width: 100%;
}

/* ===============================
   🔹 ÉTATS ET ANIMATIONS
   =============================== */
.state-card {
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
@media (max-width: 640px) {
  .chart-wrapper {
    height: 280px;
  }
  .comptes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
