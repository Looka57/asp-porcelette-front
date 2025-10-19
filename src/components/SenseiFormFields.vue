<script setup>
import { watch } from 'vue'

// ✅ Déclare d'abord tes props
const props = defineProps({
  // L'objet des données du Sensei (passé par v-model)
  modelValue: {
    type: Object,
    required: true
  },
  // La liste des disciplines (passée par la vue parent)
  disciplineList: {
    type: Array,
    default: () => []
  },
  // La discipline sélectionnée (passée par v-model)
  selectedDiscipline: {
    type: [String, Number],
    required: true
  }
})

// ✅ Puis seulement après, tes emits
const emit = defineEmits(['update:modelValue', 'update:selectedDiscipline', 'file-change'])

// ✅ Et enfin, ton watch
watch(
  () => props.modelValue.bio,
  (newBio, oldBio) => {
    console.log('📝 Bio dans SenseiFormFields - Ancienne:', oldBio, 'Nouvelle:', newBio)
  },
  { immediate: true }
)

// Mettre à jour l'objet principal (pour Grade et Bio)
const updateField = (field, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  })
}

// Mettre à jour la discipline sélectionnée (pour v-model)
const updateDiscipline = (value) => {
  emit('update:selectedDiscipline', value)
}

// Transmettre l'événement de changement de fichier à la vue parent
const handleFileChange = (event) => {
  emit('file-change', event)
}
</script>

<template>
  <div class="row mb-3">
    <div class="col-md-6">
      <label for="Grade" class="form-label">Grade</label>
      <input :value="modelValue.grade" @input="e => updateField('grade', e.target.value)" type="text"
        class="form-control" id="Grade" placeholder="Grade actuel">
    </div>
    <div class="col-md-6">
  <div class="mb-3">
    <label for="Discipline" class="form-label">Discipline <span class="text-danger">*</span></label>
    <select class="form-control" :value="selectedDiscipline" @change="e => updateDiscipline(e.target.value)"
      name="discipline" id="Discipline" required>
      <option value="">-- Choisir une discipline --</option>
      <option v-for="discipline in disciplineList" :key="discipline.disciplineId" :value="discipline.disciplineId">
        {{ discipline.nom }}
      </option>
    </select>
  </div>
    </div>
  </div>

  <div class="mb-3">
    <label for="Bio" class="form-label">Biographie</label>
    <textarea :value="modelValue.bio" @input="e => updateField('bio', e.target.value)" class="form-control" id="Bio"
      rows="3"></textarea>
  </div>

  <div class="mb-3">
    <label for="PhotoUrl" class="form-label">Télecharger une photo</label>
    <input type="file" class="form-control" id="PhotoUrl" accept="image/*" @change="handleFileChange">
  </div>
</template>
