import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/play/:id',
      name: 'play',
      component: () => import('../views/PlayView.vue'),
      props: route => ({ id: route.params.id })
    },
  ]
})

export default router
