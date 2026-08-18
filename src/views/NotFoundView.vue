<template>
  <div class="not-found">
    <div class="not-found-content">

      <div class="dojo-mark">
        <span>AS</span>
      </div>

      <p class="error-label">ERREUR 404</p>

      <h1>404</h1>

      <h2>Vous avez quitté le tatami.</h2>

      <p class="description">
        La page que vous recherchez n'existe pas ou n'est plus disponible.
        Pas d'inquiétude, le chemin vers le dojo est juste ici.
      </p>

      <RouterLink to="/" class="btn-home">
        <i class="pi pi-home"></i>
        Retour à l'accueil
      </RouterLink>

    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background:
    radial-gradient(circle at center, rgba(212, 175, 55, 0.08), transparent 45%),
    #111111;
  color: white;
  text-align: center;
}

.not-found-content {
  width: 100%;
  max-width: 650px;
}

/* Logo / symbole */
.dojo-mark {
  width: 80px;
  height: 80px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #6C63FF ;
  border-radius: 50%;
  color: #6C63FF ;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 2px;
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.15);
}

.error-label {
  margin: 0 0 10px;
  color: #3754d4;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
}

/* 404 */
h1 {
  margin: 0;

  font-size: clamp(7rem, 20vw, 12rem);
  line-height: 0.9;
  font-weight: 900;

  color: transparent;
  -webkit-text-stroke: 2px #6C63FF ;
  text-shadow: 0 0 40px rgba(55, 118, 212, 0.15);
}

/* Titre */
h2 {
  margin: 30px 0 15px;

  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 700;
}

/* Texte */
.description {
  max-width: 520px;
  margin: 0 auto;

  color: #a3a3a3;
  font-size: 1rem;
  line-height: 1.7;
}

/* Bouton */
.btn-home {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 35px;
  padding: 13px 25px;
  background: #6C63FF ;
  color: #111;
  border: 2px solid #6C63FF ;
  border-radius: 6px;

  font-weight: 700;
  text-decoration: none;

  transition:
    background-color 0.25s ease,
    color 0.25s ease,
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.btn-home:hover {
  background: transparent;
  color: #6C63FF ;

  transform: translateY(-2px);

  box-shadow: 0 8px 25px rgba(55, 118, 212, 0.2);
}

/* Mobile */
@media (max-width: 600px) {
  .not-found {
    padding: 30px 20px;
  }

  .dojo-mark {
    width: 65px;
    height: 65px;
    margin-bottom: 25px;
    font-size: 20px;
  }

  h2 {
    margin-top: 25px;
  }

  .description {
    font-size: 0.95rem;
  }
}
</style>
