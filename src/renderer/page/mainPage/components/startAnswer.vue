<template>
	<div class="startAnswer" v-if="isShowAnswer">
		<div>
			<ul class="tablink clearfix">
				<li :class="{active:type==0}" @click="type=0"><a href="javascript:;">单题单选</a></li>
				<li :class="{active:type==1}" @click="type=1"><a href="javascript:;">单题多选</a></li>
				<li :class="{active:type==2}" @click="type=2"><a href="javascript:;">随堂检测</a></li>
			</ul>
			<div class="tabpanel">
				<single-choice v-if="type==0" @startAnswer="startAnswer" @stopAnswer="stopAnswer"></single-choice>
				<multi-choice v-if="type==1" @startAnswer="startAnswer" @stopAnswer="stopAnswer"></multi-choice>
				<class-testing v-if="type==2" @startAnswer="startAnswer" @stopAnswer="stopAnswer"></class-testing>
			</div>
		</div>
	</div>
</template>

<script>
	import singleChoice from '@/page/mainPage/components/singleChoice';
	import multiChoice from '@/page/mainPage/components/multiChoice';
	import classTesting from '@/page/mainPage/components/classTesting';
	export default {
		components: {
			singleChoice,
			multiChoice,
			classTesting
		},
		data() {
			return {
				type: 0,
				isShowAnswer: false
			};
		},
		methods: {
			showAnswer() {
				this.isShowAnswer = true
			},
			hideAnswer() {
				this.isShowAnswer = false
			},
			startAnswer() {
				this.$emit('startAnswer')
			},
			stopAnswer() {
				this.$emit('stopAnswer')
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
		}

	}

	.theme4 .bg {
		>.startAnswer {
			width: 1227px;
			background: #fff;
			padding: 18px;
			position: relative;
			border: 2px solid #1e569e;
			transform: translate(-50%, -50%);
			top: 50%;
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
			}

			.tablink {
				border-bottom: 1px solid #2459a0;
				padding-top: 95px;
				margin:0 60px;

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
			.tabpanel{
				margin: 30px 40px 45px;
			}
		}
	}
</style>
