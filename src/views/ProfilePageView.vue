<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const userDetails = computed(() => {
    return {
        Nom: authStore.user?.nom,
        Prénom: authStore.user?.prenom,
        Email: authStore.user?.email,
        Rôles: authStore.user?.roles?.join(', ') || 'Non défini',
    }
});
</script>

<template>
    <div class="container py-5">
        <h1 class="mb-4">Mon Profil Administrateur</h1>
        <div class="card bg-dark text-white shadow">
            <div class="card-body">
                <h5 class="card-title text-primary mb-3">Informations Utilisateur</h5>
                <ul class="list-group list-group-flush">
                    <li v-for="(value, key) in userDetails" :key="key" class="list-group-item bg-dark text-white d-flex justify-content-between align-items-center">
                        <span class="fw-bold">{{ key }} :</span>
                        <span>{{ value || 'N/A' }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="mt-4">
            <button class="btn btn-warning me-2">Modifier le profil</button>
            <button class="btn btn-secondary">Changer le mot de passe</button>
        </div>
    </div>
</template>

<style scoped>
.list-group-item {
    border-color: rgba(255, 255, 255, 0.1);
}
.text-primary {
    color: #facc15 !important;
}

</style>
