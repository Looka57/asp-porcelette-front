<!-- // -------------------------
// IMPORTS
// ------------------------- -->
<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios';

// --------------------
// Communication Parent <> Enfant (Props & Events)
// --------------------
const events = ref([]);
const API_PATH = '/Evenement';

function formatDate(dateString) {
  if (!dateString) return 'Date inconnue';
  try {
    // Crée un objet Date à partir de la chaîne (gère le format ISO)
    const date = new Date(dateString);

    // Options de formatage pour le style français
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };

    // Utilise Intl.DateTimeFormat pour un formatage localisé
    return new Intl.DateTimeFormat('fr-FR', options).format(date);

  } catch (error) {
    console.error("Erreur de formatage de date:", error);
    return dateString; // Retourne la date brute en cas d'erreur
  }
}

async function fetchEvent() {
  try {
    const reponse = await api.get(API_PATH);
    events.value = reponse.data;
    console.log('Données des événements récupérées :', events.value);
  } catch {
    console.error('Erreur lors de la récupération des événements');
  }
}

const disciplineIcons = {
  2: 'https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-judo-sport-fitness-vol3-microdots-premium-microdot-graphic.png', // Judo
  3: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-aikido-martial-arts-flaticons-lineal-color-flat-icons-3.png', // Aïkido
  4: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-judo-martial-arts-flaticons-lineal-color-flat-icons-3.png', // Jujitsu
  // Ajoutez ici toutes les autres disciplines (3: 'url-karate.png', etc.)
};

// 2. Fonction pour récupérer l'URL de l'icône
function getIconUrl(disciplineId) {
  // Si l'ID est trouvé dans la map, on retourne l'URL. Sinon, on retourne l'icône par défaut.
  const defaultIcon = 'https://img.icons8.com/ios-filled/64/ffffff/star.png';
  return disciplineIcons[disciplineId] || defaultIcon;
}

onMounted(() => {
  fetchEvent();
});

// Si tu veux que le parent te passe une donnée :
// const props = defineProps({
//   modelValue: {
//     type: String, // ou Number, Array, Object selon ton besoin
//     default: ''
//   }
// })

// // Si tu veux que l’enfant émette un événement au parent :
// const emit = defineEmits(['update:modelValue'])

// // Exemple : on modifie la valeur envoyée au parent
// function updateValue(newValue) {
//   emit('update:modelValue', newValue)
// }
// --------------------
// Chargement / rechargement des données
// --------------------

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
            <button class="btn btn-outline-info">Voir Détail</button>
            <button class="btn btn-outline-danger">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cards {
  background-color: #343a40;
}
</style>
