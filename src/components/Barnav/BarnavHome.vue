<script setup>
// import { ref } from "vue";
</script>

<template>
  <header>
    <a href="#" class="logoBarNav">Logo ASP Porcelette</a>
    <nav class="navbar">
      <a href="#">Accueil</a>
      <a href="#">Judo</a>
      <a href="#">Aikido</a>
      <a href="#">Jujitsu</a>
      <a href="#">Actualités</a>
      <a href="#">Evenements</a>
    </nav>
  </header>
</template>



<style scoped>
header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(28, 28, 28, 0.394);
  color: white;
  padding: 20px 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  border-bottom: 2px solid rgba(255, 255, 255, .2);
  z-index: 1;
}

header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,transparent,rgba(255, 255, 255, 0.4),transparent); ;
  backdrop-filter: blur(10px);
  z-index: -1;
  transition: .5s;
}

header:hover::before {
  left: 100%;
  animation: slide 3s linear infinite;
}

.logoBarNav {
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  color: white;
  cursor: default;
}

.navbar a {
  margin-left: 35px;
  text-decoration: none;
  color: white;
  font-size: 18px;
  transition: .3s;
}

.navbar a:hover {
  color: red;
}
</style>
