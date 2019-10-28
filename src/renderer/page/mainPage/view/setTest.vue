<template>
	<div class="bg">
		<div class="title">试卷管理</div>
		<a href="javascript:;" class="reback" @click="returnback"></a>
		<div class="setbox" ref="setbox">
			<div>
				<div class="btnlist">
					<a href="javascript:;" @click="showAddTest">新增试卷</a>
					<a href="javascript:;" @click="showUploadTest">导入试卷</a>
					<a href="javascript:;" class="c-red" @click="showDeleteAllConfirm">删除</a>
				</div>
				<a-table
					:columns="columns"
					class="mt15"
					:dataSource="data"
					:scroll="{ y: scrolly }"
					:rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
					size="middle"
				>
					<template slot="action" slot-scope="text">
						<a href="javascript:;" @click="showEditTest(text.key)">编辑试卷</a>
						<a href="javascript:;" @click="editQustion(text.key)">编辑题目</a>
						<a href="javascript:;" class="c-red" @click="showDeleteConfirm">删除</a>
					</template>
				</a-table>
			</div>
		</div>
		<!-- 编辑班级 -->
		<!-- <a-modal title="编辑班级" v-model="isEideClassName" @ok="saveEditClassName" okText="确定" cancelText="取消">
			<a-form :form="form">
				<a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
					<a-input v-decorator="['classname', { rules: [{ required: true, message: '请输入班级名称!' }] }]" />
				</a-form-item>
			</a-form>
		</a-modal> -->
		<!-- 新增试卷 -->
		<a-modal title="新增试卷" v-model="isAddTest" @ok="saveEditClassName" okText="确定" cancelText="取消">
			<a-form :form="form">
				<a-form-item label="科目" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
					<a-select v-decorator="['subject', { rules: [{ required: true, message: '请选择班级状态!' }] }]" placeholder="请选择科目" @change="changeClassState">
						<a-select-option value="0">语文</a-select-option>
						<a-select-option value="1">数学</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="试卷名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
					<a-input
						v-decorator="[
							'classID',
							{
								rules: [{ required: true, message: '请输入试卷名称!' }, { whitespace: true, message: '试卷名称不能为空' }]
							}
						]"
						placeholder="请输入试卷名称"
					/>
				</a-form-item>
				<a-form-item label="试卷描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }"><a-textarea placeholder="请输入试卷描述" :rows="2" /></a-form-item>
			</a-form>
		</a-modal>
		<!-- 导入试卷 -->
		<a-modal title="导入试卷" v-model="isUploadTest"  okText="确定" cancelText="取消" >
			<a-form :form="form">
				<a-form-item label="上传文件" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
					<a-upload :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload">
						<a-button>
							<a-icon type="upload" />
							选择上传文件
						</a-button>
					</a-upload>
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<script>
const columns = [
	{
		title: '序号',
		dataIndex: 'num',
		width: 60
	},
	{
		title: '名称',
		dataIndex: 'name',
		width: 150
	},
	{
		title: '科目',
		dataIndex: 'subject',
		width: 120
	},
	{
		title: '描述',
		dataIndex: 'mark',
		// width: 200
	},
	{
		title: '操作',
		key: 'operation',
		// fixed: 'right',
		width: 180,
		scopedSlots: { customRender: 'action' }
	}
];

const data = [];
for (let i = 0; i < 46; i++) {
	data.push({
		key: i,
		num: i + 1,
		name: `Edward King ${i}`,
		subject: '语文',
		mark: `London, Park Lane no. ${i}`
	});
}

export default {
	components: {},
	data() {
		return {
			data,
			columns,
			selectedRowKeys: [],
			scrolly: 300,
			isUploadTest: false, //上传试卷
			isAddTest: false, //添加试卷
			isAddStu: false,
			isMatchDevice: false,
			fileList: [],
			form: this.$form.createForm(this),
		};
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
		onSelectChange(selectedRowKeys) {
			//console.log('selectedRowKeys changed: ', selectedRowKeys);
			this.selectedRowKeys = selectedRowKeys;
		},
		/* 导入学生 */
		showUploadTest() {
			this.isUploadTest = true;
		},
		/* 新增试卷 */
		showAddTest() {
			this.isAddTest = true;
		},
		showEditTest() {
			this.isAddTest = true;
		},
		/* 删除文件 */
		handleRemove(file) {
			const index = this.fileList.indexOf(file);
			const newFileList = this.fileList.slice();
			newFileList.splice(index, 1);
			this.fileList = newFileList;
		},
		/* 阻止默认上传 */
		beforeUpload(file) {
			console.log(12);
			this.fileList = [...this.fileList, file];
			return false;
		},
		/* 确认批量删除 */
		showDeleteAllConfirm() {
			/* 判断长度 */
			if (this.selectedRowKeys.length <= 0) {
				this.$message.warn('请至少选择一条数据');
				return false;
			}
			this.$confirm({
				title: '你确定要批量删除这些学生吗?',
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
		/* 确认删除 */
		showDeleteConfirm() {
			this.$confirm({
				title: '你确定要删除吗?',
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
		/* 编辑题目 */
		editQustion(key) {
			this.$router.push({
				path: 'editQut',
				query: { key: key }
			});
		},
		/* 保存班级班级名称 */
		saveEditClassName(e) {
			e.preventDefault();
			this.form.validateFields((err, values) => {
				if (!err) {
					//console.log('Received values of form: ', values);
					this.isEideClassName = false;
				}
			});
		},

		checkfileListLen(rule, value, callback) {
			if (this.fileList.length > 0) {
				console.log(this.fileList.length);
				callback();
				return;
			}
			callback('Price must greater than zero!');
		},
		changeClassState() {}
	}
};
</script>
<style scoped="scoped" lang="scss">
@import '../assets/css/set.scss';

</style>
