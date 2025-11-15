<script setup>
// import { ref } from "vue";
</script>

<template>
  <header>
    <a href="#" class="logoBarNav">Logo ASP Porcelette</a>
    <nav class="navbar">
      <router-link to="/">Accueil</router-link>
      <div class="dropdown">
        <span class="dropbtn">Disciplines</span>
        <div class="dropdown-content">
          <router-link to="/judo">Judo</router-link>
          <router-link to="/aikido">Aïkido</router-link>
          <router-link to="/jujitsu">Jujitsu</router-link>
          <router-link to="/judo-detente">Judo Détente</router-link>
        </div>
      </div>
      <router-link to="/actualites">Actualités</router-link>
      <router-link to="/evenements">Evenements</router-link>
      <router-link to="/tarifs">Tarifs</router-link>
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

/* ... Styles header::before et logoBarNav inchangés ... */

.logoBarNav {
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  color: white;
  cursor: default;
}

/* Style des liens de la barre de navigation et du bouton déroulant (regroupement) */
.navbar a, .dropbtn {
  margin-left: 15px;
  text-decoration: none;
  color: white; /* Couleur du texte par défaut */
  font-size: 18px;
  transition: all .3s ease;
  cursor: pointer;
  display: inline-block;
  padding: 8px 12px;
  border-radius: 20px;
}

/* L'effet de survol et l'état ACTIF (CORRIGÉ) */
.navbar a:hover,
/* Utilisation de la classe de correspondance exacte */
.navbar a.router-link-exact-active,
.dropdown:hover .dropbtn {
  color: white;
  background-color: red;
}

/* --- AMÉLIORATION DU DROPDOWN --- */

/* Flèche d'indication pour le menu déroulant */
.dropbtn::after {
  content: '▼';
  font-size: 10px;
  margin-left: 6px;
  transition: transform 0.3s ease;
  display: inline-block;
}

/* Rotation de la flèche au survol */
.dropdown:hover .dropbtn::after {
  transform: rotate(180deg);
}

/* Container dropdown */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Contenu du dropdown (Le menu qui apparaît) */
.dropdown-content {
  display: none;
  position: absolute;
  left: 15px;
  top: 100%; /* La correction pour éviter le "flickering" */
  background: rgba(28, 28, 28, 0.95);
  backdrop-filter: blur(8px);
  min-width: 200px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 5px 0;
  z-index: 10;
  opacity: 0;
  transform: translateY(-5px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

/* Les liens dans le dropdown */
.dropdown-content a {
  /* IMPORTANT: Si un lien dans le dropdown est ACTIF, il doit aussi avoir le style rouge */
  /* On applique les styles de base du sous-menu */
  margin-left: 0;
  padding: 10px 20px;
  display: block;
  font-size: 16px;
  color: white;
  border-radius: 0;
  background: transparent;
}

/* Hover sur les liens internes ET LIENS ACTIFS DANS LE DROPDOWN */
.dropdown-content a:hover, .dropdown-content a.router-link-active {
  color: red;
  background: rgba(255, 255, 255, 0.05);
}


/* Affichage du dropdown au survol avec l'animation */
.dropdown:hover .dropdown-content {
  display: block;
  opacity: 1;
  transform: translateY(0);
}
</style>
