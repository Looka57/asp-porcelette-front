<script setup>
import { ref } from "vue";
import logo from '@/assets/img/logo.png';

// État pour gérer l'ouverture et la fermeture du menu mobile
const isMenuOpen = ref(false);

// Fonction pour basculer l'état du menu
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Fonction pour fermer le menu après la navigation sur mobile
const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<template>
  <div class="container-fluid p-0 bg-dark text-light bob">
    <header>
     <img class="logoBarNav" :src="logo" alt="Logo ASP Porcelette">
      <!-- <a href="#" class="logoBarNav">Logo ASP Porcelette</a> -->

      <!-- Bouton Hamburger visible uniquement sur mobile/tablette -->
      <div class="menu-icon" :class="{ open: isMenuOpen }" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <!-- Navigation, avec classe 'active' conditionnelle -->
      <nav class="navbar" :class="{ active: isMenuOpen }">
        <!-- Ajoutez l'événement @click="closeMenu" à tous les liens pour fermer le menu après la navigation -->
        <router-link to="/" @click="closeMenu">Accueil</router-link>

        <div class="dropdown">
          <span class="dropbtn">Disciplines</span>
          <div class="dropdown-content">
            <router-link to="/judo" @click="closeMenu">Judo</router-link>
            <router-link to="/aikido" @click="closeMenu">Aïkido</router-link>
            <router-link to="/jujitsu" @click="closeMenu">Jujitsu</router-link>
            <router-link to="/judo-detente" @click="closeMenu">Judo Détente</router-link>
          </div>
        </div>

        <router-link to="/equipe" @click="closeMenu">Senseis</router-link>
        <router-link to="/actualites" @click="closeMenu">Actualités</router-link>
        <router-link to="/evenements" @click="closeMenu">Évènements</router-link>
        <router-link to="/tarifs" @click="closeMenu">Tarifs</router-link>
      </nav>
    </header>
  </div>
</template>


<style scoped>
header {
  position: fixed;
  width: 100%;
  box-sizing: border-box;
  top: 0;
  left: 0;
  background: rgba(28, 28, 28, 0.394);
  color: white;
  padding: 20px 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  border-bottom: 2px solid rgba(255, 255, 255, .2);
  z-index: 100;
}

/* .logoBarNav {
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  color: white;
  cursor: default;
  z-index: 101;
} */

.logoBarNav{
  height: 80px;
  width: 80px;
}

/* NAVIGATION DESKTOP */
.navbar {
  display: flex;
  transition: all 0.3s ease;
}

.navbar a,
.dropbtn {
  margin-left: 15px;
  text-decoration: none;
  color: white;
  font-size: 18px;
  transition: all .3s ease;
  cursor: pointer;
  display: inline-block;
  padding: 8px 12px;
  border-radius: 20px;
}

/* L'effet de survol et l'état ACTIF */
.navbar a:hover,
.navbar a.router-link-exact-active,
.dropdown:hover .dropbtn {
  color: white;
  background-color: red;
}


/* --- DROPDOWN (non modifié, fonctionne bien sur desktop) --- */
.dropbtn::after {
  content: '▼';
  font-size: 10px;
  margin-left: 6px;
  transition: transform 0.3s ease;
  display: inline-block;
}

.dropdown:hover .dropbtn::after {
  transform: rotate(180deg);
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  left: 15px;
  top: 100%;
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

.dropdown-content a {
  margin-left: 0;
  padding: 10px 20px;
  display: block;
  font-size: 16px;
  color: white;
  border-radius: 0;
  background: transparent;
}

.dropdown-content a:hover,
.dropdown-content a.router-link-active {
  color: red;
  background: rgba(255, 255, 255, 0.05);
}

.dropdown:hover .dropdown-content {
  display: block;
  opacity: 1;
  transform: translateY(0);
}

/* --- MENU HAMBURGER (MOBILE) --- */

/* L'icône du menu est masquée par défaut sur les grands écrans */
.menu-icon {
  display: none;
}

/* ------------------------------------------------------------------ */
/* MEDIA QUERY POUR LE RESPONSIVE (écrans <= 1200px) */
/* ------------------------------------------------------------------ */
@media (max-width: 1100px) {

  /* Ajustement du padding du header sur mobile */
  header {
    padding: 15px 20px;
  }

  /* Masquer la navigation par défaut sur mobile/tablette */
  .navbar {
    position: fixed;
    top: 101%;
    right: -100%; /* Caché hors de l'écran */
    width: 70%; /* Prend 70% de la largeur du viewport */
    max-width: 300px; /* Limiter la taille max pour les très grands écrans */
    height: 100vh;
    background: rgba(28, 28, 28, 0.95);
    backdrop-filter: blur(20px);
    flex-direction: column; /* Les liens s'empilent verticalement */
    justify-content: flex-start; /* Aligner les éléments en haut */
    align-items: flex-start; /* Aligner le texte à gauche */
    padding-top: 80px; /* Espace pour le logo/header */
    transition: right 0.4s ease-in-out;
  }

  /* Quand le menu est actif, le déplacer sur l'écran */
  .navbar.active {
    right: 0;
  }

  /* Ajustement des liens pour le menu mobile */
  .navbar a, .dropbtn {
    margin-left: 0;
    padding: 15px 20px;
    width: 100%; /* Prend toute la largeur du menu mobile */
    text-align: left;
    border-radius: 0;
  }

  /* Afficher l'icône du menu Hamburger */
  .menu-icon {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 25px;
    cursor: pointer;
    z-index: 101; /* Doit être au-dessus de la navbar */
  }

  .menu-icon span {
    display: block;
    height: 3px;
    width: 100%;
    background: white;
    border-radius: 3px;
    transition: all 0.3s ease-in-out;
  }

  /* Animation du Hamburger en Croix */
  .menu-icon.open span:nth-child(1) {
    transform: translateY(11px) rotate(45deg);
  }

  .menu-icon.open span:nth-child(2) {
    opacity: 0;
  }

  .menu-icon.open span:nth-child(3) {
    transform: translateY(-11px) rotate(-45deg);
  }

  /* Ajustement du Dropdown en mode mobile (il doit être pleine largeur) */
  .dropdown {
    width: 100%;
  }

  .dropdown-content {
    position: static; /* Position statique dans le flux pour s'ouvrir verticalement */
    width: 100%;
    left: auto;
    background: rgba(50, 50, 50, 0.95); /* Arrière-plan légèrement plus foncé */
    padding: 0;
    border: none;
    opacity: 1; /* Toujours visible si le dropdown est ouvert */
    transform: none;
    transition: none;
  }

  /* Ajuster les liens à l'intérieur du dropdown mobile */
  .dropdown-content a {
    padding-left: 40px; /* Décaler les sous-liens */
    font-size: 16px;
  }

  /* Forcer l'affichage immédiat du dropdown sur mobile */
  .dropdown:hover .dropdown-content {
    display: block;
  }
}

</style>
