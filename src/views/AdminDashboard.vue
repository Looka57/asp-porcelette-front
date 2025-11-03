<script setup>
/* ════════════════════════════════════════════════════════════════════════ */
/* 📦 IMPORTS */
/* ════════════════════════════════════════════════════════════════════════ */
import { ref, onMounted } from 'vue';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';
import api from '@/api/axios';
import CountUp from 'vue-countup-v3';

// 💡 Import du composable (logique de graphique externalisée)
import { useEvolutionInscriptionsChart } from '@/composables/useChartData';

/* ════════════════════════════════════════════════════════════════════════ */
/* ⚙️ CONFIGURATION DE CHART.JS */
/* ════════════════════════════════════════════════════════════════════════ */
Chart.register(...registerables);

/* ════════════════════════════════════════════════════════════════════════ */
/* 🎯 UTILISATION DU COMPOSABLE */
/* ════════════════════════════════════════════════════════════════════════ */
const rawInscriptionsData = ref({});
// ✅ CORRECTION : Passer la ref au composable pour qu'il puisse réagir aux changements
const { inscriptionsData, chartOptions, totalInscriptions } = useEvolutionInscriptionsChart(rawInscriptionsData);
const totalLicencies = ref(0);
const totalEvenements = ref(0);
const totalCompta = ref(0);

/* ════════════════════════════════════════════════════════════════════════ */
/* 🧠 LOGIQUE DU COMPOSANT (fetchStats) */
/* ════════════════════════════════════════════════════════════════════════ */

// Définition des disciplines utilisées pour le graphique
// 🎯 CORRECTION : Mapping ID -> Nom
const DISCIPLINES_MAP = {
  // ASSUREZ-VOUS QUE CES IDS CORRESPONDENT À VOTRE BASE DE DONNÉES
  1: 'Judo',
  2: 'Aïkido',
  3: 'Jujitsu',
  4: 'Judo Détente',
};
const DISCIPLINES_NAMES = Object.values(DISCIPLINES_MAP);

// Cartographie des mois de l'année scolaire (Sept à Juin, 10 mois)
const MONTHS = ['Sept', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];


const processInscriptionsData = (allUsers) => {
  // 📢 DÉBOGAGE CRITIQUE : Affiche le premier utilisateur pour vérifier les noms de propriétés
  if (allUsers.length > 0) {
    console.log("--- INSPECTION UTILISATEUR ---");
    console.log("Premier utilisateur reçu (vérifiez roles, disciplineId, dateAdhesion) :", allUsers[0]);
    console.log("-----------------------------");
  }

  // Initialisation d'une structure pour stocker les inscriptions mensuelles brutes
  const monthlyData = DISCIPLINES_NAMES.reduce((acc, disc) => {
    acc[disc] = new Array(MONTHS.length).fill(0);
    return acc;
  }, {});

  let usersComptes = 0;

  allUsers.forEach(user => {
    // 1. Vérification des rôles et des données essentielles
    const isAdherent = user.roles && user.roles.includes('Adherent');

    // 🎯 CORRECTION : Utiliser disciplineId pour obtenir le nom
    const userDiscipline = DISCIPLINES_MAP[user.disciplineId];
    const dateAdhesion = user.dateAdhesion;

    // VÉRIFICATION : Si le rôle est 'Adherent', si la discipline est mappée et si la date existe
    if (!isAdherent || !userDiscipline || !dateAdhesion) {
      return;
    }

    const inscriptionDate = new Date(dateAdhesion);

    // Sécurité de date (juste au cas où)
    if (isNaN(inscriptionDate.getTime())) {
      return;
    }

    // 2. Déterminer l'indice du mois (Sept=0, Oct=1, ..., Juin=9)
    const month = inscriptionDate.getMonth(); // 0 (Jan) à 11 (Déc)

    let monthIndex; // Indice dans notre tableau de 10 mois

    if (month >= 8) { // Sept (8) à Déc (11)
      monthIndex = month - 8;
    } else if (month <= 5) { // Jan (0) à Juin (5)
      monthIndex = month + 4;
    } else {
      return; // Mois ignoré (Juillet/Août)
    }

    // 3. Incrémenter le compteur si la discipline est répertoriée
    if (monthIndex >= 0 && monthIndex < MONTHS.length) {
      monthlyData[userDiscipline][monthIndex]++;
      usersComptes++;
    }
  });

  console.log(`Nombre total de licenciés comptés dans le graphique : ${usersComptes}`);

  // Stocker les données brutes dans la ref lue par le composable
  rawInscriptionsData.value = monthlyData;
  console.log("Données brutes générées pour le graphique (devraient contenir les totaux):", monthlyData);
};


const fetchStats = async () => {
  try {
    // 1. Licenciés : Récupération de la liste complète
    const licenciesResponse = await api.get('/User/admin/list');
    const allUsers = licenciesResponse.data || [];

    // ✅ 1.1 Traitement des données pour le graphique
    processInscriptionsData(allUsers);

    // 1.2 Calcul du total des licenciés (simple, inchangé)
    totalLicencies.value = allUsers.filter(user =>
      user.roles.includes('Adherent')).length;

    // 2. Événements (inchangé)
    const eventsResponse = await api.get('/Evenement');
    totalEvenements.value = eventsResponse.data.length || 0;

    // 3. Comptabilité (inchangé)
    const comptaReponse = await api.get('/Compte');
    const comptes = comptaReponse.data || [];

    const soldeTotal = comptes.reduce((sum, compte) => {
      const soldeDuCompte = compte.solde || 0;
      return sum + soldeDuCompte;
    }, 0);
    totalCompta.value = soldeTotal;

  } catch (err) {
    console.error("Erreur lors du chargement des statistiques du tableau de bord :", err);
    rawInscriptionsData.value = { /* données par défaut vides */ };
  }
}

const loading = ref(true);

onMounted(async () => {
  await fetchStats();

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
