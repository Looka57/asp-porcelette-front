<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api/axios';

const tarifs = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);

const DISCIPLINE_MAPPING = {
  1: 'Judo',
  2: 'Aïkido',
  3: 'Jujitsu',
  4: 'Judo Détente',
};

const API_TARIF = 'Tarif';

function createSlug(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

async function fetchTarif() {
  try {
    isLoading.value = true;
    errorMessage.value = null;
    const response = await api.get(API_TARIF);

    tarifs.value = response.data.map(tarif => {
      const disciplineName = tarif.disciplineId
        ? DISCIPLINE_MAPPING[tarif.disciplineId] || 'Inconnu'
        : 'Général';

      return {
        ...tarif,
        disciplineName: disciplineName,
        disciplineSlug: createSlug(disciplineName),
      };
    });

  } catch (_error) {
    console.error("Erreur API:", _error);
    errorMessage.value = "Impossible de charger les tarifs.";
  } finally {
    isLoading.value = false;
  }
}

// Couleurs dynamiques par discipline (identiques au design system)
function getDisciplineColor(slug) {
  switch (slug) {
    case 'judo': return '#d9534f';       // Rouge
    case 'aikido': return '#31b3d0';     // Bleu Aïkido
    case 'jujitsu': return '#5cb85c';    // Vert
    case 'judo-detente': return '#f0ad4e'; // Jaune / Orange
    default: return '#6c757d';           // Gris (Général / Inconnu)
  }
}

// Propriété calculée : Regroupement principal par DISCIPLINE, et secondaire par NOM DE TARIF
const groupedTarifs = computed(() => {
  const groupsByDiscipline = tarifs.value.reduce((acc, tarif) => {
    const disciplineKey = tarif.disciplineName;

    if (!acc[disciplineKey]) {
      acc[disciplineKey] = {
        name: disciplineKey,
        slug: tarif.disciplineSlug,
        categories: {}
      };
    }

    const categoryKey = tarif.nom ? tarif.nom.trim() : 'Sans nom';

    if (!acc[disciplineKey].categories[categoryKey]) {
      acc[disciplineKey].categories[categoryKey] = {
        title: categoryKey,
        prices: []
      };
    }

    acc[disciplineKey].categories[categoryKey].prices.push({
      montant: tarif.montant,
      periodicite: tarif.periodicite,
      description: tarif.description,
      tarifId: tarif.tarifId
    });

    return acc;
  }, {});

  let groupsArray = Object.values(groupsByDiscipline);

  groupsArray.forEach(group => {
    group.categories = Object.values(group.categories);

    group.categories.forEach(category => {
      category.prices.sort((a, b) => {
        const montantA = parseFloat(a.montant) || 0;
        const montantB = parseFloat(b.montant) || 0;
        return montantB - montantA; // Décroissant
      });
    });

    group.categories.sort((a, b) => a.title.localeCompare(b.title));
  });

  groupsArray.sort((a, b) => {
    const isAOther = a.name === 'Général' || a.name === 'Inconnu';
    const isBOther = b.name === 'Général' || b.name === 'Inconnu';

    if (isAOther && !isBOther) return 1;
    if (!isAOther && isBOther) return -1;

    return a.name.localeCompare(b.name);
  });

  return groupsArray;
});

onMounted(fetchTarif);
</script>

<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100 pb-5">

    <!-- Bannière Tarifs -->
    <div class="imgBaniereTarifs">
      <div class="overlay">
        <span class="text-uppercase tracking-wider fs-7 fw-bold text-info-custom d-block mb-2">Adhésion & Formules</span>
        <h1 class="display-3 text-uppercase text-white fw-black">
          Nos Tarifs
        </h1>
        <p class="lead text-light opacity-85 mt-2 mb-0 max-w-700">
          Trouvez l'option la plus adaptée à votre pratique au sein de l'AS Porcelette Arts Martiaux.
        </p>
      </div>
    </div>

    <!-- Contenu Principal -->
    <div class="container py-5">

      <!-- Chargement -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-info-custom mb-3" role="status"></div>
        <p class="m-0 text-muted">Chargement des tarifs...</p>
      </div>

      <!-- Erreur -->
      <div v-else-if="errorMessage" class="alert alert-danger bg-danger bg-opacity-15 text-danger border-0 text-center py-4 rounded-4 shadow mx-auto max-w-700">
        {{ errorMessage }}
      </div>

      <!-- Aucun tarif -->
      <div v-else-if="tarifs.length === 0" class="container py-4">
        <div class="alert alert-dark bg-dark-card text-light border-secondary text-center py-5 rounded-4 shadow max-w-700 mx-auto">
          <i class="bi bi-tag fs-1 text-info-custom d-block mb-3"></i>
          <h4>Aucun tarif disponible</h4>
          <p class="text-muted mb-0">Aucun tarif n'est renseigné pour le moment.</p>
        </div>
      </div>

      <!-- Accordéon des Tarifs -->
      <div v-else class="row justify-content-center">
        <div class="col-lg-10">
          <div class="accordion custom-accordion" id="tarifsAccordion">

            <div v-for="group in groupedTarifs" :key="group.slug"
                 class="accordion-item bg-dark-card text-light rounded-4 border-secondary border-opacity-50 mb-4 shadow overflow-hidden"
                 :class="`section-${group.slug}`">

              <h2 class="accordion-header" :id="`heading-${group.slug}`">
                <button class="accordion-button bg-dark-card text-white fw-bold collapsed py-4 px-4 fs-5" type="button"
                  data-bs-toggle="collapse" :data-bs-target="`#collapse-${group.slug}`" aria-expanded="false"
                  :aria-controls="`collapse-${group.slug}`">
                  <span class="badge me-3 px-3 py-2 rounded-pill shadow-sm fs-7 text-uppercase"
                        :style="{ backgroundColor: getDisciplineColor(group.slug), color: (group.slug === 'judo-detente' ? '#1a1d21' : '#fff') }">
                    {{ group.name }}
                  </span>
                  <span>Formules & Tarifs {{ group.name }}</span>
                </button>
              </h2>

              <div :id="`collapse-${group.slug}`" class="accordion-collapse collapse"
                :aria-labelledby="`heading-${group.slug}`" data-bs-parent="#tarifsAccordion">
                <div class="accordion-body bg-dark-card text-light px-4 pb-4 pt-2">

                  <div v-for="(category, catIndex) in group.categories" :key="`${group.slug}-${catIndex}`"
                    class="category-group mb-4">

                    <h4 class="category-title text-white h6 fw-semibold pb-2 mb-3 mt-3 border-bottom border-secondary opacity-75"
                        :class="{ 'mt-0 pt-0': catIndex === 0 }">
                      <i class="bi bi-bookmark-check me-2" :style="{ color: getDisciplineColor(group.slug) }"></i>
                      {{ category.title }}
                    </h4>

                    <ul class="tarif-list list-unstyled m-0">
                      <li v-for="priceDetail in category.prices" :key="priceDetail.tarifId"
                        class="tarif-item d-flex justify-content-between align-items-center p-3 mb-2 rounded-3 transition-all">

                        <div class="tarif-details pe-3">
                          <h5 class="item-nom text-light fw-bold m-0 fs-6">
                            {{ priceDetail.periodicite || 'Tarif unique' }}
                          </h5>
                          <p v-if="priceDetail.description" class="small text-muted m-0 mt-1">
                            {{ priceDetail.description }}
                          </p>
                        </div>

                        <div class="tarif-prix text-end flex-shrink-0">
                          <span class="priceAmount fw-black fs-4 text-white px-3 py-1 rounded-pill bg-black bg-opacity-25 border border-secondary border-opacity-25"
                                :style="{ color: getDisciplineColor(group.slug) + ' !important' }">
                            {{ priceDetail.montant || '???' }} €
                          </span>
                        </div>

                      </li>
                    </ul>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* --- BANNIÈRE --- */
.imgBaniereTarifs {
  position: relative;
  background-image: url('@/assets/img/banniereTarif.png');
  background-size: cover;
  background-position: center 55%;
  width: 100%;
  height: 420px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  text-align: center;
}

.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(26, 29, 33, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
}

/* --- CARTES & ACCORDÉON --- */
.bg-dark-card {
  background-color: #1a1d21;
}

.accordion-item {
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.accordion-button {
  background-color: #1a1d21 !important;
  color: #ffffff !important;
  box-shadow: none !important;
}

.accordion-button:not(.collapsed) {
  background-color: #22262b !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.accordion-button::after {
  filter: invert(1) grayscale(100%) brightness(200%);
}

.accordion-body {
  border-top: none;
}

/* --- LISTE DES TARIFS & ITEMS --- */
.tarif-item {
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.tarif-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  transform: translateX(4px);
}

.transition-all {
  transition: all 0.2s ease-in-out;
}

/* --- OMBRES ET BORDURES DYNAMIQUES PAR DISCIPLINE --- */
.section-judo:has(.accordion-button:not(.collapsed)) {
  box-shadow: 0 10px 30px rgba(217, 83, 79, 0.2);
  border-color: #d9534f !important;
}

.section-aikido:has(.accordion-button:not(.collapsed)) {
  box-shadow: 0 10px 30px rgba(49, 179, 208, 0.2);
  border-color: #31b3d0 !important;
}

.section-jujitsu:has(.accordion-button:not(.collapsed)) {
  box-shadow: 0 10px 30px rgba(92, 184, 92, 0.2);
  border-color: #5cb85c !important;
}

.section-judo-detente:has(.accordion-button:not(.collapsed)) {
  box-shadow: 0 10px 30px rgba(240, 173, 78, 0.2);
  border-color: #f0ad4e !important;
}

.section-general:has(.accordion-button:not(.collapsed)),
.section-inconnu:has(.accordion-button:not(.collapsed)) {
  box-shadow: 0 10px 30px rgba(108, 117, 125, 0.2);
  border-color: #6c757d !important;
}

/* --- UTILITAIRES --- */
.text-info-custom {
  color: #31b3d0 !important;
}

.tracking-wider {
  letter-spacing: 0.1em;
}

.fw-black {
  font-weight: 900;
}

.fs-7 {
  font-size: 0.75rem;
}

.max-w-700 {
  max-width: 700px;
}

@media (max-width: 991px) {
  .imgBaniereTarifs {
    height: 350px;
  }
}
</style>
