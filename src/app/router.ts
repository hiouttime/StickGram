import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/features/projects/pages/Home.vue'),
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import('@/features/projects/pages/Create.vue'),
  },
  {
    path: '/editor/:id',
    name: 'Editor',
    component: () => import('@/features/projects/pages/Editor.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/features/settings/SettingsPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
