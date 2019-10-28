<template>
	<div class="bg">
		<a href="javascript:;" class="reback" @click="returnback"></a>
		<div class="setbox" ref="setbox">
			<div class="resultbox" v-if="questionType==4">
				<a-checkbox-group :options="titleOptions" v-model="checkedList" style="vertical-align: middle;" />
				<a href="javascript:;" style="position: relative; z-index: 99;" @click="getEveryAnswerName({answer:checkedList.join('')})">查看详情</a>
			</div>
			<div class="flex" style="height: 100%;">
				<v-chart :options="pieOptions" autoresize class="chartbox" style="width: 30%;" @click="handpie"></v-chart>
				<v-chart :options="barOptions" autoresize class="chartbox flex-1" @click="handbar"></v-chart>
			</div>
			<select-namelist :namelist="selectNamelist" ref="selectname"></select-namelist>
		</div>
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
				barBorderRadius: [80, 80, 0, 0],
				color: function(params) {
					if (theme == 'theme1') {
						return {
							colorStops: [{
									offset: 0, //颜色的开始位置
									color: '#429ce2' // 0% 处的颜色
								},
								{
									offset: 1, //颜色的结束位置
									color: '#b9e1ff' // 100% 处的颜色
								}
							]
						};
					} else {
						return '#fff';
					}
				}
			},
			barWidth: '40%',
			data: []
		}]
	};
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
				questionType: '',
				theme: 'theme1',
				pieOptions: {
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
									fontSize: this.ChartfontSize > 18 ? 18 : this.ChartfontSize
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
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
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
			this.trueAnswer = this.$route.query.trueAnswer=='E'?'true':(this.$route.query.trueAnswer=='F'?'false':this.$route.query.trueAnswer);
			this.trueAnswertxt=this.$route.query.trueAnswer=='E'?'√':(this.$route.query.trueAnswer=='F'?'×':this.$route.query.trueAnswer);
			this.questionType = this.$route.query.questionType;
		},
		mounted() {
			const that = this;
			that.ChartfontSize = getDpr();
			that.barOptions = Object.assign({}, barParam);
			this.getEveryAnswerNum();
			this.getAnswerAccuracy();
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
					.filter(item => item != '未作答')
					.map(item => {
						return item
					});
				$me.colorList = [];
				if (title && title.length > 0) {
					$me.colorList = title.map((item, i) => {
						// if ($me.subjecttitle == 4) {
						// 	return defaultcolor[i];
						// } else {
						// 	if (title[i] == ($me.trueAnswer == 'F' ? '×' : $me.trueAnswer == 'E' ? '√' : $me.trueAnswer) && ($me.subjecttitle ==
						// 			1 || $me.subjecttitle == 2)) {
						// 		return '#ff999a';
						// 	}
						// 	if (item == '未作答') {
						// 		return '#AF89D6';
						// 	}
						// 	return '#59ADF3';
						// }
					});
				}
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
				// $me.myCorrectChart.off('click');
				// $me.selectAnswer = [];
				// $me.myCorrectChart.on('click', function(param) {
				//   if ($me.subjecttitle == 3) {
				// 		if (title[param.dataIndex] == '未作答') {
				// 			$me.getEveryAnswerName({
				// 				answer: title[param.dataIndex]
				// 			});
				// 		} else {
				// 			if ($me.colorList[param.dataIndex] == '#FF999A') {
				// 				//$me.colorList[param.dataIndex] = '#61a0a8';
				// 				$me.checklist[param.dataIndex].ischeck = false;
				// 			} else {
				// 				//$me.colorList[param.dataIndex] = '#ff999a';
				// 				$me.checklist[param.dataIndex].ischeck = true;
				// 			}
				// 		}
				// 		//$me.myCorrectChart.setOption(option);
				// 	} else {
				// 		$me.getEveryAnswerName({
				// 			answer: title[param.dataIndex]
				// 		});
				// 		//$me.getEveryAnswerName({ answer:$me.trueAnswer });
				// 	}
				// 	// }
				// });
			},
			/* 获取正确率 */
			getAnswerAccuracy() {
				const $me = this;
				$me.$postAction(api.getAnswerAccuracy).then(da => {
					if (da && da.ret == 'success') {
						var list = da.data;
						let myoption = [{
								value: list.trueNum,
								name: '正确'
							},
							{
								value: list.totalNum - list.trueNum,
								name: '错误'
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
						$me.$refs.selectname.show();
						$me.selectNamelist = da.data;
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
				// console.log(param.name==)
				if ($me.questionType == 4) {
					if ($me.title[param.dataIndex] == '未作答') {
						this.getEveryAnswerName({
							answer: $me.title[param.dataIndex]
						});
					} else {
						if ($me.checkedList.indexOf(param.name) > -1) {
							$me.checkedList = $me.checkedList.filter(item => item != param.name).sort()

						} else {
							$me.checkedList.push(param.name);
							$me.checkedList = $me.checkedList.sort();
						}
					}
				} else {
					this.getEveryAnswerName({
						answer: $me.title[param.dataIndex]=='×'?'false':($me.title[param.dataIndex]=='√'?'true':$me.title[param.dataIndex])
					});
				}

			},
			handpie(param) {

				const $me = this;
				if ($me.title[param.dataIndex] == '正确') {
					$me.getEveryAnswerName({
						answer: $me.trueAnswer
					});
				} else {
					$me.getFalseAnswerName({
						answer: $me.trueAnswer
					});
				}
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
</style>
