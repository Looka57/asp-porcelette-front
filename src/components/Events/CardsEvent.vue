<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api/axios';
import CardsModalEvent from './CardsModalEvent.vue';
import CreateEventModal from './CreateEventModal.vue';
import EditEventModal from './EditEventModal.vue';

const props = defineProps({
  filter: { type: String, default: 'Tous' } // "Tous", "À venir", "Archives", "Judo", etc.
});

const events = ref([]);
const disciplineMap = ref({});
const typeEventMap = ref({});
const isModalOpen = ref(false);
const selectedEvent = ref(null);
const eventToDelete = ref(null);
const isCreateModalOpen = ref(false);
const eventToEdit = ref(null);
const isEditModalOpen = ref(false);

const API_PATH_EVENT = '/Evenement';
const API_PATH_DISCIPLINE = '/Discipline';
const API_PATH_TYPE_EVENEMENT = '/TypeEvenement';

// -----------------------------
// 🔹 ÉVÉNEMENTS À VENIR (fixe)
// -----------------------------
const upcomingEvents = computed(() => {
  const now = new Date();
  return events.value
    .filter(e => new Date(e.dateDebut) > now)
    .sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut))
    .slice(0, 6); // limite à 5 cartes par exemple
});

// -----------------------------
// 🔹 ÉVÉNEMENTS FILTRÉS (dynamique selon filtre)
// -----------------------------
const filteredEvents = computed(() => {
  const now = new Date();
  let list = [...events.value];

  if (props.filter === 'À venir') list = list.filter(e => new Date(e.dateDebut) > now);
  else if (props.filter === 'Archives') list = list.filter(e => new Date(e.dateDebut) < now);
  else if (props.filter !== 'Tous') {
    // filtre par discipline
    list = list.filter(e => e.discipline?.nom?.toLowerCase().includes(props.filter.toLowerCase())
      || (e.disciplineId && disciplineMap.value[e.disciplineId]?.toLowerCase().includes(props.filter.toLowerCase()))
    );
  }

  // tri par date décroissante pour les archives ou discipline
  list.sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut));

  return list;
});

// Grouper par année/mois
function groupByYearMonth(list) {
  const grouped = {};
  for (const event of list) {
    const date = new Date(event.dateDebut);
    const year = date.getFullYear();
    const month = date.toLocaleString('fr-FR', { month: 'long' });
    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = [];
    grouped[year][month].push(event);
  }
  return grouped;
}

const groupedEvents = computed(() => groupByYearMonth(filteredEvents.value));

// -----------------------------
// 🔹 OUTILS
// -----------------------------
function formatDate(dateString) {
  if (!dateString) return 'Date inconnue';
  try { return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString)); }
  catch { return dateString; }
}

function getIconUrl(disciplineId) {
  const icons = {
    1: 'https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-judo-sport-fitness-vol3-microdots-premium-microdot-graphic.png',
    2: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-aikido-martial-arts-flaticons-lineal-color-flat-icons-3.png',
    3: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-jiu-jitsu-martial-arts-flaticons-lineal-color-flat-icons-3.png',
    4: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-judo-martial-arts-flaticons-lineal-color-flat-icons-3.png',
  };
  return icons[disciplineId] || 'https://img.icons8.com/ios-filled/64/ffffff/star.png';
}

// -----------------------------
// 🔹 CRUD MODAL
// -----------------------------
function showDetails(event) { selectedEvent.value = { ...event }; isModalOpen.value = true; document.body.style.overflow = 'hidden'; }
function openEditModal(event) { eventToEdit.value = { ...event }; isEditModalOpen.value = true; eventToDelete.value = null; }
function handleEventUpdated(updatedEvent) {
  isEditModalOpen.value = false;
  const index = events.value.findIndex(e => Number(e.evenementId) === Number(updatedEvent.evenementId));
  if (index !== -1) events.value[index] = updatedEvent;
  eventToEdit.value = null;
}
function confirmDelete(id) { eventToDelete.value = Number(id); }
function cancelDelete() { eventToDelete.value = null; }
async function deleteEvent(id) {
  if (!id) return;
  try { await api.delete(`${API_PATH_EVENT}/${id}`); events.value = events.value.filter(e => Number(e.evenementId) !== Number(id)); }
  catch (err) { console.error(err); }
  finally { eventToDelete.value = null; }
}
function handleEventAdded(newEvent) { events.value.push(newEvent); isCreateModalOpen.value = false; }

// -----------------------------
// 🔹 FETCH API
// -----------------------------
async function fetchDisciplines() { try { const r = await api.get(API_PATH_DISCIPLINE); const map = {}; r.data.forEach(d => { if (d.disciplineId) map[d.disciplineId] = d.nom; }); disciplineMap.value = map; } catch { console.error('Erreur fetchDisciplines'); } }
async function fetchEvents() { try { const r = await api.get(API_PATH_EVENT); events.value = r.data; } catch { console.error('Erreur fetchEvents'); } }
async function fetchEventTypes() { try { const r = await api.get(API_PATH_TYPE_EVENEMENT); const map = {}; r.data.forEach(t => { if (t.typeEvenementId) map[t.typeEvenementId] = t.libelle; }); typeEventMap.value = map; } catch { console.error('Erreur fetchEventTypes'); } }

onMounted(() => { fetchDisciplines(); fetchEvents(); fetchEventTypes(); });
</script>

<template>
  <div>

    <!-- ===============================
      🔹 ÉVÉNEMENTS À VENIR (toujours en haut)
    =============================== -->
    <div v-if="upcomingEvents.length > 0" class="mb-4">
      <h4 class="text-warning border-bottom pb-2">Événements à venir</h4>
      <div class="events-grid">
        <div v-for="event in upcomingEvents" :key="event.evenementId"
          class="event-card p-3 rounded text-white d-flex flex-column align-items-center">
          <img width="64" height="64" :src="getIconUrl(event.disciplineId)" />
          <h5 class="mt-2">{{ event.titre }}</h5>
          <p>{{ formatDate(event.dateDebut) }}</p>
          <p>{{ event.lieu }}</p>

          <div class="d-flex gap-2 flex-wrap justify-content-center mt-2">
            <template v-if="Number(eventToDelete) === Number(event.evenementId)">
              <span class="text-danger p-2">Êtes-vous sûr ?</span>
              <button class="btn btn-danger btn-sm" @click="deleteEvent(event.evenementId)">Oui</button>
              <button class="btn btn-secondary btn-sm" @click="cancelDelete">Non</button>
            </template>
            <template v-else>
              <button class="btn btn-outline-info btn-sm" @click="showDetails(event)">Voir Détail</button>
              <button class="btn btn-outline-success btn-sm" @click="openEditModal(event)">Modifier</button>
              <button class="btn btn-outline-danger btn-sm" @click="confirmDelete(event.evenementId)">Supprimer</button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- ===============================
      🔹 LISTE PRINCIPALE (Archives / filtre dynamique)
    =============================== -->
    <div v-for="(months, year) in groupedEvents" :key="year" class="mb-4">
      <h4 class="text-warning border-bottom pb-2">{{ year }}</h4>
      <div v-for="(events, month) in months" :key="month" class="mb-3">
        <details>
          <summary class="fw-bold text-light">{{ month }} ({{ events.length }} événement{{ events.length > 1 ? 's' : '' }})
          </summary>
          <div class="mt-2 ms-3 events-grid">
            <div v-for="event in events" :key="event.evenementId"
              class="event-card p-3 rounded text-white d-flex flex-column align-items-center">
              <img width="64" height="64" :src="getIconUrl(event.disciplineId)" />
              <h5 class="mt-2">{{ event.titre }}</h5>
              <p>{{ formatDate(event.dateDebut) }}</p>
              <div class="d-flex gap-2 flex-wrap justify-content-center mt-2">
                <template v-if="Number(eventToDelete) === Number(event.evenementId)">
                  <span class="text-danger p-2">Êtes-vous sûr ?</span>
                  <button class="btn btn-danger btn-sm" @click="deleteEvent(event.evenementId)">Oui</button>
                  <button class="btn btn-secondary btn-sm" @click="cancelDelete">Non</button>
                </template>
                <template v-else>
                  <button class="btn btn-outline-info btn-sm" @click="showDetails(event)">Voir Détail</button>
                  <button class="btn btn-outline-success btn-sm" @click="openEditModal(event)">Modifier</button>
                  <button class="btn btn-outline-danger btn-sm"
                    @click="confirmDelete(event.evenementId)">Supprimer</button>
                </template>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>

    <!-- MODALES -->
    <CardsModalEvent v-model="isModalOpen" :event="selectedEvent" :disciplineMap="disciplineMap"
      :typeEventMap="typeEventMap" />
    <CreateEventModal v-model="isCreateModalOpen" :disciplineMap="disciplineMap" @event-added="handleEventAdded" />
    <EditEventModal v-model="isEditModalOpen" :eventData="eventToEdit" :disciplineMap="disciplineMap"
      :typeEventMap="typeEventMap" @event-updated="handleEventUpdated" />
  </div>
</template>

<style scoped>
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.5rem;
}

.event-card {
  background-color: #343a40;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
