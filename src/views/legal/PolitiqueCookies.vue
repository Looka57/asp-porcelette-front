

<template>
  <div class="container mt-8 py-5 bg-dark text-light min-vh-100">
    <div class="mb-4">
  <router-link to="/" class="btn btn-outline-warning btn-sm d-inline-flex align-items-center gap-2">
    <i class="bi bi-arrow-left"></i> 🏠 Retour à l'accueil
  </router-link>
</div>
    <h1 class="text-center mb-5 text-warning">🍪 Politique de Cookies</h1>

    <div class="row justify-content-center">
      <div class="col-lg-10">

        <p class="lead text-center mb-5">
          L'<strong>AS Porcelette Arts Martiaux</strong> accorde une importance capitale à votre vie privée.
          Nous limitons l'utilisation des cookies au strict minimum nécessaire.
        </p>

        <hr class="my-4 border-secondary">

        <h2 class="mt-4 text-warning h4">1. Qu’est-ce qu’un cookie ?</h2>
        <p>
          Un cookie est un petit fichier texte stocké sur votre terminal. Il permet d'assurer le bon
          fonctionnement technique d'un site internet.
        </p>

        <h2 class="mt-4 text-warning h4">2. Cookies utilisés sur ce site</h2>
        <p>
          Ce site n'utilise <strong>aucun cookie de pistage, de publicité ou d'analyse tierce</strong> pour les visiteurs du site vitrine.
        </p>

        <div class="ps-3 border-start border-warning border-4 mb-4 bg-opacity-10 bg-dark p-3 rounded-end text-info">
          <p class="mb-2"><strong>Cookies d'authentification (JWT) :</strong></p>
          <p class="small mb-0">
            Un cookie technique contenant un jeton JWT est utilisé exclusivement pour sécuriser l'accès à l'<strong>Espace Administration</strong> (réservé aux Senseis et à l'Administrateur).
            Il permet de maintenir la session de travail ouverte et de garantir la sécurité des modifications apportées au site.
          </p>
        </div>

        <h2 class="mt-4 text-warning h4">3. Consentement et Gestion</h2>
        <p>
          Conformément aux directives de la CNIL, les cookies utilisés pour l'authentification des administrateurs
          sont exemptés de consentement préalable car ils sont strictement nécessaires à la fourniture d'un service expressément
          demandé par l'utilisateur (la gestion du site).
        </p>

        <div class="alert alert-success bg-transparent border-success text-success mt-4">
          <strong>Pour les visiteurs :</strong> Vous pouvez naviguer sur l'ensemble de notre site vitrine en toute sérénité,
          aucune donnée personnelle n'est tracée via des cookies.
        </div>

        <div class="alert alert-warning bg-transparent border-warning text-warning mt-4">
          <strong>Pour les administrateurs :</strong> Veillez à vous déconnecter après chaque session pour protéger l'accès à l'administration.
        </div>

        <p class="mt-5 text-center">
          Pour plus d’informations, vous pouvez consulter le site de la
          <a href="https://www.cnil.fr" target="_blank" class="text-info">CNIL</a>.
        </p>

      </div> </div> </div> </template>

<style scoped>
/* ===============================
   🔹 STYLES LOCAUX
   =============================== */
h2 {
  margin-bottom: 20px;
  text-transform: uppercase;
  font-size: 1.1rem;
  letter-spacing: 1px;
}

.ps-3 {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
