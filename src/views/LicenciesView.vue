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
const searchTerm = ref('');

const activeAccordion = ref(null);

// ===============================
// 🔹 CONSTANTES D'API
// ===============================
const API_LICENCIE = '/User/admin/list';
const API_DISCIPLINE = '/Discipline';
const API_UPDATE = '/User/admin/update';
const API_DELETE = '/User/admin';

// ===============================
// 🔹 FUSION UTILISATEURS + DISCIPLINE
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
// 🔹 UTILISATEURS GROUPÉS PAR DISCIPLINE
// ===============================
const groupedUsersByDiscipline = computed(() => {
  const groups = {};
  disciplineList.value.forEach(d => {
    groups[d.nom] = filteredUserList.value.filter(u => u.disciplineName === d.nom);
  });
  return groups;
});


// ===============================
// 🔹 FILTRE GLOBAL DES UTILISATEURS
// ===============================
const filteredUserList = computed(() => {
  // Si la recherche est vide, on retourne la liste complète des utilisateurs fusionnés.
  if (!searchTerm.value) {
    return userListWithDiscipline.value;
  }

  const searchLower = searchTerm.value.toLowerCase();

  return userListWithDiscipline.value.filter(user => {
    // Recherche dans le Nom, Prénom, Email, Téléphone, et Discipline.
    return (
      (user.nom && user.nom.toLowerCase().includes(searchLower)) ||
      (user.prenom && user.prenom.toLowerCase().includes(searchLower)) ||
      (user.ville && user.ville.toLowerCase().includes(searchLower)) ||
      (user.telephone && user.telephone.includes(searchLower))
    );
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
// 🔹 LOGIQUE DE RENOUVELLEMENT
// ===============================
const API_RENEW = '/User/admin/renouvellement'; // Nouvelle constante API

const renewAdhesion = async (userId, nom, prenom) => {
  if (!confirm(`Êtes-vous sûr de vouloir renouveler l'adhésion de ${prenom} ${nom} à la date d'aujourd'hui ?`)) {
    return;
  }

  try {
    // L'API est une POST qui prend l'ID dans l'URL
    const response = await api.post(`${API_RENEW}/${userId}`);

    const message = response.data?.Message || 'Renouvellement réussi';
    const nouvelleDate = response.data?.NouvelleDateRenouvellement || 'Date inconnue';

    // Affichage du succès et rafraîchissement
    alert(message + ` Nouvelle date : ${nouvelleDate}`);

    // Rafraîchir la liste des utilisateurs si nécessaire
    await fetchLicencie();
  } catch (error) {
    console.error('Erreur lors du renouvellement :', error);
    alert('Échec du renouvellement : Vérifiez la console et que vous avez les permissions nécessaires (Admin/Sensei).');
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
  if (user && user.id) {
    selectedUser.value = { ...user, userId: user.id }; // Cloner l'objet pour éviter les mutations directes
  }
  else {
    selectedUser.value = null;
  }
  showModal.value = true;
};

// ===============================
// 🔹 MISE À JOUR D'UN ADHÉRENT
// ===============================
const updateAdherent = async (updatedUser) => {
  try {
    await api.put(`${API_UPDATE}/${updatedUser.userId}`, updatedUser);
    fetchLicencie(); // Rafraîchir la liste
  } catch (err) {
    console.error('Erreur lors de la mise à jour :', err);
  }
};

// ===============================
// 🔹 SUPPRESSION D'UN ADHÉRENT
// ===============================
const deleteAdherent = async (userId, nom, prenom) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer l'adhérent ${prenom} ${nom} ? Cette action est irréversible.`)) return;

  try {
    await api.delete(`${API_DELETE}/${userId}`);
    fetchLicencie();
    alert(`L'adhérent ${prenom} ${nom} a été supprimé avec succès.`);
  } catch (err) {
    console.error('Erreur lors de la suppression :', err);
    alert('Erreur lors de la suppression de l\'adhérent. Vérifiez la console.');
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
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) {
    console.error("Erreur de formatage de date :", e);
    return 'Date invalide';
  }
};


// ===============================
// 🔹 VÉRIFICATION EXPIRATION CERTIFICAT
// ===============================
const isCertificatExpire = (dateExpiration) => {
  if (!dateExpiration) return false;

  const aujourdHui = new Date();
  aujourdHui.setHours(0, 0, 0, 0);

  const expiration = new Date(dateExpiration);
  expiration.setHours(0, 0, 0, 0);

  return expiration < aujourdHui;
};

// ===============================
// 🔹 MONTAGE DU COMPOSANT
// ===============================
onMounted(() => {
  fetchLicencie();
  fetchDiscipline();
});
</script>

<template>
  <div class="container-fluid bg-dark text-white min-h-screen p-4">
    <h1 class="m-3 text-center">Liste des Licenciés</h1>

    <div class="mb-5 d-flex justify-content-end ">
      <div class="input-group w-50 ">
        <input type="text" v-model="searchTerm" class="form-control bg-light text-dark border-warning"
          placeholder="Rechercher par Nom, Prénom ou ville..." aria-label="Recherche licencié" />

        <button class="btn btn-secondary" type="button" id="button-addon2">
          <i class="pi pi-search"></i>
        </button>
      </div>
    </div>

    <!-- 🔸 Bouton création -->
    <button class="mb-5 btn btn-outline-warning d-flex align-items-center" @click="openModal(null)">
      <i class="pi pi-plus-circle me-2"></i> Ajout Adhérent
    </button>

    <!-- 🔸 États de chargement -->
    <div v-if="loading" class="text-secondary">Chargement...</div>
    <div v-else-if="error" class="text-danger">{{ error }}</div>

    <!-- 🔸 Liste par discipline -->
    <div v-else>
      <div v-if="userList.length === 0" class="text-light p-4 border rounded">
        Aucun Adhérent trouvé.
      </div>

      <div v-else>
        <div v-for="discipline in disciplineList" :key="discipline.disciplineId" class="mb-3">
          <div class="accordion" :id="'accordion-' + discipline.disciplineId">
            <div class="accordion-item bg-dark text-white border-warning rounded">
              <h2 class="accordion-header" :id="'heading-' + discipline.disciplineId">
                <button class="accordion-button fs-5"
                  :class="{ 'collapsed': activeAccordion !== discipline.disciplineId }" type="button"
                  @click="activeAccordion = (activeAccordion === discipline.disciplineId ? null : discipline.disciplineId)">

                  {{ discipline.nom }}

                  <span class="text-warning ms-2">
                    ({{ groupedUsersByDiscipline[discipline.nom]?.length || 0 }} adhérents)
                  </span>
                </button>
              </h2>

              <div class="accordion-collapse"
                :class="{ 'collapse show': activeAccordion === discipline.disciplineId, 'collapse': activeAccordion !== discipline.disciplineId }">
                <div class="accordion-body p-3">
                  <div v-if="groupedUsersByDiscipline[discipline.nom]?.length === 0" class="text-center text-secondary">
                    Aucun adhérent dans cette discipline.
                  </div>

                  <table class="table table-dark table-striped table-hover mb-0 text-center">
                    <thead>
                      <tr>
                        <th class="d-none d-md-table-cell">#</th>
                        <th>Nom</th>
                        <th class="d-none d-md-table-cell">Prénom</th>
                        <th class="d-none d-md-table-cell">Email</th>
                        <th class="d-none d-md-table-cell">Téléphone</th>
                        <th class="d-none d-md-table-cell">Ville</th>
                        <th class="d-none d-md-table-cell">Date inscription</th>
                        <th class="d-none d-md-table-cell">Date de renouvellement</th>
                        <th class="d-none d-md-table-cell">Certificat médical</th>

                        <th style="width: 200px;">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(user, index) in groupedUsersByDiscipline[discipline.nom]" :key="user.userId">
                        <th class="d-none d-md-table-cell">{{ index + 1 }}</th>

                        <td>{{ user.nom }}</td>
                        <td class="d-none d-md-table-cell">{{ user.prenom }}</td>
                        <td class="d-none d-md-table-cell">{{ user.email || 'N/A' }}</td>
                        <td class="d-none d-md-table-cell">{{ user.telephone || 'N/A' }}</td>
                        <td class="d-none d-md-table-cell">{{ user.ville || 'N/A' }}</td>
                        <td class="d-none d-md-table-cell">{{ formatDate(user.dateAdhesion) }}</td>
                        <td class="d-none d-md-table-cell">{{ formatDate(user.dateRenouvellement) }}</td>
                        <td class="d-none d-md-table-cell">
                          <span v-if="user.dateExpirationCertificatMedical" :class="{
                            'text-danger fw-bold': isCertificatExpire(user.dateExpirationCertificatMedical),
                            'text-light ': !isCertificatExpire(user.dateExpirationCertificatMedical)
                          }">
                            {{ formatDate(user.dateExpirationCertificatMedical) }}
                          </span>

                          <span v-else class="text-secondary">
                            Aucun certificat
                          </span>
                        </td>

                        <td>
                          <div class="d-flex justify-content-center">
                            <button class="btn btn-outline-success btn-sm me-1"
                              @click="renewAdhesion(user.id, user.nom, user.prenom)"
                              title="Renouveler l'adhésion à aujourd'hui">
                              <i class="pi pi-history"></i>
                            </button>
                            <button class="btn btn-outline-info btn-sm me-1" @click="openModal(user)">
                              <i class="pi pi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm"
                              @click="deleteAdherent(user.id, user.nom, user.prenom)">
                              <i class="pi pi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 🔸 Modal -->
    <CreateLicencierModal :show="showModal" :disciplineList="disciplineList" :user="selectedUser"
      @close="showModal = false" @refresh="fetchLicencie" @update-user="updateAdherent" />
  </div>
</template>

<style scoped>
.table td,
.table th {
  padding: 0.75rem 1rem;
  vertical-align: middle;
}

.accordion-body {
  padding: 1rem;
}

.btn.me-1 {
  margin-right: 0.25rem;
}

/* 🔹 Flèche de l'accordéon en blanc */
.accordion-button::after {
  filter: invert(1);
  /* Inverse les couleurs → blanc */
}


.accordion-button {
  background-color: #2c3035;
  color: white;
}
</style>
