<script setup>
import { defineProps } from 'vue';

// Récupère l'ID de la discipline depuis le parent
const props = defineProps({
  disciplineId: {
    type: Number,
    required: true
  }
});

// Renvoie un tableau d'URLs selon la discipline
function getIconsForDiscipline(disciplineId) {
  const icons = {
    1: [
      'https://img.icons8.com/bubbles/100/chat.png',
      'https://img.icons8.com/bubbles/100/trophy.png',
      'https://img.icons8.com/bubbles/100/trust.png'
    ],
    2: [
      'https://img.icons8.com/bubbles/100/cosh-weapon.png',
      'https://img.icons8.com/bubbles/100/couple-like.png',
      'https://img.icons8.com/bubbles/100/medal2-1.png'
    ],
    3: [
      'https://img.icons8.com/bubbles/100/bouncing-ball.png',
      'https://img.icons8.com/bubbles/100/strength.png',
      'https://img.icons8.com/bubbles/100/annual-general-meeting.png'
    ],
    4: [
      'https://img.icons8.com/bubbles/100/shuttercock.png',
      'https://img.icons8.com/bubbles/100/crowd--v1.png',
      'https://img.icons8.com/bubbles/100/chat.png'
    ]
  };
  // Valeur par défaut si discipline inconnue
  return icons[disciplineId] || ['https://img.icons8.com/ios-filled/50/ffffff/help.png'];
}
</script>

<template>
  <div class="d-flex align-items-center">
    <!-- Affiche toutes les icônes du tableau -->
    <img v-for="(icon, index) in getIconsForDiscipline(props.disciplineId)" :key="index" :src="icon"
      alt="Icône discipline" class="discipline-icon me-3" />
  </div>
</template>

<style scoped>
.discipline-icon {
  width: 150px;
  height: 150px;
  object-fit: contain;
}
</style>
