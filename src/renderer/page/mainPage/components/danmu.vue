<template>
	<div id="danmu" :style="{ zIndex: isAnswering ? 999 : -1 }" v-show="isShowDanmu"></div>
</template>

<script>
	import $ from '@/page/mainPage/assets/js/jquery-vendor';
	import '@/page/mainPage/assets/js/jquery.danmu';
	import {
		mapState
	} from 'vuex';
	export default {
		components: {},
		data() {
			return {
				isShowDanmu: false
			};
		},
		computed: {
			...mapState(['danmuinfolist'])
		},
		props: {
			/* 是否开始答题 */
			isAnswering: {
				type: Boolean,
				default: false
			},
			questionType: {
				type: [String, Number],
				default: 0
			}
		},
		mounted() {
			// this.starDanmu();
		},
		methods: {
			addDanmu(obj) {
				if (this.isShowDanmu) {
					var time = $('#danmu').data('nowTime') + 1;
					/*当渲染弹幕过多的时候,延迟处理弹幕*/
					if ($('#danmu .danmaku').length > 500) {
						time += 200; //2000毫秒。
					}
					console.log('新增弹幕'+ new Date().getTime())
					$('#danmu').danmu('addDanmu', [{
						text: obj.stuName,
						color: 'white',
						size: 0,
						position: 0,
						time: time
					}]);
				}
			},
			clearDanmu() {
				$('#danmu').data('danmuList', {});
				$('#danmu').danmu('danmuStop');
				this.isShowDanmu = false;
			},
			starDanmu(questionType) {
				let index = this.danmuinfolist.findIndex(item => item.questionType == questionType);
				this.isShowDanmu = false;
				if (index >= 0) {
					let danmuinfo = this.danmuinfolist[index];
					if (danmuinfo.isOpenBarrageflag) {
						this.isShowDanmu = true;
						$('#danmu').data('danmuList', {});
						$('#danmu').danmu('danmuStart');
						/* 设置弹幕位置和透明度 */
						$('#danmu').danmu('setOpacity', danmuinfo.diaphaneity / 100);
						$('#danmu').danmu('setLocation', danmuinfo.location);
					}
				}
			}
		}
	};
</script>

<style>
	#danmu {
		position: fixed;
		top: 100px;
		bottom: 200px;
		left: 0;
		right: 0;
	}

	.danmaku .avatar,
	.danmaku .avatar+span {
		vertical-align: middle;
		display: inline-block;
	}

	.danmaku .avatar+span {
		padding: 0 10px;
	}

	.danmaku {
		background: rgba(0, 0, 0, 0.4);
		border-radius: 50px;
		display: inline-block;
		padding-right: 20px;
		transform: translateX(0);
		-webkit-transform: translateX(0);
	}

	.danmaku .avatar {
		display: inline-block;
		height: 2.4em;
		width: 2.4em;
		background: url(../assets/img/1.png) no-repeat center center;
		background-size: cover;
	}
</style>
