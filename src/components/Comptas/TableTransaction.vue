<script setup>
import { ref, onMounted } from 'vue'

// Exemple de données statiques pour le tableau
const transactions = ref([])

onMounted(() => {
  // Simule un chargement de données
  transactions.value = [
    { id: 1, date: '2025-10-01', type: 'Dépense', libelle: 'Achats matériels', montant: 1200, statut: 'Validée' },
    { id: 2, date: '2025-10-03', type: 'Dépense', libelle: 'Location salle', montant: 800, statut: 'Validée' },
    { id: 3, date: '2025-10-05', type: 'Recette', libelle: 'Cotisation Judo', montant: 1500, statut: 'En attente' },
    { id: 4, date: '2025-10-07', type: 'Recette', libelle: 'Cotisation Aïkido', montant: 1200, statut: 'Validée' },
    { id: 5, date: '2025-10-10', type: 'Dépense', libelle: 'Fournitures Jujitsu', montant: 600, statut: 'Annulée' }
  ]
})
</script>

<template>
  <div class="table-responsive mt-4">
    <table class="table table-dark table-hover align-middle">
      <thead class="table-secondary text-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">Date</th>
          <th scope="col">Type</th>
          <th scope="col">Libellé</th>
          <th scope="col">Montant (€)</th>
          <th scope="col">Statut</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tx in transactions" :key="tx.id">
          <th scope="row">{{ tx.id }}</th>
          <td>{{ tx.date }}</td>
          <td>
            <span :class="tx.type === 'Dépense' ? 'badge bg-danger' : 'badge bg-success'">
              {{ tx.type }}
            </span>
          </td>
          <td>{{ tx.libelle }}</td>
          <td>{{ tx.montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) }}</td>
          <td>
            <span
              :class="{
                'badge bg-success': tx.statut === 'Validée',
                'badge bg-warning text-dark': tx.statut === 'En attente',
                'badge bg-danger': tx.statut === 'Annulée'
              }"
            >
              {{ tx.statut }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-hover tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
