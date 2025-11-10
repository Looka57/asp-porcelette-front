<script setup>
</script>

<template>


  <div class="container my-5 text-center">
    <h2 class="my-4 fs-1 text-center text-light">Nos Sensei</h2>
    <div class="row justify-content-center">

      <div class="col-lg-3 col-md-6 col-sm-12 teacher-card">
        <div class="sensei-photo-container">
          <img src="../../assets/img/bakugo.webp" alt="Photo du Professeur Sensei 1" class="sensei-photo">
        </div>
        <h3 class="mt-3 mb-0 text-light">Jean Dupont</h3>
        <p class="text-secondary">Ceinture Noire 4ème Dan - Judo</p>
        <p class="text-muted">"La force ne vient pas d'une capacité physique, mais d'une volonté indomptable."</p>
      </div>

      <div class="col-lg-3 col-md-6 col-sm-12 teacher-card">
        <div class="sensei-photo-container">
          <img src="../../assets/img/denki.webp" alt="Photo du Professeur Sensei 2" class="sensei-photo">
        </div>
        <h3 class="mt-3 mb-0 text-light">Marie Durand</h3>
        <p class="text-secondary">Ceinture Noire 2ème Dan - Aikido</p>
        <p class="text-muted">"L'Aikido est l'art de la paix."</p>
      </div>

      <div class="col-lg-3 col-md-6 col-sm-12 teacher-card">
        <div class="sensei-photo-container">
          <img src="../../assets/img/Fumikage.jpg" alt="Photo du Professeur Sensei 3" class="sensei-photo">
        </div>
        <h3 class="mt-3 mb-0 text-light">David Martin</h3>
        <p class="text-secondary">Instructeur Jujitsu</p>
        <p class="text-muted">"Maîtriser son corps, c'est maîtriser son esprit."</p>
      </div>

      <div class="col-lg-3 col-md-6 col-sm-12 teacher-card">
        <div class="sensei-photo-container">
          <img src="../../assets/img/kiri.webp" alt="Photo du Professeur Sensei 4" class="sensei-photo">
        </div>
        <h3 class="mt-3 mb-0 text-light">Sophie Dubois</h3>
        <p class="text-secondary">Animatrice Judo Détente</p>
        <p class="text-muted">"Le sport pour le plaisir et le bien-être."</p>
      </div>
    </div>
  </div>

</template>


<style>

/* --- SECTION SENSEI --- */

.teacher-card {
  text-align: center;
  padding: 20px;
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
  border: 5px solid var(--bs-danger, #dc3545);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}

.sensei-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: grayscale(1);
}
</style>
