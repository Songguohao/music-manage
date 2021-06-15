import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Info from '@/pages/Info'
import Home from '@/components/Home'
import Consumer from '@/pages/ConsumerPage'
import SongList from '@/pages/SongListPage'
import Singer from '@/pages/SingerPage'

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/info',
      children: [
        {
          path: '/info',
          name: 'Info',
          component: Info
        },
        {
          path: '/consumer',
          name: 'Consumer',
          component: Consumer
        },
        {
          path: '/singer',
          name: 'Singer',
          component: Singer
        },
        {
          path: '/songList',
          name: 'SongList',
          component: SongList
        }
      ]
    }
  ]
})
