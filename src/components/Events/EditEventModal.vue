<script setup>
import { ref, watch, defineProps, defineEmits, computed } from 'vue';
import api from '@/api/axios';

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    eventData: { type: Object, default: null }, // L'événement à éditer
    disciplineMap: { type: Object, default: () => ({}) },
    typeEventMap: { type: Object, default: () => ({}) }, // 👈 NOUVEAU: Ajout de la prop typeEventMap
});

const emit = defineEmits(['update:modelValue', 'event-updated']);

const localEvent = ref({});
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Convertit la map Discipline en liste pour le select
const disciplineOptions = ref([]);

watch(() => props.disciplineMap, (newMap) => {
    disciplineOptions.value = Object.entries(newMap).map(([id, nom]) => ({
        id: Number(id),
        nom: nom
    }));
}, { immediate: true });

// 👈 NOUVEAU: Convertit la map Type d'événement en liste pour le select
const typeEventOptions = computed(() => {
    return Object.entries(props.typeEventMap).map(([id, nom]) => ({
        id: Number(id),
        nom: nom
    }));
});


// Quand la prop eventData change, met à jour le formulaire local
watch(() => props.eventData, (newVal) => {
    if (newVal) {
        // Clone l'objet et formate les dates pour les inputs HTML
        localEvent.value = {
            ...newVal,
            dateDebut: newVal.dateDebut ? new Date(newVal.dateDebut).toISOString().substring(0, 10) : '',
            dateFin: newVal.dateFin ? new Date(newVal.dateFin).toISOString().substring(0, 10) : '',
            // Assurez-vous que les IDs sont des nombres pour les selects
            disciplineId: Number(newVal.disciplineId),
            // Utilise Number(newVal.typeEvenementId) ou null si non défini
            typeEvenementId: newVal.typeEvenementId ? Number(newVal.typeEvenementId) : null
        };
        errorMessage.value = '';
        successMessage.value = '';
    }
}, { immediate: true });

function closeModal() {
    emit('update:modelValue', false);
    document.body.style.overflow = '';
}

watch(() => props.modelValue, (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

async function saveEvent() {
    errorMessage.value = '';
    successMessage.value = '';

    if (!localEvent.value.titre || !localEvent.value.dateDebut || !localEvent.value.disciplineId) {
        errorMessage.value = 'Veuillez remplir au moins le titre, la date de début et la discipline.';
        return;
    }

    // Validation de la cohérence des dates
    const dateDebut = localEvent.value.dateDebut;
    const dateFin = localEvent.value.dateFin;

    if (dateFin && dateDebut && dateFin < dateDebut) {
        errorMessage.value = 'La date de fin ne peut pas être antérieure à la date de début.';
        return;
    }


    isLoading.value = true;

    try {
        const payload = {
            ...localEvent.value,
            // S'assurer que les IDs sont des nombres entiers
            disciplineId: Number(localEvent.value.disciplineId),
            // Utiliser null si le type n'est pas sélectionné
            typeEvenementId: localEvent.value.typeEvenementId ? Number(localEvent.value.typeEvenementId) : null,
            // Les dates sont au format AAAA-MM-JJ
            dateDebut: localEvent.value.dateDebut,
            dateFin: localEvent.value.dateFin || null,
        };

        const eventId = payload.evenementId;

        // C'est une modification (PUT)
        const response = await api.put(`/Evenement/${eventId}`, payload);

        console.log('Événement modifié avec succès:', response.data);

        successMessage.value = 'Événement modifié avec succès !';

        // Informer le composant parent (EventView) de la mise à jour
        emit('event-updated', response.data);

        // Fermeture automatique après un court délai
        setTimeout(() => {
             closeModal();
        }, 800);

    } catch (error) {
        console.error('Erreur lors de la modification de l\'événement:', error);
         if (error.response && error.response.data && error.response.data.message) {
            errorMessage.value = `Erreur API: ${error.response.data.message}`;
        } else {
            errorMessage.value = 'Erreur lors de la modification. Veuillez vérifier vos données.';
        }
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <transition name="fade">
        <div v-if="modelValue && eventData" class="modal-overlay" @click.self="closeModal">
            <transition name="slide-up">
                <div class="modal-dialogue bg-dark text-white" v-if="modelValue">
                    <div class="modal-content">
                        <!-- HEADER -->
                        <div class="modal-header bg-primary text-white border-bottom border-secondary p-3">
                            <h5 class="modal-title">Modification de l'événement : {{ eventData.titre }}</h5>
                            <button type="button" class="btn-close btn-close-white" @click="closeModal" aria-label="Fermer"></button>
                        </div>

                        <!-- BODY -->
                        <div class="modal-body bg-light text-dark p-4">
                            <form @submit.prevent="saveEvent">

                                <div class="alert alert-danger" v-if="errorMessage">{{ errorMessage }}</div>
                                <div class="alert alert-success" v-if="successMessage">{{ successMessage }}</div>

                                <!-- Titre -->
                                <div class="mb-3">
                                    <label for="titre" class="form-label">Titre <span class="text-danger">*</span></label>
                                    <input type="text" id="titre" class="form-control" v-model="localEvent.titre" required>
                                </div>

                                <!-- Lieu -->
                                <div class="mb-3">
                                    <label for="lieu" class="form-label">Lieu</label>
                                    <input type="text" id="lieu" class="form-control" v-model="localEvent.lieu">
                                </div>

                                <!-- Dates -->
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="dateDebut" class="form-label">Date de Début <span class="text-danger">*</span></label>
                                        <input type="date" id="dateDebut" class="form-control" v-model="localEvent.dateDebut" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="dateFin" class="form-label">Date de Fin (optionnel)</label>
                                        <input type="date" id="dateFin" class="form-control" v-model="localEvent.dateFin">
                                    </div>
                                </div>

                                <!-- Discipline -->
                                <div class="mb-3">
                                    <label for="discipline" class="form-label">Discipline <span class="text-danger">*</span></label>
                                    <select id="discipline" class="form-select" v-model="localEvent.disciplineId" required>
                                        <option value="" disabled>Sélectionner une discipline</option>
                                        <option v-for="disc in disciplineOptions" :key="disc.id" :value="disc.id">
                                            {{ disc.nom }}
                                        </option>
                                    </select>
                                </div>

                                <!-- 👈 MODIFIÉ: Type d'événement (Select dynamique) -->
                                <div class="mb-3">
                                    <label for="typeEvenement" class="form-label">Type d'événement</label>
                                    <select id="typeEvenement" class="form-select" v-model="localEvent.typeEvenementId">
                                        <option :value="null">Non spécifié</option>
                                        <option v-for="type in typeEventOptions" :key="type.id" :value="type.id">
                                            {{ type.nom }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Description -->
                                <div class="mb-3">
                                    <label for="description" class="form-label">Description</label>
                                    <textarea id="description" class="form-control" rows="4" v-model="localEvent.description"></textarea>
                                </div>

                            </form>
                        </div>

                        <!-- FOOTER -->
                        <div class="modal-footer border-top border-secondary p-3 justify-content-between">
                            <button type="button" class="btn btn-secondary" @click="closeModal" :disabled="isLoading">Annuler</button>
                            <!-- 👈 CORRIGÉ : Retire successMessage du disabled pour que le bouton redevienne cliquable après un succès, ou si l'API est trop lente à renvoyer le succès. -->
                            <button type="submit" class="btn btn-primary" @click="saveEvent" :disabled="isLoading">
                                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                {{ isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications' }}
                            </button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<style scoped>
/* Styles de la modale (copiés de CardsModalEvent pour l'uniformité) */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.55);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1055;
}

.modal-dialogue {
    padding: 0;
    width: 95%;
    max-width: 700px;
    max-height: 95vh;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.4);
}

.modal-content {
    background: none;
    border: none;
    border-radius: 0.5rem;
}

.modal-body {
    overflow-y: auto;
    max-height: 80vh;
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.35s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(50px) scale(0.95); opacity: 0; }

</style>
