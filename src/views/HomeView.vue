<script setup>
import BarnavHome from '@/components/Barnav/BarnavHome.vue';
import CardsHomes from '@/components/Home/CardsHome.vue';
import SenseiHome from '@/components/Home/SenseiHome.vue';
import ChoisirHome from '@/components/Home/ChoisirHome.vue';
import EventActuHome from '@/components/Home/EventActuHome.vue';

</script>

<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100">
    <BarnavHome />
    <div class="imgHome">
      <div class="titlePrincipal">
        <h2 class="fs-1 text-uppercase">L'art du mouvement <br> L'esprit des disciplines.</h2>
        <p class="fs-3">Judo - Aikido - Jujitsu</p>
      </div>
    </div>
    <CardsHomes></CardsHomes>
    <SenseiHome></SenseiHome>

    <div class="row secondaryPartie d-flex justify-content-around">
      <div class="col-lg-6 pourquoiNousChoisir">
        <ChoisirHome></ChoisirHome>
      </div>
      <div class="col-lg-6 eventAct">
        <EventActuHome></EventActuHome>
      </div>
    </div>
  </div>



  <!-- FOOTER -->

  <footer class="bg-dark text-center text-light d-flex flex-column align-items-center">
    ASP Porcelette © 2025. Tous droits réservés.
    <router-link to="/login"
      class=" inline-block bg-green-500 text-dark py-2 px-4 rounded hover:bg-green-600 transition">
      Accéder à l'Espace Membre
    </router-link>
  </footer>
</template>


<style>
.imgHome {
  background-image: url('@/assets/img/baniereHome.png');
  background-size: cover;
  background-position: center 15%;
  width: 100%;
  height: 650px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  text-align: center;
}

.titlePrincipal {
  margin-top: 100px;
}
</style>
