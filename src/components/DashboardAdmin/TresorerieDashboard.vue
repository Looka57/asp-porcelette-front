<script setup>

import { ref, computed, onMounted } from 'vue';

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

const loading = ref(true);
const errorMessage = ref(null);

// ===============================
// 🔹 SAISON
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
// 🔹 CHARGEMENT DES DONNÉES
// ===============================

const fetchData = async () => {

  try {

    loading.value = true;
    errorMessage.value = null;

    const [comptesResponse, transactionsResponse] = await Promise.all([
      api.get('/Compte'),
      api.get('/Transaction')
    ]);

    comptes.value = comptesResponse.data || [];
    transactions.value = transactionsResponse.data || [];

  } catch (err) {

    console.error(err);

    errorMessage.value =
      'Erreur lors du chargement des données comptables.';

  } finally {

    loading.value = false;

  }

};

// ===============================
// 🔹 CALCULS
// ===============================

const totalSolde = computed(() => {

  return comptes.value.reduce(
    (total, compte) =>
      total + (parseFloat(compte.solde) || 0),
    0
  );

});

const totalRecettes = computed(() => {

  return transactions.value
    .filter(transaction => {

      const montant = parseFloat(transaction.montant) || 0;

      return montant > 0 &&
        isTransactionInCurrentSeason(transaction);

    })
    .reduce(
      (total, transaction) =>
        total + (parseFloat(transaction.montant) || 0),
      0
    );

});

const totalDepenses = computed(() => {

  return transactions.value
    .filter(transaction => {

      const montant = parseFloat(transaction.montant) || 0;

      return montant < 0 &&
        isTransactionInCurrentSeason(transaction);

    })
    .reduce(
      (total, transaction) =>
        total + Math.abs(parseFloat(transaction.montant) || 0),
      0
    );

});

// ===============================
// 🔹 FILTRE SAISON
// ===============================

function isTransactionInCurrentSeason(transaction) {

  if (!transaction?.dateTransaction) {
    return false;
  }

  const dateOnly =
    transaction.dateTransaction.split('T')[0];

  const [year, month, day] =
    dateOnly.split('-').map(Number);

  if (!year || !month || !day) {
    return false;
  }

  const date = new Date(year, month - 1, day);

  const seasonStart =
    new Date(currentYearGlobal.value, 8, 1);

  const seasonEnd =
    new Date(currentYearGlobal.value + 1, 5, 30);

  return date >= seasonStart && date <= seasonEnd;

}

// ===============================
// 🔹 DERNIÈRES TRANSACTIONS
// ===============================

const latestTransactions = computed(() => {

  return [...transactions.value]
    .sort((a, b) => {

      return new Date(b.dateTransaction) -
        new Date(a.dateTransaction);

    })
    .slice(0, 5);

});

const getTransactionLabel = (transaction) => {

  return (
    transaction.libelle ||
    transaction.description ||
    transaction.nom ||
    'Transaction'
  );

};

const getCompteName = (transaction) => {

  return (
    transaction.compte?.nom ||
    'Compte'
  );

};

const formatDate = (date) => {

  if (!date) {
    return '-';
  }

  const dateOnly = date.split('T')[0];

  const [year, month, day] =
    dateOnly.split('-');

  if (!year || !month || !day) {
    return '-';
  }

  return `${day}/${month}/${year}`;

};

const formatAmount = (amount) => {

  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(
    parseFloat(amount) || 0
  );

};

// ===============================
// 🔹 GRAPHIQUE
// ===============================

const {
  fluxComptaChart,
  chartOptions
} = useFluxComptaChart(
  transactions,
  comptes,
  currentYearGlobal
);

// ===============================
// 🔹 MONTAGE
// ===============================

onMounted(() => {

  fetchData();

});

</script>


<template>

  <div class="tresorerie-dashboard">

    <!-- ===============================
         CHARGEMENT
    ================================ -->

    <div
      v-if="loading"
      class="state-card"
    >

      <div class="spinner"></div>

      <span>
        Chargement de la trésorerie...
      </span>

    </div>


    <!-- ===============================
         ERREUR
    ================================ -->

    <div
      v-else-if="errorMessage"
      class="state-card error-state"
    >

      <i class="pi pi-exclamation-triangle"></i>

      <p>
        {{ errorMessage }}
      </p>

    </div>


    <!-- ===============================
         DASHBOARD
    ================================ -->

    <div v-else>

      <!-- ===============================
           EN-TÊTE
      ================================ -->

      <header class="dashboard-header">

        <div>

          <div class="header-icon">
            <i class="pi pi-wallet"></i>
          </div>

          <h1>
            Trésorerie
          </h1>

          <p>
            Vue d'ensemble financière
          </p>

        </div>

        <span class="season-tag">
          Saison {{ currentSeasonLabel }}
        </span>

      </header>


      <!-- ===============================
           INDICATEURS
      ================================ -->

      <section class="stats-grid">

        <div class="stat-card">

          <div class="stat-icon">
            <i class="pi pi-wallet"></i>
          </div>

          <div>

            <span class="stat-label">
              Solde total
            </span>

            <strong>
              {{ formatAmount(totalSolde) }} €
            </strong>

          </div>

        </div>


        <div class="stat-card">

          <div class="stat-icon">
            <i class="pi pi-arrow-down-left"></i>
          </div>

          <div>

            <span class="stat-label">
              Recettes
            </span>

            <strong>
              {{ formatAmount(totalRecettes) }} €
            </strong>

          </div>

        </div>


        <div class="stat-card">

          <div class="stat-icon">
            <i class="pi pi-arrow-up-right"></i>
          </div>

          <div>

            <span class="stat-label">
              Dépenses
            </span>

            <strong>
              {{ formatAmount(totalDepenses) }} €
            </strong>

          </div>

        </div>


        <div class="stat-card">

          <div class="stat-icon">
            <i class="pi pi-book"></i>
          </div>

          <div>

            <span class="stat-label">
              Comptes
            </span>

            <strong>
              {{ comptes.length }}
            </strong>

          </div>

        </div>

      </section>


      <!-- ===============================
           GRAPHIQUE
      ================================ -->

      <section class="chart-card">

        <div class="section-header">

          <div>

            <h2>
              Évolution des flux financiers
            </h2>

            <p>
              Suivi des soldes pendant la saison
            </p>

          </div>

          <span class="season-tag">
            {{ currentSeasonLabel }}
          </span>

        </div>

        <div class="chart-wrapper">

          <LineChart
            :chartData="fluxComptaChart"
            :options="chartOptions"
          />

        </div>

      </section>


      <!-- ===============================
           DERNIÈRES TRANSACTIONS
      ================================ -->

      <section class="transactions-card">

        <div class="section-header">

          <div>

            <h2>
              Dernières opérations
            </h2>

            <p>
              Les 5 dernières transactions enregistrées
            </p>

          </div>

        </div>


        <div
          v-if="latestTransactions.length"
          class="transactions-list"
        >

          <div
            v-for="transaction in latestTransactions"
            :key="transaction.transactionId"
            class="transaction-row"
          >

            <div class="transaction-info">

              <strong>
                {{ getTransactionLabel(transaction) }}
              </strong>

              <span>
                {{ getCompteName(transaction) }}
                ·
                {{ formatDate(transaction.dateTransaction) }}
              </span>

            </div>


            <span
              class="transaction-amount"
              :class="{
                positive: Number(transaction.montant) > 0,
                negative: Number(transaction.montant) < 0
              }"
            >

              {{
                Number(transaction.montant) > 0 ? '+' : ''
              }}{{ formatAmount(transaction.montant) }} €

            </span>

          </div>

        </div>


        <div
          v-else
          class="empty-state"
        >

          <i class="pi pi-wallet"></i>

          <span>
            Aucune transaction enregistrée.
          </span>

        </div>

      </section>


      <!-- ===============================
           ACCÈS COMPTABILITÉ
      ================================ -->

      <div class="compta-action">

        <router-link
          :to="{ name: 'admin-compta' }"
          class="compta-button"
        >

          <i class="pi pi-wallet"></i>

          <span>
            Accéder à la comptabilité
          </span>

          <i class="pi pi-arrow-right"></i>

        </router-link>

      </div>

    </div>

  </div>

</template>


<style scoped>

.tresorerie-dashboard {
  width: 100%;
}


/* ===============================
   HEADER
================================ */

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
}

.header-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 193, 7, 0.45);
  border-radius: 12px;
  color: #ffc107;
  background: rgba(241, 238, 227, 0.08);
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
}

.dashboard-header h1 {
  margin: 0;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 700;
}

.dashboard-header p {
  margin: 0.4rem 0 0;
  color: #8f969d;
}


.season-tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: #ffbb33;
  background: rgba(255, 187, 51, 0.1);
  padding: 0.4rem 0.7rem;
  border-radius: 0.4rem;
  border: 1px solid rgba(255, 187, 51, 0.2);
}


/* ===============================
   STATS
================================ */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: #1b1d22;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.35rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 187, 51, 0.1);
  color: #ffbb33;
  font-size: 1.1rem;
}

.stat-label {
  display: block;
  color: #8a919e;
  font-size: 0.8rem;
  margin-bottom: 0.2rem;
}

.stat-card strong {
  display: block;
  color: #ffffff;
  font-size: 1.35rem;
}


/* ===============================
   SECTIONS
================================ */

.chart-card,
.transactions-card {
  background: #1e2126;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.section-header h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
}

.section-header p {
  margin: 0.35rem 0 0;
  color: #8a919e;
  font-size: 0.85rem;
}


/* ===============================
   GRAPHIQUE
================================ */

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 360px;
}


/* ===============================
   TRANSACTIONS
================================ */

.transactions-list {
  display: flex;
  flex-direction: column;
}

.transaction-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.transaction-row:last-child {
  border-bottom: none;
}

.transaction-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.transaction-info strong {
  color: #ffffff;
  font-size: 0.9rem;
}

.transaction-info span {
  color: #8a919e;
  font-size: 0.78rem;
}

.transaction-amount {
  flex-shrink: 0;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.transaction-amount.positive {
  color: #22c55e;
}

.transaction-amount.negative {
  color: #ef4444;
}


/* ===============================
   ACTION
================================ */

.compta-action {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}

.compta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 1.2rem;
  border-radius: 0.6rem;
  background: #ffbb33;
  color: #121417;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s ease, background 0.2s ease;
}

.compta-button:hover {
  background: #ffc44d;
  color: #121417;
  transform: translateY(-2px);
}


/* ===============================
   ÉTATS
================================ */

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

.empty-state {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #8a919e;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}


/* ===============================
   RESPONSIVE
================================ */

@media (max-width: 900px) {

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

}

@media (max-width: 640px) {

  .dashboard-header {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .chart-card,
  .transactions-card {
    padding: 1rem;
  }

  .chart-wrapper {
    height: 280px;
  }

  .transaction-row {
    align-items: flex-start;
  }

  .transaction-amount {
    font-size: 0.85rem;
  }

}

</style>
