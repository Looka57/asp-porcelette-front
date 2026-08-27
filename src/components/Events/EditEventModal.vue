<script setup>
/* -------------------------------------------------------------------------- */
/* 🎯 IMPORTS                                                                */
/* -------------------------------------------------------------------------- */
import { ref, watch, computed } from 'vue';
import api from '@/api/axios';

/* -------------------------------------------------------------------------- */
/* 🧩 PROPS & EMITS                                                           */
/* -------------------------------------------------------------------------- */
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  eventData: { type: Object, default: null },
  disciplineMap: { type: Object, default: () => ({}) },
  typeEventMap: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['update:modelValue', 'event-updated', 'refresh']);

/* -------------------------------------------------------------------------- */
/* 💾 VARIABLES RÉACTIVES                                                    */
/* -------------------------------------------------------------------------- */
const localEvent = ref({});
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

/* -------------------------------------------------------------------------- */
/* 🎨 COULEURS DES DISCIPLINES                                               */
/* -------------------------------------------------------------------------- */
const disciplineColors = {
  'Judo': '#FF6384',
  'Aïkido': '#3B82F6',
  'Jujitsu': '#efd844',
  'Judo Détente': '#10B981',
};

// Récupère dynamiquement la couleur selon la discipline sélectionnée dans le formulaire
const currentDisciplineColor = computed(() => {
  const discId = localEvent.value.disciplineId;
  const name = props.disciplineMap[discId];
  return disciplineColors[name] || '#ffc107';
});

/* -------------------------------------------------------------------------- */
/* 📜 OPTIONS DÉRIVÉES (pour les selects)                                   */
/* -------------------------------------------------------------------------- */

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

const typeEventOptions = computed(() => {
  return Object.entries(props.typeEventMap).map(([id, nom]) => ({
    id: Number(id),
    nom: nom,
  }));
});

/* -------------------------------------------------------------------------- */
/* 🔁 WATCHERS                                                                */
/* -------------------------------------------------------------------------- */
watch(
  () => props.eventData,
  (newVal) => {
    if (!newVal) return;
    errorMessage.value = '';
    successMessage.value = '';

    const typeId =
      newVal.TypeEvenementId ??
      newVal.typeEvenementId ??
      newVal.typeEvenement?.typeEvenementId ??
      typeEventOptions.value.find(t => t.nom === newVal.typeEvenement?.libelle)?.id ??
      typeEventOptions.value.find(t => t.nom === newVal.Libelle)?.id ??
      0;

    localEvent.value = {
      ...newVal,
      dateDebut: newVal.dateDebut ? new Date(newVal.dateDebut).toISOString().substring(0, 10) : '',
      dateFin: newVal.dateFin ? new Date(newVal.dateFin).toISOString().substring(0, 10) : '',
      disciplineId: Number(newVal.disciplineId),
      typeEvenementId: Number(typeId),
    };
  },
  { immediate: true }
);

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

  if (!localEvent.value.titre || !localEvent.value.dateDebut || !localEvent.value.disciplineId) {
    errorMessage.value = 'Veuillez remplir au moins le titre, la date de début et la discipline.';
    return;
  }

  const dateDebut = localEvent.value.dateDebut;
  const dateFin = localEvent.value.dateFin;
  if (dateFin && dateDebut && dateFin < dateDebut) {
    errorMessage.value = 'La date de fin ne peut pas être antérieure à la date de début.';
    return;
  }

  isLoading.value = true;

  try {
    const payload = {
      evenementId: Number(localEvent.value.evenementId || localEvent.value.Id),
      titre: localEvent.value.titre,
      description: localEvent.value.description || '',
      dateDebut: localEvent.value.dateDebut,
      dateFin: localEvent.value.dateFin || null,
      lieu: localEvent.value.lieu || '',
      disciplineId: Number(localEvent.value.disciplineId),
      typeEvenementId: localEvent.value.typeEvenementId && localEvent.value.typeEvenementId !== 0
        ? Number(localEvent.value.typeEvenementId)
        : null,
      imageUrl: localEvent.value.imageUrl || localEvent.value.ImageUrl || props.eventData?.imageUrl || props.eventData?.ImageUrl || 'default-event.jpg',    };

    const eventId = payload.evenementId;
    const response = await api.put(`/Evenement/${eventId}`, payload);

    successMessage.value = 'Événement modifié avec succès !';

    emit('event-updated', response.data);
    emit('refresh');

    setTimeout(() => {
      closeModal();
    }, 800);
  } catch (error) {
    console.error('Erreur exacte ImageUrl :', error.response?.data?.errors?.ImageUrl);

    if (error.response?.data?.errors) {
      const messages = Object.entries(error.response.data.errors)
        .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
        .join(' | ');
      errorMessage.value = `Erreur -> ${messages}`;
    } else {
      errorMessage.value = 'Erreur lors de la modification.';
    }
    console.error('Erreur complète de l’API:', error.response?.data);
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
        <div class="modal-dialogue text-white position-relative overflow-hidden" v-if="modelValue">

          <!-- Liseré supérieur coloré dynamique en fonction de la discipline -->
          <div class="card-top-glow" :style="{ backgroundColor: currentDisciplineColor }"></div>

          <div class="modal-content border-0 bg-transparent">

            <!-- Header -->
            <div class="modal-header border-bottom border-secondary border-opacity-25 pb-3">
              <div>
                <span class="badge text-uppercase px-3 py-1 rounded-pill fw-bold mb-2 shadow-sm"
                  :style="{ backgroundColor: currentDisciplineColor, color: '#1a1d24' }">
                  Édition
                </span>
                <h4 class="modal-title fw-bold text-white m-0 text-truncate-2">{{ eventData.titre }}</h4>
              </div>
              <button type="button" class="btn-close btn-close-white shadow-none" @click="closeModal"
                aria-label="Fermer"></button>
            </div>

            <!-- Body -->
            <div class="modal-body py-4">
              <form @submit.prevent="saveEvent">

                <div
                  class="alert alert-danger bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 py-2 mb-3 small rounded-3"
                  v-if="errorMessage">
                  {{ errorMessage }}
                </div>
                <div
                  class="alert alert-success bg-success bg-opacity-10 text-success border border-success border-opacity-25 py-2 mb-3 small rounded-3"
                  v-if="successMessage">
                  {{ successMessage }}
                </div>

                <!-- Titre -->
                <div class="mb-3">
                  <label for="titre" class="form-label text-light small fw-semibold">Titre de l'événement *</label>
                  <input type="text" id="titre" class="form-control custom-input" v-model="localEvent.titre" required>
                </div>

                <!-- Dates -->
                <div class="row mb-3">
                  <div class="col-md-6 mb-3 mb-md-0">
                    <label for="dateDebut" class="form-label text-light small fw-semibold">Date de Début *</label>
                    <input type="date" id="dateDebut" class="form-control custom-input" v-model="localEvent.dateDebut"
                      required>
                  </div>
                  <div class="col-md-6">
                    <label for="dateFin" class="form-label text-light small fw-semibold">Date de Fin (optionnel)</label>
                    <input type="date" id="dateFin" class="form-control custom-input" v-model="localEvent.dateFin">
                  </div>
                </div>

                <!-- Discipline & Type d'événement -->
                <div class="row mb-3">
                  <div class="col-md-6 mb-3 mb-md-0">
                    <label for="discipline" class="form-label text-light small fw-semibold">Discipline *</label>
                    <select id="discipline" class="form-select custom-input" v-model="localEvent.disciplineId" required>
                      <option value="" disabled class="bg-dark">Sélectionner une discipline</option>
                      <option v-for="disc in disciplineOptions" :key="disc.id" :value="disc.id"
                        class="bg-dark text-white">
                        {{ disc.nom }}
                      </option>
                    </select>
                  </div>

                  <div class="col-md-6">
                    <label for="typeEvenement" class="form-label text-light small fw-semibold">Type d'événement</label>
                    <select id="typeEvenement" class="form-select custom-input"
                      v-model.number="localEvent.typeEvenementId">
                      <option :value="0" class="bg-dark">Aucun type spécifique</option>
                      <option v-for="type in typeEventOptions" :key="type.id" :value="type.id"
                        class="bg-dark text-white">
                        {{ type.nom }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Lieu -->
                <div class="mb-3">
                  <label for="lieu" class="form-label text-light small fw-semibold">Lieu</label>
                  <input id="lieu" class="form-control custom-input" v-model="localEvent.lieu"
                    placeholder="Ex: Complexe Porcelette">
                </div>

                <!-- Description -->
                <div class="mb-2">
                  <label for="description" class="form-label text-light small fw-semibold">Description détaillée</label>
                  <textarea id="description" class="form-control custom-input" rows="4"
                    v-model="localEvent.description"></textarea>
                </div>

              </form>
            </div>

            <!-- Footer -->
            <div class="modal-footer border-top border-secondary border-opacity-25 pt-3 d-flex justify-content-between">
              <button type="button" class="btn btn-secondary px-4 rounded-pill btn-sm" @click="closeModal"
                :disabled="isLoading">Annuler</button>
              <button type="button" class="btn btn-warning px-4 rounded-pill fw-semibold btn-sm text-dark"
                @click="saveEvent" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}
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
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1055;
  padding: 1rem;
  box-sizing: border-box;
}

.modal-dialogue {
  background-color: #1a1d24;
  padding: 24px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  border-radius: 1rem;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.card-top-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.modal-body {
  overflow-y: auto;
  max-height: 75vh;
}

/* Champs personnalisés pour le thème sombre */
.custom-input {
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  transition: all 0.2s ease;
}

.custom-input:focus {
  background-color: rgba(255, 255, 255, 0.06);
  border-color: #ffc107;
  color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.15);
}

.custom-input option {
  background-color: #1a1d24;
  color: #fff;
}

/* Animations de transition */
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
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
