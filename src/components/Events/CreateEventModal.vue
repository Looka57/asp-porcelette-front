<script setup>
// ════════════════════════════════════════════════════════════════════════════════
// 🧩 IMPORTS ET DÉCLARATIONS INITIALES
// ════════════════════════════════════════════════════════════════════════════════
import { ref, watch, onMounted } from 'vue';
import api from '@/api/axios';

// ════════════════════════════════════════════════════════════════════════════════
// ⚙️ DÉCLARATION DES PROPS ET ÉMISSIONS D'ÉVÉNEMENTS
// ════════════════════════════════════════════════════════════════════════════════
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  disciplineMap: { type: Object, default: () => ({}) },
  typeEvenementMap: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:modelValue', 'event-added']);


// ════════════════════════════════════════════════════════════════════════════════
// 🌐 CONSTANTES D'API ET ÉTATS LOCAUX
// ════════════════════════════════════════════════════════════════════════════════
const API_PATH_EVENT = '/Evenement';
const API_PATH_TYPE_EVENEMENT = '/TypeEvenement';

// Carte locale pour les types d'événements (si non fournie par le parent)
const localTypeEvenementMap = ref({});
const fetchError = ref('');


// ════════════════════════════════════════════════════════════════════════════════
// 📝 ÉTAT DU FORMULAIRE D’AJOUT D’ÉVÉNEMENT
// ════════════════════════════════════════════════════════════════════════════════
const newEvent = ref({
  titre: '',
  description: '',
  lieu: '',
  dateDebut: '',
  dateFin: '',
  disciplineId: null,
  typeEvenementId: null,
});

const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);


// ════════════════════════════════════════════════════════════════════════════════
// 🎛️ GESTION DE LA MODALE BOOTSTRAP
// ════════════════════════════════════════════════════════════════════════════════
let modalInstance = null;
const modalRef = ref(null);
const modalTitle = 'Ajouter un nouvel événement';


// ════════════════════════════════════════════════════════════════════════════════
// 🧠 UTILITAIRES ET FONCTIONS DE SUPPORT
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Retourne la map des types d'événements (prop > locale)
 */
const currentTypeEvenementMap = () => {
  if (Object.keys(props.typeEvenementMap).length > 0) {
    return props.typeEvenementMap;
  }
  return localTypeEvenementMap.value;
};

/**
 * Récupère la liste des types d'événements depuis l'API
 */
async function fetchTypeEvenements() {
  if (Object.keys(props.typeEvenementMap).length > 0) return;

  try {
    const response = await api.get(API_PATH_TYPE_EVENEMENT);
    const map = {};
    response.data.forEach(item => {
      if (item.typeEvenementId && item.libelle) {
        map[item.typeEvenementId] = item.libelle;
      }
    });
    localTypeEvenementMap.value = map;
    fetchError.value = '';
  } catch (error) {
    console.error('Erreur lors de la récupération des types d\'événements:', error);
    fetchError.value = 'Impossible de charger la liste des types d\'événements.';
  }
}

/**
 * Formate une date (AAAA-MM-JJ) en ISO 8601 (T00:00:00)
 */
function formatToIsoDateTime(dateString) {
  if (!dateString) return null;
  return `${dateString}T00:00:00`;
}

/**
 * Réinitialise le formulaire
 */
function resetForm() {
  newEvent.value = {
    titre: '',
    description: '',
    lieu: '',
    dateDebut: '',
    dateFin: '',
    disciplineId: null,
    typeEvenementId: null,
  };
  errorMessage.value = '';
  successMessage.value = '';
}


// ════════════════════════════════════════════════════════════════════════════════
// 🕓 MONTAGE DU COMPOSANT
// ════════════════════════════════════════════════════════════════════════════════
onMounted(() => {
  fetchTypeEvenements();
});


// ════════════════════════════════════════════════════════════════════════════════
// 👀 WATCHERS : GESTION DES CHANGEMENTS DE RÉFÉRENCES
// ════════════════════════════════════════════════════════════════════════════════

// Watch sur la référence modale pour initialiser Bootstrap
watch(modalRef, (newRef) => {
  if (newRef && window.bootstrap && window.bootstrap.Modal) {
    const ModalClass = window.bootstrap.Modal;
    modalInstance = new ModalClass(newRef);

    newRef.addEventListener('hidden.bs.modal', () => {
      emit('update:modelValue', false);
      resetForm();
    });

    newRef.addEventListener('shown.bs.modal', () => {
      emit('update:modelValue', true);
      if (Object.keys(props.typeEvenementMap).length === 0) fetchTypeEvenements();
    });
  }
}, { immediate: true });

// Watch sur modelValue pour gérer ouverture/fermeture
watch(() => props.modelValue, (isOpen) => {
  if (modalInstance) {
    if (isOpen) {
      resetForm();
      modalInstance.show();
    } else {
      modalInstance.hide();
    }
  }
});


// ════════════════════════════════════════════════════════════════════════════════
// 🧾 GESTION DU FORMULAIRE D’AJOUT D’ÉVÉNEMENT
// ════════════════════════════════════════════════════════════════════════════════
async function handleSubmit() {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  // --- Validation simple des dates ---
  const debut = new Date(newEvent.value.dateDebut);
  const fin = new Date(newEvent.value.dateFin);
  if (newEvent.value.dateFin && fin.getTime() < debut.getTime()) {
    errorMessage.value = "La date de fin ne peut pas être antérieure à la date de début.";
    isLoading.value = false;
    return;
  }

  // --- Préparation du payload ---
  const payload = {
    titre: newEvent.value.titre,
    description: newEvent.value.description,
    lieu: newEvent.value.lieu,
    dateDebut: formatToIsoDateTime(newEvent.value.dateDebut),
    dateFin: newEvent.value.dateFin ? `${newEvent.value.dateFin}T23:59:59` : null,
    disciplineId: newEvent.value.disciplineId ? Number(newEvent.value.disciplineId) : null,
    typeEvenementId: Number(newEvent.value.typeEvenementId),
    imageUrl: null,
  };

  // --- Validation des champs requis ---
  if (!payload.titre || !payload.dateDebut || !payload.disciplineId || !payload.typeEvenementId) {
    errorMessage.value = "Veuillez remplir au moins le titre, la date de début, la discipline ET le type d'événement.";
    isLoading.value = false;
    return;
  }

  // --- Appel API ---
  try {
    const response = await api.post(API_PATH_EVENT, payload);
    const addedEvent = response.data;
    emit('event-added', addedEvent);
    successMessage.value = "Événement ajouté avec succès !";
    closeAndReset();
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'événement:', error);
    let message = `Erreur lors de l'ajout: ${error.message || 'Problème de connexion API.'}`;

    if (error.response) {
      const data = error.response.data;
      if (typeof data === 'string' && data.length < 200) {
        message = `Erreur de validation: ${data}`;
      } else if (data && data.errors) {
        const errorKeys = Object.keys(data.errors);
        if (errorKeys.length > 0) {
          message = `Erreur de validation: ${data.errors[errorKeys[0]][0]}`;
        }
      } else if (data && data.message) {
        message = `Erreur de validation: ${data.message}`;
      } else if (error.response.status === 400) {
        message = `Erreur de validation: La requête envoyée est mal formée (Code 400). Vérifiez les champs obligatoires.`;
      }
    }
    errorMessage.value = message;
  } finally {
    isLoading.value = false;
  }
}


// ════════════════════════════════════════════════════════════════════════════════
// 🚪 FERMETURE ET RÉINITIALISATION DE LA MODALE
// ════════════════════════════════════════════════════════════════════════════════
function closeAndReset() {
  if (modalInstance) {
    modalInstance.hide();
  } else {
    emit('update:modelValue', false);
  }
}

</script>


<!-- ══════════════════════════════════════════════════════════════════════════════ -->
<!-- 🎨 TEMPLATE : MODALE D’AJOUT D’ÉVÉNEMENT -->
<!-- ══════════════════════════════════════════════════════════════════════════════ -->
<template>
  <div class="modal fade" id="createEvent" ref="modalRef" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content bg-dark text-white">

        <!-- ════════════ 🧱 En-tête de la modale ════════════ -->
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">{{ modalTitle }}</h5>
          <button type="button" class="btn-close btn-close-white" @click="closeAndReset" aria-label="Close"></button>
        </div>

        <!-- ════════════ 📋 Corps de la modale ════════════ -->
        <div class="modal-body">
          <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
          <div v-if="fetchError" class="alert alert-warning">{{ fetchError }}</div>
          <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

          <!-- ════════════ 🧾 Formulaire d'ajout ════════════ -->
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="titre" class="form-label">Titre</label>
              <input type="text" class="form-control bg-secondary text-white border-secondary" id="titre" v-model="newEvent.titre" required>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="typeEvenement" class="form-label">Type d'événement</label>
                <select class="form-select bg-secondary text-white border-secondary" id="typeEvenement"
                  v-model="newEvent.typeEvenementId" required
                  :disabled="Object.keys(currentTypeEvenementMap()).length === 0">
                  <option :value="null" disabled>Sélectionner un type</option>
                  <option v-for="(name, id) in currentTypeEvenementMap()" :key="id" :value="Number(id)">
                    {{ name }}
                  </option>
                  <option v-if="Object.keys(currentTypeEvenementMap()).length === 0" disabled>Chargement ou indisponible</option>
                </select>
              </div>

              <div class="col-md-6 mb-3">
                <label for="discipline" class="form-label">Discipline</label>
                <select class="form-select bg-secondary text-white border-secondary" id="discipline" v-model="newEvent.disciplineId" required>
                  <option :value="null" disabled>Sélectionner une discipline</option>
                  <option v-for="(name, id) in disciplineMap" :key="id" :value="Number(id)">{{ name }}</option>
                </select>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="dateDebut" class="form-label">Date de début</label>
                <input type="date" class="form-control bg-secondary text-white border-secondary" id="dateDebut" v-model="newEvent.dateDebut" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="dateFin" class="form-label">Date de fin</label>
                <input type="date" class="form-control bg-secondary text-white border-secondary" id="dateFin" v-model="newEvent.dateFin">
              </div>
            </div>

            <div class="mb-3">
              <label for="lieu" class="form-label">Lieu</label>
             <input type="text" class="form-control bg-secondary text-white border-secondary" id="lieu" v-model="newEvent.lieu">
            </div>
            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea class="form-control bg-secondary text-white border-secondary" id="description" rows="3" v-model="newEvent.description"></textarea>
            </div>

            <div class="d-flex justify-content-end gap-2 mt-4">
              <button type="button" class="btn btn-secondary" @click="closeAndReset">Annuler</button>
              <button type="submit" class="btn btn-success"
                :disabled="isLoading || Object.keys(currentTypeEvenementMap()).length === 0">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ isLoading ? 'Ajout en cours...' : 'Ajouter l\'événement' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<!-- ══════════════════════════════════════════════════════════════════════════════ -->
<!-- 🎨 STYLES SCOPÉS -->
<!-- ══════════════════════════════════════════════════════════════════════════════ -->
<style scoped>
.modal-content {
  border: 1px solid #495057;
}

.btn-close-white {
  filter: invert(1);
}
</style>
