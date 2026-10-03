import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import('@/pages/Create.vue'),
  },
  {
    path: '/editor/:id',
    name: 'Editor',
    component: () => import('@/pages/Editor.vue'),
  },
  {
    path: '/templates',
    name: 'Templates',
    component: () => import('@/pages/Templates.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/pages/Settings.vue'),
  },
  {
    path: '/template/text-emoji',
    name: 'TextEmojiTemplate',
    component: () => import('@/pages/TemplateEditor.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
