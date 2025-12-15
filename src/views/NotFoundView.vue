<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>Oups ! Cette page n'existe pas.</h2>
    <p>Il semble que vous vous soyez égaré sur le tatami.</p>
    <router-link to="/" class="btn-home">Retour à l'accueil</router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 100px 20px;
  color: #333;
}
h1 {
  font-size: 6rem;
  margin: 0;
  color: #d4af37; /* Couleur Or */
}
h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}
.btn-home {
  display: inline-block;
  margin-top: 30px;
  padding: 12px 25px;
  background-color: #000;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  transition: 0.3s;
}
.btn-home:hover {
  background-color: #d4af37;
}
</style>
