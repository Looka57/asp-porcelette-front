<script setup>
import { computed } from 'vue';

const props = defineProps({
  userList: {
    type: Array,
    default: () => []
  }
});

// ===============================
// 🔹 STATISTIQUES
// ===============================

// Total des membres affichés
const totalMembres = computed(() => {
  return props.userList.length;
});

// Membres ayant le rôle Sensei
const totalSenseis = computed(() => {
  return props.userList.filter(user =>
    user.roles?.includes('Sensei')
  ).length;
});

// Membres ayant le rôle Comité
const totalComite = computed(() => {
  return props.userList.filter(user =>
    user.roles?.includes('Comité')
  ).length;
});

// Membres ayant le rôle Secrétaire
const totalSecretaires = computed(() => {
  return props.userList.filter(user =>
    user.roles?.includes('Secrétaire')
  ).length;
});

const totalCompta = computed(() => {
  return props.userList.filter(user =>
    user.roles?.includes('Trésorière')
  ).length;
});
</script>

<template>
  <div class="statistics-grid">

    <!-- Total membres -->
    <div class="stat-card stat-total">
      <div class="stat-icon">
        <i class="pi pi-users"></i>
      </div>

      <div class="stat-content">
        <span class="stat-value">{{ totalMembres }}</span>
        <span class="stat-label">Total membres</span>
      </div>
    </div>

    <!-- Senseis -->
    <div class="stat-card stat-sensei">
      <div class="stat-icon">
        <i class="pi pi-user"></i>
      </div>

      <div class="stat-content">
        <span class="stat-value">{{ totalSenseis }}</span>
        <span class="stat-label">Senseis</span>
      </div>
    </div>

    <!-- Comité -->
    <div class="stat-card stat-comite">
      <div class="stat-icon">
        <i class="pi pi-users"></i>
      </div>

      <div class="stat-content">
        <span class="stat-value">{{ totalComite }}</span>
        <span class="stat-label">Comité</span>
      </div>
    </div>

    <!-- Secrétaires -->
    <div class="stat-card stat-secretaire">
      <div class="stat-icon">
        <i class="pi pi-user-edit"></i>
      </div>

      <div class="stat-content-secretaireCompta">
        <span class="stat-value">{{ totalSecretaires }}</span> __<span class="stat-value">{{ totalCompta }}</span>
        <span class="stat-label">Secrétaires/Trésorières</span>
      </div>
    </div>

  </div>
</template>

<style scoped>

/* ===============================
   🔹 CONTENEUR
================================ */

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  width: 100%;
  margin-bottom: 1.5rem;
}

/* ===============================
   🔹 CARTE
================================ */

.stat-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 105px;
  padding: 1.15rem;
  background: linear-gradient(
    145deg,
    rgba(43, 48, 54, 0.95),
    rgba(33, 37, 41, 0.95)
  );
  border: 1px solid #3c434a;
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.stat-card::after {
  content: '';
  position: absolute;
  right: -35px;
  bottom: -35px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 193, 7, 0.04);
  pointer-events: none;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: #495057;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
}

/* ===============================
   🔹 ICÔNE
================================ */

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 10px;
  font-size: 1.25rem;
}

/* ===============================
   🔹 CONTENU
================================ */

.stat-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.stat-value {
  font-size: 1.8rem;
  line-height: 1.1;
  font-weight: 700;
  color: #fff;
}

.stat-label {
  margin-top: 0.35rem;
  color: #8f969d;
  font-size: 0.8rem;
  font-weight: 500;
}

.stat-content-secretaireCompta{
  display: flex;
  gap: 0.25rem;
}

/* ===============================
   🔹 VARIANTS
================================ */

/* Total */
.stat-total .stat-icon {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

/* Sensei */
.stat-sensei .stat-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

/* Comité */
.stat-comite .stat-icon {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

/* Secrétaire */
.stat-secretaire .stat-icon {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

/* ===============================
   🔹 RESPONSIVE
================================ */

@media (max-width: 1100px) {
  .statistics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 575.98px) {
  .statistics-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .stat-card {
    min-height: 90px;
    padding: 1rem;
  }

  .stat-icon {
    width: 42px;
    height: 42px;
    font-size: 1.1rem;
  }

  .stat-value {
    font-size: 1.55rem;
  }
}

</style>

