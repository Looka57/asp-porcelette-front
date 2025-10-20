<script setup>
import { ref, watch, onMounted } from 'vue';
import api from '@/api/axios';
// Remplacement de l'importation de Bootstrap qui échouait
// Nous utilisons window.bootstrap.Modal à la place.

// L'ID Bootstrap de cette modale DOIT être 'createEvent' pour correspondre au bouton externe.

const props = defineProps({
    // Permet au parent de contrôler l'état (utile pour réinitialiser le formulaire à l'ouverture)
    modelValue: {
        type: Boolean,
        default: false
    },
    // Carte des disciplines pour le select (disciplineId -> Nom)
    disciplineMap: {
        type: Object,
        default: () => ({})
    },
    // Carte des types d'événements pour le select (typeEvenementId -> Libelle)
    // Si cette prop est vide, nous tenterons de récupérer la liste via l'API dans ce composant.
    typeEvenementMap: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['update:modelValue', 'event-added']);

const API_PATH_EVENT = '/Evenement';
const API_PATH_TYPE_EVENEMENT = '/TypeEvenement';

// État local pour stocker les types d'événements s'ils ne sont PAS fournis par les props
const localTypeEvenementMap = ref({});
const fetchError = ref(''); // Pour gérer les erreurs de récupération

// Objet d'état pour le formulaire d'ajout
const newEvent = ref({
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    disciplineId: null, // Clé étrangère nullable (int?)
    typeEvenementId: null, // NOUVEAU : Clé étrangère OBLIGATOIRE (int)
});

const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

// Référence pour l'instance Bootstrap Modal
let modalInstance = null;
const modalRef = ref(null);

// Titre de la modale
const modalTitle = 'Ajouter un nouvel événement';

/**
 * Fonction pour obtenir la carte des types d'événements à utiliser.
 * Priorise la prop, sinon utilise l'état local.
 * @returns {Object} La map des types d'événements.
 */
const currentTypeEvenementMap = () => {
    // Si la prop est fournie et non vide, on l'utilise.
    if (Object.keys(props.typeEvenementMap).length > 0) {
        return props.typeEvenementMap;
    }
    // Sinon, on utilise la carte récupérée localement.
    return localTypeEvenementMap.value;
};


/**
 * Récupère la liste des types d'événements depuis l'API.
 * Cette fonction est appelée si la prop typeEvenementMap est vide.
 */
async function fetchTypeEvenements() {
    // Si la prop est déjà remplie, on ne fait rien.
    if (Object.keys(props.typeEvenementMap).length > 0) {
        return;
    }

    try {
        const response = await api.get(API_PATH_TYPE_EVENEMENT);
        const data = response.data;

        // Transformer le tableau en map { id: Libelle }
        const map = {};
        data.forEach(item => {
            if (item.typeEvenementId && item.libelle) {
                map[item.typeEvenementId] = item.libelle;
            }
        });
        localTypeEvenementMap.value = map;
        fetchError.value = ''; // Réinitialiser l'erreur si la récupération réussit

    } catch (error) {
        console.error('Erreur lors de la récupération des types d\'événements:', error);
        fetchError.value = 'Impossible de charger la liste des types d\'événements.';
    }
}

// Récupérer les types d'événements au montage du composant
onMounted(() => {
    fetchTypeEvenements();
});


/**
 * UTILITY : Convertit une date AAAA-MM-JJ en une chaîne ISO 8601 complète.
 * * Cette fonction est simplifiée pour retourner la date à minuit local (T00:00:00).
 * C'est le format le plus couramment accepté par les APIs (ex: ASP.NET DateTime)
 * lorsqu'une date de calendrier est envoyée sans heure spécifique.
 * * @param {string} dateString - Date au format AAAA-MM-JJ (provenant de l'input type="date")
 * @returns {string | null} Chaîne de date formatée (ex: 2025-10-24T00:00:00) ou null
 */
function formatToIsoDateTime(dateString) {
    if (!dateString) return null;

    // Ajout de T00:00:00 pour former une chaîne ISO 8601 complète.
    // L'API traitera cela comme le début de journée dans le fuseau horaire du serveur.
    return `${dateString}T00:00:00`;
}

/**
 * Réinitialise le formulaire pour un nouvel ajout.
 */
function resetForm() {
    newEvent.value = {
        titre: '',
        description: '',
        dateDebut: '',
        dateFin: '',
        disciplineId: null,
        typeEvenementId: null, // Rendre explicite qu'il est réinitialisé
    };
    errorMessage.value = '';
    successMessage.value = '';
}

// Initialisation de la modale Bootstrap une fois le composant monté
watch(modalRef, (newRef) => {
    // Utilisation de window.bootstrap.Modal pour éviter l'échec de résolution d'importation
    if (newRef && window.bootstrap && window.bootstrap.Modal) {
        const ModalClass = window.bootstrap.Modal;
        modalInstance = new ModalClass(newRef);

        // Gère l'événement de fermeture de la modale (quand Bootstrap la ferme)
        newRef.addEventListener('hidden.bs.modal', () => {
            emit('update:modelValue', false);
            resetForm(); // Réinitialise le formulaire à la fermeture
        });

        // Gère l'événement d'ouverture (utile si le parent utilise v-model)
        newRef.addEventListener('shown.bs.modal', () => {
            emit('update:modelValue', true);
            // Si la prop est vide, on force la récupération à l'ouverture
            if (Object.keys(props.typeEvenementMap).length === 0) {
                 fetchTypeEvenements();
            }
        });
    }
}, { immediate: true });


// Observer le prop modelValue pour gérer l'ouverture/fermeture par programmation
watch(() => props.modelValue, (isOpen) => {
    if (modalInstance) {
        if (isOpen) {
            resetForm();
            modalInstance.show();
        } else {
            modalInstance.hide();
        }
    }
});


/**
 * Gère la soumission du formulaire (Ajout)
 */
async function handleSubmit() {
    errorMessage.value = '';
    successMessage.value = '';
    isLoading.value = true;

    // --- Validation locale : Date de début vs Date de fin ---
    const debut = new Date(newEvent.value.dateDebut);
    const fin = new Date(newEvent.value.dateFin);

    // Si une date de fin est fournie, elle DOIT être supérieure ou égale à la date de début.
    if (newEvent.value.dateFin && fin.getTime() < debut.getTime()) {
         errorMessage.value = "La date de fin ne peut pas être antérieure à la date de début.";
         isLoading.value = false;
         return;
    }
    // ---------------------------------------------


    // Préparation des données pour l'API POST, en formatant les dates
    const payload = {
        titre: newEvent.value.titre,
        description: newEvent.value.description,
        // Formatage des dates pour l'API. Début est minuit.
        dateDebut: formatToIsoDateTime(newEvent.value.dateDebut),
        // La date de fin est formatée à 23:59:59 pour couvrir la journée complète.
        dateFin: newEvent.value.dateFin ? `${newEvent.value.dateFin}T23:59:59` : null,

        // Assurez-vous que disciplineId est un nombre (important pour l'API)
        // Si disciplineId est null (placeholder), on envoie null à l'API.
        disciplineId: newEvent.value.disciplineId ? Number(newEvent.value.disciplineId) : null,

        // TypeEvenementId est OBLIGATOIRE (int) côté serveur, donc nous devons l'envoyer.
        typeEvenementId: Number(newEvent.value.typeEvenementId),

        // ImageUrl est envoyé avec la chaîne 'placeholder' pour contourner la validation serveur stricte.
        // La validation côté serveur exige apparemment une chaîne non vide, même si le champ est nullable en base de données.
        imageUrl: 'placeholder',
    };

    // Vérification simple des champs requis
    if (!payload.titre || !payload.dateDebut || !payload.disciplineId || !payload.typeEvenementId) {
        errorMessage.value = "Veuillez remplir au moins le titre, la date de début, la discipline ET le type d'événement.";
        isLoading.value = false;
        return;
    }

    try {
        // Appel à l'API POST pour l'ajout
        const response = await api.post(API_PATH_EVENT, payload);

        // L'API retourne l'objet événement créé avec son ID
        const addedEvent = response.data;

        // Émettre l'événement pour que le parent mette à jour sa liste
        emit('event-added', addedEvent);

        successMessage.value = "Événement ajouté avec succès !";

        // Ferme la modale après succès
        closeAndReset();

    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'événement:', error);
        // Tente d'afficher un message d'erreur plus détaillé si disponible (pour le 400)
        let message = `Erreur lors de l'ajout: ${error.message || 'Problème de connexion API.'}`;

        // Tentative d'extraire les messages d'erreur de validation du body de la réponse 400
        if (error.response) {
             const data = error.response.data;
             if (typeof data === 'string' && data.length < 200) {
                 message = `Erreur de validation: ${data}`;
             } else if (data && data.errors) {
                 // Si c'est un format de validation ModelState (ASP.NET Core/similaire)
                 const errorKeys = Object.keys(data.errors);
                 if (errorKeys.length > 0) {
                     // Concaténer le premier message d'erreur de validation
                     message = `Erreur de validation: ${data.errors[errorKeys[0]][0]}`;
                 }
             } else if (data && data.message) {
                 message = `Erreur de validation: ${data.message}`;
             } else if (error.response.status === 400) {
                 // Si c'est un 400 générique après tous les checks
                 message = `Erreur de validation: La requête envoyée est mal formée (Code 400). Vérifiez les champs obligatoires (Titre, Discipline, Type Événement, Date Début).`;
             }
        }
        errorMessage.value = message;
    } finally {
        isLoading.value = false;
    }
}

/**
 * Ferme la modale (et déclenche l'événement hidden.bs.modal)
 */
function closeAndReset() {
    if (modalInstance) {
        modalInstance.hide();
    } else {
        emit('update:modelValue', false);
    }
}

</script>

<template>
    <!-- ID #createEvent obligatoire pour que votre bouton externe fonctionne -->
    <div class="modal fade" id="createEvent" ref="modalRef" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-dark text-white">

                <!-- En-tête de la Modale -->
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabel">{{ modalTitle }}</h5>
                    <!-- Bouton croix : utilise closeAndReset() -->
                    <button type="button" class="btn-close btn-close-white" @click="closeAndReset" aria-label="Close"></button>
                </div>

                <!-- Corps de la Modale -->
                <div class="modal-body">

                    <!-- Affichage des messages d'état -->
                    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
                    <div v-if="fetchError" class="alert alert-warning">
                        {{ fetchError }}
                    </div>
                    <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

                    <!-- Formulaire d'Ajout -->
                    <form @submit.prevent="handleSubmit">
                        <div class="mb-3">
                            <label for="titre" class="form-label">Titre</label>
                            <input type="text" class="form-control bg-secondary text-white border-secondary" id="titre" v-model="newEvent.titre" required>
                        </div>

                        <!-- LIGNE DES SELECTS -->
                        <div class="row">
                             <!-- Sélecteur de Type d'Événement (NOUVEAU) -->
                            <div class="col-md-6 mb-3">
                                <label for="typeEvenement" class="form-label">Type d'événement</label>
                                <select class="form-select bg-secondary text-white border-secondary" id="typeEvenement" v-model="newEvent.typeEvenementId" required
                                    :disabled="Object.keys(currentTypeEvenementMap()).length === 0">
                                    <option :value="null" disabled>Sélectionner un type</option>
                                    <!-- Afficher la liste des types d'événements à partir du prop OU de la récupération locale -->
                                    <option v-for="(name, id) in currentTypeEvenementMap()" :key="id" :value="Number(id)">{{ name }}</option>
                                    <!-- Message affiché si la liste est vide (en plus de l'alerte) -->
                                    <option v-if="Object.keys(currentTypeEvenementMap()).length === 0" disabled>Chargement ou indisponible</option>
                                </select>
                            </div>
                            <!-- Sélecteur de Discipline (Existante) -->
                            <div class="col-md-6 mb-3">
                                <label for="discipline" class="form-label">Discipline</label>
                                <select class="form-select bg-secondary text-white border-secondary" id="discipline" v-model="newEvent.disciplineId" required>
                                    <option :value="null" disabled>Sélectionner une discipline</option>
                                    <!-- Afficher la liste des disciplines à partir du prop disciplineMap -->
                                    <option v-for="(name, id) in disciplineMap" :key="id" :value="Number(id)">{{ name }}</option>
                                </select>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="dateDebut" class="form-label">Date de début</label>
                                <input type="date" class="form-control bg-secondary text-white border-secondary" id="dateDebut" v-model="newEvent.dateDebut" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="dateFin" class="form-label">Date de fin</label>
                                <input type="date" class="form-control bg-secondary text-white border-secondary" id="dateFin" v-model="newEvent.dateFin">
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <textarea class="form-control bg-secondary text-white border-secondary" id="description" rows="3" v-model="newEvent.description"></textarea>
                        </div>

                        <!-- Bouton de Soumission -->
                        <div class="d-flex justify-content-end gap-2 mt-4">
                            <!-- Bouton Annuler : utilise closeAndReset() -->
                            <button type="button" class="btn btn-secondary" @click="closeAndReset">Annuler</button>
                            <button type="submit" class="btn btn-success" :disabled="isLoading || Object.keys(currentTypeEvenementMap()).length === 0">
                                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                {{ isLoading ? 'Ajout en cours...' : 'Ajouter l\'événement' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Assurez-vous que le style du modal s'intègre au thème sombre */
.modal-content {
    border: 1px solid #495057;
}
.btn-close-white {
    filter: invert(1);
}
</style>
