<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';
import SenseiFormFields from '@/components/SenseiFormFields.vue';
import UserFormFields from '@/components/UserFormFields.vue';
import UserTable from '@/components/UserTable.vue';

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
  adresse: '',
  ville: '',
  codePostal: '',
  telephone: '',
  email: '',
  password: '',
  grade: '',
  dateNaissance: '',
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
    adresse: '',
    ville: '',
    codePostal: '',
    telephone: '',
    grade: '',
    dateNaissance: '',
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
};


// --------------------
// Événements from child components / actions utilisateur
// --------------------
const handleEdit = (event) => {
  console.log('Événement reçu:', event);
};

const handleDelete = async (userId) => {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
    return;
  }
  try {
    await api.delete(`User/${userId}`);
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
// Soumission du formulaire (création Sensei)
// --------------------
const saveNewSensei = async () => {
  validationError.value = '';
  const disciplineIdNum = Number(selectedDiscipline.value);
  newSensei.value.disciplineId = disciplineIdNum;

  if (!newSensei.value.nom || !newSensei.value.email || !newSensei.value.password || !disciplineIdNum) {
    validationError.value = 'Veuillez remplir tous les champs obligatoires : Nom, Email, Mot de passe et Discipline.';
    return;
  }

  try {
    const formData = new FormData();
    for (const key in newSensei.value) {
      if (newSensei.value[key] !== null && key !== 'roles') {
        formData.append(key, newSensei.value[key]);
      }
    }
    if (photoFile.value) {
      formData.append('PhotoFile', photoFile.value);
    }

    const response = await api.post('/User/register/sensei', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    alert('Nouveau Sensei créé avec succès !');
    console.log('Réponse de l\'API:', response.data);

    await loadSenseiData();
    resetForm();
  }
  catch (err) {
    let errorMessage = 'Erreur lors de la création du Sensei. Veuillez réessayer.';
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

    <!-- --------------------
         Bouton : ouvrir modal création
         -------------------- -->
    <button class="mb-3 btn btn-outline-warning d-flex align-items-center" data-bs-toggle="modal"
      data-bs-target="#createAdherent">
      <i class="pi pi-plus-circle me-2"></i> Ajout Sensei
    </button>

    <!-- --------------------
         Modal : création d'un Sensei
         -------------------- -->
    <div class="modal fade" id="createAdherent" tabindex="-1" aria-labelledby="createAdherentLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content modalDesign bg-light text-dark rounded-lg shadow-2xl">
          <div class="modal-header border-b-2 border-gray-200">
            <h1 class="modal-title fs-5" id="createrAdherentHeader">Créer un nouveau Sensei</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
              @click="resetForm"></button>
          </div>
          <div class="modal-body">
            <!-- Message d'erreur -->
            <div v-if="validationError" class="alert alert-danger" role="alert">
              {{ validationError }}
            </div>

            <form @submit.prevent="saveNewSensei">
              <UserFormFields v-model="newSensei" :isPasswordRequired="true" />
              <SenseiFormFields v-model="newSensei" v-model:selectedDiscipline="selectedDiscipline"
                :disciplineList="disciplineList" @file-change="onFileChange" />

              <!-- --------------------
                   Footer du modal : actions
                   -------------------- -->
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

    <!-- --------------------
         Affichage : tableau des Sensei / états
         -------------------- -->
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
