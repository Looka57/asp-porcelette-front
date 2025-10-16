<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const userList = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    // 🎯 Appel à votre endpoint C# sécurisé /api/User/admin/list
    const response = await api.get('User/admin/list');
    const allUsers = response.data || [];
    // Filtrer pour ne garder que les utilisateurs avec le rôle "Sensei"
    userList.value = allUsers.filter(user => user.roles.includes('Admin') || user.roles.includes('Sensei'));
  } catch (err) {
    error.value = 'Échec du chargement. Vérifiez que vous êtes Admin et que le token est valide.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
    <!-- UTILISATION DE container-fluid ET p-4 POUR RÉDUIRE L'ESPACE -->
    <div class="container-fluid bg-dark text-white min-h-screen p-4">
        <h1 class="m-3 text-center">Liste des Senseis</h1>

        <div v-if="loading" class="text-secondary">Chargement de la liste des Sensei...</div>
        <div v-else-if="error" class="text-red-600">{{ error }}</div>
        <div v-else>
            <!-- Gestion du cas où aucun Sensei n'est trouvé -->
            <div v-if="userList.length === 0" class="text-light p-4 border rounded">
                Aucun Sensei trouvé pour le moment.
            </div>

            <!-- NOUVELLE TABLE DE STYLE BOOTSTRAP -->
            <!-- Ajout de 'table-responsive' pour un bon affichage sur les petits écrans -->
            <div v-else class="table-responsive">
                <table class="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nom</th>
                            <th scope="col">Prénom</th>
                            <th scope="col">Email</th>
                            <!-- MODIFICATION: Définir une largeur minimale pour la colonne Action -->
                            <th scope="col" style="width: 400px;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Utilisation de user.userId comme clé pour une meilleure performance -->
                        <tr v-for="(user, index) in userList" :key="user.userId">
                            <th scope="row">{{ index + 1 }}</th>
                            <!-- Correction : Les cellules de données sont des <td> -->
                            <td>{{ user.nom }}</td>
                            <td>{{ user.prenom }}</td>
                            <td>{{ user.email || 'N/A' }}</td>
                            <td>
                                <button class="btn btn-outline-info mx-2">
                                    <i class="pi pi-pencil"></i> Modifier
                                </button>
                                <button class="btn btn-outline-danger">
                                    <i class="pi pi-trash"></i> Supprimer
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
