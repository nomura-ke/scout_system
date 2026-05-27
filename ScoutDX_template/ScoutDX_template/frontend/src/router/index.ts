import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ScoutPage from '../components/ScoutPage.vue'
import ScoutMessageList from '../views/scoutListView.vue'
import RoleToggleView from '../views/roleTuggleView.vue'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: ScoutPage,
  },
  {
    path: '/scout-messages',
    name: 'scout-messages',
    component: ScoutMessageList,
  },
  {
    path: '/role-select',
    name: 'RoleSelect',
    component: RoleToggleView,
  },
  {
    path: '/author/dashboard',
    name: 'AuthorDashboard',
    component: ScoutMessageList,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
