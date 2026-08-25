<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import api from '@/api/axios'

// ===============================
// 🔹 PROPS & EMITS
// ===============================
const props = defineProps({
  show: { type: Boolean, default: false },
  transactionToEdit: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:show', 'refresh'])
const localShow = ref(props.show)

// ===============================
// 🔹 STATES
// ===============================
const comptes = ref([])
const disciplines = ref([])
const categorieTransactions = ref([])
const isLoading = ref(false)
const alertMessage = ref('')
const alertType = ref('')

// ===============================
// 🔹 FORMULAIRE
// ===============================
const defaultForm = {
  transactionId: null,
  date: '',
  type: null,
  libelle: '',
  montant: '',
  compteId: null,
  destinationCompteId: null,
  categorieTransactionId: null,
  disciplineId: null
}
const transactionForm = ref({ ...defaultForm })

// ===============================
// 🔹 API ENDPOINTS
// ===============================
const API_TRANSACTION = '/Transaction'
const API_COMPTE = '/Compte'
const API_DISCIPLINE = '/Discipline'
const API_CATEGORIE_TRANSACTION = '/CategorieTransaction'

// ===============================
// 🔹 COMPUTED
// ===============================
const isEditing = computed(() => !!props.transactionToEdit)
const modalTitle = computed(() => isEditing.value ? 'Modifier la transaction' : 'Nouvelle transaction')

const typeFluxLabel = typeFlux => {
  switch (typeFlux) {
    case 1: return 'Revenu'
    case 2: return 'Dépense'
    case 0: return 'Neutre'
    default: return 'Inconnu'
  }
}

const typesDisponibles = computed(() => {
  const uniqueTypes = [...new Set(categorieTransactions.value.map(c => c.typeFlux))]
  return uniqueTypes.map(t => ({ id: t, label: typeFluxLabel(t) }))
})

const categoriesFiltrees = computed(() => {
  if (transactionForm.value.type === null || transactionForm.value.type === '') return categorieTransactions.value
  return categorieTransactions.value.filter(c => c.typeFlux === transactionForm.value.type)
})

// ===============================
// 🔹 GESTION DU FORMULAIRE
// ===============================
const resetForm = () => {
  transactionForm.value = {
    ...defaultForm,
    date: new Date().toISOString().substring(0, 10),
  }
}

const loadTransactionForEdit = () => {
  if (props.transactionToEdit) {
    const t = props.transactionToEdit
    const category = categorieTransactions.value.find(c => c.categorieTransactionId === t.categorieId)
    const typeFlux = category ? category.typeFlux : null

    transactionForm.value = {
      transactionId: t.transactionId,
      date: new Date(t.dateTransaction).toISOString().substring(0, 10),
      type: typeFlux,
      libelle: t.description,
      montant: Math.abs(t.montant),
      compteId: t.compteId,
      destinationCompteId: t.destinationCompteId || null,
      categorieTransactionId: t.categorieId,
      disciplineId: t.disciplineId || null,
    }
  } else {
    resetForm()
  }
}

// Réinitialise la catégorie si le type de flux change et devient incompatible
watch(() => transactionForm.value.type, (newType) => {
  if (newType !== null && transactionForm.value.categorieTransactionId) {
    const catExiste = categoriesFiltrees.value.some(c => c.categorieTransactionId === transactionForm.value.categorieTransactionId)
    if (!catExiste) {
      transactionForm.value.categorieTransactionId = null
    }
  }
})

// ===============================
// 🔹 SOUMISSION
// ===============================
const submitForm = async () => {
  if (
    !transactionForm.value.date ||
    !transactionForm.value.libelle ||
    !transactionForm.value.montant ||
    !transactionForm.value.compteId ||
    !transactionForm.value.categorieTransactionId
  ) {
    showAlert('Veuillez remplir tous les champs obligatoires.', 'danger')
    return
  }

  let montant = parseFloat(transactionForm.value.montant.toString().replace(',', '.'))
  if (isNaN(montant) || !isFinite(montant)) {
    showAlert('Le montant saisi est invalide.', 'danger')
    return
  }
  montant = Math.round(montant * 100) / 100

  try {
    isLoading.value = true
    let apiCall
    let successMessage

    const selectedCategory = categorieTransactions.value.find(
      c => c.categorieTransactionId === transactionForm.value.categorieTransactionId
    )
    const typeFlux = selectedCategory ? selectedCategory.typeFlux : 0

    if (transactionForm.value.destinationCompteId) {
      const transferPayload = {
        SourceCompteId: transactionForm.value.compteId,
        DestinationCompteId: transactionForm.value.destinationCompteId,
        Montant: montant,
        Description: transactionForm.value.libelle,
        CategorieId: transactionForm.value.categorieTransactionId,
        DisciplineId: transactionForm.value.disciplineId || null,
        DateTransaction: transactionForm.value.date
      }

      if (isEditing.value) {
        showAlert('La modification de transfert nécessite une route API spécifique.', 'danger')
        return
      } else {
        apiCall = api.post(`${API_TRANSACTION}/transfer`, transferPayload)
        successMessage = 'Transfert effectué avec succès.'
      }
    } else {
      let finalMontant = montant
      if (typeFlux === 2) finalMontant = -Math.abs(montant)
      else if (typeFlux === 1) finalMontant = Math.abs(montant)
      finalMontant = Math.round(finalMontant * 100) / 100

      if (isEditing.value) {
        const updatePayload = {
          Montant: finalMontant,
          Description: transactionForm.value.libelle,
          DateTransaction: transactionForm.value.date,
          CompteId: transactionForm.value.compteId,
          CategorieTransactionId: transactionForm.value.categorieTransactionId,
          DisciplineId: transactionForm.value.disciplineId || null
        }
        apiCall = api.put(`${API_TRANSACTION}/${transactionForm.value.transactionId}`, updatePayload)
        successMessage = 'Transaction modifiée avec succès.'
      } else {
        const createPayload = {
          dateTransaction: transactionForm.value.date,
          montant: finalMontant,
          description: transactionForm.value.libelle,
          compteId: transactionForm.value.compteId,
          categorieTransactionId: transactionForm.value.categorieTransactionId,
          disciplineId: transactionForm.value.disciplineId || null
        }
        apiCall = api.post(API_TRANSACTION, createPayload)
        successMessage = 'Transaction ajoutée avec succès.'
      }
    }

    await apiCall
    showAlert(successMessage, 'success')

    setTimeout(() => {
      localShow.value = false
      alertMessage.value = ''
      emit('refresh')
    }, 1200)

  } catch (error) {
    console.error('Erreur API :', error.response?.data || error)
    showAlert(`Une erreur est survenue : ${error.response?.data?.message || error.message || 'Vérifiez les données.'}`, 'danger')
  } finally {
    isLoading.value = false
  }
}

const showAlert = (msg, type) => {
  alertMessage.value = msg
  alertType.value = type
  if (type === 'danger') {
    setTimeout(() => (alertMessage.value = ''), 4000)
  }
}

// ===============================
// 🔹 WATCHERS & FETCHS
// ===============================
watch(() => props.show, (val) => {
  localShow.value = val
  if (val && categorieTransactions.value.length > 0) {
    loadTransactionForEdit()
  }
})

watch(localShow, val => {
  emit('update:show', val)
  if (!val) resetForm()
})

watch(categorieTransactions, (newCats) => {
  if (props.show && newCats.length > 0) {
    loadTransactionForEdit()
  }
})

async function fetchComptes() {
  try {
    const reponse = await api.get(API_COMPTE)
    comptes.value = reponse.data
  } catch (e) { console.error('Erreur comptes:', e) }
}

async function fetchDisciplines() {
  try {
    const reponse = await api.get(API_DISCIPLINE)
    disciplines.value = reponse.data
  } catch (e) { console.error('Erreur disciplines:', e) }
}

async function fetchCategorieTransaction() {
  try {
    const reponse = await api.get(API_CATEGORIE_TRANSACTION)
    categorieTransactions.value = reponse.data
  } catch (e) { console.error('Erreur catégories:', e) }
}

onMounted(() => {
  fetchComptes()
  fetchDisciplines()
  fetchCategorieTransaction()
  resetForm()
})
</script>

<template>
  <Transition name="modal">
    <div v-if="localShow" class="modal-backdrop" @click.self="localShow = false">
      <div class="modal-container">
        <!-- Header -->
        <div class="modal-header">
          <h3 class="modal-title">{{ modalTitle }}</h3>
          <button type="button" class="close-btn" aria-label="Fermer" @click="localShow = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Alerte -->
        <Transition name="fade">
          <div v-if="alertMessage" :class="['alert-banner', alertType === 'success' ? 'alert-success' : 'alert-danger']" role="alert">
            <span class="alert-icon">{{ alertType === 'success' ? '✓' : '!' }}</span>
            <span>{{ alertMessage }}</span>
          </div>
        </Transition>

        <!-- Formulaire -->
        <form @submit.prevent="submitForm" class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Date <span class="required">*</span></label>
              <input type="date" v-model="transactionForm.date" class="form-input" required />
            </div>

            <div class="form-group">
              <label class="form-label">Type de flux <span class="required">*</span></label>
              <select v-model.number="transactionForm.type" class="form-select" required>
                <option :value="null" disabled>Sélectionner...</option>
                <option v-for="t in typesDisponibles" :key="t.id" :value="t.id">{{ t.label }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Compte source <span class="required">*</span></label>
              <select v-model.number="transactionForm.compteId" class="form-select" required>
                <option :value="null" disabled>Sélectionner...</option>
                <option v-for="c in comptes" :key="c.compteId" :value="c.compteId">{{ c.nom }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Transférer vers <span class="optional">(optionnel)</span></label>
              <select v-model.number="transactionForm.destinationCompteId" class="form-select">
                <option :value="null">-- Aucun --</option>
                <option
                  v-for="c in comptes.filter(c => c.compteId !== transactionForm.compteId)"
                  :key="c.compteId"
                  :value="c.compteId"
                >
                  {{ c.nom }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Catégorie <span class="required">*</span></label>
              <select v-model.number="transactionForm.categorieTransactionId" class="form-select" required>
                <option :value="null" disabled>Sélectionner...</option>
                <option v-for="cat in categoriesFiltrees" :key="cat.categorieTransactionId" :value="cat.categorieTransactionId">
                  {{ cat.nom }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Montant (€) <span class="required">*</span></label>
              <div class="input-prefix-wrapper">
                <input type="number" step="0.01" v-model.number="transactionForm.montant" placeholder="0.00" class="form-input" required />
                <span class="currency-symbol">€</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Discipline <span class="optional">(optionnel)</span></label>
            <select v-model.number="transactionForm.disciplineId" class="form-select">
              <option :value="null">-- Aucune --</option>
              <option v-for="d in disciplines" :key="d.disciplineId" :value="d.disciplineId">
                {{ d.nom }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Libellé <span class="required">*</span></label>
            <textarea rows="2" v-model="transactionForm.libelle" placeholder="Ex: Achat fournitures..." class="form-input form-textarea" required></textarea>
          </div>

          <!-- Actions -->
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="localShow = false" :disabled="isLoading">
              Annuler
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              <span v-if="isLoading" class="spinner"></span>
              <span>{{ isEditing ? 'Enregistrer' : 'Ajouter' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ===============================
   🔹 DESIGN SYSTEM & VARS
   =============================== */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(12, 13, 15, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  padding: 1rem;
}

.modal-container {
  background: #1e2126;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6);
  color: #f1f3f5;
  overflow: hidden;
}

/* ===============================
   🔹 HEADER
   =============================== */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.01em;
}

.close-btn {
  background: transparent;
  border: none;
  color: #8a919e;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

/* ===============================
   🔹 ALERTS
   =============================== */
.alert-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1rem 1.5rem 0 1.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.alert-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: bold;
}

.alert-success {
  background: rgba(46, 213, 115, 0.12);
  border: 1px solid rgba(46, 213, 115, 0.3);
  color: #2ed573;
}
.alert-success .alert-icon {
  background: #2ed573;
  color: #1e2126;
}

.alert-danger {
  background: rgba(255, 71, 87, 0.12);
  border: 1px solid rgba(255, 71, 87, 0.3);
  color: #ff4757;
}
.alert-danger .alert-icon {
  background: #ff4757;
  color: #ffffff;
}

/* ===============================
   🔹 BODY & FORM
   =============================== */
.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  overflow-y: auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-label {
  font-size: 0.825rem;
  font-weight: 500;
  color: #a0a6b1;
  margin: 0;
}

.required {
  color: #ffbb33;
}

.optional {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: normal;
}

.form-input,
.form-select {
  background: #141619;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-radius: 0.5rem;
  padding: 0.6rem 0.8rem;
  font-size: 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
}

.form-input::placeholder {
  color: #555e6b;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #ffbb33;
  box-shadow: 0 0 0 3px rgba(255, 187, 51, 0.15);
}

.form-textarea {
  resize: vertical;
  min-height: 60px;
}

/* Specific input price styling */
.input-prefix-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-prefix-wrapper .form-input {
  padding-right: 2rem;
}

.currency-symbol {
  position: absolute;
  right: 0.8rem;
  color: #6c757d;
  font-weight: 500;
  pointer-events: none;
}

/* ===============================
   🔹 FOOTER & BUTTONS
   =============================== */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 0.5rem;
  padding: 0.65rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: #c5c9d0;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.btn-primary {
  background: #ffbb33;
  color: #141619;
}

.btn-primary:hover:not(:disabled) {
  background: #ffcc66;
  box-shadow: 0 4px 12px rgba(255, 187, 51, 0.25);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Spinner Loader */
.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(20, 22, 25, 0.2);
  border-top-color: #141619;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===============================
   🔹 TRANSITIONS VUE (V-IF)
   =============================== */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from .modal-container {
  transform: scale(0.96) translateY(8px);
}

.modal-leave-to .modal-container {
  transform: scale(0.98) translateY(-4px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
