<script setup>

import { computed } from 'vue';

const props = defineProps({
  userList: {
    type: Array,
    default: () => []
  },

  disciplineList: {
    type: Array,
    default: () => []
  }
});


// ===============================
// 🔹 STATISTIQUES
// ===============================

const totalEncadrants = computed(() => {
  return props.userList.length;
});


const totalAdministrateurs = computed(() => {
  return props.userList.filter(user =>
    user.roles?.includes('Admin')
  ).length;
});


const totalSenseis = computed(() => {
  return props.userList.filter(user =>
    user.roles?.includes('Sensei')
  ).length;
});


const disciplinesEncadrees = computed(() => {

  const disciplineIds = new Set(
    props.userList
      .filter(user => user.roles?.includes('Sensei'))
      .map(user => user.disciplineId)
      .filter(id => id !== null && id !== undefined)
  );

  return disciplineIds.size;
});

</script>


<template>

  <div class="statistics-grid">

    <!-- ===============================
         🔹 TOTAL ENCADRANTS
    ================================ -->

    <div class="stat-card stat-total">

      <div class="stat-icon">

        <i class="pi pi-users"></i>

      </div>

      <div class="stat-content">

        <span class="stat-value">
          {{ totalEncadrants }}
        </span>

        <span class="stat-label">
          Total encadrants
        </span>

      </div>

    </div>


    <!-- ===============================
         🔹 SENSEIS
    ================================ -->

    <div class="stat-card stat-sensei">

      <div class="stat-icon">

        <i class="pi pi-user"></i>

      </div>

      <div class="stat-content">

        <span class="stat-value">
          {{ totalSenseis }}
        </span>

        <span class="stat-label">
          Senseis
        </span>

      </div>

    </div>


    <!-- ===============================
         🔹 ADMINISTRATEURS
    ================================ -->

    <div class="stat-card stat-admin">

      <div class="stat-icon">

        <i class="pi pi-shield"></i>

      </div>

      <div class="stat-content">

        <span class="stat-value">
          {{ totalAdministrateurs }}
        </span>

        <span class="stat-label">
          Administrateurs
        </span>

      </div>

    </div>


    <!-- ===============================
         🔹 DISCIPLINES
    ================================ -->

    <div class="stat-card stat-discipline">

      <div class="stat-icon">

        <i class="pi pi-sitemap"></i>

      </div>

      <div class="stat-content">

        <span class="stat-value">
          {{ disciplinesEncadrees }}
        </span>

        <span class="stat-label">
          Disciplines encadrées
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

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

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

  background:
    linear-gradient(
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

  background:
    rgba(255, 193, 7, 0.04);

  pointer-events: none;

}


.stat-card:hover {

  transform: translateY(-2px);

  border-color: #495057;

  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.25);

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
   🔹 TOTAL
================================ */

.stat-total .stat-icon {

  background:
    rgba(255, 193, 7, 0.1);

  color: #ffc107;

}


/* ===============================
   🔹 SENSEI
================================ */

.stat-sensei .stat-icon {

  background:
    rgba(13, 202, 240, 0.1);

  color: #0dcaf0;

}


/* ===============================
   🔹 ADMIN
================================ */

.stat-admin .stat-icon {

  background:
    rgba(220, 53, 69, 0.1);

  color: #ff6b78;

}


/* ===============================
   🔹 DISCIPLINES
================================ */

.stat-discipline .stat-icon {

  background:
    rgba(25, 135, 84, 0.12);

  color: #54d69a;

}


/* ===============================
   🔹 RESPONSIVE
================================ */

@media (max-width: 1100px) {

  .statistics-grid {

    grid-template-columns:
      repeat(2, minmax(0, 1fr));

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
