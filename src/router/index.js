// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import FrontLayout from '@/FrontLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 };
  },

  routes: [
    // ===============================================
    // 🎯 FRONT-OFFICE (LAYOUT PUBLIC)
    // ===============================================
    {
      path: '/',
      component: FrontLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue')
        },
        {
          path: 'judo',
          name: 'judo',
          component: () => import('@/views/JudoView.vue')
        },
        {
          path: 'aikido',
          name: 'aikido',
          component: () => import('@/views/AikidoView.vue')
        },
        {
          path: 'jujitsu',
          name: 'jujitsu',
          component: () => import('@/views/JujitsuView.vue')
        },
        {
          path: 'judo-detente',
          name: 'judo-detente',
          component: () => import('@/views/JudoDetenteView.vue')
        },
        {
          path: 'equipe',
          name: 'sensei',
          component: () => import('@/views/SenseiSiteView.vue')
        },
        {
          path: '/equipeDetailView/:id',
          name: 'senseiDetailView',
          component: () => import('@/views/SenseiDetailView.vue'),
          props: true
        },
        {
          path: 'actualites',
          name: 'actualites',
          component: () => import('@/views/ActualiteSiteView.vue')
        },
        {
          path: '/actualite/:id',
          name: 'ActualiteDetail',
          component: () => import('@/views/ActualiteDetail.vue'),
          props: true
        },
        {
          path: 'evenements',
          name: 'evenements',
          component: () => import('@/views/EvenementsView.vue')
        },
        {
          path: '/evenement/:id',
          name: 'EvenementDetail',
          component: () => import('@/views/EvenementDetail.vue'),
          props: true
        },
        {
          path: 'tarifs',
          name: 'tarifs',
          component: () => import('@/views/TarifSiteView.vue'),
          props: true
        }
      ]
    },

    // ===============================================
    // 🔐 LOGIN (PUBLIC)
    // ===============================================
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },

    // ===============================================
    // ❌ PAGE INTERDITE
    // ===============================================
    {
      path: '/403',
      name: 'forbidden',
      component: () => import('@/views/ForbiddenView.vue')
    },

    // ===============================================
    // 🔒 ROUTES PROTÉGÉES (BACK-OFFICE)
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
        roles: ['Admin', 'Sensei']
      }
    },
    {
      path: '/admin/licencies',
      name: 'admin-licencies',
      component: () => import('@/views/LicenciesView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei']
      }
    },
    {
      path: '/admin/cours',
      name: 'admin-cours',
      component: () => import('@/views/CoursView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei']
      }
    },
    {
      path: '/admin/events',
      name: 'admin-events',
      component: () => import('@/views/EventsView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei']
      }
    },
    {
      path: '/admin/actualite',
      name: 'admin-actualite',
      component: () => import('@/views/ActualiteView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei']
      }
    },
    {
      path: '/admin/discipline',
      name: 'admin-discipline',
      component: () => import('@/views/DisciplineView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei']
      }
    },
    {
      path: '/admin/tarifs',
      name: 'admin-tarifs',
      component: () => import('@/views/TarifsView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei']
      }
    },
    {
      path: '/admin/compta',
      name: 'admin-compta',
      component: () => import('@/views/ComptabiliteView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei']
      }
    },
    {
      path: '/admin/compta/transactions/:compteId',
      name: 'admin-transactions-gestion',
      component: () => import('@/views/GestionTransactionsPage.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei']
      }
    },
    {
      path: '/admin/profile',
      name: 'admin-profile',
      component: () => import('@/views/ProfilePageView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['Admin', 'Sensei']
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

    // ===============================================
    // 🚫 BLOQUER TOUTES LES ROUTES /admin/* NON DÉFINIES
    // ===============================================
    {
      path: '/admin/:pathMatch(.*)*',
      redirect: '/403'
    }
  ]
});

// ===============================================
// 🛡️ GARDE DE NAVIGATION RENFORCÉE
// ===============================================
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // 🔍 Si on a un token mais pas de profil utilisateur chargé
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchProfile();
    } catch (error) {
      // ❌ Si la récupération du profil échoue (token invalide/expiré)
      console.error('Token invalide ou expiré:', error);
      authStore.logout();

      // Si on essayait d'accéder à une route protégée, on redirige vers login
      if (to.meta.requiresAuth) {
        return next('/login');
      }
    }
  }

  // 🔒 Vérification pour les routes protégées
  if (to.meta.requiresAuth) {
    // Pas connecté du tout
    if (!authStore.isLoggedIn) {
      return next('/login');
    }

    // Vérification des rôles
    const requiredRoles = to.meta.roles || [];
    const userRoles = authStore.userRoles;
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      return next('/403');
    }
  }

  // ✅ Tout est OK, on laisse passer
  next();
});

export default router;
