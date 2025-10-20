<!-- // -------------------------
// IMPORTS
// ------------------------- -->
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

const API_PATH_EVENT = '/Evenement';
const API_PATH_DISCIPLINE = '/Discipline'; // Chemin API supposé pour les disciplines


/**
 * Transforme les données des événements pour inclure le nom de la discipline avant d'ouvrir la modale.
 * @param {object} event - L'objet événement brut de l'API.
 */
function showDetails(event) {
    // VÉRIFICATION RENFORCÉE DU TYPE ET DE LA VALEUR:
    // L'ID est déjà en minuscule ('disciplineId') dans l'objet event, mais on s'assure qu'il est bien un nombre.
    const disciplineIdNumber = event.disciplineId ? Number(event.disciplineId) : 0;

    // Recherche dans la carte. Si la recherche échoue, la valeur par défaut est 'Inconnu'.
    const disciplineName = disciplineMap.value[disciplineIdNumber] || 'Inconnu';

    selectedEvent.value = {
        ...event, // Copie toutes les propriétés existantes
        nom: disciplineName // Ajoute la propriété 'nom' pour la modale
    };

    // Ligne de débogage pour montrer la recherche
    console.log('--- SHOW DETAILS DEBUG ---');
    console.log('ID reçu de l\'événement:', event.disciplineId, '(Type:', typeof event.disciplineId, ')');
    console.log('ID recherché (Number):', disciplineIdNumber, '| Nom trouvé:', disciplineName);
    console.log('Détails de l\'événement envoyés à la modale:', selectedEvent.value);

    isModalOpen.value = true;
    // Empêche le défilement de l'arrière-plan
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

/**
 * Récupère les noms des disciplines et crée une carte de correspondance ID -> Nom.
 */
async function fetchDisciplines() {
    try {
        const reponse = await api.get(API_PATH_DISCIPLINE);
        const map = {};

        // Ligne de débogage pour afficher les données brutes
        console.log('--- DISCIPLINE API BRUTE DATA (fetchDisciplines) ---');
        console.log(reponse.data);
        console.log('----------------------------------------------------');

        reponse.data.forEach(d => {
            // Tentative 1 (ID majuscule)
            let id = d.DisciplineId;

            // Tentative 2 (ID minuscule) : Si la clé DisciplineId n'existe pas, on tente disciplineId
            if (id === undefined) {
                 id = d.disciplineId; // Nouvelle tentative avec la casse en minuscule
            }

            // Nous nous assurons que l'ID et le nom existent
            if (id !== undefined && d.nom !== undefined) {
                // IMPORTANT: Assurez-vous que la clé est un nombre
                map[Number(id)] = d.nom;
            } else {
                // Affichera un avertissement seulement si les données sont vraiment incomplètes
                console.warn('Discipline object missing a valid ID (DisciplineId or disciplineId) or nom:', d);
            }
        });
        disciplineMap.value = map;
        console.log('Carte des disciplines créée:', disciplineMap.value);
    } catch (error) {
        console.error('Erreur lors de la récupération des disciplines:', error);
        // Fallback: les événements utiliseront "Inconnu" comme nom de discipline
    }
}

/**
 * Récupère la liste des événements.
 */
async function fetchEvent() {
    try {
        const reponse = await api.get(API_PATH_EVENT);
        events.value = reponse.data;
        console.log('Données des événements récupérées :', events.value);
    } catch {
        console.error('Erreur lors de la récupération des événements');
    }
}

// NOTE: Cette map est conservée car elle contient les URLs des icônes.
const disciplineIcons = {
    2: 'https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-judo-sport-fitness-vol3-microdots-premium-microdot-graphic.png', // Judo
    3: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-aikido-martial-arts-flaticons-lineal-color-flat-icons-3.png', // Aïkido
    4: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-judo-martial-arts-flaticons-lineal-color-flat-icons-3.png', // Jujitsu
    // Ajoutez ici toutes les autres disciplines (3: 'url-karate.png', etc.)
};

// Fonction pour récupérer l'URL de l'icône
function getIconUrl(disciplineId) {
    const defaultIcon = 'https://img.icons8.com/ios-filled/64/ffffff/star.png';
    return disciplineIcons[disciplineId] || defaultIcon;
}

onMounted(() => {
    // Récupérer les disciplines en premier, puis les événements
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
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-info" @click="showDetails(event)">Voir Détail</button>
                        <button class="btn btn-outline-danger">Supprimer</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <CardsModalEvent
        v-model="isModalOpen"
        :event="selectedEvent"
    />
</template>

<style scoped>
.cards {
    background-color: #343a40;
}
</style>
