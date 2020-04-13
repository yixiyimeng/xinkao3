import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/page/mainPage/api';
Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		theme:localStorage.getItem('theme')||'theme4',
		isDanmu:localStorage.getItem('isDanmu')=='true'||true,
		isminimizeAppState: false, //最小化
		danmuinfolist:[],
		websock: null,
		eventlist: [],
		alertCont: [],
		directBroadcastCode:'',
		loginInfo:null,//登录后保存的基本信息
	countDown:localStorage.getItem('countDown')||10,
	isCountDown:localStorage.getItem('isCountDown')||0,//是否启用倒计时
	
	},
	getters: {
		getisminimizeApp: (state) => {
			return state.isminimizeAppState
		},
		onEvent(state) {
			return function() {
				if (state.eventlist.length > 0) {
					let result = state.eventlist[0];
					state.eventlist.splice(0, 1);
					return result;
				}
				return null;
			}
		},
		onalertCont(state) {
			return function() {
				if (state.alertCont.length > 0) {
					let result = state.alertCont[0];
					state.alertCont.splice(0, 1);
					return result;
				}
				return null;
			}
		}
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
		// SET_danmuinfolist:(state, danmuinfolist)=>{
		// 	state.danmuinfolist = danmuinfolist;
		// 	// localStorage.setItem('isDanmu',isDanmu)
		// },
		SET_danmuinfolist(state, danmuinfolist){
			state.danmuinfolist = danmuinfolist;
			localStorage.setItem('danmuinfolist', JSON.stringify(danmuinfolist));
		},
		SET_countDown(state, countDown){
			state.countDown = countDown;
			localStorage.setItem('countDown', countDown);
		},
		SET_isCountDown(state, isCountDown){
			state.isCountDown = isCountDown;
			localStorage.setItem('isCountDown', isCountDown);
		},
		STAFF_UPDATEWEBSOCKET(state, websock) {
			/* 更新websock */
			state.websock = websock
		},
	},
	actions: {
		STAFF_WEBSOCKET({
			commit
		}) {
			let that = this;
			commit('STAFF_UPDATEWEBSOCKET', new WebSocket(api.urlwsPath))
			// 只有定义了onopen方法，才能继续实现接收消息，即在使用的地方调用onmessage方法。
			this.state.websock.onopen = function() {
	
			}
			that.state.websock.onmessage = function(evt) {
				var received_msg = evt.data;
				var data = '';
				if (received_msg == '连接成功') {
					data = received_msg;
					that.state.eventlist.push({
						timeStr: new Date().getTime(),
						data: received_msg
					})
					that.state.alertCont.push({
						timeStr: new Date().getTime(),
						data: received_msg
					})
				} else {
					var msg = JSON.parse(received_msg);
					if (msg.reqType == 3) {
						that.state.alertCont.push({
							timeStr: new Date().getTime(),
							data: msg
						})
					} else {
						that.state.eventlist.push({
							timeStr: new Date().getTime(),
							data: msg
						})
					}
				}
	
			}
	
		}
	}
});
