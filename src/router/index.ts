import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'player',
    //   component: () => import('../views/PlayerView.vue')
    // },
    {
      path: '/',
      name: 'search',
      component: () => import('@/views/SearchStationView.vue')
    }
  ]
})

export default router
