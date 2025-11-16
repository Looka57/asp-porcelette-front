<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const actualites = ref([]);
const isLoading = ref(true);

async function fetchAll() {
  const response = await api.get("/Actualite");
  actualites.value = response.data;
  isLoading.value = false;
}

onMounted(fetchAll);
</script>

<template>
  <div class="container py-5 text-light">
    <h1 class="text-warning text-center mb-4">Toutes les actualités</h1>

    <div v-if="isLoading" class="text-center">Chargement...</div>

    <div class="row">
      <div
        v-for="actu in actualites"
        :key="actu.id"
        class="col-md-4 col-sm-6 mb-4"
      >
        <div class="card bg-dark border-secondary shadow h-100">
          <img
            :src="actu.imageUrl"
            class="card-img-top object-fit-cover"
            style="height: 200px"
          />
          <div class="card-body">
            <span class="badge bg-warning text-dark mb-2">{{ actu.discipline }}</span>
            <h5 class="text-light">{{ actu.titre }}</h5>

            <router-link
              :to="`/actualite/${actu.id}`"
              class="btn btn-outline-warning btn-sm mt-3"
            >
              Lire
            </router-link>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
