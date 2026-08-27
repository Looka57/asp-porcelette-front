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
              <span class="text-uppercase tracking-wider fs-7 fw-bold text-gold d-block mb-2">Confidentialité & Données</span>
              <h1 class="display-5 text-white fw-bold mb-3">
                Politique de Confidentialité (RGPD)
              </h1>
              <p class="lead text-light opacity-85 max-w-700 mx-auto mb-0">
                Chez <strong>AS Porcelette Arts Martiaux</strong>, la protection de vos données personnelles est une priorité. Nous nous engageons à respecter votre vie privée et à garantir la sécurité de vos informations conformément au RGPD.
              </p>
            </header>

            <!-- 1. Collecte des données -->
            <section class="mb-5">
              <h2 class="h5 fw-semibold mb-3 d-flex align-items-center text-gold">
                <i class="bi bi-folder2-open me-2"></i> 1. Collecte des données
              </h2>
              <p class="text-light opacity-85 mb-3">Nous collectons uniquement les informations nécessaires à la gestion de notre association et à la communication avec nos membres :</p>
              <div class="p-4 rounded-3 bg-black bg-opacity-25 border border-secondary border-opacity-25">
                <ul class="list-unstyled m-0 d-flex flex-column gap-2 text-light opacity-85">
                  <li><i class="bi bi-dot text-gold"></i> Nom et prénom</li>
                  <li><i class="bi bi-dot text-gold"></i> Adresse e-mail</li>
                  <li><i class="bi bi-dot text-gold"></i> Données de connexion (Espace membre du comité)</li>
                  <li><i class="bi bi-dot text-gold"></i> Informations transmises via les formulaires de contact</li>
                </ul>
              </div>
            </section>

            <!-- 2. Finalités du traitement -->
            <section class="mb-5">
              <h2 class="h5 fw-semibold mb-3 d-flex align-items-center text-gold">
                <i class="bi bi-gear me-2"></i> 2. Finalités du traitement et non-transmission
              </h2>
              <p class="text-light opacity-85 mb-3">Vos données sont utilisées exclusivement pour :</p>
              <ul class="text-light opacity-85 ps-3 d-flex flex-column gap-2 mb-3">
                <li>La gestion administrative et le suivi des membres du club.</li>
                <li>La communication interne et l'envoi d'informations relatives à la vie du club.</li>
                <li>Répondre aux demandes de contact envoyées via le formulaire.</li>
                <li>La sécurisation et la gestion de l’espace membre.</li>
              </ul>
              <div class="alert alert-success bg-success bg-opacity-25 text-success border-0 p-3 rounded-3 small">
                <i class="bi bi-shield-check-fill me-1"></i> <strong>Engagement de confidentialité :</strong> Vos données ne sont ni revendues, ni transmises à des tiers, ni utilisées à des fins commerciales.
              </div>
            </section>

            <!-- 3. Suivi technique -->
            <section class="mb-5">
              <h2 class="h5 fw-semibold mb-3 d-flex align-items-center text-gold">
                <i class="bi bi-graph-up me-2"></i> 3. Suivi technique et performances
              </h2>
              <p class="text-light opacity-85 mb-2">
                À des fins de suivi technique et d’optimisation du référencement naturel, le site utilise <strong>Google Search Console</strong>.
              </p>
              <p class="text-light opacity-60 small m-0">
                Cet outil permet de mesurer les performances globales du site sans installer de cookie publicitaire sur votre navigateur ni collecter de données personnelles de nos visiteurs.
              </p>
            </section>

            <!-- 4 & 5. Base légale et Conservation -->
            <div class="row g-4 mb-5">
              <div class="col-md-6">
                <h3 class="h6 fw-semibold mb-2 d-flex align-items-center text-gold">
                  <i class="bi bi-journal-check me-2"></i> 4. Base légale
                </h3>
                <p class="text-light opacity-85 small m-0">
                  Le traitement repose sur votre consentement (formulaire) et l’exécution des services liés à votre adhésion et à l'espace membre.
                </p>
              </div>
              <div class="col-md-6">
                <h3 class="h6 fw-semibold mb-2 d-flex align-items-center text-gold">
                  <i class="bi bi-clock-history me-2"></i> 5. Conservation
                </h3>
                <p class="text-light opacity-85 small m-0">
                  Les données sont conservées pendant la durée de votre adhésion et supprimées après une période d'inactivité prolongée.
                </p>
              </div>
            </div>

            <!-- 6. Vos droits -->
            <section class="mb-4">
              <h2 class="h5 fw-semibold mb-3 d-flex align-items-center text-gold">
                <i class="bi bi-person-check me-2"></i> 6. Vos droits (RGPD)
              </h2>
              <p class="text-light opacity-85 mb-3">
                Conformément au RGPD, vous disposez des droits d’accès, de rectification, d’effacement, d’opposition et de portabilité de vos données.
              </p>
              <div class="alert alert-info bg-info bg-opacity-25 text-info border-0 p-3 rounded-3 small">
                <i class="bi bi-info-circle-fill me-1"></i> Toute demande peut être adressée via notre formulaire de contact ou directement auprès du bureau de l'association.
              </div>
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
h3.text-gold,
.card h2,
.card h3 {
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
