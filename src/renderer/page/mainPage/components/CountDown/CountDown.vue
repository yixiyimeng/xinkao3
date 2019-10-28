<template>
	<div class="timecheckboxbar">
		<span @click="checkshowcountDown" v-if="isCountdown">{{ countDownTime | format}}</span>
		<div class="timecheckbox" :class="{ active: isCountdown }" @click="checkcountDown"></div>
		<timeswiper @countDown="countDown" @cancelcountDown="cancelcountDown" v-if="isCountdown && showcountDown" class="countDownbox"></timeswiper>
	</div>
</template>

<script>
	import timeswiper from '@/page/mainPage/components/timeswiper';

	function fixedZero(val) {
		return val * 1 < 10 ? `0${val}` : val;
	}
	export default {
		name: 'CountDown',
		components: {
			timeswiper
		},
		data() {
			return {
				isCountdown: false,//是否倒计时
				showcountDown: false,//是否显示设置倒计时
				countDownTime: ''
			};
		},
		methods: {
			/* 设置倒计时 */
			countDown(time) {
				this.countDownTime = time;
				this.showcountDown = false;
			},
			//* 取消设置倒计时 */
			cancelcountDown() {
				this.showcountDown = false;
			},
			// 是否倒计时
			checkcountDown() {
				this.isCountdown = this.showcountDown = !this.isCountdown;
			},
			// 是否显示设置倒计时
			checkshowcountDown() {
				this.showcountDown = !this.showcountDown;
			},
			getTime(){
				return {
					isCountdown:this.isCountdown,countDownTime:this.countDownTime
				}
			}
		},
		filters: {
			format(time) {
				const hours = 60 * 60;
				const minutes = 60;

				const h = Math.floor((time / hours) % 24);
				const m = Math.floor((time / minutes) % 60);
				const s = Math.floor(time % 60);
				return `${fixedZero(h)}:${fixedZero(m)}:${fixedZero(s)}`;
			}
		},
		created() {
			//this.initTime();
			//this.tick();
		},

	};
</script>

<style scoped lang="scss">
	.timecheckboxbar {
		position: fixed;
		right: 25px;
		bottom: 100px;

		span {
			line-height: 40px;
			vertical-align: middle;
			font-size: 20px;
		}

		.timecheckbox {
			width: 100px;
			height: 40px;
			background: url(../../assets/img/off.png) no-repeat center center;
			cursor: pointer;
			display: inline-block;
			vertical-align: middle;

			&.active {
				background-image: url(../../assets/img/on.png);
			}
		}

		.countDownbox {
			position: absolute;
			right: 0;
			bottom: 50px;
			width: 270px;
			z-index: 9999;
		}
	}
</style>
