<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/axios';

const userList = ref([]);
const selectedDiscipline = ref('');
const discplineList = ref([]);
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

  try {
    const reponse = await api.get('/Discipline');
    discplineList.value = reponse.data || [];
  } catch (err) {
    console.error(err);
  }
});
</script>

<template>
  <!-- UTILISATION DE container-fluid ET p-4 POUR RÉDUIRE L'ESPACE -->
  <div class="container-fluid bg-dark text-white min-h-screen p-4">
    <h1 class="m-3 text-center">Liste des Senseis</h1>
    <button class="mb-3 btn btn-outline-warning d-flex align-items-center" data-bs-toggle="modal"
      data-bs-target="#createAdherent">
      <i class="pi pi-plus-circle me-2"></i> Ajout Sensei
    </button>

    <!-- ==================== -->
    <!-- Modal -->
    <!-- ================== -->
    <div class="modal fade" id="createAdherent" tabindex="-1" aria-labelledby="createAdherentLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content modalDesign bg-light text-dark  ">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="createrAdherentHeader">Créer un nouveau Sensei</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form method="post" action="#">
              <div class="row mb-3">
                <div class="col">
                  <label for="name" class="form-label">Nom</label>
                  <input type="text" class="form-control" id="name" placeholder="....">
                </div>
                <div class="col">
                  <label for="LastName" class="form-label">Prénom</label>
                  <input type="text" class="form-control" id="LastName" placeholder="....">
                </div>
              </div>
              <div class="mb-3">
                <label for="Adress" class="form-label">Adresse</label>
                <input type="text" class="form-control" id="Adress" placeholder="....">
              </div>
              <div class="mb-3">
                <label for="City" class="form-label">Ville</label>
                <input type="text" class="form-control" id="City" placeholder="....">
              </div>
              <div class="row mb-3">
                <div class="col">
                  <label for="CP" class="form-label">Code postal</label>
                  <input type="text" class="form-control" id="CP" placeholder="....">
                </div>
                <div class="col">
                  <label for="Phone" class="form-label">Téléphone</label>
                  <input type="text" class="form-control" id="Phone" placeholder="....">
                </div>
              </div>
              <div class="mb-3">
                <label for="Email" class="form-label">Email</label>
                <input type="mail" class="form-control" id="Email" placeholder="....">
              </div>
              <div class="row mb-3">
                <div class="col">
                  <label for="Grade" class="form-label">Grade</label>
                  <input type="text" class="form-control" id="Grade" placeholder="....">
                </div>
                <div class="col">
                  <label for="Birth" class="form-label">Date de naissance</label>
                  <input type="date" class="form-control" id="Birth" placeholder="....">
                </div>
              </div>
              <div class="mb-3">
                <label for="Discipine" class="form-label">Discipine</label>
                <select class="form-control" v-model="selectedDiscipline" name="discipline" id="discipline">
                  <option value="">-- Choisir une discipline --</option>
                  <option v-for="discipline in discplineList" :key="discipline.id" :value="discipline.id">
                    {{ discipline.nom }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="Bio" class="form-label">Biographie</label>
                <textarea class="form-control" id="Bio" rows="3"></textarea>
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            <button type="button" class="btn btn-primary">Sauvegarder</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== -->
    <!-- Tableau -->
    <!-- ================== -->
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
        <table class="table table-dark table-striped table-hover align-middle text-center">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nom</th>
              <th scope="col">Prénom</th>
              <th scope="col">Email</th>
              <th scope="col">Téléphone</th>
              <th scope="col">Adresse</th>
              <th scope="col">Ville</th>
              <th scope="col">Statut</th>
              <th scope="col">Discipline</th>
              <!-- <th scope="col">Date</th> -->
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
              <td>{{ user.telephone || 'N/A' }}</td>
              <td>{{ user.adresse || 'N/A' }}</td>
              <td>{{ user.ville || 'N/A' }}</td>
              <td>{{ user.statut || 'N/A' }}</td>
              <!-- <td>{{ user.dateDeCreation || 'N/A' }}</td> -->
              <td>{{ user.dicipline || 'N/A' }}</td>
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


<style setup></style>
