import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../App.vue') // Placeholder
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import('../App.vue') // Placeholder
  },
  {
    path: '/editor/:id',
    name: 'Editor',
    component: () => import('../App.vue') // Placeholder
  },
  {
    path: '/templates',
    name: 'Templates',
    component: () => import('../App.vue') // Placeholder
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../App.vue') // Placeholder
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
