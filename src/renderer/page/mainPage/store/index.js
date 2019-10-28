import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		theme: localStorage.getItem('theme') || 'theme4',
		isminimizeAppState: false, //最小化
	},
	getters: {
		getisminimizeApp: (state) => {
			return state.isminimizeAppState
		},
	},
	mutations: {

		SET_isminimizeApp: (state, isminimize) => {
			state.isminimizeAppState = isminimize
		}
	}
});
