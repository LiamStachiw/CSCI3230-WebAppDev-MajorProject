/* eslint-disable */
// @ts-ignore
import Vue from 'vue'
// @ts-ignore
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Scores from '../views/Scores.vue'
import Game from '../views/Game.vue'
/* eslint-enable */

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: true
  },
  {
    path: '/scores',
    name: 'Scores',
    component: Scores
  },
  {
    path: '/game',
    name: 'Game',
    component: Game,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
