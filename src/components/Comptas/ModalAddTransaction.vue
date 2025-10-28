<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '@/api/axios' // Assure-toi que ton instance Axios est bien importée ici

// ===============================
// 🔹 PROPS & EMITS
// ===============================
const props = defineProps({
  show: { type: Boolean, default: false },
  categories: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:show', 'submit'])
const localShow = ref(props.show)

watch(() => props.show, val => localShow.value = val)
watch(localShow, val => emit('update:show', val))

// ===============================
// 🔹 STATES
// ===============================
const comptes = ref([])
const disciplines = ref([])
const categorieTransactions = ref([]);
const isLoading = ref(false)
const errorMessage = ref(null)

// ===============================
// 🔹 FORMULAIRE
// ===============================
const transactionForm = ref({
  date: '',
  type: '',
  libelle: '',
  montant: '',
  compteId: null,
  categorieTransactionId: null,
  disciplineId: null,
})

// ===============================
// 🔹 API ENDPOINTS
// ===============================
const API_COMPTE = '/Compte'
const API_DISCIPLINE = '/Discipline'
const API_CATEGORIE_TRANSACTION = '/CategorieTransaction'

// ===============================
// 🔹 FONCTIONS
// ===============================
const submitForm = () => {
  if (!transactionForm.value.date || !transactionForm.value.libelle || !transactionForm.value.montant) {
    alert('Veuillez remplir tous les champs obligatoires !')
    return
  }

  emit('submit', { ...transactionForm.value })
  localShow.value = false

  transactionForm.value = {
    date: '',
    type: '',
    libelle: '',
    montant: '',
    compteId: null,
    categorieTransactionId: null,
    disciplineId: null,
  }
}

// --- Récupération des comptes
async function fetchComptes() {
  try {
    isLoading.value = true
    const response = await api.get(API_COMPTE)
    comptes.value = response.data
    console.log('✅ Comptes récupérés :', comptes.value)
  } catch (error) {
    console.error('❌ Erreur lors du chargement des comptes :', error)
    errorMessage.value = "Erreur lors du chargement des comptes."
  } finally {
    isLoading.value = false
  }
}

// recuperation des categorie transactionForm
async function fetchCategorieTransaction() {
  try {
    isLoading.value = true
    const response = await api.get(API_CATEGORIE_TRANSACTION)
    categorieTransactions.value = response.data
    console.log('✅ categorieTransaction récupérés :', categorieTransactions.value)
  } catch (error) {
    console.error('❌ Erreur lors du chargement des categorieTransaction :', error)
    errorMessage.value = "Erreur lors du chargement des categorieTransaction."
  } finally {
    isLoading.value = false
  }
}

// --- Récupération des disciplines
async function fetchDisciplines() {
  try {
    const response = await api.get(API_DISCIPLINE)
    disciplines.value = response.data
    console.log('✅ Disciplines récupérées :', disciplines.value)
  } catch (error) {
    console.error('❌ Erreur lors du chargement des disciplines :', error)
  }
}

const typeFluxLabel = (typeFlux) => {
  switch (typeFlux) {
    case 1: return 'Revenu'
    case 2: return 'Dépense'
    case 0: return 'Neutre'
    default: return 'Inconnu'
  }
}

import { computed } from 'vue'

const typesDisponibles = computed(() => {
  // On regroupe les types distincts présents dans les catégories
  const uniqueTypes = [...new Set(categorieTransactions.value.map(c => c.typeFlux))]
  return uniqueTypes.map(t => ({ id: t, label: typeFluxLabel(t) }))
})

const categoriesFiltrees = computed(() => {
  if (!transactionForm.value.type) return categorieTransactions.value
  return categorieTransactions.value.filter(c => c.typeFlux === transactionForm.value.type)
})




// --- Chargement initial
onMounted(() => {
  fetchComptes()
  fetchDisciplines()
  fetchCategorieTransaction()
})
</script>

<template>
  <transition name="fade">
    <div v-if="localShow" class="modal-backdrop">
      <div class="modal-container">
        <div class="modal-header">
          <h5>Ajouter une transaction</h5>
          <button class="close-btn" @click="localShow = false">&times;</button>
        </div>

        <form @submit.prevent="submitForm" class="modal-form">
          <div class="form-group">
            <label>Date</label>
            <input type="date" v-model="transactionForm.date" class="form-control" />
          </div>

          <div class="form-group">
            <label>Type</label>
            <select v-model="transactionForm.type" class="form-select">
              <option :value="null" disabled>Choisir un type de transaction</option>
              <option v-for="t in typesDisponibles" :key="t.id" :value="t.id">
                {{ t.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Compte</label>
            <select v-model="transactionForm.compteId" class="form-select">
              <option :value="null" disabled>Choisir un compte</option>
              <option v-for="compte in comptes" :key="compte.compteId" :value="compte.compteId">
                {{ compte.nom }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Catégorie</label>
            <select v-model="transactionForm.categorieTransactionId" class="form-select">
              <option :value="null" disabled>Choisir une catégorie</option>
              <option v-for="cat in categoriesFiltrees" :key="cat.categorieTransactionId"
                :value="cat.categorieTransactionId">
                {{ cat.nom }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Libellé</label>
            <textarea rows="3" v-model="transactionForm.libelle" class="form-control" />
          </div>

          <div class="form-group">
            <label>Montant (€)</label>
            <input type="number" step="0.01" v-model="transactionForm.montant" class="form-control" />
          </div>

          <div class="form-group">
            <label>Discipline</label>
            <select v-model="transactionForm.disciplineId" class="form-select">
              <option :value="null" disabled>Choisir une discipline</option>
              <option v-for="d in disciplines" :key="d.disciplineId" :value="d.disciplineId">
                {{ d.nom }}
              </option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn cancel-btn" @click="localShow = false">Annuler</button>
            <button type="submit" class="btn submit-btn">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* même CSS que ta version précédente */
</style>



<style scoped>
/* backdrop + animation */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* modal container */
.modal-container {
  background: #2c2f33;
  border-radius: 1rem;
  padding: 2rem;
  width: 450px;
  max-width: 90%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.close-btn:hover {
  transform: scale(1.2);
}

/* form */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group label {
  margin-bottom: 0.25rem;
  font-weight: 500;
  color: #ccc;
}

.form-control,
.form-select {
  background: #1f2124;
  border: 1px solid #555;
  color: #fff;
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.form-control:focus,
.form-select:focus {
  border-color: #ffbb33;
  outline: none;
}

/* actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn {
  background: #555;
  color: #fff;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  transition: background 0.2s ease;
}

.cancel-btn:hover {
  background: #777;
}

.submit-btn {
  background: #ffbb33;
  color: #2c2f33;
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
  transition: background 0.2s ease;
}

.submit-btn:hover {
  background: #ffcc66;
}
</style>
