<script setup>
import { ref, watch } from 'vue';
import api from '@/api/axios';

const props = defineProps({
  show: Boolean,
  disciplineList: {
    type: Array,
    default: () => []
  },
  user: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'refresh']);

const loading = ref(false);
const error = ref(null);

const form = ref({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  adresse: '',
  ville: '',
  codePostal: '',
  disciplineId: null,
  dateDeNaissance: '',
  dateAdhesion: new Date().toISOString(),
  dateRenouvellement: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
  statut: "Actif"
});

// 🔹 Watch pour préremplir ou réinitialiser
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      form.value = {
        nom: newUser.nom || '',
        prenom: newUser.prenom || '',
        email: newUser.email || '',
        telephone: newUser.telephone || '',
        adresse: newUser.rueEtNumero || '',
        ville: newUser.ville || '',
        codePostal: newUser.codePostal || '',
        disciplineId: newUser.disciplineId || null,
        dateDeNaissance: newUser.dateNaissance || '',
        dateAdhesion: newUser.dateAdhesion || new Date().toISOString(),
        dateRenouvellement: newUser.dateRenouvellement || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        statut: newUser.statut || "Actif"
      };
    } else {
      form.value = {
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: '',
        ville: '',
        codePostal: '',
        disciplineId: null,
        dateDeNaissance: '',
        dateAdhesion: new Date().toISOString(),
        dateRenouvellement: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        statut: "Actif"
      };
    }
  },
  { immediate: true }
);

// Dans CreateLicencierModal.vue (autour de la ligne 80)

// Fichier : CreateLicencierModal.vue

const submitAdherent = async () => {
    loading.value = true;
    error.value = null;

    // Si c'est une MODIFICATION (PUT)
    if (props.user && props.user.userId) {

        const formData = new FormData();

        // 2. Ajoutez chaque champ du payload au FormData
        // Note : J'ai retiré le UserId de la route PUT car il est déjà dans l'URL,
        // mais nous allons le laisser car votre DTO C# pourrait l'exiger.
        formData.append('UserId', props.user.userId);
        formData.append('Nom', form.value.nom);
        formData.append('Prenom', form.value.prenom);
        formData.append('Email', form.value.email);
        formData.append('Telephone', form.value.telephone);

        // Assurez-vous que les dates sont envoyées dans un format correct, idéalement YYYY-MM-DD
        // Utilisez le format de date ISO pour les dates
        formData.append('DateDeNaissance', form.value.dateDeNaissance);

        // Mappage d'adresse/ville/code postal
        formData.append('Adresse', form.value.adresse);
        formData.append('Ville', form.value.ville);
        formData.append('CodePostal', form.value.codePostal);

        // Mappage de DisciplineId
        if (form.value.disciplineId) {
            // Assurez-vous que l'ID est un nombre ou une chaîne simple
            formData.append('DisciplineId', form.value.disciplineId);
        } else {
            // Si la DisciplineId est requise mais manquante (cela pourrait causer un 400)
            formData.append('DisciplineId', '');
        }

        // Mappage des autres champs pour le DTO C# (UserAdminUpdateDto)
        formData.append('Statut', form.value.statut);
        formData.append('Username', props.user.userName || props.user.email);
        formData.append('Grade', props.user.grade || '');
        formData.append('Bio', props.user.bio || '');
        formData.append('PhotoUrl', props.user.photoUrl || '');
        formData.append('DateAdhesion', form.value.dateAdhesion);
        formData.append('DateRenouvellement', form.value.dateRenouvellement);


        try {
            // PUT /api/User/admin/{id}
            await api.put(`/User/admin/${props.user.userId}`, formData);
        } catch (err) { // <--- Bloc catch correctement placé
            console.error('Erreur lors de la mise à jour :', err);
            // Si le serveur retourne un message d'erreur spécifique, essayez de l'afficher
            error.value = err.response?.data?.message || "Erreur lors de la mise à jour de l'adhérent.";
        }
    }
    // Si c'est une CRÉATION (POST)
    else {
        // Pour la création, vous pouvez laisser le spread car le backend attend généralement le formulaire complet.
        const createPayload = { ...form.value };
        try {
            // Note: Si la route POST /User/register/adherent attend aussi du [FromForm], vous devrez utiliser FormData ici aussi !
            await api.post('User/register/adherent', createPayload);
        } catch (err) {
            console.error('Erreur lors de l\'enregistrement :', err);
            error.value = err.response?.data?.message || "Erreur lors de l'enregistrement du nouvel adhérent.";
        }
    }

    // Gestion du succès / nettoyage
    if (!error.value) {
        emit('refresh');
        emit('close');
        console.log("✅ Adhérent enregistré/modifié avec succès !");
    }
    loading.value = false;
};


</script>

<template>
  <div v-if="show" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-lg">
      <div class="modal-content bg-dark text-light">
        <div class="modal-header border-secondary">
          <h5 class="modal-title">{{ props.user ? 'Modifier Adhérent' : 'Nouvel Adhérent' }}</h5>
          <button type="button" class="btn-close btn-close-white" @click="emit('close')"></button>
        </div>

        <div class="modal-body">
          <div v-if="error" class="alert alert-danger">{{ error }}</div>

          <form @submit.prevent="submitAdherent">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Nom</label>
                <input v-model="form.nom" type="text" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Prénom</label>
                <input v-model="form.prenom" type="text" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input v-model="form.email" type="email" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Téléphone</label>
                <input v-model="form.telephone" type="text" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Date de Naissance</label>
                <input v-model="form.dateDeNaissance" type="date" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Adresse</label>
                <input v-model="form.adresse" type="text" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Ville</label>
                <input v-model="form.ville" type="text" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Code Postal</label>
                <input v-model="form.codePostal" type="text" class="form-control" />
              </div>
              <div class="col-md-12 mb-3">
                <label class="form-label">Discipline <span class="text-danger">*</span></label>
                <select v-model="form.disciplineId" class="form-control" required>
                  <option value="">-- Choisir une discipline --</option>
                  <option v-for="d in disciplineList" :key="d.disciplineId" :value="d.disciplineId">
                    {{ d.nom }}
                  </option>
                </select>
              </div>
            </div>

            <div class="mt-4 text-end">
              <button type="button" class="btn btn-outline-light me-2" @click="emit('close')">Annuler</button>
              <button type="submit" class="btn btn-warning" :disabled="loading">
                <span v-if="!loading">{{ props.user ? 'Modifier' : 'Ajouter' }}</span>
                <span v-else>Envoi...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  overflow-y: auto;
}
</style>
