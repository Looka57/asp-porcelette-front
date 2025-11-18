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

const API_TARIF = ('Tarif')

async function fetchTarif() {
  try {
    isLoading.value = true
    const response = await api.get(API_TARIF)

    // MAPPING : Ajouter le nom de la discipline pour le regroupement et le style
    tarifs.value = response.data.map(tarif => ({
      ...tarif,
      disciplineName: tarif.disciplineId
        ? DISCIPLINE_MAPPING[tarif.disciplineId] || 'Inconnu'
        : 'Général',
      disciplineSlug: tarif.disciplineId
        ? (DISCIPLINE_MAPPING[tarif.disciplineId] || 'Inconnu').toLowerCase().replace(' ', '-')
        : 'general',
    }));

  } catch (_error) {
    console.error("Erreur API:", _error);
    errorMessage.value = "Impossible de charger les tarifs.";
  } finally {
    isLoading.value = false;
  }
}

// Propriété calculée pour regrouper les tarifs par discipline
const groupedTarifs = computed(() => {
  return tarifs.value.reduce((groups, tarif) => {
    const key = tarif.disciplineName;
    if (!groups[key]) {
      groups[key] = {
        name: key,
        slug: tarif.disciplineSlug,
        tarifs: []
      };
    }
    groups[key].tarifs.push(tarif);
    return groups;
  }, {});
});

// Fonction pour récupérer la classe CSS basée sur le SLUG de la discipline
function getDisciplineClass(disciplineSlug) {
  return `section-discipline-${disciplineSlug}`;
}

onMounted(fetchTarif)
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

      <div v-else class="row justify-content-center g-5 py-5">

        <div v-for="group in groupedTarifs" :key="group.slug" class="col-lg-6 d-flex">

          <div :class="['discipline-section-card', getDisciplineClass(group.slug)]">

            <h2 class="discipline-title mb-4">
              <i class="bi bi-tag-fill me-2"></i> {{ group.name }}
            </h2>

            <p class="lead mb-4 text-light-emphasis">Liste des options de cotisation et d'inscription pour la
              discipline.</p>

            <ul class="tarif-list list-unstyled">
              <li v-for="tarif in group.tarifs" :key="tarif.tarifId" class="tarif-item">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="tarif-details me-3">
                    <h5 class="item-nom text-light">{{ tarif.nom }}</h5>
                    <p class="item-description small m-0">{{ tarif.periodicite || 'Option de tarif standard.' }}</p>
                  </div>
                  <div class="tarif-prix text-end">
                    <span class="priceAmount display-6 fw-bold text-warning">{{ tarif.montant || '???' }} €</span>

                  </div>
                </div>
              </li>
            </ul>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

/* --- SECTIONS DE DISCIPLINE (remplacement des cartes individuelles) --- */

.discipline-section-card {
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  width: 100%;
}

.discipline-title {
  font-size: 2.2rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #ffc107;
  /* Jaune principal */
  border-bottom: 2px solid;
  /* La couleur de la bordure est définie par la classe de discipline */
  padding-bottom: 1rem;
}

.tarif-list {
  margin-top: 2rem;
  padding-left: 0;
}

.tarif-item {
  padding: 1rem 0;
  border-bottom: 1px dashed #333;
  transition: background-color 0.3s ease;
}

.tarif-item:last-child {
  border-bottom: none;
}

.tarif-item:hover {
  background-color: #2c3034;
  /* Léger survol pour l'interactivité */
  border-radius: 4px;
  padding-left: 10px;
  padding-right: 10px;
}

.item-nom {
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.item-description {
  color: #a0a0a0;
}

/* --- COULEURS SPÉCIFIQUES AUX DISCIPLINES --- */
/* (La couleur de la bordure du titre change en fonction de la discipline) */

/* Judo */
.section-discipline-judo .discipline-title {
  border-color: #d32f2f;
}

.section-discipline-judo:hover {
  box-shadow: 0 4px 20px rgba(211, 47, 47, 0.3);
}

/* Aïkido */
.section-discipline-aïkido .discipline-title {
  border-color: #1976d2;
}

.section-discipline-aïkido:hover {
  box-shadow: 0 4px 20px rgba(25, 118, 210, 0.3);
}

/* Jujitsu */
.section-discipline-jujitsu .discipline-title {
  border-color: #388e3c;
}

.section-discipline-jujitsu:hover {
  box-shadow: 0 4px 20px rgba(56, 142, 60, 0.3);
}

/* Judo détente */
.section-discipline-judo-détente .discipline-title {
  border-color: #fbc02d;
}

.section-discipline-judo-détente:hover {
  box-shadow: 0 4px 20px rgba(251, 192, 45, 0.3);
}

/* Général/Inconnu */
.section-discipline-general .discipline-title,
.section-discipline-inconnu .discipline-title {
  border-color: #757575;
}

.section-discipline-general:hover,
.section-discipline-inconnu:hover {
  box-shadow: 0 4px 20px rgba(117, 117, 117, 0.3);
}
</style>
