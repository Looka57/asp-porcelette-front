<script setup>
import { ref, onMounted } from 'vue';
import CardsHomes from '@/components/Home/CardsHome.vue';
import SenseiHome from '@/components/Home/SenseiHome.vue';
import ChoisirHome from '@/components/Home/ChoisirHome.vue';
import EventActuHome from '@/components/Home/EventActuHome.vue';

const showModal = ref(false);

// 2. Clé pour le SessionStorage (à changer si l'alerte change)
const ALERT_KEY = 'alert_travaux_vu';

// 3. Logique d'affichage au chargement du composant
onMounted(() => {
    // Vérifie si l'utilisateur a déjà vu cette alerte
    const alertAlreadySeen = sessionStorage.getItem(ALERT_KEY);

    if (!alertAlreadySeen) {
        showModal.value = true; // Affiche la pop-up
    }
});

// 4. Logique de fermeture
const closeModal = () => {
    showModal.value = false;
    // Enregistre dans la Session que l'utilisateur a vu/fermé l'alerte
    sessionStorage.setItem(ALERT_KEY, 'true');
};

</script>

<template>
    <div v-if="showModal" class="modal-backdrop-custom d-flex justify-content-center align-items-center">
        <div class="modal-dialog-custom" role="document">
            <div class="modal-content bg-light text-dark shadow-lg">
                <div class="modal-header border-bottom border-dark">
                    <h5 class="modal-title fw-bold">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i> INFORMATION IMPORTANTE : Changement de Lieu
                    </h5>
                    <button type="button" class="btn-close" @click="closeModal" aria-label="Fermer"></button>
                </div>

                <div class="modal-body">
                    <p class="lead">
                        En raison de travaux de rénovation de notre complexe sportif habituel, tous les cours de <strong>Judo, Aïkido et Jujitsu</strong> se déroulent actuellement à une nouvelle adresse temporaire.
                    </p>
                    <hr>
                    <p class="mb-1 fw-bold">📍 Nouvelle Adresse Temporaire :</p>
                    <p class="mb-3 fs-5">
                        Complexe Sportif de Tennis <br>
                    </p>
                    <p class="small text-muted">
                        Cette disposition est en vigueur jusqu'à nouvel ordre. Veuillez consulter la section "Actualités" pour les mises à jour.
                    </p>
                </div>

                <div class="modal-footer border-top border-dark">
                    <button type="button" class="btn btn-warning fw-bold mt-2" @click="closeModal">J'ai compris</button>
                </div>

            </div>
        </div>
    </div>


    <div class="container-fluid p-0 bg-dark text-light min-vh-100">
        <div class="imgBaniereHome">
            <div class="titlePrincipal">
                <h1 class="fs-1 text-uppercase display-3 text-white text-center">L'art du mouvement <br> L'esprit des
                    disciplines.</h1>
                <p class="fs-3">Judo - Aikido - Jujitsu</p>
            </div>
        </div>

        <CardsHomes></CardsHomes>
        <SenseiHome></SenseiHome>
        <div class="row secondaryPartie d-flex justify-content-around">
            <div class="col-lg-6 col-md-8 col-sm-12 pourquoiNousChoisir">
                <ChoisirHome></ChoisirHome>
            </div>
            <div class="col-lg-6 eventAct">
                <EventActuHome></EventActuHome>
            </div>
        </div>
    </div>
</template>


<style scoped>
.imgBaniereHome {
  background-image: url('@/assets/img/baniereHome.png');
  background-size: cover;
  background-position: center 15%;
  width: 100%;
  height: 650px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  text-align: center;
}

.titlePrincipal {
  margin-top: 100px;
}

h1 {
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 2px 2px 4px #000;
}


.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 1050;
}

.modal-dialog-custom {

    background: transparent;
    max-width: 600px;
    margin: 1.75rem auto;
    width: 90%;
}

.modal-content {
    border-radius: 0.5rem;
    padding: 20px;
}

/* Styles pour le bouton de fermeture Bootstrap sur fond sombre */
.btn-close {
    background-color: transparent;
    color: #212529; /* Couleur sombre */
    opacity: 0.7;
  }

  .btn-close:hover {
    opacity: 1;
}


@media (max-width: 767.98px) {
  .pourquoiNousChoisir {
    display: none;

  }


}
</style>
