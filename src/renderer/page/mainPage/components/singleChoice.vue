<template>
	<div>
		<ul class="clearfix">
			<li :class="{ active: questionType == 1}" @click="questionType = 1">
				<a href="javascript:;">
					<i class="icon1"></i>
					<span>字母</span>
				</a>
			</li>
			<li :class="{ active: questionType == 3 }" @click="questionType = 3">
				<a href="javascript:;">
					<i class="icon2"></i>
					<span>数字</span>
				</a>
			</li>
			<li :class="{ active: questionType == 2}" @click="questionType = 2">
				<a href="javascript:;">
					<i class="icon3"></i>
					<span>判断</span>
				</a>
			</li>
		</ul>
		<div class="flex flex-align-center" style="width: 3.6rem; margin: 0 auto;">
			<label class="mr10">正确答案</label>
			<a-input placeholder="请输入正确答案" v-model="trueAnswer" type="password" class="flex-1" />
		</div>
		<div class="btnbar">
			<a href="javascript:;" class="startClass" @click="startAnswer" v-if="!isAnswering">开始答题</a>
			<a href="javascript:;" class="startClass" @click="stopAnswer" v-if="isAnswering">结束答题</a>
			<count-down ref="countdown"></count-down>
		</div>
	</div>
</template>

<script>
	import CountDown from '@/page/mainPage/components/CountDown';
	import api from '@/page/mainPage/api';
	export default {
		components: {
			CountDown
		},
		data() {
			return {
				questionType: 1,
				settime: 2,
				trueAnswer: '',
				isImpromptu: true,
				range: 'A-D',
				isAnswering: false
			};
		},
		mounted() {},
		methods: {
			gotopage() {
				this.$router.push({
					path: 'answer',
					query: {
						settime: this.settime
					}
				});
			},
			stopAnswer() {
				const $me = this;
				$me.$postAction(api.stopAnswer).then(da => {
					if (da && da.ret == 'success') {
						/*结束答题 */
						$me.isAnswering = false;
						$me.$emit('stopAnswer')
						$me.$router.push({
							path: '/answerChart',
							query: {
								trueAnswer: $me.trueAnswer,
								questionType:$me.questionType
							}
						});
					}
				})
			},
			startAnswer() {
				const $me = this;
				let answerreg = '';
				$me.trueAnswer=$me.trueAnswer.toLocaleUpperCase()
				if ($me.questionType == 1) {
					answerreg = /^[A-D]{1}$/;
				} else if ($me.questionType == 2) {
					answerreg = /^[E-F]{1}$/;
					
				} else if ($me.questionType == 3) {
					// answerreg = /^(?!.*([A-F]).*\1)[A-F]{2,4}$/;
					answerreg =  /^[1-9]\d*$/;
				}
				if ($me.trueAnswer && !answerreg.test($me.trueAnswer)) {
					$me.$message.error('请输入正确答案');
					return false;
				}
				if (this.$refs.countdown) {
					var {
						isCountdown,
						countDownTime
					} = this.$refs.countdown.getTime();

					var param = {
						questionType: $me.questionType,
						isImpromptu: $me.isImpromptu,
						trueAnswer: $me.trueAnswer
					};
					if($me.questionType==1){
						param.range=$me.range
					}
					$me.$postAction(api.startSingleAnswer, param).then(da => {
						if (da && da.ret == 'success') {
							/* 开始答题 */
							$me.isAnswering = true;
							$me.$emit('startAnswer')
						}
					})
				}
			},
		},

	};
</script>

<style scoped="scoped" lang="scss">
	ul {
		margin: 0 20px;
	}

	li {
		float: left;
		width: 33.33%;
		padding: 40px 5px 25px;

		a {
			display: block;

			i {
				vertical-align: middle;
				margin-right: 10px;
				display: block;
				height: 120px;
				width: 120px;
			}
		}
	}

	.theme1 .bg li,
	.theme2 .bg li {
		a {
			font-size: 30px;
			color: #fff;
			text-align: center;
			height: 1.85rem;
			max-height: 240px;
			border-radius: 10px;
			display: -webkit-box;
			display: -webkit-flex;
			display: -ms-flexbox;
			display: flex;
			-webkit-box-align: center;
			-webkit-align-items: center;
			-ms-flex-align: center;
			align-items: center;
			-webkit-box-pack: center;
			-webkit-justify-content: center;
			-ms-flex-pack: center;
			justify-content: center;

			i {
				display: inline-block;
				vertical-align: middle;

				&.icon1 {
					background-image: url(../assets/img/menu1.png);
				}

				&.icon2 {
					background-image: url(../assets/img/menu2.png);
				}

				&.icon3 {
					background-image: url(../assets/img/menu3.png);
				}
			}

			span {
				vertical-align: middle;
			}
		}

		&.active a,
		&:hover a {
			background: rgba($color: (#fff),
				$alpha: 0.5);
			color: #3f9be1;
		}
	}



	.startClass {
		display: block;
		margin: 40px auto;
		width: 3.6rem;
		height: 40px;
		border-radius: 50px;
		background: #3f9be1;
		font-size: 24px;
		line-height: 40px;
		color: #fff;
		text-align: center;
	}



	.theme2 .bg .timecheckboxbar span {
		color: #fff;
	}

	.theme3 .bg {
		li {

			&.active a,
			&:hover a {
				background-image: url(../assets/img/theme3/selmenubg2.png);
			}

			a {
				width: 194px;
				height: 191px;
				background: url(../assets/img/theme3/menubg2.png) 16px center no-repeat;
				text-align: center;
				margin: 0 auto;
				padding-top: 65px;

				i {
					display: block;
					margin: 0 auto;
					background: no-repeat center center;
					height: 52px;
					width: 52px;

					&.icon1 {
						background-image: url(../assets/img/theme3/menuicon1.png);
					}

					&.icon2 {
						background-image: url(../assets/img/theme3/menuicon2.png);
					}

					&.icon3 {
						background-image: url(../assets/img/theme3/menuicon3.png);
					}
				}

				span {
					font-size: 14px;
					color: #fff;
				}
			}
		}

		.startClass {
			width: 361px;
			height: 41px;
			background: url(../assets/img/theme3/endBtn.png) no-repeat center center;
			border-radius: 0;
		}
	}
	.theme4 .bg{
		li {
		
			&.active a,
			&:hover a {
				background-image: url(../assets/img/theme3/selmenubg2.png);
			}
		
			a {
				width: 194px;
				height: 191px;
				background: url(../assets/img/theme3/menubg2.png) 16px center no-repeat;
				text-align: center;
				margin: 0 auto;
				padding-top: 65px;
		
				i {
					display: block;
					margin: 0 auto;
					background: no-repeat center center;
					height: 52px;
					width: 52px;
		
					&.icon1 {
						background-image: url(../assets/img/menu1.png);
					}
		
					&.icon2 {
						background-image: url(../assets/img/menu2.png);
					}
		
					&.icon3 {
						background-image: url(../assets/img/menu3.png);
					}
				}
		
				span {
					font-size: 14px;
					color: #fff;
				}
			}
		}
	}
</style>
