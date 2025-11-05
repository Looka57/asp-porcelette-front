<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { watch, computed } from 'vue';

// ===============================
// 🔹 FONCTIONS UTILITAIRES
// ===============================

// Formater une date au format français
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

// ===============================
// 🔹 PROPS & ÉMISSIONS
// ===============================
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  event: { type: Object, default: null },
  // 🎯 CORRECTION 1: Ajouter la prop disciplineMap
  disciplineMap: { type: Object, default: () => ({}) },
  typeEventMap: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['update:modelValue']);

// ===============================
// 🔹 COMPUTED PROPERTIES
// ===============================

// Récupère le nom du type d'événement selon son ID
const eventTypeName = computed(() => {
  if (!props.event) return 'Non spécifié';

  // Tente de lire directement l'objet lié si l'API l'a renvoyé
  if (props.event.typeEvenement?.libelle) {
    return props.event.typeEvenement.libelle;
  }

  // Sinon, utilise la map
  const typeId = Number(props.event.typeEvenementId);
  return props.typeEventMap[typeId] || 'Non spécifié';
});

// 🎯 NOUVEAU: Propriété calculée pour la discipline
const disciplineName = computed(() => {
  if (!props.event) return 'Non spécifiée';

  // Tente de lire directement l'objet lié si l'API l'a renvoyé (grâce à la correction C#)
  if (props.event.discipline?.nom) {
    return props.event.discipline.nom;
  }

  // Sinon, utilise la map pour traduire l'ID
  const disciplineId = Number(props.event.disciplineId);
  return props.disciplineMap[disciplineId] || 'Non spécifiée';
});


// ===============================
// 🔹 FONCTIONS MÉTHODES
// ===============================

// Ferme la modale
function closeModal() {
  emit('update:modelValue', false);
}

// ===============================
// 🔹 WATCHERS
// ===============================

// Empêche le scroll de la page quand la modale est ouverte
watch(
  () => props.modelValue,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
);
</script>

<!-- ===============================
  🔹 TEMPLATE (HTML)
  =============================== -->
<template>
  <transition name="fade">
    <div v-if="modelValue && event" class="modal-overlay" @click.self="closeModal">
      <transition name="slide-up">
        <div class="modal-dialogue bg-dark text-white" v-if="modelValue">
          <div class="modal-content">

            <!-- ===============================
        🔸 HEADER DE LA MODALE
        =============================== -->
            <div class="modal-header bg-dark text-white">
              <h5 class="modal-title mb-5 fs-2">{{ event.titre }}</h5>
              <hr class="my-3" />
              <button type="button" class="btn-close btn-close-white" @click="closeModal" aria-label="Fermer"></button>
            </div>

            <!-- ===============================
        🔸 CORPS DE LA MODALE
        =============================== -->
            <div class="modal-body bg-light text-dark p-3 mb-3">
              <p class="lead fs-4"><strong>Date de début :</strong> {{ formatDate(event.dateDebut) }}</p>
              <p class="lead fs-4"><strong>Date de fin :</strong> {{ formatDate(event.dateFin) }}</p>
              <!-- 🎯 CORRECTION 2: Utiliser la propriété calculée disciplineName -->
              <p><strong>Discipline :</strong> {{ disciplineName }}</p>
              <p><strong>Lieu :</strong> {{ event.lieu || 'Complexe Porcelette' }}</p>
              <p><strong>Événement :</strong> {{ eventTypeName }}</p>
              <hr class="my-3" />
              <h6>Description détaillée :</h6>
              <p>{{ event.description || 'Aucune description disponible.' }}</p>
            </div>

            <!-- ===============================
        🔸 PIED DE PAGE (FOOTER)
        =============================== -->
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Fermer</button>
            </div>

          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<!-- ===============================
🔹 STYLES CSS
=============================== -->
<style scoped>
/* ===============================
🔸 Overlay sombre (fond de la modale)
 =============================== */
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

/* ===============================
 🔸 Conteneur de la modale
 =============================== */
.modal-dialogue {
  padding: 20px;
  width: 90%;
  max-width: 800px;
  max-height: 85vh;
  border-radius: 0.5rem;
  overflow-y: auto;
  box-shadow: 0 0 25px rgba(240, 231, 231, 0.4);
}

/* ===============================
 🔸 Animations de transition
 =============================== */
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
