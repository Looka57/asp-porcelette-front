<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api/axios';
import CreateArticleModal from './CreateArticleModal.vue';
import UpdateArticleModal from './UpdateArticleModal.vue';

/* -------------------------------------------------------------------------- */
/* 💾 VARIABLES RÉACTIVES */
/* -------------------------------------------------------------------------- */
const actualites = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);

// ⚙️ Modale de mise à jour
const isUpdateModalOpen = ref(false);
const selectedArticleId = ref(null);

/* -------------------------------------------------------------------------- */
/* 🎯 PROPS et EMITS */
/* -------------------------------------------------------------------------- */
const props = defineProps({
  isModalOpen: {
    type: Boolean,
    required: true
  },
  searchTerm: {
    type: String,
    default: ''
  },
  currentFilter: {
    type: String,
    default: 'total' }
});

const emit = defineEmits(['update:isModalOpen', 'articleUpdated', 'update-stats']);

const PATH_API = '/Actualite';

/* -------------------------------------------------------------------------- */
/* 🔄 RÉCUPÉRATION DES ACTUALITÉS */
/* -------------------------------------------------------------------------- */
async function fetchActualites() {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    const reponse = await api.get(PATH_API);
    actualites.value = reponse.data;

    // Mise à jour des statistiques après le chargement
    emit('update-stats', {
      total: totalArticles.value,
      publies: articlesActifs.value,
      archives: articlesArchives.value,
    });
  } catch (error) {
    console.error('Erreur lors du chargement des actualités:', error);
    errorMessage.value = 'Impossible de charger les actualités.';
  } finally {
    isLoading.value = false;
  }
}

/* -------------------------------------------------------------------------- */
/* 🗓️ FONCTIONS UTILITAIRES */
/* -------------------------------------------------------------------------- */
function formatDate(dateString) {
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

// Date butoir : aujourd’hui - 10 jours
function getArchiveCutoffDate() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 10);
  cutoffDate.setUTCHours(0, 0, 0, 0);
  return cutoffDate;
}

// Aujourd’hui sans heure
function getToday() {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
}

/* -------------------------------------------------------------------------- */
/* 📊 STATISTIQUES */
/* -------------------------------------------------------------------------- */
const totalArticles = computed(() => actualites.value.length);

// Articles archivés : publication > 10 jours
const articlesArchives = computed(() => {
  const archiveCutoff = getArchiveCutoffDate();

  return actualites.value.filter(article => {
    if (!article.dateDePublication) return false;

    try {
      const dateString = article.dateDePublication.includes('Z') || article.dateDePublication.includes('+')
        ? article.dateDePublication
        : article.dateDePublication + 'Z';

      const pubDate = new Date(dateString);
      pubDate.setUTCHours(0, 0, 0, 0);

      return pubDate < archiveCutoff; // plus de 10 jours
    } catch {
      return false;
    }
  }).length;
});

// Articles actifs (publiés mais pas encore archivés)
const articlesActifs = computed(() => {
  const archiveCutoff = getArchiveCutoffDate();
  const today = getToday();

  return actualites.value.filter(article => {
    if (!article.dateDePublication) return false;

    try {
      const dateString = article.dateDePublication.includes('Z') || article.dateDePublication.includes('+')
        ? article.dateDePublication
        : article.dateDePublication + 'Z';

      const pubDate = new Date(dateString);
      pubDate.setUTCHours(0, 0, 0, 0);

      // Publié si >= cutoff OU dans le futur
      return pubDate > today || pubDate >= archiveCutoff;
    } catch {
      return false;
    }
  }).length;
});

/* -------------------------------------------------------------------------- */
/* 🧱 MODALES */
/* -------------------------------------------------------------------------- */
function handleCloseCreateModal(newValue) {
  emit('update:isModalOpen', newValue);
  if (!newValue) fetchActualites();
}

function handleCloseUpdateModal(newValue) {
  isUpdateModalOpen.value = newValue;
  if (!newValue) {
    selectedArticleId.value = null;
    fetchActualites();
  }
}

function openUpdateModal(articleId) {
  selectedArticleId.value = articleId;
  isUpdateModalOpen.value = true;
}

/* -------------------------------------------------------------------------- */
/* ❌ SUPPRESSION */
/* -------------------------------------------------------------------------- */
async function deleteActualite(id) {
  if (!confirm("Voulez-vous vraiment supprimer cette actualité ?")) return;
  try {
    await api.delete(`${PATH_API}/${id}`);
    actualites.value = actualites.value.filter(a => a.actualiteId !== id);

    // Mise à jour des stats
    emit('update-stats', {
      total: totalArticles.value,
      publies: articlesActifs.value,
      archives: articlesArchives.value,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    alert("Impossible de supprimer l’actualité.");
  }
}

/* -------------------------------------------------------------------------- */
/* 🔍 FILTRAGE */
/* -------------------------------------------------------------------------- */
const filteredActualites = computed(() => {
    let list = actualites.value;

    // Filtre par statut
    if (props.currentFilter === 'publies') {
        list = list.filter(a => {
            const pubDate = new Date(a.dateDePublication);
            return pubDate >= getArchiveCutoffDate();
        });
    } else if (props.currentFilter === 'archives') {
        list = list.filter(a => {
            const pubDate = new Date(a.dateDePublication);
            return pubDate < getArchiveCutoffDate();
        });
    }

    // Filtre textuel
    if (props.searchTerm) {
        const term = props.searchTerm.toLowerCase();
        list = list.filter(a =>
            a.titre.toLowerCase().includes(term) ||
            a.contenu.toLowerCase().includes(term) ||
            a.user?.nom?.toLowerCase().includes(term)
        );
    }

    return list;
});



/* -------------------------------------------------------------------------- */
/* 🚀 INITIALISATION */
/* -------------------------------------------------------------------------- */
onMounted(fetchActualites);
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

  <div v-else class="cards-grid cardsActualite">
    <div
      v-for="article in filteredActualites"
      :key="article.actualiteId"
      class="card card-actualite"
    >
      <img
        :src="!article.imageUrl || article.imageUrl.includes('placeholder')
          ? 'http://localhost:5067/images/actualites/placeholder-styling.jpg'
          : (article.imageUrl.startsWith('http')
            ? article.imageUrl
            : 'http://localhost:5067' + article.imageUrl)"
        class="card-img-top"
        alt="Image Actualité"
      />

      <div class="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 class="card-title text-warning fw-bold">{{ article.titre }}</h5>
          <p class="card-text text-light text-truncate">{{ article.contenu }}</p>
        </div>

        <div class="mt-auto">
          <p class="m-0 text-end text-secondary small">
            Publié le {{ formatDate(article.dateDePublication) }}
          </p>
          <p class="text-end text-secondary small">
            Écrit par : <strong>{{ article.user.nom }}</strong>
          </p>

          <div class="groupBtn d-flex justify-content-between mt-3 gap-2">
            <button class="btn btn-outline-info btn-sm" @click="openUpdateModal(article.actualiteId)">
              Modifier
            </button>
            <button class="btn btn-outline-danger btn-sm" @click="deleteActualite(article.actualiteId)">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===================================================== */
/* 🎨 STYLE DE LA GRID DES ACTUALITÉS */
/* ===================================================== */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.75rem;
  margin-top: 2rem;
  align-items: stretch;
}

.card-actualite {
  background-color: #2c3035;
  color: white;
  border: none;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-actualite:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.4);
}

.card-actualite img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-body {
  padding: 1rem 1.2rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 0.95rem;
  color: #d1d1d1;
}

.groupBtn button {
  flex: 1;
}

@media (max-width: 600px) {
  .card-actualite img {
    height: 180px;
  }
  .card-title {
    font-size: 1.05rem;
  }
}
</style>
