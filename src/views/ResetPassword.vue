<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const token = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const message = ref('');
const error = ref('');

onMounted(() => {
    // Récupère le jeton (token) de l'URL (ex: /reset-password?token=XYZ)
    token.value = route.query.token || '';
    if (!token.value) {
        error.value = "⚠️ Erreur : Jeton de réinitialisation manquant. Le lien est invalide.";
    }
});

async function resetPassword() {
    message.value = '';
    error.value = '';

    if (newPassword.value.length < 8) {
        error.value = "Le mot de passe doit contenir au moins 8 caractères.";
        return;
    }

    if (newPassword.value !== confirmPassword.value) {
        error.value = "Les mots de passe ne correspondent pas.";
        return;
    }

    if (!token.value) {
        error.value = "Opération impossible : Jeton invalide ou manquant.";
        return;
    }

    // --- STUB/SIMULATION API (À REMPLACER) ---
    console.log(`Tentative de réinitialisation avec Token: ${token.value}`);

    // Ici, vous mettrez votre vrai appel HTTP (ex: axios.post('VOTRE_ENDPOINT/reset-password', { token: token.value, newPassword: newPassword.value }))

    await new Promise(resolve => setTimeout(resolve, 2000));
    // ----------------------------------------

    // --- LOGIQUE DE SUCCÈS/ÉCHEC SIMULÉE ---
    if (token.value === 'expired') {
        // Simule une erreur de l'API (ex: token expiré)
        error.value = 'Erreur : Le jeton de réinitialisation est expiré ou invalide.';
    } else {
        // Simule le succès
        message.value = 'Votre mot de passe a été réinitialisé avec succès. Redirection vers la connexion... (Simulation)';

        // Rediriger vers la page de connexion après un délai
        setTimeout(() => {
            router.push('/login');
        }, 3000);
    }
}
</script>

<template>
    <div class="bob min-h-screen flex items-center justify-center bg-dark text-light">
        <div class="form-wrapper">
            <h2>Définir un nouveau mot de passe</h2>
            <p class="mb-6 text-center text-sm text-light-text" v-if="token">
                Jeton actuel : <span class="font-mono text-xs">{{ token.substring(0, 10) }}...</span>
            </p>

            <form @submit.prevent="resetPassword" class="space-y-5" v-if="!message && !error">
                <div>
                    <label for="password" class="label">Nouveau mot de passe:</label>
                    <input type="password" v-model="newPassword" required class="input-field" minlength="8" />
                </div>
                <div>
                    <label for="confirm" class="label">Confirmer le mot de passe:</label>
                    <input type="password" v-model="confirmPassword" required class="input-field" minlength="8" />
                </div>

                <button type="submit" class="btn-primary p-3 rounded-lg w-full font-semibold">
                    Réinitialiser
                </button>
            </form>

            <p v-if="message" class="text-success text-center mt-4">{{ message }}</p>
            <p v-if="error" class="error-message text-center mt-4">{{ error }}</p>

            <div class="text-center mt-6" v-if="message || error">
                <router-link to="/login" class="text-link-blue text-sm hover:underline">
                    Retour à la connexion
                </router-link>
            </div>
        </div>
    </div>
</template>
