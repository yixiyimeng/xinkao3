<template>
	<div v-if="showVote" class="bg">
		<a href="javascript:;" class="reback" @click="returnback" v-if="viewState != 1"></a>
		<div class="setbox" v-if="viewState == 0">
			<div class="voteform">
				<a-form :form="form">
					<a-form-item label="评分主题" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<a-input
							class="lginput"
							v-decorator="[
								'titleName',
								{
									rules: [{ required: true, whitespace: true, message: '请输入评分主题!' }, { max: 20, message: '主题字数不能超过20!' }],
									getValueFromEvent: event => {
										return event.target.value.replace(/\s+/g, '');
									}
								}
							]"
							placeholder="请输入评分主题"
							allowClear
							size="large"
						/>
					</a-form-item>
					<a-form-item label="评分描述" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
						<a-textarea
							class="textarea"
							placeholder="请输入评分描述"
							:rows="4"
							v-decorator="['describe', { rules: [{ required: true, whitespace: true, message: '请输入评分描述!' }, { max: 100, message: '描述字数不能超过100!' }] }]"
						/>
					</a-form-item>
				</a-form>
				<a-form :form="form2" layout="inline">
					<a-form-item
						:label="index == 0 ? '评分对象' : ''"
						:label-col="{ span: index == 0 ? 13 : 0 }"
						:wrapper-col="{ span: index == 0 ? 11 : 24 }"
						:style="{ marginRight: index == 0 ? '20px' : '' }"
						v-for="(item, index) in objlist"
						:key="item"
					>
						<div class="objitem">
							<a-input
								v-decorator="[
									'objs[' + item + ']',
									{
										rules: [{ required: true, whitespace: true, message: '请输入评分对象!' }, { max: 5, message: '字数最多5个!' }],
										getValueFromEvent: event => {
											return event.target.value.replace(/\s+/g, '');
										}
									}
								]"
								placeholder="评分对象"
								allowClear
								size="large"
								class="sminput"
							/>
							<a-icon type="minus-circle" @click="delObj(item)" v-if="objlist.length > 1" />
						</div>
					</a-form-item>
				</a-form>
				<a href="javascript:;" class="addObj" @click="addObj">
					<a-icon type="plus-circle" />
					<span>添加对象</span>
				</a>
				<p class="votetip">说明：评分范围为0-9；标题限制字数：20；描述限制字数：100；评分对象限制字数：5;</p>
			</div>
		</div>
		<div class="voteChart " v-if="viewState != 0" :class="{ setbox: isChart }">
			<div class="flex flex-align-center">
				<div class="voteInfo">
					<div>
						<div class="votetip">评分范围为0-9</div>
						<div class="flex">
							<label>评分主题:</label>
							<span class="flex-1">{{ voteInfo.titleName }}</span>
						</div>
						<div class="flex">
							<label>评分对象:</label>
							<div class="flex-1">
								<span class="obj" v-for="(item, index) in voteInfo.objs" :key="index">({{ index + 1 }}){{ item }}</span>
							</div>
						</div>
						<div class="flex">
							<label>评分描述:</label>
							<span class="flex-1">{{ voteInfo.describe }}</span>
						</div>
					</div>
				</div>
				<div class="flex-1" v-if="isChart"><v-chart :options="polar" autoresize class="chartbox"></v-chart></div>
			</div>
		</div>
		<div class="btnbar">
			<a href="javascript:;" class="startClass" @click="startScore" v-if="viewState == 0">开始评分</a>
			<a href="javascript:;" class="startClass" @click="stopScore" v-if="viewState == 1">结束评分</a>
		</div>
	</div>
</template>

<script>
let maxId = 0;
import api from '@/page/mainPage/api';
import ECharts from 'vue-echarts/components/ECharts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/polar';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title.js';
import selectNamelist from '@/page/mainPage/components/selectNamelist';
import { isRepeat } from '@/page/mainPage/utils/base';
var ChartfontSize = 20;
var ChartWidth = document.body.offsetWidth <= 1280 ? 20 : 35;
export default {
	components: {
		'v-chart': ECharts,
		selectNamelist
	},
	data() {
		return {
			form: this.$form.createForm(this),
			form2: this.$form.createForm(this),
			showVote: false,
			objlist: [0],
			isAnswering: false,
			isChart: false,
			voteInfo: {},
			viewState: 0,
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
					textStyle: {
						fontSize: 20
					},
					data: []
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				color: ['#c7615d', '#e0b088', '#176bab', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
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
					min: 0
				},
				series: []
			},
			chartlist: []
		};
	},
	created() {},
	methods: {
		addObj() {
			if (this.objlist.length >= 5) {
				return false;
			}
			this.objlist.push(++maxId);
		},
		delObj(key) {
			let list = this.objlist.filter(item => item !== key);
			this.objlist = list;
		},
		show() {
			this.isChart = false;
			this.isAnswering = false;
			this.viewState = 0;
			maxId = 0;
			this.objlist = [0];
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
					var param = values;
					this.form2.validateFields((err, values) => {
						if (!err) {
							var param2 = values.objs.filter(item => item != null);
							if (isRepeat(param2)) {
								$me.$message.error('请输入不同的评分对象');
								return false;
							}
							var voteInfo = Object.assign({}, param, {
								objs: param2
							});
							$me.$postAction(api.startScore, voteInfo).then(da => {
								if (da && da.ret == 'success') {
									$me.voteInfo = voteInfo;
									$me.isAnswering = true;
									$me.viewState = 1;
									$me.$emit('startScore', 6);
								}
							});
						}
					});
				}
			});
		},
		stopScore() {
			const $me = this;
			$me.$postAction(api.stopScore).then(da => {
				if (da && da.ret == 'success') {
					$me.getScoreResult();
					$me.$emit('stopScore');
				}
			});
		},
		/* 获取评分结果 */
		getScoreResult() {
			const $me = this;
			$me.$postAction(api.getScoreResult).then(da => {
				if (da && da.ret == 'success') {
					/* 投票结果 */
					$me.isChart = true;
					$me.viewState = 2;
					// $me.isAnswering = false;
					var data = da.data;
					this.chartlist = data;
					var objtitle = []; //投票对象
					var title = ['总分', '人数', '平均分']; //x轴标题
					var serieslist = [];
					ChartWidth = document.body.offsetWidth <= 1280 ? 20 : 35;
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
							barWidth: ChartWidth,
							data: [item.totalScore, item.number, item.averageScore]
						};
						serieslist.push(seriesitem);
					}

					var polar = Object.assign({}, this.polar);
					polar.series = serieslist;
					polar.legend.data = objtitle;
					polar.xAxis.data = title;
					this.polar = Object.assign({}, polar);
				}
			});
		}
	}
};
</script>

<style scoped="scoped" lang="scss">
@import '../assets/css/set.scss';

.setbox {
	/deep/ .ant-form-item {
		margin-bottom: 10px;
	}

	/deep/ .ant-form-inline .ant-form-item {
		margin-right: 0;
	}
}
</style>
