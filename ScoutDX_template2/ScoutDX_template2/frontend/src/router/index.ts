import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RoleSelectView from '../views/RoleSelectView.vue'
import ScoutListView from '../views/ScoutListView.vue'
import ScoutCreateView from '../views/ScoutCreateView.vue'
import ScoutDetailView from '../views/ScoutDetailView.vue'
import LeaderApprovalView from '../views/LeaderApprovalView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/role-select'  // 開発中はロール選択を最初に表示
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
      path: '/scouts',
      name: 'scouts',
      component: ScoutListView
    },
    {
      path: '/scouts/create',
      name: 'scout-create',
      component: ScoutCreateView
    },
    {
      path: '/scouts/:id',
      name: 'scout-detail',
      component: ScoutDetailView
    },
    {
      path: '/scouts/:id/edit',
      name: 'scout-edit',
      component: ScoutDetailView
    },
    // リーダー用
    {
      path: '/leader/approvals',
      name: 'leader-approvals',
      component: LeaderApprovalView
    },
    // 管理者用（後で作成）
  ]
})

export default router