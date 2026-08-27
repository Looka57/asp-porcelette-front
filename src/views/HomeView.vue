<script setup>

import CardsHomes from '@/components/Home/CardsHome.vue';
import SenseiHome from '@/components/Home/SenseiHome.vue';
import ChoisirHome from '@/components/Home/ChoisirHome.vue';
import EventActuHome from '@/components/Home/EventActuHome.vue';


</script>

<template>



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
