import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import VCharts from 'v-charts'

Vue.config.productionTip = false
Vue.use(iView)
Vue.use(VCharts)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store: store,
  render: h => h(App)
})
