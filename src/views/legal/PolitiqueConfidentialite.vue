<template>
  <div class="container mt-8 py-5 bg-dark text-light min-vh-100">
    <div class="mb-4">
  <router-link to="/" class="btn btn-outline-warning btn-sm d-inline-flex align-items-center gap-2">
    <i class="bi bi-arrow-left"></i> 🏠 Retour à l'accueil
  </router-link>
</div>
    <h1 class="text-center mb-5 text-warning">🔐 Politique de confidentialité (RGPD)</h1>

    <div class="row justify-content-center">
      <div class="col-lg-10">

        <p class="lead">
          Chez AS Porcelette Arts Martiaux, la protection de vos données personnelles est une priorité.
          Nous nous engageons à respecter votre vie privée et à garantir la sécurité de vos informations
          conformément au Règlement Général sur la Protection des Données (RGPD).
        </p>

        <hr class="my-4 border-secondary">

        <h2 class="mt-4 text-warning h4">1. Collecte des données</h2>
        <p>Nous collectons uniquement les informations nécessaires à la gestion de notre association et à la communication avec nos membres :</p>
        <ul class="list-group list-group-flush bg-transparent mb-4">
          <li class="list-group-item bg-transparent text-light border-secondary">🔹 Nom et prénom</li>
          <li class="list-group-item bg-transparent text-light border-secondary">🔹 Adresse e-mail</li>
          <li class="list-group-item bg-transparent text-light border-secondary">🔹 Données de connexion (Espace membre)</li>
          <li class="list-group-item bg-transparent text-light border-secondary">🔹 Informations transmises via les formulaires de contact</li>
        </ul>

        <h2 class="mt-4 text-warning h4">2. Finalités du traitement et non-transmission</h2>
        <p>Vos données sont utilisées exclusivement pour :</p>
        <ul>
          <li>La gestion administrative et le suivi des membres du club.</li>
          <li>La communication interne et l'envoi d'informations relatives à la vie du club.</li>
          <li>Répondre aux demandes de contact envoyées via le formulaire.</li>
          <li>La sécurisation et la gestion de l’espace membre.</li>
        </ul>

        <div class="alert alert-success bg-transparent border-success text-success mt-3">
          <strong>Engagement de confidentialité :</strong> Vos données ne sont ni revendues, ni transmises à des tiers, ni utilisées à des fins commerciales.
        </div>

        <h2 class="mt-4 text-warning h4">3. Suivi technique et performances</h2>
        <p>
          À des fins de suivi technique et d’optimisation du référencement naturel, le site utilise
          <strong>Google Search Console</strong>.
        </p>
        <p class="small text-secondary">
          Cet outil permet de mesurer les performances globales du site sans installer de cookie sur votre navigateur ni collecter de données personnelles de nos visiteurs.
        </p>

        <div class="row mt-4">
          <div class="col-md-6">
            <h2 class="text-warning h4">4. Base légale</h2>
            <p>Le traitement repose sur votre consentement (formulaire) et l’exécution des services liés à votre adhésion et à l'espace membre.</p>
          </div>
          <div class="col-md-6">
            <h2 class="text-warning h4">5. Conservation</h2>
            <p>Les données sont conservées pendant la durée de votre adhésion et supprimées après une période d'inactivité prolongée.</p>
          </div>
        </div>

        <h2 class="mt-4 text-warning h4">6. Vos droits (RGPD)</h2>
        <p>Conformément au RGPD, vous disposez des droits d’accès, de rectification, d’effacement, d’opposition et de portabilité de vos données.</p>

        <div class="alert alert-info bg-transparent border-info text-info mt-3">
          Toute demande peut être adressée via notre formulaire de contact ou directement auprès du bureau de l'association.
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===============================
   🔹 STYLES LOCAUX
   =============================== */
h2 {
  border-left: 4px solid #ffc107;
  padding-left: 15px;
  margin-bottom: 20px;
}

ul li {
  margin-bottom: 8px;
}
</style>
