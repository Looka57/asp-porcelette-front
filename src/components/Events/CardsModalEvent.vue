<script setup>
import { watch, defineProps, defineEmits } from 'vue';

function formatDate(dateString) {
  if (!dateString) return 'Date inconnue';
  try {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  } catch {
    return dateString;
  }
}

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  event: { type: Object, default: null },
});

const emit = defineEmits(['update:modelValue']);

function closeModal() {
  emit('update:modelValue', false);
}

// 🔸 Watch pour gérer le scroll du body
watch(
  () => props.modelValue,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
);
</script>

<template>
  <!-- Transition pour l’apparition/disparition -->
  <transition name="fade">
    <div v-if="modelValue && event" class="modal-overlay" @click.self="closeModal">
      <transition name="slide-up">
        <div class="modal-dialogue bg-dark text-white " v-if="modelValue">
          <div class="modal-content">
            <!-- HEADER -->
            <div class="modal-header bg-dark text-white ">
              <h5 class="modal-title mb-5">{{ event.titre }}</h5>
              <hr class="my-3" />
              <button type="button" class="btn-close btn-close-white" @click="closeModal" aria-label="Fermer"></button>
            </div>

            <!-- BODY -->
            <div class="modal-body bg-light text-dark p-3 mb-3">
              <p class="lead"><strong>Date :</strong> {{ formatDate(event.dateDebut) }}</p>
              <p><strong>Discipline :</strong> {{ event.nom || 'Non spécifiée' }}</p>
              <p><strong>Lieu :</strong> {{ event.lieu || 'Complexe Porcelette' }}</p>
              <hr class="my-3" />
              <h6>Description détaillée :</h6>
              <p>{{ event.description || 'Aucune description disponible.' }}</p>
            </div>

            <!-- FOOTER -->
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Fermer</button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
/* Overlay sombre (backdrop) */
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

/* Conteneur de la modale */
.modal-dialogue {
  padding: 20px;
  width: 90%;
  max-width: 800px;
  max-height: 85vh;
  border-radius: 0.5rem;
  overflow-y: auto;
  box-shadow: 0 0 25px rgba(240, 231, 231, 0.4);
}

/* --- TRANSITIONS --- */
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
  transition: transform 0.35s ease, opacity 0.35s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(30px);
  opacity: 0;
}
</style>
