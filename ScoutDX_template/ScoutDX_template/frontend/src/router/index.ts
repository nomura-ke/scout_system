import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Auth Views
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import RoleSelectionView from '@/views/auth/RoleSelectionView.vue'

// Scout Views
import ScoutListView from '@/views/scout/ScoutListView.vue'
import ScoutCreateView from '@/views/scout/ScoutCreateView.vue'
import ScoutDetailView from '@/views/scout/ScoutDetailView.vue'
import DraftDetailView from '@/views/scout/DraftDetailView.vue'

// Leader Views
import ApprovalListView from '@/views/leader/ApprovalListView.vue'
import ApprovalDetailView from '@/views/leader/ApprovalDetailView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresAuth: false }
  },
  {
    path: '/role-selection',
    name: 'RoleSelection',
    component: RoleSelectionView,
    meta: { requiresAuth: true }
  },
  {
    path: '/scout',
    name: 'ScoutList',
    component: ScoutListView,
    meta: { requiresAuth: true, roles: ['creator'] }
  },
  {
    path: '/scout/create',
    name: 'ScoutCreate',
    component: ScoutCreateView,
    meta: { requiresAuth: true, roles: ['creator'] }
  },
  {
    path: '/scout/:id',
    name: 'ScoutDetail',
    component: ScoutDetailView,
    meta: { requiresAuth: true, roles: ['creator'] }
  },
  {
    path: '/scout/:id/draft',
    name: 'DraftDetail',
    component: DraftDetailView,
    meta: { requiresAuth: true, roles: ['creator'] }
  },
  {
    path: '/leader/approvals',
    name: 'ApprovalList',
    component: ApprovalListView,
    meta: { requiresAuth: true, roles: ['leader'] }
  },
  {
    path: '/leader/approvals/:id',
    name: 'ApprovalDetail',
    component: ApprovalDetailView,
    meta: { requiresAuth: true, roles: ['leader'] }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// ナビゲーションガード
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.roles && !to.meta.roles.includes(authStore.currentRole)) {
    next('/role-selection')
  } else {
    next()
  }
})

export default router