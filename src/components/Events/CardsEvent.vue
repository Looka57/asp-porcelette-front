<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios';
import CardsModalEvent from './CardsModalEvent.vue';
import CreateEventModal from './CreateEventModal.vue'; // Import de la modale de création


// --------------------
// COMMUNICATION & ÉTATS
// --------------------
const events = ref([]);
const disciplineMap = ref({}); // Carte dynamique { id: nom_discipline }
const typeEventMap =ref({});
const isModalOpen = ref(false); // État ouvert/fermé de la modale de DÉTAIL
const selectedEvent = ref(null); // Pour stocker les détails de l'événement
// L'ID est initialisé à null, mais contiendra une string (l'ID de l'événement) si une confirmation est demandée.
const eventToDelete = ref(null);

// >>> AJOUT N°1 : État pour la modale de CRÉATION
// L'état est conservé pour la fonction handleEventAdded, mais n'est pas utilisé pour l'ouverture si Bootstrap est la source principale.
const isCreateModalOpen = ref(false);


const API_PATH_EVENT = '/Evenement';
const API_PATH_DISCIPLINE = '/Discipline';
const API_PATH_TYPE_EVENEMENT = '/TypeEvenement'


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
// LOGIQUE MODALE DÉTAIL (existante)
// --------------------
function showDetails(event) {
  const disciplineIdNumber = Number(event.disciplineId || 0);
  const typeIdNumber = Number(event.typeEvenementId || 0);

  console.log('🎯 IDs:', { disciplineIdNumber, typeIdNumber });
  console.log('🗺️ Maps:', { disciplineMap: disciplineMap.value, typeEventMap: typeEventMap.value });

  selectedEvent.value = {
    ...event, // Garde TOUTES les propriétés originales
    nom: disciplineMap.value[disciplineIdNumber] || 'Inconnu',
    type: typeEventMap.value[typeIdNumber] || 'Non spécifié',
  };

  console.log('📤 selectedEvent:', selectedEvent.value);

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


function handleEventAdded(newEvent) {
    console.log("Nouvel événement ajouté et rafraîchissement de la liste.", newEvent);
    events.value.push(newEvent);
    isCreateModalOpen.value = false;
}


// --------------------
// LOGIQUE FETCH
// --------------------
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

async function fetchEventTypes() {
  try {
    const response = await api.get(API_PATH_TYPE_EVENEMENT);
     console.log('🔍 Premier événement complet:', response.data[0]);
    console.log('🔍 Réponse API TypeEvenement:', response.data); // DEBUG
    const map = {};

    response.data.forEach(t => {
      // ⚠️ CORRECTION : gérer toutes les variations de casse
      let id = t.TypeEvenementId ?? t.typeEvenementId;
      let nom = t.libelle ?? t.Libelle ?? t.libele ?? t.Libele ?? `Type #${id}`;

      if (id !== undefined) {
        map[Number(id)] = nom;
        console.log(`✅ Type ajouté: ${id} -> ${nom}`); // DEBUG
      } else {
        console.warn('TypeEvenement sans ID valide:', t);
      }
    });
    typeEventMap.value = map;
    console.log('✅ typeEventMap final:', typeEventMap.value); // DEBUG
  } catch (error) {
    console.error('Erreur lors de la récupération des types d\'événements:', error);
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
  fetchEventTypes();
});


</script>

<template>
  <div class="container-fluid">

    <!-- Section des cartes d'événements -->
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
  </div>

  <!-- MODALES -->

  <CardsModalEvent v-model="isModalOpen" :event="selectedEvent" :disciplineMap="disciplineMap" :typeEventMap="typeEventMap" />
  <CreateEventModal
    v-model="isCreateModalOpen"
    :disciplineMap="disciplineMap"
    @event-added="handleEventAdded"
  />
</template>

<style scoped>
.cards {
  background-color: #343a40;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  /* Assombri pour le fond dark */
  background-color: #343a40 !important;
  /* bg-dark ou secondary */
}

/* Styles pour les liens de navigation (conservés de votre code) */

</style>
