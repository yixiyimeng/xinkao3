<template>
	<div class="bg">
		<div class="title">投票统计</div>
		<a href="javascript:;" class="reback" @click="returnback"></a>
		<div class="setbox flex">
			<div class="voteInfo">
				<div class="flex"><label>投票主题:</label><span class="flex-1">{{voteInfo.title}}</span></div>
				<div class="flex"><label>投票对象:</label><div class="flex-1"><span v-for="(item,index) in voteInfo.obj" :key="index">{{item}}</span></div></div>
				<div class="flex"><label>投票描述:</label><span class="flex-1">{{voteInfo.describe}}</span></div>
			</div>
			<div class="flex-1">
				<v-chart :options="polar" autoresize class="chartbox"></v-chart>
				<a href="javascript:;" class="endAnswer" @click="stopVote">停止投票</a>
			</div>
		</div>
	</div>
</template>

<script>
	import ECharts from 'vue-echarts/components/ECharts';
	import 'echarts/lib/chart/bar';
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/polar'
	import 'echarts/lib/component/legend'
	import 'echarts/lib/component/title.js'
	import api from '@/page/mainPage/api';
	let theme = "theme1"
	export default {
		components: {
			'v-chart': ECharts
		},
		data() {
			return {
				ChartfontSize: 16,
				voteInfo:{},
				theme: 'theme1',
				polar: {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							// 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					legend: {
						show: true,
						left: 'right',
						itemWidth: 14,
						orient:'vertical',
						data: ['监控数量', '监控数量12','12监控数量']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					color: ['#c7615d', '#e0b088', '#176bab', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074',
						'#546570', '#c4ccd3'
					],
					xAxis: {
						type: 'category',
						boundaryGap: true,
						show: true,
						axisTick: {
							show: false
						},
						axisLabel: {
							fontSize: this.ChartfontSize,
							color: theme == 'theme1' ? '#3f9be1' : '#fff',
							margin: 8,
							interval: 0
						},
						axisLine: {
							lineStyle: {
								type: 'solid',
								color: theme == 'theme1' ? '#3f9be1' : '#fff',
								width: '5' //坐标线的宽度
							},
							symbol: ['none', 'arrow'],
							symbolSize: [16, 24],
							symbolOffset: [0, 10]
						},
						data: ['赞成', '反对', '弃权']
					},
					yAxis: {
						type: 'value',
						scale: true,
						name: '',
						axisLine: {
							show: false
						},
						splitNumber: 4,
						splitLine: {
							show: false
						},
						axisLabel: {
							fontSize: this.ChartfontSize,
							color: theme == 'theme1' ? '#3f9be1' : '#fff',
							margin: 12
						},
						axisLine: {
							lineStyle: {
								type: 'solid',
								color: theme == 'theme1' ? '#3f9be1' : '#fff',
								width: '5' //坐标线的宽度
							},
							symbol: ['none', 'arrow'],
							symbolSize: [16, 24],
							symbolOffset: [0, 10]
						},
						max: 1000,
						min: 0
					},
					series: [{
						name: '监控数量',
						type: 'bar',
						label: {
							normal: {
								show: true,
								position: 'top',
								textStyle: {
									color: theme == 'theme1' ? '#3f9be1' : '#fff'
								},
								fontSize: this.ChartfontSize
							}
						},
						itemStyle: {
							barBorderRadius: [5, 5, 0, 0]

						},
						barWidth: '20',
						data: [107, 397, 298]
					}, {
						name: '监控数量12',
						type: 'bar',
						label: {
							normal: {
								show: true,
								position: 'top',
								textStyle: {
									color: theme == 'theme1' ? '#3f9be1' : '#fff'
								},
								fontSize: this.ChartfontSize
							}
						},
						itemStyle: {
							barBorderRadius: [5, 5, 0, 0]
						},
						barWidth: '20',
						data: [107, 397, 298]
					}, {
						name: '12监控数量',
						type: 'bar',
						label: {
							normal: {
								show: true,
								position: 'top',
								textStyle: {
									color: theme == 'theme1' ? '#3f9be1' : '#fff'
								},
								fontSize: this.ChartfontSize
							}
						},
						itemStyle: {
							barBorderRadius: [5, 5, 0, 0]
						},
						barWidth: '20',
						data: [107, 397, 298]
					}]
				},
				barOptions: {
					grid: {
						left: '9%',
						right: '5%',
						top: '25%',
						bottom: '19%'
					},
					title: {
						show: false
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							// 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					legend: {
						show: true,
						left: 'right',
						itemWidth: 14,
						data: ['赞成', '反对', '弃权']
					},

					toolbox: {
						show: false
					},
					color: ['#c7615d', '#e0b088', '#176bab', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074',
						'#546570', '#c4ccd3'
					],
					xAxis: {
						type: 'category',
						boundaryGap: true,
						show: true,
						axisTick: {
							show: false
						},
						axisLabel: {
							fontSize: this.ChartfontSize,
							color: theme == 'theme1' ? '#3f9be1' : '#fff',
							margin: 8,
							interval: 0
						},
						axisLine: {
							lineStyle: {
								type: 'solid',
								color: theme == 'theme1' ? '#3f9be1' : '#fff',
								width: '5' //坐标线的宽度
							},
							symbol: ['none', 'arrow'],
							symbolSize: [16, 24],
							symbolOffset: [0, 10]
						},
						data: ['赞成', '反对', '弃权']
					},
					yAxis: {
						type: 'value',
						scale: true,
						name: '',
						axisLine: {
							show: false
						},
						splitNumber: 4,
						splitLine: {
							show: false
						},
						axisLabel: {
							fontSize: this.ChartfontSize,
							color: theme == 'theme1' ? '#3f9be1' : '#fff',
							margin: 12
						},
						axisLine: {
							lineStyle: {
								type: 'solid',
								color: theme == 'theme1' ? '#3f9be1' : '#fff',
								width: '5' //坐标线的宽度
							},
							symbol: ['none', 'arrow'],
							symbolSize: [16, 24],
							symbolOffset: [0, 10]
						},
						max: 1000,
						min: 0
					},
					series: [{
						name: '监控数量',
						type: 'bar',
						label: {
							normal: {
								show: true,
								position: 'top',
								textStyle: {
									color: theme == 'theme1' ? '#3f9be1' : '#fff'
								},
								fontSize: this.ChartfontSize
							}
						},
						itemStyle: {
							barBorderRadius: [5, 5, 0, 0]

						},
						barWidth: '20',
						data: [107, 397, 298]
					}, {
						name: '监控数量12',
						type: 'bar',
						label: {
							normal: {
								show: true,
								position: 'top',
								textStyle: {
									color: theme == 'theme1' ? '#3f9be1' : '#fff'
								},
								fontSize: this.ChartfontSize
							}
						},
						itemStyle: {
							barBorderRadius: [5, 5, 0, 0]
						},
						barWidth: '20',
						data: [107, 397, 298]
					}, {
						name: '12监控数量',
						type: 'bar',
						label: {
							normal: {
								show: true,
								position: 'top',
								textStyle: {
									color: theme == 'theme1' ? '#3f9be1' : '#fff'
								},
								fontSize: this.ChartfontSize
							}
						},
						itemStyle: {
							barBorderRadius: [5, 5, 0, 0]
						},
						barWidth: '20',
						data: [107, 397, 298]
					}]
				}

			}

		},
		created() {
			this.voteInfo = JSON.parse(this.$route.query.voteInfo);
		},
		methods: {
			returnback() {
				this.$router.go(-1);
			},
			stopVote(){
				const $me=this;
				$me.$postAction(api.stopVote).then(da=>{
					
				})
			}

		}

	};
</script>

<style scoped="scoped" lang="scss">
	/deep/ .ant-form-item {
		margin-bottom: 10px;
	}

	.objitem {
		width: 33.33%;
		display: inline-block;
		padding-right: 30px;
		position: relative;
	}

	.objitem .anticon {
		position: absolute;
		right: 5px;
		top: 15px;
	}

	.addObj {
		color: #333;
		font-size: 16px;
		margin: 0 auto 20px;
		display: block;
		width: 6em;
	}

	.addObj .anticon {
		margin-right: 10px;
	}

	.bg {
		position: absolute;
		height: 100%;
		width: 100%;
		left: 0;
		right: 0;
	}

	.tip {
		color: #d5525a;
		font-size: 14px;
		text-align: center;
	}

	.chartbox {
		width: 100%;
		height: 400px;
	}

	.voteInfo {
		font-size: 16px;
		color: #333;
		width: 290px;
	}

	.setbox .voteInfo>div {
		margin-bottom: 10px;
	}

	.setbox .voteInfo label {
		width: auto;
	}

	.setbox .voteInfo span {
		color: #d5525a;
	}

	.theme1 .bg {
		background: url(../assets/img/theme1/setbg.png) no-repeat center top;
		background-size: 100% auto;

		.setbox {
			top: 174px;
			background: rgba($color: #fff, $alpha: 0.7);
		}
	}

	.theme2 .bg {
		background: url(../assets/img/theme2/setbg.png) no-repeat 20px 30px;

		.title {
			font-size: 30px;
			color: #fff;
			position: absolute;
			left: 153px;
			top: 83px;
			background: url(../assets/img/theme2/titlebg.png);
			width: 112px;
			height: 50px;
			text-align: right;
			padding-top: 15px;
		}

		.setbox {
			top: 150px;
			background: #fff;
			bottom: 40px;
		}

		.setbox:after {
			content: '';
			height: 468px;
			width: 398px;
			display: block;
			position: absolute;
			right: 0.38rem;
			bottom: 0;
			background: url(../assets/img/theme2/setbg2.png) no-repeat center center;
			z-index: 0;
		}
	}

	.theme1 .startVote,
	.theme2 .startVote {
		display: block;
		margin: 30px auto 0;
		width: 360px;
		height: 40px;
		border-radius: 50px;
		background: #3f9be1;
		font-size: 16px;
		line-height: 40px;
		color: #fff;
		text-align: center;
	}

	.theme3 .bg {

		.setbox {
			left: .6rem;
			right: .6rem;
			top: 1.32rem;
			bottom: .16rem;
			padding: .4rem .6rem;
			// 		width: 808px;
			// 		height: 381px;
			// 		left: 60px;
			color: #fff;

			.linklist a {
				color: #07f8ff;
			}

			.btnlist a {
				width: 150px;
				background: url(../assets/img/theme3/setbtnbg.png);
			}

		}

		/deep/ .ant-select-selection {
			background: none;
			border: 1px solid #07f8ff;
			color: #fff;
		}

		/deep/ .ant-select-arrow {
			color: #07f8ff
		}

		.startVote {
			background: url(../assets/img/theme3/loginBtn.png);
			color: #060606;
			font-size: 14px;
			display: block;
			width: 240px;
			line-height: 40px;
			text-align: center;
			margin: 20px auto 0;
		}
	}

	.setbox {
		position: absolute;
		left: 0.15rem;
		right: 0.15rem;
		border-radius: 10px;
		padding: 40px 60px;
		bottom: 0;

		.ant-form {
			width: 800px;
			margin: 0 auto;
		}

		label {
			width: 155px;
			display: inline-block;
			font-size: 16px;
		}

		.linklist a {
			color: #3f9be1;
			font-size: 14px;
			display: inline-block;
			margin-top: 18px;

			&+a {
				margin-left: 85px;
			}
		}

		.btnlist a {
			display: inline-block;
			width: 151px;
			height: 30px;
			border-radius: 5px;
			color: #fff;
			font-size: 14px;
			background: #3f9be1;
			text-align: center;
			line-height: 30px;
			margin-top: 30px;

			&+a {
				margin-left: 40px;
			}
		}
	}

	.select {
		width: 200px;
	}
</style>
