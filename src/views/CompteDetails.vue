<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axios'
import ModalAddTransaction from '@/components/Comptas/ModalAddTransaction.vue'

const route = useRoute()
const router = useRouter()

const compteId = route.params.id
const compte = ref(null)
const transactions = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

const showModal = ref(false)
const transactionToEdit = ref(null)

// Variables d'état pour le filtrage
const selectedYear = ref('all')
const selectedMonth = ref('all')
// 👈 NOUVEAU : État pour filtrer par type (revenu/dépense)
const selectedType = ref('all')

const API_COMPTES = '/Compte'
const API_TRANSACTIONS = '/Transaction'

// Tableau des noms de mois pour l'affichage et le filtrage
const monthNames = [
  { value: 'all', name: 'Tous les mois' },
  { value: '01', name: 'Janvier' },
  { value: '02', name: 'Février' },
  { value: '03', name: 'Mars' },
  { value: '04', name: 'Avril' },
  { value: '05', name: 'Mai' },
  { value: '06', name: 'Juin' },
  { value: '07', name: 'Juillet' },
  { value: '08', name: 'Août' },
  { value: '09', name: 'Septembre' },
  { value: '10', name: 'Octobre' },
  { value: '11', name: 'Novembre' },
  { value: '12', name: 'Décembre' },
]

// 🔹 Définition des options de type de transaction
const typeOptions = [
  { value: 'all', name: 'Tous les types' },
  { value: 'revenu', name: 'Revenus (+)' },
  { value: 'depense', name: 'Dépenses (-)' },
]

// --------------------------------------------------
// 🔹 FONCTIONS D'ACTION
// --------------------------------------------------
// 🔹 Récupère les infos du compte courant
async function fetchCompte() {
  try {
    isLoading.value = true
    const response = await api.get(`${API_COMPTES}/${compteId}`)
    compte.value = response.data
  } catch (error) {
    console.error('❌ Erreur lors du chargement du compte :', error)
    errorMessage.value = "Erreur lors du chargement du compte."
  }
}

// 🔹 Récupère les transactions associées à ce compte
async function fetchTransactions() {
  try {
    isLoading.value = true
    const response = await api.get(`${API_TRANSACTIONS}/compte/${compteId}`)
    transactions.value = response.data
    transactions.value.sort((a, b) => new Date(b.dateTransaction) - new Date(a.dateTransaction))
  } catch (error) {
    console.error('❌ Erreur lors du chargement des transactions :', error)
  } finally {
    isLoading.value = false
  }
}

async function deleteTransaction(transactionId, description) {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer la transaction "${description}" ? Cette action est irréversible et mettra à jour le solde du compte.`)) {
    return
  }

  try {
    // Désactive l'affichage le temps du traitement
    isLoading.value = true

    // 1. Appel de l'API DELETE
    await api.delete(`${API_TRANSACTIONS}/${transactionId}`)

    // 2. Recharger les données pour mettre à jour la liste et le solde du compte
    await handleRefresh()
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de la transaction :', error)
    alert(`Erreur lors de la suppression : ${error.response?.data || error.message}`)
  } finally {
    isLoading.value = false
  }
}

const openEditModal = (transaction) => {
  transactionToEdit.value = transaction
  showModal.value = true
}

const handleRefresh = async () => {
  // Ferme la modale et réinitialise l'état d'édition si elle était ouverte
  showModal.value = false
  transactionToEdit.value = null

  // Recharge les données
  await Promise.all([
    fetchCompte(),
    fetchTransactions()
  ])
}






// 🔹 Propriété calculée pour extraire les années uniques disponibles
const availableYears = computed(() => {
  const years = new Set()
  transactions.value.forEach(t => {
    years.add(new Date(t.dateTransaction).getFullYear())
  })
  // Retourne 'all' plus les années triées par ordre décroissant
  return Array.from(years).sort((a, b) => b - a)
})

// 🔹 Propriété calculée pour filtrer et regrouper les transactions (MODIFIÉE)
const groupedTransactions = computed(() => {
  let filtered = transactions.value

  // 1. Filtrer par Année
  if (selectedYear.value !== 'all') {
    const year = parseInt(selectedYear.value, 10)
    filtered = filtered.filter(t => new Date(t.dateTransaction).getFullYear() === year)
  }

  // 2. Filtrer par Mois (seulement si une année est sélectionnée)
  if (selectedMonth.value !== 'all') {
    const month = parseInt(selectedMonth.value, 10) - 1 // JS months are 0-indexed
    filtered = filtered.filter(t => new Date(t.dateTransaction).getMonth() === month)
  }

  // 3. Filtrer par Type (Revenu ou Dépense) 👈 NOUVEAU FILTRE
  if (selectedType.value === 'revenu') {
    filtered = filtered.filter(t => t.montant > 0)
  } else if (selectedType.value === 'depense') {
    filtered = filtered.filter(t => t.montant < 0)
  }

  // 4. Regrouper par Année et Mois
  const groups = filtered.reduce((acc, transaction) => {
    const date = new Date(transaction.dateTransaction)
    // Clé de regroupement : Année + Mois (pour le tri et l'unicité)
    const yearMonthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`

    // Nom affiché
    const monthName = monthNames[date.getMonth() + 1].name
    const groupTitle = `${monthName} ${date.getFullYear()}`

    if (!acc[yearMonthKey]) {
      acc[yearMonthKey] = {
        groupTitle: groupTitle, // Titre pour l'affichage
        total: 0,
        items: []
      }
    }

    // Calcul du total du groupe
    acc[yearMonthKey].total += transaction.montant
    acc[yearMonthKey].items.push(transaction)

    return acc
  }, {})

  // Convertir l'objet de groupes en tableau pour l'itération dans la template,
  // en triant explicitement par la clé (année-mois) pour garantir l'ordre
  const groupedArray = Object.keys(groups).sort((a, b) => b.localeCompare(a)).map(key => ({
    groupKey: key, // Nouvelle clé unique pour l'accordéon
    ...groups[key]
  }))

  return groupedArray
})


// 🔹 Initialisation
onMounted(async () => {
  await fetchCompte()
  await fetchTransactions()

  // Définit l'année sélectionnée par défaut sur la dernière année disponible
  if (availableYears.value.length > 0) {
    selectedYear.value = availableYears.value[0].toString()
  }
})

// 🔹 Retour arrière
const goBack = () => router.back()
</script>

<template>
  <div class="container-fluid bg-dark text-white py-4 min-vh-100">
    <button class="btn btn-outline-warning mb-4" @click="goBack">
      <i class="pi pi-arrow-circle-left me-2"></i> Retour
    </button>

    <div v-if="isLoading" class="text-center">Chargement...</div>

    <div v-else-if="errorMessage" class="text-danger text-center">
      {{ errorMessage }}
    </div>

    <div v-else-if="compte">
      <h2 class="text-warning text-center">{{ compte.nom }}</h2>
      <p class="fs-4 text-center">Solde actuel : <span :class="compte.solde < 0 ? 'text-danger' : 'text-success'">{{
        compte.solde.toFixed(2) }} €</span></p>
      <hr class="border-secondary" />

      <h4 class="mt-4 mb-3">Transactions associées</h4>

      <!-- FILTRES ANNUELS, MENSUELS ET TYPE -->
      <div class="row mb-4 gx-3">
        <div class="col-6 col-md-3">
          <label for="filter-year" class="form-label text-light fw-bold">Filtrer par Année</label>
          <select id="filter-year" class="form-select bg-secondary text-white border-light" v-model="selectedYear">
            <option value="all">Toutes les années</option>
            <option v-for="year in availableYears" :key="year" :value="year.toString()">
              {{ year }}
            </option>
          </select>
        </div>
        <div class="col-6 col-md-3">
          <label for="filter-month" class="form-label text-light fw-bold">Filtrer par Mois</label>
          <select id="filter-month" class="form-select bg-secondary text-white border-light" v-model="selectedMonth"
            :disabled="selectedYear === 'all'">
            <option v-for="month in monthNames" :key="month.value" :value="month.value">
              {{ month.name }}
            </option>
          </select>
        </div>
        <!-- 👈 NOUVEAU : Filtre par type de transaction (Revenu/Dépense) -->
        <div class="col-12 col-md-3 mt-3 mt-md-0">
          <label for="filter-type" class="form-label text-light fw-bold">Filtrer par Type</label>
          <select id="filter-type" class="form-select bg-secondary text-white border-light" v-model="selectedType">
            <option v-for="type in typeOptions" :key="type.value" :value="type.value">
              {{ type.name }}
            </option>
          </select>
        </div>
      </div>
      <!-- /FILTRES -->

      <!-- AFFICHAGE DES GROUPES DE TRANSACTIONS AVEC ACCORDÉON -->
      <div v-if="groupedTransactions.length > 0" class="accordion" id="transactionsAccordion">
        <div v-for="(group, index) in groupedTransactions" :key="group.groupKey"
          class="accordion-item bg-dark border-secondary mb-4 shadow-lg rounded">

          <!-- En-tête du groupe (Bouton Accordéon) -->
          <h2 class="accordion-header" :id="`heading-${group.groupKey}`">
            <button
              class="accordion-button bg-secondary text-white fw-bold d-flex justify-content-between align-items-center"
              type="button" data-bs-toggle="collapse" :data-bs-target="`#collapse-${group.groupKey}`"
              :aria-expanded="index === 0" :aria-controls="`collapse-${group.groupKey}`"
              :class="{ 'collapsed': index !== 0 }">
              <!-- Titre et flèche (inclus par défaut dans accordion-button) -->
              <span class="text-warning me-3">{{ group.groupTitle }}</span>
              <!-- Total Net -->
              <!-- NOTE : Si le filtre est actif (selectedType n'est pas 'all'), on n'affiche plus le "Total Net", mais le "Total" du type sélectionné. -->
              <span class="badge border rounded-pill fs-6 ms-auto me-3"
                :class="group.total < 0 ? 'bg-danger' : 'bg-success'">
                {{ selectedType === 'all' ? 'Total Net' : 'Total' }} : {{ group.total.toFixed(2) }} €
              </span>
            </button>
          </h2>

          <!-- Corps du groupe (Contenu du Tableau) -->
          <div :id="`collapse-${group.groupKey}`" class="accordion-collapse collapse"
            :aria-labelledby="`heading-${group.groupKey}`" data-bs-parent="#transactionsAccordion"
            :class="{ 'show': index === 0 }"> <!-- Ouvre le premier groupe par défaut -->

            <div class="accordion-body p-0">
              <table class="table table-dark table-hover mb-0">
                <thead>
                  <tr class="text-warning">
                    <th>Date</th>
                    <th class="d-none d-md-table-cell">Libellé</th>
                    <th>Montant (€)</th>
                    <th class="d-none d-md-table-cell">Catégorie</th>
                    <th>Discipline</th>
                    <th class="d-none d-md-table-cell">Sensei</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="t in group.items" :key="t.transactionId">
                    <td>{{ new Date(t.dateTransaction).toLocaleDateString() }}</td>
                    <td class="d-none d-md-table-cell">{{ t.description }}</td>
                    <td :class="t.montant < 0 ? 'text-danger fw-bold' : 'text-success fw-bold'">
                      {{ t.montant.toFixed(2) }}
                    </td>
                    <td class="d-none d-md-table-cell">{{ t.categorie?.nom || '-' }}</td>
                    <td>{{ t.discipline?.nom || '-' }}</td>
                    <td class="d-none d-md-table-cell">{{ t.user?.nom ?? '-' }} {{ t.user?.prenom ?? '' }}</td>
                    <td>
                      <button class="btn btn-sm btn-info me-2" @click="openEditModal(t)">
                        <i class="pi pi-pencil"></i>
                      </button>
                      <button class="btn btn-sm btn-danger" @click="deleteTransaction(t.transactionId, t.description)">
                        <i class="pi pi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </div>

      <div v-else-if="transactions.length > 0" class="text-light mt-5 p-4 border rounded text-center">
        Aucune transaction ne correspond aux filtres Année ({{ selectedYear === 'all' ? 'Toutes' : selectedYear }}),
        Mois ({{monthNames.find(m => m.value === selectedMonth)?.name}}) et Type ({{typeOptions.find(t => t.value ===
          selectedType)?.name}}).
      </div>

      <div v-else class="text-light mt-5 p-4 border rounded text-center">
        Aucune transaction n'est associée à ce compte.
      </div>

    </div>


    <ModalAddTransaction :show="showModal" :transaction-to-edit="transactionToEdit" @update:show="showModal = $event"
      @refresh="handleRefresh"></ModalAddTransaction>

  </div>
</template>

<style scoped>
table th,
table td {
  vertical-align: middle;
}

.text-success {
  color: #88fab2 !important;
}

.form-select:disabled {
  opacity: 0.6;
}


.accordion-button.bg-secondary:not(.collapsed) {
  color: #fff;
  background-color: #4a4a4a !important;

}

.accordion-button::after {
  filter: invert(0.8);
  /* Rendre la flèche plus visible sur fond sombre */
}
</style>
