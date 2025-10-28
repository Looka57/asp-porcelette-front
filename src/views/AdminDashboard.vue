<!-- ════════════════════════════════════════════════════════════════════════ -->
<!-- 🧩 DASHBOARD ADMIN - EVOLUTION INSCRIPTIONS (VUE + CHART.JS) -->
<!-- ════════════════════════════════════════════════════════════════════════ -->
<script setup>
/* ════════════════════════════════════════════════════════════════════════ */
/* 📦 IMPORTS */
/* ════════════════════════════════════════════════════════════════════════ */
import { ref, onMounted } from 'vue';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';

// 💡 Import du composable (logique de graphique externalisée)
import { useEvolutionInscriptionsChart } from '@/composables/useChartData';

/* ════════════════════════════════════════════════════════════════════════ */
/* ⚙️ CONFIGURATION DE CHART.JS */
/* ════════════════════════════════════════════════════════════════════════ */
Chart.register(...registerables);

/* ════════════════════════════════════════════════════════════════════════ */
/* 🎯 UTILISATION DU COMPOSABLE */
/* ════════════════════════════════════════════════════════════════════════ */
const { inscriptionsData, chartOptions, totalInscriptions } = useEvolutionInscriptionsChart();

/* ════════════════════════════════════════════════════════════════════════ */
/* 🧠 LOGIQUE DU COMPOSANT */
/* ════════════════════════════════════════════════════════════════════════ */
const loading = ref(true);

onMounted(async () => {
  // Simule un chargement (à remplacer par un appel API réel)
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>

<!-- ════════════════════════════════════════════════════════════════════════ -->
<!-- 🎨 TEMPLATE -->
<!-- ════════════════════════════════════════════════════════════════════════ -->
<template>
  <div class="container-fluid text-center bg-dark text-white min-h-screen p-4">
    <h1 class="m-3">Tableau de bord Admin</h1>

    <!-- ════════════ 🧾 CARTES DU HAUT ════════════ -->
    <div class="row row-cols-1 row-cols-md-3 g-4 mb-5">
      <!-- 🧍 Licenciés -->
      <div class="col">
        <a href="#">
          <div
            class="card bg-secondary text-white p-3 rounded h-100 d-flex flex-column align-items-center justify-content-center hover-card">
            <img width="100" height="100" src="https://img.icons8.com/bubbles/100/user-group-man-woman.png"
              alt="user-group-man-woman" />
            <h4>Licenciés</h4>
            <p>500</p>
          </div>
        </a>
      </div>

      <!-- 📅 Événements -->
      <div class="col">
        <a href="#">
          <div
            class="card bg-secondary text-white p-3 rounded h-100 d-flex flex-column align-items-center justify-content-center hover-card">
            <img width="100" height="100" src="https://img.icons8.com/bubbles/100/today.png" alt="today" />
            <h4>Événements</h4>
            <p>12</p>
          </div>
        </a>
      </div>

      <!-- 📦 Archives -->
      <div class="col">
        <a href="#">
          <div
            class="card bg-secondary text-white p-3 rounded h-100 d-flex flex-column align-items-center justify-content-center hover-card">
            <img width="100" height="100" src="https://img.icons8.com/bubbles/100/megaphone.png" alt="megaphone" />
            <!-- <img width="100" height="100" src="https://img.icons8.com/bubbles/100/accounting.png" alt="accounting"/> -->
            <h4>Actualités</h4>
            <p>24</p>
          </div>
        </a>
      </div>
    </div>

    <!-- ════════════ 📊 SECTION GRAPHIQUE ════════════ -->
    <div v-if="loading" class="text-info mt-5">Chargement du graphique...</div>

  <!-- 🔹 TOTAL INSCRIPTIONS -->
    <div class="mb-4">
      <h3 class="text-light">Total des inscrits toutes disciplines : {{ totalInscriptions }}</h3>
    </div>

    <!-- 🔹 Graphique -->
    <div v-if="loading" class="text-info mt-5">Chargement du graphique...</div>
    <div v-else class="row justify-content-center">
      <div class="col-md-12">
        <div class="card bg-secondary text-white shadow-lg border-0 rounded-3 p-4">
          <h4 class="card-title text-start mb-3">Évolution des Inscriptions</h4>
          <div style="height: 400px; width: 100%;">
            <LineChart :chart-data="inscriptionsData" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- ════════════════════════════════════════════════════════════════════════ -->
<!-- 💅 STYLE -->
<!-- ════════════════════════════════════════════════════════════════════════ -->
<style scoped>
a {
  text-decoration: none;
  color: inherit;
}

.card{
   background-color: #343a40 !important;
  border-radius: 1rem;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.hover-card {
  transition: all 0.25s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  background-color: #343a40 !important;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6);
  background-color: #495057 !important;
}

.hover-card img {
  transition: transform 0.3s ease;
}

.hover-card:hover img {
  transform: scale(1.1);
}
</style>
