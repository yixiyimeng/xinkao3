<template>
	<div class="bg">
		<div class="title" v-if="title.length>0">
			<span v-for="(item,index) in title" :key="index">{{item}}</span>
		</div>
		<!-- 切换菜单 -->
		<div class="mainmenu">
			<div class="setbtnlist" v-if="!isAnswering">
				<a href="javascript:;" @click="shownamelist" class="userlist" title="学生名单"></a>
				<!-- <router-link :to="'namelist'" class="userlist"></router-link> -->
				<router-link :to="'set'" class="set" title="设置"></router-link>
			</div>
			<!-- <div class="set"></div>
			<div class="setbtnlist">
				<i class="lefttop"></i>
				<i class="righttop"></i>
				<i class="leftbottom"></i>
				<i class="rightbottom"></i>
				<a href="javascript:;" @click="shownamelist">
					<i class="icon1"></i>
					<p>学生名单</p>
				</a>

			</div> -->
		</div>
		<!-- 返回 -->
		<!-- <a href="javascript:;" class="reback" @click="returnback"></a> -->
		<!-- 学生名单 -->
		<namelist :isAnswering="isAnswering" ref="namelist" @startName="startName" @stopName="stopName"></namelist>
		<!-- 进度条 -->
		<load :isprogress="isChoice" :rate="rate"></load>
		<!-- 显示学生名单的时候，内容隐藏 -->
		<div v-show="!isShowName">
			<!-- 学生签到 -->
			<singinlist ref="singinlist" @returnback="returnback" @startAnswer="startAnswer" @stopAnswer="stopAnswer"></singinlist>
			<!-- 答题 -->
			<start-answer ref="startAnswer" @startAnswer="startAnswer" @stopAnswer="stopAnswer" @returnback="returnback"></start-answer>
			<!-- 投票 -->
			<vote ref="vote" @returnback="returnback" @startVote="startAnswer" @stopVote="stopAnswer"></vote>
			<!-- 评分 -->
			<score ref="score" @returnback="returnback" @startScore="startAnswer" @stopScore="stopAnswer"></score>
			<!-- 抢答 -->
			<responder ref="quickAnswer" @returnback="returnback" @startQuickAnswer="startAnswer" @stopQuickAnswer="stopAnswer"></responder>
			<!-- 弹幕 -->
			<danmu ref="danmu" :style="{zIndex:isAnswering?999:-1}" v-show="isDanmu"></danmu>
			<div class="classbox" v-if="isShowClassMenu">
				<div>
					<div class="menu">
						<a href="javascript:;" @click="showStartAnswer">
							<i class="icon1 icon"></i>
							<span>答题</span>
						</a>
						<a href="javascript:;" @click="showQuickAnswer">
							<i class="icon2 icon"></i>
							<span>抢答</span>
						</a>
						<a href="javascript:;" @click="showStartScore">
							<i class="icon3 icon"></i>
							<span>评分</span>
						</a>
						<a href="javascript:;" @click="showStartVote">
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
		</div>
		<div class="btnlist">
			<a href="javascript:;" class="signIn" v-if="isShowClassMenu&&!isAnswering" @click="showSingInlist">签到</a>
			<a href="javascript:;" class="offClass" @click="endClass">下课</a>
		</div>
	</div>
</template>

<script>
	import namelist from '@/page/mainPage/components/namelist';
	import startAnswer from '@/page/mainPage/components/startAnswer';
	import load from '@/page/mainPage/components/load';
	import danmu from '@/page/mainPage/components/danmu';
	import singinlist from '@/page/mainPage/components/singinlist';
	import vote from '@/page/mainPage/components/vote';
	import score from '@/page/mainPage/components/score';
	import responder from '@/page/mainPage/components/responder';
	import api from '@/page/mainPage/api';
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			namelist,
			startAnswer,
			load,
			danmu,
			singinlist,
			vote,
			score,
			responder
		},
		data() {
			return {
				sendInfo: {},
				title: '',
				isAnswering: false, //是否正在答题
				ws: null,
				isShowClassMenu: true, //显示上课菜单
				rate: 0, //作答进度
				isChoice: false, //是否选择题
				directBroadcastCode: '',
				isShowName: false, // 显示学生名单
			};
		},
		computed: {
			...mapState(['isDanmu'])
		},
		created() {
			this.sendInfo = JSON.parse(this.$route.query.sendInfo);
			this.title = this.sendInfo.className.trim();
			this.directBroadcastCode = this.sendInfo.directBroadcastCode;
		},
		mounted() {
			this.getWebSocket();
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
				this.isShowName = true;
				//this.isShowClassMenu = false;
				this.title = '学生名单'
			},
			startName() {
				/* 关闭学生名单 */
				this.isAnswering = true;
			},
			stopName() {
				/* 关闭学生名单 */
				this.isAnswering = false;
				this.isChoice = false;
				this.rate = 0; //清空进度条数据
				this.title = this.sendInfo.className.trim();;
				this.isShowName = false;
				// this.isShowClassMenu = true;
			},
			showStartAnswer() {
				this.$refs.startAnswer.showAnswer();
				this.isShowClassMenu = false;
			},
			startAnswer(isChoice) {
				/* 开始答题 */
				this.isAnswering = true;
				this.isChoice = isChoice == 1;
				if (isChoice == 1) {
					this.title = ''
				} else if (isChoice == 0) {
					this.title = '随堂检测';
				}
				this.$refs.danmu.starDanmu();

			},
			stopAnswer() {
				/* 结束答题 */
				this.isAnswering = false;
				this.isChoice = false;
				this.rate = 0; //清空进度条数据
				/* 结束答题后，清空弹幕 */
				this.$refs.danmu.clearDanmu();

			},

			showStartVote() {
				this.$refs.vote.show();
				this.isShowClassMenu = false;
				this.title = '投票统计'
			},
			showStartScore() {
				this.$refs.score.show();
				this.isShowClassMenu = false;
				this.title = '评分统计'
			},
			showQuickAnswer() {
				this.$refs.quickAnswer.show();
				this.isShowClassMenu = false;
				this.title = '抢答'
			},
			returnback(isOnlyShowClassName) {
				/* 返回 */
				//this.$router.push('/login');
				/* 如果显示的是答题菜单,则返回上一页,否则,显示答题菜单*/
				if (this.isShowClassMenu) {
					this.$router.go(-1);
				} else {
					if(!isOnlyShowClassName){
						this.isShowClassMenu = true;
					}
					this.title = this.sendInfo.className.trim();

				}
			},
			showClassName(){
				this.title = this.sendInfo.className.trim();
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
										if ($me.isDanmu) {
											$me.$refs.danmu.addDanmu(obj)
										}

										break;
									}
								case 1:
									{ /*刷新名单*/
										for (var i = 0; i < msg.urlPaths.length; i++) {
											if (msg.urlPaths[i].method == 'getNamelist') {
												$me.$refs.namelist.getNamelist();
											} else if (msg.urlPaths[i].method == 'getprogress') {
												$me.getprogress();
											} else if (msg.urlPaths[i].method == 'getAttendance') {
												$me.$refs.singinlist.getAttendanceList();
											} else if (msg.urlPaths[i].method == 'randomDetectionAnswerPercent') {
												$me.$refs.startAnswer.answerPercent();
											}
										}
										break;
									}
								case 16:
									{
										/* 显示抢答名单 */
										$me.$refs.quickAnswer.setName(obj.stuName)
										break;
									}
								case 17:
									{
										/* 接收器编号 */
										$me.$refs.namelist.setCode(obj)
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
			},
			/* 开始签到 */
			showSingInlist() {
				this.title = '学生签到';
				this.$refs.singinlist.show();
				this.isShowClassMenu = false;
			},
			/* 下课 */
			endClass() {
				const $me = this;

				var param = {
					code: this.directBroadcastCode
				};
				this.$loading('正在下课...');
				$me.$postAction(api.endClass, param).then(da => {
					if (da && da.ret == 'success') {

					}
				})
				setTimeout(function() {
					$me.$router.push({
						//页面跳转
						path: 'setClass',
						query: {
							sendInfo: JSON.stringify($me.sendInfo)
						}
					});
					$me.$loading.close();
				}, 5000);
			}
		}
	};
</script>

<style scoped="scoped" lang="scss">
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
		background: url(../assets/img/theme1/setStubg.png) no-repeat center top;
		height: 100%;

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
				transform: translate(-50%, -40%);

				&>a {
					display: inline-block;
					width: 270px;
					height: 95px;
					background: url(../assets/img/theme1/menubg.png);
					text-align: center;
					// line-height: 95px;
					color: #6699cc;
					font-size: 30px;
					margin: 13px 45px;
					position: relative;
					line-height: 95px;

					&>span,
					&>img {
						vertical-align: middle;

					}
				}
			}
		}

		.btnlist {
			text-align: right;
			position: absolute;
			bottom: 35px;
			right: 35px;
			z-index: 999;

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
		height: 100%;
		background: url(../assets/img/theme2/kssk.png) no-repeat left bottom;
		// background-size:100% auto;
		// background-position: left bottom;

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
					padding-top: 35px;

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
			text-align: right;
			position: absolute;
			bottom: 35px;
			right: 35px;
			z-index: 999;

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
			transform: translate(-50%, 0);
			top: 160px;
			left: 50%;
			position: absolute;
			bottom:120px;

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
				z-index: 1;
			}

			&>div {
				border: 2px solid #df8487;
				background: url(../assets/img/theme4/bg2.png);
				padding: 95px 0 45px;
				overflow: auto;
				height:100%;
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

							.icon {
								&.icon1 {
									background-image: url(../assets/img/theme4/sicon1.png);

								}

								&.icon2 {
									background-image: url(../assets/img/theme4/sicon2.png);

								}

								&.icon3 {
									background-image: url(../assets/img/theme4/sicon3.png);

								}

								&.icon4 {
									background-image: url(../assets/img/theme4/sicon4.png);

								}

								&.icon5 {
									background-image: url(../assets/img/theme4/sicon5.png);

								}
							}

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
								background-image: url(../assets/img/theme4/icon5.png);

							}


						}
					}

				}
			}
		}

		.btnlist {
			position: absolute;
			bottom: 35px;
			right: 35px;
			z-index: 999;

			.offClass,
			.signIn {
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
