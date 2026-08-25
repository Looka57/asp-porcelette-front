<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue';
import ModalAddTransaction from '@/components/Comptas/ModalAddTransaction.vue'
import CardsGestionTransactions from '@/components/Comptas/CardsGestionTransactions.vue';
import TableTransaction from '@/components/Comptas/TableTransaction.vue';

// ===============================
// 🔹 STATE
// ===============================
const loading = ref(true);
const showModal = ref(false);
const transactions = ref([]);

// ===============================
// 🔹 FUNCTIONS
// ===============================
const handleAddTransaction = (tx) => {
  transactions.value.push({ id: transactions.value.length + 1, ...tx });
}

// ===============================
// 🔹 SIMULATE LOADING
// ===============================
onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 300);
});
</script>

<template>
  <div class="page-container">
    <div class="content-wrapper">
      <!-- Header avec titre et actions -->
      <header class="page-header">
        <div class="header-titles">
          <button class="btn-back" @click="$router.back()" title="Retour">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Retour</span>
          </button>
          <h1 class="page-title">Gestion des Transactions</h1>
        </div>

        <button class="btn-primary" @click="showModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Nouvelle transaction</span>
        </button>
      </header>

      <!-- Modal -->
      <ModalAddTransaction v-model:show="showModal" @submit="handleAddTransaction" />

      <!-- Loader State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <span>Chargement des données...</span>
      </div>

      <!-- Main Content -->
      <main v-else class="main-content">
        <CardsGestionTransactions />
        <TableTransaction :transactions="transactions" />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* ===============================
   🔹 LAYOUT & CONTAINER
   =============================== */
.page-container {
  min-height: 100vh;
  background-color: #121417;
  color: #f1f3f5;
  padding: 2rem 1.5rem;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ===============================
   🔹 HEADER & NAVIGATION
   =============================== */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.header-titles {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.02em;
}

/* ===============================
   🔹 BUTTONS
   =============================== */
.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #a0a6b1;
  padding: 0.55rem 0.9rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateX(-2px);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #ffbb33;
  color: #121417;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(255, 187, 51, 0.15);
}

.btn-primary:hover {
  background: #ffcc66;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(255, 187, 51, 0.25);
}

.btn-primary:active {
  transform: translateY(0);
}

/* ===============================
   🔹 LOADING STATE
   =============================== */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  gap: 1rem;
  color: #8a919e;
  font-size: 0.95rem;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(255, 187, 51, 0.15);
  border-top-color: #ffbb33;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===============================
   🔹 MAIN CONTENT AREA
   =============================== */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
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

/* Responsive adjustments */
@media (max-width: 640px) {
  .page-container {
    padding: 1.25rem 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-titles {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .btn-primary {
    justify-content: center;
    width: 100%;
  }
}
</style>
