```vue
<script setup>

/* ════════════════════════════════════════════════════════════════════════ */
/* 📦 IMPORTS */
/* ════════════════════════════════════════════════════════════════════════ */

import { ref, onMounted } from 'vue';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
import api from '@/api/axios';
import CountUp from 'vue-countup-v3';

import { useEvolutionInscriptionsChart } from '@/composables/useChartData';
import SaisonStatisticsChart from '@/composables/SaisonStatisticsChart.vue';


/* ════════════════════════════════════════════════════════════════════════ */
/* ⚙️ CONFIGURATION DE CHART.JS */
/* ════════════════════════════════════════════════════════════════════════ */

Chart.register(...registerables);


/* ════════════════════════════════════════════════════════════════════════ */
/* 🎯 UTILISATION DU COMPOSABLE */
/* ════════════════════════════════════════════════════════════════════════ */

const rawInscriptionsData = ref({});

const {
  inscriptionsData,
  chartOptions,
  totalInscriptions
} = useEvolutionInscriptionsChart(rawInscriptionsData);

const totalLicencies = ref(0);
const totalEvenements = ref(0);
const totalCompta = ref(0);


/* ════════════════════════════════════════════════════════════════════════ */
/* 🧠 LOGIQUE DU COMPOSANT */
/* ════════════════════════════════════════════════════════════════════════ */

/* 🎯 Mapping ID -> Nom */

const DISCIPLINES_MAP = {
  1: 'Judo',
  2: 'Aïkido',
  3: 'Jujitsu',
  4: 'Judo Détente',
};

const DISCIPLINES_NAMES = Object.values(DISCIPLINES_MAP);


/* 📅 Mois de la saison sportive : Septembre → Juin */

const MONTHS = [
  'Sept',
  'Oct',
  'Nov',
  'Déc',
  'Jan',
  'Fév',
  'Mar',
  'Avr',
  'Mai',
  'Juin'
];


/* ════════════════════════════════════════════════════════════════════════ */
/* 📊 TRAITEMENT DES INSCRIPTIONS */
/* ════════════════════════════════════════════════════════════════════════ */

const processInscriptionsData = (allUsers) => {

  /* ────────────────────────────────────────────────────────────────────── */
  /* 📅 DÉTERMINATION DE LA SAISON ACTUELLE */
  /* ────────────────────────────────────────────────────────────────────── */

  const today = new Date('2026-10-15');

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  /*
   * Saison sportive :
   *
   * Septembre 2026 → Juin 2027 = saison 2026-2027
   *
   * Si on est entre septembre et décembre :
   *     saison = année actuelle
   *
   * Si on est entre janvier et juin :
   *     saison = année précédente
   */

  const seasonStartYear = currentMonth >= 8
    ? currentYear
    : currentYear - 1;


  /* ────────────────────────────────────────────────────────────────────── */
  /* 📍 MOIS ACTUEL DANS LA SAISON */
  /* ────────────────────────────────────────────────────────────────────── */

  /*
   * Septembre = 0
   * Octobre   = 1
   * Novembre  = 2
   * Décembre  = 3
   * Janvier   = 4
   * ...
   * Juin      = 9
   */

  const currentMonthIndex = currentMonth >= 8
    ? currentMonth - 8
    : currentMonth + 4;


  /* ────────────────────────────────────────────────────────────────────── */
  /* 📦 INITIALISATION DES DONNÉES */
  /* ────────────────────────────────────────────────────────────────────── */

  const monthlyData = DISCIPLINES_NAMES.reduce((acc, disc) => {

    acc[disc] = new Array(MONTHS.length).fill(0);

    return acc;

  }, {});


  let usersComptes = 0;


  /* ══════════════════════════════════════════════════════════════════════ */
  /* 👥 PARCOURS DES ADHÉRENTS */
  /* ══════════════════════════════════════════════════════════════════════ */

  allUsers.forEach(user => {

    /* ──────────────────────────────────────────────────────────────────── */
    /* 1️⃣ Vérification de l'adhérent */
    /* ──────────────────────────────────────────────────────────────────── */

    const isAdherent =
      user.roles &&
      user.roles.includes('Adherent');

    const userDiscipline =
      DISCIPLINES_MAP[user.disciplineId];

    const dateAdhesion =
      user.dateAdhesion;


    /*
     * On ignore :
     * - les utilisateurs qui ne sont pas adhérents
     * - les disciplines inconnues
     * - les adhérents sans date d'adhésion
     */

    if (
      !isAdherent ||
      !userDiscipline ||
      !dateAdhesion
    ) {
      return;
    }


    /* ──────────────────────────────────────────────────────────────────── */
    /* 2️⃣ Conversion de la date */
    /* ──────────────────────────────────────────────────────────────────── */

    const inscriptionDate =
      new Date(dateAdhesion);


    if (isNaN(inscriptionDate.getTime())) {
      return;
    }


    /* ══════════════════════════════════════════════════════════════════════ */
    /* 🚫 IGNORER LES ANCIENNES SAISONS */
    /* ══════════════════════════════════════════════════════════════════════ */

    /*
     * Exemple :
     *
     * Saison actuelle = 2026-2027
     *
     * Une inscription de 2025
     * → ignorée
     *
     * Une inscription de septembre 2026
     * → conservée
     */

    if (
      inscriptionDate.getFullYear() < seasonStartYear
    ) {
      return;
    }


    /* ══════════════════════════════════════════════════════════════════════ */
    /* 📅 CALCUL DU MOIS DANS LA SAISON */
    /* ══════════════════════════════════════════════════════════════════════ */

    const month =
      inscriptionDate.getMonth();

    let monthIndex;


    /* Septembre → Décembre */

    if (month >= 8) {

      monthIndex =
        month - 8;

    }

    /* Janvier → Juin */

    else if (month <= 5) {

      monthIndex =
        month + 4;

    }

    /* Juillet / Août */

    else {

      return;

    }


    /* ══════════════════════════════════════════════════════════════════════ */
    /* 🚫 NE PAS AFFICHER LES MOIS FUTURS */
    /* ══════════════════════════════════════════════════════════════════════ */

    /*
     * Exemple en octobre :
     *
     * Septembre → affiché
     * Octobre   → affiché
     * Novembre  → 0
     * Décembre  → 0
     * etc.
     */

    if (
      monthIndex > currentMonthIndex
    ) {
      return;
    }


    /* ──────────────────────────────────────────────────────────────────── */
    /* 3️⃣ Ajout de l'inscription */
    /* ──────────────────────────────────────────────────────────────────── */

    if (
      monthIndex >= 0 &&
      monthIndex < MONTHS.length
    ) {

      monthlyData[userDiscipline][monthIndex]++;

      usersComptes++;

    }

  });


  /* ══════════════════════════════════════════════════════════════════════ */
  /* 📊 DEBUG */
  /* ══════════════════════════════════════════════════════════════════════ */

  console.log(
    '>>> SAISON ACTUELLE =',
    `${seasonStartYear}-${seasonStartYear + 1}`
  );

  console.log(
    '>>> MOIS ACTUEL =',
    MONTHS[currentMonthIndex]
  );

  console.log(
    '>>> NOMBRE DE LICENCIÉS COMPTÉS =',
    usersComptes
  );

  console.log(
    '>>> DONNÉES BRUTES DU GRAPHIQUE =',
    monthlyData
  );


  /* ══════════════════════════════════════════════════════════════════════ */
  /* 💾 ENVOI AU COMPOSABLE */
  /* ══════════════════════════════════════════════════════════════════════ */

  rawInscriptionsData.value =
    monthlyData;

};


/* ════════════════════════════════════════════════════════════════════════ */
/* 📡 RÉCUPÉRATION DES STATISTIQUES */
/* ════════════════════════════════════════════════════════════════════════ */

const fetchStats = async () => {

  try {

    /* ──────────────────────────────────────────────────────────────────── */
    /* 1️⃣ LICENCIÉS */
    /* ──────────────────────────────────────────────────────────────────── */

    const licenciesResponse =
      await api.get('/User/admin/list');

    const allUsers =
      licenciesResponse.data || [];


    processInscriptionsData(allUsers);


    totalLicencies.value =
      allUsers.filter(user =>
        user.roles &&
        user.roles.includes('Adherent')
      ).length;


    /* ──────────────────────────────────────────────────────────────────── */
    /* 2️⃣ ÉVÉNEMENTS */
    /* ──────────────────────────────────────────────────────────────────── */

    const eventsResponse =
      await api.get('/Evenement');

    totalEvenements.value =
      eventsResponse.data.length || 0;


    /* ──────────────────────────────────────────────────────────────────── */
    /* 3️⃣ COMPTABILITÉ */
    /* ──────────────────────────────────────────────────────────────────── */

    const comptaReponse =
      await api.get('/Compte');

    const comptes =
      comptaReponse.data || [];


    const soldeTotal =
      comptes.reduce(
        (sum, compte) => {

          const soldeDuCompte =
            compte.solde || 0;

          return sum + soldeDuCompte;

        },
        0
      );


    totalCompta.value =
      soldeTotal;


  } catch (err) {

    console.error(
      'Erreur lors du chargement des statistiques du tableau de bord :',
      err
    );

    rawInscriptionsData.value = {};

  }

};


/* ════════════════════════════════════════════════════════════════════════ */
/* ⏳ CHARGEMENT */
/* ════════════════════════════════════════════════════════════════════════ */

const loading = ref(true);


onMounted(async () => {

  await fetchStats();

  setTimeout(() => {

    loading.value = false;

  }, 500);

});

</script>
```


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
        <router-link :to="{ name: 'admin-licencies' }">
          <div
            class="card bg-secondary text-white p-3 rounded h-100 d-flex flex-column align-items-center justify-content-center hover-card">
            <img width="100" height="100" src="https://img.icons8.com/bubbles/100/user-group-man-woman.png"
              alt="user-group-man-woman" />
            <h4>Licenciés</h4>
            <CountUp :end-val="totalLicencies" :duration="2" class="h4 mb-0 fs-1" />
          </div>
        </router-link>
      </div>

      <!-- 📅 Événements -->
      <div class="col">
        <router-link :to="{ name: 'admin-events' }">
          <div
            class="card bg-secondary text-white p-3 rounded h-100 d-flex flex-column align-items-center justify-content-center hover-card">
            <img width="100" height="100" src="https://img.icons8.com/bubbles/100/today.png" alt="today" />
            <h4>Événements</h4>
            <CountUp :end-val="totalEvenements" :duration="2" class="h4 mb-0 fs-1" />
          </div>
        </router-link>
      </div>

      <!-- 📦 Archives -->
      <div class="col">
        <router-link :to="{ name: 'admin-compta' }">
          <div
            class="card bg-secondary text-white p-3 rounded h-100 d-flex flex-column align-items-center justify-content-center hover-card">
            <!-- <img width="100" height="100" src="https://img.icons8.com/bubbles/100/megaphone.png" alt="megaphone" /> -->
            <img width="100" height="100" src="https://img.icons8.com/bubbles/100/bank.png" alt="bank" />
            <h4>Comptabilité</h4>
            <CountUp :end-val="totalCompta" :duration="2" :options="{ decimalPlaces: 2, suffix: ' €' }"
              class="h4 mb-0 fs-1" />
          </div>
        </router-link>
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
        <!-- 📊 STATISTIQUES PAR SAISON -->

        <div class="row justify-content-center mt-5">
          <div class="col-md-12">
            <SaisonStatisticsChart />
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

.card {
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
