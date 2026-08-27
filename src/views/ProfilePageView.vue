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
        Nom: { label: 'Nom', value: authStore.user?.nom, icon: 'pi pi-user' },
        Prénom: { label: 'Prénom', value: authStore.user?.prenom, icon: 'pi pi-user' },
        Email: { label: 'Email', value: authStore.user?.email, icon: 'pi pi-envelope' },
        Rôles: { label: 'Rôles', value: authStore.user?.roles?.join(', ') || 'Non défini', icon: 'pi pi-shield' },
    }
});

/**
 * 🔹 Logique de changement de mot de passe
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

        CurrentPassword: currentPassword.value,
        NewPassword: newPassword.value
    };

    try {
        await api.put(`/User/${userId}/profile`, payload);

        passwordSuccess.value = 'Votre mot de passe a été mis à jour avec succès !';

        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';

        setTimeout(() => {
            showPasswordModal.value = false;
        }, 1500);

    } catch (err) {
        console.error("Erreur lors du changement de mot de passe :", err.response?.data || err.message);
        passwordError.value = err.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe. Vérifiez l\'ancien mot de passe.';
    }
};

const closeModal = () => {
    showPasswordModal.value = false;
    passwordError.value = '';
    passwordSuccess.value = '';
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
};
</script>

<template>
    <div class="profile-wrapper min-vh-100 py-5 px-3 px-md-4">
        <div class="container-fluid max-w-4xl mx-auto">

            <!-- En-tête -->
            <div class="glass-card hero-profile mb-4 p-4 p-md-5 position-relative overflow-hidden">
                <div class="row align-items-center position-relative z-1">
                    <div class="col-md-8 text-center text-md-start mb-3 mb-md-0">
                        <span class="badge rounded-pill bg-warning text-dark font-mono px-3 py-2 text-uppercase fw-bold mb-2">
                            Espace Administrateur
                        </span>
                        <h1 class="display-6 fw-bold text-white mb-1">Mon Profil</h1>
                        <p class="text-white-50 mb-0 fs-6">Consultez vos informations personnelles et gérez votre sécurité</p>
                    </div>
                    <div class="col-md-4 text-center text-md-end">
                        <div class="avatar-circle d-inline-flex align-items-center justify-content-center bg-dark border border-warning text-warning fs-2 fw-bold shadow-lg">
                            {{ authStore.user?.prenom?.[0] || 'A' }}{{ authStore.user?.nom?.[0] || '' }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Carte Informations -->
            <div class="glass-card mb-4 p-4">
                <div class="d-flex align-items-center gap-2 mb-4 border-bottom border-secondary pb-3">
                    <i class="pi pi-id-card text-warning fs-5"></i>
                    <h5 class="text-white fw-bold mb-0">Informations Utilisateur</h5>
                </div>

                <div class="row g-3">
                    <div v-for="(item, key) in userDetails" :key="key" class="col-12 col-md-6">
                        <div class="info-tile p-3 rounded-3 d-flex align-items-center gap-3">
                            <div class="info-icon rounded-2 d-flex align-items-center justify-content-center">
                                <i :class="item.icon" class="text-warning"></i>
                            </div>
                            <div class="overflow-hidden">
                                <span class="d-block text-white-50 fs-7 fw-semibold text-uppercase">{{ item.label }}</span>
                                <span class="d-block text-white fw-bold text-truncate fs-6">{{ item.value || 'N/A' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="d-flex flex-wrap gap-3">
                <button class="btn btn-dark-custom d-inline-flex align-items-center gap-2" disabled>
                    <i class="pi pi-lock text-muted"></i>
                    <span>Modifier le profil (Voir onglet Sensei)</span>
                </button>

                <button class="btn btn-warning-custom d-inline-flex align-items-center gap-2 ms-auto" @click="showPasswordModal = true">
                    <i class="pi pi-key"></i>
                    <span>Changer le mot de passe</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Modal de Changement de mot de passe -->
    <div v-if="showPasswordModal" class="modal fade show d-block" tabindex="-1" @click.self="closeModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="glass-card modal-content border-warning text-white shadow-lg">
                <div class="modal-header border-bottom border-secondary p-4">
                    <div class="d-flex align-items-center gap-2">
                        <i class="pi pi-shield text-warning fs-5"></i>
                        <h5 class="modal-title text-white fw-bold mb-0">Changer mon mot de passe</h5>
                    </div>
                    <button type="button" class="btn-close btn-close-white" @click="closeModal" aria-label="Close"></button>
                </div>

                <form @submit.prevent="changePassword">
                    <div class="modal-body p-4">

                        <div class="mb-3">
                            <label for="currentPassword" class="form-label text-white-50 fs-7 fw-bold">Ancien mot de passe</label>
                            <div class="input-group">
                                <span class="input-group-text custom-input-text"><i class="pi pi-lock"></i></span>
                                <input type="password" class="form-control custom-input" id="currentPassword" v-model="currentPassword" placeholder="••••••••" required>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="newPassword" class="form-label text-white-50 fs-7 fw-bold">Nouveau mot de passe</label>
                            <div class="input-group">
                                <span class="input-group-text custom-input-text"><i class="pi pi-key"></i></span>
                                <input type="password" class="form-control custom-input" id="newPassword" v-model="newPassword" placeholder="••••••••" required>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="confirmPassword" class="form-label text-white-50 fs-7 fw-bold">Confirmer le nouveau mot de passe</label>
                            <div class="input-group">
                                <span class="input-group-text custom-input-text"><i class="pi pi-check-circle"></i></span>
                                <input type="password" class="form-control custom-input" id="confirmPassword" v-model="confirmPassword" placeholder="••••••••" required>
                            </div>
                        </div>

                        <div v-if="passwordError" class="alert alert-danger custom-alert mt-3 mb-0" role="alert">
                            <i class="pi pi-exclamation-circle me-2"></i>{{ passwordError }}
                        </div>
                        <div v-if="passwordSuccess" class="alert alert-success custom-alert mt-3 mb-0" role="alert">
                            <i class="pi pi-check-circle me-2"></i>{{ passwordSuccess }}
                        </div>
                    </div>

                    <div class="modal-footer border-top border-secondary p-3">
                        <button type="button" class="btn btn-dark-custom" @click="closeModal">Annuler</button>
                        <button type="submit" class="btn btn-warning-custom">Confirmer le changement</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div v-if="showPasswordModal" class="modal-backdrop fade show"></div>
</template>

<style scoped>
/* ──────── Global & Utilities ──────── */
.profile-wrapper {
    background-color: #121418;
    color: #e2e8f0;
}

.font-mono {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

.fs-7 {
    font-size: 0.825rem;
}

.max-w-4xl {
    max-width: 900px;
}

/* ──────── Dark Glass Cards ──────── */
.glass-card {
    background: linear-gradient(135deg, rgba(30, 36, 46, 0.7) 0%, rgba(20, 24, 32, 0.85) 100%);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.hero-profile {
    background: linear-gradient(135deg, #1e2530 0%, #151921 100%);
    border: 1px solid rgba(255, 255, 255, 0.12);
}

.avatar-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: rgba(251, 191, 36, 0.1);
}

/* ──────── Info Tiles ──────── */
.info-tile {
    background: rgba(18, 20, 24, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.2s ease;
}

.info-tile:hover {
    border-color: rgba(251, 191, 36, 0.3);
    background: rgba(18, 20, 24, 0.8);
}

.info-icon {
    width: 40px;
    height: 40px;
    background: rgba(251, 191, 36, 0.1);
    flex-shrink: 0;
}

/* ──────── Buttons ──────── */
.btn-dark-custom {
    background-color: #1a1e24;
    color: #cbd5e1;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 0.5rem;
    padding: 0.6rem 1.2rem;
    font-weight: 500;
    transition: all 0.2s ease;
}

.btn-dark-custom:hover:not(:disabled) {
    background-color: #262c36;
    color: #fff;
    border-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-1px);
}

.btn-dark-custom:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-warning-custom {
    background-color: #fbbf24;
    color: #121418;
    border: 1px solid #fbbf24;
    border-radius: 0.5rem;
    padding: 0.6rem 1.2rem;
    font-weight: 600;
    transition: all 0.2s ease;
}

.btn-warning-custom:hover {
    background-color: #f59e0b;
    border-color: #f59e0b;
    color: #121418;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
}

/* ──────── Form & Inputs ──────── */
.custom-input-text {
    background-color: #161a20;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-right: none;
    color: #fbbf24;
}

.custom-input {
    background-color: #161a20;
    color: #f1f5f9;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-left: none;
}

.custom-input:focus {
    background-color: #1a1f27;
    color: #fff;
    border-color: #fbbf24;
    box-shadow: none;
}

/* ──────── Alerts & Modal ──────── */
.custom-alert {
    background-color: rgba(0, 0, 0, 0.4);
    border: 1px solid;
    font-size: 0.85rem;
}

.alert-danger.custom-alert {
    border-color: rgba(239, 68, 68, 0.4);
    color: #f87171;
}

.alert-success.custom-alert {
    border-color: rgba(16, 185, 129, 0.4);
    color: #34d399;
}

.modal.show {
    display: block;
}

.btn-close-white {
    filter: invert(1) grayscale(100%) brightness(200%);
}
</style>
