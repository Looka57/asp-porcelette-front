<script setup>
import { computed } from 'vue';

const props = defineProps({
  userList: {
    type: Array,
    default: () => []
  }
});

// ===============================
// 🔹 SAISON SPORTIVE
// ===============================

const getCurrentSeason = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0 = janvier, 8 = septembre

  // De septembre à décembre → saison year/year+1
  if (month >= 8) {
    return {
      start: new Date(year, 8, 1), // 1er septembre
      end: new Date(year + 1, 5, 30) // 30 juin
    };
  }

  // De janvier à juin → saison year-1/year
  return {
    start: new Date(year - 1, 8, 1),
    end: new Date(year, 5, 30)
  };
};

const currentSeason = computed(() => getCurrentSeason());

// ===============================
// 🔹 UTILITAIRES
// ===============================

const isDateInCurrentSeason = (dateString) => {
  if (!dateString) {
    return false;
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const start = new Date(currentSeason.value.start);
  const end = new Date(currentSeason.value.end);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return date >= start && date <= end;
};

const isCertificatExpire = (dateExpiration) => {
  if (!dateExpiration) {
    return false;
  }

  const aujourdHui = new Date();
  aujourdHui.setHours(0, 0, 0, 0);

  const expiration = new Date(dateExpiration);
  expiration.setHours(0, 0, 0, 0);

  return expiration < aujourdHui;
};

// ===============================
// 🔹 STATISTIQUES
// ===============================
// Total et certificats portent sur TOUS les adhérents.
// Seuls les "renouvellements" sont filtrés sur la saison en cours.

const totalAdherents = computed(() => {
  return props.userList.length;
});

const certificatsValides = computed(() => {
  return props.userList.filter(user => {
    if (!user.dateExpirationCertificatMedical) {
      return false;
    }

    return !isCertificatExpire(user.dateExpirationCertificatMedical);
  }).length;
});

const certificatsExpires = computed(() => {
  return props.userList.filter(user => {
    if (!user.dateExpirationCertificatMedical) {
      return false;
    }

    return isCertificatExpire(user.dateExpirationCertificatMedical);
  }).length;
});

// ===============================
// 🔹 RENOUVELLEMENTS (uniquement ceux déjà faits pour la saison en cours)
// ===============================

const renouvellements = computed(() => {
  return props.userList.filter(user => {
    return isDateInCurrentSeason(user.dateRenouvellement);
  }).length;
});
</script>

<template>
  <div class="statistics-grid">
    <!-- ===============================
         🔹 TOTAL ADHÉRENTS
    ================================ -->
    <div class="stat-card stat-members">
      <div class="stat-icon">
        <i class="pi pi-users"></i>
      </div>
      <div class="stat-content">
        <span class="stat-value">
          {{ totalAdherents }}
        </span>
        <span class="stat-label">
          Total adhérents
        </span>
      </div>
    </div>

    <!-- ===============================
         🔹 CERTIFICATS VALIDES
    ================================ -->
    <div class="stat-card stat-valid">
      <div class="stat-icon">
        <i class="pi pi-check-circle"></i>
      </div>
      <div class="stat-content">
        <span class="stat-value">
          {{ certificatsValides }}
        </span>
        <span class="stat-label">
          Certificats valides
        </span>
      </div>
    </div>

    <!-- ===============================
         🔹 CERTIFICATS EXPIRÉS
    ================================ -->
    <div
      :class="[
        'stat-card',
        'stat-expired',
        {
          'has-expired': certificatsExpires > 0
        }
      ]"
    >
      <div class="stat-icon">
        <i class="pi pi-exclamation-triangle"></i>
      </div>
      <div class="stat-content">
        <span class="stat-value">
          {{ certificatsExpires }}
        </span>
        <span class="stat-label">
          Certificats expirés
        </span>
      </div>
    </div>

    <!-- ===============================
         🔹 RENOUVELLEMENTS
    ================================ -->
    <div class="stat-card stat-renew">
      <div class="stat-icon">
        <i class="pi pi-history"></i>
      </div>
      <div class="stat-content">
        <span class="stat-value">
          {{ renouvellements }}
        </span>
        <span class="stat-label">
          Renouvellements
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===============================
   🔹 CONTENEUR
================================ */
.statistics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  width: 100%;
  margin-bottom: 1.5rem;
}

/* ===============================
   🔹 CARTE
================================ */
.stat-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 105px;
  padding: 1.15rem;
  background: linear-gradient(
    145deg,
    rgba(43, 48, 54, 0.95),
    rgba(33, 37, 41, 0.95)
  );
  border: 1px solid #3c434a;
  border-radius: 12px;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.stat-card::after {
  content: '';
  position: absolute;
  right: -35px;
  bottom: -35px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 193, 7, 0.04);
  pointer-events: none;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: #495057;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
}

/* ===============================
   🔹 ICÔNE
================================ */
.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 10px;
  font-size: 1.25rem;
}

/* ===============================
   🔹 CONTENU
================================ */
.stat-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.stat-value {
  font-size: 1.8rem;
  line-height: 1.1;
  font-weight: 700;
  color: #fff;
}

.stat-label {
  margin-top: 0.35rem;
  color: #8f969d;
  font-size: 0.8rem;
  font-weight: 500;
}

/* ===============================
   🔹 ADHÉRENTS
================================ */
.stat-members .stat-icon {
  background: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

/* ===============================
   🔹 CERTIFICATS VALIDES
================================ */
.stat-valid .stat-icon {
  background: rgba(25, 135, 84, 0.12);
  color: #54d69a;
}

/* ===============================
   🔹 CERTIFICATS EXPIRÉS
================================ */
.stat-expired .stat-icon {
  background: rgba(108, 117, 125, 0.12);
  color: #8f969d;
}

.stat-expired.has-expired {
  border-color: rgba(220, 53, 69, 0.35);
}

.stat-expired.has-expired .stat-icon {
  background: rgba(220, 53, 69, 0.12);
  color: #ff6b78;
}

.stat-expired.has-expired .stat-value {
  color: #ff6b78;
}

/* ===============================
   🔹 RENOUVELLEMENTS
================================ */
.stat-renew .stat-icon {
  background: rgba(13, 202, 240, 0.1);
  color: #0dcaf0;
}

/* ===============================
   🔹 RESPONSIVE
================================ */
@media (max-width: 1100px) {
  .statistics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 575.98px) {
  .statistics-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .stat-card {
    min-height: 90px;
    padding: 1rem;
  }

  .stat-icon {
    width: 42px;
    height: 42px;
    font-size: 1.1rem;
  }

  .stat-value {
    font-size: 1.55rem;
  }
}
</style>
