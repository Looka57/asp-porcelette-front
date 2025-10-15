<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const userList = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
    try {
        // 🎯 Appel à votre endpoint C# sécurisé /api/User/admin/list
        const response = await api.get('User/admin/list');
        userList.value = response.data;
    } catch (err) {
        error.value = 'Échec du chargement. Vérifiez que vous êtes Admin et que le token est valide.';
        console.error(err);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="p-6 bg-dark text-white min-h-screen">
        <h1 class="fs-1 font-semibold mb-6">Liste des Sensei</h1>
        <div v-if="loading" class="text-secondary">Chargement de la liste des utilisateurs...</div>
        <div v-else-if="error" class="text-red-600">{{ error }}</div>
        <div v-else>
            <h2 class="text-xl mb-4">Utilisateurs enregistrés (via /admin/list)</h2>
            <ul class="space-y-2 text-light">
                <li v-for="user in userList" :key="user.userId" class="border p-3 rounded shadow">
                    <p><strong>ID:</strong> {{ user.userId }}</p>
                    <p><strong>Nom:</strong> {{ user.prenom }} {{ user.nom }}</p>
                    <p><strong>Rôles:</strong> {{ user.roles.join(', ') }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>
