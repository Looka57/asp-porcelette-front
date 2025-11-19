<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '@/api/axios'; // Assurez-vous que le chemin est correct

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

// PROPRIÉTÉ CALCULÉE MISE À JOUR : Regroupement principal par DISCIPLINE, et secondaire par NOM DE TARIF
const groupedTarifs = computed(() => {
  // 1. Regroupement initial par DISCIPLINE
  const groupsByDiscipline = tarifs.value.reduce((acc, tarif) => {
    const disciplineKey = tarif.disciplineName;

    if (!acc[disciplineKey]) {
      acc[disciplineKey] = {
        name: disciplineKey,
        slug: tarif.disciplineSlug,
        categories: {} // Ici nous allons stocker les regroupements par nom de tarif
      };
    }

    // CORRECTION APPLIQUÉE ICI: Normaliser le nom du tarif (supprimer les espaces blancs autour)
    const categoryKey = tarif.nom ? tarif.nom.trim() : 'Sans nom';

    // Si la catégorie n'existe pas, initialiser avec le nom nettoyé.
    if (!acc[disciplineKey].categories[categoryKey]) {
      acc[disciplineKey].categories[categoryKey] = {
        // Utiliser le nom nettoyé pour le titre affiché
        title: categoryKey,
        prices: []
      };
    }

    acc[disciplineKey].categories[categoryKey].prices.push({
      montant: tarif.montant,
      periodicite: tarif.periodicite,
      description: tarif.description,
      tarifId: tarif.tarifId // Garder l'ID pour la clé Vue
    });

    return acc;
  }, {});

  // 2. Conversion en tableau et tri (inchangé)
  let groupsArray = Object.values(groupsByDiscipline);

  groupsArray.forEach(group => {
    // Convertir l'objet de catégories en tableau pour l'itération dans le template
    group.categories = Object.values(group.categories);

    // Tri des prix à l'intérieur de chaque catégorie (du plus cher au moins cher)
    group.categories.forEach(category => {
      category.prices.sort((a, b) => {
        const montantA = parseFloat(a.montant) || 0;
        const montantB = parseFloat(b.montant) || 0;
        return montantB - montantA; // Décroissant
      });
    });

    // Tri des catégories par titre (alphabétique)
    group.categories.sort((a, b) => a.title.localeCompare(b.title));
  });

  // 3. Tri des GROUPES PRINCIPAUX (par nom de discipline)
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
  <div class="container-fluid p-0 bg-dark text-light min-vh-100">
    <div class="imgBaniereJudo">
      <div class="titlePrincipal">
        <div class="overlay">
          <h1 class="display-3 text-uppercase text-warning ">Nos Tarifs</h1>
          <p class="lead text-white">Trouvez l'option la plus adaptée à votre pratique.</p>
        </div>
      </div>
    </div>

    <div class="container p-5">
      <div v-if="isLoading" class="loading-message text-center p-5">
        <div class="spinner-border text-warning" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-3">Chargement des tarifs...</p>
      </div>
      <div v-else-if="errorMessage" class="alert alert-danger mx-auto mt-5">{{ errorMessage }}</div>
      <div v-else-if="tarifs.length === 0" class="alert alert-info mx-auto mt-5 text-center">
        Aucun tarif disponible pour le moment.
      </div>

      <div v-else class="accordion" id="tarifsAccordion">

        <div v-for="group in groupedTarifs" :key="group.slug" class="accordion-item bg-dark text-light border-0 mb-3"
          :class="`section-${group.slug}`">

          <h2 class="accordion-header" :id="`heading-${group.slug}`">
            <button class="accordion-button bg-dark text-warning fw-bold collapsed" type="button"
              data-bs-toggle="collapse" :data-bs-target="`#collapse-${group.slug}`" aria-expanded="false"
              :aria-controls="`collapse-${group.slug}`">
              <i class="bi bi-bookmark-fill me-2"></i> {{ group.name }}
            </button>
          </h2>

          <div :id="`collapse-${group.slug}`" class="accordion-collapse collapse"
            :aria-labelledby="`heading-${group.slug}`" data-bs-parent="#tarifsAccordion">
            <div class="accordion-body bg-dark text-light">

              <div v-for="(category, catIndex) in group.categories" :key="`${group.slug}-${catIndex}`"
                class="category-group">

                <h4 class="category-title text-warning pb-1 mb-0 mt-3" :class="{ 'pt-0 mt-0': catIndex === 0 }">
                  {{ category.title }}
                </h4>

                <ul class="tarif-list list-unstyled m-0">
                  <li v-for="priceDetail in category.prices" :key="priceDetail.tarifId"
                    class="tarif-item d-flex justify-content-between align-items-center transition-all">

                    <div class="tarif-details">
                      <h5 class="item-nom text-light m-0">{{ priceDetail.periodicite || 'Tarif unique' }}</h5>
                      <p v-if="priceDetail.description" class="small text-muted m-0">{{ priceDetail.description }}</p>
                    </div>

                    <div class="tarif-prix text-end">
                      <span class="priceAmount fw-bold fs-4 text-warning">
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
</template>

<style scoped>
/* Le style est inchangé, car il était déjà optimisé pour la structure désirée. */
/* --- BANNIÈRE --- */
.imgBaniereJudo {
  position: relative;
  background-image: url('@/assets/img/banniereTarif.png');
  background-size: cover;
  background-position: center 55%;
  width: 100%;
  height: 650px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  text-align: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
}

.overlay h1 {
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 2px 2px 6px #000;
}

.overlay p {
  font-weight: 500;
  letter-spacing: 1px;
  text-shadow: 1px 1px 3px #000;
}

/* --- ACCORDÉON & LISTE DES TARIFS --- */

.accordion-item {
  border-radius: 8px !important;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  transition: box-shadow 0.3s ease;
}

.accordion-button {
  border-bottom: 1px solid #333;
  transition: all 0.3s ease;
  border-radius: 8px 8px 0 0 !important;
}

.accordion-button:not(.collapsed) {
  color: inherit;
  background-color: #1c1c1c;
  box-shadow: none;
}

.accordion-button:focus {
  box-shadow: none;
}

.accordion-body {
  padding: 1.5rem;
  border-left: 5px solid #ffc107;
}

/* Style de la catégorie interne */
.category-group {
  /* Ajoute un espacement entre les différentes catégories de tarifs (e.g., -18 ans et +18 ans) */
  padding-bottom: 1.5rem;
}

.category-group:last-child {
  padding-bottom: 0;
}

.category-title {
  /* Ligne de séparation sous le titre de la catégorie */
  border-bottom: 1px solid #444 !important;
}

/* Transition générale pour les éléments de la liste */
.transition-all {
  transition: all 0.2s ease-in-out;
}

.tarif-item {
  padding: 0.75rem 0;
  /* Réduit un peu l'espacement pour que les prix d'une même catégorie soient plus serrés */
  border-bottom: 1px dashed #444;
}

.tarif-item:last-child {
  border-bottom: none;
}

.tarif-item:hover {
  background-color: #2c3034;
  border-radius: 4px;
  padding-left: 15px;
  padding-right: 15px;
  transform: translateY(-2px);
}

.item-nom {
  /* Utilisé pour la Périodicité (e.g., Sept-Juin) */
  font-size: 1.1rem;
  font-weight: 600;
}


/* --- COULEURS SPÉCIFIQUES AUX DISCIPLINES --- */
/* Reste inchangé */

/* Judo (slug: judo) */
.section-judo .accordion-button:not(.collapsed) {
  color: #ff6b6b !important;
  /* Rouge */
}

.section-judo .accordion-body {
  border-left-color: #ff6b6b !important;
}

/* Aïkido (slug: aikido) */
.section-aikido .accordion-button:not(.collapsed) {
  color: #4dabff !important;
  /* Bleu clair */
}

.section-aikido .accordion-body {
  border-left-color: #4dabff !important;
}

/* Jujitsu (slug: jujitsu) */
.section-jujitsu .accordion-button:not(.collapsed) {
  color: #4caf50 !important;
  /* Vert */
}

.section-jujitsu .accordion-body {
  border-left-color: #4caf50 !important;
}

/* Judo détente (slug: judo-detente) */
.section-judo-detente .accordion-button:not(.collapsed) {
  color: #f7d76d !important;
  /* Jaune/Orange clair */
}

.section-judo-detente .accordion-body {
  border-left-color: #f7d76d !important;
}

/* Général (slug: general) */
.section-general .accordion-button:not(.collapsed) {
  color: #cccccc !important;
  /* Gris */
}

.section-general .accordion-body {
  border-left-color: #cccccc !important;
}

/* --- OMBRES (BOX-SHADOW) & BORDURE GAUCHE DE L'HEADER --- */

.accordion-item:has(.accordion-button:not(.collapsed)) {
  transition: box-shadow 0.3s ease;
}

.section-judo:has(.accordion-button:not(.collapsed)) {
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
}

.section-judo .accordion-item:has(.accordion-button:not(.collapsed)) .accordion-header {
  border-left-color: #ff6b6b;
}

.section-aikido:has(.accordion-button:not(.collapsed)) {
  box-shadow: 0 4px 20px rgba(77, 171, 255, 0.3);
}

.section-aikido .accordion-item:has(.accordion-button:not(.collapsed)) .accordion-header {
  border-left-color: #4dabff;
}

.section-jujitsu:has(.accordion-button:not(.collapsed)) {
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
}

.section-jujitsu .accordion-item:has(.accordion-button:not(.collapsed)) .accordion-header {
  border-left-color: #4caf50;
}

.section-judo-detente:has(.accordion-button:not(.collapsed)) {
  box-shadow: 0 4px 20px rgba(247, 215, 109, 0.3);
}

.section-judo-detente .accordion-item:has(.accordion-button:not(.collapsed)) .accordion-header {
  border-left-color: #f7d76d;
}

.section-general:has(.accordion-button:not(.collapsed)),
.section-inconnu:has(.accordion-button:not(.collapsed)) {
  box-shadow: 0 4px 20px rgba(117, 117, 117, 0.3);
}

.section-general .accordion-item:has(.accordion-button:not(.collapsed)) .accordion-header {
  border-left-color: #cccccc;
}
</style>
