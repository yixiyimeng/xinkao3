<template>
	<div class="startAnswer" v-if="isShowAnswer">
		<a href="javascript:;" class="reback" @click="returnback" v-if="viewState != 1"></a>
		<div class="titleName" v-if="viewState != 0 && type != 2">{{ titleName }}</div>
		<div class="thememodbox setbox " v-if="viewState == 0">
			<div>
				<ul class="tablink clearfix">
					<li :class="{ active: type == 0 }" @click="type = 0"><a href="javascript:;">单题单选</a></li>
					<li :class="{ active: type == 1 }" @click="type = 1"><a href="javascript:;">单题多选</a></li>
					<li :class="{ active: type == 2 }" @click="type = 2"><a href="javascript:;">随堂检测</a></li>
				</ul>
				<div class="tabpanel">
					<single-choice v-if="type == 0" ref="singleChoice"></single-choice>
					<multi-choice v-if="type == 1" ref="multileChoice"></multi-choice>
					<class-testing v-if="type == 2" ref="classTest"></class-testing>
				</div>
				<div class="flex flex-align-center inputtxt" v-if="type != 2">
					<label class="mr10">正确答案</label>
					<a-input placeholder="请输入正确答案" v-model="trueAnswer" type="password" class="flex-1" />
				</div>
			</div>
		</div>
		<!-- 选择题的统计 -->
		<answer-chart ref="answerChart"></answer-chart>
		<!-- 随堂检测统计 -->
		<start-class-testing ref="startClassTesting"></start-class-testing>
		<div class="btnbar">
			<a href="javascript:;" class="startClass" @click="startAnswer" v-if="viewState == 0">开始答题</a>
			<a href="javascript:;" class="startClass" @click="stopAnswer" v-if="viewState == 1">{{ type == 2 ? '收取试卷' : '结束答题' }}</a>
		</div>
		<!-- 倒计时 -->
		<count-down v-if="isCountDown == 1" v-show="isAnswering" :setTimer="countDown * 1000" @stopCountDown="stopCountDown"
		 ref="countdown"></count-down>
	</div>
</template>

<script>
	import singleChoice from '@/page/mainPage/components/singleChoice';
	import multiChoice from '@/page/mainPage/components/multiChoice';
	import classTesting from '@/page/mainPage/components/classTesting';
	import answerChart from '@/page/mainPage/components/answerChart';
	import CountDown from '@/page/mainPage/components/CountDown';
	import startClassTesting from '@/page/mainPage/components/startClassTesting';
	import api from '@/page/mainPage/api';
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			singleChoice,
			multiChoice,
			classTesting,
			CountDown,
			answerChart,
			startClassTesting
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
				viewState: '0', //0未开始 1开始  2 统计
				titleName: '', //题目类型
				timer: null
			};
		},
		destroyed() {
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = null;
			}
		},
		computed: {
			...mapState(['countDown', 'isCountDown'])
		},
		watch: {
			isCountDown(newValue, oldValue) {
				if (newValue != oldValue) {
					if (newValue == 1 && this.isAnswering) {
						this.$nextTick(() => {
							this.timeDown();
						})
					}
				}
			}
		},
		methods: {
			showAnswer() {
				this.isShowAnswer = true;
				this.viewState = 0;
			},
			hideAnswer() {
				this.isShowAnswer = false;
			},
			stopAnswer() {
				const $me = this;
				if ($me.type == 2) {
					$me.$postAction(api.stopRandomDetection).then(da => {
						if (da && da.ret == 'success') {
							/*收取试卷 */
							$me.isAnswering = false;
							/* 清空倒计时 */
							if (this.isCountDown == 1) {
								this.$refs.countdown.clearCount();
							}
							$me.viewState = 2;
							$me.$emit('stopAnswer');
							$me.$refs.startClassTesting.setDetailslist(da.data)
							// $me.$refs.startClassTesting.setCountlist(da);
							// clearInterval($me.timer);
							// $me.timer = null;
						}
					});
				} else {
					$me.$postAction(api.stopAnswer).then(da => {
						if (da && da.ret == 'success') {
							/*结束答题 */
							if (this.isCountDown == 1) {
								this.$refs.countdown.clearCount();
							}
							$me.isAnswering = false;
							$me.viewState = 2;
							$me.$emit('stopAnswer');
							$me.$refs.answerChart.show({
								trueAnswer: $me.trueAnswer,
								questionType: $me.questionType
							});
						}
					});
				}
			},
			startAnswer() {
				const $me = this;
				if (this.type == 2) {
					var titleCode = $me.$refs.classTest.getTitleCode();
					// if (titleCode == '') {
					// 	$me.$message.error('请选择一套试卷下发');
					// 	return false
					// }
					if (titleCode) {
						this.startTest(titleCode);
					}
				} else {
					if (this.type == 0) {
						$me.questionType = $me.$refs.singleChoice.getQuestionType();
					} else if (this.type == 1) {
						$me.questionType = 4;
					}
					this.startChoice();
				}
			},
			/* 开始选择题 */
			startChoice() {
				const $me = this;
				let answerreg = '';
				$me.trueAnswer = $me.trueAnswer
					.toLocaleUpperCase()
					.split('')
					.sort()
					.join('');
				if ($me.questionType == 1) {
					answerreg = /^[A-D]{1}$/;
					$me.range = 'A-D';
					$me.titleName = '单题单选-字母题';
				} else if ($me.questionType == 2) {
					answerreg = /^[E-F]{1}$/;
					$me.titleName = '单题单选-判断题';
				} else if ($me.questionType == 3) {
					answerreg = /^[0-9]{1}$/;
					$me.range = '0-9';
					$me.titleName = '单题单选-数字题';
				} else if ($me.questionType == 4) {
					$me.range = this.$refs.multileChoice.getRange();
					var str = '/^(?!.*([' + $me.range + ']).*\\1)[' + $me.range + ']{2,6}$/';

					answerreg = eval(str);
					//answerreg=/^(?!.*([A-D]).*\1)[A-D]{2,4}$/;
					$me.titleName = '单题多选';
				}
				if ($me.trueAnswer && !answerreg.test($me.trueAnswer)) {
					$me.$message.error('请输入正确答案');
					$me.trueAnswer = '';
					return false;
				}

				var param = {
					questionType: $me.questionType,
					isImpromptu: $me.isImpromptu,
					trueAnswer: $me.trueAnswer
				};
				if ($me.questionType != 2) {
					param.range = $me.range;
				}
				$me.$postAction(api.startSingleAnswer, param).then(da => {
					if (da && da.ret == 'success') {
						/* 开始答题 */
						/* 清空倒计时 */
						/* 开始倒计时 */
						if ($me.isCountDown == 1) {
							$me.timeDown();
						}
						$me.isAnswering = true;
						$me.viewState = 1;
						$me.$emit('startAnswer',$me.questionType, 1);
						$me.$nextTick(() => {
							setTimeout(() => {
								$me.saveImgFullScreen();
							}, 500);
						});
					}
				});
			},
			/* 开始随堂测验 */
			startTest(titleCode) {
				const $me = this;

				$me.$postAction(api.startRandomDetection + titleCode).then(da => {
					if (da && da.ret == 'success') {
						$me.isAnswering = true;
						$me.viewState = 1;
						$me.$emit('startAnswer',5, 0);
						$me.$refs.startClassTesting.show();
						$me.answerPercent();
						/* 开始倒计时 */
						if ($me.isCountDown == 1) {
							$me.timeDown();
						}
					}
				});
			},
			/* 更新随堂检测进度 */
			answerPercent() {
				const $me = this;
				$me.$postAction(api.answerPercent).then(da => {
					if (da && da.ret == 'success') {
						$me.$refs.startClassTesting.setList(da.data);
					}
				});
			},
			returnback() {
				if (this.viewState == 2) {
					this.viewState = 0;
					this.trueAnswer = '';
					this.$refs.answerChart.hide();
					this.$refs.startClassTesting.hide();
					this.$emit('returnback', true);
				} else {
					this.hideAnswer();
					this.$emit('returnback');
				}
			},
			/* 开始计时 */
			timeDown() {
				this.$nextTick(() => {
					if (this.$refs.countdown) {
						this.$refs.countdown.startCount();
					}
				})

			},
			stopCountDown() {
				/* 倒计时结束事件 */
				this.stopAnswer();
			},
			saveImgFullScreen() {
				/* 全屏截图 */
				const $me = this;
				$me.$postAction(api.saveQuestionImgAndSend).then(da => {
					if (da && da.ret == 'success') {} else {
						$me.$toast.center(da.message);
					}
				});
			},
			resumeCountDown(type) {
				/* 暂停或者重启倒计时 */
				if (this.isShowAnswer) {
					if (this.isCountDown == 1 && this.isAnswering) {
						if (type == 1) {
							this.$refs.countdown.resume();
						} else {
							this.$refs.countdown.clearCount();
						}
					}
				}
			}
		}
	};
</script>

<style scoped="scoped" lang="scss">
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

		.inputtxt {
			width: 360px;
			margin: 0 auto;
		}

		.startClass {
			display: block;
			margin: 0 auto;
			width: 360px;
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
						color: #07f8ff;
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
</style>
