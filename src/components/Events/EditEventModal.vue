<script setup>
/* -------------------------------------------------------------------------- */
/* 🎯 IMPORTS                                                                 */
/* -------------------------------------------------------------------------- */
import { ref, watch, defineProps, defineEmits, computed } from 'vue';
import api from '@/api/axios';

/* -------------------------------------------------------------------------- */
/* 🧩 PROPS & EMITS                                                           */
/* -------------------------------------------------------------------------- */
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  eventData: { type: Object, default: null }, // L'événement à éditer
  disciplineMap: { type: Object, default: () => ({}) },
  typeEventMap: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['update:modelValue', 'event-updated']);

/* -------------------------------------------------------------------------- */
/* 💾 VARIABLES RÉACTIVES                                                     */
/* -------------------------------------------------------------------------- */
const localEvent = ref({});
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

/* -------------------------------------------------------------------------- */
/* 📜 OPTIONS DÉRIVÉES (pour les selects)                                    */
/* -------------------------------------------------------------------------- */

// Discipline → transformation en liste d’objets pour le <select>
const disciplineOptions = ref([]);
watch(
  () => props.disciplineMap,
  (newMap) => {
    disciplineOptions.value = Object.entries(newMap).map(([id, nom]) => ({
      id: Number(id),
      nom: nom,
    }));
  },
  { immediate: true }
);

// Type d’événement → transformation en liste d’objets pour le <select>
const typeEventOptions = computed(() => {
  return Object.entries(props.typeEventMap).map(([id, nom]) => ({
    id: Number(id),
    nom: nom,
  }));
});

/* -------------------------------------------------------------------------- */
/* 🔁 WATCHERS                                                                */
/* -------------------------------------------------------------------------- */

// Met à jour le formulaire local quand un nouvel event est chargé
// Watch sur eventData
watch(
  () => props.eventData,
  (newVal) => {
    if (!newVal) return;

    // Récupère l’ID du type d’événement selon les différents formats possibles
    const typeId =
      newVal.TypeEvenementId ??
      newVal.typeEvenementId ??
      newVal.typeEvenement?.typeEvenementId ??
      typeEventOptions.value.find(t => t.nom === newVal.typeEvenement?.libelle)?.id ??
      typeEventOptions.value.find(t => t.nom === newVal.Libelle)?.id ??
      0;

    localEvent.value = {
      ...newVal,
      dateDebut: newVal.dateDebut
        ? new Date(newVal.dateDebut).toISOString().substring(0, 10)
        : '',
      dateFin: newVal.dateFin
        ? new Date(newVal.dateFin).toISOString().substring(0, 10)
        : '',
      disciplineId: Number(newVal.disciplineId),
      typeEvenementId: Number(typeId),
    };

  },
  { immediate: true }
);


// Gère le scroll de la page quand la modale est ouverte/fermée
watch(
  () => props.modelValue,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
);

/* -------------------------------------------------------------------------- */
/* 🔒 FONCTIONS UTILES                                                        */
/* -------------------------------------------------------------------------- */
function closeModal() {
  emit('update:modelValue', false);
  document.body.style.overflow = '';
}

/* -------------------------------------------------------------------------- */
/* 💾 FONCTION DE SAUVEGARDE (PUT API)                                       */
/* -------------------------------------------------------------------------- */
async function saveEvent() {
  errorMessage.value = '';
  successMessage.value = '';

  // Validation basique
  if (!localEvent.value.titre || !localEvent.value.dateDebut || !localEvent.value.disciplineId) {
    errorMessage.value = 'Veuillez remplir au moins le titre, la date de début et la discipline.';
    return;
  }

  // Validation logique des dates
  const dateDebut = localEvent.value.dateDebut;
  const dateFin = localEvent.value.dateFin;
  if (dateFin && dateDebut && dateFin < dateDebut) {
    errorMessage.value = 'La date de fin ne peut pas être antérieure à la date de début.';
    return;
  }

  isLoading.value = true;

  try {
    const payload = {
      ...localEvent.value,
      disciplineId: Number(localEvent.value.disciplineId),
      // Toujours envoyer un Number pour le type d'événement (0 = aucun)
      typeEvenementId: localEvent.value.typeEvenementId && localEvent.value.typeEvenementId !== 0
        ? Number(localEvent.value.typeEvenementId)
        : null,
      dateDebut: localEvent.value.dateDebut,
      dateFin: localEvent.value.dateFin || null,
    };

    const eventId = payload.evenementId;

    const response = await api.put(`/Evenement/${eventId}`, payload);

    successMessage.value = 'Événement modifié avec succès !';

    emit('event-updated', response.data);

    setTimeout(() => {
      closeModal();
    }, 800);
  } catch (error) {
    console.error('Erreur lors de la modification:', error);
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la modification. Veuillez vérifier vos données.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <transition name="fade">
    <div v-if="modelValue && eventData" class="modal-overlay" @click.self="closeModal">
      <transition name="slide-up">
        <div class="modal-dialogue bg-dark text-white" v-if="modelValue">
          <div class="modal-content">
            <!-- Header -->
            <div class="modal-header bg-primary text-white border-bottom border-secondary p-3">
              <h5 class="modal-title">Modification de l'événement : {{ eventData.titre }}</h5>
              <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
            </div>

            <!-- Body -->
            <div class="modal-body bg-light text-dark p-4">
              <form @submit.prevent="saveEvent">
                <div class="alert alert-danger" v-if="errorMessage">{{ errorMessage }}</div>
                <div class="alert alert-success" v-if="successMessage">{{ successMessage }}</div>

                <!-- Titre -->
                <div class="mb-3">
                  <label for="titre" class="form-label">Titre *</label>
                  <input type="text" id="titre" class="form-control" v-model="localEvent.titre" required>
                </div>

                <!-- Dates -->
                <div class="row mb-3">
                  <div class="col-md-6">
                    <label for="dateDebut" class="form-label">Date de Début *</label>
                    <input type="date" id="dateDebut" class="form-control" v-model="localEvent.dateDebut" required>
                  </div>
                  <div class="col-md-6">
                    <label for="dateFin" class="form-label">Date de Fin (optionnel)</label>
                    <input type="date" id="dateFin" class="form-control" v-model="localEvent.dateFin">
                  </div>
                </div>

                <!-- Discipline -->
                <div class="mb-3">
                  <label for="discipline" class="form-label">Discipline *</label>
                  <select id="discipline" class="form-select" v-model="localEvent.disciplineId" required>
                    <option value="" disabled>Sélectionner une discipline</option>
                    <option v-for="disc in disciplineOptions" :key="disc.id" :value="disc.id">{{ disc.nom }}</option>
                  </select>
                </div>



                <!-- Type d'événement -->
                <select id="typeEvenement" class="form-select" v-model.number="localEvent.typeEvenementId">
                  <option :value="0">Choisir un événement</option>
                  <option v-for="type in typeEventOptions" :key="type.id" :value="type.id">
                    {{ type.nom }}
                  </option>
                </select>

                <!-- lieu -->
                <div class="mb-3">
                  <label for="lieu" class="form-label">Lieu</label>
                  <input id="lieu" class="form-control" v-model="localEvent.lieu">
                </div>


                <!-- Description -->
                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <textarea id="description" class="form-control" rows="4" v-model="localEvent.description"></textarea>
                </div>
              </form>
            </div>

            <!-- Footer -->
            <div class="modal-footer border-top border-secondary p-3 justify-content-between">
              <button type="button" class="btn btn-secondary" @click="closeModal" :disabled="isLoading">Annuler</button>
              <button type="submit" class="btn btn-primary" @click="saveEvent" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications' }}
              </button>
            </div>

          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1055;
}

.modal-dialogue {
  padding: 0;
  width: 95%;
  max-width: 700px;
  max-height: 95vh;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.4);
}

.modal-content {
  background: none;
  border: none;
  border-radius: 0.5rem;
}

.modal-body {
  overflow-y: auto;
  max-height: 80vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.35s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(50px) scale(0.95);
  opacity: 0;
}
</style>
