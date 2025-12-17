

<template>
  <div class="container mt-8 py-5 bg-dark text-light min-vh-100">
    <div class="mb-4">
  <router-link to="/" class="btn btn-outline-warning btn-sm d-inline-flex align-items-center gap-2">
    <i class="bi bi-arrow-left"></i> 🏠 Retour à l'accueil
  </router-link>
</div>
    <h1 class="text-center mb-5 text-warning">🧾 Mentions Légales</h1>

    <div class="row justify-content-center">
      <div class="col-lg-10">

        <p class="lead text-center mb-5">
          Conformément aux dispositions de la loi pour la confiance dans l'économie numérique,
          voici les informations relatives à l'éditeur et à l'hébergeur du site
          <strong>AS Porcelette Arts Martiaux</strong>.
        </p>

        <hr class="my-4 border-secondary">

        <h2 class="mt-4 text-warning h4">1. Éditeur du site</h2>
        <div class="ps-3 border-start border-warning border-4 mb-4">
          <p class="mb-1"><strong>Nom de l’association :</strong> AS Porcelette Arts Martiaux</p>
          <p class="mb-1"><strong>Statut :</strong> Association loi 1901</p>
          <p class="mb-1"><strong>Siège social :</strong> Porcelette, France</p>
          <p class="mb-1"><strong>Responsable de la publication :</strong> Amandine Napolitano</p>
          <p class="mb-1"><strong>Contact :</strong> Via le formulaire de contact du site</p>
        </div>

        <h2 class="mt-4 text-warning h4">2. Hébergement</h2>
        <div class="ps-3 border-start border-warning border-4 mb-4">
          <p class="mb-1"><strong>Hébergeur :</strong> OVHcloud</p>
          <p class="mb-1"><strong>Adresse :</strong> 2 rue Kellermann – 59100 Roubaix – France</p>
          <p class="mb-1"><strong>Site web :</strong> <a href="https://www.ovhcloud.com" target="_blank" class="text-info text-decoration-none">ovhcloud.com</a></p>
        </div>

        <h2 class="mt-4 text-warning h4">3. Propriété intellectuelle</h2>
        <p>
          L’ensemble des contenus présents sur ce site (textes, images, logos, icônes) est la propriété exclusive
          de l’association <strong>AS Porcelette Arts Martiaux</strong>, sauf mention contraire explicite.
        </p>
        <div class="alert alert-danger bg-transparent border-danger text-danger mt-3">
          <strong>Interdiction :</strong> Toute reproduction, représentation, modification ou adaptation totale ou partielle
          des éléments du site est interdite sans autorisation écrite préalable.
        </div>

        <h2 class="mt-4 text-warning h4">4. Responsabilité</h2>
        <p>
          L’association s'efforce de fournir des informations précises, mais ne saurait être tenue responsable :
        </p>
        <ul>
          <li>Des erreurs ou omissions dans les informations diffusées.</li>
          <li>Des éventuels dysfonctionnements techniques du site.</li>
          <li>Des dommages directs ou indirects résultant de l'accès au site.</li>
        </ul>

      </div>
    </div>
  </div>
</template>

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
  padding: 1.5rem;
  border-radius: 0 10px 10px 0;
}

ul li {
  margin-bottom: 8px;
}
</style>
