<template>
	<div class="bg">
		<!-- <setDanmu></setDanmu> -->
		<!-- <timeswiper class="countDownbox"></timeswiper> -->
		<div class="loginbox">
			<div>
				<a href="javascript:;" class="logo"></a>
				<div class="input-group">
					<a-form @submit="login" autocomplete="off">
						<div class="input-row flex flex-align-center">
							<i class="user icon"></i>
							<input type="text" class="flex-1" v-model.trim="username" placeholder="请输入用户名" />
							<a-dropdown :trigger="['click']" placement="bottomRight" class="dropdown" :overlayStyle="{'width': '200px'}">
								<span>
									<a-icon type="caret-down" /></span>
								<a-menu slot="overlay">
									<a-menu-item key="0" @click="setUserName(item)" v-for="(item,index) in loginInfolist" :key="index">{{item.username}}</a-menu-item>

								</a-menu>
							</a-dropdown>
						</div>
						<div class="input-row flex flex-align-center">
							<i class="pwd icon"></i>
							<input type="password" class="flex-1" placeholder="请输入密码" v-model.trim="password" />
						</div>
						<div class="mt10">
							<a-checkbox v-model="isRemeber">
								记住密码
							</a-checkbox>
						</div>
						<a-button type="primary" html-type="submit" class="loginBtn">立即登录</a-button>
					</a-form>
				</div>

			</div>
		</div>
		<!-- <div style="position: absolute; top: 0; left: 0; height: 200px; width: 200px;">
			<img :src="imgUrl" alt="">
		</div> -->
	</div>
</template>

<script>
	import {
		htmlescpe,
		urlPath
	} from '@/page/mainPage/utils/base';
	import api from '@/page/mainPage/api';
	import setDanmu from '@/page/mainPage/components/setDanmu'
	import timeswiper from '@/page/mainPage/components/timeswiper'
	export default {
		data() {
			return {
				username: '',
				password: '',
				loginInfolist: [],
				isRemeber: true,
				imgUrl: ''
			};
		},
		components: {
			setDanmu,
			timeswiper
		},
		created() {
			const _this = this;
			try {
				var userinfo = JSON.parse(localStorage.getItem('loginStore'));
				if (userinfo && userinfo.length > 0) {
					this.username = userinfo[0].username;
					this.password = userinfo[0].password;
					this.loginInfolist = userinfo;
				}
			} catch (e) {
				//TODO handle the exception
			}
		},
		mounted() {

			document.body.addEventListener('keyup', this.keyEnter, false)
		},
		beforeDestroy() {
			document.body.removeEventListener('keyup', this.keyEnter, false)
		},
		methods: {
			login(e) {
				e.preventDefault();
				this.sendLoginInfo();
			},
			sendLoginInfo() {
				const $me = this;
				if (this.username && this.password) {
					if (htmlescpe.test(this.username)) {
						this.$toast.center('账户中包含特殊字符!');
						return;
					}
					if (htmlescpe.test(this.password)) {
						this.$toast.center('密码中包含特殊字符!');
						return;
					}
					var param = {
						username: this.username,
						password: this.password,
					};


					this.$loading('正在登陆...');
					this.$postAction(api.Login, JSON.stringify(param))
						.then(da => {
							if (da && da.ret == 'success') {
								if ($me.isRemeber) {
									var useritem = {
										username: $me.username,
										password: $me.password
									}
									if ($me.loginInfolist && $me.loginInfolist.length > 0) {
										const index = $me.loginInfolist.findIndex(item => item.username == $me.username);
										if (index > -1) {
											$me.loginInfolist.splice(index,1)
											$me.loginInfolist.unshift(useritem)
										} else {
											$me.loginInfolist.unshift(useritem)
											if ($me.loginInfolist.length > 10) {
												$me.loginInfolist.pop();
											}

										}
									} else {
										$me.loginInfolist = [useritem]
									}

									localStorage.setItem(
										'loginStore',
										JSON.stringify($me.loginInfolist)
									);
								} else {
									localStorage.removeItem('loginStore')
								}
								$me.sendInfo = {
									schoolCode: da.data.schoolCode,
									schoolName: da.data.schoolName,
									teacAssistantCode: da.data.userId,
									teacAssistantName: da.data.name,
									teacherCode: da.data.userId,
									teacherName: da.data.name
								};
								sessionStorage.setItem(
									'loginSendInfo',
									JSON.stringify($me.sendInfo)
								);
								// $me.getAuthentication();
								$me.$router.push({
									//页面跳转
									path: 'class',
									query: {
										sendInfo: JSON.stringify($me.sendInfo)
									}
								});

							} else {
								this.$toast.center(da.message||'发生错误了');
							}
						})
						.finally(() => {
							$me.$loading.close();
						})
				} else {
					this.$toast.center('请输入正确的用户名和密码');
				}
			},
			keyEnter(e) {
				const $me = this;
				if (window.event) {
					e = window.event
				}
				let code = e.charCode || e.keyCode;
				if (code == 13) {
					$me.sendInfo();

				}
			},
			setUserName(userInfo) {
				this.username = userInfo.username;
				this.password = userInfo.password
			},

			saveImgFullScreen() {
				var param = {
					x: 0,
					y: 0,
					width: 100,
					height: 100
				};
				this.$postAction(api.saveImg, param).then(da => {
					// console.log(da.data)
					this.imgUrl = 'data:image/jpg;base64,' + da.data
				})
			}
		}
	};
</script>

<style scoped="scoped" lang="scss">
	.bg {
		position: absolute;
		height: 100%;
		width: 100%;
		left: 0;
		right: 0;

		.loginbox {
			background: rgba(255, 255, 255, 0.7);
			position: absolute;
			left: 50%;
			top: 50%;
			padding: 20px 0 50px;
			transform: translate(-50%, -50%);

			.logo {
				display: block;
				background: url(../assets/img/logo.png) no-repeat center center;
				height: 36px;
			}

			.input-group {
				margin-left: auto;
				margin-right: auto;
				margin-top: 20px;

				.input-row {
					line-height: 38px;
					overflow: hidden;
					border: 1px solid #ccc;
					position: relative;

					i.icon {
						display: block;
						width: 22px;
						height: 40px;
						line-height: 40px;
						background: no-repeat center center;
						background-size: 100% auto;
						margin: 0 10px 0 20px;

						&.user {
							background-image: url(../assets/img/user.png);
						}

						&.pwd {
							background-image: url(../assets/img/pwd.png);
						}
					}

					input[type='text'],
					input[type='password'] {
						background: none;
						border: none;
						margin-right: 20px;
						color: #333;
					}

					input[type='text']::placeholder,
					input[type='password']::placeholder {
						color: #ccc;
					}
				}
			}

			.input-row+.input-row {
				margin-top: 15px;
			}

			.loginBtn {
				height: 40px;
				display: block;
				background: #3f9be1;
				text-align: center;
				color: #fff;
				line-height: 40px;
				margin-top: 20px;
				width: 100%;
				border: none;
			}
		}
	}

	.theme1 .bg {
		background: no-repeat top center;
		background-size: 100% auto;
		background-image: url(../assets/img/theme1/yun.png);

		.loginbox {
			min-height: 280px;
			width: 420px;
			max-width: 600px;
			border-radius: 20px;

			.input-group {
				width: 90%;

				.input-row {
					border-radius: 5px;
					background: rgba(255, 255, 255, 0.7);
					font-size: 12px;
				}
			}

			.loginBtn {
				border-radius: 50px;
				font-size: 16px;
			}
		}
	}

	.theme2 .bg {
		background: no-repeat center center;
		background-image: url(../assets/img/theme2/loginbg.png);
		background-size: 920px auto;

		.loginbox {
			width: 281px;
			border-radius: 5px;
			margin-left: 87px;
			transform: translateY(-50%);
			margin-top: -10px;
			padding-top: 24px;

			.input-group {
				width: 85%;

				.input-row {
					border-radius: 5px;
					background: #fff;
				}
			}

			.loginBtn {
				border-radius: 8px;
				font-size: 16px;
			}
		}
	}

	.theme3 .bg .loginbox {
		height: 244px;
		width: 381px;
		background: url(../assets/img/theme3/loginbg.png);
		transform: translateY(-50%);
		padding: 15px 0 50px;

		.logo {
			background-image: url(../assets/img/theme3/logo.png);
		}

		.input-group {
			width: 240px;
			line-height: 40px;
			margin-top: 15px;

			.input-row {
				line-height: 40px;
				overflow: hidden;
				border: 1px solid #07f8ff;
				border-radius: 5px;

				input[type="text"],
				input[type="password"] {
					color: #fff;
				}

				i {

					&.user {
						background-image: url(../assets/img/theme3/user.png);
					}

					&.pwd {
						background-image: url(../assets/img/theme3/pwd.png);
					}
				}
			}
		}

		.loginBtn {
			background: url(../assets/img/theme3/loginBtn.png);
			color: #060606;
			font-size: 14px;
		}
	}

	.theme4 .bg .loginbox {
		width: 780px;
		background: #fff;
		padding: 18px;
		position: relative;
		border: 2px solid #1e569e;

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
			padding: 70px 165px 45px;
		}

		.input-group {
			.input-row {
				background: #fff;
				border: 1px solid #333;
				border-radius: 5px;

				input[type="text"],
				input[type="password"] {
					line-height: 67px;
					font-size: 20px;
				}

				i.icon {
					width: 33px;
					margin-right: 25px;
				}
			}

			.input-row+.input-row {
				margin-top: 25px;
			}

		}



		.loginBtn {
			background: #ffd941;
			color: #fff;
			font-size: 14px;
			font-size: 24px;
			color: #333;
			line-height: 65px;
			height: 65px;
			box-shadow: 0 2px 5px rgba(0, 0, 0, .6);
			border-radius: 5px;
		}

		.dropdown {
			line-height: 60px;

			.anticon {
				font-size: 20px;
				vertical-align: -.3em;
			}
		}
	}

	.countDownbox {
		position: absolute;
		left: 400px;
		// bottom: 50px;
		width: 379px;
		z-index: 9999;
		top: 100px;
	}
</style>
