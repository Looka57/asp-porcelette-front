<template>
  <div class="container-fluid p-0 bg-dark text-light ">
    <div class="container-fluid my-5">
      <div class="row p-2">
        <h2 class="my-4 fs-1 text-center">Nos disciplines</h2>
        <div class="col-lg-4 col-md-12 col-sm-12 p-0 quatre hero">
          <img src="../../assets/img/judo.png" alt="" class="image">
          <div class="text"></div>
          <div class="logo">
            <img src="../../assets/img/icones/judoIcon.png" alt="">
          </div>
          <div class="main-text">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
          <div class="btn btn-outline-light hero-btn">
            <a href="#">Judo</a>
          </div>
        </div>
        <div class="col-lg-4 col-md-12 col-sm-12 p-0  first hero">
          <img src="../../assets/img/aikido.png" alt="" class="image">
          <div class="text"></div>
          <div class="logo">
            <img src="../../assets/img/icones/iconsAïkido.png" alt="">
          </div>
          <div class="main-text">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
          <div class="btn btn-outline-light hero-btn">
            <a href="#">Aikido</a>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 col-sm-12 p-0 second hero">
          <img src="../../assets/img/jujitsu.png" alt="" class="image">
          <div class="text"></div>
          <div class="logo">
            <img src="../../assets/img/icones/jiu-jitsu.png" alt="">
          </div>
          <div class="main-text">
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
          <div class="btn btn-outline-light hero-btn">
            <a href="#">Jujitsu</a>
          </div>
        </div>

        <div class="col-lg-4 col-md-6 col-sm-12 p-0 third hero">
          <img src="../../assets/img/judoDetente.png" alt="" class="image ">
          <div class="text"></div>
          <div class="logo">
            <img src="../../assets/img/icones/judoDetente.png" alt="">
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
</template>


<style>

.hero {
display: block;
position: relative;
max-width: 400px;
height: 400px;
border-radius: 30px;
overflow: hidden;
box-shadow: 0 15px 15px rgba(0, 0, 0, 0.3);
  margin-left: auto;
  margin-right: auto;
  margin-top: 30px;
  margin-bottom: 30px;
transition: transform 0.3s ease, box-shadow 0.3s ease;
}


.hero:hover {
transform: translateY(-5px);
box-shadow: 0 10px 25px rgba(48, 48, 48, 0.4);
}

.image {
height: 120%; /* Augmenter la hauteur pour qu'elle puisse être décalée */
  position: absolute;
  top: -22%; /* Décaler le haut de l'image de 10% vers le HAUT de la carte */
  left: -12%;
  object-position: center;
}
.second .image {
height: 120%; /* Augmenter la hauteur pour qu'elle puisse être décalée */
  position: absolute;
  top: -15%; /* Décaler le haut de l'image de 10% vers le HAUT de la carte */
  left: -33%;
  object-position: center;
}


.text {
  background-image: linear-gradient(0deg, #091030, #31b3d0);
  border-radius: 30px;
  position: absolute;
  top: 62%;
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
  bottom: 25%;
  left: 30px;
  overflow: hidden;
  padding: 5px;
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
  bottom: 22%;
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
  color: #1e2f84;
  /* ou autre couleur selon la carte */
  text-decoration: none;
}
</style>
