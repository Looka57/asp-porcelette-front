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

const isUpdateModalOpen = ref(false);
const selectedArticleId = ref(null);

/* -------------------------------------------------------------------------- */
/* 🎯 PROPS et EMITS */
/* -------------------------------------------------------------------------- */
const props = defineProps({
  isModalOpen: { type: Boolean, required: true },
  searchTerm: { type: String, default: '' },
  currentFilter: { type: String, default: 'publies' } // 'publies', 'archives', 'total'
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
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
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

/* -------------------------------------------------------------------------- */
/* 🧾 STATS */
/* -------------------------------------------------------------------------- */
const totalArticles = computed(() => actualites.value.length);

const articlesArchives = computed(() => {
  const cutoff = getArchiveCutoffDate();
  return actualites.value.filter(a => {
    if (!a.dateDePublication) return false;
    const pubDate = new Date(a.dateDePublication);
    pubDate.setUTCHours(0, 0, 0, 0);
    return pubDate < cutoff;
  }).length;
});

const articlesActifs = computed(() => {
  const cutoff = getArchiveCutoffDate();
  return actualites.value.filter(a => {
    if (!a.dateDePublication) return false;
    const pubDate = new Date(a.dateDePublication);
    pubDate.setUTCHours(0, 0, 0, 0);
    return pubDate >= cutoff;
  }).length;
});

/* -------------------------------------------------------------------------- */
/* 🧱 MODALES & SUPPRESSION */
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

/* -------------------------------------------------------------------------- */
/* 🔍 FILTRAGE PUR */
/* -------------------------------------------------------------------------- */
const filteredListUnpaged = computed(() => {
  let list = actualites.value;

  if (props.currentFilter === 'publies') {
    list = list.filter(a => new Date(a.dateDePublication) >= getArchiveCutoffDate());
  } else if (props.currentFilter === 'archives') {
    list = list.filter(a => new Date(a.dateDePublication) < getArchiveCutoffDate());
  }

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
/* 🗂️ GROUPÉ PAR ANNÉE / MOIS */
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
  const cutoff = getArchiveCutoffDate();
  return groupByYearMonth(actualites.value.filter(a => new Date(a.dateDePublication) < cutoff));
});

const totalGrouped = computed(() => {
  if (props.currentFilter !== 'total') return {};
  return groupByYearMonth(filteredListUnpaged.value);
});

/* -------------------------------------------------------------------------- */
/* 🚀 INIT */
/* -------------------------------------------------------------------------- */
onMounted(fetchActualites);

</script>

<template>
  <CreateArticleModal :modelValue="props.isModalOpen" @update:modelValue="handleCloseCreateModal" />
  <UpdateArticleModal :modelValue="isUpdateModalOpen" @update:modelValue="handleCloseUpdateModal"
    :articleId="selectedArticleId" />

  <div v-if="isLoading" class="alert alert-info text-center">Chargement des actualités...</div>
  <div v-else-if="errorMessage" class="alert alert-danger text-center">{{ errorMessage }}</div>

  <!-- 🔹 ARCHIVES -->
  <div v-else-if="props.currentFilter === 'archives'" class="mt-3">
    <div v-for="(months, year) in archivesGrouped" :key="year" class="mb-4">
      <h4 class="text-warning border-bottom pb-2">{{ year }}</h4>
      <div v-for="(articles, month) in months" :key="month" class="mb-3">
        <details>
          <summary class="fw-bold text-light">
            {{ month }} ({{ articles.length }} article{{ articles.length > 1 ? 's' : '' }})
          </summary>
          <div class="mt-2 ms-3 cards-grid">
            <div v-for="article in articles" :key="article.actualiteId" class="card card-actualite">
              <img :src="article.imageUrl
                ? (article.imageUrl.startsWith('http') ? article.imageUrl : 'http://localhost:5067' + article.imageUrl)
                : 'http://localhost:5067/images/actualites/placeholder-styling.jpg'" class="card-img-top"
                alt="Image Actualité" />
              <div class="card-body">
                <h5 class="card-title text-warning">{{ article.titre }}</h5>
                <p class="card-text text-light">{{ article.contenu }}</p>
                <p class="text-end text-secondary small">
                  Publié le {{ formatDate(article.dateDePublication) }}
                </p>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  </div>

  <!-- 🔹 TOTAL ARTICLES -->
  <div v-else-if="props.currentFilter === 'total'" class="mt-3">
    <div v-for="(months, year) in totalGrouped" :key="year" class="mb-4">
      <h4 class="text-warning border-bottom pb-2">{{ year }}</h4>
      <div v-for="(articles, month) in months" :key="month" class="mb-3">
        <details>
          <summary class="fw-bold text-light">
            {{ month }} ({{ articles.length }} article{{ articles.length > 1 ? 's' : '' }})
          </summary>
          <div class="mt-2 ms-3 cards-grid">
            <div v-for="article in articles" :key="article.actualiteId" class="card card-actualite">
              <img :src="article.imageUrl
                ? (article.imageUrl.startsWith('http') ? article.imageUrl : 'http://localhost:5067' + article.imageUrl)
                : 'http://localhost:5067/images/actualites/placeholder-styling.jpg'" class="card-img-top"
                alt="Image Actualité" />
              <div class="card-body">
                <h5 class="card-title text-warning">{{ article.titre }}</h5>
                <p class="card-text text-light">{{ article.contenu }}</p>
                <p class="text-end text-secondary small">
                  Publié le {{ formatDate(article.dateDePublication) }}
                </p>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  </div>

  <!-- 🔹 PUBLIÉS / GRILLE PAR DÉFAUT -->
  <div v-else class="cards-grid cardsActualite">
    <div v-for="article in filteredListUnpaged" :key="article.actualiteId" class="card card-actualite">
      <img :src="article.imageUrl
        ? (article.imageUrl.startsWith('http') ? article.imageUrl : 'http://localhost:5067' + article.imageUrl)
        : 'http://localhost:5067/images/actualites/placeholder-styling.jpg'" class="card-img-top"
        alt="Image Actualité" />
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
            Écrit par : <strong>{{ article.user?.nom || 'Utilisateur inconnu' }}</strong>
          </p>
          <div class="groupBtn d-flex justify-content-between mt-3 gap-2">
            <button class="btn btn-outline-info btn-sm" @click="openUpdateModal(article.actualiteId)">Modifier</button>
            <button class="btn btn-outline-danger btn-sm"
              @click="deleteActualite(article.actualiteId)">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.75rem;
  margin-top: 1.5rem;
}

.card-actualite {
  background-color: #2c3035;
  color: white;
  border: none;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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

details summary {
  cursor: pointer;
  color: #ffcc00;
}

details[open] summary {
  color: #ffa500;
}

.groupBtn button {
  flex: 1;
}
</style>
