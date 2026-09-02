<script setup>
import { ref, watch, computed } from 'vue';
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

  dateAdhesion: new Date().toISOString().split('T')[0],

  dateRenouvellement: new Date(
    new Date().setFullYear(new Date().getFullYear() + 1)
  ).toISOString().split('T')[0],

  // =============================
  // 🔹 CERTIFICAT MÉDICAL
  // =============================
  certificatMedicalFourni: false,
  dateCertificatMedical: '',
  dateExpirationCertificatMedical: '',

  statut: 'Actif'
});

/* --------------------------------------------------------------------------
 🔒 FONCTIONS UTILES
-------------------------------------------------------------------------- */

// Formater une date pour un input type="date"
const formatDateForInput = (date) => {
  if (!date) return '';

  if (typeof date === 'string') {
    return date.includes('T')
      ? date.split('T')[0]
      : date.substring(0, 10);
  }

  return '';
};



const ageAdherent = computed(() => {
  if (!form.value.dateDeNaissance) {
    return null;
  }

  const naissance = new Date(form.value.dateDeNaissance);
  const aujourdHui = new Date();

  let age = aujourdHui.getFullYear() - naissance.getFullYear();

  const mois = aujourdHui.getMonth() - naissance.getMonth();

  if (
    mois < 0 ||
    (mois === 0 && aujourdHui.getDate() < naissance.getDate())
  ) {
    age--;
  }

  return age;
});



// Calcul de la date d'expiration du certificat
// Le frontend l'utilise uniquement pour l'affichage.
// Le backend reste responsable de l'enregistrer.
const dateExpirationCertificatMedical = computed(() => {
  if (!form.value.dateCertificatMedical) {
    return '';
  }

  const [year, month, day] = form.value.dateCertificatMedical
    .split('-')
    .map(Number);

  let expirationYear = year + 3;
  let expirationDay = day;

  // Cas particulier du 29 février
  // Exemple : 29/02/2024 → 28/02/2027
  if (
    month === 2 &&
    day === 29 &&
    !(
      expirationYear % 4 === 0 &&
      (expirationYear % 100 !== 0 || expirationYear % 400 === 0)
    )
  ) {
    expirationDay = 28;
  }

  return `${expirationYear}-${String(month).padStart(2, '0')}-${String(
    expirationDay
  ).padStart(2, '0')}`;
});

watch(
  dateExpirationCertificatMedical,
  (newDate) => {
    form.value.dateExpirationCertificatMedical = newDate;
  }
);

// Réinitialiser le formulaire
const clearForm = () => {
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

    dateRenouvellement: new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    ).toISOString().split('T')[0],

    // =============================
    // 🔹 CERTIFICAT MÉDICAL
    // =============================
    certificatMedicalFourni: false,
    dateCertificatMedical: '',

    statut: 'Actif'
  };

  error.value = null;
};

/* --------------------------------------------------------------------------
 🔹 PRÉREMPLISSAGE DU FORMULAIRE
-------------------------------------------------------------------------- */

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

        dateDeNaissance:
          formatDateForInput(newUser.dateNaissance),

        dateAdhesion:
          formatDateForInput(newUser.dateAdhesion) ||
          new Date().toISOString().split('T')[0],

        dateRenouvellement:
          formatDateForInput(newUser.dateRenouvellement) ||
          new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ).toISOString().split('T')[0],

        // =============================
        // 🔹 CERTIFICAT MÉDICAL
        // =============================
        certificatMedicalFourni:
          newUser.certificatMedicalFourni ?? false,

        dateCertificatMedical:
          formatDateForInput(newUser.dateCertificatMedical),

        statut:
          newUser.statut === 1
            ? 'Actif'
            : 'Inactif'
      };
    } else {
      clearForm();
    }
  },

  { immediate: true }
);

/* --------------------------------------------------------------------------
 🔹 CRÉATION / MODIFICATION
-------------------------------------------------------------------------- */

const submitAdherent = async () => {
  loading.value = true;
  error.value = null;

  // =============================
  // 🔹 MODIFICATION (PUT)
  // =============================

  if (props.user && props.user.userId) {
    const formData = new FormData();

    // =============================
    // INFORMATIONS PERSONNELLES
    // =============================

    formData.append(
      'Nom',
      form.value.nom || ''
    );

    formData.append(
      'Prenom',
      form.value.prenom || ''
    );

    formData.append(
      'Email',
      form.value.email || ''
    );

    formData.append(
      'Telephone',
      form.value.telephone || ''
    );

    // Adresse
    formData.append(
      'RueEtNumero',
      form.value.adresse || ''
    );

    formData.append(
      'Ville',
      form.value.ville || ''
    );

    formData.append(
      'CodePostal',
      form.value.codePostal || ''
    );

    // =============================
    // DATE DE NAISSANCE
    // =============================

    if (form.value.dateDeNaissance) {
      formData.append(
        'DateDeNaissance',
        form.value.dateDeNaissance
      );
    }

    // =============================
    // ADHÉSION
    // =============================

    if (form.value.dateAdhesion) {
      formData.append(
        'DateAdhesion',
        form.value.dateAdhesion
      );
    }

    if (form.value.dateRenouvellement) {
      formData.append(
        'DateRenouvellement',
        form.value.dateRenouvellement
      );
    }

    // =============================
    // DISCIPLINE
    // =============================

    if (form.value.disciplineId) {
      formData.append(
        'DisciplineId',
        form.value.disciplineId
      );
    }

    // =============================
    // 🔹 CERTIFICAT MÉDICAL
    // =============================
    formData.append(
      'CertificatMedicalFourni',
      form.value.certificatMedicalFourni
        ? 'true'
        : 'false'
    );

    if (form.value.certificatMedicalFourni) {

      // Date du certificat
      if (form.value.dateCertificatMedical) {
        formData.append(
          'DateCertificatMedical',
          form.value.dateCertificatMedical
        );
      }

      // Date d'expiration calculée par Vue
      if (dateExpirationCertificatMedical.value) {
        formData.append(
          'DateExpirationCertificatMedical',
          dateExpirationCertificatMedical.value
        );
      }
    }

    // =============================
    // AUTRES CHAMPS
    // =============================

    formData.append(
      'Username',
      props.user.userName ||
      props.user.email ||
      ''
    );

    formData.append(
      'Grade',
      props.user.grade || ''
    );

    formData.append(
      'Bio',
      props.user.bio || ''
    );

    // Photo existante
    if (props.user.photoUrl) {
      formData.append(
        'PhotoUrl',
        props.user.photoUrl
      );
    }

    // =============================
    // ENVOI API
    // =============================

    try {
      console.log(
        '🔵 DATE CERTIFICAT :',
        form.value.dateCertificatMedical
      );

      console.log(
        '🔵 DATE EXPIRATION CALCULÉE FRONT :',
        dateExpirationCertificatMedical.value
      );

      const response = await api.put(
        `/User/admin/${props.user.userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log(
        '✅ Réponse du serveur:',
        response.data
      );

      alert(
        '✅ Adhérent modifié avec succès !'
      );

      emit('refresh');
      emit('close');

    } catch (err) {
      console.error(
        '❌ Erreur lors de la mise à jour:',
        err
      );

      console.error(
        '❌ Détails:',
        err.response?.data
      );

      error.value =
        err.response?.data?.message ||
        err.response?.data?.Message ||
        "Erreur lors de la mise à jour de l'adhérent.";

      alert(error.value);

    } finally {
      loading.value = false;
    }

    return;
  }

  // =============================
  // 🔹 CRÉATION (POST)
  // =============================

  try {
    const createPayload = {
      Nom: form.value.nom,
      Prenom: form.value.prenom,
      Email: form.value.email,
      Telephone: form.value.telephone,

      Adresse: form.value.adresse,
      Ville: form.value.ville,
      CodePostal: form.value.codePostal,

      DisciplineId: form.value.disciplineId,

      DateDeNaissance:
        form.value.dateDeNaissance,

      DateAdhesion:
        form.value.dateAdhesion,

      // =============================
      // 🔹 CERTIFICAT MÉDICAL
      // =============================

      CertificatMedicalFourni:
        form.value.certificatMedicalFourni,

      DateCertificatMedical:
        form.value.dateCertificatMedical || null,

      DateExpirationCertificatMedical:
        dateExpirationCertificatMedical.value || null
    };

    await api.post(
      'User/register/adherent',
      createPayload
    );

    alert(
      '✅ Adhérent créé avec succès !'
    );

    clearForm();

    emit('refresh');
    emit('close');

  } catch (err) {
    console.error(
      '❌ Erreur lors de la création:',
      err
    );

    const apiMessage =
      err.response?.data?.Message ||
      err.response?.data?.message ||
      "Erreur lors de l'enregistrement du nouvel adhérent.";

    error.value = apiMessage;

    alert(apiMessage);

  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div v-if="show" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-lg">
      <div class="modal-content bg-dark text-light">

        <!-- ============================= -->
        <!-- HEADER -->
        <!-- ============================= -->

        <div class="modal-header border-secondary">
          <h5 class="modal-title">
            {{ props.user ? 'Modifier Adhérent' : 'Nouvel Adhérent' }}
          </h5>

          <button type="button" class="btn-close btn-close-white" @click="emit('close')"></button>
        </div>

        <!-- ============================= -->
        <!-- BODY -->
        <!-- ============================= -->

        <div class="modal-body">

          <div v-if="error" class="alert alert-danger">
            {{ error }}
          </div>

          <form @submit.prevent="submitAdherent">

            <div class="row g-3">

              <!-- NOM -->

              <div class="col-md-6">
                <label class="form-label">
                  Nom
                </label>

                <input v-model="form.nom" type="text" class="form-control" required />
              </div>

              <!-- PRÉNOM -->

              <div class="col-md-6">
                <label class="form-label">
                  Prénom
                </label>

                <input v-model="form.prenom" type="text" class="form-control" required />
              </div>

              <!-- EMAIL -->

              <div class="col-md-6">
                <label class="form-label">
                  Email
                </label>

                <input v-model="form.email" type="email" class="form-control" required />
              </div>

              <!-- TÉLÉPHONE -->

              <div class="col-md-6">
                <label class="form-label">
                  Téléphone
                </label>

                <input v-model="form.telephone" type="text" class="form-control" />
              </div>

              <!-- DATE DE NAISSANCE -->
<div class="col-md-6">
  <label class="form-label">
    Date de naissance
  </label>

  <input
    v-model="form.dateDeNaissance"
    type="date"
    class="form-control"
  />

  <div
    v-if="ageAdherent !== null"
    class="form-text mt-2"
    :class="ageAdherent < 18 ? 'text-info' : 'text-warning'"
  >
    <template v-if="ageAdherent < 18">
      {{ ageAdherent }} ans - Certificat médical facultatif
    </template>

    <template v-else>
      Certificat médical obligatoire
    </template>
  </div>
</div>



              <!-- ADRESSE -->

              <div class="col-md-6">
                <label class="form-label">
                  Adresse
                </label>

                <input v-model="form.adresse" type="text" class="form-control" />
              </div>

              <!-- VILLE -->

              <div class="col-md-6">
                <label class="form-label">
                  Ville
                </label>

                <input v-model="form.ville" type="text" class="form-control" />
              </div>

              <!-- CODE POSTAL -->

              <div class="col-md-6">
                <label class="form-label">
                  Code Postal
                </label>

                <input v-model="form.codePostal" type="text" class="form-control" />
              </div>

              <!-- DISCIPLINE -->

              <div class="col-md-12">
                <label class="form-label">
                  Discipline
                  <span class="text-danger">*</span>
                </label>

                <select v-model="form.disciplineId" class="form-control" required>
                  <option value="">
                    -- Choisir une discipline --
                  </option>

                  <option v-for="d in disciplineList" :key="d.disciplineId" :value="d.disciplineId">
                    {{ d.nom }}
                  </option>
                </select>
              </div>

              <!-- ================================= -->
              <!-- 🔹 CERTIFICAT MÉDICAL -->
              <!-- ================================= -->

              <div class="col-12 mt-4">

                <div class="border-top border-secondary pt-3">

                  <h6 class="text-warning mb-3">
                    Certificat médical
                  </h6>

                  <!-- CERTIFICAT FOURNI -->

                  <div class="form-check mb-3">

                    <input id="certificatMedicalFourni" v-model="form.certificatMedicalFourni" type="checkbox"
                      class="form-check-input" />

                    <label for="certificatMedicalFourni" class="form-check-label">
                      Certificat médical fourni
                    </label>

                  </div>

                  <!-- DATE DU CERTIFICAT -->

                  <div v-if="form.certificatMedicalFourni" class="row g-3">

                    <div class="col-md-6">

                      <label class="form-label">
                        Date du certificat
                      </label>

                      <input v-model="form.dateCertificatMedical" type="date" class="form-control" />

                    </div>

                  </div>

                  <!-- ================================= -->
                  <!-- DATE EXPIRATION + STATUT -->
                  <!-- ================================= -->

                  <div v-if="
                    form.certificatMedicalFourni &&
                    dateExpirationCertificatMedical
                  " class="mt-3">

                    <!-- DATE D'EXPIRATION -->

                    <div class="mb-3">

                      <label class="form-label">
                        Date d'expiration
                      </label>

                      <div class="form-control bg-secondary text-light">
                        {{
                          dateExpirationCertificatMedical
                        }}
                      </div>

                    </div>

                    <!-- CERTIFICAT VALIDE -->

                    <div v-if="
                      dateExpirationCertificatMedical >=
                      new Date().toISOString().split('T')[0]
                    " class="alert alert-success mb-0">
                      Certificat médical valide.
                    </div>

                    <!-- CERTIFICAT EXPIRÉ -->

                    <div v-else class="alert alert-danger mb-0">
                      Certificat médical expiré.
                    </div>

                  </div>

                </div>

              </div>

            </div>

            <!-- ============================= -->
            <!-- BOUTONS -->
            <!-- ============================= -->

            <div class="mt-4 text-end">

              <button type="button" class="btn btn-outline-light me-2" @click="emit('close')">
                Annuler
              </button>

              <button type="submit" class="btn btn-warning" :disabled="loading">

                <span v-if="!loading">
                  {{ props.user ? 'Modifier' : 'Ajouter' }}
                </span>

                <span v-else>
                  Envoi...
                </span>

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
