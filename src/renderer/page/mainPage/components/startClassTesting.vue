<template>
	<div class="setbox" v-if="isShow">
		<div ref="mainbox">
			<ul class="userlist clearfix" v-if="viewState==0">
				<li v-for="(item,index) in list" :key="index" @click="showDetails(index)">
					<div>{{item.studentName}}</div>
					<div class="progressbar">
						<span>{{item.percent}}%</span>
						<div :style="{width:item.percent+'%'}"></div>
					</div>
				</li>
			</ul>
			<div v-if="viewState==1" style="overflow: auto;" ref="chartlebox">
				<div class="subtablink">
					<a href="javascript:;" @click="changeType(1)" :class="{'active':type==1}">列表</a>
					<span>|</span>
					<a href="javascript:;" @click="changeType(2)" :class="{'active':type==2}">图表</a>
				</div>
				<a-table v-if="type==1" rowKey="questionId" :columns="countcolumns" :dataSource="countSource" :scroll="{ y: scrolly }"
				 size="middle" :pagination="false">
					<span slot="serial" slot-scope="text, record, index">
						{{ index + 1 }}
					</span>
					<span :slot="item.key" v-for="(item,index) in titleNames" :key="index" slot-scope="text, record" :style="{color:text.split('|')[1]=='true'?'#00a095':'#d43030'}">{{text.split('|')[0]||'--'}}</span>
					<a href="javascript:;" slot="stuName" slot-scope="text, record, index" @click="showStuDetail(record)">{{text}}</a>
				</a-table>
				<div v-if="type==2">
					<v-chart :options="ratepolar" autoresize class="chartbox" style="width: 100%;"></v-chart>
					<v-chart :options="countpolar" autoresize class="chartbox" style="width: 100%;"></v-chart>
				</div>
			</div>
			<div v-if="viewState==2" ref="tablebox">
				<div>姓名：<span>{{studentInfo.stuName}}</span></div>
				<a-table rowKey="questionId" :columns="columns" :dataSource="dataSource" :scroll="{ y: scrolly }" size="middle"
				 :pagination="false">
					<span slot="serial" slot-scope="text, record, index">
						<!-- {{ index + 1 }} -->
						{{text}}
					</span>
					<span slot="questionType" slot-scope="text, record, index">
						{{ text}}
					</span>
					<a-tag slot="answer" slot-scope="text, record, index" v-if="text" :color="record.answerResult=='true'?'#87d068':'#f00'">{{ text|Answerfilter}}</a-tag>
					<span slot="trueAnswer" slot-scope="text, record, index">
						{{ text|Answerfilter}}
					</span>
				</a-table>
			</div>

			<a href="javascript:;" class="reback rebacklist" @click="returnback" v-if="viewState==2"></a>
		</div>
	</div>
</template>

<script>
	let countcolumns = [{
			title: '#',
			scopedSlots: {
				customRender: 'serial'
			},
			align: 'center'
		}, {
			title: '姓名',
			dataIndex: 'stuName',
			key: 'stuName',
			// fixed: 'left',
			width: '32%',
			scopedSlots: {
				customRender: 'stuName'
			},

		},
		{
			title: '排名',
			key: 'ranking',
			dataIndex: 'ranking',
			// fixed: 'left',
			width: '32%'
		},
		{
			title: '综合正确率',
			key: 'compCorrRate',
			dataIndex: 'compCorrRate',
			// fixed: 'left',
			width: '32%'
		}
	];
	let rateOption = {
		title: {
			text: '班级正确率统计'
		},
		tooltip: {
			trigger: 'axis',
			formatter: function(value) {
				//console.log(value)
				return value[0].value + '%'
			}

		},

		grid: {
			x: 60,
			x2: 40,
			y2: 54
		},
		calculable: true,
		xAxis: [{
			type: 'category',
			data: [],
			axisLabel: {
				interval: 0
			}
		}],
		yAxis: [{
			type: 'value',
			max: 100,
			axisLabel: {
				formatter: '{value} %'
			}
		}],
		series: [{
			type: 'bar',
			data: [],
			barMaxWidth: 100,
			label: {
				normal: {
					show: true,
					position: 'top',
					color: '#000',
					formatter: function(param) {
						// return param.value + '%';
						return param.value > 0 ? param.value + '%' : '';
					},
					textStyle: {
						fontSize: 18
					}
				}
			}

		}]
	};
	let countOption = {
		title: {
			text: '班级答题数统计'
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			x: 'center',
			y: 'top',
			textStyle: {
				fontSize: 20
			},
			data: ['答对', '答错', '未答']
		},
		grid: {
			x: 60,
			x2: 40,
			y2: 54
		},
		calculable: true,
		xAxis: [{
			type: 'category',
			data: [],
			axisLabel: {
				interval: 0
			}
		}],
		yAxis: [{
			type: 'value',
			axisLabel: {
				formatter: '{value} 人'
			},
			minInterval: 1
		}],
		series: [{
			type: 'bar',
			name: '答对',
			data: [],
			stack: '参与人数',
			barMaxWidth: 100,
			label: {
				normal: {
					show: true,
					position: 'inside',
					color: '#fff',
					formatter: function(param) {
						return param.value > 0 ? param.value + '人' : '';
					},
					textStyle: {
						fontSize: 18
					}
				}
			}

		}, {
			type: 'bar',
			name: '答错',
			data: [],
			stack: '参与人数',
			barMaxWidth: 100,
			label: {
				normal: {
					show: true,
					position: 'inside',
					color: '#fff',
					formatter: function(param) {
						return param.value > 0 ? param.value + '人' : '';
					},
					textStyle: {
						fontSize: 18
					}
				}
			}

		}, {
			type: 'bar',
			data: [],
			name: '未答',
			stack: '参与人数',
			barMaxWidth: 100,
			label: {
				normal: {
					show: true,
					position: 'inside',
					color: '#fff',
					formatter: function(param) {
						return param.value > 0 ? param.value + '人' : '';
					},
					textStyle: {
						fontSize: 18
					}
				}
			}

		}]
	}
	import ECharts from 'vue-echarts/components/ECharts';
	import 'echarts/lib/chart/pie';
	import 'echarts/lib/chart/bar';

	const columns = [{
			title: '题号',
			dataIndex: 'questionId',
			width: 100,
			scopedSlots: {
				customRender: 'serial'
			},
		},
		{
			title: '题目类型',
			dataIndex: 'questionType',
			width: '25%',
			scopedSlots: {
				customRender: 'questionType'
			},
		},
		{
			title: '按键答案',
			dataIndex: 'answerResult',
			align: 'center',
			width: '25%',
			scopedSlots: {
				customRender: 'answer'

			},
		},
		{
			title: '正确答案',
			dataIndex: 'trueAnswer',
			align: 'center',
			width: '25%',
			scopedSlots: {
				customRender: 'trueAnswer'

			},
			// width: 300,
		},
		{
			title: '得分',
			dataIndex: 'score',
			width: 100
		},
		// 	{
		// 		title: '操作',
		// 		key: 'operation',
		// 		fixed: 'right',
		// 		width: 100,
		// 		scopedSlots: { customRender: 'action' }
		// 	}
	];

	export default {
		components: {},
		data() {
			return {
				isShow: false,
				list: [],
				scrolly: 100,
				viewState: 0,
				columns,
				detailslist: [],
				dataSource: [],
				studentInfo: '',
				countcolumns: countcolumns,
				countSource: [],
				ratepolar: rateOption,
				countpolar: countOption,
				res: null,
				titleNames: [],
				type: 1

			};
		},
		mounted() {

		},
		components: {
			'v-chart': ECharts,
		},
		methods: {
			show() {
				this.list = [];
				this.viewState = 0;
				this.detailslist = [];
				this.isShow = true;
			},
			hide() {
				this.isShow = false;
			},
			setList(list) {
				if (list && list.length > 0) {
					this.list = list.map(item => {
						item.percent = parseInt(item.percent * 100);
						return item
					});
				} else {
					this.list = [];
				}

			},
			setCountlist(res) {
				this.viewState = 1;
				let that = this;
				// this.$nextTick(() => {
				// 	that.scrolly = that.$refs.chartbox.offsetHeight - 100;
				// 	window.onresize = function() {
				// 		that.scrolly = that.$refs.chartbox.offsetHeight - 100;
				// 	};
				// })
				this.res = res;
				let ratexAxis = [];
				this.titleNames = [];
				let rateData = [];
				let totalTrueStulist = [];
				let totalFalseStulist = [];
				let totalNoneStulist = [];
				if (this.res.ret == 'success') {
					if (this.res.data.titleNames && this.res.data.titleNames.length > 0) {
						for (var i = 0; i < this.res.data.titleNames.length; i++) {
							var item = this.res.data.titleNames[i];
							var obj = {
								title: item.titleName + '_' + item.questionId,
								key: item.questionId,
								dataIndex: item.questionId,
								scopedSlots: {
									customRender: item.questionId
								}
							}
							this.titleNames.push(obj);
							ratexAxis.push(obj.title)
						}

						let normalcolumns = JSON.parse(JSON.stringify(countcolumns));
						this.countcolumns = [...normalcolumns.map(item => {
							if (item.title == '#') {
								item.width = 100;
							} else {
								item.width = 180;
							}

							item.fixed = 'left';
							return item
						}), ...this.titleNames];

					} else {
						this.countcolumns = [...columns]
					}
					if (this.res.data.stuDetailDos && this.res.data.stuDetailDos.length > 0) {
						this.countSource = this.res.data.stuDetailDos.map(item => {
							let param = {
								'stuName': item.stuName,
								'ranking': item.ranking,
								'compCorrRate': item.compCorrRate,
								'stuCode': item.stuCode,
								'stuAnswerDetails': item.stuAnswerDetails,
							}
							let stuAnswerDetails = item.stuAnswerDetails;
							for (var i = 0; i < stuAnswerDetails.length; i++) {
								param[stuAnswerDetails[i].questionId] = stuAnswerDetails[i].answer + '|' + stuAnswerDetails[i].answerResult
							}
							param.totalTrueForQuNum = item.totalTrueForQue.length;
							param.totalNum = item.totalFalseForQue.length + item.totalTrueForQue.length;
							param.totalFlashForQuNum = item.totalFalseForQue.length;
							return param;
						});
						let lastdata = {
							stuName: '合计',
						}
						for (var i = 0; i < this.res.data.queAvCorrRateList.length; i++) {
							lastdata[this.res.data.queAvCorrRateList[i].questionId] = this.res.data.queAvCorrRateList[i].corrRate;
							var num = this.res.data.queAvCorrRateList[i].corrRate.slice(0, this.res.data.queAvCorrRateList[i].corrRate.length -
								1);
							rateData.push(num);
							totalFalseStulist.push(this.res.data.queAvCorrRateList[i].totalFalseStu);
							totalNoneStulist.push(this.res.data.queAvCorrRateList[i].totalNoneStu);
							totalTrueStulist.push(this.res.data.queAvCorrRateList[i].totalTrueStu);

						}
						console.log(lastdata);
						this.countSource.push(lastdata)
					} else {
						this.countSource = [];
					}
					let ratepolar = Object.assign({}, rateOption);
					ratepolar.xAxis[0].data = ratexAxis;
					ratepolar.series[0].data = rateData;
					let countpolar = Object.assign({}, countOption);
					countpolar.xAxis[0].data = ratexAxis;
					countpolar.series[0].data = totalTrueStulist;
					countpolar.series[1].data = totalFalseStulist;
					countpolar.series[2].data = totalNoneStulist;
					if (ratexAxis.length > 10) {
						let dataZoom = [{
							show: true,
							start: 70,
							end: 100
						}, {
							type: 'inside',
							start: 70,
							end: 100
						}]
						countpolar.dataZoom = dataZoom;
						ratepolar.dataZoom = dataZoom;
					}
					this.ratepolar = ratepolar;
					this.countpolar = countOption;
				}
			},
			setDetailslist(list) {
				this.detailslist = list;
			},
			showDetails(index) {
				if (this.detailslist.length <= 0) {
					return false;
				}
				this.dataSource = this.detailslist[index].recordList;
				this.studentInfo = this.detailslist[index].studentInfo;
				this.viewState = 2;
				let that = this;
				this.$nextTick(() => {
					console.log(that.$refs.tablebox.offsetHeight)
					that.scrolly = that.$refs.tablebox.offsetHeight - 100;
					window.onresize = function() {
						that.scrolly = that.$refs.tablebox.offsetHeight - 100;
					};
				})
			},
			returnback() {
				this.viewState = 0;
			},
			showStuDetail(record) {
				this.viewState = 2;
				this.studentInfo = record.stuName;
				this.dataSource = record.stuAnswerDetails;
				let that = this;
				this.$nextTick(() => {
					that.scrolly = that.$refs.tablebox.offsetHeight - 100;
					window.onresize = function() {
						that.scrolly = that.$refs.tablebox.offsetHeight - 100;
					};
				})
			},
			changeType(type) {
				this.type = type
			}
		},
		destroyed() {
			window.onresize = null;
		},
		filters: {
			typefilter(value) {
				var str = ''
				switch (value) {
					case '1':
						{
							str = "单题单选-字母"
							break;
						}
					case '2':
						{
							str = "单题单选-判断"
							break;
						}
					case '3':
						{
							str = "单题单选-数字"
							break;
						}
					case '4':
						{
							str = "单题多选"
							break;
						}
				}
				return str
			},
			Answerfilter(value) {
				var str = value;
				switch (value) {
					case 'true':
					case 'E':
						{
							str = "√"
							break;
						}
					case 'false':
					case 'F':
						{
							str = "×"
							break;
						}


				}
				return str
			}
		}
	};
</script>

<style scoped="scoped" lang="scss">
	@import '../assets/css/set.scss';

	.getPaper {
		display: block;
		font-size: 18px;
		color: #3399cc;
		background: #fff;
		border-radius: 5px;
		width: 100px;
		height: 40px;
		text-align: center;
		line-height: 40px;
		position: absolute;
		top: 90px;
		right: 35px;
	}

	.userlist {
		height: 100%;
		overflow: auto;
	}

	.userlist li {
		width: 100px;
		height: 53px;
		display: inline-block;
		border-radius: 6px;
		padding: 6px;
		cursor: pointer;
		margin: 6px;

		.progressbar {
			height: 14px;
			font-size: 11px;
			text-align: center;
			position: relative;
			overflow: hidden;
			margin-top: 5px;

			&>div {
				width: 0;
				height: 100%;
				border-radius: 2px;
			}

			&>span {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
			}
		}
	}

	.theme1 .bg,
	.theme2 .bg {
		.userlist li {
			background: #fff;
			box-shadow: inset 0 0 10px rgba($color: #3f9be1, $alpha: 0.28);
			font-size: 14px;
			color: #336699;

			.progressbar {
				background: #fff;
				border-radius: 4px;
				box-shadow: inset 0 0 10px rgba($color: #3f9be1, $alpha: 0.28);
				color: #336699;
				font-size: 11px;

				&>div {
					background: #3f9be1;
				}
			}
		}
	}

	.theme1 .bg,
	.theme2 .bg {
		.setbox {
			padding: 25px 35px;
			bottom: 120px;
			background: rgba(255, 255, 255, .7);

			&>div {
				height: 100%;
				overflow: hidden;

				&>div {
					height: 100%;
				}
			}
		}

		.reback.rebacklist {
			position: absolute;
			top: auto;
			bottom: -20px;
			right: 20px;
		}
	}

	.theme3 {
		.bg {
			background: none;

			.setbox {
				left: 10px;
				right: 10px;
				bottom: 15px;
				top: 132px;
				background: url(../assets/img/theme3/setboxbg2.png) no-repeat center top;
				background-size: 100% auto;

				&>div {
					height: 100%;
					overflow: hidden;

					&>div {
						height: 100%;
					}
				}
			}

			&>.title {
				height: 38px;
				padding-left: 117px;
				line-height: 38px;
				font-size: 23px;
				top: 83px;
				left: 75px;
			}
		}

		.getPaper {
			background: rgba($color: #07f8ff, $alpha: .3);
			border: 1px solid #07f8ff;
			color: #fff;
			top: 83px;
		}

		.userlist li {
			background: rgba($color: #07f8ff, $alpha: .3);
			border: 1px solid #07f8ff;
			font-size: 14px;
			color: #fff;

			.progressbar {
				background: #fff;
				border-radius: 4px;
				box-shadow: inset 0 0 10px rgba($color: #3f9be1, $alpha: 0.28);
				color: #336699;
				font-size: 11px;

				&>div {
					background: #07f8ff;
				}
			}
		}
	}

	.theme4 .setbox {
		bottom: 120px;
		width: 80%;

		&>div {
			height: 100%;
			overflow: hidden;
			padding: 65px 0 15px;

			.userlist {
				padding: 0 90px;

				li {
					font-size: 20px;
					color: #2459a0;
					width: 10%;

					.progressbar {
						background: #fff;
						border-radius: 4px;
						color: #2459a0;
						font-size: 14px;
						border: 1px solid #2459a0;
						line-height: 20px;
						height: 20px;

						&>div {
							background: #ffd941;
						}
					}
				}
			}

			&>div {
				margin: 10px 40px;
				height: 100%;
			}
		}

		.reback.rebacklist {
			position: absolute;
			top: auto;
			top: 5px;
			right: 20px;
		}
	}

	.subtablink {
		font-size: 14px;
		color: #999;
		vertical-align: middle;
		text-align: right;
		margin-bottom: 10px;
	}

	.subtablink a {
		color: #999;
		text-decoration: none;
	}

	.subtablink a.active {
		color: #2459a0;
	}
</style>
