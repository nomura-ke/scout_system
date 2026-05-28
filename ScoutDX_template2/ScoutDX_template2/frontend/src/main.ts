import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

// ルーター設定（モック用）
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: () => import('./views/LoginView.vue')
    },
    {
      path: '/role-select',
      component: () => import('./views/RoleSelectView.vue')
    },
    {
      path: '/scout-list',
      component: () => import('./views/ScoutListView.vue')
    },
    {
      path: '/scout-create',
      component: () => import('./views/ScoutCreateView.vue')
    },
    {
      path: '/scout-detail/:id',
      component: () => import('./views/ScoutDetailView.vue')
    },
    {
      path: '/leader-list',
      component: () => import('./views/LeaderListView.vue')
    },
    {
      path: '/leader-approval/:id',
      component: () => import('./views/LeaderApprovalView.vue')
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')