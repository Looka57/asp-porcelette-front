<script setup>
/* ... tes imports et ta logique existante ne changent pas ... */
import { ref, onMounted } from 'vue';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
import api from '@/api/axios';
import CountUp from 'vue-countup-v3';
import ProgressSpinner from 'primevue/progressspinner';
import Tag from 'primevue/tag';
import { useEvolutionInscriptionsChart } from '@/composables/useChartData';
import SaisonStatisticsChart from '@/composables/SaisonStatisticsChart.vue';

Chart.register(...registerables);

const rawInscriptionsData = ref({});
const { inscriptionsData, chartOptions, totalInscriptions } = useEvolutionInscriptionsChart(rawInscriptionsData);

const totalLicencies = ref(0);
const totalEvenements = ref(0);
const totalCompta = ref(0);

const DISCIPLINES_MAP = { 1: 'Judo', 2: 'Aïkido', 3: 'Jujitsu', 4: 'Judo Détente' };
const DISCIPLINES_NAMES = Object.values(DISCIPLINES_MAP);
const MONTHS = ['Sept', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];

const processInscriptionsData = (allUsers) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const seasonStartYear = currentMonth >= 8 ? currentYear : currentYear - 1;

  const monthlyData = DISCIPLINES_NAMES.reduce((acc, disc) => {
    acc[disc] = new Array(MONTHS.length).fill(0);
    return acc;
  }, {});

  allUsers.forEach(user => {
    const isAdherent = user.roles && user.roles.includes('Adherent');
    const userDiscipline = DISCIPLINES_MAP[user.disciplineId];
    const dateAdhesion = user.dateAdhesion;

    if (!isAdherent || !userDiscipline || !dateAdhesion) return;

    const inscriptionDate = new Date(dateAdhesion);

    if (isNaN(inscriptionDate.getTime())) return;

    const inscriptionYear = inscriptionDate.getFullYear();
    const inscriptionMonth = inscriptionDate.getMonth();
    const inscriptionDay = inscriptionDate.getDate();

    let userSeasonStartYear = inscriptionYear;

    // À partir du 7 février, l'enregistrement appartient à la saison suivante
    if (inscriptionMonth > 1 || (inscriptionMonth === 1 && inscriptionDay >= 7)) {
      userSeasonStartYear = inscriptionYear;
    } else {
      userSeasonStartYear = inscriptionYear - 1;
    }

    if (userSeasonStartYear !== seasonStartYear) return;

    const month = inscriptionDate.getMonth();
    const monthIndex = month >= 8
      ? month - 8
      : month <= 5
        ? month + 4
        : -1;

    if (monthIndex >= 0 && monthIndex < MONTHS.length) {
      monthlyData[userDiscipline][monthIndex]++;
    }
  });

  rawInscriptionsData.value = monthlyData;
};

const fetchStats = async () => {
  try {
    const licenciesResponse = await api.get('/User/admin/list');
    const users = licenciesResponse.data || [];

    processInscriptionsData(users);

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const seasonStartYear = currentMonth >= 8 ? currentYear : currentYear - 1;

    const seasonStart = new Date(seasonStartYear, 8, 1, 0, 0, 0, 0);
    const seasonEnd = new Date(seasonStartYear + 1, 5, 30, 23, 59, 59, 999);

    totalLicencies.value = users.filter(user => {
      const isAdherent = user.roles?.includes('Adherent');

      if (!isAdherent || !user.dateRenouvellement) return false;

      const dateRenouvellement = new Date(user.dateRenouvellement);

      if (isNaN(dateRenouvellement.getTime())) return false;

      return dateRenouvellement >= seasonStart && dateRenouvellement <= seasonEnd;
    }).length;

    const eventsResponse = await api.get('/Evenement');
    totalEvenements.value = eventsResponse.data.length || 0;

    const comptaReponse = await api.get('/Compte');
    totalCompta.value = (comptaReponse.data || []).reduce(
      (sum, c) => sum + (c.solde || 0),
      0
    );
  } catch (err) {
    console.error('Erreur stats :', err);
  }
};

const loading = ref(true);
onMounted(async () => {
  await fetchStats();
  setTimeout(() => { loading.value = false; }, 500);
});
</script>

<template>
  <div class="py-5 px-3 md:px-6 surface-ground min-vh-100 text-white">

    <!-- Header Admin -->
    <div class="header-banner position-relative overflow-hidden p-3 p-md-5 mb-5 rounded-4 text-start shadow-lg">
      <div class="d-flex flex-column justify-content-between gap-3">
        <div>
          <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
            <span class="badge rounded-pill bg-danger bg-gradient px-3 py-2 text-uppercase tracking-wider fw-semibold">
              Espace d'administration
            </span>
            <span class="badge rounded-pill bg-dark border border-secondary text-light px-3 py-2">
              Gestion & suivi de l'association
            </span>
          </div>
          <h1 class="fs-3 md:fs-2 lg:display-5 fw-bold text-white mb-2 text-break">
            Tableau de bord <span class="text-warning">Admin</span>
          </h1>
          <p class="text-white-50 fs-6 mb-0 d-flex align-items-start align-items-md-center gap-2">
            <i class="bi bi-info-circle text-warning mt-1 mt-md-0"></i>
            <span>Vue d'ensemble de l'association, des inscrits et du suivi financier.</span>
          </p>
        </div>
      </div>
    </div>

    <!-- 🧾 CARTES KPI -->
    <div class="grid grid-nogutter gap-4 mb-6">
      <div class="col-12 md:col flex">
        <router-link :to="{ name: 'admin-licencies' }" class="w-full no-underline">
          <div
            class="kpi-card p-4 border-round-xl border-1 flex flex-column align-items-center justify-content-center text-center cursor-pointer transition-all duration-300">
            <div class="kpi-icon-wrapper mb-3 p-3 border-round-circle flex align-items-center justify-content-center">
              <img width="80" height="80" src="https://img.icons8.com/bubbles/100/user-group-man-woman.png"
                alt="Licenciés" class="kpi-img" />
            </div>
            <span class="text-light font-semibold text-lg uppercase tracking-wider mb-2">Licenciés</span>
            <CountUp :end-val="totalLicencies" :duration="2" class="text-4xl font-bold text-white m-0" />
          </div>
        </router-link>
      </div>

      <div class="col-12 md:col flex">
        <router-link :to="{ name: 'admin-events' }" class="w-full no-underline">
          <div
            class="kpi-card p-4 border-round-xl border-1 flex flex-column align-items-center justify-content-center text-center cursor-pointer transition-all duration-300">
            <div class="kpi-icon-wrapper mb-3 p-3 border-round-circle flex align-items-center justify-content-center">
              <img width="80" height="80" src="https://img.icons8.com/bubbles/100/today.png" alt="Événements"
                class="kpi-img" />
            </div>
            <span class="text-light font-semibold text-lg uppercase tracking-wider mb-2">Événements</span>
            <CountUp :end-val="totalEvenements" :duration="2" class="text-4xl font-bold text-white m-0" />
          </div>
        </router-link>
      </div>

      <div class="col-12 md:col flex">
        <router-link :to="{ name: 'admin-compta' }" class="w-full no-underline">
          <div
            class="kpi-card p-4 border-round-xl border-1 flex flex-column align-items-center justify-content-center text-center cursor-pointer transition-all duration-300">
            <div class="kpi-icon-wrapper mb-3 p-3 border-round-circle flex align-items-center justify-content-center">
              <img width="80" height="80" src="https://img.icons8.com/bubbles/100/bank.png" alt="Comptabilité"
                class="kpi-img" />
            </div>
            <span class="text-light font-semibold text-lg uppercase tracking-wider mb-2">Comptabilité</span>
            <CountUp :end-val="totalCompta" :duration="2" :options="{ decimalPlaces: 2, suffix: ' €' }"
              class="text-4xl font-bold text-warning m-0" />
          </div>
        </router-link>
      </div>
    </div>

    <!-- 📊 SECTION GRAPHIQUE -->
    <div v-if="loading" class="flex flex-column align-items-center justify-content-center py-8">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
      <span class="text-500 mt-3 font-medium">Chargement des données analytiques...</span>
    </div>

    <div v-else class="max-w-7xl mx-auto flex flex-column gap-5">

      <!-- 🔹 Synthèse Saison avec Conteneur Scrollable sur Mobile -->
      <div class="chart-box p-4 border-round-xl border-1">
        <div
          class="flex flex-column md:flex-row align-items-start md:align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom-1 border-white-alpha-10">
          <div>
            <h3 class="text-xl md:text-2xl font-bold text-white m-0 mb-1 flex align-items-center gap-2">
              <i class="pi pi-chart-line text-warning"></i> Évolution des Inscriptions
            </h3>
            <p class="text-400 text-sm m-0">Inscriptions enregistrées au cours de la saison sportive actuelle</p>
          </div>
          <Tag severity="warning" class="px-3 py-2 text-base font-bold">
            Total : {{ totalInscriptions }} inscrits
          </Tag>
        </div>

        <!-- Conteneur avec scroll horizontal fluide sur les petits écrans -->
        <div class="chart-scroll-container w-full overflow-x-auto pb-2">
          <div class="chart-inner-wrapper" style="min-width: 600px; height: 380px;">
            <LineChart :chart-data="inscriptionsData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <!-- 📊 STATISTIQUES PAR SAISON -->
      <div class="chart-box p-4 border-round-xl border-1">
        <div class="mb-4 pb-3 border-bottom-1 border-white-alpha-10">
          <h3 class="text-xl md:text-2xl font-bold text-white m-0 mb-1 flex align-items-center gap-2">
            <i class="pi pi-history text-warning"></i> Historique des Inscriptions
          </h3>
          <p class="text-400 text-sm m-0">Comparatif des effectifs totaux par disciplines sur les saisons précédentes
          </p>
        </div>
        <div class="overflow-x-auto">
          <div style="min-width: 500px;">
            <SaisonStatisticsChart />
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
.header-banner {
  background: linear-gradient(135deg, #1e2530 0%, #2b3035 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.tracking-wider {
  letter-spacing: 0.08em;
}

.kpi-card {
  background: #2a2e35;
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.kpi-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 193, 7, 0.4);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
  background: #323740;
}

.kpi-img {
  transition: transform 0.3s ease;
}

.kpi-card:hover .kpi-img {
  transform: scale(1.1);
}

.chart-box {
  background: #2a2e35;
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

/* Scrollbar personnalisée discrète pour les graphiques sur mobile */
.chart-scroll-container::-webkit-scrollbar {
  height: 6px;
}

.chart-scroll-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.chart-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(255, 193, 7, 0.4);
  border-radius: 4px;
}
</style>
