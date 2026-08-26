<script setup>
// Aucune logique spécifique requise pour ce composant statique,
// mais la balise script setup est conservée pour la cohérence de l'architecture.
</script>

<template>
  <div class="container-fluid py-5 bg-dark text-light">
    <div class="container py-3">

      <!-- En-tête de section -->
      <div class="text-center mb-5">
        <span class="text-uppercase tracking-wider fs-7 fw-bold text-warning d-block mb-2">Nos valeurs</span>
        <h3 class="display-3  text-white m-0">Pourquoi nous choisir ?</h3>
      </div>

      <!-- Grille des valeurs -->
      <div class="row g-4 justify-content-center text-center">

        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
          <div class="value-card p-4 rounded-4 bg-dark-card border border-secondary border-opacity-10 h-100 d-flex flex-column align-items-center justify-content-center">
            <div class="icon-wrapper mb-3">
              <img width="80" height="80" src="https://img.icons8.com/bubbles/100/handshake.png" alt="handshake" title="L'entraide au club" loading="lazy" />
            </div>
            <h5 class="text-light fw-bold m-0 fs-5">Entraide</h5>
          </div>
        </div>

        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
          <div class="value-card p-4 rounded-4 bg-dark-card border border-secondary border-opacity-10 h-100 d-flex flex-column align-items-center justify-content-center">
            <div class="icon-wrapper mb-3">
              <img width="80" height="80" src="https://img.icons8.com/bubbles/100/trust.png" alt="trust" title="La sincérité au club" loading="lazy" />
            </div>
            <h5 class="text-light fw-bold m-0 fs-5">Sincérité</h5>
          </div>
        </div>

        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
          <div class="value-card p-4 rounded-4 bg-dark-card border border-secondary border-opacity-10 h-100 d-flex flex-column align-items-center justify-content-center">
            <div class="icon-wrapper mb-3">
              <img width="80" height="80" src="https://img.icons8.com/bubbles/100/medal2-1.png" alt="medal2-1" title="La valeur au club" loading="lazy" />
            </div>
            <h5 class="text-light fw-bold m-0 fs-5">Valeurs</h5>
          </div>
        </div>

        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
          <div class="value-card p-4 rounded-4 bg-dark-card border border-secondary border-opacity-10 h-100 d-flex flex-column align-items-center justify-content-center">
            <div class="icon-wrapper mb-3">
              <img width="80" height="80" src="https://img.icons8.com/bubbles/100/crowd--v1.png" alt="crowd--v1" title="La convivialité au club" loading="lazy" />
            </div>
            <h5 class="text-light fw-bold m-0 fs-5">Convivialité</h5>
          </div>
        </div>

        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
          <div class="value-card p-4 rounded-4 bg-dark-card border border-secondary border-opacity-10 h-100 d-flex flex-column align-items-center justify-content-center">
            <div class="icon-wrapper mb-3">
              <img width="80" height="80" src="https://img.icons8.com/bubbles/100/annual-general-meeting.png" alt="annual-general-meeting" title="La solidarité au club" loading="lazy" />
            </div>
            <h5 class="text-light fw-bold m-0 fs-5">Solidarité</h5>
          </div>
        </div>

        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
          <div class="value-card p-4 rounded-4 bg-dark-card border border-secondary border-opacity-10 h-100 d-flex flex-column align-items-center justify-content-center">
            <div class="icon-wrapper mb-3">
              <img width="80" height="80" src="https://img.icons8.com/bubbles/100/no-yelling.png" alt="no-yelling" title="Le respect au club" loading="lazy" />
            </div>
            <h5 class="text-light fw-bold m-0 fs-5">Respect</h5>
          </div>
        </div>

        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
          <div class="value-card p-4 rounded-4 bg-dark-card border border-secondary border-opacity-10 h-100 d-flex flex-column align-items-center justify-content-center">
            <div class="icon-wrapper mb-3">
              <img width="80" height="80" src="https://img.icons8.com/bubbles/100/friends--v4.png" alt="friends--v4" title="L'amitié au club" loading="lazy" />
            </div>
            <h5 class="text-light fw-bold m-0 fs-5">Amitié</h5>
          </div>
        </div>

        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6">
          <div class="value-card p-4 rounded-4 bg-dark-card border border-secondary border-opacity-10 h-100 d-flex flex-column align-items-center justify-content-center">
            <div class="icon-wrapper mb-3">
              <img width="80" height="80" src="https://img.icons8.com/bubbles/100/strength.png" alt="strength" title="Le courage au club" loading="lazy" />
            </div>
            <h5 class="text-light fw-bold m-0 fs-5">Courage</h5>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-dark-card {
  background-color: #1a1d21;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.value-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 193, 7, 0.3) !important;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
}

.icon-wrapper img {
  transition: transform 0.3s ease;
}

.value-card:hover .icon-wrapper img {
  transform: scale(1.1);
}

.tracking-wider {
  letter-spacing: 0.1em;
}

.fw-black {
  font-weight: 900;
}

.fs-7 {
  font-size: 0.75rem;
}
</style>
