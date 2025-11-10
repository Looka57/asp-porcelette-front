<script setup>
import BarnavHome from '@/components/Barnav/BarnavHome.vue';

</script>

<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100">
    <BarnavHome />
    <div class="imgHome">
      <div class="titlePrincipal">
        <h2 class="fs-1 text-uppercase">L'art du mouvement ° L'esprit des disciplines.</h2>
        <p class="fs-3">Judo - Aikido - Jujitsu</p>
        <button class="btn btn-danger">Découvrir nos disciplines</button>
      </div>
    </div>

    <!-- // Cartes des disciplines -->


    <div class="container-fluid my-5">
      <div class="row justify-content-center">
        <h2 class="my-4">Nos disciplines</h2>
        <div class="col-lg-4 col-md-12 col-sm-12 quatre hero">
          <img src="../assets/img/bakugo.webp" alt="" class="image">
          <div class="text"></div>
          <div class="logo">
            <img src="../assets/img/bakugo.webp" alt="">
          </div>
          <div class="main-text">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
           <div class="btn btn-outline-light hero-btn">
            <a href="#">Judo</a>
          </div>
        </div>
        <div class="col-lg-4 col-md-12 col-sm-12 first hero">
          <img src="../assets/img/bakugo.webp" alt="" class="image">
          <div class="text"></div>
          <div class="logo">
            <img src="../assets/img/icones/iconsAïkido.png" alt="">
          </div>
          <div class="main-text">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
           <div class="btn btn-outline-light hero-btn">
            <a href="#">Aikido</a>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 col-sm-12 second hero">
          <img src="../assets/img/bakugo.webp" alt="" class="image">
          <div class="text"></div>
          <div class="logo">
            <img src="../assets/img/bakugo.webp" alt="">
          </div>
          <div class="main-text">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
           <div class="btn btn-outline-light hero-btn">
            <a href="#">Jujitsu</a>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 col-sm-12 third hero">
          <img src="../assets/img/bakugo.webp" alt="" class="image">
          <div class="text"></div>
          <div class="logo">
            <img src="../assets/img/bakugo.webp" alt="">
          </div>
          <div class="main-text">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
           <div class="btn btn-outline-light hero-btn">
            <a href="#">Judo Détente</a>
          </div>
        </div>
      </div>
    </div>
  </div>



<!-- FOOTER -->

  <footer class="bg-dark text-center text-light d-flex flex-column align-items-center">
    ASP Porcelette © 2024. Tous droits réservés.
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
  margin: 0;
}




/* CARDS */

.hero {
  display: inline-block;
  position: relative;
  width: 400px;
  min-width: 400px;
  height: 400px;
  border-radius: 30px;
  overflow: hidden;
   box-shadow: 0 15px 15px rgba(0,0,0,0.3);
  margin: 30px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}


.hero:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(48, 48, 48, 0.4);
}

.image {
  height: 100%;
}

.text {
  background-image: linear-gradient(0deg, #091030, #31b3d0);
  border-radius: 30px;
  position: absolute;
  top: 55%;
  left: -5px;
  height: 65%;
  width: 108%;
  transform: skew(19deg, -9deg);
}

.second .text {
  background-image: linear-gradient(-20deg, #673f08, #e7d25c)
}

.third .text {
  background-image: linear-gradient(-20deg, #082d2a, #38ef7d)
}

.quatre .text {
  background-image: linear-gradient(-20deg, #3a0909, #ef3838)
}

.logo {
  height: 80px;
  width: 80px;
  border-radius: 20px;
  background-color: #fff;
  position: absolute;
  bottom: 30%;
  left: 30px;
  overflow: hidden;
  box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.7);
}

.logo img {
  height: 100%;
}

.main-text {
  position: absolute;
  color: #fff;
  font-weight: 900;
  left: 150px;
  bottom: 26%;
}

.hero-btn {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  border: 2px solid #fff;
  padding: 10px 20px;
  border-radius: 30px;
  text-transform: uppercase;
  font-weight: 600;
  transition: all 0.3s ease;
}

.hero-btn a {
  color: inherit;
  text-decoration: none;
}

.hero-btn:hover {
  background-color: #fff;
  color: #1e2f84; /* ou autre couleur selon la carte */
  text-decoration: none;
}

</style>
