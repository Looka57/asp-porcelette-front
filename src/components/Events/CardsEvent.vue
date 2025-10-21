<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue'
import api from '@/api/axios';
import CardsModalEvent from './CardsModalEvent.vue';
import CreateEventModal from './CreateEventModal.vue';
import EditEventModal from './EditEventModal.vue';

// ===============================
// 🔹 ÉTATS & COMMUNICATION
// ===============================
const events = ref([]);                     // Liste des événements récupérés depuis l’API
const disciplineMap = ref({});              // Association ID → Nom de discipline
const typeEventMap = ref({});               // Association ID → Nom du type d’événement
const isModalOpen = ref(false);             // État d’ouverture de la modale de DÉTAIL
const selectedEvent = ref(null);            // Détails de l’événement sélectionné
const eventToDelete = ref(null);            // ID de l’événement en attente de suppression
const isCreateModalOpen = ref(false);       // État de la modale de CRÉATION
const eventToEdit = ref(null);
const isEditModalOpen = ref(false);

// ===============================
// 🔹 CONSTANTES D’API
// ===============================
const API_PATH_EVENT = '/Evenement';
const API_PATH_DISCIPLINE = '/Discipline';
const API_PATH_TYPE_EVENEMENT = '/TypeEvenement';

// ===============================
// 🔹 LOGIQUE CRUD : MODIFICATION (UPDATE)
// ===============================

function openEditModal(event) {
  eventToEdit.value = { ...event };
  isEditModalOpen.value = true;
  cancelDelete();
}

function handleEventUpdated(updatedEvent) {
  isEditModalOpen.value = false;
  const index = events.value.findIndex(e => Number(e.evenementId) === Number(updatedEvent.evenementId));
  if (index !== -1) {
    events.value[index] = updatedEvent;
    console.log(`Événement ${updatedEvent.evenementId} mis à jour dans la liste locale.`);
  }
  eventToEdit.value = null;
}

// ===============================
// 🔹 LOGIQUE CRUD : SUPPRESSION
// ===============================

/**
 * Prépare la suppression en affichant la confirmation sur la carte.
 */
function confirmDelete(id) {
  eventToDelete.value = Number(id);
}

/**
 * Annule la demande de suppression.
 */
function cancelDelete() {
  eventToDelete.value = null;
}

/**
 * Supprime un événement après confirmation.
 */
async function deleteEvent(id) {
  if (!id) return;

  try {
    // 1️⃣ Appel de l’API DELETE
    await api.delete(`${API_PATH_EVENT}/${id}`);
    console.log(`Événement ${id} supprimé avec succès.`);

    // 2️⃣ Mise à jour locale sans refetch complet
    events.value = events.value.filter(e => Number(e.evenementId) !== Number(id));

  } catch (error) {
    console.error(`Erreur lors de la suppression de l'événement ${id}:`, error);
  } finally {
    // 3️⃣ Nettoyage de l’état de confirmation
    eventToDelete.value = null;
  }
}


// ===============================
// 🔹 LOGIQUE MODALE : DÉTAIL
// ===============================

/**
 * Ouvre la modale avec les détails complets de l’événement.
 */
function showDetails(event) {
  console.log('📥 Event reçu dans showDetails:', event);

  const disciplineIdNumber = Number(event.disciplineId || 0);
  const typeEvenementId = event.typeEvenement?.typeEvenementId || event.typeEvenementId || 0;

  selectedEvent.value = {
    evenementId: event.evenementId,
    titre: event.titre,
    dateDebut: event.dateDebut,
    dateFin: event.dateFin,
    lieu: event.lieu,
    description: event.description,
    disciplineId: event.disciplineId,
    imageUrl: event.imageUrl,
    typeEvenementId: typeEvenementId,
    nom: disciplineMap.value[disciplineIdNumber] || 'Inconnu',
  };

  console.log('✅ selectedEvent.typeEvenementId:', selectedEvent.value.typeEvenementId);

  cancelDelete();
  isModalOpen.value = true;
  document.body.style.overflow = 'hidden';
}


// ===============================
// 🔹 OUTILS D’AFFICHAGE
// ===============================

/**
 * Formate une date pour l’affichage (fr-FR).
 */
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

/**
 * Gestion du rafraîchissement après création d’un événement.
 */
function handleEventAdded(newEvent) {
  console.log("Nouvel événement ajouté et rafraîchissement de la liste.", newEvent);
  events.value.push(newEvent);
  isCreateModalOpen.value = false;
}


// ===============================
// 🔹 REQUÊTES API (FETCH)
// ===============================

/**
 * Récupère la liste des disciplines depuis l’API.
 */
async function fetchDisciplines() {
  try {
    const reponse = await api.get(API_PATH_DISCIPLINE);
    const map = {};

    reponse.data.forEach(d => {
      let id = d.DisciplineId ?? d.disciplineId;
      if (id !== undefined && d.nom !== undefined) {
        map[Number(id)] = d.nom;
      } else {
        console.warn('Discipline invalide:', d);
      }
    });

    disciplineMap.value = map;
  } catch (error) {
    console.error('Erreur lors de la récupération des disciplines:', error);
  }
}

/**
 * Récupère la liste des événements depuis l’API.
 */
async function fetchEvent() {
  try {
    const reponse = await api.get(API_PATH_EVENT);
    events.value = reponse.data;
  } catch {
    console.error('Erreur lors de la récupération des événements');
  }
}

/**
 * Récupère la liste des types d’événements.
 */
async function fetchEventTypes() {
  try {
    const response = await api.get(API_PATH_TYPE_EVENEMENT);
    console.log('🔍 Premier événement complet:', response.data[0]);
    console.log('🔍 Réponse API TypeEvenement:', response.data);

    const map = {};

    response.data.forEach(t => {
      const id = t.TypeEvenementId ?? t.typeEvenementId;
      const nom = t.libelle ?? t.Libelle ?? t.libele ?? t.Libele ?? `Type #${id}`;
      if (id !== undefined) {
        map[Number(id)] = nom;
        console.log(`✅ Type ajouté: ${id} -> ${nom}`);
      } else {
        console.warn('TypeEvenement sans ID valide:', t);
      }
    });

    typeEventMap.value = map;
    console.log('✅ typeEventMap final:', typeEventMap.value);

  } catch (error) {
    console.error('Erreur lors de la récupération des types d\'événements:', error);
  }
}


// ===============================
// 🔹 ICONES DE DISCIPLINE
// ===============================

const disciplineIcons = {
  2: 'https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-judo-sport-fitness-vol3-microdots-premium-microdot-graphic.png', // Judo
  3: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-aikido-martial-arts-flaticons-lineal-color-flat-icons-3.png', // Aïkido
  4: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-judo-martial-arts-flaticons-lineal-color-flat-icons-3.png', // Jujitsu
};

/**
 * Retourne l’URL d’icône selon l’ID de discipline.
 */
function getIconUrl(disciplineId) {
  const defaultIcon = 'https://img.icons8.com/ios-filled/64/ffffff/star.png';
  return disciplineIcons[disciplineId] || defaultIcon;
}

// ===============================
// 🔹 MONTAGE DU COMPOSANT
// ===============================
onMounted(() => {
  fetchDisciplines();
  fetchEvent();
  fetchEventTypes();
});
</script>

<!-- ===============================
    🔹 TEMPLATE (HTML)
  =============================== -->
<template>
  <div class="container-fluid">

    <!-- ===============================
      🔸 SECTION : Liste des cartes d'événements
      =============================== -->
    <div class="bg-warm p-2 rounded">
      <div v-if="events.length === 0" class="text-center p-5">
        <p>Chargement des événements...</p>
      </div>

      <div v-else class="row g-4 mb-5">
        <div class="col-lg-4 col-md-6 col-lg-4" v-for="event in events" :key="event.id">
          <div class="cards text-white p-3 rounded h-100 d-flex flex-column align-items-center justify-content-center">
            <!-- Icône discipline -->
            <img width="64" height="64" :src="getIconUrl(event.disciplineId)"
              :alt="'Icône Discipline ' + event.disciplineId" />
            <h4>{{ event.titre }}</h4>
            <p>{{ formatDate(event.dateDebut) }}</p>

            <!-- Boutons d’action -->
            <div class="d-flex gap-2">
              <!-- Confirmation de suppression -->
              <template v-if="Number(eventToDelete) === Number(event.evenementId)">
                <span class="text-danger p-2">Êtes-vous sûr ?</span>
                <button class="btn btn-danger" @click="deleteEvent(event.evenementId)">Oui</button>
                <button class="btn btn-secondary" @click="cancelDelete">Non</button>
              </template>

              <!-- État normal -->
              <template v-else>
                <button class="btn btn-outline-info" @click="showDetails(event)">Voir Détail</button>
                <button class="btn btn-outline-success" @click="openEditModal(event)">Modifier</button>
                <button class="btn btn-outline-danger" @click="confirmDelete(event.evenementId)">Supprimer</button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ===============================
🔸 MODALES
=============================== -->
  <!-- Modale de Détail -->
  <CardsModalEvent v-model="isModalOpen" :event="selectedEvent" :disciplineMap="disciplineMap"
    :typeEventMap="typeEventMap" />
  <!-- Modale de Création -->
  <CreateEventModal v-model="isCreateModalOpen" :disciplineMap="disciplineMap" @event-added="handleEventAdded" />
  <!-- Modale d'Edition -->
  <EditEventModal v-model="isEditModalOpen" :eventData="eventToEdit" :disciplineMap="disciplineMap" :typeEventMap="typeEventMap" @event-updated="handleEventUpdated" />



</template>

<!-- ===============================
🔹 STYLES CSS
=============================== -->
<style scoped>
.cards {
  background-color: #343a40;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  background-color: #343a40 !important;
}
</style>
