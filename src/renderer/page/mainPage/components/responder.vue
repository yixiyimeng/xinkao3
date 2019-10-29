<template>
	<div v-if="isShow">
		<a href="javascript:;" class="reback" @click="returnback" v-if="viewState!=1"></a>
		<div class="quickAnswerbox">
			<div class="centerbox">
				<span class="num" v-if="count>0">{{count}}</span>
				<p v-if="count==0">{{username}}</p>
			</div>
		</div>
		<div class="btnbar">
			<a href="javascript:;" class="startClass" @click="startQuickAnswer" v-if="viewState==0">开始抢答</a>
			<a href="javascript:;" class="startClass" @click="stopQuickAnswer" v-if="viewState==1">停止抢答</a>
		</div>
	</div>
</template>

<script>
	import api from '@/page/mainPage/api';
	export default {
		components: {},
		data() {
			return {
				isShow: false,
				isStop: false,
				count: 3,
				timer: null,
				viewState: 0, //
				username: '抢答中……'
			};
		},
		methods: {
			show() {
				this.isShow = true;
			},
			setName(name){
				this.username=name;
				this.stopQuickAnswer();
			},
			startQuickAnswer() {
				var $me = this;
				if ($me.timer) {
					return false
				}
				$me.isStop = true;
				$me.count = 3;
				$me.viewState = 1;
				/* 开始抢答 */
				$me.timer = setInterval(function() {
					$me.count--;
					if ($me.count <= 0) {
						$me.isStop = false;
						clearInterval($me.timer);
						$me.timer = null;
						
						$me.$postAction(api.startQuickAnswer).then(da => {
							$me.$emit('startQuickAnswer')
						})
					}

				}, 1000);
			},
			returnback() {
				this.isShow = false;
				this.count = 3;
				this.timer = null;
				this.viewState = 0;
				this.username = '抢答中……';
				this.$emit('returnback');
			},
			stopQuickAnswer() {
				this.$postAction(api.stopQuickAnswer).then(da => {
					this.viewState = 2;
					this.$emit('stopQuickAnswer')
				})
			}
		}
	};
</script>

<style scoped="scoped" lang="scss">
	.quickAnswerbox {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		.centerbox {
			font-size: 134px;
			color: #fff;
			background: rgba($color: #fff, $alpha: 0.2);
			height: 242px;
			width: 242px;
			border: 6px solid #fff;
			border-radius: 100%;
			line-height: 236px;
			text-align: center;
			margin: 0 auto;

			p {
				font-size: 24px;
			}

			i {
				position: absolute;
				font-size: 30px;
				top: -20px;
			}
		}

		.countdown {
			.centerbox {
				font-size: 60px;
				text-align: left;
				padding-left: 25px;

			}
		}

		.leftcenter {
			position: absolute;
			left: 50%;
			margin-left: -360px;
			font-size: 60px;
			color: #fff;
			height: 124px;
			width: 124px;
			border: 6px solid rgba($color: #fff, $alpha: 0.3);
			background: #5cabe6;
			border-radius: 100%;
			line-height: 118px;
			text-align: center;
		}
	}

	.endAnswer {
		display: block;
		margin: 40px auto;
		width: 360px;
		height: 40px;
		border-radius: 50px;
		background: #3f9be1;
		font-size: 24px;
		line-height: 40px;
		color: #fff;
		text-align: center;
	}

	.bg {
		height: 100%;
		width: 100%;
	}

	.theme1 .bg {
		background-image: url(../assets/img/theme1/dt.png);
		bottom: 0;
	}

	.theme2 .bg {
		background: url(../assets/img/theme2/startClass1.png) no-repeat left top, url(../assets/img/theme2/startClass2.png) no-repeat left bottom,
			url(../assets/img/theme2/startClass3.png) no-repeat right top, url(../assets/img/theme2/startClass4.png) no-repeat right bottom;
		bottom: 0;
	}

	.theme3 .bg {
		bottom: 0;

		.endAnswer {
			width: 360px;
			height: 40px;
			background: url(../assets/img/theme3/endBtn.png) no-repeat center center;
			border-radius: 0
		}

		.centerbox {
			width: 314px;
			height: 344px;
			background: url(../assets/img/theme3/countdown.png) no-repeat center center;
			background-size: cover;
			border: none;
			border-radius: 0;
			line-height: 344px;
			padding-left: 70px;
			font-size: 48px;

			i {
				font-size: 24px;
			}
		}

		.leftcenter {
			position: absolute;
			left: 50%;
			margin-left: 270px;
			font-size: 60px;
			color: #fff;
			height: 119px;
			width: 119px;
			background: url(../assets/img/theme3/countdown2.png) no-repeat center center;
			line-height: 118px;
			text-align: center;
			border: none;
			border-radius: 0;
		}
	}

	.theme4 {
		.centerbox {
			width: 378px;
			height: 378px;
			background: url(../assets/img/theme4/qdbg.png) no-repeat center center;
			background-size: cover;
			border: none;
			border-radius: 0;
			line-height: 378px;
			font-size: 88px;
			color: #333;

			p {
				font-size: 30px;
			}
		}

		.leftcenter {
			position: absolute;
			left: 50%;
			margin-left: 270px;
			font-size: 60px;
			color: #fff;
			height: 119px;
			width: 119px;
			background: url(../assets/img/theme3/countdown2.png) no-repeat center center;
			line-height: 118px;
			text-align: center;
			border: none;
			border-radius: 0;
		}
	}
</style>
