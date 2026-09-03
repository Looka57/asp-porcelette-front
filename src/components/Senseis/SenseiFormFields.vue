<script setup>
import { watch, computed } from 'vue'

// ===============================
// 🔹 PROPS
// ===============================
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  disciplineList: {
    type: Array,
    default: () => []
  },
  selectedDiscipline: {
    type: [String, Number],
    required: true
  }
})


const isSensei = computed(() =>
  props.modelValue.roles?.includes('Sensei')
)


// ===============================
// 🔹 EMITS
// ===============================
const emit = defineEmits(['update:modelValue', 'update:selectedDiscipline', 'file-change'])

// ===============================
// 🔹 WATCHERS
// ===============================
// Exemple : log chaque changement de la bio
watch(
  () => props.modelValue.bio,
  (newBio, oldBio) => {
    console.log('📝 Bio dans SenseiFormFields - Ancienne:', oldBio, 'Nouvelle:', newBio)
  },
  { immediate: true }
)

// ===============================
// 🔹 FONCTIONS UTILITAIRES
// ===============================

// Mettre à jour une propriété spécifique de l'objet Sensei
const updateField = (field, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  })
}

// Mettre à jour la discipline sélectionnée
const updateDiscipline = (value) => {
  emit('update:selectedDiscipline', value)
}

// Transmettre un changement de fichier au parent
const handleFileChange = (event) => {
  emit('file-change', event)
}
</script>

<template>
  <div v-if="isSensei">

    <div class="row mb-3">
      <div class="col-md-6">
        <label for="Grade" class="form-label">Grade</label>

        <input
          :value="modelValue.grade"
          @input="e => updateField('grade', e.target.value)"
          type="text"
          class="form-control"
          id="Grade"
          placeholder="Grade actuel"
        >
      </div>

      <div class="col-md-6">
        <div class="mb-3">
          <label for="Discipline" class="form-label">
            Discipline <span class="text-danger">*</span>
          </label>

          <select
            class="form-control"
            :value="selectedDiscipline"
            @change="e => updateDiscipline(e.target.value)"
            name="discipline"
            id="Discipline"
            required
          >
            <option value="">-- Choisir une discipline --</option>

            <option
              v-for="discipline in disciplineList"
              :key="discipline.disciplineId"
              :value="discipline.disciplineId"
            >
              {{ discipline.nom }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="mb-3">
      <label for="Bio" class="form-label">Biographie</label>

      <textarea
        :value="modelValue.bio"
        @input="e => updateField('bio', e.target.value)"
        class="form-control"
        id="Bio"
        rows="3"
      ></textarea>
    </div>

    <div class="mb-3">
      <label for="PhotoUrl" class="form-label">
        Télécharger une photo
      </label>

      <input
        type="file"
        class="form-control"
        id="PhotoUrl"
        accept="image/*"
        @change="handleFileChange"
      >
    </div>

  </div>
</template>
