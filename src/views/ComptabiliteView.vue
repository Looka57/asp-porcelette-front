<script setup>
import CardsComptes from '@/components/Comptas/CardsComptes.vue';
</script>

<template>
  <div class="compta-page">
    <div class="compta-wrapper">
      <!-- En-tête de la page -->
      <header class="compta-header">
        <div class="header-content">
          <h1 class="page-title">Comptabilité</h1>
          <p class="page-subtitle">Vue d'ensemble et gestion de vos comptes financiers</p>
        </div>
      </header>

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
.compta-page {
  min-height: 100vh;
  background-color: #121417;
  color: #f1f3f5;
  padding: 2rem 1.5rem;
}

.compta-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
