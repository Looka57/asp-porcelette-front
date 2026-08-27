<script setup>
// Pas de logique particulière requise pour cette page statique
</script>

<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100 pb-5">

    <!-- Bouton de retour -->
    <div class="container pt-5">
      <router-link to="/" class="btn rounded-pill px-4 py-2 fw-semibold btn-outline-custom-muted mb-4 shadow-sm">
        <i class="bi bi-arrow-left me-2"></i> Retour à l'accueil
      </router-link>
    </div>

    <!-- Contenu Principal -->
    <div class="container my-4">
      <div class="row justify-content-center">
        <div class="col-lg-10">

          <div class="card bg-dark-card text-light rounded-4 shadow-lg border-secondary border-opacity-50 p-4 p-md-5">

            <!-- En-tête -->
            <header class="text-center mb-5 pb-4 border-bottom border-secondary border-opacity-50">
              <span class="text-uppercase tracking-wider fs-7 fw-bold text-gold d-block mb-2">Gestion des traceurs</span>
              <h1 class="display-5 text-white fw-bold mb-3">
                Politique de Cookies
              </h1>
              <p class="lead text-light opacity-85 max-w-700 mx-auto mb-0">
                L'<strong>AS Porcelette Arts Martiaux</strong> accorde une importance capitale à votre vie privée. Nous limitons l'utilisation des cookies au strict minimum nécessaire.
              </p>
            </header>

            <!-- 1. Qu’est-ce qu’un cookie ? -->
            <section class="mb-5">
              <h2 class="h5 fw-semibold mb-3 d-flex align-items-center text-gold">
                <i class="bi bi-question-circle me-2"></i> 1. Qu’est-ce qu’un cookie ?
              </h2>
              <p class="text-light opacity-85 mb-0">
                Un cookie est un petit fichier texte stocké sur votre terminal. Il permet d'assurer le bon fonctionnement technique d'un site internet.
              </p>
            </section>

            <!-- 2. Cookies utilisés sur ce site -->
            <section class="mb-5">
              <h2 class="h5 fw-semibold mb-3 d-flex align-items-center text-gold">
                <i class="bi bi-shield-check me-2"></i> 2. Cookies utilisés sur ce site
              </h2>
              <p class="text-light opacity-85 mb-3">
                Ce site n'utilise <strong>aucun cookie de pistage, de publicité ou d'analyse tierce</strong> pour les visiteurs du site vitrine.
              </p>

              <div class="p-4 rounded-3 bg-black bg-opacity-25 border border-secondary border-opacity-25">
                <p class="mb-2 text-info fw-semibold"><i class="bi bi-key-fill me-1"></i> Cookies d'authentification (JWT) :</p>
                <p class="small text-light opacity-85 mb-0">
                  Un cookie technique contenant un jeton JWT est utilisé exclusivement pour sécuriser l'accès à l'<strong>Espace Administration</strong> (réservé aux Senseis et à l'Administrateur). Il permet de maintenir la session de travail ouverte et de garantir la sécurité des modifications apportées au site.
                </p>
              </div>
            </section>

            <!-- 3. Consentement et Gestion -->
            <section class="mb-4">
              <h2 class="h5 fw-semibold mb-3 d-flex align-items-center text-gold">
                <i class="bi bi-sliders me-2"></i> 3. Consentement et Gestion
              </h2>
              <p class="text-light opacity-85 mb-3">
                Conformément aux directives de la CNIL, les cookies utilisés pour l'authentification des administrateurs sont exemptés de consentement préalable car ils sont strictement nécessaires à la fourniture d'un service expressément demandé par l'utilisateur (la gestion du site).
              </p>

              <div class="alert alert-success bg-success bg-opacity-25 text-success border-0 p-3 rounded-3 small mb-3">
                <i class="bi bi-check-circle-fill me-1"></i> <strong>Pour les visiteurs :</strong> Vous pouvez naviguer sur l'ensemble de notre site vitrine en toute sérénité, aucune donnée personnelle n'est tracée via des cookies.
              </div>

              <div class="alert alert-warning bg-warning bg-opacity-25 text-warning border-0 p-3 rounded-3 small mb-4">
                <i class="bi bi-exclamation-triangle-fill me-1"></i> <strong>Pour les administrateurs :</strong> Veillez à vous déconnecter après chaque session pour protéger l'accès à l'administration.
              </div>

              <p class="text-center text-light opacity-75 small m-0">
                Pour plus d’informations, vous pouvez consulter le site de la
                <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" class="text-info text-decoration-none">CNIL</a>.
              </p>
            </section>

            <!-- Pied de page -->
            <footer class="pt-4 border-top border-secondary border-opacity-50 text-center">
              <router-link to="/" class="btn rounded-pill px-4 py-2 btn-outline-custom-muted fw-semibold">
                <i class="bi bi-house-door me-1"></i> Retour à l'accueil
              </router-link>
            </footer>

          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* --- DESIGN & CARTES --- */
.bg-dark-card {
  background-color: #1a1d21;
}

/* Force la couleur dorée/avertissement sur les titres et icônes */
.text-gold,
h2.text-gold,
.card h2 {
  color: #ffc107 !important;
}

/* --- BOUTONS & STYLES --- */
.btn-outline-custom-muted {
  background-color: #1a1d21;
  color: #adb5bd;
  border: 1px solid #343a40;
}

.btn-outline-custom-muted:hover {
  background-color: #2c3034;
  color: #ffffff;
}

.tracking-wider {
  letter-spacing: 0.1em;
}

.fs-7 {
  font-size: 0.75rem;
}
</style>
