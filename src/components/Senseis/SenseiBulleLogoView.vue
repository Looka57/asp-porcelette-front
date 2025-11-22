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
    1: new URL('@/assets/img/icones/judo.png', import.meta.url).href,
    2: new URL('@/assets/img/icones/aikido.png', import.meta.url).href,
    3: new URL('@/assets/img/icones/jujitsu.png', import.meta.url).href,
    4: new URL('@/assets/img/icones/judo-detente.png', import.meta.url).href,
  };

  return icons[disciplineId] || 'https://img.icons8.com/ios-filled/50/ffffff/help.png';
}
// https://img.icons8.com/external-microdots-premium-microdot-graphic/64/external-judo-sport-fitness-vol3-microdots-premium-microdot-graphic.png
</script>

<template>
  <div class="d-flex align-items-center ">
    <img :src="getIconUrl(props.disciplineId)" alt="Icône discipline" width="250" height="250" class="me-3" />
  </div>
</template>

<style scoped></style>
