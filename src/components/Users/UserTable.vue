<script setup>
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
  let photoPath = user.photoUrl;

  if (!photoPath || photoPath.length < 5) {
    return DEFAULT_PHOTO_PATH;
  }

  if (photoPath.startsWith('//')) {
    photoPath = photoPath.substring(1);
  }

  if (!photoPath.startsWith('/')) {
    photoPath = '/' + photoPath;
  }

  if (window.location.hostname === 'localhost') {
    return `http://localhost:8080${photoPath}`;
  } else {
    return photoPath;
  }
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
          <th scope="col">Rôle(s)</th>
          <th scope="col" class="d-none d-md-table-cell">Coordonnées</th>
          <th scope="col" class="d-none d-md-table-cell">Ville</th>
          <!-- <th scope="col" class="d-none d-md-table-cell">Statut</th> -->
          <th scope="col" class="d-none d-md-table-cell">Date Inscriptions</th>
          <th scope="col" class="d-none d-md-table-cell">Discipline</th>
          <th scope="col" style="width: 150px;">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in userList" :key="user.userId || user.id">
          <th scope="row" class="d-none d-md-table-cell">{{ index + 1 }}</th>
          <td class="d-none d-md-table-cell">
            <img v-if="getPhotoPath(user)" :src="getPhotoPath(user)" alt="Photo utilisateur"
              class="rounded-circle object-fit-cover" style="width: 60px; height: 60px;" @error="handleImageError" />
            <span v-else class="text-secondary">Aucune photo</span>
          </td>

          <td>{{ user.nom }}</td>
          <td>{{ user.prenom }}</td>
          <td>
            <div class="roles-cell">
              <span v-for="role in user.roles" :key="role" class="role-badge"
                :class="`role-${role.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}`">
                {{ role }}
              </span>
              <span v-if="!user.roles?.length" class="text-secondary">
                Aucun rôle
              </span>
            </div>
          </td>

          <!-- Coordonnées regroupées : Email en haut, Téléphone en dessous -->
          <td class="d-none d-md-table-cell">
            <div class="text-light">{{ user.email || 'N/A' }}</div>
            <div class="text-secondary small">{{ user.telephone || 'N/A' }}</div>
          </td>

          <td class="d-none d-md-table-cell">{{ user.ville || 'N/A' }}</td>
          <!-- <td class="d-none d-md-table-cell">{{ user.statut || 'N/A' }}</td> -->
          <td class="d-none d-md-table-cell">{{ formatDate(user.dateAdhesion) || 'N/A' }}</td>
          <td class="d-none d-md-table-cell">{{ getDisciplineName(user.disciplineId) }}</td>

          <td>
            <div class="d-flex justify-content-center">
              <button class="btn btn-outline-info btn-sm me-2" @click="$emit('edit', user)" title="Éditer">
                <i class="pi pi-pencil"></i>
              </button>
              <button class="btn btn-outline-danger btn-sm" @click="$emit('delete', user.userId || user.id)"
                title="Supprimer">
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

.roles-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid transparent;
}

.role-admin {
  background: rgba(252, 225, 143, 0.384);
  border-color: rgba(255, 193, 7, 0.35);
  color: #ffc107;
}

.role-sensei {
  background: rgba(59, 131, 246, 0.295);
  border-color: rgba(107, 159, 241, 0.35);
  color: #3b82f6;
}

.role-comite {
  background: rgba(168, 85, 247, 0.12);
  border-color: rgba(168, 85, 247, 0.35);
  color: #a855f7;
}

.role-secretaire {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.35);
  color: #10b981;
}

.role-tresoriere {
  background: rgba(249, 115, 22, 0.12);
  border-color: rgba(249, 115, 22, 0.35);
  color: #f97316;
}
</style>
