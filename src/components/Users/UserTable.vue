
<script setup>

const API_BASE_URL = 'http://localhost:5070'; // 🟢 UTILISEZ LE PORT HTTP
// Définissez ce chemin après avoir déplacé l'image dans /public/img/
const DEFAULT_PHOTO_PATH = '/img/default-profile.png';

const { userList, getDisciplineName } = defineProps({
  userList: {
    type: Array,
    default: () => []
  },
  getDisciplineName: {
    type: Function,
    required: true
  }
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    console.error("Erreur de formatage de date :", e);
    return 'Date invalide';
  }
};

const getPhotoPath = (user) => {
    const photoPath = user.photoUrl;

    if (!photoPath || photoPath.length < 5) {
        // Retourne une image par défaut si le chemin est vide.
        return DEFAULT_PHOTO_PATH;
    }

    // Le nouveau chemin complet sera : https://localhost:7183/images/profiles/...
    return `${API_BASE_URL}${photoPath}`;
};

const handleImageError = (event) => {
  console.error('Erreur chargement image:', event.target.src);
  event.target.style.display = 'none';
};
</script>


<template>
  <div class="table-responsive">
    <table class="table table-dark table-striped table-hover align-middle text-center overflow-hidden">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Photo</th>
          <th scope="col">Nom</th>
          <th scope="col">Prénom</th>
          <th scope="col">Email</th>
          <th scope="col">Téléphone</th>
          <th scope="col">Adresse</th>
          <th scope="col">Ville</th>
          <th scope="col">Statut</th>
          <th scope="col">Date Inscriptions</th>
          <th scope="col">Discipline</th>
          <th scope="col" style="width: 250px;">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in userList" :key="user.userId || user.id">
          <th scope="row">{{ index + 1 }}</th>
          <td>
            <img
              v-if="getPhotoPath(user)"
              :src="getPhotoPath(user)"
              alt="Photo utilisateur"
              class="rounded-circle object-fit-cover"
              style="width: 60px; height: 60px;"
              @error="handleImageError" />
            <span v-else class="text-secondary">Aucune photo</span>
          </td>

          <td>{{ user.nom }}</td>
          <td>{{ user.prenom }}</td>
          <td>{{ user.email || 'N/A' }}</td>
          <td>{{ user.telephone || 'N/A' }}</td>
          <td>{{ user.rueEtNumero || 'N/A' }}</td>
          <td>{{ user.ville || 'N/A' }}</td>
          <td>{{ user.statut || 'N/A' }}</td>
          <td>{{ formatDate(user.dateAdhesion) || 'N/A' }}</td>
          <td>{{ getDisciplineName(user.disciplineId) }}</td>
          <td>
            <button class="btn btn-outline-info m-3" @click="$emit('edit', user)">
              <i class="pi pi-pencil"></i>
            </button>
            <button class="btn btn-outline-danger" @click="$emit('delete', user.userId || user.id)">
              <i class="pi pi-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<style scoped>
img.rounded-circle {
  border: 2px solid #ffc107;
}
</style>
