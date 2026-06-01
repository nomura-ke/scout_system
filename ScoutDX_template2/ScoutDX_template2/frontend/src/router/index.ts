import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import RoleSelectView from '../views/RoleSelectView.vue'
import ScoutListView from '../views/ScoutListView.vue'
import ScoutCreateView from '../views/ScoutCreateView.vue'
import ScoutDetailView from '../views/ScoutDetailView.vue'
import LeaderListView from '../views/LeaderListView.vue'
import LeaderApprovalView from '../views/LeaderApprovalView.vue'
import AdminListView from '../views/AdminListView.vue'
import AdminApprovalView from '../views/AdminApprovalView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/register'
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/role-select',
      name: 'role-select',
      component: RoleSelectView
    },
    // 作成者用
    {
      path: '/scout-list',
      name: 'scout-list',
      component: ScoutListView
    },
    {
      path: '/scout-create',
      name: 'scout-create',
      component: ScoutCreateView
    },
    {
      path: '/scout-detail/:id',
      name: 'scout-detail',
      component: ScoutDetailView
    },
    {
      path: '/scout-edit/:id',
      name: 'scout-edit',
      component: ScoutDetailView
    },
    // リーダー用
    {
      path: '/leader-list',
      name: 'leader-list',
      component: LeaderListView
    },
    {
      path: '/leader-approval/:id',
      name: 'leader-approval',
      component: LeaderApprovalView
    },
    // 管理者用
    {
      path: '/admin-list',
      name: 'admin-list',
      component: AdminListView
    },
    {
      path: '/admin-approval/:id',
      name: 'admin-approval',
      component: AdminApprovalView
    },
  ]
})

export default router