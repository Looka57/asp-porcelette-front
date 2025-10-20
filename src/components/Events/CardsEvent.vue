<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios';
import CardsModalEvent from './CardsModalEvent.vue';


// --------------------
// COMMUNICATION & ÉTATS
// --------------------
const events = ref([]);
const disciplineMap = ref({}); // Carte dynamique { id: nom_discipline }
const isModalOpen = ref(false); // État ouvert/fermé de la modale
const selectedEvent = ref(null); // Pour stocker les détails de l'événement
// L'ID est initialisé à null, mais contiendra une string (l'ID de l'événement) si une confirmation est demandée.
const eventToDelete = ref(null);

const API_PATH_EVENT = '/Evenement';
const API_PATH_DISCIPLINE = '/Discipline'; // Chemin API supposé pour les disciplines


// --------------------
// LOGIQUE CRUD : DELETE
// --------------------

/**
 * Prépare la suppression en affichant l'interface de confirmation sur la carte.
 * @param {string|number} id - L'ID de l'événement à supprimer.
 */
function confirmDelete(id) {
  // Stocke l'ID de l'événement, converti en String pour une comparaison uniforme dans le template.
  eventToDelete.value = Number(id);
}

/**
 * Annule la demande de suppression (cache l'interface de confirmation).
 */
function cancelDelete() {
  eventToDelete.value = null;
}


/**
 * Exécute la suppression après confirmation via l'interface personnalisée.
 * @param {string|number} id - L'ID de l'événement à supprimer.
 */
async function deleteEvent(id) {
  if (!id) return;

  try {
    // 1. Appel de l'API DELETE
    await api.delete(`${API_PATH_EVENT}/${id}`);
    console.log(`Événement ${id} supprimé avec succès.`);
    // Afficher un message de succès ici si vous avez un système de notification personnalisé (pas window.alert)

    // 2. Mise à jour de la liste locale (sans re-télécharger toutes les données)
   events.value = events.value.filter(e => Number(e.evenementId) !== Number(id));

  } catch (error) {
    console.error(`Erreur lors de la suppression de l'événement ${id}:`, error);
    // Afficher un message d'erreur ici si l'API échoue.
  } finally {
    // Réinitialiser l'état de confirmation
    eventToDelete.value = null;
  }
}


// --------------------
// LOGIQUE FETCH & MODALE (existante)
// --------------------

function showDetails(event) {
  const disciplineIdNumber = event.disciplineId ? Number(event.disciplineId) : 0;
  const disciplineName = disciplineMap.value[disciplineIdNumber] || 'Inconnu';

  selectedEvent.value = {
    ...event, // Copie toutes les propriétés existantes
    nom: disciplineName // Ajoute la propriété 'nom' pour la modale
  };

  // S'assurer que la confirmation est cachée si on ouvre les détails
  cancelDelete();

  isModalOpen.value = true;
  document.body.style.overflow = 'hidden';
}

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

async function fetchDisciplines() {
  try {
    const reponse = await api.get(API_PATH_DISCIPLINE);
    const map = {};

    reponse.data.forEach(d => {
      let id = d.DisciplineId;

      if (id === undefined) {
        id = d.disciplineId; // Nouvelle tentative avec la casse en minuscule
      }

      if (id !== undefined && d.nom !== undefined) {
        map[Number(id)] = d.nom;
      } else {
        console.warn('Discipline object missing a valid ID (DisciplineId or disciplineId) or nom:', d);
      }
    });
    disciplineMap.value = map;
  } catch (error) {
    console.error('Erreur lors de la récupération des disciplines:', error);
  }
}

async function fetchEvent() {
  try {
    const reponse = await api.get(API_PATH_EVENT);
    events.value = reponse.data;
  } catch {
    console.error('Erreur lors de la récupération des événements');
  }
}

const disciplineIcons = {
  2: 'https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-judo-sport-fitness-vol3-microdots-premium-microdot-graphic.png', // Judo
  3: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-aikido-martial-arts-flaticons-lineal-color-flat-icons-3.png', // Aïkido
  4: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-judo-martial-arts-flaticons-lineal-color-flat-icons-3.png', // Jujitsu
};

function getIconUrl(disciplineId) {
  const defaultIcon = 'https://img.icons8.com/ios-filled/64/ffffff/star.png';
  return disciplineIcons[disciplineId] || defaultIcon;
}

onMounted(() => {
  fetchDisciplines();
  fetchEvent();
});


</script>

<template>
  <div class="bg-warm p-2 rounded">
    <div v-if="events.length === 0" class="text-center p-5">
      <p>Chargement des événements...</p>
    </div>
    <div v-else class="row g-4 mb-5">
      <div class="col-lg-4 col-md-6 col-lg-4" v-for="event in events" :key="event.id">
        <div class="cards text-white p-3 rounded h-100 d-flex flex-column align-items-center justify-content-center">
          <img width="64" height="64" :src="getIconUrl(event.disciplineId)"
            :alt="'Icône Discipline ' + event.disciplineId" />
          <h4>{{ event.titre }}</h4>
          <p>{{ formatDate(event.dateDebut) }}</p>

          <!-- Boutons d'Action -->
          <div class="d-flex gap-2">
            <!-- VÉRIFICATION CORRIGÉE : Afficher le mode confirmation UNIQUEMENT si l'ID de l'événement correspond à l'ID en attente de suppression. -->
            <template v-if="Number(eventToDelete) === Number(event.evenementId)">
              <span class="text-danger p-2">Êtes-vous sûr ?</span>
              <button class="btn btn-danger" @click="deleteEvent(event.evenementId)">
                Oui
              </button>
              <button class="btn btn-secondary" @click="cancelDelete">Non</button>
            </template>

            <!-- État Normal -->
            <template v-else>
              <button class="btn btn-outline-info" @click="showDetails(event)">
                Voir Détail
              </button>
              <button class="btn btn-outline-danger" @click="confirmDelete(event.evenementId)">
                Supprimer
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>

  <CardsModalEvent v-model="isModalOpen" :event="selectedEvent" />
</template>

<style scoped>
.cards {
  background-color: #343a40;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  /* Assombri pour le fond dark */
  background-color: #343a40 !important;
  /* bg-dark ou secondary */
}
</style>
