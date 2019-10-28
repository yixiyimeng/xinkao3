<template>
	<div>
		<div class="modbox">
			<div class="icon">
				<img src="../assets/img/menu1.png" alt="" />
				<span>字母A</span>
			</div>
			<span class="line"></span>
			<a-select class="select flex-1" size="large">
				<a-icon type="caret-down" slot="suffixIcon" />
				<a-select-option value="B">B</a-select-option>
				<a-select-option value="C">C</a-select-option>
				<a-select-option value="D">D</a-select-option>
				<a-select-option value="F">F</a-select-option>
			</a-select>
		</div>
		<div class="flex flex-align-center" style="width: 3.6rem; margin: 10px auto 0;">
			<label class="mr10">正确答案</label>
			<a-input placeholder="请输入正确答案" v-model="trueAnswer" type="password" class="flex-1" />
		</div>
		<div class="btnbar">
			<a href="javascript:;" class="startClass" @click="gotopage">开始答题</a>
			
			<count-down ref="countdown"></count-down>
		</div>
	</div>
</template>

<script>
	import CountDown from '@/page/mainPage/components/CountDown';
	export default {
		data() {
			return {
				isCountdown: false,
				type: 0,
				answer: '',
				settime: '',
				iscountDown: false,
				showcountDown: false,
				countDownTime:0
			};
		},
		components:{
			CountDown
		},
		mounted() {},
		methods: {
			// gotopage() {
			// 	this.$router.push({
			// 		path: 'answer',
			// 		query: {
			// 			settime: this.settime
			// 		}
			// 	});
			// },
			checkcountDown() {
				if (this.isAnswering) {
					return false;
				}
				this.countDownTime == 0;
				if (this.iscountDown) {
					this.iscountDown = false;
					this.showcountDown = false;
					if (this.timer) {
						clearInterval(this.timer);
					}
				} else {
					this.iscountDown = true;
					this.showcountDown = true;
				}
			},
			checkshowcountDown() {
				if (this.isAnswering) {
					return false;
				}
				this.showcountDown = !this.showcountDown;
			},
		}
	};
</script>

<style scoped="scoped" lang="scss">
	.modbox {
		color: #fff;
		text-align: center;
		padding-top: 50px;
		margin-bottom:20px;

		.line {
			height: 70px;
			width: 1px;
			background: #3f9be1;
			display: inline-block;
			vertical-align: middle;
			margin: 0 10px;
		}
	}

	.icon {
		font-size: 30px;
		color: #3f9be1;
		text-align: center;
		display: inline-block;
		vertical-align: middle;

		img {
			vertical-align: middle;
			margin-right: 10px;
		}

		span {
			vertical-align: middle;
		}
	}

	.select {
		width: 120px;
		display: inline-block;
		vertical-align: middle;
	}

	.btnbar {
		position: relative;
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

	.timecheckbox {
		width: 100px;
		height: 40px;
		background: url(../assets/img/off.png) no-repeat center center;
		cursor: pointer;
		display: inline-block;
		vertical-align: middle;

		&.active {
			background-image: url(../assets/img/on.png);
		}
	}

	.theme2 .bg .timecheckboxbar span {
		color: #fff;

	}

	.theme3 {
		.startClass {
			width: 361px;
			height: 41px;
			background: url(../assets/img/theme3/endBtn.png) no-repeat center center;
			border-radius: 0;
		}
	}
</style>
