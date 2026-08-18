<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AppHeader from '@/components/AppHeader.vue';
import AppSidebar from '@/components/AppSidebar.vue';

const authStore = useAuthStore();
const route = useRoute();

const dateYear = new Date().getFullYear();

const isInBackOffice = computed(() => {
  return (
    authStore.isLoggedIn &&
    authStore.user &&
    route.path.startsWith('/admin') &&
    route.name !== 'not-found-catchall'
  );
});
</script>

<template>
  <div id="app" class="d-flex flex-column min-vh-100">

    <!-- BACK-OFFICE -->
    <template v-if="isInBackOffice">
      <div class="d-flex flex-grow-1">

        <AppSidebar />

        <div class="flex-grow-1 d-flex flex-column bg-dark overflow-hidden">

          <AppHeader />

          <div class="flex-grow-1 p-3 overflow-hidden">
            <main
              class="custom-shadow h-100 p-3 border border-1 border-light border-opacity-50 rounded text-light overflow-auto"
            >
              <RouterView />
            </main>
          </div>

        </div>
      </div>

      <footer class="bg-dark p-3 text-center text-light">
        AS Porcelette Art Martiaux © {{ dateYear }} Tous droits réservés.
      </footer>
    </template>

    <!-- PAGES PUBLIQUES : HOME / LOGIN / 403 / 404 -->
    <template v-else>
      <RouterView />
    </template>

  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  overflow-x: hidden !important;
}

.custom-shadow {
  box-shadow: -5px -2px 40px rgba(238, 238, 238, 0.266);
}
</style>
