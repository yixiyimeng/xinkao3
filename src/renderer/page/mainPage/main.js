import Vue from 'vue'
// import axios from 'axios'
// 
import App from './App'
import router from './router'
import store from './store'
import 'vue2-toast/lib/toast.css';
import Toast from 'vue2-toast';
import './components'
Vue.use(Toast);
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
// Vue.http = Vue.prototype.$http = axios
import { VueAxios } from './utils/request'
import {postAction} from './api';
Vue.prototype.$postAction=postAction;
Vue.use(VueAxios)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
	components: {
		App
	},
	router,
	store,
	template: '<App/>'
}).$mount('#app')
