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
              <span class="text-uppercase tracking-wider fs-7 fw-bold text-warning d-block mb-2">Informations Légales</span>
              <h1 class="display-5 text-white fw-bold mb-3">
                Mentions Légales
              </h1>
              <p class="lead text-light opacity-8faa max-w-700 mx-auto mb-0">
                Conformément aux dispositions de la loi pour la confiance dans l'économie numérique, voici les informations relatives à l'éditeur et à l'hébergeur du site <strong>AS Porcelette Arts Martiaux</strong>.
              </p>
            </header>

            <!-- 1. Éditeur du site -->
            <section class="mb-5">
              <h2 class="text-white h5 fw-semibold mb-3 d-flex align-items-center">
                <i class="bi bi-building me-2 text-info-custom"></i> 1. Éditeur du site
              </h2>
              <div class="p-4 rounded-3 bg-black bg-opacity-25 border border-secondary border-opacity-25">
                <ul class="list-unstyled m-0 d-flex flex-column gap-2 text-light opacity-85">
                  <li><strong>Nom de l’association :</strong> AS Porcelette Arts Martiaux</li>
                  <li><strong>Statut :</strong> Association loi 1901</li>
                  <li><strong>Siège social :</strong> Porcelette, France</li>
                  <li><strong>Responsable de la publication :</strong> Amandine Napolitano</li>
                  <li><strong>Contact :</strong> Via le formulaire ou les réseaux officiels du site</li>
                </ul>
              </div>
            </section>

            <!-- 2. Hébergement -->
            <section class="mb-5">
              <h2 class="text-white h5 fw-semibold mb-3 d-flex align-items-center">
                <i class="bi bi-server me-2 text-info-custom"></i> 2. Hébergement
              </h2>
              <div class="p-4 rounded-3 bg-black bg-opacity-25 border border-secondary border-opacity-25">
                <ul class="list-unstyled m-0 d-flex flex-column gap-2 text-light opacity-85">
                  <li><strong>Hébergeur :</strong> OVHcloud</li>
                  <li><strong>Adresse :</strong> 2 rue Kellermann – 59100 Roubaix – France</li>
                  <li><strong>Site web :</strong> <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer" class="text-info text-decoration-none">ovhcloud.com</a></li>
                </ul>
              </div>
            </section>

            <!-- 3. Propriété intellectuelle -->
            <section class="mb-5">
              <h2 class="text-white h5 fw-semibold mb-3 d-flex align-items-center">
                <i class="bi bi-shield-lock me-2 text-info-custom"></i> 3. Propriété intellectuelle
              </h2>
              <p class="text-light opacity-85 mb-3">
                L’ensemble des contenus présents sur ce site (textes, images, logos, icônes) est la propriété exclusive de l’association <strong>AS Porcelette Arts Martiaux</strong>, sauf mention contraire explicite.
              </p>
              <div class="alert alert-danger bg-danger bg-opacity-25 text-danger border-0 p-3 rounded-3 small">
                <i class="bi bi-exclamation-triangle-fill me-1"></i> <strong>Interdiction :</strong> Toute reproduction, représentation, modification ou adaptation totale ou partielle des éléments du site est interdite sans autorisation écrite préalable.
              </div>
            </section>

            <!-- 4. Responsabilité -->
            <section class="mb-4">
              <h2 class="text-white h5 fw-semibold mb-3 d-flex align-items-center">
                <i class="bi bi-info-circle me-2 text-info-custom"></i> 4. Responsabilité
              </h2>
              <p class="text-light opacity-85 mb-3">
                L’association s'efforce de fournir des informations précises, mais ne saurait être tenue responsable :
              </p>
              <ul class="text-light opacity-85 ps-3 d-flex flex-column gap-2">
                <li>Des erreurs ou omissions dans les informations diffusées.</li>
                <li>Des éventuels dysfonctionnements techniques du site.</li>
                <li>Des dommages directs ou indirects résultant de l'accès au site.</li>
              </ul>
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

/* Force TOUS les titres h2 de ce composant en jaune, peu importe Bootstrap */
h2.text-gold,
.card h2 {
  color: #ffc107 !important;
}

.text-gold {
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
