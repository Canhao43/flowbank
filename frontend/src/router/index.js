import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, userType: 'PF' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/AdminDashboard.vue'),
    meta: { requiresAuth: true, userType: 'PJ' }
  },
  {
    path: '/admin/campanhas',
    name: 'AdminCampanhas',
    component: () => import('@/views/AdminCampanhasView.vue'),
    meta: { requiresAuth: true, userType: 'PJ' }
  },
  {
    path: '/extrato',
    name: 'Extrato',
    component: () => import('@/views/ExtratoView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pagamentos',
    name: 'Pagamentos',
    component: () => import('@/views/PagamentosView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/emprestimo',
    name: 'Emprestimo',
    component: () => import('@/views/EmprestimoView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/beneficios',
    name: 'Beneficios',
    component: () => import('@/views/BeneficiosView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de autenticação
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    // Redireciona baseado no tipo de usuário
    if (authStore.user?.type === 'PJ') {
      next('/admin')
    } else {
      next('/dashboard')
    }
  } else if (authStore.isAuthenticated && to.meta.userType) {
    // Verifica se o tipo de usuário corresponde à rota
    if (authStore.user?.type !== to.meta.userType) {
      if (authStore.user?.type === 'PJ') {
        next('/admin')
      } else {
        next('/dashboard')
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
