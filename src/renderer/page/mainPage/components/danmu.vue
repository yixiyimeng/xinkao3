<template>
	<div id="danmu"></div>
</template>

<script>
	import $ from '@/page/mainPage/assets/js/jquery-vendor';
	import '@/page/mainPage/assets/js/jquery.danmu';
	export default {
		components: {

		},
		data() {
			return {
				type: 0,
				isShowAnswer: false
			};
		},
		mounted() {
			$('#danmu').danmu('danmuStart');
			$('#danmu').data('danmuList', {});
			// const $me=this;
			// setInterval(function() {
			// 	$me.addDanmu({stuName:'jajaj'})
			// }, 300)
		},
		methods: {
			addDanmu(obj) {
				var time = $('#danmu').data('nowTime') + 1;
				/*当渲染弹幕过多的时候,延迟处理弹幕*/
				if ($('#danmu .danmaku').length > 500) {
					time += 200; //2000毫秒。
				}
				$('#danmu').danmu('addDanmu', [{
					text: obj.stuName,
					color: 'white',
					size: 0,
					position: 0,
					time: time
				}]);
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
		background: rgba(0, 0, 0, .4);
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
