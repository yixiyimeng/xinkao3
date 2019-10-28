<template>
	<div class="bg">
		<div class="title">
		<span v-for="item in className" :key="item">{{item}}</span>
		</div>
		<!-- 切换菜单 -->
		<div class="mainmenu">
			<div class="set"></div>
			<div class="setbtnlist">
				<i class="lefttop"></i>
				<i class="righttop"></i>
				<i class="leftbottom"></i>
				<i class="rightbottom"></i>
				<a href="javascript:;" @click="shownamelist">
					<i class="icon1"></i>
					<p>学生名单</p>
				</a>

			</div>
		</div>
		<!-- 返回 -->
		<a href="javascript:;" class="reback" @click="returnback"></a>
		<!-- 学生名单 -->
		<namelist :isAnswering="isAnswering" ref="namelist"></namelist>
		<!-- 答题 -->
		<start-answer ref="startAnswer" @startAnswer="startAnswer" @stopAnswer="stopAnswer"></start-answer>
		<!-- 进度条 -->
		<load :isprogress="isAnswering" :rate="rate"></load>
		<!-- 弹幕 -->
		<danmu ref="danmu"></danmu>
		<div class="classbox" v-if="isShowClassMenu">
			<div>
				<div class="menu">
					<a href="javascript:;" @click="showStartAnswer">
						<i class="icon1 icon"></i>
						<span>答题</span>
					</a>
					<router-link :to="'responder'">
						<i class="icon2 icon"></i>
						<span>抢答</span>
					</router-link>
					<router-link :to="'vote'">
						<i class="icon3 icon"></i>
						<span>评分</span>
					</router-link>
					<a href="javascript:;">
						<i class="icon4 icon"></i>
						<span>投票</span>
					</a>
					<!-- <router-link :to="'vote'"> -->
					<a href="javascript:;">
						<i class="icon5 icon"></i>
						<span>作业</span>
					</a>
				</div>
			</div>
		</div>
		<div class="btnlist">
			<a href="javascript:;" class="signIn">签到</a>
			<a href="javascript:;" class="offClass">下课</a>
		</div>
	</div>
</template>

<script>
	import namelist from '@/page/mainPage/components/namelist';
	import startAnswer from '@/page/mainPage/components/startAnswer';
	import load from '@/page/mainPage/components/load';
	import danmu from '@/page/mainPage/components/danmu';
	import api from '@/page/mainPage/api';
	export default {
		components: {
			namelist,
			startAnswer,
			load,
			danmu
		},
		data() {
			return {
				sendInfo: {},
				className: '',
				isAnswering: false, //是否正在答题
				ws: null,
				isShowClassMenu: true, //显示上课菜单
				rate: 0, //作答进度
				isprogress: true, //是否显示进度条
			};
		},
		created() {
			this.sendInfo = JSON.parse(this.$route.query.sendInfo);
			this.className = this.sendInfo.className;

		},
		mounted() {
			this.getWebSocket();
			this.showStartAnswer();
		},
		destroyed() {
			if (this.ws) {
				this.ws.close(); //离开路由之后断开websocket连接
				this.ws = null;
			}
		},
		methods: {
			shownamelist() {
				/* 显示学生名单 */
				this.$refs.namelist.shownamelist();
			},
			showStartAnswer() {
				this.$refs.startAnswer.showAnswer();
				this.isShowClassMenu = false;
			},
			startAnswer() {
				/* 开始答题 */
				this.isAnswering = true;
			},
			stopAnswer() {
				/* 结算答题 */
				this.isAnswering = false;
			},
			returnback() {
				/* 返回 */
				//this.$router.push('/login');
				/* 如果显示的是答题菜单,则返回上一页,否则,显示答题菜单*/
				if (this.isShowClassMenu) {
					this.$router.go(-1);
				} else {
					this.isShowClassMenu = true;
					/* 关闭答题页面*/
					this.$refs.startAnswer.hideAnswer();
				}
			},
			getprogress() {
				/* 答题进度 */
				const $me = this;
				$me.$postAction(api.getprogress).then(da => {
					if (da && da.ret == 'success') {
						/*结束答题 */
						var list = da.data;
						if (list.totalNumber && parseInt(list.totalNumber) > 0) {
							$me.rate = parseInt((list.answerNumber / list.totalNumber) * 100);
						}
					}
				})
			},
			getWebSocket() {
				const $me = this;
				/* 连接websocket */
				if (!$me.ws) {
					// 打开一个 web socket
					$me.ws = new WebSocket(api.urlwsPath);
					$me.ws.onopen = function() {};
					$me.ws.onmessage = function(evt) {
						var received_msg = evt.data;
						if (received_msg != '连接成功') {
							var msg = JSON.parse(received_msg);
							var obj = msg.data;
							switch (msg.reqType) {
								case 0:
									{
										$me.$refs.danmu.addDanmu(obj)
										break;
									}
								case 1:
									{ /*刷新名单*/
										for (var i = 0; i < msg.urlPaths.length; i++) {
											if (msg.urlPaths[i].method == 'getNamelist') {
												$me.$refs.namelist.getNamelist();
											} else if (msg.urlPaths[i].method == 'getprogress') {
												$me.getprogress();
											}
										}
										break;
									}
							}
						}
					}
					$me.ws.onclose = function() {
						// 关闭 websocket
						$me.ws = null;
					};
				}
			}

		}
	};
</script>

<style scoped="scoped" lang="scss">
	@import '../assets/css/set.scss';

	.classbox {
		z-index: 999;
	}

	.bg {
		
		.menu a {
			.icon {
				height: 42px;
				display: inline-block;
				width: 50px;
				vertical-align: middle;
				background: no-repeat center center;

				&.icon1 {
					background-image: url(../assets/img/icon1.png);

				}

				&.icon2 {
					background-image: url(../assets/img/icon2.png);

				}

				&.icon3 {
					background-image: url(../assets/img/icon3.png);

				}

				&.icon4 {
					background-image: url(../assets/img/icon4.png);

				}

				&.icon5 {
					background-image: url(../assets/img/icon5.png);

				}
			}

			span {
				vertical-align: middle;
			}
		}
	}

	.theme1 .bg {
		background-image: url(../assets/img/theme1/setStubg.png);
		.classbox {
			position: absolute;
			top: 145px;
			left: 50px;
			right: 50px;
			bottom: 75px;
			box-sizing: border-box;
			font-family: 'hxfont';

			.menu {
				text-align: center;
				width: 740px;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -60%);

				&>a {
					display: inline-block;
					width: 270px;
					height: 95px;
					background: url(../assets/img/theme1/menubg.png);
					text-align: center;
					line-height: 95px;
					color: #6699cc;
					font-size: 30px;
					margin: 13px 45px;

					span {
						font-family: 'hxfont';
					}
				}
			}
		}

		.btnlist {
			text-align: right;

			a {
				height: 56px;
				width: 56px;
				display: inline-block;
				text-align: center;
				line-height: 56px;
				background: no-repeat center center;
				background-size: cover;
				font-family: 'hxfont';
				font-size: 18px;

				&.signIn {
					background-image: url(../assets/img/theme1/btn1.png);
					color: #6699cc;
				}

				&.offClass {
					background-image: url(../assets/img/theme1/btn2.png);
					color: #fff;
					margin-left: 10px;
				}
			}
		}
	}

	.theme2 .bg {
		background-image: url(../assets/img/theme2/kssk.png);
		// background-size:100% auto;
		background-position: left bottom;

		.classbox {
			position: absolute;
			top: 75px;
			left: 50px;
			right: 50px;
			bottom: 75px;
			box-sizing: border-box;
			font-family: 'hxfont';

			.menu {
				text-align: center;
				width: 100%;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -40%);

				&>a {
					display: inline-block;
					width: 161px;
					height: 161px;
					background: url(../assets/img/theme2/menubg.png);
					text-align: center;
					// line-height: 95px;
					color: #6699cc;
					font-size: 30px;
					margin: 13px 20px;
					position: relative;
					padding-top: 50px;

					span {
						display: block;
					}

					img {
						position: absolute;
						top: 95px;
						left: 50%;
						transform: translateX(-50%);
					}
				}
			}
		}

		.btnlist {
			text-align: right;

			a {
				width: 100px;
				height: 34px;
				display: inline-block;
				text-align: center;
				line-height: 34px;
				background: no-repeat center center;
				background-size: cover;
				font-size: 18px;

				&.signIn {
					background-image: url(../assets/img/theme2/btn1.png);
					color: #6699cc;
				}

				&.offClass {
					background-image: url(../assets/img/theme2/btn2.png);
					color: #fff;
					margin-left: 10px;
				}
			}
		}
	}

	.theme3 .bg {
		background: none;

		.classbox {
			position: absolute;
			top: .7rem;
			left: 35px;
			right: 35px;
			bottom: 0;



			.menu {
				text-align: center;
				width: 100%;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -40%);

				&>a {
					display: inline-block;
					width: 137px;
					height: 137px;
					background: url(../assets/img/theme3/menubg.png);
					text-align: center;
					color: #fff;
					font-size: 24px;
					margin: 13px 30px 0;
					position: relative;
					padding-top: 34px;

					span {
						display: block;
					}

					img {
						position: absolute;
						top: 65px;
						left: 50%;
						transform: scale(.8, .8) translateX(-60%);
					}
				}
			}
		}

		.btnlist {
			text-align: right;

			a {
				width: 100px;
				height: 41px;
				display: inline-block;
				text-align: center;
				line-height: 38px;
				font-size: 18px;
				color: #fff;
				background: rgba($color: #07f8ff, $alpha: 0.3);
				border: 1px solid #07f8ff;
				border-radius: 5px;

				&.offClass {
					margin-left: 10px;
				}
			}
		}
	}

	.theme4 .bg {
		.classbox {
			width: 1225px;
			background: #fff;
			padding: 11px;
			position: relative;
			border: 2px solid #1e569e;
			transform: translate(-50%, -50%);
			top: 50%;
			left: 50%;
			position: absolute;

			&:before {
				display: block;
				content: '';
				height: 91px;
				width: 549px;
				background: url(../assets/img/theme4/bg.png);
				position: absolute;
				top: -5px;
				left: 50%;
				transform: translateX(-50%);
			}

			&>div {
				border: 2px solid #df8487;
				background: url(../assets/img/theme4/bg2.png);
				padding: 95px 0 45px;

				.menu {
					text-align: center;

					a {
						position: relative;
						display: inline-block;
						width: 240px;
						text-align: center;
						color: #333;
						font-size: 42px;
						padding-top: 50px;

						&:nth-child(2) {
							margin: 0 122px;
						}

						&:nth-child(4),
						&:nth-child(5) {
							margin: 0 72px 50px;
						}

						&:after {
							content: '';
							height: 174px;
							width: 174px;
							background: #f3e8c1;
							border: 2px solid #2459a0;
							border-radius: 8px;
							display: block;
							position: absolute;
							left: 50%;
							top: 30px;
							transform: translate(-50%, 0) rotate(45deg);
						}

						&:hover:after {
							background: #8aa7ce;
						}

						&:hover {
							color: #fff;
						}

						&>span {
							position: relative;
							z-index: 999;
							display: block;
						}

						.icon {
							height: 70px;
							display: inline-block;
							width: 78px;
							vertical-align: middle;
							background: no-repeat center center;
							position: relative;
							z-index: 999;

							&.icon1 {
								background-image: url(../assets/img/theme4/icon1.png);

							}

							&.icon2 {
								background-image: url(../assets/img/theme4/icon2.png);

							}

							&.icon3 {
								background-image: url(../assets/img/theme4/icon3.png);

							}

							&.icon4 {
								background-image: url(../assets/img/theme4/icon4.png);

							}

							&.icon5 {
								background-image: url(../assets/img/icon5.png);

							}
						}
					}

				}
			}
		}

		.btnlist {
			position: absolute;
			bottom: 35px;
			right: 100px;
			z-index: 999;

			a {
				width: 116px;
				height: 85px;
				display: inline-block;
				text-align: center;
				line-height: 85px;
				background: url(../assets/img/theme4/btn.png);
				color: #2b5fa3;
				font-size: 30px;

				&.offClass {
					margin-left: 30px;
				}
			}

		}
	}

	.vs__fade-enter-active,
	.vs__fade-leave-active {
		-webkit-transition: opacity 0.15s cubic-bezier(1, 0.5, 0.8, 1);
		transition: opacity 0.15s cubic-bezier(1, 0.5, 0.8, 1);
	}

	.vs__fade-enter,
	.vs__fade-leave-to {
		opacity: 0;
	}
</style>
