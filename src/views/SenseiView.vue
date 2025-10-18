<script setup>
import { ref, onMounted } from 'vue';
// Assurez-vous que l'importation de l'API est correcte pour votre projet
import api from '@/api/axios';

const userList = ref([]);
const selectedDiscipline = ref('');
const discplineList = ref([]);
const loading = ref(true);
const error = ref(null);
const photoFile = ref(null);
// Nouvelle référence pour afficher les erreurs de validation dans le modal
const validationError = ref('');

const getTodayDateISO = () => {
  const now = new Date();
  // Format YYYY-MM-DD
  return now.toISOString().split('T')[0];
};


const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Si vous devez uploader le fichier séparément, gardez cette référence
    photoFile.value = file;
    // Mise à jour de photoUrl pour l'affichage de l'aperçu si nécessaire
    // Le backend devra gérer l'upload de photoFile.value
    // newSensei.value.photoUrl = URL.createObjectURL(file);
  }
};

// Modèle des données pour le nouveau Sensei
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

// NOUVELLE FONCTION : Trouve le nom de la discipline à partir de son ID
const getDisciplineName = (disciplineId) => {
  // On utilise find() sur la liste chargée pour le formulaire
  const discipline = discplineList.value.find(d => d.disciplineId === disciplineId);
  // Retourne le nom trouvé ou une valeur par défaut si l'ID n'est pas trouvé ou manquant
  return discipline ? discipline.nom : 'N/A';
};

// Fonction pour réinitialiser le formulaire après l'enregistrement
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
  validationError.value = ''; // Réinitialiser l'erreur de validation
};

// Fonction utilitaire pour recharger la liste des Sensei après ajout/modification
const loadSenseiData = async () => {
  try {
    const response = await api.get('User/admin/list');
    const allUsers = response.data || [];
    // Filtrer pour n'afficher que les administrateurs et les Senseis
    userList.value = allUsers.filter(user => user.roles.includes('Admin') || user.roles.includes('Sensei'));
  } catch (err) {
    error.value = 'Échec du rechargement de la liste des Sensei.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

const saveNewSensei = async () => {
  validationError.value = ''; // Effacer les erreurs précédentes

  // 1. Assigner l'ID de la discipline sélectionnée
  // On convertit en nombre
  const disciplineIdNum = Number(selectedDiscipline.value);
  newSensei.value.disciplineId = disciplineIdNum;

  // 2. Validation front-end (champs obligatoires)
  if (!newSensei.value.nom || !newSensei.value.email || !newSensei.value.password || !disciplineIdNum) {
    validationError.value = 'Veuillez remplir tous les champs obligatoires : Nom, Email, Mot de passe et Discipline.';
    return;
  }

  try {
    // Envoi des données.
    const response = await api.post('/User/register/sensei', newSensei.value);

    // Si vous utilisez Bootstrap 5 JS, vous pouvez décommenter et adapter ce bloc pour fermer le modal
    // const modalElement = document.getElementById('createAdherent');
    // if (modalElement && window.bootstrap) {
    //   const modalInstance = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
    //   modalInstance.hide();
    // }

    alert('Nouveau Sensei créé avec succès !');
    console.log('Réponse de l\'API:', response.data);

    await loadSenseiData();
    resetForm();
  }
  catch (err) {
    // Gestion détaillée des erreurs API
    let errorMessage = 'Erreur lors de la création du Sensei. Veuillez réessayer.';
    if (err.response && err.response.data) {
      if (err.response.data.message) {
        errorMessage = `Erreur API: ${err.response.data.message}`;
      } else if (typeof err.response.data === 'string') {
        errorMessage = `Erreur de validation: ${err.response.data}`;
      } else if (err.response.data.errors) {
        // Gestion des erreurs de validation de modèle C#
        const errorKeys = Object.keys(err.response.data.errors);
        errorMessage = 'Erreur(s) de validation des champs: ' + errorKeys.map(key => `${key}: ${err.response.data.errors[key].join(', ')}`).join('; ');
      }
    }
    validationError.value = errorMessage; // Afficher l'erreur dans le modal
    console.error('Erreur API détaillée:', err);
  }
};

onMounted(async () => {
  await loadSenseiData();

  // Chargement des disciplines
  try {
    const reponse = await api.get('/Discipline');
    discplineList.value = reponse.data || [];
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

    <!-- ==================== -->
    <!-- Modal -->
    <!-- ================== -->
    <div class="modal fade" id="createAdherent" tabindex="-1" aria-labelledby="createAdherentLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content modalDesign bg-light text-dark rounded-lg shadow-2xl">
          <div class="modal-header border-b-2 border-gray-200">
            <h1 class="modal-title fs-5" id="createrAdherentHeader">Créer un nouveau Sensei</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="resetForm"></button>
          </div>
          <div class="modal-body">
            <!-- Message d'erreur de validation (affiché si validationError n'est pas vide) -->
            <div v-if="validationError" class="alert alert-danger" role="alert">
              {{ validationError }}
            </div>

            <form @submit.prevent="saveNewSensei">
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="name" class="form-label">Nom <span class="text-danger">*</span></label>
                  <input v-model="newSensei.nom" type="text" class="form-control" id="name" placeholder="Nom du Sensei"
                    required>
                </div>
                <div class="col-md-6">
                  <label for="LastName" class="form-label">Prénom</label>
                  <input v-model="newSensei.prenom" type="text" class="form-control" id="LastName"
                    placeholder="Prénom du Sensei">
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="Email" class="form-label">Email <span class="text-danger">*</span></label>
                  <input v-model="newSensei.email" type="email" class="form-control" id="Email"
                    placeholder="email@example.com" required>
                </div>
                <div class="col-md-6">
                  <label for="Password" class="form-label">Mot de passe <span class="text-danger">*</span></label>
                  <input v-model="newSensei.password" type="password" class="form-control" id="Password"
                    placeholder="Définir un mot de passe initial" required>
                </div>
              </div>

              <div class="mb-3">
                <label for="Adress" class="form-label">Adresse</label>
                <input v-model="newSensei.adresse" type="text" class="form-control" id="Adress"
                  placeholder="Rue et numéro">
              </div>

              <div class="row mb-3">
                <div class="col-md-4">
                  <label for="City" class="form-label">Ville</label>
                  <input v-model="newSensei.ville" type="text" class="form-control" id="City" placeholder="Ville">
                </div>
                <div class="col-md-4">
                  <label for="CP" class="form-label">Code postal</label>
                  <input v-model="newSensei.codePostal" type="text" class="form-control" id="CP"
                    placeholder="Code postal">
                </div>
                <div class="col-md-4">
                  <label for="Phone" class="form-label">Téléphone</label>
                  <input v-model="newSensei.telephone" type="text" class="form-control" id="Phone"
                    placeholder="Téléphone">
                </div>
              </div>

              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="Grade" class="form-label">Grade</label>
                  <input v-model="newSensei.grade" type="text" class="form-control" id="Grade"
                    placeholder="Grade actuel">
                </div>
                <div class="col-md-6">
                  <label for="Birth" class="form-label">Date de naissance</label>
                  <input v-model="newSensei.dateNaissance" type="date" class="form-control" id="Birth"
                    placeholder="JJ/MM/AAAA">
                </div>
              </div>

              <div class="mb-3">
                <label for="Discipline" class="form-label">Discipline <span class="text-danger">*</span></label>
                <select class="form-control" v-model="selectedDiscipline" name="discipline" id="Discipline" required>
                  <option value="">-- Choisir une discipline --</option>
                  <option v-for="discipline in discplineList" :key="discipline.disciplineId"
                    :value="discipline.disciplineId">
                    {{ discipline.nom }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="Bio" class="form-label">Biographie</label>
                <textarea v-model="newSensei.bio" class="form-control" id="Bio" rows="3"></textarea>
              </div>
              <div class="mb-3">
                <label for="PhotoUrl" class="form-label">Télecharger une photo</label>
                <input type="file" class="form-control" id="PhotoUrl" accept="image/*" @change="onFileChange">
              </div>
              <!-- Les boutons de soumission sont à l'intérieur du formulaire, c'est CORRECT -->
              <div class="modal-footer border-t-2 border-gray-200">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="resetForm">Fermer</button>
                <button type="submit" class="btn btn-warning">Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== -->
    <!-- Tableau -->
    <!-- ================== -->
    <div v-if="loading" class="text-secondary p-4 text-center">Chargement de la liste des Sensei...</div>
    <div v-else-if="error" class="text-red-600 p-4 border rounded bg-danger bg-opacity-10">{{ error }}</div>
    <div v-else>
      <div v-if="userList.length === 0" class="text-light p-4 border rounded bg-dark-subtle text-center">
        Aucun Sensei ou Admin trouvé pour le moment.
      </div>

      <div v-else class="table-responsive">
        <table class="table table-dark table-striped table-hover align-middle text-center  overflow-hidden">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nom</th>
              <th scope="col">Prénom</th>
              <th scope="col">Email</th>
              <th scope="col">Téléphone</th>
              <th scope="col">Adresse</th>
              <th scope="col">Ville</th>
              <th scope="col">Statut</th>
              <th scope="col">Discipline</th>
              <th scope="col" style="width: 250px;">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in userList" :key="user.userId">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ user.nom }}</td>
              <td>{{ user.prenom }}</td>
              <td>{{ user.email || 'N/A' }}</td>
              <td>{{ user.telephone || 'N/A' }}</td>
              <td>{{ user.adresse || 'N/A' }}</td>
              <td>{{ user.ville || 'N/A' }}</td>
              <td>{{ user.statut || 'N/A' }}</td>
              <!-- Correction: Assumer que la discipline est soit un objet avec .nom, soit une propriété simple.
                   J'utilise user.disciplineNom, qui est une convention courante. -->
              <td>{{ getDisciplineName(user.disciplineId) }}</td>

              <td>
                <button class="btn btn-outline-info mx-2">
                  <i class="pi pi-pencil"></i> Modifier
                </button>
                <button class="btn btn-outline-danger">
                  <i class="pi pi-trash"></i> Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles spécifiques au composant peuvent être ajoutés ici si nécessaire */

.modalDesign {
  /* Assurez-vous que l'arrière-plan du modal s'accorde bien avec le texte */
  background-color: #f8f9fa;
  color: #212529;
}
</style>
