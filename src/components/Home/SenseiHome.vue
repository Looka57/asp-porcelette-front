<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
// ===============================
// 🔹 ÉTATS
// ===============================
const senseis = ref([]);
const isLoading = ref(false)
const errorMessage = ref(null)

// ===============================
// 🔹 CONSTANTES D’API
// ===============================
const API_PATH_USER = 'User/admin/list'

// ===============================
// 🔹 FONCTIONS
// ===============================
async function fetchSensei() {
  try {
    isLoading.value = true
    const reponse = await api.get(API_PATH_USER);
    const allUser = reponse.data;
    const listSensei = allUser.filter(user => {
      return Array.isArray(user.roles) && user.roles.some(role => role.toLowerCase() === 'sensei');
    });

    senseis.value = listSensei;
    console.log('Sensei chargé', senseis.value)
  } catch (error) {
    console.error('❌ Erreur lors du chargement des senseis :', error)
    errorMessage.value = "Erreur lors du chargement des senseis."
  } finally {
    isLoading.value = false
  }
}

// ===============================
// 🔹 MAPPAGE DISCIPLINE → COULEUR DE BORDURE
// ===============================
const disciplineBorderMap = {
  1: 'border-judo',     // Judo
  2: 'border-aikido',   // Aïkido
  3: 'border-jujitsu',  // Jujitsu
  4: 'border-detente'   // Judo détente
}

function getBorderClass(disciplineId) {
  return disciplineBorderMap[disciplineId] || 'border-judo'
}


// ===============================
// 🔹 CONSTRUCTION DE L’URL DE LA PHOTO
// ===============================
function getPhotoUrl(photoPath) {
  const baseUrl = 'http://localhost:5067'; // ✅ pas de https

  if (photoPath && typeof photoPath === 'string' && photoPath.startsWith('/')) {
    return `${baseUrl}${photoPath}`;
  }
  return '/img/default-profile.png';
}

onMounted(fetchSensei)
</script>

<template>
  <div v-if="isLoading" class="text-center text-light p-4">
    <p>Chargement des Sensei...</p>
  </div>

  <div v-else-if="errorMessage" class="text-center text-danger p-4">
    <p>{{ errorMessage }}</p>
  </div>
  <div class="container my-5 text-center">
    <h2 class="my-4 fs-1 text-center text-light">Nos Sensei</h2>
    <div class="row justify-content-center">
      <div v-for="sensei in senseis" :key="sensei.userId" class="col-lg-3 col-md-6 col-sm-12 teacher-card">
        <div class="sensei-photo-container" :class="getBorderClass(sensei.disciplineId)">
          <img :src="getPhotoUrl(sensei.photoUrl)" alt="Photo du Sensei" class="sensei-photo" />

        </div>
        <h3 class="mt-3 mb-0 text-light">{{ sensei.nom }} {{ sensei.prenom }}</h3>
        <p class="text-secondary">{{ sensei.grade }}</p>

      </div>
    </div>
  </div>
</template>


<style>
/* --- SECTION SENSEI --- */
.teacher-card {
  text-align: center;
  transition: transform 0.3s ease;
}

.teacher-card:hover {
  transform: translateY(-5px);
}

.sensei-photo-container {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}

/* NOUVELLES CLASSES DE COULEURS DE BORDURE */
.border-judo {
  border: 5px solid #ef3838;

}

.border-aikido {
  border: 5px solid #31b3d0;

}

.border-jujitsu {
  border: 5px solid #e7d25c;

}

.border-detente {
  border: 5px solid #38ef7d;

}

.sensei-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: grayscale(1);
}
</style>
