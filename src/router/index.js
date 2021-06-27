import Vue from 'vue'
import VueRouter from 'vue-router'

import goTo from 'vuetify/lib/services/goto'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/project',
    name: 'project',
    component: () => import('../views/ProjectList.vue')
  },
  {
    path: '/project/:project',
    name: 'project_slug',
    component: () => import('../views/Project.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/Contact.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,

  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo = 0
    let options = {
      duration: '0',
    }

    if (to.hash) {
      scrollTo = to.hash
    } else if (savedPosition) {
      scrollTo = savedPosition.y
    }

    return goTo(scrollTo, options)
  },

})

export default router
