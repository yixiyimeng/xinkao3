<template>
	<div class="bg">
		<div class="modbox">
			<div v-if="type == 0">
				<div class="num centerbox">41</div>
			</div>
			<div v-if="type == 1" class="countdown">
				<div class="num leftcenter">41</div>
				<div class="time centerbox">
					{{houerAndMin}}
					<i>{{s}}</i>
				</div>
			</div>
			<a href="javascript:;" class="endAnswer" @click="endAnswer">停止答题</a>
		</div>
	</div>
</template>

<script>
	function fixedZero(val) {
		return val * 1 < 10 ? `0${val}` : val;
	}
	export default {
		components: {},
		data() {
			return {
				type: 1,
				countDownTime: '',
				timer: null
			};
		},
		created() {
			this.type = this.$route.query.isCountdown ? 1 : 0;
			this.countDownTime = this.$route.query.countDownTime;
			if (this.$route.query.isCountdown && this.countDownTime && this.countDownTime > 0) {
				this.timeDown()
			}
		},
		computed: {
			houerAndMin() {
				if (!isNaN(this.countDownTime)) {
					const hours = 60 * 60;
					const minutes = 60;
					const h = fixedZero(Math.floor((this.countDownTime / hours) % 24));
					const m = fixedZero(Math.floor((this.countDownTime / minutes) % 60));
					return `${h}:${m}`;
				} else {
					return ''
				}
			},
			s() {
				if (!isNaN(this.countDownTime)) {
					return fixedZero(Math.floor(this.countDownTime % 60));
				} else {
					return ''
				}
			}

		},
		methods: {
			endAnswer() {
				this.$router.push({
					path: 'answerChart'
				});
			},
			/* 开始计时 */
			timeDown() {
				if (this.timer) {
					return false
				}
				if (this.countDownTime && this.countDownTime > 0) {
					this.timer = setInterval(() => {
						this.countDownTime--;
						if (this.countDownTime <= 0) {
							this.countDownTime = 0;
							clearInterval(this.timer);
							this.timer = null;
						}
					}, 1000);
				}
			},
		}
	};
</script>

<style scoped="scoped" lang="scss">
	.modbox {
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
</style>
