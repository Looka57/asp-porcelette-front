<script setup>
// La liste de données à afficher (userList de la vue parent)
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
        // Utilise l'API de date native pour formater
        const date = new Date(dateString);
        // 'fr-FR' pour le français, options pour afficher le jour, le mois en entier, et l'année
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long', // ou 'short', ou 'numeric'
            day: 'numeric'
        });
    } catch (e) {
        console.error("Erreur de formatage de date :", e);
        return 'Date invalide';
    }
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
        <tr v-for="(user, index) in userList" :key="user.userId">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ user.photoUrl }}</td>
          <td>{{ user.nom }}</td>
          <td>{{ user.prenom }}</td>
          <td>{{ user.email || 'N/A' }}</td>
          <td>{{ user.telephone || 'N/A' }}</td>
          <td>{{ user.rueEtNumero || 'N/A' }}</td>
          <td>{{ user.ville || 'N/A' }}</td>
          <td>{{ user.statut || 'N/A' }}</td>
          <td>{{formatDate(user.dateAdhesion) || 'N/A' }}</td>

       <td>{{ getDisciplineName(user.disciplineId) }}</td>
          <td>
            <button class="btn btn-outline-info m-3 " @click="$emit('edit', user)">
              <i class="pi pi-pencil"></i>
            </button>
            <button class="btn btn-outline-danger" @click="$emit('delete', user.userId)">
              <i class="pi pi-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
