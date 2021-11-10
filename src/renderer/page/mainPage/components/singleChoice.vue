<template>
	<div>
		<ul class="clearfix">
			<li :class="{ active: questionType == 1 }" @click="questionType = 1">
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
			<li :class="{ active: questionType == 2 }" @click="questionType = 2">
				<a href="javascript:;">
					<i class="icon3"></i>
					<span>判断</span>
				</a>
			</li>
		</ul>
		<div class="range" v-if="questionType == 1">
			<span>字母A</span>
			<span class="line"></span>
			<a-select class="select flex-1" size="large" v-model="range">
				<a-icon type="caret-down" slot="suffixIcon" />
				<a-select-option value="B">B</a-select-option>
				<a-select-option value="C">C</a-select-option>
				<a-select-option value="D">D</a-select-option>
				<a-select-option value="E">E</a-select-option>
				<a-select-option value="F">F</a-select-option>
				<a-select-option value="G">G</a-select-option>
			</a-select>
		</div>
		<div class="c-red">{{ questionType == 1 ? '请输入A-' + range + '的一位字母' : tiplist[questionType - 1] }}</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			questionType: 1,
			settime: 2,
			tip: '',
			range: 'D',
			tiplist: ['请输入A-D的一位字母', '请输入E(正确)，F(错误)一位字母', '请输入0-9的一位数字']
		};
	},
	mounted() {},
	methods: {
		getQuestionType() {
			return this.questionType;
		},
		getQuestionRange() {
			return this.range;
		}
	}
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
.theme2 .bg li,
.theme4 .bg li {
	a {
		font-size: 30px;
		color: #fff;
		text-align: center;
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
		background: rgba(
			$color: (
				#fff
			),
			$alpha: 0.5
		);
		color: #3f9be1;
	}
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
}

.theme4 .bg {
	li {
		padding: 0 5px;

		&.active a,
		&:hover a {
			background: #2459a0;
			color: #fff;

			i {
				&.icon1 {
					background-image: url(../assets/img/theme4/menuicon1.png);
				}

				&.icon2 {
					background-image: url(../assets/img/theme4/menuicon2.png);
				}

				&.icon3 {
					background-image: url(../assets/img/theme4/menuicon3.png);
				}
			}
		}

		a {
			text-align: center;
			margin: 0 auto;
			padding: 30px 0;
			color: #333;
			font-size: 42px;
			display: block;
			height: auto;

			@media screen and (max-width: 1360px) {
				padding: 16px 0;
			}

			i {
				display: inline-block;
				background: no-repeat center center;
				background-size: cover;
				height: 164px;
				width: 164px;

				@media screen and (max-width: 1360px) {
					height: 140px;
					width: 140px;
				}

				&.icon1 {
					background-image: url(../assets/img/theme4/smenuicon1.png);
				}

				&.icon2 {
					background-image: url(../assets/img/theme4/smenuicon2.png);
				}

				&.icon3 {
					background-image: url(../assets/img/theme4/smenuicon3.png);
				}
			}
		}
	}
}

.c-red {
	color: #f00;
	width: 377px;
	margin: 20px auto 10px;
	font-size: 18px;
}
.range {
	width: 377px;
	display: flex;
	margin: 10px auto 0;
	align-items: center;
	font-size: 20px;
	color: #3f9be1;
	.line {
		margin: 0 10px;
		height: 50px;
		width: 1px;
		background: #3f9be1;
		display: inline-block;
		vertical-align: middle;
	}
	.select {
		margin-right: 10px;
	}
}
</style>
