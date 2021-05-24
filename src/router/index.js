import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('../views/ProjectList.vue')
  },
  {
    path: '/projects/:project',
    name: 'project',
    component: () => import('../views/Project.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
