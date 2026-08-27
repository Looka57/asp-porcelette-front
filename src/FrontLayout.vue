<script setup>
// ===============================
// 🔹 IMPORTS
// ===============================
import BarnavHome from './components/Barnav/BarnavHome.vue'
import { RouterView } from 'vue-router'

// ===============================
// 🔹 ANNÉE COURANTE
// ===============================
const dateYear = new Date().getFullYear()
</script>

<!-- ===============================
     🔹 BODY
     =============================== -->
<template>
  <div class="container-fluid p-0 bg-dark text-light min-vh-100 d-flex flex-column">

    <!-- Barre de navigation -->
    <BarnavHome />

    <!-- Contenu principal -->
    <main class="flex-grow-1 main-content-wrapper">
      <RouterView />
    </main>

    <!-- ===============================
         🔹 FOOTER
         =============================== -->
    <footer class="site-footer mt-auto">
      <div class="container py-4">

        <div class="row gy-3 align-items-center">

          <!-- Identité du club & Logo -->
          <div class="col-lg-5 text-center text-lg-start">
            <div class="footer-brand-wrapper d-flex align-items-center justify-content-center justify-content-lg-start gap-3 mb-2">

              <img src="../src/assets/img/logo2.png" alt="Logo AS Porcelette" class="footer-logo" />

              <div class="footer-brand">
                <span class="footer-brand-main">AS PORCELETTE</span>
                <span class="footer-brand-sub">ARTS MARTIAUX</span>
              </div>

            </div>
            <p class="footer-description mb-0 text-center text-lg-start">
              Arts martiaux, discipline et convivialité à Porcelette.
            </p>
          </div>

          <!-- Contact -->
          <div class="col-lg-3 text-center text-lg-start">
            <h2 class="footer-title mb-2">Contact</h2>
            <a href="mailto:asporcelette@gmail.com" class="footer-contact" aria-label="Envoyer un e-mail au club">
              <span class="footer-icon">
               <i class="pi pi-envelope"></i>
              </span>
              <span>asporcelette@gmail.com</span>
            </a>
          </div>

          <!-- Réseaux sociaux -->
          <div class="col-lg-4 text-center text-lg-end">
            <h2 class="footer-title mb-2">Suivez-nous</h2>
            <div class="social-links justify-content-center justify-content-lg-end">
              <!-- Facebook -->
              <a href="https://www.facebook.com/groups/387110822915291/?ref=share" target="_blank" rel="noopener noreferrer" aria-label="Rejoignez notre groupe Facebook" class="social-link-img" title="Facebook">
                <img width="42" height="42" src="https://img.icons8.com/bubbles/100/facebook-new.png" alt="Logo Facebook" loading="lazy" />
              </a>
              <!-- Instagram -->
              <a href="https://www.instagram.com/TON_COMPTE" target="_blank" rel="noopener noreferrer" aria-label="Suivez-nous sur Instagram" class="social-link-img" title="Instagram">
                <img width="42" height="42" src="https://img.icons8.com/bubbles/100/instagram-new--v2.png" alt="Logo Instagram" loading="lazy" />
              </a>
            </div>
          </div>

        </div>

        <!-- Séparateur -->
        <div class="footer-divider"></div>

        <!-- Navigation Footer -->
        <nav class="footer-legal" aria-label="Navigation du pied de page">
          <router-link to="/" class="footer-legal-link">Accueil</router-link>
          <span class="footer-separator">•</span>
          <router-link to="/mentions-legales" class="footer-legal-link">Mentions légales</router-link>
          <span class="footer-separator">•</span>
          <router-link to="/politique-confidentialite" class="footer-legal-link">Politique de confidentialité</router-link>
          <span class="footer-separator">•</span>
          <router-link to="/politique-cookies" class="footer-legal-link">Politique de cookies</router-link>
        </nav>

        <!-- Copyright & Admin -->
        <div class="footer-bottom">
          <p class="footer-copyright mb-0">
            © {{ dateYear }} AS Porcelette Arts Martiaux <span class="d-none d-sm-inline">—</span> Tous droits réservés.
          </p>
          <router-link to="/login" class="admin-link">
            <i class="bi bi-shield-lock-fill"></i> Espace Comité
          </router-link>
        </div>

      </div>
    </footer>

  </div>
</template>

<style scoped>
.main-content-wrapper {
  padding-top: 85px;
}

.text-info-custom {
  color: #d03131 !important;
}

/* =========================================
   🔹 FOOTER STYLES
   ========================================= */
.site-footer {
  position: relative;
  background: linear-gradient(180deg, #171a1f 0%, #111318 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: auto;
}

.site-footer::before {
  content: "";
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 2px;
  background: #d03131;
  opacity: 0.7;
  border-radius: 50%;
}

/* 💡 Style pour le logo du club dans le footer */
.footer-logo {
  width: 75px;
  height: 75px;
  object-fit: contain;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  padding: 3px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.footer-brand-main {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #ffffff;
}

.footer-brand-sub {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.3em;
  color: #d03131;
}

.footer-description {
  max-width: 400px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.8rem;
  line-height: 1.5;
}

.footer-title {
  position: relative;
  display: inline-block;
  margin-bottom: 0.75rem;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

.footer-title::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 20px;
  height: 2px;
  background: #d03131;
  border-radius: 2px;
}

.footer-contact {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.85rem;
  text-decoration: none;
  transition: color 0.25s ease, transform 0.25s ease;
}

.footer-contact:hover {
  color: #d03131;
  transform: translateX(3px);
}

.footer-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(49, 179, 208, 0.08);
  border: 1px solid rgba(49, 179, 208, 0.2);
  color: #d03131;
  font-size: 0.75rem;
}

.social-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.social-link-img {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
}

.social-link-img:hover {
  transform: translateY(-3px);
}

.footer-divider {
  height: 1px;
  margin: 1.25rem 0 1rem;
  background: rgba(255, 255, 255, 0.07);
}

.footer-legal {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.footer-legal-link {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
  text-decoration: none;
  transition: color 0.25s ease;
}

.footer-legal-link:hover {
  color: #d03131;
}

.footer-separator {
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.65rem;
}

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.footer-copyright {
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.7rem;
}

.admin-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.7rem;
  text-decoration: none;
  transition: color 0.25s ease;
}

.admin-link:hover {
  color: #31b3d0;
}

@media (max-width: 991.98px) {
  .footer-description {
    margin-left: auto;
    margin-right: auto;
  }
  .footer-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
}

@media (max-width: 575.98px) {
  .site-footer {
    text-align: center;
  }
  .footer-bottom {
    flex-direction: column;
    justify-content: center;
  }
}
</style>
