<template>
	<div v-if="showVote" class="bg">
		<a href="javascript:;" class="reback" @click="returnback"></a>
		<div class="setbox" v-if="!isAnswering">
			<div>
				<a-form :form="form">
					<a-form-item label="评分主题" :label-col="{ span: 4}" :wrapper-col="{ span: 20 }">
						<a-input class="lginput" v-decorator="['titleName', { rules: [{ required: true, message: '请输入评分主题!' }] }]"
						 placeholder="请输入评分主题" allowClear size="large" />
					</a-form-item>
					<a-form-item label="评分描述" :label-col="{ span: 4}" :wrapper-col="{ span: 20 }">
						<a-textarea class="textarea" placeholder="请输入评分描述" :rows="4" v-decorator="['describe', { rules: [{ required: true, message: '请输入评分描述!' }] }]" />
					</a-form-item>
					<a-form-item label="评分对象" :label-col="{ span: 4 }" :wrapper-col="{ span:20 }">
						<div v-for="item in objlist" :key="item" class="objitem">
							<a-input v-decorator="['objs['+item+']', { rules: [{ required: true, message: '请输入评分对象!' }] }]" placeholder="评分对象"
							 allowClear size="large" class="sminput" />
							<a-icon type="minus-circle" @click="delObj(item)" v-if="objlist.length>1" />
						</div>
					</a-form-item>
				</a-form>
				<a href="javascript:;" class="addObj" @click="addObj">
					<a-icon type="plus-circle" /><span>添加对象</span></a>
				<p class="tip">说明：评分范围为1-9；标题限制字数：20；描述限制字数：100；评分对象限制字数：5;</p>

			</div>
		</div>
		<div class="voteChart flex flex-align-center" v-if="isAnswering">
			<div class="voteInfo">
				<div class="flex"><label>评分主题:</label><span class="flex-1">{{voteInfo.titleName}}</span></div>
				<div class="flex"><label>评分对象:</label>
					<div class="flex-1"><span v-for="(item,index) in voteInfo.objs" :key="index">{{item}}</span></div>
				</div>
				<div class="flex"><label>评分描述:</label><span class="flex-1">{{voteInfo.describe}}</span></div>
			</div>
			<div class="flex-1" v-if="isChart">
				<v-chart :options="polar" autoresize class="chartbox" ></v-chart>
			</div>
		</div>
		<div class="btnbar">
			<a href="javascript:;" class="startClass" @click="startScore" v-if="!isAnswering">开始评分</a>
			<a href="javascript:;" class="startClass" @click="stopScore" v-if="isAnswering">结束评分</a>
		</div>
	</div>
</template>

<script>
	let maxId = 0;
	import api from '@/page/mainPage/api';
	import ECharts from 'vue-echarts/components/ECharts';
	import 'echarts/lib/chart/bar';
	import 'echarts/lib/component/tooltip'
	import 'echarts/lib/component/polar'
	import 'echarts/lib/component/legend'
	import 'echarts/lib/component/title.js'
	import selectNamelist from '@/page/mainPage/components/selectNamelist';
	var ChartfontSize = 20;
	export default {
		components: {
			'v-chart': ECharts,
			selectNamelist
		},
		data() {
			return {
				form: this.$form.createForm(this),
				showVote: false,
				objlist: [0],
				isAnswering: false,
				isChart: false,
				voteInfo: {},
				theme: 'theme1',
				selectNamelist: [],
				polar: {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							// 坐标轴指示器，坐标轴触发有效
							type: '' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					legend: {
						show: true,
						left: 'right',
						itemWidth: 14,
						orient: 'vertical',
						data: []
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
							fontSize: ChartfontSize,
							color: '#3f9be1',
							margin: 8,
							interval: 0
						},
						axisLine: {
							lineStyle: {
								type: 'solid',
								color: '#3f9be1',
								width: '5' //坐标线的宽度
							},
							symbol: ['none', 'arrow'],
							symbolSize: [16, 24],
							symbolOffset: [0, 10]
						},
						data: []
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
							fontSize: ChartfontSize,
							color: '#3f9be1',
							margin: 12
						},
						axisLine: {
							lineStyle: {
								type: 'solid',
								color: '#3f9be1',
								width: '5' //坐标线的宽度
							},
							symbol: ['none', 'arrow'],
							symbolSize: [16, 24],
							symbolOffset: [0, 10]
						},
						min: 0,
						minInterval: 1,
					},
					series: []
				},
				chartlist: []
			};
		},
		created() {
			

		},
		methods: {
			addObj() {
				if (this.objlist.length >= 5) {
					return false;
				}
				this.objlist.push(++maxId);
			},
			delObj(key) {
				let list = this.objlist.filter(item => {
					if (item != key) {
						return item
					};
				})

				this.objlist = list;
			},
			show() {
				this.isChart = false;
				this.isAnswering=false;
				maxId=0;
				this.objlist=[0];
				this.showVote = true;
			},
			hide() {
				this.showVote = false;
			},
			returnback() {
				this.hide();
				this.$emit('returnback');
			},
			startScore() {
				const $me = this;
				this.form.validateFields((err, values) => {
					if (!err) {
						$me.$postAction(api.startScore, values).then(da => {
							if (da && da.ret == 'success') {
								/* 开始答题 */
								$me.voteInfo = values;
								$me.isAnswering = true;
								$me.$emit('startScore')
							}
						})

					}
				})
			},
			stopScore() {
				const $me = this;
				$me.$postAction(api.stopScore).then(da => {
					if (da && da.ret == 'success') {
						
						$me.getScoreResult();

						$me.$emit('stopScore')
					}
				})
			},
			/* 获取评分结果 */
			getScoreResult() {
				const $me = this;
				$me.$postAction(api.getScoreResult).then(da => {
					if (da && da.ret == 'success') {
						/* 投票结果 */
						$me.isChart = true;
						// $me.isAnswering = false;
						var data = da.data;
						this.chartlist = data;
						var objtitle = [];//投票对象
						var title = ['总分', '人数', '平均分'];//x轴标题
						var serieslist = [];
						for (var i = 0; i < data.length; i++) {
							var item = data[i];
							objtitle.push(item.scoreObj);
							var seriesitem = {
								name: item.scoreObj,
								type: 'bar',
								label: {
									normal: {
										show: true,
										position: 'top',
										textStyle: {
											color: '#3f9be1'
										},
										fontSize: ChartfontSize
									}
								},
								itemStyle: {
									barBorderRadius: [5, 5, 0, 0]
								},
								barWidth: '40',
								data:[item.totalScore,item.number,item.averageScore]
							}
							serieslist.push(seriesitem)
						}
						
						
						var polar = Object.assign({}, this.polar);
						polar.series = serieslist;
						polar.legend.data = objtitle;
						polar.xAxis.data=title;
						this.polar = Object.assign({}, polar);
						
					}
				})
			},
		
		}

	};
</script>

<style scoped="scoped" lang="scss">
	/deep/ .ant-form-item {
		margin-bottom: 10px;
	}

	.objitem {
		width: 20%;
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

	// .bg {
	// 	position: absolute;
	// 	height: 100%;
	// 	width: 100%;
	// 	left: 0;
	// 	right: 0;
	// }

	.tip {
		color: #d5525a;
		font-size: 14px;
		text-align: center;
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

	.theme4 {
		.setbox {
			/deep/ .ant-form {
				width: 860px;

				label {
					font-size: 24px;

				}
			}

			/deep/ .ant-input {
				background: none;
				border-radius: 0;
				border: none !important;
				border-color: #fff !important;
				padding-left: 20px;
				color: #fff;
			}

			/deep/ .textarea.ant-input {
				color: #333;
				padding: 10px 20px;
			}

			.textarea {
				background: url(../assets/img/theme4/txtbg3.png) no-repeat left top;
				background-size: 100% 100%;

			}

			.lginput {
				background: url(../assets/img/theme4/txtbg.png);
				background-size: cover;

			}

			.sminput {
				background: url(../assets/img/theme4/txtbg2.png) no-repeat center center;
				background-size: contain;
				width: 115px;
			}
		}
	}

	.theme3,
	.theme1,
	.theme2 {
		.bg .setbox {
			position: absolute;
			left: 0.15rem;
			right: 0.15rem;
			border-radius: 10px;
			padding: 40px 60px;
			bottom: 0;
		}
	}

	.setbox {
		/deep/ .ant-form {
			width: 800px;
			margin: 0 auto;

			label {
				font-size: 16px;
			}
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


	.voteChart {
		position: absolute;
		left: 10%;
		right: 10%;
		border-radius: 10px;
		padding: 40px 60px;
		bottom: 10%;
		top: 160px;
	}

	.voteInfo {
		font-size: 16px;
		color: #333;
		width: 290px;
		background: #fff;
		border: 14px solid #2459a0;
		border-image-slice: 14;
		border-image-width: 14px;
		border-image-source: url(../assets/img/theme4/votebg.png);
		border-image-repeat: round;
		color: #333;
		padding: 36px 16px;
	}

	.voteChart .voteInfo>div {
		margin-bottom: 10px;
	}

	.voteChart .voteInfo label {
		width: auto;
	}

	.voteChart .voteInfo span {
		color: #d5525a;
	}

	.echarts {
		width: 100%;
	}
</style>
