
<script setup>

const API_BASE_URL = 'http://localhost:8080';
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
          <th scope="col" class="d-none d-md-table-cell">#</th>
          <th scope="col" class="d-none d-md-table-cell">Photo</th>

          <th scope="col">Nom</th>
          <th scope="col">Prénom</th>

          <th scope="col" class="d-none d-md-table-cell">Email</th>
          <th scope="col" class="d-none d-md-table-cell">Téléphone</th>
          <th scope="col" class="d-none d-md-table-cell">Adresse</th>
          <th scope="col" class="d-none d-md-table-cell">Ville</th>
          <th scope="col" class="d-none d-md-table-cell">Statut</th>
          <th scope="col" class="d-none d-md-table-cell">Date Inscriptions</th>
          <th scope="col" class="d-none d-md-table-cell">Discipline</th>

          <th scope="col" style="width: 150px;">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in userList" :key="user.userId || user.id">

          <th scope="row" class="d-none d-md-table-cell">{{ index + 1 }}</th>
          <td class="d-none d-md-table-cell">
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

          <td class="d-none d-md-table-cell">{{ user.email || 'N/A' }}</td>
          <td class="d-none d-md-table-cell">{{ user.telephone || 'N/A' }}</td>
          <td class="d-none d-md-table-cell">{{ user.rueEtNumero || 'N/A' }}</td>
          <td class="d-none d-md-table-cell">{{ user.ville || 'N/A' }}</td>
          <td class="d-none d-md-table-cell">{{ user.statut || 'N/A' }}</td>
          <td class="d-none d-md-table-cell">{{ formatDate(user.dateAdhesion) || 'N/A' }}</td>
          <td class="d-none d-md-table-cell">{{ getDisciplineName(user.disciplineId) }}</td>

          <td>
            <div class="d-flex justify-content-center">
                <button class="btn btn-outline-info btn-sm me-2" @click="$emit('edit', user)" title="Éditer">
                  <i class="pi pi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm" @click="$emit('delete', user.userId || user.id)" title="Supprimer">
                  <i class="pi pi-trash"></i>
                </button>
            </div>
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
