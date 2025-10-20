
<script setup>

</script>

<template>
  <div class="container-fluid">
  <div class="headerLink w-100 d-flex align-items-center my-4 p-3 rounded">
      <!-- Bouton (dans le Header) -->
      <!-- ATTENTION : Retrait du @click="isCreateModalOpen = true" car Bootstrap le gère via data-bs-target="#createEvent" -->
      <button class="btn btn-outline-warning d-flex justify-content-center align-items-center"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#createEvent">
        <i class="pi pi-calendar-plus me-2"></i> Ajouter un événement
      </button>

      <!-- Liens de navigation -->
      <ul class="nav mb-0 ">
        <li class="nav-item">
          <a class="nav-link" href="#">Tous</a>
        </li>
        <li class="nav-item">
          <a class="nav-link " href="#">À venir</a>
        </li>
        <li class="nav-item">
          <a class="nav-link " href="#">Judo</a>
        </li>
        <li class="nav-item">
          <a class="nav-link " href="#">Judo Détente</a>
        </li>
        <li class="nav-item">
          <a class="nav-link " href="#">Aïkido</a>
        </li>
        <li class="nav-item">
          <a class="nav-link " href="#">Jujitsu</a>
        </li>
        <li class="nav-item">
          <a class="nav-link " href="#">Trier par…</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
a {
  color: white;
  font-weight: bold;
  position: relative;
  text-decoration: none;
  padding-bottom: 4px;
  transition: color 0.3s ease;
}

a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0%;
  height: 2px;
  background-color: orange;
  transition: width 0.3s ease;
}

/* Animation au survol */
a:hover::after {
  color: white;
  width: 100%;
}

.nav-link:hover,
.nav-link:focus {
  color: orange;
}

/* Lien actif (reste souligné) */
a.active::after {
  color: white;
  width: 100%;
}

a.active {
  color: white;
}
</style>
