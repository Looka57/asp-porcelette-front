<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  disciplineId: {
    type: Number,
    required: true
  }
});

function getIconUrl(disciplineId) {
  const icons = {
    1: 'https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-judo-sport-fitness-vol3-microdots-premium-microdot-graphic.png',
    2: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-aikido-martial-arts-flaticons-lineal-color-flat-icons-3.png',
    3: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-jiu-jitsu-martial-arts-flaticons-lineal-color-flat-icons-3.png',
    4: 'https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-judo-martial-arts-flaticons-lineal-color-flat-icons-3.png',
  };

  return icons[disciplineId] || 'https://img.icons8.com/ios-filled/50/ffffff/help.png';
}
// https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-judo-sport-fitness-vol3-microdots-premium-microdot-graphic.png
</script>

<template>
  <div class="d-flex align-items-center ">
    <img :src="getIconUrl(props.disciplineId)" alt="Icône discipline" width="150" height="150" class="me-3" />
  </div>
</template>

<style scoped></style>
