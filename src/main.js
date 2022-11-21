import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueToast from 'vue-toast-notification';
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue-toast-notification/dist/theme-sugar.css';
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
Vue.config.productionTip = false
Vue.use(VueToast);
Vue.use(PerfectScrollbar)
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
