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
  <div class="container-fluid bg-dark text-white py-4 min-vh-100">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Gestion des Transactions</h2>
      <button class="btn btn-outline-warning d-flex align-items-center" @click="showModal = true">
        <i class="pi pi-plus-circle me-2"></i>
        Ajouter une dépense
      </button>
    </div>
      <button class="btn btn-outline-warning d-flex align-items-center" @click="$router.back()">
        <i class="pi pi-arrow-circle-left me-2"></i> Retour à la comptabilité
      </button>

    <!-- Modal -->
    <ModalAddTransaction v-model:show="showModal" @submit="handleAddTransaction" />


    <div v-if="loading" class="text-info text-center mt-5">
      Chargement des données...
    </div>

    <div v-else>
      <CardsGestionTransactions />
      <TableTransaction :transactions="transactions" />
    </div>
  </div>
</template>

<style scoped>

</style>
