<template>
	<div class="bg">
		<div class="title">编辑题目</div>
		<a href="javascript:;" class="reback" @click="returnback"></a>
		<div class="setbox" ref="setbox">
			<!-- <a-form :form="form">
				<a-form-item label="试卷名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
					<a-input
						placeholder="请输入试卷名称"
						v-decorator="[
							'testname',
							{
								rules: [{ required: true, message: '请输入试卷名称!' }, { whitespace: true, message: '试卷名称不能为空' }]
							}
						]"
					/>
				</a-form-item>
				<a-form-item label="试卷描述" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"><a-textarea placeholder="请输入试卷描述" :rows="2" /></a-form-item>
			</a-form> -->
			<div class="btnlist">
				<a href="javascript:;" @click="addQuestion">批量新增题目</a>
				<a href="javascript:;" class="c-red" @click="showDeleteAllConfirm">删除</a>
			</div>
			<a-table
				:columns="columns"
				class="mt15"
				:dataSource="data"
				:scroll="{ x: 700, y: scrolly }"
				:rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
				size="middle"
			>
				<span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
				<template slot="action" slot-scope="text, record">
					<a href="javascript:;" @click="editQuestion(record.key)">编辑</a>
					<a href="javascript:;" class="c-red" @click="showDeleteConfirm">删除</a>
				</template>
			</a-table>
		</div>
		<!-- 新增题目 -->
		<a-modal title="新增题目" v-model="isEditQuestion" @ok="saveEditQuestion" okText="确定" cancelText="取消">
			<a-form :form="form">
				<a-form-item label="题目总数" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
					<a-input-number :min="1" :max="120" placeholder="请输入不超过120的数字" v-decorator="['input-number', { initialValue: 1 }]" style="width: 373.66px" />
				</a-form-item>
				<a-form-item label="答案类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
					<a-select style="width: 32%" v-decorator="['questiontype', { rules: [{ required: true, message: '请选择题型!' }] }]" placeholder="请选择题型">
						<a-select-option value="0">数字</a-select-option>
						<a-select-option value="1">判断</a-select-option>
						<a-select-option value="2">字母</a-select-option>
					</a-select>
					<a-select
						style="width: 32%;margin-left:2%"
						v-decorator="['selecttype', { rules: [{ required: true, message: '请选择班选择类型!' }] }]"
						placeholder="请选择班选择类型"
					>
						<a-select-option value="0">单选</a-select-option>
						<a-select-option value="1">多选</a-select-option>
					</a-select>
					<a-select
						style="width: 32%;margin-left:2%"
						v-decorator="['answertype', { rules: [{ required: true, message: '请选择答案类型!' }] }]"
						placeholder="请选择答案类型"
					>
						<a-select-option value="0">A-D</a-select-option>
						<a-select-option value="1">A-F</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="答案" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
					<a-input  v-if="form.getFieldValue('questiontype')!='1'"
						v-decorator="[
							'question',
							{
								rules: [
									{ required: true, message: '请输入答题!' },
								
								]
							}
						]"
						:placeholder='form.getFieldValue("questiontype")=="0"?"请输入0-9的数字":"请输入A-F的字母"'
					/>
					<a-radio-group v-model="question" v-if="form.getFieldValue('questiontype')=='1'">
						<a-radio value="E">√</a-radio>
						<a-radio value="F">×</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="分数" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
					<a-input-number :min="1" :max="60000" placeholder="请输入不超过60000的数字" v-decorator="['input-number', { initialValue: 5 }]" style="width: 373.66px" />
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<script>
const columns = [
	{
		title: '序号',
		dataIndex: 'serial',
		width: 60,
		scopedSlots: { customRender: 'serial' }
	},
	{
		title: '题号',
		dataIndex: 'questionNum',
		width: '20%'
	},
	{
		title: '答案类型',
		dataIndex: 'answerType'
	},
	{
		title: '题目类型',
		dataIndex: 'answer',
		width: '20%'
	},
		{
		title: '分数',
		dataIndex: 'score',
		width: '10%'
	},
	{
		title: '操作',
		key: 'operation',
		fixed: 'right',
		width: 100,
		scopedSlots: { customRender: 'action' }
	}
];

const data = [];
for (let i = 0; i < 46; i++) {
	data.push({
		key: i,
		questionNum: i + 1,
		answerType: `Edward King ${i}`,
		answer:'A',
		score:i*10
	});
}
export default {
	components: {},
	data() {
		return {
			testkey: '', //试卷id
			data,
			columns,
			selectedRowKeys: [],
			scrolly: 300,
			form: this.$form.createForm(this),
			isEditQuestion: false,
			question: 'E'
		};
	},
	created() {
		this.testkey = JSON.parse(this.$route.query.key);
		console.log(this.testkey);
	},
	mounted() {
		const that = this;
		that.scrolly = that.$refs.setbox.offsetHeight - 180;
		window.onresize = function() {
			that.scrolly = that.$refs.setbox.offsetHeight - 180;
		};
	},
	methods: {
		returnback() {
			this.$router.go(-1);
		},
		/* 新增题目 */
		addQuestion() {
			this.isEditQuestion = true;
		},
		/* 编辑题目 */
		editQuestion() {
			this.isEditQuestion = true;
		},
		/*批量删除 */
		showDeleteAllConfirm() {
			this.$confirm({
				title: '你确定要批量删除这些题目吗?',
				content: '',
				okText: '确定',
				okType: 'danger',
				cancelText: '取消',
				onOk() {
					console.log('OK');
				},
				onCancel() {
					console.log('Cancel');
				}
			});
		},
		showDeleteConfirm() {
			this.$confirm({
				title: '你确定要批量删除这条题目吗?',
				content: '',
				okText: '确定',
				okType: 'danger',
				cancelText: '取消',
				onOk() {
					console.log('OK');
				},
				onCancel() {
					console.log('Cancel');
				}
			});
		},
		onSelectChange() {},
		
		/* 保存编辑题目 */
		saveEditQuestion() {}
	}
};
</script>
<style scoped="scoped" lang="scss">
@import '../assets/css/set.scss';
/deep/ .ant-table td {
	white-space: nowrap;
	// padding: 10px !important;
}
</style>
