<script setup>
import { ref, onMounted } from 'vue';
// import api from '@/api/axios';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';

// 💡 Import du composable (logique de graphique externalisée)
import { useEvolutionInscriptionsChart } from '@/composables/useChartData';

Chart.register(...registerables); // Enregistrement des éléments de Chart.js

// --- Utilisation du Composable ---
const { inscriptionsData, chartOptions } = useEvolutionInscriptionsChart();

// --- Logique du composant Vue ---
const loading = ref(true);
// const error = ref(null);

onMounted(async () => {
    // Simuler le chargement des données. Remplacer par un appel API réel ici.
    // Exemple d'appel API : const response = await api.get('/admin/stats');

    setTimeout(() => {
        loading.value = false;
    }, 500);
});
</script>

<template>
    <div class="container-fluid text-center bg-dark text-white min-h-screen p-4">
        <h1 class="m-3">Tableau de bord Admin</h1>

        <!-- Cartes du Haut (votre structure) -->
        <div class="row row-cols-1 row-cols-md-3 g-4 mb-5">
            <div class="col"><a href="#">
                <div
                    class="card bg-secondary text-white p-3 rounded h-100 d-flex flex-column align-items-center justify-content-center hover-card">
                   <img width="100" height="100" src="https://img.icons8.com/bubbles/100/user-group-man-woman.png" alt="user-group-man-woman"/>
                    <h4>Licenciés</h4>
                    <p>500</p>
                </div>
            </a>
            </div>
            <div class="col"><a href="#">
                <div
                    class="card bg-secondary text-white p-3 rounded h-100 d-flex flex-column align-items-center justify-content-center hover-card">
              <img width="100" height="100" src="https://img.icons8.com/bubbles/100/today.png" alt="today"/>
                    <h4>Evenements</h4>
                    <p>12</p>
                </div>
            </a>
            </div>
            <div class="col"><a href="#">
                <div
                    class="card bg-secondary text-white p-3 rounded h-100 d-flex flex-column align-items-center justify-content-center hover-card">
                   <img width="100" height="100" src="https://img.icons8.com/bubbles/100/archive-folder.png" alt="archive-folder"/>
                    <h4>Archives</h4>
                    <p>24</p>
                </div>
            </a>
            </div>
        </div>

        <!-- Section du Graphique (Test Chart.js) -->
        <div v-if="loading" class="text-info mt-5">Chargement du graphique...</div>
        <div v-else class="row justify-content-center">
            <div class="col-md-12">
                <div class="card bg-secondary text-white shadow-lg border-0 rounded-3 p-4">
                    <h4 class="card-title text-start mb-3">Évolution des Inscriptions</h4>
                    <!-- 🎯 L'élément LineChart -->
                    <div style="height: 400px; width: 100%;">
                        <!-- Utilisation des variables importées via le composable -->
                        <LineChart :chartData="inscriptionsData" :options="chartOptions" />
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
a {
    text-decoration: none;
    color: inherit;
}

.hover-card {
    transition: all 0.25s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4); /* Assombri pour le fond dark */
    background-color: #343a40 !important; /* bg-dark ou secondary */
}

.hover-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6);
    background-color: #495057 !important; /* Teinte légèrement plus claire au survol */
}

.hover-card img {
    transition: transform 0.3s ease;
}

.hover-card:hover img {
    transform: scale(1.1);
}
</style>
