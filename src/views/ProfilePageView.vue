<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/api/axios';

const authStore = useAuthStore();

const showPasswordModal = ref(false);
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const passwordError = ref('');
const passwordSuccess = ref('');



const userDetails = computed(() => {
    return {
        Nom: authStore.user?.nom,
        Prénom: authStore.user?.prenom,
        Email: authStore.user?.email,
        Rôles: authStore.user?.roles?.join(', ') || 'Non défini',
    }
});

/**
 * 🔹 Logique de changement de mot de passe (Nommage corrigé et 'payload' inclus)
 */
async function changePassword() {
    passwordError.value = '';
    passwordSuccess.value = '';

    if (newPassword.value !== confirmPassword.value) {
        passwordError.value = 'Le nouveau mot de passe et la confirmation ne correspondent pas.';
        return;
    }

    if (!currentPassword.value || !newPassword.value) {
        passwordError.value = 'Veuillez remplir tous les champs.';
        return;
    }

    const userId = authStore.user?.id;
    if (!userId) {
        passwordError.value = 'Utilisateur non identifié.';
        return;
    }

    // ✅ Définition de la charge utile (payload)
const payload = {
    UserId: userId,
    Email: authStore.user.email,
    Username: authStore.user.userName,
    Nom: authStore.user.nom,
    Prenom: authStore.user.prenom,
    Telephone: authStore.user.telephone || null,
    PhotoUrl: authStore.user.photoUrl || null,
    Adresse: authStore.user.rueEtNumero || null,
    Ville: authStore.user.ville || null,
    CodePostal: authStore.user.codePostal || null,
    Grade: authStore.user.grade || null,
    Bio: authStore.user.bio || null,
    Statut: authStore.user.statut || 0,
    DisciplineId: authStore.user.disciplineId || null,
    DateDeNaissance: authStore.user.dateNaissance || null,

    // 🔹 Champs pour le changement de mot de passe
    CurrentPassword: currentPassword.value,
    NewPassword: newPassword.value
};

    try {
        // 🎯 L'endpoint API doit pointer vers la logique de changement de mot de passe du compte
        // Utilisez l'endpoint spécifique à l'Admin, comme nous l'avions défini :
        await api.put(`/User/${userId}/profile`, payload);

        passwordSuccess.value = 'Votre mot de passe a été mis à jour avec succès !';

        // Réinitialiser le formulaire après succès
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';

        // Fermer le modal après un court délai
        setTimeout(() => {
            showPasswordModal.value = false;
        }, 1500);

    } catch (err) {
        console.error("Erreur lors du changement de mot de passe :", err.response?.data || err.message);
        // Utiliser 'message' par défaut si la réponse est vide
        passwordError.value = err.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe. Vérifiez l\'ancien mot de passe.';
    }
};

/**
 * 🔹 Réinitialise les messages et ferme le modal
 */
const closeModal = () => {
    showPasswordModal.value = false;
    passwordError.value = '';
    passwordSuccess.value = '';
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
};

// Suppression des accolades fermantes en trop ici.

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
            <button class="btn btn-warning me-2" disabled>Modifier le profil (Voir onglet Sensei)</button>

            <button class="btn btn-secondary" @click="showPasswordModal = true">Changer le mot de passe</button>
        </div>
    </div>

    <div v-if="showPasswordModal" class="modal fade show d-block" tabindex="-1" @click.self="closeModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-dark border-warning text-white">
                <div class="modal-header border-bottom border-secondary">
                    <h5 class="modal-title text-warning">Changer mon mot de passe</h5>
                    <button type="button" class="btn-close btn-close-white" @click="closeModal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="changePassword">
                    <div class="modal-body">

                        <div class="mb-3">
                            <label for="currentPassword" class="form-label">Ancien mot de passe</label>
                            <input type="password" class="form-control bg-secondary text-white border-dark" id="currentPassword" v-model="currentPassword" required>
                        </div>

                        <div class="mb-3">
                            <label for="newPassword" class="form-label">Nouveau mot de passe</label>
                            <input type="password" class="form-control bg-secondary text-white border-dark" id="newPassword" v-model="newPassword" required>
                        </div>

                        <div class="mb-3">
                            <label for="confirmPassword" class="form-label">Confirmer nouveau mot de passe</label>
                            <input type="password" class="form-control bg-secondary text-white border-dark" id="confirmPassword" v-model="confirmPassword" required>
                        </div>

                        <div v-if="passwordError" class="alert alert-danger mt-3" role="alert">{{ passwordError }}</div>
                        <div v-if="passwordSuccess" class="alert alert-success mt-3" role="alert">{{ passwordSuccess }}</div>
                    </div>
                    <div class="modal-footer border-top border-secondary">
                        <button type="button" class="btn btn-outline-secondary" @click="closeModal">Annuler</button>
                        <button type="submit" class="btn btn-warning">Confirmer le changement</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div v-if="showPasswordModal" class="modal-backdrop fade show"></div>
</template>

<style scoped>
/* ... (Vos styles CSS existants) ... */

/* Styles additionnels pour le modal */
.modal.show {
    display: block;
}
.btn-close-white {
    filter: invert(1) grayscale(100%) brightness(200%); /* Rend l'icône blanche */
}
</style>
