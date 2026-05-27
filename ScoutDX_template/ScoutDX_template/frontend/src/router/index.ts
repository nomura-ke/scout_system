import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ScoutPage from '../components/ScoutPage.vue'
import ScoutMessageList from '../views/scoutListView.vue'
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
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
