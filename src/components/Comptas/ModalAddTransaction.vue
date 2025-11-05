<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import api from '@/api/axios'

// ===============================
// 🔹 PROPS & EMITS
// ===============================
const props = defineProps({
    show: { type: Boolean, default: false },
    // La transaction à éditer est maintenant reçue du parent
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
    transactionId: null, // Clé pour l'édition
    date: '',
    type: null, // Utilisé pour filtrer les catégories
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
// 🔹 COMPUTED (Mode d'affichage)
// ===============================

// Détermine si le formulaire est en mode édition
const isEditing = computed(() => !!props.transactionToEdit)
const modalTitle = computed(() => isEditing.value ? 'Modifier la Transaction' : 'Ajouter une Transaction')

// Filtrage des listes déroulantes existantes
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
// 🔹 GESTION DU FORMULAIRE (ÉDITION/CRÉATION)
// ===============================

/**
 * Réinitialise le formulaire aux valeurs par défaut.
 */
const resetForm = () => {
    transactionForm.value = {
        ...defaultForm,
        date: new Date().toISOString().substring(0, 10), // Date par défaut
    }
}

/**
 * Charge les données de la prop dans le formulaire pour l'édition.
 */
const loadTransactionForEdit = () => {
    if (props.transactionToEdit) {
        const t = props.transactionToEdit

        // 1. Détermine le Type de Flux pour l'affichage du filtre Catégorie
        const category = categorieTransactions.value.find(c => c.categorieTransactionId === t.categorieId)
        const typeFlux = category ? category.typeFlux : null

        // 2. Copie les données dans le formulaire
        transactionForm.value = {
            transactionId: t.transactionId,
            // Date : Conversion au format YYYY-MM-DD
            date: new Date(t.dateTransaction).toISOString().substring(0, 10),
            type: typeFlux,
            libelle: t.description,
            // Montant : Prend la valeur absolue (le signe est géré par la catégorie)
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


// ===============================
// 🔹 INSERTION / MODIFICATION (MODIFIÉ)
// ===============================
const submitForm = async () => {
    // 🔹 Validation de base
    if (
        !transactionForm.value.date ||
        !transactionForm.value.libelle ||
        !transactionForm.value.montant ||
        !transactionForm.value.compteId ||
        !transactionForm.value.categorieTransactionId
    ) {
        alertMessage.value = '⚠️ Veuillez remplir tous les champs obligatoires.';
        alertType.value = 'danger';
        setTimeout(() => (alertMessage.value = ''), 3000);
        return;
    }

    // 🔹 Convertir le montant correctement (virgule → point) et limiter à 2 décimales
    let montant = parseFloat(transactionForm.value.montant.toString().replace(',', '.'));
    if (isNaN(montant) || !isFinite(montant)) {
        alertMessage.value = '⚠️ Montant invalide.';
        alertType.value = 'danger';
        return;
    }
    montant = Math.round(montant * 100) / 100;

    try {
        isLoading.value = true;
        let apiCall;
        let successMessage;

        // 🔹 Récupérer le type de flux pour gérer le signe
        const selectedCategory = categorieTransactions.value.find(
            c => c.categorieTransactionId === transactionForm.value.categorieTransactionId
        );
        const typeFlux = selectedCategory ? selectedCategory.typeFlux : 0;

        if (transactionForm.value.destinationCompteId) {
            // 🔹 Cas transfert
            const transferPayload = {
                SourceCompteId: transactionForm.value.compteId,
                DestinationCompteId: transactionForm.value.destinationCompteId,
                Montant: montant,
                Description: transactionForm.value.libelle,
                CategorieId: transactionForm.value.categorieTransactionId,
                DisciplineId: transactionForm.value.disciplineId || null,
                DateTransaction: transactionForm.value.date
            };

            if (isEditing.value) {
                alertMessage.value = '⚠️ La modification de transfert nécessite une route API spécifique.';
                alertType.value = 'danger';
                return;
            } else {
                apiCall = api.post(`${API_TRANSACTION}/transfer`, transferPayload);
                successMessage = '✅ Transfert effectué avec succès !';
            }

        } else {
            // 🔹 Transaction normale (Revenu/Dépense)
            let finalMontant = montant;
            if (typeFlux === 2) finalMontant = -Math.abs(montant); // Dépense
            else if (typeFlux === 1) finalMontant = Math.abs(montant); // Revenu
            finalMontant = Math.round(finalMontant * 100) / 100;

            if (isEditing.value) {
                // PUT → TransactionUpdateDto
                const updatePayload = {
                    Montant: finalMontant,
                    Description: transactionForm.value.libelle,
                    DateTransaction: transactionForm.value.date,
                    CompteId: transactionForm.value.compteId,
                    CategorieTransactionId: transactionForm.value.categorieTransactionId,
                    DisciplineId: transactionForm.value.disciplineId || null
                };

                apiCall = api.put(`${API_TRANSACTION}/${transactionForm.value.transactionId}`, updatePayload);
                successMessage = '✅ Transaction modifiée avec succès !';

            } else {
                // POST normal pour créer
                const createPayload = {
                    dateTransaction: transactionForm.value.date,
                    montant: finalMontant,
                    description: transactionForm.value.libelle,
                    compteId: transactionForm.value.compteId,
                    categorieTransactionId: transactionForm.value.categorieTransactionId,
                    disciplineId: transactionForm.value.disciplineId || null
                };

                apiCall = api.post(API_TRANSACTION, createPayload);
                successMessage = '✅ Transaction ajoutée avec succès !';
            }
        }

        // 🔹 Exécuter l'appel API
        await apiCall;
        alertMessage.value = successMessage;
        alertType.value = 'success';

        // 🔹 Fermeture et rafraîchissement
        setTimeout(() => {
            localShow.value = false;
            alertMessage.value = '';
            emit('refresh');
        }, 1500);

    } catch (error) {
        console.error('❌ Erreur :', error.response?.data || error);
        alertMessage.value = `❌ Une erreur est survenue : ${error.response?.data?.message || error.message || 'Veuillez vérifier les données.'}`;
        alertType.value = 'danger';
    } finally {
        isLoading.value = false;
    }
};


// ===============================
// 🔹 WATCHERS
// ===============================

// Synchronisation de la visibilité et chargement des données
watch(() => props.show, (val) => {
    localShow.value = val
    // Si la modale s'ouvre ET que les listes sont chargées, on charge les données d'édition
    if (val && categorieTransactions.value.length > 0) {
        loadTransactionForEdit()
    }
})

// Synchronisation inverse et réinitialisation à la fermeture
watch(localShow, val => {
    emit('update:show', val)
    if (!val) {
        // Réinitialiser le formulaire quand la modale se ferme
        resetForm()
    }
})

// Charge les données d'édition après le chargement des catégories (nécessaire au calcul du 'type' de flux)
watch(categorieTransactions, (newCats) => {
    if (props.show && newCats.length > 0) {
        loadTransactionForEdit()
    }
})

// ===============================
// 🔹 FETCHS
// ===============================
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

// ===============================
// 🔹 MOUNT
// ===============================
onMounted(() => {
    fetchComptes()
    fetchDisciplines()
    fetchCategorieTransaction()

    // Initialiser la date par défaut
    resetForm();
})
</script>

<template>
  <transition name="fade">
    <div v-if="localShow" class="modal-backdrop">
      <div class="modal-container">
        <div class="modal-header">
          <h5>{{ modalTitle }}</h5>
          <button class="close-btn" @click="localShow = false">&times;</button>
        </div>

        <form @submit.prevent="submitForm" class="modal-form">
          <transition name="fade">
            <div v-if="alertMessage"
              :class="['alert', alertType === 'success' ? 'alert-success' : 'alert-danger', 'py-2', 'px-3']"
              role="alert">
              {{ alertMessage }}
            </div>
          </transition>

          <div class="form-group">
            <label>Date</label>
            <input type="date" v-model="transactionForm.date" class="form-control" required />
          </div>

          <div class="form-group">
            <label>Type de flux</label>
            <select v-model.number="transactionForm.type" class="form-select" required>
              <option :value="null" disabled>Choisir un type</option>
              <option v-for="t in typesDisponibles" :key="t.id" :value="t.id">{{ t.label }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>Compte Source</label>
            <select v-model.number="transactionForm.compteId" class="form-select" required>
              <option :value="null" disabled>Choisir un compte</option>
              <option v-for="c in comptes" :key="c.compteId" :value="c.compteId">{{ c.nom }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>Transférer vers (optionnel)</label>
            <select v-model.number="transactionForm.destinationCompteId" class="form-select">
              <option :value="null">-- Aucun --</option>
              <option v-for="c in comptes.filter(c => c.compteId !== transactionForm.compteId)"
                      :key="c.compteId"
                      :value="c.compteId">
                {{ c.nom }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Catégorie</label>
            <select v-model.number="transactionForm.categorieTransactionId" class="form-select" required>
              <option :value="null" disabled>Choisir une catégorie</option>
              <option v-for="cat in categoriesFiltrees" :key="cat.categorieTransactionId"
                :value="cat.categorieTransactionId">
                {{ cat.nom }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Libellé</label>
            <textarea rows="2" v-model="transactionForm.libelle" class="form-control" required></textarea>
          </div>

          <div class="form-group">
            <label>Montant (€)</label>
            <input type="number" step="0.01" v-model.number="transactionForm.montant" class="form-control" required />
          </div>

          <div class="form-group">
            <label>Discipline</label>
            <select v-model.number="transactionForm.disciplineId" class="form-select">
              <option :value="null">-- Aucune --</option>
              <option v-for="d in disciplines" :key="d.disciplineId" :value="d.disciplineId">
                {{ d.nom }}
              </option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn cancel-btn" @click="localShow = false">Annuler</button>
            <button type="submit" class="btn submit-btn" :disabled="isLoading">
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isEditing ? 'Sauvegarder les modifications' : 'Ajouter la transaction' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Votre style existant pour la modale */
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

.alert {
  border-radius: 0.5rem;
  font-weight: 500;
  animation: ping 0.4s ease;
}

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
