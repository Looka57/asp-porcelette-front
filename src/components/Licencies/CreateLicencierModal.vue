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
      // Formatter la date de naissance correctement
      let dateNaissance = '';
      if (newUser.dateNaissance) {
        dateNaissance = newUser.dateNaissance.includes('T')
          ? newUser.dateNaissance.split('T')[0]
          : newUser.dateNaissance.substring(0, 10);
      }

      form.value = {
        nom: newUser.nom || '',
        prenom: newUser.prenom || '',
        email: newUser.email || '',
        telephone: newUser.telephone || '',
        adresse: newUser.rueEtNumero || '',  // ✅ Mapper RueEtNumero → adresse
        ville: newUser.ville || '',
        codePostal: newUser.codePostal || '',
        disciplineId: newUser.disciplineId || null,
        dateDeNaissance: dateNaissance,
        dateAdhesion: newUser.dateAdhesion || new Date().toISOString().split('T')[0],
        dateRenouvellement: newUser.dateRenouvellement || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        statut: newUser.statut === 1 ? "Actif" : "Inactif"
      };
    } else {
      // Réinitialisation pour création
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
        dateAdhesion: new Date().toISOString().split('T')[0],
        dateRenouvellement: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
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

  // =============================
  // 🔹 MODIFICATION (PUT)
  // =============================
  if (props.user && props.user.userId) {

    const formData = new FormData();

    // ✅ MAPPING CORRECT : Vue → C# DTO
    formData.append('Nom', form.value.nom || '');
    formData.append('Prenom', form.value.prenom || '');
    formData.append('Email', form.value.email || '');
    formData.append('Telephone', form.value.telephone || '');

    // 🎯 CORRECTION : Mapper correctement l'adresse
    formData.append('RueEtNumero', form.value.adresse || '');  // ✅ Était 'Adresse'
    formData.append('Ville', form.value.ville || '');
    formData.append('CodePostal', form.value.codePostal || '');

    // 🎯 CORRECTION : Date de naissance
    if (form.value.dateDeNaissance) {
      // Assurez-vous que la date est au format YYYY-MM-DD
      const dateFormatted = form.value.dateDeNaissance.includes('T')
        ? form.value.dateDeNaissance.split('T')[0]
        : form.value.dateDeNaissance;

      formData.append('DateDeNaissance', dateFormatted);
    } else {
      console.warn('⚠️ Pas de date de naissance à envoyer');
    }

    // Dates d'adhésion et renouvellement
    if (form.value.dateAdhesion) {
      const dateAdhesion = form.value.dateAdhesion.includes('T')
        ? form.value.dateAdhesion.split('T')[0]
        : form.value.dateAdhesion;
      formData.append('DateAdhesion', dateAdhesion);
    }

    if (form.value.dateRenouvellement) {
      const dateRenouvellement = form.value.dateRenouvellement.includes('T')
        ? form.value.dateRenouvellement.split('T')[0]
        : form.value.dateRenouvellement;
      formData.append('DateRenouvellement', dateRenouvellement);
    }

    // Discipline
    if (form.value.disciplineId) {
      formData.append('DisciplineId', form.value.disciplineId);
    }

    // Statut (convertir "Actif" en 1, "Inactif" en 0)
    // const statutValue = form.value.statut === 'Actif' || form.value.statut === 1 ? 1 : 0;
    // formData.append('Statut', statutValue);

    // Autres champs optionnels
    formData.append('Username', props.user.userName || props.user.email || '');
    formData.append('Grade', props.user.grade || '');
    formData.append('Bio', props.user.bio || '');

    // Ne pas envoyer PhotoUrl si vide (laisser le backend gérer)
    if (props.user.photoUrl) {
      formData.append('PhotoUrl', props.user.photoUrl);
    }

    try {
      const response = await api.put(`/User/admin/${props.user.userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('✅ Réponse du serveur:', response.data);
      alert('✅ Adhérent modifié avec succès !');
      emit('refresh');
      emit('close');

    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour:', err);
      console.error('❌ Détails:', err.response?.data);
      error.value = err.response?.data?.message ||
                    err.response?.data?.Message ||
                    "Erreur lors de la mise à jour de l'adhérent.";
      alert(error.value);
    }
  }

  // =============================
  // 🔹 CRÉATION (POST)
  // =============================
  else {
    try {
      const createPayload = {
        Nom: form.value.nom,
        Prenom: form.value.prenom,
        Email: form.value.email,
        Telephone: form.value.telephone,
        Adresse: form.value.adresse,  // Pour la création, le backend attend 'Adresse'
        Ville: form.value.ville,
        CodePostal: form.value.codePostal,
        DisciplineId: form.value.disciplineId,
        DateDeNaissance: form.value.dateDeNaissance,
        DateAdhesion: form.value.dateAdhesion,
      };

      await api.post('User/register/adherent', createPayload);
      alert('✅ Adhérent créé avec succès !');
      emit('refresh');
      emit('close');

    } catch (err) {
      console.error('❌ Erreur lors de la création:', err);
      const apiMessage = err.response?.data?.Message ||
                        err.response?.data?.message ||
                        "Erreur lors de l'enregistrement du nouvel adhérent.";
      error.value = apiMessage;
      alert(apiMessage);
    }
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
