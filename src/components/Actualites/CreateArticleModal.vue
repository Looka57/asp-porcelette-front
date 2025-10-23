<script setup>
import { ref, onMounted } from 'vue'; // Importez onMounted
import api from '@/api/axios';

// ════════════════════════════════════════════════════════════════════════════════
// 🌐 CONSTANTES D'API ET ÉTATS LOCAUX
// ════════════════════════════════════════════════════════════════════════════════
const API_PATH_EVENEMENT = '/Evenement';
const API_PATH_ACTUALITE = '/Actualite'
const localEvenementMap = ref({});
const fetchError = ref('');
const rawUserId = localStorage.getItem('userId');
// S'assurer que la valeur est un nombre (ou null si non trouvée)
const connectedUserId = rawUserId ? rawUserId : null; // pas de Number()

// ════════════════════════════════════════════════════════════════════════════════
// ⚙️ DÉCLARATION DES PROPS ET ÉMISSIONS D'ÉVÉNEMENTS
// ════════════════════════════════════════════════════════════════════════════════
const props = defineProps({
  modelValue: Boolean,
  EvenementMap: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:modelValue']);

function closeModal() {
  emit('update:modelValue', false);
}

// ════════════════════════════════════════════════════════════════════════════════
// 📝 ÉTAT DU FORMULAIRE D’AJOUT ARTICLE ACTUALITE
// ════════════════════════════════════════════════════════════════════════════════
const newActuality = ref({
  titre: '',
  contenu: '',
  datePublication: '',
  imageUrl: '',
  evenementId: null,
  userId: connectedUserId,
});

const imageFile = ref(null);
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

// ════════════════════════════════════════════════════════════════════════════════
// 🧠 UTILITAIRES ET FONCTIONS DE SUPPORT
// ════════════════════════════════════════════════════════════════════════════════
/**
 * Renvoie la map des types d'événements, soit depuis les props, soit localement.
 */
function currentEvenementMap() {
  return Object.keys(props.EvenementMap).length > 0
    ? props.EvenementMap
    : localEvenementMap.value;
}

/**
 * Récupère la liste des types d'événements depuis l'API
 */
async function fetchEvenements() {
  if (Object.keys(currentEvenementMap()).length > 0) return; // Ne pas re-fetch si déjà disponible

  try {
    const response = await api.get(API_PATH_EVENEMENT);
    const map = {};
    response.data.forEach(item => {
      if (item.evenementId && item.titre) {
        map[item.evenementId] = item.titre;
      }
    });
    localEvenementMap.value = map;
    fetchError.value = '';
  } catch (error) {
    console.error('Erreur lors de la récupération des types d\'événements:', error);
    fetchError.value = 'Impossible de charger la liste des types d\'événements.';
  }
}

/**
 * Réinitialise le formulaire
 */
function resetForm() {
  newActuality.value = {
    titre: '',
    contenu: '',
    datePublication: '',
    evenementId: null,
    userId: connectedUserId, // Réutiliser l'ID connecté
  };
  imageFile.value = null; // Réinitialiser le fichier
  errorMessage.value = '';
  successMessage.value = '';
}


// gestion image
function handleFileChange(event) {
  // Stocke le premier fichier sélectionné
  const file = event.target.files ? event.target.files[0] : null;
  imageFile.value = file;
  // Mise à jour de newActuality.imageUrl (peut être géré différemment selon votre API)
  newActuality.value.imageUrl = file ? file.name : '';
}

async function handleSubmit() {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  // 1. Validation de base
  if (!newActuality.value.titre || !newActuality.value.contenu || !newActuality.value.datePublication) {
    errorMessage.value = 'Veuillez remplir tous les champs obligatoires (Titre, Contenu, Date).';
    isLoading.value = false;
    return;
  }

  // 2. Préparation des données (FormData pour inclure le fichier)
  const formData = new FormData();
  formData.append('Titre', newActuality.value.titre);
  formData.append('Contenu', newActuality.value.contenu);
  formData.append('DatePublication', newActuality.value.datePublication);
  formData.append('UserId', newActuality.value.userId || "010c1ffc-2ebc-49ed-90a6-de46057b6d89");

  if (newActuality.value.evenementId) {
    formData.append('EvenementId', newActuality.value.evenementId);
  }

  // 🎯 Ajout du fichier image s'il existe
  if (imageFile.value) {
    // Le nom de la clé 'ImageFile' DOIT correspondre à ce qu'attend votre API backend
    formData.append('ImageFile', imageFile.value);
  }

  // 3. Envoi à l'API
  try {
   await api.post(API_PATH_ACTUALITE, formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});


    successMessage.value = 'Article d\'actualité créé avec succès !';
    resetForm(); // Réinitialise le formulaire après succès
    // Si vous voulez fermer la modale après un court délai :
    setTimeout(() => {
      closeModal();
    }, 1500);

  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
    console.error('INFO:', error.response?.data);

    errorMessage.value = error.response?.data?.message || 'Erreur lors de la création. Veuillez vérifier les données.';
  } finally {
    isLoading.value = false;
  }
}










// ════════════════════════════════════════════════════════════════════════════════
// 🕓 MONTAGE DU COMPOSANT
// ════════════════════════════════════════════════════════════════════════════════
onMounted(() => {
  fetchEvenements();
});
</script>


<template>
  <transition name="fade">
    <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">

      <transition name="slide-up">
        <div class="modal-dialogue bg-dark text-white" v-if="modelValue">

          <div class="modal-content">
            <div class="modal-header bg-dark text-white">

              <h1 class="modal-title fs-5" id="createArticleModalLabel">Ajouter un Article d'Actualité</h1>
              <button type="button" class="btn-close btn-close-white" @click="closeModal" aria-label="Close"></button>
            </div>

            <div class="modal-body bg-dark text-light p-3 mb-3">
              <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
              <div v-if="fetchError" class="alert alert-warning">{{ fetchError }}</div>
              <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label for="title" class="form-label">Titre</label>
                  <input type="text" class="form-control bg-secondary text-light border-0" id="title"
                    v-model="newActuality.titre">
                </div>

                <div class="mb-3">
                  <label for="contenu" class="form-label">Contenu</label>
                  <textarea class="form-control bg-secondary border-0 text-light" id="contenu" rows="3"
                    v-model="newActuality.contenu"></textarea>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="datePublication" class="form-label">Date de publication</label>
                    <input type="date" class="form-control bg-secondary text-white border-0" id="datePublication"
                      v-model="newActuality.datePublication">
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="image" class="form-label ">Image</label>
                    <input type="file" class="form-control" id="image" @change="handleFileChange">
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="Evenement" class="form-label">Événement Associé (optionnel)</label>
                  <select class="form-select bg-secondary border-0 text-white border-secondary" id="Evenement"
                    v-model="newActuality.evenementId" :disabled="Object.keys(currentEvenementMap()).length === 0">

                    <option :value="null">Sélectionner un Event</option>

                    <option v-for="(name, id) in currentEvenementMap()" :key="id" :value="Number(id)">
                      {{ name }}
                    </option>

                    <option v-if="Object.keys(currentEvenementMap()).length === 0" disabled>Chargement ou
                      indisponible
                    </option>
                  </select>
                </div>

                <div class="modal-footer bg-dark gap-3">
                  <button type="button" class="btn btn-secondary" @click="closeModal">Fermer</button>
                  <button type="submit" class="btn btn-success" :disabled="isLoading">
                    Créer
                    <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"
                      aria-hidden="true"></span>
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

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
