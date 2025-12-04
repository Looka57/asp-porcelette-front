<script setup>
import { ref, onMounted } from 'vue'; // Ajout de 'computed'
import api from '@/api/axios';
import SenseiFormFields from '@/components/Senseis/SenseiFormFields.vue';
import UserFormFields from '@/components/Users/UserFormFields.vue';
import UserTable from '@/components/Users/UserTable.vue';

// --------------------
// Références / état local
// --------------------
const userList = ref([]);
const selectedDiscipline = ref('');
const disciplineList = ref([]);
const loading = ref(true);
const error = ref(null);
const photoFile = ref(null);
const validationError = ref(''); // erreurs de validation affichées dans le modal
const editingUserId = ref(null); // ID de l'utilisateur en cours d'édition

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
  rueEtNumero: '', // 🟢 Utilise RueEtNumero
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
    rueEtNumero: '', // 🟢 CORRECTION: Doit être 'rueEtNumero' pour correspondre au modèle initial
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
  editingUserId.value = null; // Réinitialiser l'ID en cours d'édition
  photoFile.value = null; // Réinitialiser la photo
};

// --------------------
// Événements from child components / actions utilisateur
// --------------------
const handleEdit = (user) => {
  editingUserId.value = user.id || user.userId; // Stocker l'ID de l'utilisateur en cours d'édition

  // Copier les données de l'utilisateur. L'opérateur de décomposition gère
  // ville et codePostal si les noms correspondent (camelCase).
  newSensei.value = {
    ...user,
    // Assurer que le champ d'adresse est mis à jour avec le bon nom
    rueEtNumero: user.rueEtNumero || user.adresse || '',
    bio: user.bio,
    password: '', // Ne pas préremplir le mot de passe
    dateDeNaissance: user.dateDeNaissance || ''
  };

  selectedDiscipline.value = user.disciplineId ? String(user.disciplineId) : ''; // Mettre à jour la discipline sélectionnée
  newSensei.value.password = ''; // Re-vérification de sécurité (déjà dans le spread)

  const modalElement = document.getElementById('createAdherent');
  if (modalElement) {
    // L'objet window.bootstrap est normalement disponible si vous utilisez la librairie JS
    const modal = new window.bootstrap.Modal(modalElement);
    modal.show();
  }

};

const handleDelete = async (userId) => {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
    return;
  }
  try {
    await api.delete(`User/admin/${userId}`);
    alert('Utilisateur supprimé avec succès.');
    await loadSenseiData();
  } catch (err) {
    alert('Erreur lors de la suppression de l\'utilisateur.');
    console.error(err);
  }
};

// --------------------
// Chargement / rechargement des données
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
// Soumission du formulaire (création / modification Sensei)
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

      // Ignorer les clés non pertinentes
      if (key === 'roles' || key === 'adresse') { // 🟢 AJOUT: Ignorer l'ancien nom 'adresse'
        continue;
      }

      // Ignorer le mot de passe s'il est vide (uniquement en mode édition)
      if (key === 'password' && value === '') {
        continue;
      }

      // 💡 CORRECTION POUR LA DATE DE NAISSANCE
     if (key === 'dateDeNaissance' && value) {
        // 'value' est au format 'YYYY-MM-DD'.
        const dateObj = new Date(value);
        if (!isNaN(dateObj)) {
            // Envoyer la date au format ISO 8601 complet (ex: 1985-05-17T00:00:00.000Z)
            // C# gère mieux la désérialisation de ce format
            value = dateObj.toISOString();
        } else {
            console.warn(`Date de naissance invalide trouvée : ${value}`);
            continue;
        }
    }
    // ...

    if (value !== null) {
        // C'est ici que la valeur ISO formatée sera ajoutée si 'key' était 'dateDeNaissance'
        formData.append(key, value);
    }

      if (value !== null) {
        // Envoie les clés en camelCase (nom, prenom, rueEtNumero, ville, codePostal, etc.)
        formData.append(key, value);
      }
    }

    if (photoFile.value) {
      formData.append('PhotoFile', photoFile.value);
    }

    let response; // Déclaration unique de la variable de portée de bloc
    let successMessage;

    if (editingUserId.value) {
      // REQUÊTE PUT (MODIFICATION)
      response = await api.put(`User/admin/${editingUserId.value}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      successMessage = 'Sensei mis à jour avec succès !';
    } else {
      // REQUÊTE POST (CRÉATION)
      response = await api.post('/User/register/sensei', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      successMessage = 'Nouveau Sensei créé avec succès !';
    }

    console.log('Réponse de l\'API:', response.data);
    alert(successMessage);

    // Fermeture du modal (nécessite l'API JS de Bootstrap)
    const modalElement = document.getElementById('createAdherent');
    if (modalElement) {
      const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) modalInstance.hide();
    }

    await loadSenseiData();
    resetForm(); // Réinitialise l'état d'édition
  }
  catch (err) {
    let errorMessage = 'Erreur lors de la création/modification du Sensei. Veuillez réessayer.';
    if (err.response && err.response.data) {
      if (err.response.data.message) {
        errorMessage = `Erreur API: ${err.response.data.message}`;
      } else if (typeof err.response.data === 'string') {
        errorMessage = `Erreur de validation: ${err.response.data}`;
      } else if (err.response.data.errors) {
        const errorKeys = Object.keys(err.response.data.errors);
        errorMessage = 'Erreur(s) de validation des champs: ' + errorKeys.map(key => `${key}: ${err.response.data.errors[key].join(', ')}`).join('; ');
      }
    }
    validationError.value = errorMessage;
    console.error('Erreur API détaillée:', err);
  }
};

// --------------------
// Cycle de vie : montage
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
  <div class="container-fluid bg-dark text-white min-h-screen p-4">
    <h1 class="m-3 text-center">Liste des Senseis</h1>
    <button class="mb-3 btn btn-outline-warning d-flex align-items-center" data-bs-toggle="modal"
      data-bs-target="#createAdherent">
      <i class="pi pi-plus-circle me-2"></i> Ajout Sensei
    </button>

    <div class="modal fade" id="createAdherent" tabindex="-1" aria-labelledby="createAdherentLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content modalDesign bg-light text-dark rounded-lg shadow-2xl">
          <div class="modal-header border-b-2 border-gray-200">
            <h1 class="modal-title fs-5" id="createrAdherentHeader">
              {{ editingUserId ? 'Modifier le Sensei' : 'Créer un nouveau Sensei' }}
            </h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
              @click="resetForm"></button>
          </div>
          <div class="modal-body">
            <div v-if="validationError" class="alert alert-danger" role="alert">
              {{ validationError }}
            </div>

            <form @submit.prevent="saveNewSensei">
              <UserFormFields v-model="newSensei" :isPasswordRequired="!editingUserId" />
              <SenseiFormFields v-model="newSensei" v-model:selectedDiscipline="selectedDiscipline"
                :disciplineList="disciplineList" @file-change="onFileChange" />
              <div class="modal-footer border-t-2 border-gray-200">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                  @click="resetForm">Fermer</button>
                <button type="submit" class="btn btn-warning">Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-secondary p-4 text-center">Chargement de la liste des Sensei...</div>
    <div v-else-if="error" class="text-red-600 p-4 border rounded bg-danger bg-opacity-10">{{ error }}</div>
    <div v-else>
      <div v-if="userList.length === 0" class="text-light p-4 border rounded bg-dark-subtle text-center">
        Aucun Sensei ou Admin trouvé pour le moment.
      </div>
      <div v-else>
        <UserTable :userList="userList" :getDisciplineName="getDisciplineName" @edit="handleEdit"
          @delete="handleDelete" />

      </div>
    </div>
  </div>
</template>

<style scoped>
/* --------------------
Styles locaux du composant
-------------------- */
.modalDesign {
  background-color: #f8f9fa;
  color: #212529;
}
</style>
