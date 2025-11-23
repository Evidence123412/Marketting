import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import LoginView from '../views/LoginView.vue'
import BuyerGenerator from '../views/BuyerGenerator.vue'
import Production from '../views/Production.vue'
import Scheduling from '../views/Scheduling.vue'
import Interactions from '../views/Interactions.vue'
import CRM from '../views/CRM.vue'
import Reports from '../views/Reports.vue'
import Settings from '../views/Settings.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/buyer-generator',
    name: 'buyer-generator',
    component: BuyerGenerator,
    meta: { requiresAuth: true }
  },
  {
    path: '/production',
    name: 'production',
    component: Production,
    meta: { requiresAuth: true }
  },
  {
    path: '/scheduling',
    name: 'scheduling',
    component: Scheduling,
    meta: { requiresAuth: true }
  },
  {
    path: '/interactions',
    name: 'interactions',
    component: Interactions,
    meta: { requiresAuth: true }
  },
  {
    path: '/crm',
    name: 'crm',
    component: CRM,
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'reports',
    component: Reports,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('rememberedUser')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
