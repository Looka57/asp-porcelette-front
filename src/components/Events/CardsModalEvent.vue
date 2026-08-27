<script setup>
import { watch, computed } from 'vue';

// ===============================
// 🔹 PROPS & ÉMISSIONS
// ===============================
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  event: { type: Object, default: null },
  disciplineMap: { type: Object, default: () => ({}) },
  typeEventMap: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['update:modelValue']);

// ===============================
// 🔹 COULEURS DES DISCIPLINES
// ===============================
const disciplineColors = {
  'Judo': '#FF6384',
  'Aïkido': '#3B82F6',
  'Jujitsu': '#10B981',
  'Judo Détente': '#efd844',
};

// Récupère dynamiquement la couleur selon le nom ou l'ID de la discipline
const disciplineColor = computed(() => {
  const name = disciplineName.value;
  return disciplineColors[name] || '#ffc107';
});

// ===============================
// 🔹 COMPUTED PROPERTIES
// ===============================

// Récupère le nom de la discipline
const disciplineName = computed(() => {
  if (!props.event) return 'Non spécifiée';
  if (props.event.discipline?.nom) return props.event.discipline.nom;
  const disciplineId = Number(props.event.disciplineId);
  return props.disciplineMap[disciplineId] || 'Non spécifiée';
});

// Récupère le nom du type d'événement
const eventTypeName = computed(() => {
  if (!props.event) return 'Non spécifié';
  if (props.event.typeEvenement?.libelle) return props.event.typeEvenement.libelle;
  const typeId = Number(props.event.typeEvenementId);
  return props.typeEventMap[typeId] || 'Non spécifié';
});

// ===============================
// 🔹 FONCTIONS UTILITAIRES
// ===============================
function formatDate(dateString) {
  if (!dateString) return 'Date inconnue';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  } catch {
    return dateString;
  }
}

function closeModal() {
  emit('update:modelValue', false);
}

// ===============================
// 🔹 WATCHERS
// ===============================
watch(
  () => props.modelValue,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
);
</script>

<template>
  <transition name="fade">
    <div v-if="modelValue && event" class="modal-overlay" @click.self="closeModal">
      <transition name="slide-up">
        <div class="modal-dialogue text-white position-relative overflow-hidden" v-if="modelValue">

          <!-- Liseré supérieur coloré dynamique -->
          <div class="card-top-glow" :style="{ backgroundColor: disciplineColor }"></div>

          <div class="modal-content border-0 bg-transparent">

            <!-- ===============================
              🔸 HEADER DE LA MODALE
            ================================ -->
            <div class="modal-header border-bottom border-secondary border-opacity-25 pb-3">
              <div>
                <span class="badge text-uppercase px-3 py-1 rounded-pill fw-bold mb-2 shadow-sm"
                      :style="{ backgroundColor: disciplineColor, color: '#1a1d24' }">
                  {{ disciplineName }}
                </span>
                <h4 class="modal-title fw-bold text-white m-0">{{ event.titre }}</h4>
              </div>
              <button type="button" class="btn-close btn-close-white shadow-none" @click="closeModal" aria-label="Fermer"></button>
            </div>

            <!-- ===============================
              🔸 CORPS DE LA MODALE
            ================================ -->
            <div class="modal-body py-4">

              <!-- Grille d'infos -->
              <div class="row g-3 mb-4">
                <div class="col-sm-6">
                  <div class="info-box p-3 rounded-3 h-100">
                    <span class="text-light small d-block mb-1">Date de début</span>
                    <span class="fw-semibold text-light">
                      <i class="bi bi-calendar-event me-2 text-warning"></i>{{ formatDate(event.dateDebut) }}
                    </span>
                  </div>
                </div>

                <div class="col-sm-6" v-if="event.dateFin">
                  <div class="info-box p-3 rounded-3 h-100">
                    <span class="text-light small d-block mb-1">Date de fin</span>
                    <span class="fw-semibold text-light">
                      <i class="bi bi-calendar-check me-2 text-warning"></i>{{ formatDate(event.dateFin) }}
                    </span>
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="info-box p-3 rounded-3 h-100">
                    <span class="text-light small d-block mb-1">Lieu</span>
                    <span class="fw-semibold text-light">
                      <i class="bi bi-geo-alt-fill me-2 text-warning"></i>{{ event.lieu || 'Complexe Porcelette' }}
                    </span>
                  </div>
                </div>

                <div class="col-sm-6">
                  <div class="info-box p-3 rounded-3 h-100">
                    <span class="text-light small d-block mb-1">Type d'événement</span>
                    <span class="fw-semibold text-light">
                      <i class="bi bi-tag-fill me-2 text-warning"></i>{{ eventTypeName }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div class="description-section">
                <h6 class="text-uppercase text-light fs-7 fw-bold mb-2 tracking-wide">Description détaillée</h6>
                <div class="description-box p-3 rounded-3 text-light">
                  <p class="m-0" style="white-space: pre-line; line-height: 1.6;">
                    {{ event.description || 'Aucune description disponible.' }}
                  </p>
                </div>
              </div>

            </div>

            <!-- ===============================
              🔸 PIED DE PAGE (FOOTER)
            ================================ -->
            <div class="modal-footer border-top border-secondary border-opacity-25 pt-3">
              <button type="button" class="btn btn-secondary px-4 rounded-pill" @click="closeModal">Fermer</button>
            </div>

          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
/* ===============================
🔸 Overlay sombre
=============================== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1055;
  padding: 1rem;
}

/* ===============================
🔸 Conteneur de la modale
=============================== */
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

/* ===============================
🔸 Boîtes d'informations internes
=============================== */
.info-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.description-box {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* ===============================
🔸 Utilitaires & Animations
=============================== */
.tracking-wide {
  letter-spacing: 0.05em;
}

.fs-7 {
  font-size: 0.8rem;
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
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
