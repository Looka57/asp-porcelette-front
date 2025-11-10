<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
    <div class="p-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg max-w-md w-full text-center">
      <svg class="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
      <h1 class="mt-4 text-4xl font-extrabold text-red-600 dark:text-red-400">403</h1>
      <h2 class="mt-2 text-2xl font-semibold">Accès Interdit</h2>
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Vous n'avez pas la permission nécessaire pour accéder à cette ressource.
        Veuillez vous connecter avec un compte autorisé.
      </p>
      <router-link to="/" class="mt-6 inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition duration-150">
        Retour à l'accueil
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// Ce composant ne nécessite pas de logique script complexe, mais la balise <script> est nécessaire
// si la balise <template> est temporairement vide (ce qui n'est plus le cas ici).
// Le 'setup lang="ts"' permet d'utiliser la composition API et TypeScript.
</script>
