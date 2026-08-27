<script setup>
// ===============================
// 🔹 IMPORTS & PROPS
// ===============================

// Déclare les props pour le formulaire utilisateur
const props = defineProps({
  // modelValue : l'objet utilisateur complet passé par le parent (v-model)
  modelValue: {
    type: Object,
    required: true
  },
  // isReadOnly : permet de rendre certains champs non éditables
  isReadOnly: {
    type: Boolean,
    default: false
  },
  // isPasswordRequired : rend le champ mot de passe obligatoire ou non
  isPasswordRequired: {
    type: Boolean,
    default: true
  }
});

// Déclare les events émis vers le parent
const emit = defineEmits(['update:modelValue']);

// ===============================
// 🔹 FONCTIONS UTILITAIRES
// ===============================

// Met à jour une propriété spécifique de l'objet modelValue
const updateField = (field, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  });
};

const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return dateString.substring(0, 10);
};
</script>

<template>
  <!-- ===============================
       🔹 IDENTITÉ DE L'UTILISATEUR
  =============================== -->
  <div class="row mb-3">
    <!-- Nom -->
    <div class="col-md-6">
      <label for="name" class="form-label">Nom <span class="text-danger">*</span></label>
      <input
        :value="modelValue.nom"
        @input="e => updateField('nom', e.target.value)"
        type="text"
        class="form-control"
        id="name"
        placeholder="Nom"
        required
        :readonly="isReadOnly">
    </div>

    <!-- Prénom -->
    <div class="col-md-6">
      <label for="LastName" class="form-label">Prénom</label>
      <input
        :value="modelValue.prenom"
        @input="e => updateField('prenom', e.target.value)"
        type="text"
        class="form-control"
        id="LastName"
        placeholder="Prénom"
        :readonly="isReadOnly">
    </div>
  </div>

<!-- ===============================
       🔹 CONTACT & AUTHENTIFICATION
  =============================== -->
  <div class="row mb-3">
    <!-- Email -->
    <div class="col-md-6">
      <label for="Email" class="form-label">Email <span class="text-danger">*</span></label>
      <input
        :value="modelValue.email"
        @input="e => updateField('email', e.target.value)"
        type="email"
        class="form-control"
        id="Email"
        placeholder="email@example.com"
        required
        :readonly="isReadOnly">
    </div>

    <!-- Mot de passe -->
    <div class="col-md-6">
      <label for="Password" class="form-label">
        Mot de passe <span class="text-danger" v-if="isPasswordRequired">*</span>
      </label>
      <input
        :value="modelValue.password"
        @input="e => updateField('password', e.target.value)"
        type="password"
        class="form-control"
        id="Password"
        placeholder="Définir un mot de passe initial"
        :required="isPasswordRequired">

      <!-- 💡 Texte d'aide ajouté ici -->
      <small class="form-text text-light d-block mt-1" style="font-size: 0.8rem; color: #6c757d;">
        Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.
      </small>
    </div>
  </div>

  <!-- ===============================
       🔹 ADRESSE
  =============================== -->
  <div class="mb-3">
    <label for="Adress" class="form-label">Adresse</label>
    <input
      :value="modelValue.rueEtNumero"
      @input="e => updateField('rueEtNumero', e.target.value)"
      type="text"
      class="form-control"
      id="Adress"
      placeholder="Rue et numéro">
  </div>

  <div class="row mb-3">
    <!-- Ville -->
    <div class="col-md-6">
      <label for="City" class="form-label">Ville</label>
      <input
        :value="modelValue.ville"
        @input="e => updateField('ville', e.target.value)"
        type="text"
        class="form-control"
        id="City"
        placeholder="Ville">
    </div>

    <!-- Code postal -->
    <div class="col-md-6">
      <label for="CP" class="form-label">Code postal</label>
      <input
        :value="modelValue.codePostal"
        @input="e => updateField('codePostal', e.target.value)"
        type="text"
        class="form-control"
        id="CP"
        placeholder="Code postal">
    </div>
  </div>

  <!-- ===============================
       🔹 TÉLÉPHONE & DATE DE NAISSANCE
  =============================== -->
  <div class="row mb-3">
    <!-- Téléphone -->
    <div class="col-md-6">
      <label for="Phone" class="form-label">Téléphone</label>
      <input
        :value="modelValue.telephone"
        @input="e => updateField('telephone', e.target.value)"
        type="text"
        class="form-control"
        id="Phone"
        placeholder="Téléphone">
    </div>

    <!-- Date de naissance -->
    <div class="col-md-6">
      <label for="Birth" class="form-label">Date de naissance</label>
      <input
        :value="formatDateForInput(modelValue.dateNaissance)"
        @input="e => updateField('dateNaissance', e.target.value)"
        type="date"
        class="form-control"
        id="Birth"
        placeholder="JJ/MM/AAAA">
    </div>
  </div>

</template>

<style scoped>
/* ===============================
   🔹 STYLES LOCAUX
=============================== */
.bg-light {
  background-color: black !important;
}
</style>
