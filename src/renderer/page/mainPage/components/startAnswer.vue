<template>
	<div class="startAnswer" v-if="isShowAnswer">
		<a href="javascript:;" class="reback" @click="returnback"></a>
		<div class="thememodbox" v-if="!isAnswering">
			<div>
				<ul class="tablink clearfix">
					<li :class="{active:type==0}" @click="type=0"><a href="javascript:;">单题单选</a></li>
					<li :class="{active:type==1}" @click="type=1"><a href="javascript:;">单题多选</a></li>
					<li :class="{active:type==2}" @click="type=2"><a href="javascript:;">随堂检测</a></li>
				</ul>
				<div class="tabpanel">
					<single-choice v-if="type==0" ref="singleChoice"></single-choice>
					<multi-choice v-if="type==1" ref="multileChoice"></multi-choice>
					<class-testing v-if="type==2"></class-testing>
				</div>
				<div class="flex flex-align-center" style="width: 360px; margin: 25px auto 0;" v-if="type!=2">
					<label class="mr10">正确答案</label>
					<a-input placeholder="请输入正确答案" v-model="trueAnswer" type="password" class="flex-1" />
				</div>
			</div>

		</div>
		<div class="btnbar">
			<a href="javascript:;" class="startClass" @click="startAnswer" v-if="!isAnswering">开始答题</a>
			<a href="javascript:;" class="startClass" @click="stopAnswer" v-if="isAnswering">结束答题</a>
			<count-down ref="countdown"></count-down>
		</div>
	</div>
</template>

<script>
	import singleChoice from '@/page/mainPage/components/singleChoice';
	import multiChoice from '@/page/mainPage/components/multiChoice';
	import classTesting from '@/page/mainPage/components/classTesting';
	import CountDown from '@/page/mainPage/components/CountDown';
	import api from '@/page/mainPage/api';
	export default {
		components: {
			singleChoice,
			multiChoice,
			classTesting,
			CountDown
		},
		data() {
			return {
				type: 0,
				isShowAnswer: false,
				isImpromptu: true,
				range: 'A-D',
				trueAnswer: '',
				questionType: '1',
				isAnswering: false, //是否开始答题
			};
		},
		methods: {
			showAnswer() {
				this.isShowAnswer = true
			},
			hideAnswer() {
				this.isShowAnswer = false
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
								questionType: $me.questionType
							}
						});
					}
				})
			},
			startAnswer() {
				const $me = this;
				let answerreg = '';
				if (this.type == 0) {
					$me.questionType = $me.$refs.singleChoice.getQuestionType()
				} else if (this.type == 1) {
					$me.questionType = 4
				}
				$me.trueAnswer = $me.trueAnswer.toLocaleUpperCase()
				if ($me.questionType == 1) {
					answerreg = /^[A-D]{1}$/;
					$me.range = 'A-D';
				} else if ($me.questionType == 2) {
					answerreg = /^[E-F]{1}$/;

				} else if ($me.questionType == 3) {
					answerreg = /^[1-9]\d*$/;
					$me.range = '0-9';
				} else {
					$me.range = this.$refs.multileChoice.getRange()
					answerreg = /^(?!.*([A-F]).*\1)[A-F]{2,4}$/
				}
				if (!$me.trueAnswer || !answerreg.test($me.trueAnswer)) {
					$me.$message.error('请输入正确答案');
					$me.trueAnswer = '';
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
					if ($me.questionType != 2) {
						param.range = $me.range
					}
					$me.$postAction(api.startSingleAnswer, param).then(da => {
						if (da && da.ret == 'success') {
							/* 开始答题 */
							$me.isAnswering = true;
							$me.$emit('startAnswer',true)
						}
					})
				}
			},
			returnback() {
				this.hideAnswer();
				this.$emit('returnback')
			}
		}
	};
</script>

<style scoped="scoped" lang="scss">
	@import '../assets/css/set.scss';

	.bg>div {
		position: absolute;
		top: 20%;
		left: 36px;
		right: 36px;
		bottom: 100px;
		z-index: 999;

		.tablink {
			border-bottom: 1px solid #fff;

			&>li {
				float: left;
				width: 33.33%;
				text-align: center;

				&.active a {
					border-bottom: 4px solid #fff;
				}

				a {
					display: inline-block;
					color: #fff;
					font-size: 18px;
					padding: 15px 5px;

				}
			}
		}

		.startClass {
			display: block;
			margin: 0 auto;
			width: 360PX;
			height: 40px;
			border-radius: 50px;
			background: #3f9be1;
			font-size: 24px;
			line-height: 40px;
			color: #fff;
			text-align: center;
		}


	}

	.theme1 .bg {
		background-image: url(../assets/img/theme1/anserbg.png);

	}

	.theme3 .bg {
		background: none;

		>div {
			.tablink {
				border-bottom: 1px solid #07f8ff;

				&>li {
					float: left;
					width: 33.33%;
					text-align: center;

					&.active a {
						border-bottom: 4px solid #07f8ff;
						color: #07f8ff
					}

					a {
						display: inline-block;
						color: #fff;
						font-size: 18px;
						padding: 15px 5px;

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

	}

	.theme4 .bg {
		>.startAnswer .thememodbox {
			width: 1227px;
			background: #fff;
			padding: 18px;
			border: 2px solid #1e569e;
			transform: translate(-50%, 0);
			top: 0;
			left: 50%;
			position: absolute;
			bottom: auto;

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
				padding-bottom: 25px;
			}

			.tablink {
				border-bottom: 1px solid #2459a0;
				padding-top: 95px;
				margin: 0 60px;

				&>li {
					float: left;
					width: 33.33%;
					text-align: center;

					&.active a {
						border-bottom: 4px solid #2459a0;
					}

					a {
						display: inline-block;
						color: #fff;
						font-size: 25px;
						color: #333;
						padding: 15px 5px;

					}
				}
			}

			.tabpanel {
				margin: 30px 40px 0;
			}
		}

		.btnbar {
			position: fixed;
			bottom: 40px;
			left: 50%;
			transform: translate(-50%, 0);
			width: 1227px;

			a {
				display: block;
				margin: 0 auto;
				width: 500px;
			}

			.startClass {
				background: #ffd941;
				color: #fff;
				font-size: 14px;
				font-size: 24px;
				color: #333;
				line-height: 56px;
				height: 56px;
				box-shadow: 0 2px 5px rgba(0, 0, 0, .6);
				border-radius: 5px;
			}
		}
	}
</style>
