<script setup>
import { ref, onMounted, computed, watch } from 'vue' // Ajout de watch
import { useRoute } from 'vue-router';
import api from '@/api/axios'

const route = useRoute();
// Récupère l'ID de l'URL et le convertit en nombre
const currentCompteId = computed(() => parseInt(route.params.compteId));

const allTransactions = ref([]) // Stocke toutes les transactions (si l'API ne filtre pas)
const lastTransactions = ref([]) // Les 5 transactions filtrées et limitées affichées
const isLoading = ref(false)
const alertMessage = ref('')
const alertType = ref('')

const API_TRANSACTIONS = '/Transaction';

// =======================================================
// 💡 LOGIQUE DE FILTRAGE ET DE LIMITATION CÔTÉ CLIENT
// =======================================================

// 1. Définir une variable pour le nom du compte (pour le titre)
const compteNomAffiche = ref('Chargement...');

// 2. Fonction pour récupérer TOUTES les transactions (ou seulement celles du compte si l'API filtre)
const fetchAllTransactions = async () => {
  isLoading.value = true
  alertMessage.value = null
  try {
    // Tentative de filtrer via l'API, mais si l'API retourne tout, nous gérons le filtrage.
    // On retire le _sort et _limit pour simplifier la requête si le backend est capricieux.
    const url = `${API_TRANSACTIONS}?compteId=${currentCompteId.value}`;

    const response = await api.get(url);
    allTransactions.value = response.data;

    // Mettre à jour le nom du compte pour le titre
    const nom = allTransactions.value.find(t => t.compte?.compteId === currentCompteId.value)?.compte?.nom ||
      (allTransactions.value.length > 0 ? allTransactions.value[0].compte?.nom : 'Sélectionné');
    compteNomAffiche.value = nom;

  } catch (err) {
    console.error('❌ Erreur lors du chargement des transactions :', err)
    alertMessage.value = "❌ Une erreur est survenue lors du chargement des transactions du compte."
    alertType.value = "danger"
  } finally {
    isLoading.value = false
  }
}

// 3. Computed pour filtrer, trier et limiter les 5 dernières transactions
const computeLastTransactions = () => {
  // Filtrage par compte
  const filteredByCompte = allTransactions.value.filter(t => t.compte?.compteId === currentCompteId.value);

  // Tri par date (du plus récent au plus ancien)
  const sortedTransactions = filteredByCompte.sort((a, b) => {
    return new Date(b.dateTransaction) - new Date(a.dateTransaction);
  });

  // Limite aux 5 premières
  lastTransactions.value = sortedTransactions.slice(0, 5);

  console.log(`📦 Transactions filtrées pour compte ${currentCompteId.value} :`, lastTransactions.value);
}


// Formater une date au format français
function formatDate(dateString) {
  if (!dateString) return 'Date inconnue';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

onMounted(() => {
  fetchAllTransactions()
})

// 💡 Observer les changements sur les transactions brutes
// Lorsque allTransactions est mis à jour (après l'appel API), on filtre et on limite.
watch(allTransactions, () => {
  computeLastTransactions();
});

// 💡 Observer les changements de route (si l'utilisateur passe de /2 à /3 sans recharger la page)
watch(currentCompteId, () => {
  fetchAllTransactions();
});
</script>

<template>
   <h2 class="mx-5">Dernières transactions effectuées sur le compte {{ compteNomAffiche }}</h2>
   <div class="table-responsive mt-4">
    <table class="table table-dark table-hover align-middle">
      <thead class="table-secondary text-dark">
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Type</th>
          <th>Compte</th>
          <th>Montant (€)</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="6" class="text-center">Chargement des transactions...</td>
        </tr>
        <tr v-for="tx in lastTransactions" :key="tx.transactionId">
          <th scope="row">{{ tx.transactionId }}</th>
          <td>{{ formatDate(tx.dateTransaction) }}</td>
          <td>{{ tx.categorie?.nom ?? 'Inconnue' }}</td>
          <td>{{ tx.compte?.nom ?? 'Inconnu' }}</td>
          <td :class="{ 'text-success': tx.montant > 0, 'text-danger': tx.montant < 0 }">
            {{ tx.montant?.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) }} €
          </td>
          <td>{{ tx.description }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="lastTransactions.length === 0 && !isLoading" class="text-center text-secondary mt-3">
      Aucune transaction récente pour ce compte.
    </div>

  </div>
</template>

<style scoped>
.table-hover tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.text-success {
  color: #88fab2 !important;
  /* vert pour revenus */
}

.text-danger {
  color: #f87171 !important;
  /* rouge pour dépenses */
}
</style>
