<script setup>
import { ref, onMounted } from 'vue';
import CardsHomes from '@/components/Home/CardsHome.vue';
import SenseiHome from '@/components/Home/SenseiHome.vue';
import ChoisirHome from '@/components/Home/ChoisirHome.vue';
import EventActuHome from '@/components/Home/EventActuHome.vue';

const showModal = ref(false);
const ALERT_KEY = 'alert_travaux_vu';

onMounted(() => {
  const alertAlreadySeen = sessionStorage.getItem(ALERT_KEY);
  if (!alertAlreadySeen) {
    showModal.value = true;
  }
});

const closeModal = () => {
  showModal.value = false;
  sessionStorage.setItem(ALERT_KEY, 'true');
};
</script>

<template>
  <!-- 🔹 MODALE D'INFORMATION -->
  <Transition name="fade">
    <div v-if="showModal" class="modal-backdrop-custom d-flex justify-content-center align-items-center p-3">
      <div class="modal-dialog-custom w-100" role="document">
        <div class="modal-content border-0 rounded-4 shadow-2xl bg-dark-card text-white overflow-hidden">

          <!-- En-tête -->
          <div
            class="modal-header border-bottom border-secondary border-opacity-25 p-4 d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-3">
              <span class="icon-badge bg-warning bg-opacity-10 text-warning rounded-circle flex-shrink-0">
                <i class="bi bi-exclamation-triangle-fill fs-5"></i>
              </span>
              <div>
                <span class="text-uppercase tracking-wider fs-7 fw-bold text-warning d-block mb-1">Information
                  importante</span>
                <h5 class="modal-title fw-bold text-white m-0">Changement de lieu temporaire</h5>
              </div>
            </div>
            <button type="button" class="btn-close btn-close-white opacity-75" @click="closeModal"
              aria-label="Fermer"></button>
          </div>

          <!-- Corps -->
          <div class="modal-body p-4">
            <p class="text-light-50 fs-6 lh-base mb-4">
              En raison de travaux de rénovation de notre complexe sportif habituel, tous les cours de
              <strong class="text-white">Judo, Aïkido et Jujitsu</strong> sont déplacés à une adresse temporaire.
            </p>

            <div class="location-box p-3 rounded-3 border border-secondary border-opacity-25 bg-surface mb-3">
              <div class="d-flex align-items-center gap-2 text-warning fw-semibold mb-1">
                <i class="bi bi-geo-alt-fill"></i>
                <span>Nouvelle adresse :</span>
              </div>
              <p class="fs-5 fw-bold text-white m-0 ps-4">
                Complexe Sportif de Tennis
              </p>
            </div>

            <p class="small text-muted m-0 d-flex align-items-center gap-2">
              <i class="bi bi-info-circle"></i>
              Cette disposition reste en vigueur jusqu'à nouvel ordre.
            </p>
          </div>

          <!-- Pied de page -->
          <div
            class="modal-footer border-top border-secondary border-opacity-25 p-3 px-4 bg-surface d-flex justify-content-end">
            <button type="button" class="btn btn-warning fw-bold px-4 py-2 rounded-3 shadow-sm" @click="closeModal">
              J'ai compris
            </button>
          </div>

        </div>
      </div>
    </div>
  </Transition>

  <!-- 🔹 CONTENU PRINCIPAL -->
  <div class="container-fluid p-0 bg-dark text-light min-vh-100">

    <!-- Hero Banner -->
    <div class="hero-banner">
      <div class="hero-overlay"></div>
      <div class="hero-content text-center px-3">
        <h1 class="display-3 fw-black text-uppercase text-white tracking-tight mb-3">
          L'art du mouvement <br>
          <span class="text-warning">L'esprit des disciplines.</span>
        </h1>
        <div
          class="hero-subtitle-badge d-inline-block px-4 py-2 rounded-pill bg-dark bg-opacity-50 border border-secondary border-opacity-50 backdrop-blur">
          <p class="fs-5 text-light m-0 fw-medium tracking-wide">Judo — Aïkido — Jujitsu</p>
        </div>
      </div>
    </div>

    <!-- Sections -->
    <CardsHomes />
    <SenseiHome />

    <div class="row secondaryPartie d-flex justify-content-around g-4 px-3 px-lg-5 py-5 m-0">
      <div class="col-lg-6 col-md-8 col-sm-12 pourquoiNousChoisir">
        <ChoisirHome />
      </div>
      <div class="col-lg-6 eventAct">
        <EventActuHome />
      </div>
    </div>

  </div>
</template>

<style scoped>
/* ─── Hero Banner ─── */
.hero-banner {
  background-image: url('@/assets/img/baniereHome.png');
  background-size: cover;
  background-position: center 15%;
  width: 100%;
  height: 620px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(18, 18, 18, 0.4) 0%, rgba(18, 18, 18, 0.95) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  margin-top: 60px;
}

h1 {
  font-weight: 900;
  letter-spacing: -1px;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
}

.tracking-tight {
  letter-spacing: -0.025em;
}

.tracking-wide {
  letter-spacing: 0.05em;
}

.backdrop-blur {
  backdrop-filter: blur(8px);
}

/* ─── Modale Custom ─── */
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(6px);
  z-index: 2000;
}

.modal-dialog-custom {
  max-width: 540px;
}

.bg-dark-card {
  background-color: #1a1d21;
}

.bg-surface {
  background-color: #141619;
}

.icon-badge {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-light-50 {
  color: #c5c9d0;
}

.fs-7 {
  font-size: 0.75rem;
}

/* Transitions Vue */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 767.98px) {
  .pourquoiNousChoisir {
    display: none;
  }

  .hero-banner {
    height: 480px;
  }
}
</style>
