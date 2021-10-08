<template>
	<div class="setbox" v-if="isShow">
		<div ref="mainbox">
			<div v-if="viewState == 0" class="tablebox" ref="chartlebox">
				<div class="flex flex-pack-justify">
					<span>班级：{{ classAnswerMsg.className }}</span>
					<a-space :size="20">
						<span>试卷:{{ classAnswerMsg.classProject }}</span>
						<span>测试时间:{{ classAnswerMsg.testStartTime }}</span>
					</a-space>
				</div>
				<div class="flex flex-pack-justify mt10">
					<a-space :size="20">
						<span>
							考试人数:
							<strong style="color: #2459a0;">{{ classAnswerMsg.totalStu }}人</strong>
						</span>
						<span>
							平均分:
							<strong style="color: #ffd941;">{{ classAnswerMsg.averageStore }}</strong>
						</span>
						<span>
							最高分:
							<strong style="color: rgb(212, 48, 48);">{{ classAnswerMsg.maxScore }}</strong>
						</span>
						<span>
							最低分:
							<strong style="color: #2459a0;">{{ classAnswerMsg.minScore }}</strong>
						</span>
					</a-space>
				</div>
				<a-table rowKey="stuCode" class="mt10" style="background: #fff; " :columns="countcolumns" :dataSource="stuPersonalMsgList" size="middle" :pagination="false">
					<span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
					<a href="javascript:;" slot="stuName" slot-scope="text, record, index" @click="showStuDetail(record)">{{ text }}</a>
				</a-table>
				<!-- 题目答题详情 -->
				<a-table class="mt20" rowKey="questionId" style="background: #fff;" :columns="quecolumns" :dataSource="accuracyMsgList" size="middle" :pagination="false">
					<span slot="serial" slot-scope="text, record, index">{{ text }}</span>
					<span slot="questionType" slot-scope="text, record, index">{{ text | typefilter }}</span>
					<div slot="answerTrueCount" slot-scope="text, record, index">
						<strong>
							<a style="color: #87d068; display: block;" v-if="text > 0" href="javascript:;" @click="showTrueStuList(record)">{{ text }}</a>
							<span v-else>0</span>
						</strong>
					</div>
					<div slot="answerErrCount" slot-scope="text, record, index">
						<strong>
							<a style="color: #f00; display: block;" v-if="text > 0" href="javascript:;" @click="showErrStuList(record)">{{ text }}</a>
							<span v-else>0</span>
						</strong>
					</div>
					<div slot="chooseAccuracy" slot-scope="text, record, index">
						<span
							:style="{ color: record.tureAnswer.includes(key) ? 'rgb(0, 160, 149)' : 'color: rgba(0, 0, 0, 0.65);' }"
							style="display: inline-block; margin: 0 10px;"
							v-for="(value, key, index) in text"
							:key="index"
						>
							{{ key | Answerfilter(record) }}:{{ (value * 10000) / 100 + '%' }}
						</span>
					</div>
					<span slot="trueAnswer" slot-scope="text, record, index">{{ text | Answerfilter(record) }}</span>
				</a-table>
			</div>
			<div v-if="viewState == 1" ref="tablebox" class="tablebox">
				<div>
					姓名：
					<span>{{ studentInfo ? studentInfo.stuName : '' }}</span>
				</div>
				<a-table rowKey="questionId" :columns="columns" :dataSource="dataSource" :scroll="{ y: scrolly }" size="middle" :pagination="false">
					<span slot="serial" slot-scope="text, record, index">{{ text }}</span>
					<span slot="questionType" slot-scope="text, record, index">{{ text | typefilter }}</span>
					<a-tag slot="answer" slot-scope="text, record, index" v-if="text" :color="record.result ? 'rgb(0, 160, 149)' : 'rgb(212, 48, 48)'">
						{{ text | Answerfilter(record) }}
					</a-tag>
					<span slot="answer" v-else style="color: #f00;">--</span>
					<span slot="trueAnswer" slot-scope="text, record, index">{{ text | Answerfilter(record) }}</span>
				</a-table>
			</div>
		</div>
	</div>
</template>

<script>
let countcolumns = [
	{
		title: '#',
		scopedSlots: {
			customRender: 'serial'
		},
		align: 'center',
		width: 100
	},
	{
		title: '姓名',
		dataIndex: 'stuName',
		key: 'stuName',
		scopedSlots: {
			customRender: 'stuName'
		}
	},
	{
		title: '排名',
		key: 'stuRank',
		dataIndex: 'stuRank'
	},
	{
		title: '客观题得分',
		key: 'grossScore',
		dataIndex: 'grossScore'
	}
];
let quecolumns = [
	{
		title: '题号',
		dataIndex: 'questionId',
		align: 'center',
		width: 100,
		scopedSlots: {
			customRender: 'serial'
		}
	},
	{
		title: '题目类型',
		dataIndex: 'questionType',
		align: 'center',
		scopedSlots: {
			customRender: 'questionType'
		}
	},
	{
		title: '正确答案',
		dataIndex: 'tureAnswer',
		align: 'center',
		key: 'tureAnswer',
		scopedSlots: {
			customRender: 'trueAnswer'
		}
	},
	{
		title: '正确率',
		dataIndex: 'accuracy',
		align: 'center',
		key: 'accuracy',
		customRender: text => {
			return (text * 10000) / 100 + '%';
		}
	},
	{
		title: '正确人数',
		dataIndex: 'answerTrueCount',
		key: 'answerTrueCount',
		align: 'center',
		scopedSlots: {
			customRender: 'answerTrueCount'
		}
	},
	{
		title: '错误人数',
		dataIndex: 'answerErrCount',
		key: 'answerErrCount',
		align: 'center',

		scopedSlots: {
			customRender: 'answerErrCount'
		}
	},
	{
		title: '答题占比',
		key: 'chooseAccuracy',
		dataIndex: 'chooseAccuracy',
		width: '30%',
		scopedSlots: {
			customRender: 'chooseAccuracy'
		}
	}
];

const columns = [
	{
		title: '题号',
		dataIndex: 'questionId',
		width: 100,
		align: 'center',
		scopedSlots: {
			customRender: 'serial'
		}
	},
	{
		title: '题目类型',
		dataIndex: 'questionType',
		width: '25%',
		scopedSlots: {
			customRender: 'questionType'
		}
	},
	{
		title: '按键答案',
		dataIndex: 'answer',
		align: 'center',
		width: '25%',
		scopedSlots: {
			customRender: 'answer'
		}
	},
	{
		title: '正确答案',
		dataIndex: 'trueAnswer',
		align: 'center',
		width: '25%',
		scopedSlots: {
			customRender: 'trueAnswer'
		}
	},
	{
		title: '得分',
		dataIndex: 'score',
		width: 100
	}
];
import api from '@/page/mainPage/api';
export default {
	components: {},
	data() {
		return {
			isShow: false,
			list: [],
			scrolly: 100,
			viewState: 0,
			columns,
			countcolumns,
			quecolumns,
			classAnswerMsg: {}, //班级整体作答情况
			accuracyMsgList: [], //班级整体作答列表
			stuPersonalMsgList: [], //学生成绩单统计
			presonalAnswerMsg: [], //学生作答情况
			stulist: [], //回答正确或者错误的学生名单
			dataSource: [], //学生按键详情
			studentInfo: null
		};
	},
	mounted() {},
	methods: {
		show() {
			this.list = [];
			this.viewState = 0;
			this.classAnswerMsg = {};
			this.dataSource = [];
			this.isShow = true;
			this.setDetailslist();
		},
		hide() {
			this.isShow = false;
		},
		setDetailslist() {
			this.$postAction(api.getHomeWorkAnswerMsg).then(da => {
				if (da && da.ret == 'success' && da.data) {
					this.viewState = 0;
					this.classAnswerMsg = { ...da.data.classAnswerMsg };
					this.stuPersonalMsgList = [...da.data.stuRankMsgList];
					this.presonalAnswerMsg = { ...da.data.presonalAnswerMsg };
					this.accuracyMsgList = [...da.data.detailMsg];
				}
			});
		},
		returnback() {
			if (!this.viewState) {
				this.hide();
			} else {
				this.viewState = 0;
			}
		},
		showStuDetail(record) {
			this.viewState = 1;
			this.studentInfo = record;
			this.dataSource = this.presonalAnswerMsg[record.stuCode];
			let that = this;
			this.$nextTick(() => {
				that.scrolly = that.$refs.tablebox.offsetHeight - 100;
				window.onresize = function() {
					that.scrolly = that.$refs.tablebox.offsetHeight - 100;
				};
			});
		},
		showTrueStuList(record) {
			this.$emit('showNamelist', record.answerTrueStuMsgList);
		},
		showErrStuList(record) {
			this.$emit('showNamelist', record.answerErrStuMsgList);
		}
	},
	destroyed() {
		window.onresize = null;
	},
	filters: {
		typefilter(value) {
			var str = '';
			switch (value) {
				case '1': {
					str = '单题单选-字母';
					break;
				}
				case '2': {
					str = '单题单选-判断';
					break;
				}
				case '3': {
					str = '单题单选-数字';
					break;
				}
				case '4': {
					str = '单题多选';
					break;
				}
			}
			return str;
		},
		Answerfilter(value, record) {
			var str = value;
			var isJudgment = record && record.questionType == 2;
			if (isJudgment) {
				switch (value) {
					case 'true':
					case 'E': {
						str = '√';
						break;
					}
					case 'false':
					case 'F': {
						str = '×';
						break;
					}
				}
			}
			if (str == '') {
				str = '--';
			}
			return str;
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

		& > div {
			width: 0;
			height: 100%;
			border-radius: 2px;
		}

		& > span {
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

			& > div {
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
		background: rgba(255, 255, 255, 0.7);

		& > div {
			height: 100%;
			overflow: hidden;

			& > div {
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

			& > div {
				height: 100%;
				overflow: hidden;

				& > div {
					height: 100%;
				}
			}
		}

		& > .title {
			height: 38px;
			padding-left: 117px;
			line-height: 38px;
			font-size: 23px;
			top: 83px;
			left: 75px;
		}
	}

	.getPaper {
		background: rgba($color: #07f8ff, $alpha: 0.3);
		border: 1px solid #07f8ff;
		color: #fff;
		top: 83px;
	}

	.userlist li {
		background: rgba($color: #07f8ff, $alpha: 0.3);
		border: 1px solid #07f8ff;
		font-size: 14px;
		color: #fff;

		.progressbar {
			background: #fff;
			border-radius: 4px;
			box-shadow: inset 0 0 10px rgba($color: #3f9be1, $alpha: 0.28);
			color: #336699;
			font-size: 11px;

			& > div {
				background: #07f8ff;
			}
		}
	}
}

.theme4 .setbox {
	bottom: 120px;
	width: 80%;

	& > div {
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

					& > div {
						background: #ffd941;
					}
				}
			}
		}

		& > div {
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
}

.subtablink a {
	color: #999;
	text-decoration: none;
}

.subtablink a.active {
	color: #2459a0;
}
.tablebox {
	overflow: auto;
	margin: 10px 0;
	padding: 0 40px;
	font-size: 20px;
}
</style>
