<template>
	<div class="bg">
		<div class="title" v-if="title.length > 0">
			<span v-for="(item, index) in title" :key="index">{{ item }}</span>
		</div>
		<!-- 切换菜单 -->
		<div class="mainmenu">
			<div class="setbtnlist">

				<div>

					<i class="refresh" @click="refreshResource(0)" v-if="isshowResource==1" title="刷新"></i>
					<i class="refresh refresh2" @click="refreshResource(1)" v-if="isshowResource==2" title="刷新"></i>
					<i class="refresh isMoveTop" :class="{active:isMoveTop}" style="right:-100px" @click="isMoveTop=!isMoveTop" v-if="isshowResource==1"
					 :title="isMoveTop?'置底':'置顶'"></i>
					<i class="refresh isMoveTop refresh2" :class="{active:isMoveTop}" style="right:-100px" @click="isMoveTop=!isMoveTop"
					 v-if="isshowResource==2" :title="isMoveTop?'置底':'置顶'"></i>
					<a href="javascript:;" @click="showResource(0)" class="zujuan" title="组卷网">
						<i></i>
						<span>组卷网</span>
					</a>
					<!-- <a href="javascript:;" @click="showResource(1)" class="resource" title="资源课件">
						<i></i>
						<span>资源课件</span>
					</a> -->
					<a v-if="!isAnswering" href="javascript:;" @click="shownamelist" class="userlist" title="学生名单">
						<i></i>
						<span>学生名单</span>
					</a>
				</div>
				<a href="javascript:;" @click.stop="showSet" class="set" title="工具" style="margin-top: 10px;">
					<i></i>
					<span>工具箱</span>
				</a>
				<!-- <router-link :to="'namelist'" class="userlist"></router-link> -->
				<!-- <router-link :to="'set'" class="set" title="设置"></router-link> -->
			</div>
		</div>
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
			<danmu ref="danmu" :isAnswering="isAnswering" :questionType="questionType"></danmu>
			<!-- 课后作业 -->
			<homework ref="homework" @returnback="returnback"></homework>
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
						<a href="javascript:;" @click="showStarthomeWork">
							<i class="icon5 icon"></i>
							<span>作业</span>
						</a>
					</div>
				</div>
			</div>
		</div>
		<!-- 工具栏 -->
		<toolbar :ifTemporary="isAnswering" ref="toolbar" @resumeCountDown="resumeCountDown"></toolbar>
		<div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: -1; background: #fff;" v-show="isshowResource != 0"
		 :style="{zIndex:(isMoveTop&&isshowResource != 0)?9998:-1}">
			<a-spin tip="正在加载..." :spinning="spinning" style="height: 100%;" size="large">
				<iframe ref="iframe1" :src="iframeUrl" frameborder="0" style="width: 100%; height: 100%;" v-show="isshowResource == 1"></iframe>
				<iframe ref="iframe2" :src="iframeUrl2" frameborder="0" style="width: 100%; height: 100%;" v-show="isshowResource == 2"></iframe>
			</a-spin>
		</div>
	</div>
</template>

<script>
	function GetQueryString(searchurl, name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = searchurl.match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}
	import namelist from '@/page/mainPage/components/namelist';
	import startAnswer from '@/page/mainPage/components/startAnswer';
	import load from '@/page/mainPage/components/load';
	import danmu from '@/page/mainPage/components/danmu';
	import singinlist from '@/page/mainPage/components/singinlist';
	import vote from '@/page/mainPage/components/vote';
	import score from '@/page/mainPage/components/score';
	import responder from '@/page/mainPage/components/responder';
	import toolbar from '@/page/mainPage/components/toolbar';
	import homework from '@/page/mainPage/components/homework';
	import api from '@/page/mainPage/api';
	import {
		mapState,
		mapGetters
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
			responder,
			toolbar,
			homework
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
				questionType: 0, //答题类型编号
				isshowResource: 0, //题库资源
				spinning: false,
				resourceUrllist: ['', 'http://zkxl.school.zxxk.com/ThirdParty/CustomJump?_m=http://localhost:8080'],
				iframeUrl: '', //组卷网
				iframeUrl2: '', //资源
				isMoveTop: false,
				oldtitle:''
			};
		},
		computed: {
			...mapState(['danmuinfolist', 'isCountDown'])
			// ...mapGetters(['onEvent'])
		},
		created() {
			this.sendInfo = JSON.parse(this.$route.query.sendInfo);
			this.title = this.sendInfo.className.trim();
			this.directBroadcastCode = this.sendInfo.directBroadcastCode;
			this.$store.state.directBroadcastCode = this.directBroadcastCode;
			/* 开始上课 */
			this.$electron.ipcRenderer.send('onlinedirebro', true);
			this.getAuthentication();
			/* 获取弹幕设置列表 */
			this.getDanmuinfo();
			let $me = this;
			/* 监听 资源网 打开新窗口 */
			this.$electron.ipcRenderer.on('iframeUrl', (event, iframeUrl) => {
				if (iframeUrl) {
					if ($me.isshowResource == 2) {
						if (iframeUrl.split('?')[0] == 'http://localhost:8080/tabframe') {
							let search = iframeUrl.split('?')[1];
							var wxtpath = GetQueryString(search, 'wxtpath');
							iframeUrl = 'http://zkxl.school.zxxk.com' + wxtpath;
						}
					}
					if ($me.isshowResource == 1) {
						this.iframeUrl = iframeUrl
					} else {
						this.iframeUrl2 = iframeUrl;
					}
				}
				/* 赋值地址后，主动将悬浮窗置为顶层 */
				this.$electron.ipcRenderer.send('moveTop');
			});
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
				this.oldtitle=this.title;
				this.title = '学生名单';
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
				this.title =this.oldtitle;
				this.isShowName = false;
				// this.isShowClassMenu = true;
			},
			showStartAnswer() {
				this.$refs.startAnswer.showAnswer();
				this.isShowClassMenu = false;
			},
			startAnswer(questionType, isChoice) {
				/* 开始答题 */
				this.isAnswering = true;
				this.isChoice = isChoice == 1;
				if (isChoice == 0) {
					this.title = '随堂检测';
				} else {
					this.title = '';
				}

				this.questionType = questionType || 0;
				this.$refs.danmu.starDanmu(this.questionType);
			},
			stopAnswer() {
				/* 结束答题 */
				this.isAnswering = false;
				this.isChoice = false;
				this.rate = 0; //清空进度条数据
				/* 结束答题后，清空弹幕 */
				// this.questionType = 0;
				this.$refs.danmu.clearDanmu();
			},

			showStartVote() {
				this.$refs.vote.show();
				this.isShowClassMenu = false;
				this.title = '投票统计';

			},
			showStartScore() {
				this.$refs.score.show();
				this.isShowClassMenu = false;
				this.title = '评分统计';

			},
			showQuickAnswer() {
				this.$refs.quickAnswer.show();
				this.isShowClassMenu = false;
				this.title = '抢答';
			},
			showStarthomeWork() {
				this.$refs.homework.show();
				this.isShowClassMenu = false;
				this.title = '课后作业';
			},
			returnback(isOnlyShowClassName) {
				/* 返回 */
				//this.$router.push('/login');
				/* 如果显示的是答题菜单,则返回上一页,否则,显示答题菜单*/
				if (this.isShowClassMenu) {
					this.$router.go(-1);
				} else {
					if (!isOnlyShowClassName) {
						this.isShowClassMenu = true;
					}
					this.title = this.sendInfo.className.trim();
				}
			},
			showClassName() {
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
				});
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
										if ($me.isAnswering) {
											$me.$refs.danmu.addDanmu(obj);
										}
										break;
									}
								case 1:
									{
										/*刷新名单*/
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
								case 3:
									{
										/* 设置未连接 */
										$me.$toast.center('设备未连接')
										break;
									}
								case 16:
									{
										/* 显示抢答名单 */
										$me.$refs.quickAnswer.setName(obj.stuName);
										break;
									}
								case 17:
									{
										/* 接收器编号 */
										$me.$refs.namelist.setCode(obj);
										break;
									}
							}
						}
					};
					$me.ws.onclose = function() {
						// 关闭 websocket
						console.log('关闭websock')
						$me.$refs.danmu.clearDanmu();
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
					if (da && da.ret == 'success') {}
				});
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
			},
			getAuthentication(type) {
				const $me = this;
				this.$postAction(api.getAuthentication, {
					serviceType: 3
				}).then(da => {
					// this.iframeUrl = da.data;
					if (da.ret == 'success') {
						$me.$set($me.resourceUrllist, 0, da.data);
						if (type == 0) {
							this.iframeUrl = $me.resourceUrllist[type]
							this.loadResouce(type);
						}
					} else {
						$me.$toast.center(da.message);
						if (da.code == 401) {
							// setTimeout(function() {
							// 	$me.returnback()
							// }, 500)
						}
					}
				});
			},
			getDanmuinfo() {
				/* 查询弹幕设置 */
				this.$postAction(api.getDanmuinfo).then(da => {
					if (da && da.ret == 'success') {
						var list = da.data;
						if (list && list.length > 0) {
							list = list.map(item => {
								item.isOpenBarrageflag = item.isOpenBarrage == 1;
								return item;
							});
						}
						this.$store.commit('SET_danmuinfolist', list);
					}
				});
			},
			showSet() {
				/* 打开工具箱 */
				this.$refs.toolbar.changeShow();

			},
			showResource(type) {
				/* 显示资源 */
				if (this.isshowResource == (type + 1)) {
					this.isshowResource = 0;
					return false;
				}
				this.isshowResource = (type + 1);
				if ((type == 0 && this.iframeUrl == '')) {
					//this.iframeUrl = this.resourceUrllist[type]
					/* 重新加载认证地址 */
					this.getAuthentication(type)

				} else if (type == 1 && this.iframeUrl2 == '') {
					this.iframeUrl2 = this.resourceUrllist[type]
					this.loadResouce(type);
				}

			},
			refreshResource(type) {
				if (type == 0) {
					this.iframeUrl = '';
				} else if (type == 1) {
					this.iframeUrl2 = ''
				}
				if ((type == 0 && this.iframeUrl == '')) {
					// this.iframeUrl = this.resourceUrllist[type]
					/* 重新加载认证地址 */
					this.getAuthentication(type)
				} else if (type == 1 && this.iframeUrl2 == '') {
					this.iframeUrl2 = this.resourceUrllist[type]
				}
			},
			loadResouce(type) {
				const $me = this;
				$me.spinning = true;
				this.$nextTick(() => {
					try {
						let iframe = $me.$refs['iframe' + (type == 0 ? '1' : '2')];
						console.log(iframe)
						if (iframe) {
							if (iframe.attachEvent) {
								iframe.attachEvent("onload", function() {
									$me.spinning = false;
								});
							} else {
								iframe.onload = function() {
									$me.spinning = false;
								};
							}
						} else {
							$me.spinning = false;
						}
					} catch (e) {
						//TODO handle the exception
						$me.spinning = false;
					}
				})
			},
			resumeCountDown(type) {
				/* 开始截屏后，暂停或者重启倒计时*/
				if (this.isAnswering)
					this.$refs.startAnswer.resumeCountDown(type);
			}
		}
	};
</script>

<style scoped="scoped" lang="scss">
	.classbox {
		z-index: 999;
	}

	/deep/ .ant-spin-container {
		height: 100%;
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

		// 		.btnlist {
		// 			text-align: right;
		// 			position: absolute;
		// 			bottom: 35px;
		// 			right: 35px;
		// 			z-index: 999;
		//
		// 			a {
		// 				height: 56px;
		// 				width: 56px;
		// 				display: inline-block;
		// 				text-align: center;
		// 				line-height: 56px;
		// 				background: no-repeat center center;
		// 				background-size: cover;
		// 				font-family: 'hxfont';
		// 				font-size: 18px;
		//
		// 				&.signIn {
		// 					background-image: url(../assets/img/theme1/btn1.png);
		// 					color: #6699cc;
		// 				}
		//
		// 				&.offClass {
		// 					background-image: url(../assets/img/theme1/btn2.png);
		// 					color: #fff;
		// 					margin-left: 10px;
		// 				}
		// 			}
		// 		}
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

		// 		.btnlist {
		// 			text-align: right;
		// 			text-align: right;
		// 			position: absolute;
		// 			bottom: 35px;
		// 			right: 35px;
		// 			z-index: 999;
		//
		// 			a {
		// 				width: 100px;
		// 				height: 34px;
		// 				display: inline-block;
		// 				text-align: center;
		// 				line-height: 34px;
		// 				background: no-repeat center center;
		// 				background-size: cover;
		// 				font-size: 18px;
		//
		// 				&.signIn {
		// 					background-image: url(../assets/img/theme2/btn1.png);
		// 					color: #6699cc;
		// 				}
		//
		// 				&.offClass {
		// 					background-image: url(../assets/img/theme2/btn2.png);
		// 					color: #fff;
		// 					margin-left: 10px;
		// 				}
		// 			}
		// 		}
	}

	.theme3 .bg {
		background: none;

		.classbox {
			position: absolute;
			top: 0.7rem;
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
						transform: scale(0.8, 0.8) translateX(-60%);
					}
				}
			}
		}

		// 		.btnlist {
		// 			text-align: right;
		//
		// 			a {
		// 				width: 100px;
		// 				height: 41px;
		// 				display: inline-block;
		// 				text-align: center;
		// 				line-height: 38px;
		// 				font-size: 18px;
		// 				color: #fff;
		// 				background: rgba($color: #07f8ff, $alpha: 0.3);
		// 				border: 1px solid #07f8ff;
		// 				border-radius: 5px;
		//
		// 				&.offClass {
		// 					margin-left: 10px;
		// 				}
		// 			}
		// 		}
	}

	.theme4 .bg {
		.classbox {
			width: 1250px;
			background: #fff;
			padding: 11px;
			position: relative;
			border: 2px solid #1e569e;
			transform: translate(-50%, 0);
			top: 160px;
			left: 50%;
			position: absolute;
			bottom: 120px;

			@media screen and (max-width: 1440px) {
				width: auto;
				transform: translate(0, 0);
				left: 165px;
				right: 165px;
				bottom: 100px;
			}

			@media screen and (max-width: 1360px) {
				top: 140px;
				padding: 8px;
			}

			&:before {
				display: block;
				content: '';
				height: 91px;
				width: 549px;
				background: url(../assets/img/theme4/bg.png);
				background-size: cover;
				position: absolute;
				top: -5px;
				left: 50%;
				transform: translateX(-50%);
				z-index: 1;

				@media screen and (max-width: 1360px) {
					width: 450px;
					height: 75px;
				}
			}

			&>div {
				border: 2px solid #df8487;
				background: url(../assets/img/theme4/bg2.png);
				padding: 95px 0 45px;
				overflow: auto;
				height: 100%;

				@media screen and (max-width: 1360px) {
					padding: 75px 0 25px;
				}

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

						@media screen and (max-width: 1360px) {
							width: 180px;
							font-size: 36px;
						}

						&:nth-child(2) {
							margin: 0 122px;

							@media screen and (max-width: 1360px) {
								margin: 0 90px;
							}
						}

						&:nth-child(4),
						&:nth-child(5) {
							margin: 0 72px 50px;

							@media screen and (max-width: 1360px) {
								margin: -20px 50px 0;
							}
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

							@media screen and (max-width: 1360px) {
								height: 160px;
								width: 160px;
							}
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

		// 		.btnlist {
		// 			position: fixed;
		// 			bottom: 15px;
		// 			right: 35px;
		// 			z-index: 999;
		//
		// 			.offClass,
		// 			.signIn {
		// 				width: 116px;
		// 				height: 85px;
		// 				display: inline-block;
		// 				text-align: center;
		// 				line-height: 85px;
		// 				background: url(../assets/img/theme4/btn.png);
		// 				background-size: cover;
		// 				color: #2b5fa3;
		// 				font-size: 30px;
		// 				@media screen and (max-width: 1360px) {
		// 					width: 96px;
		// 					height: 70px;
		// 					line-height: 70px;
		// 					font-size: 24px;
		// 				}
		//
		// 				&.offClass {
		// 					margin-left: 30px;
		// 					@media screen and (max-width: 1360px) {
		// 						margin-left: 20px;
		// 					}
		// 				}
		// 			}
		//
		// 		}
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
