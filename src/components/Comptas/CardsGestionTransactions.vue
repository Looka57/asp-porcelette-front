<script setup>

import { ref, onMounted, computed } from 'vue'; // Ajout de computed
import { useRoute } from 'vue-router'; // 👈 NOUVEAU : Import pour lire l'URL
import api from '@/api/axios';
import { LineChart, BarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
// NOTE: Ces composables devront être adaptés pour prendre en compte les filtres d'année si vous les utilisez
import { useDepensesGeneralesChart } from '@/composables/graphDepensesGenerales'
import { useDepensesDisciplinesChart } from '@/composables/graphDepensesDisciplines'

Chart.register(...registerables)

// ===============================
// 🔹 ROUTE & ID DU COMPTE
// ===============================
const route = useRoute();
// Récupère l'ID de l'URL et le convertit en nombre
const currentCompteId = computed(() => parseInt(route.params.compteId));

// 🔹 Récupération des données et options
const { depensesData, chartOptions } = useDepensesGeneralesChart()
const { depensesDisciplinesData, chartOptions: chartOptionsDisciplines } = useDepensesDisciplinesChart()

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
    const response = await api.get(API_PATCH)
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
    // Récupère toutes les transactions pour l'instant
    const response = await api.get(API_TRANSACTIONS);
    transactions.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

// ===============================
// 🔹 DONNÉES FILTRÉES
// ===============================
// Le Compte actuellement affiché (Compte Courant ou Épargne)
const currentCompte = computed(() => {
  return comptes.value.find(c => c.compteId === currentCompteId.value);
});

// Les Transactions appartenant au Compte sélectionné
const filteredTransactions = computed(() => {
  return transactions.value.filter(t => t.compte?.compteId === currentCompteId.value);
});


// 🔹 Année en cours (année de la transaction la plus récente du compte sélectionné)
const currentYear = computed(() => {
  // 1. Prendre uniquement les transactions du compte actuel
  const currentAccountTransactions = transactions.value.filter(t => t.compte?.compteId === currentCompteId.value);

  if (currentAccountTransactions.length === 0) {
    return new Date().getFullYear(); // Si pas de transactions, prend l'année actuelle
  }

  // 2. Trouver la date la plus récente
  const latestDate = currentAccountTransactions.reduce((latest, t) => {
    const transactionDate = new Date(t.dateTransaction);
    return transactionDate > latest ? transactionDate : latest;
  }, new Date(0)); // Start avec une date très ancienne

  // 3. Retourner l'année
  return latestDate.getFullYear();
});


// ✅ Calcul du total des dépenses pour l'année en cours (MODIFIÉ)
const totalDepensesAnnuelle = computed(() => {
  // 1. Filtrer par le compte actuel (déjà fait par filteredTransactions)
  // 2. Filtrer pour ne garder que les transactions de l'année en cours
  const annualTransactions = filteredTransactions.value.filter(t =>
    new Date(t.dateTransaction).getFullYear() === currentYear.value
  );

  // 3. Calculer le total des dépenses (montants négatifs) pour cette sélection annuelle
  return annualTransactions
    .filter(t => t.montant < 0) // seulement les dépenses
    .reduce((total, t) => total + Math.abs(t.montant), 0)
    .toLocaleString('fr-FR', { minimumFractionDigits: 2 });
});


// ===============================
// 🔹 ICONES PAR DÉFAUT
// ===============================
const comptaIcons = {
  2: 'https://img.icons8.com/bubbles/100/money.png',  // Compte courant
  3: 'https://img.icons8.com/bubbles/100/stack-of-money.png', // Compte épargne
};
function getIconUrl(compteId) {
  return comptaIcons[compteId] || 'https://img.icons8.com/color/96/money.png';
}

// 💡 Icône statique pour les dépenses cumulées
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
  <div class="container-fluid py-4">

    <!-- Affichage conditionnel basé sur le compte actuel -->
    <div v-if="!currentCompte" class="text-center text-danger p-4">
      <p>Compte non trouvé ou en cours de chargement...</p>
    </div>
    <div v-else>
      <!-- ══════ Cartes Hautes (MODIFIÉ : utilise currentCompte) ══════ -->
      <div class="gestionTransaction-grid">

        <div class="gestionTransaction-card rounded">
          <h4 class="fs-2">Solde Actuel</h4>
          <!-- Icône dynamique (pour Solde Actuel) -->
          <img :src="getIconUrl(currentCompte.compteId)" :alt="`Icône ${currentCompte.nom}`" width="100" height="100"
            class="mb-3" />
          <div>
            <p class="fs-3 m-0">{{ currentCompte.nom }}</p>
            <p class="fs-3 fw-bold">{{ currentCompte.solde }} €</p>
            <button class="btn btn-outline-light" @click="$router.push(`/admin/comptes/${currentCompte.compteId}`)">Voir
              détails</button>
          </div>
        </div>

        <div class="gestionTransaction-card d-flex flex-column justify-content-center align-items-center rounded">
          <!-- Nouveau titre pour refléter le calcul annuel -->
          <h4 class="fs-2">Dépenses Cumulées Annuelles:  {{ currentYear }}</h4>
          <!-- Icône statique (pour Dépenses Cumulées) -->
          <img width="100" height="100" :src="depensesIconUrl" alt="Icône Dépenses" class="mb-3" />
          <div>
            <p class="fs-3 m-0">Montant Total des Dépenses:</p>
            <!-- Utilisation de la nouvelle computed property -->
            <p class="fs-3 fw-bold">{{ totalDepensesAnnuelle }} €</p>
          </div>
        </div>
      </div>


      <!-- ══════ Graphiques ══════ -->
      <div class="gestionTransactionGraphs">
        <div class="graphs-container">
          <div class="graph-item">
            <h4>Dépenses Mensuelles (Compte: {{ currentCompte.nom }})</h4>
            <LineChart :chartData="depensesData" :options="chartOptions" />
          </div>

          <div class="graph-item">
            <h4>Dépenses par Discipline (Compte: {{ currentCompte.nom }})</h4>
            <BarChart :chartData="depensesDisciplinesData" :options="chartOptionsDisciplines" />
          </div>

          <!-- Liste des transactions filtrées (Pour le débuggage ou la future implémentation) -->
          <!-- <div class="col-12 mt-4">
      <h5 class="text-white">Détail des Transactions ({{ filteredTransactions.length }} transactions)</h5>
      <pre class="text-white bg-dark p-3 rounded overflow-auto"
       style="max-height: 300px;">{{ filteredTransactions }}</pre>
     </div> -->
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
