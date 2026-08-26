<script setup>
import CardsComptes from '@/components/Comptas/CardsComptes.vue';
</script>

<template>
  <div class="compta-page">
    <div class="compta-wrapper">
      <!-- En-tête de la page -->
    <!-- ===============================
     🔹 EN-TÊTE
================================ -->

<div class="page-header text-center mb-4">

  <div class="page-header-icon">
    <i class="pi pi-wallet"></i>
  </div>

  <h1>
    Comptabilité
  </h1>

  <p>
    Vue d'ensemble et gestion de vos comptes financiers
  </p>

</div>

      <!-- Section principale des cartes -->
      <main class="compta-main">
        <CardsComptes />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ===============================
   🔹 LAYOUT PRINCIPAL
   =============================== */
/* ===============================
   HEADER
================================ */

.page-header {
  padding: 1rem 0 1.5rem;
  
}

.page-header-icon {
  width: 54px;
  height: 54px;
  margin: 0 auto 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 193, 7, 0.45);
  border-radius: 12px;
  color: #ffc107;
  background: rgba(241, 238, 227, 0.08);
  font-size: 1.4rem;
  box-shadow:
    0 0 25px rgba(255, 193, 7, 0.08);
}

.page-header h1 {
  margin: 0;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  font-weight: 700;
  letter-spacing: -0.5px;
}

.page-header p {
  margin: 0.5rem 0 0;
  color: #8f969d;
  font-size: 0.95rem;
}
/* ===============================
   🔹 EN-TÊTE PAGE
   =============================== */
.compta-header {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.9rem;
  color: #8a919e;
  margin: 0;
}

/* ===============================
   🔹 ZONE PRINCIPALE
   =============================== */
.compta-main {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .compta-page {
    padding: 1.25rem 1rem;
  }

  .page-title {
    font-size: 1.4rem;
  }
}
</style>
