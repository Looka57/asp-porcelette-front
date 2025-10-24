<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios';
import CreateArticleModal from './CreateArticleModal.vue';
import UpdateArticleModal from './UpdateArticleModal.vue';

/* -------------------------------------------------------------------------- */
/* 💾 VARIABLES RÉACTIVES */
/* -------------------------------------------------------------------------- */
const actualites = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);

// 🛑 NOUVEAU : Variables pour la modale de MISE À JOUR (internes à ce composant)
const isUpdateModalOpen = ref(false);
const selectedArticleId = ref(null);

/* -------------------------------------------------------------------------- */
/* 🎯 PROPS et EMITS pour la modale de CRÉATION (v-model) */
/* -------------------------------------------------------------------------- */
const props = defineProps({
 // C'est la prop qui contrôle la modale de *CRÉATION* depuis le parent.
 isModalOpen: {
  type: Boolean,
  required: true
 }
});

const emit = defineEmits(['update:isModalOpen', 'articleUpdated']);

// ===============================
// 🔹 CONSTANTES D’API
// ===============================

const PATH_API = '/Actualite';

/* -------------------------------------------------------------------------- */
/* 🔄 FONCTION DE RÉCUPÉRATION DES DONNÉES */
/* -------------------------------------------------------------------------- */
async function fetchActualites() {
 // ... (votre code fetchActualites) ...
    isLoading.value = true;
    errorMessage.value = null;

    try {
        const reponse = await api.get(PATH_API);
        actualites.value = reponse.data;
    } catch (error) {
        console.error('Erreur lors du chargement des actualités:', error);
        errorMessage.value = 'Impossible de charger les actualités. Veuillez réessayer.';
    } finally {
        isLoading.value = false;
    }
}

function formatDate(dateString) {
 // ... (votre code formatDate) ...
    if (!dateString) return 'Date inconnue';
    try {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Intl.DateTimeFormat('fr-FR', options).format(date);
    } catch (error) {
        console.error("Erreur de formatage de date:", error);
        return dateString;
    }
}

// --------------------------------------------------
// Gestion des Modales
// --------------------------------------------------

// 1. Gestion de la modale de CRÉATION (utilise les props/emits du v-model)
function handleCloseCreateModal(newValue) {
  // Émet l'état vers le parent (fermeture)
  emit('update:isModalOpen', newValue);
  // Rafraîchir la liste si on vient de fermer la modale (après création)
  if (newValue === false) {
    fetchActualites();
  }
}

// 2. Gestion de la modale de MISE À JOUR (utilise l'état interne)
function handleCloseUpdateModal(newValue) {
  isUpdateModalOpen.value = newValue;
  if (!newValue) {
    selectedArticleId.value = null; // Réinitialiser l'ID sélectionné
  }
    // Rafraîchir après la mise à jour (l'événement @articleUpdated est aussi une option)
    if (newValue === false) {
        fetchActualites();
    }
}

// 🛑 NOUVEAU : OUVERTURE DE LA MODALE DE MODIFICATION
function openUpdateModal(articleId) {
  selectedArticleId.value = articleId;
  isUpdateModalOpen.value = true;
}


// --------------------------------------------------
// CRUD
// --------------------------------------------------

async function deleteActualite(id) {
 // ... (votre code deleteActualite) ...
    if (!confirm("Voulez-vous vraiment supprimer cette actualité ?")) return;

    try {
        await api.delete(`${PATH_API}/${id}`);
        // 🔄 Actualiser la liste après suppression
        actualites.value = actualites.value.filter(a => a.actualiteId !== id);
        console.log(`Actualité ${id} supprimée avec succès.`);
    } catch (error) {
        console.error("Erreur lors de la suppression de l’actualité :", error);
        alert("Impossible de supprimer l’actualité.");
    }
}


onMounted(() => {
 fetchActualites();
});
</script>

<template>
  <CreateArticleModal
    :modelValue="props.isModalOpen"
    @update:modelValue="handleCloseCreateModal"
    @articleCreated="fetchActualites"
/>

  <UpdateArticleModal
    :modelValue="isUpdateModalOpen"
    @update:modelValue="handleCloseUpdateModal"
    :articleId="selectedArticleId"
    @articleUpdated="fetchActualites"
  />

  <div v-if="isLoading" class="alert alert-info text-center">
    Chargement des actualités...
  </div>
  <div v-else-if="errorMessage" class="alert alert-danger text-center">
    {{ errorMessage }}
  </div>

  <div class="cards-grid cardsActualite">
    <div class="card" v-for="article in actualites" :key="article.actualiteId">
      <img :src="!article.imageUrl || article.imageUrl.includes('placeholder')
        ? 'http://localhost:5067/images/actualites/placeholder-styling.jpg'
        : (article.imageUrl.startsWith('http') ? article.imageUrl : 'http://localhost:5067' + article.imageUrl)"
        class="card-img-top" alt="Image Actualité" />

      <div class="card-body">
        <h5 class="card-title"> {{ article.titre }}</h5>
        <p class="text-truncate">{{ article.contenu }}</p>
        <p class="m-0 text-end">{{ formatDate(article.dateDePublication) }}</p>
        <p class="text-end">Ecrit par: {{ article.user.nom }}</p>
        <div class="groupBtn d-flex justify-content-between gap-2">
                    <button class="btn btn-outline-info" @click="openUpdateModal(article.actualiteId)">
            Modifier
          </button>
          <button class="btn btn-outline-danger" @click="deleteActualite(article.actualiteId)">
            Supprimer
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
<style scoped>
/* (Styles inchangés) */
.cards-grid {
 display: grid;
 grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
 gap: 1.5rem;
}

.card {
 transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
 transform: translateY(-4px);
 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.cardsActualite img {
 width: 100%;
 height: 200px;
 /* ajustable selon ton design */
 object-fit: cover;
 /* garde les proportions sans déformer */
 border-top-left-radius: 12px;
 border-top-right-radius: 12px;
}


.cardsActualite .card {
 background-color: #343a40;
 color: white;
 border: none;
 border-radius: 12px;
 box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.cardsActualite img {
 flex-shrink: 0;
}

.cardsActualite h4 {
 font-size: 1.25rem;
}
</style>
