<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

// PrimeVue Services & Popups
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

import SenseiFormFields from '@/components/Senseis/SenseiFormFields.vue';
import UserFormFields from '@/components/Users/UserFormFields.vue';
import UserTable from '@/components/Users/UserTable.vue';
import SenseisStats from '@/components/Senseis/SenseisStats.vue';

// --------------------
// Services & état local
// --------------------
const confirm = useConfirm();
const toast = useToast();

const userList = ref([]);
const selectedDiscipline = ref('');
const disciplineList = ref([]);
const loading = ref(true);
const error = ref(null);
const photoFile = ref(null);
const validationError = ref('');
const editingUserId = ref(null);

// --------------------
// Helpers utilitaires
// --------------------
const getTodayDateISO = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    photoFile.value = file;
  }
};

// --------------------
// Modèle du formulaire (nouveau Sensei)
// --------------------
const newSensei = ref({
  nom: '',
  prenom: '',
  rueEtNumero: '',
  ville: '',
  codePostal: '',
  telephone: '',
  email: '',
  password: '',
  grade: '',
  dateDeNaissance: '',
  disciplineId: '',
  bio: '',
  photoUrl: '',
  dateAdhesion: getTodayDateISO(),
  dateRenouvellement: getTodayDateISO(),
  isSensei: true,
  statut: 1,
  roles: ['Sensei']
});

// --------------------
// Fonctions utilitaires liées aux données
// --------------------
const getDisciplineName = (disciplineId) => {
  const discipline = disciplineList.value.find(d => d.disciplineId === disciplineId);
  return discipline ? discipline.nom : 'N/A';
};

const resetForm = () => {
  newSensei.value = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    rueEtNumero: '',
    ville: '',
    codePostal: '',
    telephone: '',
    grade: '',
    dateDeNaissance: '',
    bio: '',
    photoUrl: '',
    disciplineId: '',
    dateAdhesion: getTodayDateISO(),
    dateRenouvellement: getTodayDateISO(),
    isSensei: true,
    statut: 1,
    roles: ['Sensei']
  };
  selectedDiscipline.value = '';
  validationError.value = '';
  editingUserId.value = null;
  photoFile.value = null;
};

// --------------------
// Événements & actions utilisateur
// --------------------
const handleEdit = (user) => {
  editingUserId.value = user.id || user.userId;

  newSensei.value = {
    ...user,
    rueEtNumero: user.rueEtNumero || user.adresse || '',
    bio: user.bio,
    password: '',
    dateDeNaissance: user.dateDeNaissance || ''
  };

  selectedDiscipline.value = user.disciplineId ? String(user.disciplineId) : '';

  const modalElement = document.getElementById('createAdherent');
  if (modalElement) {
    const modal = new window.bootstrap.Modal(modalElement);
    modal.show();
  }
};

const handleDelete = (user) => {
  const userId = typeof user === 'object' ? (user.id || user.userId) : user;
  const nomComplet = typeof user === 'object' ? `${user.prenom || ''} ${user.nom || ''}`.trim() : 'cet encadrant';

  confirm.require({
    header: 'Confirmation de suppression',
    message: `Voulez-vous vraiment supprimer définitivement ${nomComplet} ?`,
    icon: 'pi pi-exclamation-triangle',
    styleClass: 'confirm-delete-dialog',
    acceptLabel: 'Supprimer',
    rejectLabel: 'Annuler',
    acceptClass: 'btn btn-danger btn-sm ms-2',
    rejectClass: 'btn btn-outline-secondary btn-sm',
    accept: async () => {
      try {
        await api.delete(`User/admin/${userId}`);
        toast.add({
          severity: 'error',
          summary: 'Supprimé',
          detail: 'L\'utilisateur a été supprimé avec succès.',
          life: 3000
        });
        await loadSenseiData();
      } catch (err) {
        console.error(err);
        toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Échec de la suppression.',
          life: 4000
        });
      }
    }
  });
};

// --------------------
// Chargement des données
// --------------------
const loadSenseiData = async () => {
  try {
    const response = await api.get('User/admin/list');
    const allUsers = response.data || [];
    userList.value = allUsers.filter(user => user.roles.includes('Admin') || user.roles.includes('Sensei'));
  } catch (err) {
    error.value = 'Échec du rechargement de la liste des Sensei.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// --------------------
// Soumission du formulaire
// --------------------
const saveNewSensei = async () => {
  validationError.value = '';
  const disciplineIdNum = Number(selectedDiscipline.value);
  newSensei.value.disciplineId = disciplineIdNum;

  const isPasswordRequired = !editingUserId.value;

  if (!newSensei.value.nom || !newSensei.value.email || !disciplineIdNum || (isPasswordRequired && !newSensei.value.password)) {
    validationError.value = 'Veuillez remplir tous les champs obligatoires (Mot de passe requis pour l\'ajout).';
    return;
  }

  try {
    const formData = new FormData();
    for (const key in newSensei.value) {
      let value = newSensei.value[key];

      if (key === 'roles' || key === 'adresse') {
        continue;
      }

      if (key === 'password' && value === '') {
        continue;
      }

      if (key === 'dateDeNaissance' && value) {
        const dateObj = new Date(value);
        if (!isNaN(dateObj)) {
          value = dateObj.toISOString();
        } else {
          console.warn(`Date de naissance invalide : ${value}`);
          continue;
        }
      }

      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    }

    if (photoFile.value) {
      formData.append('PhotoFile', photoFile.value);
    }

if (editingUserId.value) {
      await api.put(`User/admin/${editingUserId.value}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.add({
        severity: 'success',
        summary: 'Mis à jour',
        detail: 'Informations enregistrées avec succès.',
        life: 3000
      });
    } else {
      await api.post('/User/register/sensei', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.add({
        severity: 'success',
        summary: 'Créé',
        detail: 'Nouveau Sensei créé avec succès.',
        life: 3000
      });
    }

    // 1. Retirer le focus du bouton actif avant de fermer (évite les bugs aria-hidden)
    const activeElement = document.activeElement;
    if (activeElement) {
      activeElement.blur();
    }

    // 2. Fermer la modale Bootstrap proprement
    const modalElement = document.getElementById('createAdherent');
    if (modalElement) {
      const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    }

    // 3. Recharger les données et réinitialiser
    await loadSenseiData();
    resetForm();

  }

  catch (err) {
    let errorMessage = 'Erreur lors de la sauvegarde. Veuillez réessayer.';
    if (err.response && err.response.data) {
      if (err.response.data.message) {
        errorMessage = `Erreur API: ${err.response.data.message}`;
      } else if (typeof err.response.data === 'string') {
        errorMessage = `Erreur: ${err.response.data}`;
      } else if (err.response.data.errors) {
        const errorKeys = Object.keys(err.response.data.errors);
        errorMessage = 'Erreur(s) de validation: ' + errorKeys.map(key => `${key}: ${err.response.data.errors[key].join(', ')}`).join('; ');
      }
    }
    validationError.value = errorMessage;
    console.error('Erreur API détaillée:', err);
  }
};

// --------------------
// Cycle de vie
// --------------------
onMounted(async () => {
  await loadSenseiData();

  try {
    const reponse = await api.get('/Discipline');
    disciplineList.value = reponse.data || [];
  } catch (err) {
    console.error("Erreur lors du chargement des disciplines:", err);
  }
});
</script>

<template>
  <div class="page-container">
    <Toast />
    <ConfirmDialog />

    <div class="content-wrapper">
      <!-- En-tête avec titre et bouton d'action -->
      <!-- ===============================
           🔹 EN-TÊTE
     ================================ -->
      <div class="page-header text-center mb-4">

        <div class="page-header-icon">
          <i class="pi pi-users"></i>
        </div>

        <h1>
          Gestion des Senseis
        </h1>

        <p>
          Gestion des encadrants,
          disciplines et informations des Senseis
        </p>

      </div>


      <!-- ===============================
     🔹 BARRE D'ACTIONS
================================ -->
      <div class="actions-bar">
        <button type="button" class="add-member-btn" data-bs-toggle="modal" data-bs-target="#createAdherent"
          @click="resetForm">
          <i class="pi pi-user-plus"></i>
          <span>
            Ajouter un Sensei
          </span>
        </button>
      </div>
      <SenseisStats :userList="userList" :disciplineList="disciplineList" />


      <!-- Modal de création / édition -->
      <div class="modal fade" id="createAdherent" tabindex="-1" aria-labelledby="createAdherentLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content custom-modal">
            <div class="modal-header">
              <h5 class="modal-title" id="createAdherentLabel">
                {{ editingUserId ? 'Modifier le Sensei' : 'Créer un nouveau Sensei' }}
              </h5>
              <button type="button" class="btn-close-custom" data-bs-dismiss="modal" aria-label="Fermer"
                @click="resetForm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div class="modal-body">
              <div v-if="validationError" class="alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{{ validationError }}</span>
              </div>

              <form @submit.prevent="saveNewSensei" id="senseiForm">
                <UserFormFields v-model="newSensei" :isPasswordRequired="!editingUserId" />
                <SenseiFormFields v-model="newSensei" v-model:selectedDiscipline="selectedDiscipline"
                  :disciplineList="disciplineList" @file-change="onFileChange" />
              </form>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-secondary" data-bs-dismiss="modal" @click="resetForm">
                Annuler
              </button>
              <button type="submit" form="senseiForm" class="btn-primary">
                {{ editingUserId ? 'Enregistrer les modifications' : 'Créer le Sensei' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- États de chargement & contenu principal -->
      <div v-if="loading" class="state-card loading-state">
        <div class="spinner"></div>
        <span>Chargement de la liste des Senseis...</span>
      </div>

      <div v-else-if="error" class="state-card error-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>{{ error }}</span>
      </div>

      <div v-else class="table-section">
        <div v-if="userList.length === 0" class="state-card empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <p>Aucun Sensei ou Administrateur trouvé pour le moment.</p>
        </div>

        <UserTable v-else :userList="userList" :getDisciplineName="getDisciplineName" @edit="handleEdit"
          @delete="handleDelete" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===============================
   🔹 LAYOUT PRINCIPAL
   =============================== */
.page-container {
  min-height: 100vh;
  background-color: #121417;
  color: #f1f3f5;
  padding: 2rem 1.5rem;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
   🔹 BOUTONS
   =============================== */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #ffbb33;
  color: #121417;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(255, 187, 51, 0.15);
}

.btn-primary:hover {
  background: #ffcc66;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(255, 187, 51, 0.25);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #a0a6b1;
  padding: 0.65rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
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
   🔹 MODALE PERSONNALISÉE
   =============================== */
.custom-modal {
  background-color: #1e2126;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  color: #f1f3f5;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.btn-close-custom {
  background: transparent;
  border: none;
  color: #8a919e;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.btn-close-custom:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 1.5rem;
  max-height: 75vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.alert-error {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid rgba(255, 71, 87, 0.25);
  color: #ff4757;
  padding: 0.85rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1.25rem;
}

/* ===============================
   🔹 ÉTATS DE CHARGEMENT ET ERREURS
   =============================== */
.table-section {
  animation: fadeIn 0.3s ease-out;
}



.state-card {
  background: #1e2126;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #8a919e;
  font-size: 0.95rem;
}

.error-state {
  color: #ff4757;
  border-color: rgba(255, 71, 87, 0.2);
  background: rgba(255, 71, 87, 0.05);
}

.empty-state {
  text-align: center;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 187, 51, 0.15);
  border-top-color: #ffbb33;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .page-container {
    padding: 1.25rem 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-titles {
    justify-content: space-between;
  }

  .btn-primary {
    justify-content: center;
    width: 100%;
  }





  /* ===============================
   BARRE D'ACTIONS
================================ */

  .actions-bar {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: rgba(33, 37, 41, 0.85);
    border: 1px solid #3c434a;
    border-radius: 12px;
    box-shadow:
      0 6px 20px rgba(0, 0, 0, 0.18);
  }


}
</style>

<!-- 🔹 STYLES GLOBAUX PRIMEVUE (NON SCOPED) -->
<!-- 🔹 STYLES GLOBAUX PRIMEVUE (NON SCOPED) -->
<style>
/* Modale de Confirmation globale */
.p-dialog,
.p-confirm-dialog {
  background-color: #181b20 !important;
  color: #f1f3f5 !important;
  border: 1px solid rgba(255, 255, 255, 0.06) !important;
  border-radius: 10px !important;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5) !important;
  width: 90% !important;
  max-width: 420px !important;
  overflow: hidden !important;
}

.p-dialog .p-dialog-header,
.p-confirm-dialog .p-dialog-header {
  background-color: #181b20 !important;
  color: #ffffff !important;
  padding: 1rem 1.25rem !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}

.p-dialog .p-dialog-title,
.p-confirm-dialog .p-dialog-title {
  color: #ffbb33 !important;
  font-weight: 600 !important;
  font-size: 1.05rem !important;
}

.p-dialog .p-dialog-header-icon,
.p-confirm-dialog .p-dialog-header-close {
  color: #8a919e !important;
  background: transparent !important;
  border: none !important;
}

.p-dialog .p-dialog-content,
.p-confirm-dialog .p-dialog-content {
  background-color: #181b20 !important;
  color: #e2e8f0 !important;
  padding: 1.25rem !important;
  display: flex !important;
  align-items: center !important;
  gap: 1rem !important;
  white-space: normal !important;
}

.p-dialog .p-dialog-footer,
.p-confirm-dialog .p-dialog-footer {
  background-color: #181b20 !important;
  padding: 0.75rem 1.25rem !important;
  border-top: 1px solid rgba(255, 255, 255, 0.04) !important;
  display: flex !important;
  justify-content: flex-end !important;
  align-items: center !important;
  gap: 0.5rem !important;
}

.p-dialog .p-dialog-footer button,
.p-confirm-dialog .p-dialog-footer button {
  white-space: nowrap !important;
}

/* 🔹 Modale Spécifique à la suppression (plus subtile) */
.confirm-delete-dialog {
  border: 1px solid rgba(220, 53, 69, 0.3) !important;
}

.confirm-delete-dialog .p-dialog-title {
  color: #ff6b6b !important;
}

.confirm-delete-dialog .p-confirm-dialog-icon {
  font-size: 1.5rem !important;
  color: #ff6b6b !important;
  flex-shrink: 0 !important;
}

.confirm-delete-dialog .p-confirm-dialog-message {
  margin: 0 !important;
  font-size: 0.9rem !important;
  word-break: break-word !important;
  white-space: normal !important;
  color: #cbd5e1 !important;
}

/* 🔹 Toasts (Notifications) plus fins et épurés */
.p-toast .p-toast-message {
  opacity: 1 !important;
  border-radius: 8px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4) !important;
  border-width: 0 !important;
  margin-bottom: 0.75rem !important;
}

.p-toast .p-toast-message.p-toast-message-error {
  background-color: rgba(220, 53, 69, 0.95) !important;
  color: #ffffff !important;
  border-left: 3px solid #ff4d4f !important;
}

.p-toast .p-toast-message.p-toast-message-success {
  background-color: rgba(25, 135, 84, 0.95) !important;
  color: #ffffff !important;
  border-left: 3px solid #2ecc71 !important;
}

.p-toast .p-toast-message.p-toast-message-info {
  background-color: rgba(13, 202, 240, 0.95) !important;
  color: #ffffff !important;
  border-left: 3px solid #38bdf8 !important;
}

.p-toast .p-toast-message .p-toast-message-content,
.p-toast .p-toast-message .p-toast-message-icon,
.p-toast .p-toast-message .p-toast-icon-close {
  color: #ffffff !important;
}
</style>
