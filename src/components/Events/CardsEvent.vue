<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api/axios';
import CardsModalEvent from './CardsModalEvent.vue';
import CreateEventModal from './CreateEventModal.vue';
import EditEventModal from './EditEventModal.vue';

const props = defineProps({
  filter: { type: String, default: 'Tous' }
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

// ===============================
// 🔹 COULEURS DES DISCIPLINES
// ===============================
const disciplineColors = {
  'Judo': '#FF6384',
  'Aïkido': '#3B82F6',
  'Jujitsu': '#10B981',
  'Judo Détente': '#efd844',
};

// Fonction pour récupérer la couleur d'une discipline selon son nom ou son ID
function getDisciplineColor(disciplineId) {
  const name = disciplineMap.value[disciplineId];
  return disciplineColors[name] || '#ffc107'; // Jaune par défaut
}

// -----------------------------
// 🔹 ÉVÉNEMENTS À VENIR (fixe)
// -----------------------------
const upcomingEvents = computed(() => {
  const now = new Date();
  return events.value
    .filter(e => new Date(e.dateDebut) > now)
    .sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut))
    .slice(0, 6);
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
    list = list.filter(e => e.discipline?.nom?.toLowerCase().includes(props.filter.toLowerCase())
      || (e.disciplineId && disciplineMap.value[e.disciplineId]?.toLowerCase().includes(props.filter.toLowerCase()))
    );
  }

  list.sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut));
  return list;
});

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
  try { return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateString)); }
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
function showDetails(event) {
  if (document.activeElement) document.activeElement.blur();
  selectedEvent.value = { ...event };
  isModalOpen.value = true;
}

function openEditModal(event) {
  if (document.activeElement) document.activeElement.blur();
  eventToEdit.value = { ...event };
  isEditModalOpen.value = true;
  eventToDelete.value = null;
}

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
  try {
    await api.delete(`${API_PATH_EVENT}/${id}`);
    events.value = events.value.filter(e => Number(e.evenementId) !== Number(id));
  }
  catch (err) { console.error(err); }
  finally { eventToDelete.value = null; }
}

function handleEventAdded(newEvent) {
  events.value.push(newEvent);
  isCreateModalOpen.value = false;
}

// -----------------------------
// 🔹 FETCH API
// -----------------------------
async function fetchDisciplines() { try { const r = await api.get(API_PATH_DISCIPLINE); const map = {}; r.data.forEach(d => { if (d.disciplineId) map[d.disciplineId] = d.nom; }); disciplineMap.value = map; } catch { console.error('Erreur fetchDisciplines'); } }
async function fetchEvents() { try { const r = await api.get(API_PATH_EVENT); events.value = r.data; } catch { console.error('Erreur fetchEvents'); } }
async function fetchEventTypes() { try { const r = await api.get(API_PATH_TYPE_EVENEMENT); const map = {}; r.data.forEach(t => { if (t.typeEvenementId) map[t.typeEvenementId] = t.libelle; }); typeEventMap.value = map; } catch { console.error('Erreur fetchEventTypes'); } }

onMounted(() => { fetchDisciplines(); fetchEvents(); fetchEventTypes(); });
</script>

<template>
  <div class="events-container">

    <!-- ===============================
      🔹 ÉVÉNEMENTS À VENIR
    ================================ -->
    <div v-if="upcomingEvents.length > 0" class="mb-5">
      <div class="d-flex align-items-center gap-2 mb-3">
        <i class="pi pi-bolt text-warning fs-5"></i>
        <h4 class="text-white m-0 font-weight-bold">Événements à venir</h4>
      </div>
      <div class="events-grid">
        <div v-for="event in upcomingEvents" :key="event.evenementId"
          class="event-card p-4 rounded-3 text-white d-flex flex-column justify-content-between position-relative"
          :style="{ borderLeft: `3px solid ${getDisciplineColor(event.disciplineId)}` }">

          <div>
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div class="icon-box p-2 rounded-2">
                <img width="40" height="40" :src="getIconUrl(event.disciplineId)" />
              </div>
              <span class="badge bg-warning text-dark px-2 py-1 font-monospace">
                {{ formatDate(event.dateDebut) }}
              </span>
            </div>

            <h5 class="fw-bold mb-2 text-truncate-2">{{ event.titre }}</h5>
            <p class="text-light small mb-3 d-flex align-items-center gap-1">
              <i class="pi pi-map-marker text-warning"></i> {{ event.lieu || 'Lieu non spécifié' }}
            </p>
          </div>

          <!-- Actions -->
          <div class="card-footer-actions pt-3 border-top border-secondary border-opacity-25 mt-auto">
            <template v-if="Number(eventToDelete) === Number(event.evenementId)">
              <div class="text-center w-100">
                <span class="text-danger small d-block mb-2">Confirmer la suppression ?</span>
                <div class="d-flex justify-content-center gap-2">
                  <button class="btn btn-danger btn-sm px-3" @click="deleteEvent(event.evenementId)">Oui</button>
                  <button class="btn btn-secondary btn-sm px-3" @click="cancelDelete">Non</button>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="d-flex gap-2 justify-content-between w-100">
                <button class="btn btn-outline-light btn-sm flex-grow-1" @click="showDetails(event)">Détails</button>
                <button class="btn btn-outline-warning btn-sm" @click="openEditModal(event)" title="Modifier">
                  <i class="pi pi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm" @click="confirmDelete(event.evenementId)" title="Supprimer">
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </template>
          </div>

        </div>
      </div>
    </div>

    <!-- ===============================
      🔹 LISTE PRINCIPALE (Archives / Filtre compact)
    ================================ -->
    <div v-for="(months, year) in groupedEvents" :key="year" class="mb-3">
      <h5 class="text-warning border-bottom border-secondary border-opacity-50 pb-1 mb-2 fw-bold text-uppercase small tracking-wide">
        {{ year }}
      </h5>

      <div v-for="(eventsList, month) in months" :key="month" class="mb-2">
        <!-- Accordéon compact -->
        <details class="custom-details px-3 py-2 rounded-2">
          <summary class="text-light small cursor-pointer d-flex justify-content-between align-items-center">
            <span class="fw-semibold text-capitalize">{{ month }}</span>
            <span class="badge bg-secondary text-light rounded-pill px-2 py-0" style="font-size: 0.75rem;">
              {{ eventsList.length }}
            </span>
          </summary>

          <div class="mt-3 pb-2 events-grid">
            <div v-for="event in eventsList" :key="event.evenementId"
              class="event-card p-3 rounded-3 text-white d-flex flex-column justify-content-between position-relative"
              :style="{ borderLeft: `3px solid ${getDisciplineColor(event.disciplineId)}` }">

              <div>
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div class="icon-box p-2 rounded-2">
                    <img width="32" height="32" :src="getIconUrl(event.disciplineId)" />
                  </div>
                  <span class="badge bg-secondary text-light px-2 py-1 font-monospace" style="font-size: 0.75rem;">
                    {{ formatDate(event.dateDebut) }}
                  </span>
                </div>

                <h6 class="fw-bold mb-1">{{ event.titre }}</h6>
                <p class="text-muted small mb-2 d-flex align-items-center gap-1" style="font-size: 0.8rem;">
                  <i class="pi pi-map-marker text-warning"></i> {{ event.lieu || 'Lieu non spécifié' }}
                </p>
              </div>

              <!-- Actions -->
              <div class="card-footer-actions pt-2 border-top border-secondary border-opacity-25 mt-auto">
                <template v-if="Number(eventToDelete) === Number(event.evenementId)">
                  <div class="text-center w-100">
                    <span class="text-danger small d-block mb-1" style="font-size: 0.75rem;">Confirmer ?</span>
                    <div class="d-flex justify-content-center gap-2">
                      <button class="btn btn-danger btn-sm py-0 px-2 font-size-sm" @click="deleteEvent(event.evenementId)">Oui</button>
                      <button class="btn btn-secondary btn-sm py-0 px-2 font-size-sm" @click="cancelDelete">Non</button>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="d-flex gap-2 justify-content-between w-100">
                    <button class="btn btn-outline-light btn-sm flex-grow-1 py-1" style="font-size: 0.8rem;" @click="showDetails(event)">Détails</button>
                    <button class="btn btn-outline-warning btn-sm py-1 px-2" @click="openEditModal(event)" title="Modifier">
                      <i class="pi pi-pencil small"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm py-1 px-2" @click="confirmDelete(event.evenementId)" title="Supprimer">
                      <i class="pi pi-trash small"></i>
                    </button>
                  </div>
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
      :typeEventMap="typeEventMap" @event-updated="handleEventUpdated" @refresh="fetchEvents"/>
  </div>
</template>

<style scoped>
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.event-card {
  background-color: #1a1d24;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.icon-box {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.custom-details {
  background: #1e222a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.2s;
}

.custom-details[open] {
  background: #171a21;
}

summary {
  list-style: none;
  outline: none;
}

summary::-webkit-details-marker {
  display: none;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
