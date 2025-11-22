<script setup>
import { ref } from 'vue';

const email = ref('');
const message = ref('');
const error = ref('');

async function sendResetLink() {
    message.value = '';
    error.value = '';

    // --- STUB/SIMULATION API (À REMPLACER) ---
    // Simule un appel API avec un délai de 2 secondes
    console.log(`Tentative d'envoi du lien à : ${email.value}`);

    // Ici, vous mettrez votre vrai appel HTTP (ex: axios.post('VOTRE_ENDPOINT/forgot-password', { email: email.value }))

    await new Promise(resolve => setTimeout(resolve, 2000));
    // ----------------------------------------

    // --- LOGIQUE DE SUCCÈS/ÉCHEC SIMULÉE ---
    if (email.value.includes('error')) {
        // Simule une erreur de l'API (ex: email inconnu)
        error.value = 'Erreur : Impossible d\'envoyer le lien ou email inconnu.';
    } else {
        // Simule le succès
        message.value = `Un lien de réinitialisation a été envoyé à l'adresse **${email.value}**. (Simulation)`;
        email.value = ''; // Vider le champ après succès
    }
}
</script>

<template>
    <div class="bob min-h-screen flex items-center justify-center bg-dark text-light">
        <div class="form-wrapper">
            <h2>Mot de passe oublié</h2>
            <p class="mb-6 text-center text-sm text-light-text">
                Entrez votre adresse email. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            <form @submit.prevent="sendResetLink" class="space-y-5">
                <div>
                    <label for="email" class="label">Email:</label>
                    <input type="email" v-model="email" required class="input-field" />
                </div>

                <button type="submit" class="btn-primary p-3 rounded-lg w-full font-semibold">
                    Envoyer le lien de réinitialisation
                </button>
            </form>

            <p v-if="message" class="text-success text-center mt-4" v-html="message"></p>
            <p v-if="error" class="error-message text-center mt-4">{{ error }}</p>

            <div class="text-center mt-6">
                <router-link to="/login" class="text-link-blue text-sm hover:underline">
                    Retour à la connexion
                </router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Réutiliser vos styles de Login.vue */
:root {
  --color-dark-bg: #0d1117;
  --color-form-bg: #1f242c;
  --color-light-text: #c9d1d9;
  --color-primary: #58a6ff;
  --color-primary-hover: #79c0ff;
  --color-error: #f85149;
  --radius-lg: 10px;
}
.bob{
    background-color: var(--color-dark-bg);
}
.form-wrapper {
    max-width: 450px;
    width: 90%;
    padding: 40px;
    background-color: var(--color-form-bg);
    border-radius: var(--radius-lg);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4);
}

h2 {
    font-size: 1.75rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: center;
}

.label { display: block; margin-bottom: 6px; font-weight: 500; color: var(--color-light-text); }
.input-field { /* ... (Vos styles input-field) ... */ }
.btn-primary { /* ... (Vos styles btn-primary) ... */ }
.error-message { /* ... (Vos styles error-message) ... */ }
.text-link-blue { color: #4da6ff; }
.text-success { color: #48a66a; font-weight: 600; }

/* ... (Copiez les styles input-field, btn-primary, error-message, etc. de votre Login.vue) ... */
</style>
