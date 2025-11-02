<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted, computed } from 'vue';
import api from '@/api/axios';
import CreateLicencierModal from '@/components/Licencies/CreateLicencierModal.vue';


// ===============================
// 🔹 VARIABLES RÉACTIVES
// ===============================
const userList = ref([]);
const disciplineList = ref([]);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const selectedUser = ref(null);


// ===============================
// 🔹 CONSTANTES D'API
// ===============================
const API_LICENCIE = '/User/admin/list';
const API_DISCIPLINE = '/Discipline';
const API_UPDATE = '/User/admin/update';
const API_DELETE = '/User/admin';


// ===============================
// 🔹 COMPUTED : Fusion utilisateurs + discipline
// ===============================
const userListWithDiscipline = computed(() => {
  return userList.value.map(user => {
    const discipline = disciplineList.value.find(d => d.disciplineId === user.disciplineId);
    return {
      ...user,
      disciplineName: discipline ? discipline.nom : 'N/A'
    };
  });
});


// ===============================
// 🔹 CHARGEMENT DES LICENCIÉS
// ===============================
const fetchLicencie = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await api.get(API_LICENCIE);
    const allUsers = response.data || [];
    userList.value = allUsers.filter(user => user.roles.includes('Adherent'));
  } catch (err) {
    console.error(err);
    error.value = 'Échec du chargement de la liste des licenciés.';
  } finally {
    loading.value = false;
  }
};


// ===============================
// 🔹 CHARGEMENT DES DISCIPLINES
// ===============================
const fetchDiscipline = async () => {
  try {
    const response = await api.get(API_DISCIPLINE);
    disciplineList.value = response.data || [];
  } catch (err) {
    console.error('Erreur de chargement des disciplines :', err);
  }
};


// ===============================
// 🔹 OUVERTURE DU MODAL
// ===============================
const openModal = (user = null) => {
  selectedUser.value = user; // null → création, user → édition
  showModal.value = true;
};


// ===============================
// 🔹 MISE À JOUR D'UN ADHÉRENT
// ===============================
const updateAdherent = async (updatedUser) => {
  try {
    await api.put(`${API_UPDATE}/${updatedUser.userId}`, updatedUser);
    fetchLicencie(); // Rafraîchir la liste après modification
  } catch (err) {
    console.error('Erreur lors de la mise à jour :', err);
  }
};


// ===============================
// 🔹 SUPPRESSION D'UN ADHÉRENT
// ===============================
const deleteAdherent = async (userId, nom, prenom) => {
  // ⚠️ Demande de confirmation avant de supprimer
  if (!confirm(`Êtes-vous sûr de vouloir supprimer l'adhérent ${prenom} ${nom} ? Cette action est irréversible.`)) {
    return;
  }

  try {
    // Envoi de la requête DELETE
    await api.delete(`${API_DELETE}/${userId}`);

    // Rafraîchissement de la liste et notification
    fetchLicencie();
    alert(`L'adhérent ${prenom} ${nom} a été supprimé avec succès.`);
  } catch (err) {
    console.error('Erreur lors de la suppression :', err);
    alert('Erreur lors de la suppression de l\'adhérent. Vérifiez la console.');
    // Si erreur 404, on force un refresh
    fetchLicencie();
  }
};


// ===============================
// 🔹 FORMATAGE DE LA DATE
// ===============================
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


// ===============================
// 🔹 MONTAGE DU COMPOSANT
// ===============================
onMounted(() => {
  fetchLicencie();
  fetchDiscipline();
});
</script>


<!-- ===============================
     🔹 TEMPLATE
=============================== -->
<template>
  <div class="container-fluid bg-dark text-white min-h-screen p-4">
    <h1 class="m-3 text-center">Liste des Licenciés</h1>

    <!-- 🔸 Bouton création -->
    <button
      class="mb-3 btn btn-outline-warning d-flex align-items-center"
      @click="openModal(null)" >
      <i class="pi pi-plus-circle me-2"></i> Ajout Adhérent
    </button>

    <!-- 🔸 États de chargement -->
    <div v-if="loading" class="text-secondary">Chargement...</div>
    <div v-else-if="error" class="text-danger">{{ error }}</div>

    <!-- 🔸 Liste des adhérents -->
    <div v-else>
      <div v-if="userList.length === 0" class="text-light p-4 border rounded">
        Aucun Adhérent trouvé.
      </div>

      <div v-else class="table-responsive text-center">
        <table class="table table-dark table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th>Ville</th>
              <th>Statut</th>
              <th>Discipline</th>
              <th>Date d'inscription</th>
              <th style="width: 400px;">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(user, index) in userListWithDiscipline" :key="user.userId">
              <th>{{ index + 1 }}</th>
              <td>{{ user.nom }}</td>
              <td>{{ user.prenom }}</td>
              <td>{{ user.email || 'N/A' }}</td>
              <td>{{ user.telephone || 'N/A' }}</td>
              <td>{{ user.rueEtNumero || 'N/A' }}</td>
              <td>{{ user.ville || 'N/A' }}</td>
              <td>{{ user.statut || 'N/A' }}</td>
              <td>{{ user.disciplineName || 'N/A' }}</td>
              <td>{{ formatDate(user.dateAdhesion) || 'N/A' }}</td>

              <td>
                <!-- 🔸 Boutons d’action -->
                <button class="btn btn-outline-info mx-2" @click="openModal(user)">
                  <i class="pi pi-pencil"></i> Modifier
                </button>
                <button
                  class="btn btn-outline-danger"
                  @click="deleteAdherent(user.userId, user.nom, user.prenom)">
                  <i class="pi pi-trash"></i> Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 🔸 Modal -->
    <CreateLicencierModal
      :show="showModal"
      :disciplineList="disciplineList"
      :user="selectedUser"
      @close="showModal = false"
      @refresh="fetchLicencie"
      @update-user="updateAdherent"
    />
  </div>
</template>
