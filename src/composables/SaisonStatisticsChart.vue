<script setup>
import { ref, onMounted } from 'vue';
import { BarChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
import api from '@/api/axios';

Chart.register(...registerables);

// ================================================================
// DONNÉES
// ================================================================

const loading = ref(true);
const error = ref(null);

const saisons = ref([]);
const saisonSelectionnee = ref(null);
const statistiques = ref([]);

// ================================================================
// COULEURS DES DISCIPLINES
// ================================================================

const DISCIPLINE_COLORS = {
  'Judo': '#ef3838',
  'Aïkido': '#31b3d0',
  'Jujitsu': '#38ef7d',
  'Judo Détente': '#e7d25c'
};


// ================================================================
// RÉCUPÉRATION DES SAISONS DISPONIBLES
// ================================================================

const chargerSaisons = async () => {
  try {
    const response = await api.get('/User/statistiques/saisons');

    saisons.value = response.data || [];

    // Sélectionne automatiquement la première saison
    // (le backend les renvoie de la plus récente à la plus ancienne)
    if (saisons.value.length > 0) {
      saisonSelectionnee.value = saisons.value[0];

      await chargerStatistiques();
    }

  } catch (err) {
    console.error(
      'Erreur lors du chargement des saisons :',
      err
    );

    saisons.value = [];
    error.value = 'Impossible de charger les saisons.';
  }
};

// ================================================================
// RÉCUPÉRATION DES STATISTIQUES D'UNE SAISON
// ================================================================

const chargerStatistiques = async () => {
  if (!saisonSelectionnee.value) {
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await api.get(
      `/User/statistiques/saison/${saisonSelectionnee.value}`
    );

    statistiques.value = response.data || [];

  } catch (err) {
    console.error(
      `Erreur lors du chargement de la saison ${saisonSelectionnee.value} :`,
      err
    );

    statistiques.value = [];
    error.value = `Aucune statistique disponible pour la saison ${saisonSelectionnee.value}.`;

  } finally {
    loading.value = false;
  }
};

// ================================================================
// DONNÉES DU GRAPHIQUE
// ================================================================

const chartData = () => {
  return {
    labels: statistiques.value.map(stat => stat.discipline),

    datasets: [
      {
        label: `Inscrits ${saisonSelectionnee.value}`,
        data: statistiques.value.map(stat => stat.totalInscrits),

        backgroundColor: statistiques.value.map(
          stat => DISCIPLINE_COLORS[stat.discipline] || '#6c757d'
        ),

        borderColor: statistiques.value.map(
          stat => DISCIPLINE_COLORS[stat.discipline] || '#6c757d'
        ),

        borderWidth: 1,
        borderRadius: 8,

        hoverBackgroundColor: statistiques.value.map(
          stat => DISCIPLINE_COLORS[stat.discipline] || '#adb5bd'
        )
      }
    ]
  };
};

// ================================================================
// OPTIONS DU GRAPHIQUE
// ================================================================

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false
    },

    tooltip: {
      callbacks: {
        label: (context) => {
          return `${context.raw} inscrit${context.raw > 1 ? 's' : ''}`;
        }
      }
    }
  },

  scales: {
    y: {
      beginAtZero: true,

      ticks: {
        precision: 0,
        color: '#ffffff'
      },

      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    },

    x: {
      ticks: {
        color: '#ffffff'
      },

      grid: {
        display: false
      }
    }
  }
};

// ================================================================
// CHANGEMENT DE SAISON
// ================================================================

const changerSaison = async () => {
  await chargerStatistiques();
};

// ================================================================
// INITIALISATION
// ================================================================

onMounted(async () => {
  await chargerSaisons();
});
</script>

<template>
  <div class="card bg-secondary text-white shadow-lg border-0 rounded-3 p-4">

    <!-- ========================================================= -->
    <!-- TITRE -->
    <!-- ========================================================= -->

    <div class="d-flex justify-content-between align-items-center mb-4">

      <h4 class="card-title mb-0">
        Statistiques par saison
      </h4>

      <!-- Sélection de la saison -->

      <select v-model="saisonSelectionnee" @change="changerSaison" class="form-select saison-select">
        <option v-for="saison in saisons" :key="saison" :value="saison">
          Saison {{ saison }}
        </option>
      </select>

    </div>

    <!-- ========================================================= -->
    <!-- CHARGEMENT -->
    <!-- ========================================================= -->

    <div v-if="loading" class="text-info text-center py-5">
      Chargement des statistiques...
    </div>

    <!-- ========================================================= -->
    <!-- ERREUR / PAS DE DONNÉES -->
    <!-- ========================================================= -->

    <div v-else-if="error || statistiques.length === 0" class="text-center text-danger py-5">
      {{ error || 'Aucune statistique disponible.' }}
    </div>

    <!-- ========================================================= -->
    <!-- GRAPHIQUE -->
    <!-- ========================================================= -->

    <div v-else class="chart-container">
      <BarChart :chart-data="chartData()" :options="chartOptions" />
    </div>

    <!-- ========================================================= -->
    <!-- LÉGENDE -->
    <!-- ========================================================= -->

    <div v-if="!loading && statistiques.length > 0" class="discipline-legend mt-4">

      <div v-for="stat in statistiques" :key="stat.disciplineId" class="legend-item">

        <span class="legend-color" :style="{
          backgroundColor:
            DISCIPLINE_COLORS[stat.discipline] || '#6c757d'
        }"></span>

        <span>
          {{ stat.discipline }}
          <strong>({{ stat.totalInscrits }})</strong>
        </span>

      </div>

    </div>

  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
}

.saison-select {
  width: 180px;
  background-color: #212529;
  color: white;
  border: 1px solid #6c757d;
}

.saison-select:focus {
  background-color: #212529;
  color: white;
  border-color: #adb5bd;
  box-shadow: none;
}

.saison-select option {
  background-color: #212529;
  color: white;
}

.discipline-legend {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.legend-color {
  width: 14px;
  height: 14px;
  border-radius: 4px;
  display: inline-block;
}
</style>
