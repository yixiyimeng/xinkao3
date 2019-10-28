<template>
	<div class="main-page" style="overflow: hidden;">
		<!-- 头部 -->
		<div class="titlebar flex flex-pack-justify">
			<!-- <div>
				<img src="../assets/img/logo-white.png" alt="" class="logo" />
				<span>互动课堂</span>
			</div> -->
			<!-- <div class="btnlist">
				<a href="javascript:;" class="minApp"></a>
				<a href="javascript:;" class="maxApp"></a>
				<a href="javascript:;" class="resApp"></a>
				<a href="javascript:;" class="exitApp"></a>
			</div> -->
		</div>
		<transition :name="transitionName">
			<router-view class="Router"></router-view>
		</transition>
		<div class="exitappWin animated fadeIn" v-if="isexit">
			<div class="confirm">
				<div>
					<div class="title">是否关闭程序？</div>
					<div class="buttonGroup">
						<a href="javascript:;" @click="isexit = !isexit">暂不</a>
						<a href="javascript:;" class="comfirmBtn" @click="exitApp">关闭</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				transitionName: 'slide-right',
				isexit: false
			};
		},
		computed: {
			...mapState(['isminimizeAppState'])
		},
		methods: {
			exitApp: function() {
				const _this = this;
				this.$loading('正在退出软件...');
				setTimeout(function() {
					_this.$loading.close();
					_this.$electron.ipcRenderer.send('exitApp');
				}, 100);
			}
		},
		watch: {
			//使用watch 监听$router的变化
			$route(to, from) {
				//如果to索引大于from索引,判断为前进状态,反之则为后退状态
				if (to.meta.index > from.meta.index) {
					//设置动画名称
					this.transitionName = 'slide-left';
				} else {
					this.transitionName = 'slide-right';
				}
			}
		},
		created() {
			const _this = this;
			/* 监听主进程 是否关闭软件 */
			_this.$electron.ipcRenderer.on('isexitApp', event => {
				_this.isexit = true;
			});

			/* 监听主进程 是否最小化 成功*/
			_this.$electron.ipcRenderer.on('isminimizeApp', (event, flag) => {
				_this.$store.commit('SET_isminimizeApp', flag);
			});

			/* 监听页面刷新的时候，存储store */
			window.addEventListener('beforeunload', () => {
				localStorage.setItem('messageStore', JSON.stringify(this.$store.state));
			});
			//在页面加载时读取localStorage里的状态信息
			localStorage.getItem('messageStore') && this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(
				localStorage.getItem('messageStore'))));
		}
	};
</script>

<style scoped lang="scss">
	.Router {
		position: absolute;
		width: 100%;
		transition: all 0.8s ease;
		z-index: 1;
		top: 0;
	}

	.slide-right-enter-active,
	.slide-right-leave-active,
	.slide-left-enter-active,
	.slide-left-leave-active {
		will-change: transform;
		transition: all 500ms;
		position: absolute;
	}

	.slide-right-enter {
		opacity: 0;
		transform: translate3d(-100%, 0, 0);
	}

	.slide-right-leave-active {
		opacity: 0;
		transform: translate3d(100%, 0, 0);
	}

	.slide-left-enter {
		opacity: 0;
		transform: translate3d(100%, 0, 0);
	}

	.slide-left-leave-active {
		opacity: 0;
		transform: translate3d(-100%, 0, 0);
	}
	
</style>
