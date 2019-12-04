<template>
	<div v-if="isShow">
		<div class="titleName trueAnswer"><span>正确答案</span><span class="red">{{trueAnswertxt}}</span></div>
		<div class="rank top">
			<div class="rankitem bounceIn animated" v-for="(item, index) in ranklist">
				<p>{{ item.stuName }}</p>
				<!-- <p class="score">{{ item.score }}</p> -->
			</div>
		</div>
		<div class="thememodbox setbox" :style="{top:ranklist.length>0?'230px':'170px',bottom:'120px'}">
			<div style="height: 100%;">
				<div class="resultbox" v-if="questionType==4">
					<a-checkbox-group @change="handchange" :options="titleOptions" v-model="checkedList" style="vertical-align: middle;" />
					<a href="javascript:;" style="position: relative; z-index: 99;" @click="getEveryAnswerName({answer:checkedList.join('')})">查看详情</a>
				</div>
				<div class="flex" style="height: 100%;">
					<v-chart :options="pieOptions" autoresize class="chartbox" style="width: 30%;" @click="handpie" v-if="trueAnswer"></v-chart>
					<v-chart :options="barOptions" autoresize class="chartbox flex-1" @click="handbar" ref="barChart"></v-chart>
				</div>
			</div>
		</div>
		<select-namelist :namelist="selectNamelist" ref="selectname"></select-namelist>
	</div>
</template>

<script>
	import ECharts from 'vue-echarts/components/ECharts';
	import 'echarts/lib/chart/pie';
	import 'echarts/lib/chart/bar';
	import api from '@/page/mainPage/api';
	import selectNamelist from '@/page/mainPage/components/selectNamelist';

	function getDpr() {
		var windowWidth = document.body.clientWidth;
		if (windowWidth < 920) {
			return 14;
		}
		if (windowWidth >= 920 && windowWidth <= 1200) {
			return 20;
		}
		if (windowWidth > 1200 && windowWidth <= 1920) {
			return 40;
		}
	}
	var theme = 'theme1';
	var barParam = {
		grid: {
			left: '20%',
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
				type: '' // 默认为直线，可选为：'line' | 'shadow'
			},
			formatter(params) {
				const item = params[0];
				let txt=item.axisValue=='N'?'未作答人数':'答'+item.axisValue+'人数';
				return txt+item.data+'人';
			}
		},
		toolbox: {
			show: false
		},

		xAxis: {
			type: 'category',
			boundaryGap: true,
			show: true,
			axisTick: {
				show: false
			},
			axisLabel: {
				fontSize: 16,
				color: theme == 'theme1' ? '#3f9be1' : '#fff',
				margin: 8,
				interval: 0,
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
			offset: 4,
			data: [],

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
			minInterval: 1,
			axisLabel: {
				fontSize: 16,
				color: theme == 'theme1' ? '#3f9be1' : '#fff',
				margin: 12,
				formatter: ['{value}人'].join('\n'),
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
			min: 0,

		},
		color: [{
			type: 'linear',
			x: 0,
			y: 0,
			x2: 0,
			y2: 1,
			colorStops: [{
					offset: 0, //颜色的开始位置
					color: '#0380db' // 0% 处的颜色
				},
				{
					offset: 1, //颜色的结束位置
					color: '#2459a0' // 100% 处的颜色
				}
			]
		}],
		series: [{
			name: '答题人数',
			type: 'bar',
			label: {
				normal: {
					show: true,
					position: 'top',
					textStyle: {
						color: theme == 'theme1' ? '#3f9be1' : '#fff'
					},
					fontSize: 16
				}
			},
			itemStyle: {
				normal: {
					barBorderRadius: [10, 10, 0, 0],
					color: function(params) {
						return colorList[params.dataIndex];
					}
				}
			},
			barWidth: '40%',
			data: []
		}]
	};
	var defaultcolor = [{
			type: 'linear',
			x: 0,
			y: 0,
			x2: 0,
			y2: 1,
			colorStops: [{
					offset: 0, //颜色的开始位置
					color: '#0380db' // 0% 处的颜色
				},
				{
					offset: 1, //颜色的结束位置
					color: '#2459a0' // 100% 处的颜色
				}
			]
		}, {
			type: 'linear',
			x: 0,
			y: 0,
			x2: 0,
			y2: 1,
			colorStops: [{
					offset: 0, //颜色的开始位置
					color: '#e4a8a5' // 0% 处的颜色
				},
				{
					offset: 1, //颜色的结束位置
					color: '#c8615d' // 100% 处的颜色
				}
			]
		},
		{
			type: 'linear',
			x: 0,
			y: 0,
			x2: 0,
			y2: 1,
			colorStops: [{
					offset: 0, //颜色的开始位置
					color: '#fed601' // 0% 处的颜色
				},
				{
					offset: 1, //颜色的结束位置
					color: '#fc9701' // 100% 处的颜色
				}
			]
		}
	];
	var colorList = [];
	export default {
		components: {
			'v-chart': ECharts,
			selectNamelist
		},
		data() {
			return {
				ChartfontSize: 16,
				title: '',
				selectNamelist: [],
				titleOptions: [],
				checkedList: [],
				trueAnswer: '', //正确答案
				trueAnswertxt: '',
				questionType: '',
				isShow: false,
				ranklist: [],
				pieOptions: {
					color: defaultcolor,
					series: [{
						name: '正确率',
						type: 'pie',
						radius: ['35%', '80%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: true,
								position: 'inner',
								formatter: function(params) {
									//console.log(params);
									return params.name + params.value + '人\n(' + params.percent + '%)';
								},
								textStyle: {
									fontSize: 20,
									color: '#fff',
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						}
					}]
				},
				barOptions: {},
				barOptions2: {
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
							type: '' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					toolbox: {
						show: false
					},
					xAxis: {
						type: 'category',
						boundaryGap: true,
						show: true,
						axisTick: {
							show: false
						},
						axisLine: {
							show: false
						},
						axisLabel: {
							fontSize: 16,
							color: '#e8e8e8',
							margin: 8,
							interval: 0,
							formatter: function(val) {
								return val.split('').join('\n');
							}
						},
						data: ['A', 'B', 'C', 'D', 'E']
					},
					yAxis: [{
							type: 'value',
							scale: true,
							name: '',
							axisTick: {
								show: false
							},
							axisLine: {
								show: false
							},
							splitLine: {
								lineStyle: {
									color: '#06b0be',
									width: 3,
									type: 'dotted'
								}
							},
							axisLabel: {
								fontSize: 16,
								color: '#fff',
								margin: 12
							},

							max: 1000,
							min: 0
						},
						{
							type: 'value',
							gridIndex: 0,
							min: 0,
							max: 1000,
							splitNumber: 12,
							splitLine: {
								show: false
							},
							axisLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							axisLabel: {
								show: false
							}

						}
					],
					series: [{
							name: '监控数量',
							type: 'bar',
							label: {
								normal: {
									show: true,
									position: 'top',
									textStyle: {
										color: '#e8e8e8'
									},
									fontSize: 16
								}
							},
							itemStyle: {
								color: '#07f8ff'
							},
							barWidth: '40%',
							data: [107, 397, 298, 183, 212]
						},
						{
							name: '背景',
							type: 'bar',
							barWidth: '40%',
							xAxisIndex: 0,
							yAxisIndex: 1,
							barGap: '-100%',
							data: [1000, 1000, 1000, 1000, 1000],
							itemStyle: {
								normal: {
									color: 'rgba(255,255,255,0.1)'
								}
							},
							zlevel: 9
						}
					]
				}
			};
		},
		created() {

		},
		mounted() {
			const that = this;
			that.ChartfontSize = getDpr();
			that.barOptions = Object.assign({}, barParam);
			window.onresize = function() {
				that.ChartfontSize = getDpr();
				that.barOptions.xAxis.axisLabel.fontSize = that.ChartfontSize;
				that.barOptions.yAxis.axisLabel.fontSize = that.ChartfontSize;
				that.barOptions.series[0].label.normal.fontSize = that.ChartfontSize;
			};
		},
		methods: {
			returnback() {
				this.$router.go(-1);
			},
			show(param) {
				this.trueAnswer = param.trueAnswer == 'E' ? 'true' : (param.trueAnswer == 'F' ? 'false' : param.trueAnswer);
				this.trueAnswertxt = param.trueAnswer == 'E' ? '√' : (param.trueAnswer == 'F' ? '×' : param.trueAnswer);
				this.questionType = param.questionType;
				this.checkedList = [];
				this.getEveryAnswerNum();
				this.getSpeedKingList();
				if (this.trueAnswer) {
					this.getAnswerAccuracy();
				}
				this.isShow = true;
			},
			hide() {
				this.isShow = false;
				this.trueAnswertxt = '';
			},
			/* 查询作答人数 */
			getEveryAnswerNum() {
				const $me = this;
				$me.$postAction(api.getEveryAnswerNum).then(da => {
					if (da && da.ret == 'success') {
						/*结束答题 */
						var list = da.data;
						var title = [],
							data = [],
							percentage = [];
						if (list && list.length > 0) {
							list.forEach(item => {
								title.push(item.answer);
								data.push(item.count);
								percentage.push(item.percentage);
							});
						}
						$me.getCorrectChartData({
							title,
							data,
							percentage
						});
					}
				})
			},
			/*获取答题 柱状图chart*/
			getCorrectChartData(myoption) {
				const $me = this;
				var title = myoption.title;
				var mydata = myoption.data;
				var percentage = myoption.percentage;
				var option = Object.assign({}, barParam);
				$me.titleOptions = title
					.filter(item => item != 'N')
					.map(item => {
						return item
					});

				if (title && title.length > 0) {
					colorList = title.map((item, i) => {
						if (title[i] == ($me.trueAnswer == 'false' ? '×' : $me.trueAnswer == 'true' ? '√' : $me.trueAnswer)) {
							return defaultcolor[1];
						} else if (title[i] == 'N') {
							return defaultcolor[2];
						} else {
							return defaultcolor[0];
						}

					});
				}
				console.log(colorList);

				option.xAxis.data = title;
				$me.title = title;
				option.series[0].data = mydata;
				if (title.length > 5) {
					option.dataZoom = [{
							show: true,
							start: 0,
							end: 50
						},
						{
							type: 'inside',
							start: 0,
							end: 50
						}
					];
				}
				option.xAxis.axisLabel.fontSize = $me.ChartfontSize;
				option.yAxis.axisLabel.fontSize = $me.ChartfontSize;
				option.series[0].label.normal.fontSize = $me.ChartfontSize;
				$me.barOptions = Object.assign({}, option);

			},
			/* 获取正确率 */
			getAnswerAccuracy() {
				const $me = this;
				$me.$postAction(api.getAnswerAccuracy).then(da => {
					if (da && da.ret == 'success') {
						var list = da.data;
						let myoption = [{
								value: list.totalNum - list.trueNum,
								name: '错误'
							}, {
								value: list.trueNum,
								name: '正确'
							}

						]
						let option = Object.assign({}, $me.pieOptions);
						option.series[0].data = myoption;
						$me.pieOptions = Object.assign({}, option);
					}
				})
			},
			/* 获取选项答题人数 */
			getEveryAnswerName(param) {
				const $me = this;
				$me.$postAction(api.getEveryAnswerName, param).then(da => {
					if (da && da.ret == 'success') {
						$me.selectNamelist = da.data;
						$me.$refs.selectname.show();
					}
				})

			},
			getFalseAnswerName(param) {
				const $me = this;
				$me.$postAction(api.getFalseAnswerName, param).then(da => {
					if (da && da.ret == 'success') {
						$me.$refs.selectname.show();
						$me.selectNamelist = da.data;
					}
				});
			},
			handbar(param) {
				const $me = this;
				console.log(param)
				if ($me.questionType == 4) {
					if ($me.title[param.dataIndex] == 'N') {
						this.getEveryAnswerName({
							answer: $me.title[param.dataIndex]
						});
					} else {
						if ($me.checkedList.indexOf(param.name) > -1) {
							$me.checkedList = $me.checkedList.filter(item => item != param.name).sort()
							colorList[param.dataIndex] = defaultcolor[0]
						} else {
							$me.checkedList.push(param.name);
							$me.checkedList = $me.checkedList.sort();
							colorList[param.dataIndex] = defaultcolor[1]
						}
						$me.$refs.barChart.resize();
					}
				} else {
					this.getEveryAnswerName({
						answer: $me.title[param.dataIndex] == '×' ? 'false' : ($me.title[param.dataIndex] == '√' ? 'true' : $me.title[
							param.dataIndex])
					});
				}

			},
			getAnswerName(type) {
				const $me = this;
				$me.$postAction(api.getAnswerName, {
					answer: $me.trueAnswer
				}).then(da => {
					if (da && da.ret == 'success') {
						$me.$refs.selectname.show();
						$me.selectNamelist = da.data[type];
					}
				});
			},
			handpie(param) {
				const $me = this;
				if (param.name == '正确') {
					$me.getAnswerName('T');
				} else {
					$me.getAnswerName('F');
				}
			},
			getSpeedKingList() {
				const $me = this;
				$me.$postAction(api.getSpeedKingList).then(da => {
					if (da && da.ret == 'success') {
						var list = da.data;
						$me.ranklist = list.length > 5 ? list.slice(0, 5) : list;
					}
				});
			},
			handchange(checklist) {
				console.log(checklist);
				const $me = this;
				$me.checkedList = checklist;
				for (var i = 0; i < colorList.length; i++) {
					if ($me.checkedList.indexOf($me.title[i]) > -1) {
						colorList[i] = defaultcolor[1];
						// console.log($me.title[i])
					} else if ($me.title[i] != 'N') {
						colorList[i] = defaultcolor[0];
					}
				}
				$me.$refs.barChart.resize();

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
	}

	.chartbox {
		width: 80%;
		height: 100%;
		margin: 0 auto;
	}

	.theme1 .bg {
		background: url(../assets/img/theme1/anserbg.png) no-repeat center top;
		background-size: 100% auto;

		.setbox {
			position: absolute;
			left: 0.15rem;
			right: 0.15rem;
			padding: 40px 60px;
			bottom: 0;
			top: 174px;
			background: rgba($color: #fff, $alpha: 0.6);
			border-radius: 20px;
		}

		.resultbox {
			background: url(../assets/img/theme1/chart.png) no-repeat left 8px;
			padding-left: 35px;
			color: #429ce2;
			font-size: 24px;
			line-height: 40px;
			position: absolute;
			right: 35px;

			p {
				margin-bottom: 0;
			}

			.num {
				font-size: 30px;
			}

			a {
				font-size: 18px;
				color: #429ce2;
			}
		}
	}

	.theme2 .bg {
		background: url(../assets/img/theme2/startClass1.png) no-repeat left top, url(../assets/img/theme2/startClass2.png) no-repeat left bottom,
			url(../assets/img/theme2/startClass3.png) no-repeat right top, url(../assets/img/theme2/startClass4.png) no-repeat right bottom;
		bottom: 0;

		.setbox {
			position: absolute;
			left: 0.15rem;
			right: 0.15rem;
			padding: 0 60px;
			bottom: 0;
			top: 170px;
		}

		.resultbox {
			background: url(../assets/img/theme2/chart.png) no-repeat left 8px;
			padding-left: 35px;
			color: #fff;
			font-size: 24px;
			line-height: 40px;
			position: absolute;
			right: 75px;

			p {
				margin-bottom: 0;
			}

			.num {
				font-size: 30px;
			}

			a {
				font-size: 18px;
				color: #fff;
			}
		}
	}

	.theme3 .bg {
		background: url(../assets/img/theme3/setboxbg.png) no-repeat center top;
		background-size: 100% auto;

		.setbox {
			position: absolute;
			left: 0.6rem;
			right: 0.6rem;
			top: 1.32rem;
			bottom: 0.16rem;
		}

		.resultbox {
			background: url(../assets/img/theme2/chart.png) no-repeat left 8px;
			padding-left: 35px;
			color: #fff;
			font-size: 24px;
			line-height: 40px;
			position: absolute;
			left: 40px;
			top: 30px;

			p {
				margin-bottom: 0;
			}

			.num {
				font-size: 30px;
			}

			a {
				font-size: 18px;
				color: #fff;
			}
		}

		.chartbox {
			padding-top: 120px;
		}
	}

	.theme4 .bg {
		.thememodbox {
			bottom: 20px;
			width: auto;
			left: 135px;
			right: 135px;
			transform: translate(0, 0);
		}

		.resultbox {
			background: url(../assets/img/theme1/chart.png) no-repeat left 8px;
			padding-left: 35px;
			color: #429ce2;
			font-size: 24px;
			line-height: 40px;
			position: absolute;
			right: 75px;

			p {
				margin-bottom: 0;
			}

			.num {
				font-size: 30px;
			}

			a {
				font-size: 18px;
				color: #429ce2;
			}
		}
	}

	.trueAnswer span {
		vertical-align: middle;
	}
</style>
