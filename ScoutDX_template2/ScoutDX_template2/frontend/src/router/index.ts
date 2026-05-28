import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import LeaderApprovalView from '../views/LeaderApprovalView.vue'
import LeaderListView from '../views/LeaderListView.vue'
import LoginView from '../views/LoginView.vue'
import RoleSelectView from '../views/RoleSelectView.vue'
import ScoutCreateView from '../views/ScoutCreateView.vue'
import ScoutDetailView from '../views/ScoutDetailView.vue'
import ScoutListView from '../views/ScoutListView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/role-select',
    name: 'role-select',
    component: RoleSelectView,
  },
  {
    path: '/scouts',
    name: 'scout-list',
    component: ScoutListView,
  },
  {
    path: '/scouts/create',
    name: 'scout-create',
    component: ScoutCreateView,
  },
  {
    path: '/scouts/:id',
    name: 'scout-detail',
    component: ScoutDetailView,
    props: true,
  },
  {
    path: '/leaders',
    name: 'leader-list',
    component: LeaderListView,
  },
  {
    path: '/leaders/:id/approval',
    name: 'leader-approval',
    component: LeaderApprovalView,
    props: true,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
