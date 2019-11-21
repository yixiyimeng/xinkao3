import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		theme:localStorage.getItem('theme')||'theme4',
		isDanmu:localStorage.getItem('isDanmu')=='true'||true,
		isminimizeAppState: false, //最小化
		danmuinfolist:[]
	},
	getters: {
		getisminimizeApp: (state) => {
			return state.isminimizeAppState
		},
	},
	mutations: {

		SET_isminimizeApp: (state, isminimize) => {
			state.isminimizeAppState = isminimize
		},
		SET_theme:(state, theme)=>{
			state.theme = theme;
			localStorage.setItem('theme',theme)
		},
		SET_danmu:(state, isDanmu)=>{
			state.isDanmu = isDanmu;
			localStorage.setItem('isDanmu',isDanmu)
		},
		SET_danmuinfolist:(state, danmuinfolist)=>{
			state.danmuinfolist = danmuinfolist;
			// localStorage.setItem('isDanmu',isDanmu)
		},
	}
});
