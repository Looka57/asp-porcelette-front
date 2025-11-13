// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import FrontLayout from '@/FrontLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ===============================================
    // 🎯 NOUVELLE STRUCTURE POUR LE FRONT-OFFICE (LAYOUT)
    // ===============================================
    {
      path: '/',
      component: FrontLayout, // Ce composant gère l'en-tête, le pied de page, etc.
      children: [
        {
          path: '', // Chemin vide = / (Route "Home")
          name: 'home',
          component: () => import('@/views/HomeView.vue')
        },
        // ➡️ Ajoutez ici vos routes de discipline :
        {
          path: '',
          name: 'Acceuil',
          component: () => import('@/views/HomeView.vue')
        },
        {
          path: 'judo',
          name: 'judo',
          component: () => import('@/views/JudoView.vue')
        },
      ]
    },
    // ===============================================
    // ROUTES NON-LAYOUT (Login, Erreur)
    // ===============================================
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
    { path: '/403', name: 'forbidden', component: () => import('@/views/ForbiddenView.vue') }, // Page 403

    // ===============================================
    // ROUTES PROTÉGÉES (BACK-OFFICE)
    // ===============================================
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('@/views/AdminDashboard.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei']
      }
    },
    {
      path: '/admin/sensei',
      name: 'admin-sensei',
      component: () => import('@/views/SenseiView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei'] // 🎯 Admin ET Sensei
      }
    },
    {
      path: '/admin/licencies',
      name: 'admin-licencies',
      component: () => import('@/views/LicenciesView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei'] // 🎯 Admin ET Sensei
      }
    },
    {
      path: '/admin/cours',
      name: 'admin-cours',
      component: () => import('@/views/CoursView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei'] // 🎯 Admin ET Sensei
      }
    },
    {
      path: '/admin/events',
      name: 'admin-events',
      component: () => import('@/views/EventsView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei'] // 🎯 Seul l'Admin peut y accéder
      }
    },
    {
      path: '/admin/actualite',
      name: 'admin-actualite',
      component: () => import('@/views/ActualiteView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei'] // 🎯 Seul l'Admin peut y accéder
      }
    },
    {
      path: '/admin/discipline',
      name: 'admin-discipline',
      component: () => import('@/views/DisciplineView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei'] //
      }
    },
    {
      path: '/admin/tarifs',
      name: 'admin-tarifs',
      component: () => import('@/views/TarifsView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei'] //
      }
    },
    {
      path: '/admin/compta',
      name: 'admin-compta',
      component: () => import('@/views/ComptabiliteView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei'] //
      }
    },
    {
      path: '/admin/compta/transactions/:compteId',
      name: 'admin-transactions-gestion',
      component: () => import('@/views/GestionTransactionsPage.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei'] //
      }
    },
    {
      path: '/admin/profile',
      name: 'admin-profile',
      component: () => import('@/views/ProfilePageView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei'] //
      }
    },
    {
      path: '/admin/comptes/:id',
      name: 'admin-compte-details',
      component: () => import('@/views/CompteDetails.vue'),
      props: true,
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei']
      }
    },

    // ... autres routes (ex: /profile, /admin/users)
  ]
});

// Le GUARD de NAVIGATION
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Assurez-vous que l'état Pinia est hydraté (au cas où le profil n'a pas encore été chargé)
  if (authStore.isLoggedIn && !authStore.user) {
    await authStore.fetchProfile();
  }

  if (to.meta.requiresAuth) {
    if (!authStore.isLoggedIn) {
      // Non connecté : redirection vers login
      return next('/login');
    }

    const requiredRoles = to.meta.roles;
    const userRoles = authStore.user?.roles || [];

    // Vérifie si au moins UN des rôles requis est dans les rôles de l'utilisateur
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

    if (hasRequiredRole) {
      next(); // Autorisé
    } else {
      next('/403'); // Accès refusé (403 Forbidden)
    }
  } else {
    next(); // Route publique
  }
});

export default router;
