<script setup>

// ===============================
// 🔹 IMPORTS
// ===============================

import { ref, onMounted, computed } from 'vue';
import api from '@/api/axios';

// PrimeVue Services & Popup
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

import CreateLicencierModal from '@/components/Licencies/CreateLicencierModal.vue';
import LicenciesStats from '@/components/Licencies/LicenciesStats.vue';


// ===============================
// 🔹 SERVICES & ÉTATS
// ===============================

const confirm = useConfirm();
const toast = useToast();

const userList = ref([]);
const disciplineList = ref([]);

const loading = ref(true);
const error = ref(null);

const showModal = ref(false);
const selectedUser = ref(null);

const searchTerm = ref('');
const activeAccordion = ref(null);

const disciplineColors = {
  Judo: '#FF6384',
  Aïkido: '#3B82F6',
  Jujitsu: '#10B981',
  'Judo Détente': '#EFD844',
};

function getDisciplineColor(discipline) {
  return disciplineColors[discipline] || '#8A919E';
}


// ===============================
// 🔹 API CONSTANTS
// ===============================

const API_LICENCIE = '/User/admin/list';
const API_DISCIPLINE = '/Discipline';
const API_UPDATE = '/User/admin/update';
const API_DELETE = '/User/admin';
const API_RENEW = '/User/admin/renouvellement';

// ===============================
// 🔹 COMPUTED PROPERTIES
// ===============================

const userListWithDiscipline = computed(() => {
  return userList.value.map(user => {

    const discipline = disciplineList.value.find(
      d => d.disciplineId === user.disciplineId
    );

    return {
      ...user,
      disciplineName: discipline ? discipline.nom : 'N/A'
    };
  });
});


const filteredUserList = computed(() => {

  if (!searchTerm.value.trim()) {
    return userListWithDiscipline.value;
  }

  const searchLower = searchTerm.value.toLowerCase().trim();

  return userListWithDiscipline.value.filter(user => (

    (user.nom &&
      user.nom.toLowerCase().includes(searchLower)) ||

    (user.prenom &&
      user.prenom.toLowerCase().includes(searchLower)) ||

    (user.ville &&
      user.ville.toLowerCase().includes(searchLower)) ||

    (user.telephone &&
      user.telephone.includes(searchLower)) ||

    (user.email &&
      user.email.toLowerCase().includes(searchLower))

  ));
});


const groupedUsersByDiscipline = computed(() => {
  const groups = {};
  disciplineList.value.forEach(discipline => {
    groups[discipline.nom] =
      filteredUserList.value.filter(
        user => user.disciplineName === discipline.nom
      );
  });

  return groups;
});


// ===============================
// 🔹 API - LICENCIÉS
// ===============================

const fetchLicencie = async () => {

  loading.value = true;
  error.value = null;

  try {

    const response = await api.get(API_LICENCIE);
    const allUsers = response.data || [];

    userList.value = allUsers.filter(
      user => user.roles?.includes('Adherent')
    );

  } catch (err) {
    console.error(err);
    error.value =
      'Échec du chargement de la liste des licenciés.';
  } finally {
    loading.value = false;
  }
};


// ===============================
// 🔹 API - DISCIPLINES
// ===============================

const fetchDiscipline = async () => {
  try {
    const response = await api.get(API_DISCIPLINE);
    disciplineList.value = response.data || [];
    if (disciplineList.value.length > 0) {
      activeAccordion.value =
        disciplineList.value[0].disciplineId;
    }
  } catch (err) {
    console.error(
      'Erreur de chargement des disciplines :',
      err
    );
  }
};

// ===============================
// 🔹 RENOUVELLEMENT
// ===============================

const renewAdhesion = (userId, nom, prenom) => {
  confirm.require({
    header: 'Confirmation de renouvellement',
    message:
      `Renouveler l'adhésion de ${prenom} ${nom} à aujourd'hui ?`,
    icon: 'pi pi-refresh',
    acceptLabel: 'Renouveler',
    rejectLabel: 'Annuler',
    acceptClass: 'renew-confirm-btn',
    rejectClass: 'confirm-cancel-btn',
    accept: async () => {
      try {
        const response =
          await api.post(`${API_RENEW}/${userId}`);
        const nouvelleDate =
          response.data?.NouvelleDateRenouvellement || '';
        toast.add({
          severity: 'success',
          summary: 'Adhésion renouvelée',
          detail:
            nouvelleDate
              ? `Nouvelle date : ${nouvelleDate}`
              : 'Le renouvellement a été effectué.',
          life: 4000
        });
        await fetchLicencie();
      } catch (err) {
        console.error(err);
        toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail:
            "Échec du renouvellement de l'adhésion.",
          life: 4000
        });
      }
    }
  });
};

// ===============================
// 🔹 SUPPRESSION
// ===============================

const deleteAdherent = (userId, nom, prenom) => {
  confirm.require({
    header: 'Supprimer l’adhérent',
    message:
      `Voulez-vous vraiment supprimer définitivement ${prenom} ${nom} ? Cette action est irréversible.`,
    icon: 'pi pi-trash',
    styleClass: 'confirm-delete-dialog',
    acceptLabel: 'Supprimer',
    rejectLabel: 'Annuler',
    acceptClass: 'delete-confirm-btn',
    rejectClass: 'delete-cancel-btn',
    accept: async () => {
      try {
        const idToDelete =
          userId || selectedUser.value?.userId;
        await api.delete(
          `${API_DELETE}/${idToDelete}`
        );
        toast.add({
          severity: 'success',
          summary: 'Adhérent supprimé',
          detail:
            `${prenom} ${nom} a été retiré de la liste.`,
          life: 3500
        });
        await fetchLicencie();
      } catch (err) {
        console.error(err);
        toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail:
            "La suppression de l’adhérent a échoué.",
          life: 4000
        });
      }
    }
  });
};


// ===============================
// 🔹 MODALE
// ==============================
const openModal = (user = null) => {
  selectedUser.value =
    user && (user.id || user.userId)
      ? {
        ...user,
        userId: user.id || user.userId
      }
      : null;
  showModal.value = true;
};


// ===============================
// 🔹 MISE À JOUR
// ===============================
const updateAdherent = async (updatedUser) => {
  try {
    await api.put(
      `${API_UPDATE}/${updatedUser.userId}`,
      updatedUser
    );
    toast.add({
      severity: 'success',
      summary: 'Informations mises à jour',
      detail:
        "Les informations de l'adhérent ont été enregistrées.",
      life: 3000
    });

    await fetchLicencie();
  } catch (err) {
    console.error(
      'Erreur lors de la mise à jour :',
      err
    );

    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail:
        'La mise à jour a échoué.',
      life: 3000
    });
  }
};

// ===============================
// 🔹 UTILITAIRES
// ===============================
const formatDate = (dateString) => {
  if (!dateString) {
    return 'N/A';
  }
  try {
    return new Intl.DateTimeFormat(
      'fr-FR',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    ).format(new Date(dateString));
  } catch {
    return 'Date invalide';
  }
};

const isCertificatExpire = (dateExpiration) => {
  if (!dateExpiration) {
    return false;
  }

  const aujourdHui = new Date();
  aujourdHui.setHours(
    0,
    0,
    0,
    0
  );

  const expiration =
    new Date(dateExpiration);
  expiration.setHours(
    0,
    0,
    0,
    0
  );
  return expiration < aujourdHui;
};

// ===============================
// 🔹 INITIALISATION
// ===============================
onMounted(() => {
  fetchLicencie();
  fetchDiscipline();
});
</script>

<template>
  <div class="licencies-page">
    <!-- ===============================
         🔹 TOAST / CONFIRMATION
    ================================ -->
    <Toast position="top-right" />
    <ConfirmDialog />

    <!-- ===============================
         🔹 CONTENU PRINCIPAL
    ================================ -->
    <div class="container-fluid px-3 px-md-4 py-4 min-vh-100 ">

      <!-- ===============================
           🔹 EN-TÊTE
      ================================ -->
      <div class="page-header text-center mb-4">
        <div class="page-header-icon">
          <i class="pi pi-users"></i>
        </div>
        <h1>
          Gestion des Licenciés
        </h1>
        <p>
          Gestion des adhérents, renouvellements
          et certificats médicaux
        </p>
      </div>

      <LicenciesStats :userList="userList" />

      <!-- ===============================
           🔹 BARRE D'ACTIONS
      ================================ -->
      <div class="actions-bar">
        <!-- Ajouter -->
        <button type="button" class="add-member-btn" @click="openModal(null)">
          <i class="pi pi-user-plus"></i>
          <span>
            Ajouter un adhérent
          </span>
        </button>

        <!-- Recherche -->
        <div class="search-box">
          <i class="pi pi-search search-icon"></i>
          <input v-model="searchTerm" type="text" placeholder="Rechercher un adhérent..." />
          <button v-if="searchTerm" type="button" class="clear-search" title="Effacer la recherche"
            @click="searchTerm = ''">
            <i class="pi pi-times"></i>
          </button>
        </div>
      </div>

      <!-- ===============================
           🔹 CHARGEMENT
      ================================ -->
      <div v-if="loading" class="state-container">
        <i class="pi pi-spin pi-spinner"></i>
        <span>
          Chargement des licenciés...
        </span>
      </div>

      <!-- ===============================
           🔹 ERREUR
      ================================ -->
      <div v-else-if="error" class="error-container">
        <i class="pi pi-exclamation-triangle"></i>
        <span>
          {{ error }}
        </span>
      </div>

      <!-- ===============================
           🔹 LISTE
      ================================ -->
      <div v-else>
        <!-- Aucun adhérent -->
        <div v-if="userList.length === 0" class="empty-container">
          <div class="empty-icon">
            <i class="pi pi-users"></i>
          </div>
          <h3>
            Aucun adhérent
          </h3>
          <p>
            Aucun adhérent n'est actuellement enregistré.
          </p>
        </div>

        <!-- Disciplines -->
        <div v-else class="accordion-container">
          <div v-for="discipline in disciplineList" :key="discipline.disciplineId" class="discipline-card">

            <!-- ===============================
                 🔹 EN-TÊTE DISCIPLINE
            =============================== -->
            <button type="button" class="accordion-trigger" @click="
              activeAccordion =
              activeAccordion === discipline.disciplineId
                ? null
                : discipline.disciplineId
              ">

              <div class="discipline-title">
              <div
  class="discipline-icon"
  :style="{
    color: getDisciplineColor(discipline.nom),
    background: `${getDisciplineColor(discipline.nom)}18`
  }"
>
  <i class="pi pi-shield"></i>
</div>

                <div>
                  <span class="discipline-name">
                    {{ discipline.nom }}
                  </span>

                  <span class="discipline-count">
                    {{
                      groupedUsersByDiscipline[
                        discipline.nom
                      ]?.length || 0
                    }}
                    adhérent{{
                      (groupedUsersByDiscipline[
                        discipline.nom
                      ]?.length || 0) > 1
                        ? 's'
                        : ''
                    }}
                  </span>
                </div>
              </div>

              <i :class="[
                'pi',
                activeAccordion === discipline.disciplineId
                  ? 'pi-chevron-up'
                  : 'pi-chevron-down',
                'accordion-arrow'
              ]"></i>
            </button>

            <!-- ===============================
                 🔹 CONTENU DISCIPLINE
            ================================ -->
            <div v-show="activeAccordion === discipline.disciplineId
              " class="accordion-content">

              <!-- Aucun résultat -->
              <div v-if="
                !groupedUsersByDiscipline[
                discipline.nom
                ] ||
                groupedUsersByDiscipline[
                  discipline.nom
                ].length === 0
              " class="no-member">
                <i class="pi pi-info-circle"></i>
                <span>
                  {{
                    searchTerm
                      ? 'Aucun adhérent ne correspond à votre recherche.'
                      : 'Aucun adhérent dans cette discipline.'
                  }}
                </span>
              </div>

              <!-- Tableau -->
              <div v-else class="table-responsive">
                <table class="members-table">
                  <thead>
                    <tr>
                      <th class="index-column">
                        #
                      </th>
                      <th>
                        Nom
                      </th>
                      <th class="desktop-only">
                        Prénom
                      </th>
                      <th class="desktop-only">
                        Contact
                      </th>
                      <th class="desktop-only">
                        Ville
                      </th>
                      <th class="desktop-only">
                        Inscription
                      </th>
                      <th class="desktop-only">
                        Renouvellement
                      </th>
                      <th class="desktop-only">
                        Certificat médical
                      </th>
                      <th class="actions-column">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>

                    <tr v-for="(user, index) in groupedUsersByDiscipline[
                      discipline.nom
                    ]" :key="user.id || user.userId">

                      <!-- Index -->
                      <td class="index-column desktop-only">
                        {{ index + 1 }}
                      </td>

                      <!-- Nom -->
                      <td>
                        <div class="member-name">
                          <span class="member-avatar">
                            {{ user.prenom?.charAt(0) || '' }}{{ user.nom?.charAt(0) || '' }}
                          </span>
                          <span>
                            {{ user.nom }}
                          </span>
                        </div>
                      </td>

                      <!-- Prénom -->
                      <td class="desktop-only">
                        {{ user.prenom }}
                      </td>

                      <!-- Contact -->
                      <td class="desktop-only">
                        <div class="contact-info">
                          <span class="email">
                            <i class="pi pi-envelope"></i>
                            {{ user.email || 'N/A' }}
                          </span>
                          <span class="phone">
                            <i class="pi pi-phone"></i>
                            {{ user.telephone || 'N/A' }}
                          </span>
                        </div>
                      </td>

                      <!-- Ville -->
                      <td class="desktop-only">
                        <span class="secondary-text">
                          {{ user.ville || 'N/A' }}
                        </span>
                      </td>

                      <!-- Inscription -->
                      <td class="desktop-only">
                        {{ formatDate(user.dateAdhesion) }}
                      </td>

                      <!-- Renouvellement -->
                      <td class="desktop-only">
                        {{ formatDate(user.dateRenouvellement) }}
                      </td>


                      <!-- Certificat -->
                      <td class="desktop-only">
                        <span v-if="
                          user.dateExpirationCertificatMedical
                        " :class="[
                          'certificate-badge',
                          isCertificatExpire(
                            user.dateExpirationCertificatMedical
                          )
                            ? 'certificate-expired'
                            : 'certificate-valid'
                        ]">

                          <i :class="isCertificatExpire(
                            user.dateExpirationCertificatMedical
                          )
                            ? 'pi pi-exclamation-circle'
                            : 'pi pi-check-circle'
                            "></i>

                          {{
                            formatDate(
                              user.dateExpirationCertificatMedical
                            )
                          }}
                        </span>

                        <span v-else class="certificate-none">
                          <i class="pi pi-minus-circle"></i>
                          Aucun
                        </span>
                      </td>

                      <!-- Actions -->
                      <td class="actions-column">
                        <div class="action-buttons">

                          <!-- Renouveler -->
                          <button type="button" class="action-btn action-renew" title="Renouveler l'adhésion" @click="
                            renewAdhesion(
                              user.id || user.userId,
                              user.nom,
                              user.prenom
                            )
                            ">
                            <i class="pi pi-history"></i>
                          </button>


                          <!-- Modifier -->
                          <button type="button" class="action-btn action-edit" title="Modifier"
                            @click="openModal(user)">
                            <i class="pi pi-pencil"></i>
                          </button>

                          <!-- Supprimer -->
                          <button type="button" class="action-btn action-delete" title="Supprimer" @click="
                            deleteAdherent(
                              user.id || user.userId,
                              user.nom,
                              user.prenom
                            )
                            ">
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

      <!-- ===============================
           🔹 MODALE
      ================================ -->

      <CreateLicencierModal :show="showModal" :disciplineList="disciplineList" :user="selectedUser"
        @close="showModal = false" @refresh="fetchLicencie" @update-user="updateAdherent" />
    </div>
  </div>
</template>

<!-- =========================================================
     🔹 STYLE LOCAL
========================================================= -->
<style scoped>
/* ===============================
   PAGE
================================ */
.licencies-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top,
      #30363d 0%,
      #212529 45%,
      #191c1f 100%);
  color: #fff;
}

/* ===============================
   HEADER
================================ */

.page-header {
  padding: 1rem 0 1.5rem;
}

.page-header-icon {
  width: 54px;
  height: 54px;
  margin: 0 auto 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 193, 7, 0.45);
  border-radius: 12px;
  color: #ffc107;
  background: rgba(255, 193, 7, 0.08);
  font-size: 1.4rem;
  box-shadow:
    0 0 25px rgba(255, 193, 7, 0.08);
}

.page-header h1 {
  margin: 0;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 700;
  letter-spacing: -0.5px;
}

.page-header p {
  margin: 0.5rem 0 0;
  color: #8f969d;
  font-size: 0.95rem;
}


/* ===============================
   BARRE D'ACTIONS
================================ */

.actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(33, 37, 41, 0.85);
  border: 1px solid #3c434a;
  border-radius: 12px;
  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.18);
}

/* ===============================
   BOUTON AJOUT
================================ */

.add-member-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.65rem 1rem;
  border: 1px solid #ffc107;
  border-radius: 8px;
  background: transparent;
  color: #ffc107;
  font-weight: 600;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.15s ease;
}

.add-member-btn:hover {
  background: #ffc107;
  color: #212529;
  transform: translateY(-1px);
}

.add-member-btn:active {
  transform: translateY(0);
}

/* ===============================
   RECHERCHE
================================ */

.search-box {
  position: relative;
  width: min(400px, 100%);
}

.search-box input {
  width: 100%;
  height: 42px;
  padding: 0.5rem 2.6rem 0.5rem 2.6rem;
  border: 1px solid #495057;
  border-radius: 8px;
  background: #212529;
  color: #fff;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.search-box input::placeholder {
  color: #6c757d;
}

.search-box input:focus {
  border-color: #ffc107;
  box-shadow:
    0 0 0 3px rgba(255, 193, 7, 0.1);
}

.search-icon {
  position: absolute;
  left: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  color: #ffc107;

  pointer-events: none;
}

.clear-search {
  position: absolute;

  right: 0.65rem;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #6c757d;
  cursor: pointer;
  transition: color 0.2s ease;
}

.clear-search:hover {
  color: #fff;
}


/* ===============================
   ÉTATS
================================ */

.state-container,
.error-container,
.empty-container {
  display: flex;

  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
  text-align: center;
  border: 1px solid #3c434a;
  border-radius: 12px;
  background: rgba(33, 37, 41, 0.7);
}

.state-container {
  gap: 0.75rem;
  color: #8f969d;
}

.state-container i {
  font-size: 1.8rem;
  color: #ffc107;
}

.error-container {
  gap: 0.75rem;
  padding: 2rem;
  color: #ff6b6b;
  border-color: rgba(220, 53, 69, 0.5);
}

.error-container i {
  font-size: 1.8rem;
}

.empty-container {
  padding: 2rem;
}

.empty-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border-radius: 50%;
  background: rgba(255, 193, 7, 0.08);
  color: #ffc107;
  font-size: 1.5rem;
}

.empty-container h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
}

.empty-container p {
  margin: 0;
  color: #8f969d;
}


/* ===============================
   DISCIPLINES
================================ */

.accordion-container {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.discipline-card {
  overflow: hidden;
  border: 1px solid #3c434a;
  border-radius: 12px;
  background: rgba(33, 37, 41, 0.85);
  box-shadow:
    0 5px 18px rgba(0, 0, 0, 0.18);
}


/* ===============================
   ACCORDION HEADER
================================ */

.accordion-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.15rem;
  border: none;
  background: transparent;
  color: #fff;
  text-align: left;
  cursor: pointer;
  transition:
    background-color 0.2s ease;
}

.accordion-trigger:hover {
  background: rgba(255, 193, 7, 0.04);
}

.discipline-title {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.discipline-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: rgba(255, 193, 7, 0.08);
}


.discipline-name {
  display: block;
  font-size: 1rem;
  font-weight: 700;
}

.discipline-count {
  display: block;
  margin-top: 0.15rem;
  color: #8f969d;
  font-size: 0.8rem;
}

.accordion-arrow {
  color: #ffc107;
  transition: transform 0.2s ease;
}


/* ===============================
   ACCORDION CONTENT
================================ */

.accordion-content {
  border-top: 1px solid #3c434a;

  background: #1e2226;
}


/* ===============================
   NO MEMBER
================================ */

.no-member {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 2rem;
  color: #6c757d;
  font-size: 0.9rem;
}


/* ===============================
   TABLE
================================ */

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.members-table {
  width: 100%;
  border-collapse: collapse;
  color: #fff;
}

.members-table th {
  padding: 0.9rem 0.8rem;
  background: #212529;
  color: #ffc107;
  border-bottom: 1px solid #495057;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.members-table td {
  padding: 0.85rem 0.8rem;
  border-bottom: 1px solid #343a40;
  vertical-align: middle;
  font-size: 0.88rem;
  white-space: nowrap;
}

.members-table tbody tr {
  transition:
    background-color 0.15s ease;
}

.members-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.025);
}

.members-table tbody tr:last-child td {
  border-bottom: none;
}

.index-column {
  width: 45px;
  color: #6c757d;
  text-align: center;
}

.actions-column {
  width: 125px;
  text-align: right;
}


/* ===============================
   MEMBRE
================================ */

.member-name {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
}

.member-avatar {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 8px;
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
  font-size: 0.72rem;
  font-weight: 700;
}


/* ===============================
   CONTACT
================================ */

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.contact-info span {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.contact-info i {
  font-size: 0.7rem;
}

.email {
  color: #fff;
}

.phone {
  color: #8f969d;
}

.secondary-text {
  color: #8f969d;
}


/* ===============================
   CERTIFICAT
================================ */

.certificate-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.55rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.certificate-valid {
  background: rgba(25, 135, 84, 0.14);
  color: #54d69a;
  border: 1px solid rgba(25, 135, 84, 0.35);
}

.certificate-expired {
  background: rgba(220, 53, 69, 0.14);
  color: #ff6b78;
  border: 1px solid rgba(220, 53, 69, 0.35);
}

.certificate-none {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #6c757d;
  font-size: 0.78rem;
  font-style: italic;
}


/* ===============================
   BOUTONS ACTIONS
================================ */

.action-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.4rem;
}

.action-btn {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 7px;
  background: transparent;
  border: 1px solid;
  cursor: pointer;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.15s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.action-btn:active {
  transform: translateY(0);
}


/* Renouveler */

.action-renew {
  color: #198754;

  border-color: #198754;
}

.action-renew:hover {
  color: #fff;

  background: #198754;
}


/* Modifier */

.action-edit {
  color: #0dcaf0;

  border-color: #0dcaf0;
}

.action-edit:hover {
  color: #fff;

  background: #0dcaf0;
}


/* Supprimer */

.action-delete {
  color: #dc3545;

  border-color: #dc3545;
}

.action-delete:hover {
  color: #fff;

  background: #dc3545;
}


/* ===============================
   RESPONSIVE
================================ */

@media (max-width: 767.98px) {

  .actions-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .add-member-btn {
    width: 100%;
  }

  .search-box {
    width: 100%;
  }

  .members-table th,
  .members-table td {
    padding: 0.7rem 0.6rem;
  }

  .action-buttons {
    justify-content: center;
  }

}
</style>


<!-- =========================================================
     🔹 STYLES PRIMEVUE GLOBAUX
     Pas de "scoped" car les composants PrimeVue
     sont rendus directement dans le body.
========================================================= -->

<style>
/* ===============================
   TOAST
================================ */

.p-toast {
  z-index: 9999 !important;
}

.p-toast .p-toast-message {
  width: min(400px, calc(100vw - 2rem));
  min-height: 64px;
  margin-bottom: 0.75rem;
  border-radius: 10px !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.45) !important;
  opacity: 1 !important;
  overflow: hidden;
}

.p-toast .p-toast-message-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1rem !important;
}

.p-toast .p-toast-summary {
  margin-bottom: 0.15rem;
  font-weight: 700 !important;
}

.p-toast .p-toast-detail {
  font-size: 0.9rem;
  opacity: 0.95;
}

.p-toast .p-toast-message-icon {
  flex-shrink: 0;
  font-size: 1.35rem !important;
}

.p-toast .p-toast-icon-close {
  color: inherit !important;
  opacity: 0.8;
  transition:
    opacity 0.2s ease;
}

.p-toast .p-toast-icon-close:hover {
  opacity: 1;
}


/* Succès */

.p-toast .p-toast-message-success {
  background: #198754 !important;
  color: #fff !important;
  border-color: #2fb477 !important;
}


/* Erreur */

.p-toast .p-toast-message-error {
  background: #dc3545 !important;
  color: #fff !important;
  border-color: #e85d6a !important;
}


/* Information */

.p-toast .p-toast-message-info {
  background: #0d6efd !important;
  color: #fff !important;
  border-color: #3d8bfd !important;
}


/* Warning */

.p-toast .p-toast-message-warn {
  background: #ffc107 !important;
  color: #212529 !important;
  border-color: #ffcd39 !important;
}


/* ===============================
   CONFIRM DIALOG GÉNÉRAL
================================ */

.p-dialog,
.p-confirm-dialog {
  width: min(450px, calc(100vw - 2rem));
  border-radius: 12px !important;
  overflow: hidden !important;
  background: #212529 !important;
  color: #fff !important;
  border: 1px solid #495057 !important;
  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.65) !important;
}

.p-dialog .p-dialog-header,
.p-confirm-dialog .p-dialog-header {
  background: #212529 !important;
  color: #fff !important;
  padding: 1rem 1.25rem !important;
  border-bottom: 1px solid #343a40 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}

.p-dialog .p-dialog-title,
.p-confirm-dialog .p-dialog-title {
  color: #ffc107 !important;
  font-size: 1.05rem !important;
  font-weight: 700 !important;
}

.p-dialog .p-dialog-header-icon,
.p-confirm-dialog .p-dialog-header-close {
  color: #8f969d !important;
  background: transparent !important;
  border: none !important;
}

.p-dialog .p-dialog-header-icon:hover,
.p-confirm-dialog .p-dialog-header-close:hover {
  color: #fff !important;
  background: rgba(255, 255, 255, 0.05) !important;
}


/* ===============================
   CONTENU
================================ */

.p-dialog .p-dialog-content,
.p-confirm-dialog .p-dialog-content {
  background: #212529 !important;
  color: #fff !important;
  padding: 1.5rem 1.25rem !important;
  display: flex !important;
  align-items: center !important;
  gap: 1rem !important;
  white-space: normal !important;
}

.p-confirm-dialog-icon {
  flex-shrink: 0;
  font-size: 1.8rem !important;
  color: #ffc107 !important;
}

.p-confirm-dialog-message {
  margin: 0 !important;
  color: #dee2e6 !important;
  font-size: 0.92rem !important;
  line-height: 1.5;
  word-break: break-word;
  white-space: normal !important;
}


/* ===============================
   FOOTER
================================ */

.p-dialog .p-dialog-footer,
.p-confirm-dialog .p-dialog-footer {
  background: #212529 !important;
  padding: 0.9rem 1.25rem !important;
  border-top: 1px solid #343a40 !important;
  display: flex !important;
  justify-content: flex-end !important;
  align-items: center !important;
  gap: 0.5rem !important;
}

.p-dialog .p-dialog-footer button,
.p-confirm-dialog .p-dialog-footer button {
  white-space: nowrap !important;
  border-radius: 7px !important;
  font-weight: 600 !important;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}


/* ===============================
   CONFIRMATION RENOUVELLEMENT
================================ */

.renew-confirm-btn {
  background: #198754 !important;
  border: 1px solid #198754 !important;
  color: #fff !important;
  padding: 0.55rem 1rem !important;
}

.renew-confirm-btn:hover {
  background: #157347 !important;
  border-color: #157347 !important;
}


/* ===============================
   CONFIRMATION SUPPRESSION
================================ */

.confirm-delete-dialog {
  border: 1px solid #dc3545 !important;
  box-shadow:
    0 15px 40px rgba(220, 53, 69, 0.15),
    0 15px 40px rgba(0, 0, 0, 0.65) !important;
}

.confirm-delete-dialog .p-dialog-title {
  color: #fff !important;
}

.confirm-delete-dialog .p-confirm-dialog-icon {
  color: #dc3545 !important;
}

.confirm-delete-dialog .p-confirm-dialog-message {
  color: #dee2e6 !important;
}


/* ===============================
   BOUTON SUPPRIMER
================================ */

.delete-confirm-btn {
  background: #dc3545 !important;
  border: 1px solid #dc3545 !important;
  color: #fff !important;
  padding: 0.55rem 1rem !important;
}

.delete-confirm-btn:hover {
  background: #bb2d3b !important;
  border-color: #bb2d3b !important;
}


/* ===============================
   BOUTON ANNULER
================================ */

.delete-cancel-btn,
.confirm-cancel-btn {
  background: transparent !important;
  border: 1px solid #6c757d !important;
  color: #dee2e6 !important;
  padding: 0.55rem 1rem !important;
}

.delete-cancel-btn:hover,
.confirm-cancel-btn:hover {
  background: #343a40 !important;
  border-color: #adb5bd !important;
  color: #fff !important;
}


/* ===============================
   MOBILE TOAST
================================ */

@media (max-width: 575.98px) {

  .p-toast {
    width: calc(100vw - 1rem) !important;
    left: 0.5rem !important;
    right: 0.5rem !important;
  }

  .p-toast .p-toast-message {
    width: 100%;
  }
}
</style>
