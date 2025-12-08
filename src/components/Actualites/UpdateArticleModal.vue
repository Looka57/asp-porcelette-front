<script setup>
import { ref, watch } from 'vue';
import api from '@/api/axios';

// ════════════════════════════════════════════════════════════════════════════════
// 🌐 CONSTANTES D'API ET ÉTATS LOCAUX
// ════════════════════════════════════════════════════════════════════════════════
const API_PATH_EVENEMENT = '/Evenement';
const API_PATH_ACTUALITE = '/Actualite';
const localEvenementMap = ref({});
const fetchError = ref('');

// ════════════════════════════════════════════════════════════════════════════════
// ⚙️ DÉCLARATION DES PROPS ET ÉMISSIONS D'ÉVÉNEMENTS
// ════════════════════════════════════════════════════════════════════════════════
const props = defineProps({
  modelValue: Boolean, // Contrôle l'ouverture/fermeture de la modale
  articleId: { type: Number, default: null }, // ID de l'article à modifier
  EvenementMap: { type: Object, default: () => ({}) } // Map des événements, si disponible
});

const emit = defineEmits(['update:modelValue', 'articleUpdated']);

function closeModal() {
  emit('update:modelValue', false);
}

// ════════════════════════════════════════════════════════════════════════════════
// 📝 ÉTAT DU FORMULAIRE DE MODIFICATION
// ════════════════════════════════════════════════════════════════════════════════
const articleToUpdate = ref({
  titre: '',
  contenu: '',
  datePublication: '',
  evenementId: null,
  // Propriétés utilisées pour l'édition de l'image
  imageUrl: null, // URL de l'image existante
  deleteExistingImage: false,
});

const imageFile = ref(null); // Le nouveau fichier image téléchargé
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

// ════════════════════════════════════════════════════════════════════════════════
// 🧠 UTILITAIRES ET FONCTIONS D'API
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Récupère la map des types d'événements (si non fournie par props)
 */
async function fetchEvenements() {
  if (Object.keys(props.EvenementMap).length > 0) return;

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
 * Récupère les données de l'article existant pour pré-remplir le formulaire
 */
async function fetchArticleData(id) {
  if (!id) return;

  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  imageFile.value = null; // Réinitialiser le fichier

  try {
    const response = await api.get(`${API_PATH_ACTUALITE}/${id}`);
    const data = response.data;

    // Remplir le modèle avec les données existantes
    articleToUpdate.value.titre = data.titre || '';
    articleToUpdate.value.contenu = data.contenu || '';
    // Formatage de la date pour le champ <input type="date"> (ex: 2025-10-24)
    articleToUpdate.value.datePublication = data.dateDePublication ? data.dateDePublication.split('T')[0] : '';
    articleToUpdate.value.evenementId = data.evenementId;
    articleToUpdate.value.imageUrl = data.imageUrl; // Conserver l'URL actuelle
    articleToUpdate.value.deleteExistingImage = false; // Réinitialiser l'option de suppression

  } catch (error) {
    console.error('Erreur lors du chargement de l\'article:', error);
    errorMessage.value = 'Impossible de charger les données de l\'article.';
  } finally {
    isLoading.value = false;
  }
}

/**
 * Récupère la map des événements (priorité aux props)
 */
function currentEvenementMap() {
  return Object.keys(props.EvenementMap).length > 0
    ? props.EvenementMap
    : localEvenementMap.value;
}

// Gestion de la sélection de fichier
function handleFileChange(event) {
  const file = event.target.files ? event.target.files[0] : null;
  imageFile.value = file;

  // Si un nouveau fichier est sélectionné, on annule l'intention de supprimer l'ancienne image
  if (file) {
    articleToUpdate.value.deleteExistingImage = false;
  }
}

// Gestion de la suppression d'image (case à cocher)
function toggleDeleteImage() {
  // Si l'utilisateur coche 'supprimer l'image', on réinitialise le champ de fichier
  if (articleToUpdate.value.deleteExistingImage) {
    imageFile.value = null;
  }
}


/**
 * Soumission du formulaire de mise à jour (PUT)
 */
async function handleSubmit() {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  if (!articleToUpdate.value.titre || !articleToUpdate.value.contenu || !articleToUpdate.value.datePublication) {
    errorMessage.value = 'Veuillez remplir tous les champs obligatoires (Titre, Contenu, Date).';
    isLoading.value = false;
    return;
  }

  // Création du FormData pour gérer le fichier
  const formData = new FormData();
  formData.append('Titre', articleToUpdate.value.titre);
  formData.append('Contenu', articleToUpdate.value.contenu);
  formData.append('DatePublication', articleToUpdate.value.datePublication);

  // Gestion de EvenementId (comme dans la création)
  const selectedEventId = articleToUpdate.value.evenementId;
  if (selectedEventId && Number(selectedEventId) > 0) {
    formData.append('EvenementId', String(selectedEventId));
  }

  // 🛑 Gestion spécifique à l'Update : DeleteExistingImage et ImageFile
  formData.append('DeleteExistingImage', articleToUpdate.value.deleteExistingImage ? 'true' : 'false');
  if (imageFile.value) {
    formData.append('ImageFile', imageFile.value);
  }

  // DANS UpdateArticleModal.vue, méthode handleSubmit()

  // ... (code de construction du FormData) ...

  // 3. Envoi à l'API via PUT
  try {
    // 🛑 CORRECTION SYNTAXIQUE ICI
    await api.put(`${API_PATH_ACTUALITE}/${props.articleId}`, formData, {
      headers: {
        'Content-Type': undefined // Permet au navigateur/Axios de gérer le multipart/form-data
      }
    });

    // 🛑 DÉPLACER LES ACTIONS DE SUCCÈS ICI, APRÈS L'AWAIT 🛑
    successMessage.value = 'Article d\'actualité mis à jour avec succès !';
    emit('articleUpdated'); // Émettre un événement pour rafraîchir la liste parente

    // Fermer la modale après un court délai
    setTimeout(() => {
      closeModal();
    }, 1500);

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error);
    errorMessage.value = error.response?.data?.message || 'Erreur lors de la mise à jour. Veuillez vérifier les données.';
  } finally {
    isLoading.value = false;
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// 🕓 WATCHERS ET MONTAGE
// ════════════════════════════════════════════════════════════════════════════════

// Regarder quand la modale s'ouvre ET qu'un ID est disponible
watch(() => [props.modelValue, props.articleId], ([isOpen, id]) => {
  if (isOpen && id) {
    fetchArticleData(id);
    fetchEvenements();
  }
  // Réinitialiser les messages d'erreur/succès quand la modale s'ouvre
  if (isOpen) {
    errorMessage.value = '';
    successMessage.value = '';
  }
}, { immediate: true });
</script>

<template>
  <transition name="fade">
    <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">

      <transition name="slide-up">
        <div class="modal-dialogue bg-dark text-white" v-if="modelValue">

          <div class="modal-content">
            <div class="modal-header bg-dark text-white">
              <h1 class="modal-title fs-5" id="updateArticleModalLabel">
                Modifier l'Article #{{ articleId }}
              </h1>
              <button type="button" class="btn-close btn-close-white" @click="closeModal" aria-label="Close"></button>
            </div>

            <div class="modal-body bg-dark text-light p-3 mb-3">
              <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
              <div v-if="fetchError" class="alert alert-warning">{{ fetchError }}</div>
              <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>
              <div v-if="isLoading && !articleToUpdate.titre" class="text-center p-5">
                <div class="spinner-border text-light" role="status"></div>
                <p>Chargement de l'article...</p>
              </div>

              <form @submit.prevent="handleSubmit" v-else>
                <div class="mb-3">
                  <label for="title" class="form-label">Titre</label>
                  <input type="text" class="form-control bg-secondary text-light border-0" id="title"
                    v-model="articleToUpdate.titre">
                </div>

                <div class="mb-3">
                  <label for="contenu" class="form-label">Contenu</label>
                  <textarea class="form-control bg-secondary border-0 text-light" id="contenu" rows="3"
                    v-model="articleToUpdate.contenu"></textarea>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="datePublication" class="form-label">Date de publication</label>
                    <input type="date" class="form-control bg-secondary text-white border-0" id="datePublication"
                      v-model="articleToUpdate.datePublication">
                  </div>
                </div>

                <div class="mb-3 p-3 border rounded border-secondary">
                  <label class="form-label mb-2">Image Actuelle</label>

                  <div v-if="articleToUpdate.imageUrl" class="mb-3 d-flex align-items-center">
                    <img :src="articleToUpdate.imageUrl" alt="Image actuelle" class="img-thumbnail"
                      style="max-height: 80px; max-width: 80px; object-fit: cover; margin-right: 15px;">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="deleteImageCheck"
                        v-model="articleToUpdate.deleteExistingImage" @change="toggleDeleteImage">
                      <label class="form-check-label" for="deleteImageCheck">
                        Supprimer l'image actuelle
                      </label>
                    </div>
                  </div>
                  <div v-else class="alert alert-info py-1">Aucune image actuellement.</div>


                  <label for="newImage" class="form-label mt-3">Remplacer l'image</label>
                  <input type="file" class="form-control" id="newImage" @change="handleFileChange"
                    :disabled="articleToUpdate.deleteExistingImage">
                  <small class="form-text text-muted">Sélectionner un nouveau fichier remplacera l'image
                    existante.</small>
                </div>
                <div class="col-md-12 mb-3">
                  <label for="Evenement" class="form-label">Événement Associé (optionnel)</label>
                  <select class="form-select bg-secondary border-0 text-white border-secondary" id="Evenement"
                    v-model="articleToUpdate.evenementId" :disabled="Object.keys(currentEvenementMap()).length === 0">

                    <option :value="null">Sélectionner un Evenement lié (optionnel)</option>
                    <option :value="0">Sélectionner un Evenement lié (optionnel)</option>

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
                  <button type="submit" class="btn btn-warning" :disabled="isLoading">
                    Mettre à jour
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
