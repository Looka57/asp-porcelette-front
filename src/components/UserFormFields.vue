<script setup>
// import { defineProps, defineEmits } from 'vue';

// On définit la prop 'modelValue' pour supporter v-model
const props = defineProps({
  // modelValue sera l'objet newSensei de la vue parent
  modelValue: {
    type: Object,
    required: true
  },
  // On peut ajouter une prop pour désactiver certains champs si on veut
  isReadOnly: {
    type: Boolean,
    default: false
  },
  // On peut rendre le champ password optionnel (ex: pour la modification)
  isPasswordRequired: {
    type: Boolean,
    default: true
  }
});

// On définit l'événement 'update:modelValue' pour la liaison bidirectionnelle
const emit = defineEmits(['update:modelValue']);

// Fonction pour mettre à jour une propriété spécifique dans l'objet
const updateField = (field, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  });
};
</script>

<template>
  <div class="row mb-3">
    <div class="col-md-6">
      <label for="name" class="form-label">Nom <span class="text-danger">*</span></label>
      <input :value="modelValue.nom" @input="e => updateField('nom', e.target.value)" type="text" class="form-control"
        id="name" placeholder="Nom" required :readonly="isReadOnly">
    </div>
    <div class="col-md-6">
      <label for="LastName" class="form-label">Prénom</label>
      <input :value="modelValue.prenom" @input="e => updateField('prenom', e.target.value)" type="text"
        class="form-control" id="LastName" placeholder="Prénom" :readonly="isReadOnly">
    </div>
  </div>

  <div class="row mb-3">
    <div class="col-md-6">
      <label for="Email" class="form-label">Email <span class="text-danger">*</span></label>
      <input :value="modelValue.email" @input="e => updateField('email', e.target.value)" type="email"
        class="form-control" id="Email" placeholder="email@example.com" required :readonly="isReadOnly">
    </div>
    <div class="col-md-6">
      <label for="Password" class="form-label">Mot de passe <span class="text-danger"
          v-if="isPasswordRequired">*</span></label>
      <input :value="modelValue.password" @input="e => updateField('password', e.target.value)" type="password"
        class="form-control" id="Password" placeholder="Définir un mot de passe initial" :required="isPasswordRequired">
    </div>
  </div>

  <div class="mb-3">
    <label for="Adress" class="form-label">Adresse</label>
    <input :value="modelValue.adresse" @input="e => updateField('adresse', e.target.value)" type="text"
      class="form-control" id="Adress" placeholder="Rue et numéro">
  </div>

  <div class="row mb-3">
    <div class="col-md-6">
      <label for="City" class="form-label">Ville</label>
      <input :value="modelValue.ville" @input="e => updateField('ville', e.target.value)" type="text"
        class="form-control" id="City" placeholder="Ville">
    </div>
    <div class="col-md-6">
      <label for="CP" class="form-label">Code postal</label>
      <input :value="modelValue.codePostal" @input="e => updateField('codePostal', e.target.value)" type="text"
        class="form-control" id="CP" placeholder="Code postal">
    </div>
  </div>
  <div class="row mb-3">
    <div class="col-md-6">
      <label for="Phone" class="form-label">Téléphone</label>
      <input :value="modelValue.telephone" @input="e => updateField('telephone', e.target.value)" type="text"
        class="form-control" id="Phone" placeholder="Téléphone">
    </div>

    <div class="col-md-6">
      <label for="Birth" class="form-label">Date de naissance</label>
      <input :value="modelValue.dateNaissance" @input="e => updateField('dateNaissance', e.target.value)" type="date"
        class="form-control" id="Birth" placeholder="JJ/MM/AAAA">
    </div>
  </div>

</template>
