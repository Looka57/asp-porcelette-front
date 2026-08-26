<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api/axios';
import CreateArticleModal from './CreateArticleModal.vue';
import UpdateArticleModal from './UpdateArticleModal.vue';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

/* -------------------------------------------------------------------------- */
/* 💾 VARIABLES RÉACTIVES */
/* -------------------------------------------------------------------------- */
const actualites = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);

const isUpdateModalOpen = ref(false);
const selectedArticleId = ref(null);

/* -------------------------------------------------------------------------- */
/* 🎯 PROPS ET EMITS */
/* -------------------------------------------------------------------------- */
const props = defineProps({
  isModalOpen: { type: Boolean, required: true },
  searchTerm: { type: String, default: '' },
  currentFilter: { type: String, default: 'publies' }
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
/* 🗓️ UTILITAIRES */
/* -------------------------------------------------------------------------- */
function formatDate(dateString) {
  if (!dateString) return 'Date inconnue';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  } catch {
    return dateString;
  }
}

function getArchiveCutoffDate() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 10);
  cutoff.setUTCHours(0, 0, 0, 0);
  return cutoff;
}

function isArchived(dateString) {
  if (!dateString) return false;
  const pubDate = new Date(dateString);
  pubDate.setUTCHours(0, 0, 0, 0);
  return pubDate < getArchiveCutoffDate();
}

/* -------------------------------------------------------------------------- */
/* 🧾 STATS & FILTRES */
/* -------------------------------------------------------------------------- */
const totalArticles = computed(() => actualites.value.length);

const articlesArchives = computed(() => {
  return actualites.value.filter(a => isArchived(a.dateDePublication)).length;
});

const articlesActifs = computed(() => {
  return actualites.value.filter(a => a.dateDePublication && !isArchived(a.dateDePublication)).length;
});

const filteredListUnpaged = computed(() => {
  let list = actualites.value;

  if (props.currentFilter === 'publies') {
    list = list.filter(a => !isArchived(a.dateDePublication));
  } else if (props.currentFilter === 'archives') {
    list = list.filter(a => isArchived(a.dateDePublication));
  }

  if (props.searchTerm) {
    const term = props.searchTerm.toLowerCase();
    list = list.filter(a =>
      a.titre?.toLowerCase().includes(term) ||
      a.contenu?.toLowerCase().includes(term) ||
      a.user?.nom?.toLowerCase().includes(term)
    );
  }

  return list;
});

/* -------------------------------------------------------------------------- */
/* 🗂️ GROUPEMENT ARCHIVES / TOTAL */
/* -------------------------------------------------------------------------- */
function groupByYearMonth(list) {
  const grouped = {};
  for (const article of list) {
    const date = new Date(article.dateDePublication);
    const year = date.getFullYear();
    const month = date.toLocaleString('fr-FR', { month: 'long' });

    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = [];

    grouped[year][month].push(article);
  }
  return grouped;
}

const archivesGrouped = computed(() => {
  if (props.currentFilter !== 'archives') return {};
  return groupByYearMonth(actualites.value.filter(a => isArchived(a.dateDePublication)));
});

const totalGrouped = computed(() => {
  if (props.currentFilter !== 'total') return {};
  return groupByYearMonth(filteredListUnpaged.value);
});

/* -------------------------------------------------------------------------- */
/* 🧱 MODALES & GESTION */
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

async function deleteActualite(id) {
  if (!confirm("Voulez-vous vraiment supprimer cette actualité ?")) return;
  try {
    await api.delete(`${PATH_API}/${id}`);
    actualites.value = actualites.value.filter(a => a.actualiteId !== id);
    emit('update-stats', {
      total: totalArticles.value,
      publies: articlesActifs.value,
      archives: articlesArchives.value,
    });
  } catch {
    alert("Impossible de supprimer l’actualité.");
  }
}

onMounted(fetchActualites);
</script>

<template>
  <CreateArticleModal :modelValue="props.isModalOpen" @update:modelValue="handleCloseCreateModal" />
  <UpdateArticleModal :modelValue="isUpdateModalOpen" @update:modelValue="handleCloseUpdateModal"
    :articleId="selectedArticleId" />

  <!-- ⌛ CHARGEMENT -->
  <div v-if="isLoading" class="flex flex-column align-items-center justify-content-center py-6 gap-3">
    <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    <span class="text-400 font-medium">Chargement des actualités...</span>
  </div>

  <!-- ⚠️ ERREUR -->
  <Message v-else-if="errorMessage" severity="error" :closable="false" class="mb-4">
    {{ errorMessage }}
  </Message>

  <!-- 📭 AUCUN RÉSULTAT -->
  <div v-else-if="filteredListUnpaged.length === 0"
    class="text-center py-6 border-round-xl surface-card border-1 border-white-alpha-10 p-5">
    <i class="pi pi-inbox text-5xl text-400 mb-3"></i>
    <h3 class="text-xl font-bold text-white m-0 mb-2">Aucune actualité trouvée</h3>
    <p class="text-400 m-0">Ajustez vos filtres ou la recherche pour afficher du contenu.</p>
  </div>

  <!-- 🔹 MODE ARCHIVES & TOTAL GROUPÉ -->
  <div v-else-if="props.currentFilter === 'archives' || props.currentFilter === 'total'" class="flex flex-column gap-5">
    <div v-for="(months, year) in (props.currentFilter === 'archives' ? archivesGrouped : totalGrouped)" :key="year"
      class="flex flex-column gap-3">
      <div class="flex align-items-center gap-3 border-bottom-1 border-white-alpha-10 pb-2">
        <i class="pi pi-calendar text-warning text-xl"></i>
        <h3 class="text-2xl font-black text-warning m-0">{{ year }}</h3>
      </div>

      <div v-for="(articles, month) in months" :key="month" class="mb-2">
        <details class="group-details">
          <summary
            class="cursor-pointer font-bold text-lg text-300 py-2 px-3 border-round bg-dark-eval hover:text-white transition-colors duration-200">
            <span class="capitalize">{{ month }}</span>
            <span class="text-sm font-normal text-400 ml-2">({{ articles.length }} article{{ articles.length > 1 ? 's' : '' }})</span>
          </summary>

          <div class="grid pt-3">
            <div v-for="article in articles" :key="article.actualiteId" class="col-12 md:col-6 lg:col-4">
              <div
                class="article-card surface-card border-round-xl overflow-hidden flex flex-column h-full border-1 border-white-alpha-10">
            <div class="relative article-img-container">
  <img
    :src="article.imageUrl || '/images/actualites/placeholder-styling.jpg'"
    alt="Image Actualité"
    class="article-img"
    @error="handleImageError"
  />
  <Tag
    :value="isArchived(article.dateDePublication) ? 'Archivé' : 'Publié'"
    :severity="isArchived(article.dateDePublication) ? 'secondary' : 'success'"
    class="absolute top-0 right-0 m-2 text-xs"
  />
</div>

                <div class="p-4 flex flex-column flex-grow-1 justify-content-between">
                  <div>
                    <h4 class="text-lg font-bold text-warning mt-0 mb-2 line-clamp-1">{{ article.titre }}</h4>
                    <p class="text-400 text-sm m-0 line-clamp-3 mb-3">{{ article.contenu }}</p>
                  </div>

                  <div>
                    <span class="text-xs text-400 block text-right mb-3">
                      Publié le {{ formatDate(article.dateDePublication) }}
                    </span>

                    <div class="flex gap-2">
                      <Button label="Modifier" icon="pi pi-pencil" severity="info" outlined
                        class="w-full p-button-sm font-bold btn-outline-info"
                        @click="openUpdateModal(article.actualiteId)" />
                      <Button icon="pi pi-trash" severity="danger" outlined class="p-button-sm btn-outline-danger"
                        @click="deleteActualite(article.actualiteId)" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  </div>

  <!-- 🔹 VUE PAR DÉFAUT (GRILLE PUBLIÉS) -->
  <div v-else class="grid">
    <div v-for="article in filteredListUnpaged" :key="article.actualiteId" class="col-12 md:col-6 lg:col-4">
      <div
        class="article-card surface-card border-round-xl overflow-hidden flex flex-column h-full border-1 border-white-alpha-10">
        <div class="relative article-img-container">
  <img
    :src="article.imageUrl || '/images/actualites/placeholder-styling.jpg'"
    alt="Image Actualité"
    class="article-img"
    @error="handleImageError"
  />
  <Tag
    :value="isArchived(article.dateDePublication) ? 'Archivé' : 'Publié'"
    :severity="isArchived(article.dateDePublication) ? 'secondary' : 'success'"
    class="absolute top-0 right-0 m-2 text-xs"
  />
</div>

        <div class="p-4 flex flex-column flex-grow-1 justify-content-between gap-3">
          <div>
            <h4 class="text-lg font-bold text-warning mt-0 mb-2 line-clamp-1">{{ article.titre }}</h4>
            <p class="text-400 text-sm m-0 line-clamp-3">{{ article.contenu }}</p>
          </div>

          <div>
            <span class="text-xs text-400 block text-right mb-3">
              Publié le {{ formatDate(article.dateDePublication) }}
            </span>
            <div class="flex gap-2">
              <Button label="Modifier" icon="pi pi-pencil" severity="info" outlined
                class="w-full p-button-sm font-bold btn-outline-info" @click="openUpdateModal(article.actualiteId)" />
              <Button icon="pi pi-trash" severity="danger" outlined class="p-button-sm btn-outline-danger"
                @click="deleteActualite(article.actualiteId)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Cartes d'actualités */
.article-card {
  background: #2a2e35;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 193, 7, 0.3) !important;
}

/* Styles personnalisés forcés pour les boutons Outlined */
.btn-outline-info {
  color: #3b82f6 !important;
  border-color: #3b82f6 !important;
}

.btn-outline-info:hover {

  color: #88beff !important;
}

.btn-outline-danger {
  color: #ef4444 !important;
  border-color: #ef4444 !important;
}

.btn-outline-danger:hover {
  background: rgba(239, 68, 68, 0.15) !important;
  color: #f87171 !important;
}

/* Arrière-plan des éléments d'accordéon */
.bg-dark-eval {
  background: rgba(255, 255, 255, 0.03);
}

/* Tronquage de texte */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Groupes repliables HTML natifs stylisés */
.group-details summary {
  list-style: none;
}

.group-details summary::-webkit-details-marker {
  display: none;
}

.group-details summary::before {
  content: '▸';
  display: inline-block;
  margin-right: 0.5rem;
  transition: transform 0.2s;
  color: #ffc107;
}

.group-details[open] summary::before {
  transform: rotate(90deg);
}


/* Fix pour conteneur et rognage parfait des images */
.article-img-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: #1e2227; /* Couleur de fond pendant le chargement */
}

.article-img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  object-position: center !important;
  display: block;
}


</style>
