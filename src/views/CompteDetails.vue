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
const selectedSeason = ref('all')
const selectedMonth = ref('all')
const selectedType = ref('all')

const API_COMPTES = '/Compte'
const API_TRANSACTIONS = '/Transaction'

// Tableau des noms de mois
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

// Options de type de transaction
const typeOptions = [
  { value: 'all', name: 'Tous les flux' },
  { value: 'revenu', name: 'Revenus (+)' },
  { value: 'depense', name: 'Dépenses (-)' },
]

// --------------------------------------------------
// 🔹 FONCTIONS D'ACTION
// --------------------------------------------------
async function fetchCompte() {
  try {
    isLoading.value = true
    const response = await api.get(`${API_COMPTES}/${compteId}`)
    compte.value = response.data
  } catch (error) {
    console.error('❌ Erreur lors du chargement du compte :', error)
    errorMessage.value = "Erreur lors du chargement des informations du compte."
  }
}

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
  if (!confirm(`Êtes-vous sûr de vouloir supprimer "${description}" ? Le solde sera réajusté.`)) {
    return
  }

  try {
    isLoading.value = true
    await api.delete(`${API_TRANSACTIONS}/${transactionId}`)
    await handleRefresh()
  } catch (error) {
    console.error('❌ Erreur lors de la suppression :', error)
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
  showModal.value = false
  transactionToEdit.value = null
  await Promise.all([
    fetchCompte(),
    fetchTransactions()
  ])
}

const availableSeasons = computed(() => {
  const seasons = new Set()
  transactions.value.forEach(t => {
    const date = new Date(t.dateTransaction)
    const year = date.getFullYear()
    const month = date.getMonth()
    const seasonStartYear = month >= 8 ? year : year - 1
    seasons.add(seasonStartYear)
  })
  return Array.from(seasons).sort((a, b) => b - a)
})

const groupedTransactions = computed(() => {
  let filtered = transactions.value

  if (selectedSeason.value !== 'all') {
    const seasonStartYear = parseInt(selectedSeason.value, 10)
    const seasonStart = new Date(seasonStartYear, 8, 1)
    const seasonEnd = new Date(seasonStartYear + 1, 5, 30, 23, 59, 59, 999)

    filtered = filtered.filter(t => {
      const date = new Date(t.dateTransaction)
      return date >= seasonStart && date <= seasonEnd
    })
  }

  if (selectedMonth.value !== 'all') {
    const month = parseInt(selectedMonth.value, 10) - 1
    filtered = filtered.filter(t => new Date(t.dateTransaction).getMonth() === month)
  }

  if (selectedType.value === 'revenu') {
    filtered = filtered.filter(t => t.montant > 0)
  } else if (selectedType.value === 'depense') {
    filtered = filtered.filter(t => t.montant < 0)
  }

  const groups = filtered.reduce((acc, transaction) => {
    const date = new Date(transaction.dateTransaction)
    const yearMonthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
    const monthName = monthNames[date.getMonth() + 1].name
    const groupTitle = `${monthName} ${date.getFullYear()}`

    if (!acc[yearMonthKey]) {
      acc[yearMonthKey] = {
        groupTitle,
        total: 0,
        items: []
      }
    }

    acc[yearMonthKey].total += transaction.montant
    acc[yearMonthKey].items.push(transaction)
    return acc
  }, {})

  return Object.keys(groups)
    .sort((a, b) => b.localeCompare(a))
    .map(key => ({
      groupKey: key,
      ...groups[key]
    }))
})

onMounted(async () => {
  await fetchCompte()
  await fetchTransactions()

  if (availableSeasons.value.length > 0) {
    selectedSeason.value = availableSeasons.value[0].toString()
  }
})

const goBack = () => router.back()
</script>

<template>
  <div class="account-details-wrapper min-vh-100 py-4 px-3 px-md-4">
    <div class="w-100">

      <!-- Bouton Retour -->
      <button class="btn btn-dark-custom mb-4 d-inline-flex align-items-center gap-2" @click="goBack">
        <i class="pi pi-arrow-left"></i>
        <span>Retour au tableau de bord</span>
      </button>

      <!-- ÉTAT: CHARGEMENT -->
      <div v-if="isLoading" class="glass-card text-center py-5">
        <div class="spinner-border text-warning mb-3" role="status"></div>
        <p class="text-white-50 mb-0">Chargement du compte et des écritures...</p>
      </div>

      <!-- ÉTAT: ERREUR -->
      <div v-else-if="errorMessage" class="glass-card border-danger text-center py-5">
        <i class="pi pi-exclamation-triangle text-danger fs-1 mb-3"></i>
        <p class="text-danger fw-bold fs-5 mb-0">{{ errorMessage }}</p>
      </div>

      <!-- ÉTAT: SUCCÈS -->
      <div v-else-if="compte">

        <!-- CARTE HERO COMPTE -->
        <div class="glass-card hero-compte mb-4 p-4 p-md-5 position-relative overflow-hidden">
          <div class="row align-items-center position-relative z-1">
            <div class="col-md-7 text-center text-md-start mb-3 mb-md-0">
              <span class="badge rounded-pill bg-warning text-dark font-mono px-3 py-2 text-uppercase fw-bold mb-2">
                Compte Trésorerie
              </span>
              <h1 class="display-5 fw-bold text-white mb-1">{{ compte.nom }}</h1>
              <p class="text-white-50 mb-0 fs-6">Historique complet et gestion du journal de caisse</p>
            </div>

            <div class="col-md-5 text-center text-md-end">
              <div class="solde-box d-inline-block text-center text-md-end p-3 rounded-4">
                <span class="text-white-50 fs-7 text-uppercase fw-semibold d-block mb-1">Solde Actuel</span>
                <span class="display-6 fw-bold font-mono" :class="compte.solde < 0 ? 'text-danger-glow' : 'text-success-glow'">
                  {{ compte.solde.toFixed(2) }} €
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- PANNEAU DE FILTRES -->
        <div class="glass-card mb-4 p-4">
          <div class="d-flex align-items-center gap-2 mb-3">
            <i class="pi pi-filter text-warning"></i>
            <h5 class="text-white fw-bold mb-0 fs-6">Filtres de recherche</h5>
          </div>

          <div class="row g-3">
            <!-- Filtre Saison -->
            <div class="col-12 col-sm-6 col-md-4">
              <label for="filter-season" class="form-label text-white-50 fs-7 fw-bold">Saison sportive</label>
              <div class="input-group">
                <span class="input-group-text custom-input-text"><i class="pi pi-calendar"></i></span>
                <select id="filter-season" class="form-select custom-select" v-model="selectedSeason">
                  <option value="all">Toutes les saisons</option>
                  <option v-for="season in availableSeasons" :key="season" :value="season.toString()">
                    Saison {{ season }}-{{ season + 1 }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Filtre Mois -->
            <div class="col-12 col-sm-6 col-md-4">
              <label for="filter-month" class="form-label text-white-50 fs-7 fw-bold">Période mensuelle</label>
              <div class="input-group">
                <span class="input-group-text custom-input-text"><i class="pi pi-clock"></i></span>
                <select id="filter-month" class="form-select custom-select" v-model="selectedMonth" :disabled="selectedSeason === 'all'">
                  <option v-for="month in monthNames" :key="month.value" :value="month.value">
                    {{ month.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Filtre Type -->
            <div class="col-12 col-md-4">
              <label for="filter-type" class="form-label text-white-50 fs-7 fw-bold">Type d'opération</label>
              <div class="input-group">
                <span class="input-group-text custom-input-text"><i class="pi pi-sliders-h"></i></span>
                <select id="filter-type" class="form-select custom-select" v-model="selectedType">
                  <option v-for="type in typeOptions" :key="type.value" :value="type.value">
                    {{ type.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- LISTE DES TRANSACTIONS (ACCORDÉON) -->
        <div v-if="groupedTransactions.length > 0" class="accordion custom-accordion d-flex flex-column gap-3" id="transactionsAccordion">
          <div v-for="(group, index) in groupedTransactions" :key="group.groupKey" class="accordion-item glass-card overflow-hidden">

            <!-- En-tête Groupe -->
            <h2 class="accordion-header" :id="`heading-${group.groupKey}`">
              <button
                class="accordion-button custom-accordion-button d-flex align-items-center justify-content-between p-3"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="`#collapse-${group.groupKey}`"
                :aria-expanded="index === 0"
                :aria-controls="`collapse-${group.groupKey}`"
                :class="{ 'collapsed': index !== 0 }">

                <div class="d-flex align-items-center gap-3">
                  <span class="accordion-title-text text-white fw-bold fs-5">{{ group.groupTitle }}</span>
                  <span class="badge bg-dark border border-secondary text-white-50 font-mono px-2 py-1">
                    {{ group.items.length }} transaction{{ group.items.length > 1 ? 's' : '' }}
                  </span>
                </div>

                <div class="d-flex align-items-center me-3">
                  <span class="net-badge font-mono fw-bold fs-6" :class="group.total < 0 ? 'bg-danger-subtle text-danger border-danger' : 'bg-success-subtle text-success border-success'">
                    {{ selectedType === 'all' ? 'Total Net' : 'Total' }} : {{ group.total.toFixed(2) }} €
                  </span>
                </div>
              </button>
            </h2>

            <!-- Corps Groupe -->
            <div :id="`collapse-${group.groupKey}`" class="accordion-collapse collapse"
              :aria-labelledby="`heading-${group.groupKey}`" data-bs-parent="#transactionsAccordion"
              :class="{ 'show': index === 0 }">

              <div class="accordion-body p-0">
                <div class="table-responsive">
                  <table class="table custom-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th class="d-none d-md-table-cell">Libellé</th>
                        <th class="text-end">Montant</th>
                        <th class="d-none d-md-table-cell text-center">Catégorie</th>
                        <th class="text-center">Discipline</th>
                        <th class="d-none d-md-table-cell">Intervenant</th>
                        <th class="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="t in group.items" :key="t.transactionId">
                        <!-- Date -->
                        <td class="font-mono fs-7 text-white-50">
                          {{ new Date(t.dateTransaction).toLocaleDateString() }}
                        </td>

                        <!-- Libellé -->
                        <td class="d-none d-md-table-cell fw-semibold text-white">
                          {{ t.description }}
                        </td>

                        <!-- Montant -->
                        <td class="text-end font-mono fw-bold fs-6" :class="t.montant < 0 ? 'text-danger' : 'text-success'">
                          {{ t.montant > 0 ? '+' : '' }}{{ t.montant.toFixed(2) }} €
                        </td>

                        <!-- Catégorie (Correction du contraste) -->
                        <td class="d-none d-md-table-cell text-center">
                          <span class="badge badge-category fs-7">
                            {{ t.categorie?.nom || '—' }}
                          </span>
                        </td>

                        <!-- Discipline -->
                        <td class="text-center">
                          <span class="badge rounded-pill bg-dark border border-warning text-warning px-3 py-1 fs-7">
                            {{ t.discipline?.nom || 'Général' }}
                          </span>
                        </td>

                        <!-- Sensei / Intervenant -->
                        <td class="d-none d-md-table-cell text-white-50 fs-7">
                          <div v-if="t.user?.nom" class="d-flex align-items-center gap-2">
                            <i class="pi pi-user text-warning"></i>
                            <span>{{ t.user.nom }} {{ t.user.prenom }}</span>
                          </div>
                          <span v-else class="text-muted">—</span>
                        </td>

                        <!-- Actions -->
                        <td class="text-center">
                          <div class="d-flex justify-content-center gap-2">
                            <button class="btn btn-action btn-edit" title="Modifier" @click="openEditModal(t)">
                              <i class="pi pi-pencil"></i>
                            </button>
                            <button class="btn btn-action btn-delete" title="Supprimer" @click="deleteTransaction(t.transactionId, t.description)">
                              <i class="pi pi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- SANS RÉSULTATS (AVEC FILTRES) -->
        <div v-else-if="transactions.length > 0" class="glass-card text-center py-5 my-4">
          <i class="pi pi-search-minus text-warning display-4 mb-3 d-block"></i>
          <h5 class="text-white fw-bold mb-2">Aucune écriture trouvée</h5>
          <p class="text-white-50 max-w-lg mx-auto mb-0 fs-6">
            Aucune transaction ne correspond à la combinaison actuelle des filtres.
          </p>
        </div>

        <!-- SANS TRANSACTIONS DANS LE COMPTE -->
        <div v-else class="glass-card text-center py-5 my-4">
          <i class="pi pi-inbox text-white-50 display-4 mb-3 d-block"></i>
          <h5 class="text-white fw-bold mb-1">Journal de caisse vide</h5>
          <p class="text-white-50 mb-0">Aucune transaction n'a encore été enregistrée sur ce compte.</p>
        </div>

      </div>
    </div>

    <!-- MODALE -->
    <ModalAddTransaction
      :show="showModal"
      :transaction-to-edit="transactionToEdit"
      @update:show="showModal = $event"
      @refresh="handleRefresh">
    </ModalAddTransaction>

  </div>
</template>

<style scoped>
/* ──────── Global & Utilities ──────── */
.account-details-wrapper {
  background-color: #121418;
  color: #e2e8f0;
}

.font-mono {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

.fs-7 {
  font-size: 0.825rem;
}

/* ──────── Badges ──────── */
.badge-category {
  background-color: #1e2430;
  color: #f3f4f6;
  border: 1px solid rgba(251, 191, 36, 0.4);
  padding: 0.35rem 0.65rem;
  border-radius: 0.375rem;
  font-weight: 500;
}

/* ──────── Dark Glass Cards ──────── */
.glass-card {
  background: linear-gradient(135deg, rgba(30, 36, 46, 0.7) 0%, rgba(20, 24, 32, 0.85) 100%);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.hero-compte {
  background: linear-gradient(135deg, #1e2530 0%, #151921 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.solde-box {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.text-success-glow {
  color: #34d399;
  text-shadow: 0 0 12px rgba(52, 211, 153, 0.3);
}

.text-danger-glow {
  color: #f87171;
  text-shadow: 0 0 12px rgba(248, 113, 113, 0.3);
}

/* ──────── Boutons Custom ──────── */
.btn-dark-custom {
  background-color: #1a1e24;
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-dark-custom:hover {
  background-color: #262c36;
  color: #fff;
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

/* ──────── Form inputs ──────── */
.custom-input-text {
  background-color: #161a20;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-right: none;
  color: #fbbf24;
}

.custom-select {
  background-color: #161a20;
  color: #f1f5f9;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-left: none;
}

.custom-select:focus {
  background-color: #1a1f27;
  color: #fff;
  border-color: #fbbf24;
  box-shadow: none;
}

.custom-select:disabled {
  background-color: #0d0f12;
  opacity: 0.5;
}

/* ──────── Accordion Styles ──────── */
.custom-accordion .accordion-item {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.custom-accordion-button {
  background: rgba(30, 36, 46, 0.5) !important;
  box-shadow: none !important;
}

.custom-accordion-button:not(.collapsed) {
  background: rgba(43, 52, 66, 0.8) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.custom-accordion-button::after {
  filter: invert(1) opacity(0.7);
}

.net-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 2rem;
  border: 1px solid;
}

.bg-danger-subtle {
  background: rgba(239, 68, 68, 0.15);
}

.bg-success-subtle {
  background: rgba(16, 185, 129, 0.15);
}

/* ──────── Table Styles ──────── */
.custom-table {
  --bs-table-bg: transparent;
  --bs-table-color: #e2e8f0;
  margin-bottom: 0;
}

.custom-table th {
  background-color: rgba(0, 0, 0, 0.3);
  color: #fbbf24;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.custom-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.custom-table tbody tr {
  transition: background-color 0.15s ease;
}

.custom-table tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

/* ──────── Action Buttons ──────── */
.btn-action {
  width: 32px;
  height: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.4rem;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.btn-edit {
  background-color: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.3);
}

.btn-edit:hover {
  background-color: #38bdf8;
  color: #0f172a;
  transform: translateY(-2px);
}

.btn-delete {
  background-color: rgba(248, 113, 113, 0.15);
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.3);
}

.btn-delete:hover {
  background-color: #f87171;
  color: #0f172a;
  transform: translateY(-2px);
}
</style>
