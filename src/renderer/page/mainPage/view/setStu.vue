<template>
	<div class="bg">
		<div class="title">学生管理</div>
		<a href="javascript:;" class="reback" @click="returnback"></a>
		<div class="setbox" ref="setbox">
			<div>
				<div class="btnlist">
					<a href="javascript:;" @click="showAddClass">新增班级</a>
					<a href="javascript:;" @click="showMatchDevice">一键配对</a>
					<a href="javascript:;" @click="showUploadStu">导入学生</a>
					<a href="javascript:;" @click="showAddStu">新增学生</a>
					<a href="javascript:;" class="c-red" @click="showDeleteAllConfirm">删除</a>
					<a href="javascript:;" class="c-red" @click="showUnbindStuConfirm">解绑</a>
					<a href="javascript:;" class="c-red" @click="showClearWhiteListConfirm">清除白名单</a>
				</div>
				<div class="flex">
					<div class="menu ">
						<a-menu @select="handleClick" style="width: 156px" :style="{height:(scrolly+120)+'px'}" mode="inline" v-model="selectedKeys" :inlineIndent="inlineIndent" class="custom-tree">
							<a-menu-item key="1">
								班级1
								<a-dropdown>
									<a class="btn"><a-icon type="ellipsis" /></a>
									<a-menu slot="overlay">
										<a-menu-item @click="editClassName()">编辑</a-menu-item>
										<a-menu-item @click="showDeleteConfirm()">删除</a-menu-item>
									</a-menu>
								</a-dropdown>
							</a-menu-item>
							<a-menu-item key="2">班级2</a-menu-item>
						</a-menu>
					</div>
					<div class="flex-1 mt15">
						<a-table
							:columns="columns"
							:dataSource="data"
							:scroll="{ x: 600, y: scrolly }"
							:rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
							size="middle"
						>
							<span slot="state" slot-scope="text"><a-badge :status="text | statusTypeFilter" :text="text | statusFilter" /></span>
							<template slot="action" slot-scope="text">
								<a href="javascript:;" @click="editClass(text.key)">编辑</a>
								<a href="javascript:;" class="c-red" @click="showDeleteConfirm">删除</a>
							</template>
						</a-table>
					</div>
				</div>
			</div>
		</div>
		<!-- 编辑班级 -->
		<a-modal title="编辑班级" v-model="isEideClassName" @ok="saveEditClassName" okText="确定" cancelText="取消">
			<a-form :form="form">
				<a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
					<a-input v-decorator="['classname', { rules: [{ required: true, message: '请输入班级名称!' }] }]" />
				</a-form-item>
			</a-form>
		</a-modal>
		<!-- 导入学生 -->
		<a-modal title="导入学生" v-model="isUploadStu" @ok="saveEditClassName" okText="确定" cancelText="取消" :okButtonProps="{ props: { disabled: fileList.length <= 0 } }">
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
		<!-- 新增班级 -->
		<a-modal title="新增班级" v-model="isAddClass" @ok="saveEditClassName" okText="确定" cancelText="取消">
			<a-form :form="form">
				<a-form-item label="状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
					<a-select v-decorator="['gender', { rules: [{ required: true, message: '请选择班级状态!' }] }]" placeholder="请选择班级状态" @change="changeClassState">
						<a-select-option value="online">在线</a-select-option>
						<a-select-option value="outline">本地</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="班级ID" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" v-if="form.getFieldValue('gender') == 'online'">
					<a-input
						v-decorator="[
							'classID',
							{
								rules: [
									{ required: true, message: '请输入班级ID!' },
									{ max: 10, message: '请输入长度不超过10位的数字!' },
									{ whitespace: true, message: '班级ID不能为空' }
								]
							}
						]"
						placeholder="请输入长度不超过10位的数字"
					/>
				</a-form-item>
				<a-form-item label="班级名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
					<a-input
						v-decorator="[
							'classname',
							{
								rules: [
									{ required: true, message: '请输入班级名称!' },
									{ max: 10, message: '请输入长度不超过10位的字符!' },
									{ whitespace: true, message: '班级名称不能为空' }
								]
							}
						]"
						placeholder="请输入长度不超过10位的字符"
					/>
				</a-form-item>
			</a-form>
		</a-modal>
		<!-- 新增学生 -->
		<a-modal title="新增班级" v-model="isAddStu" @ok="saveEditClassName" okText="确定" cancelText="取消">
			<a-form :form="form">
				<a-form-item label="学号" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
					<a-input
						v-decorator="[
							'stuCode',
							{
								rules: [
									{ required: true, message: '请输入学号!' },
									{ max: 10, message: '请输入长度不超过10位的数字!' },
									{ whitespace: true, message: '学号不能为空' }
								]
							}
						]"
						placeholder="请输入长度不超过10位的数字"
					/>
				</a-form-item>
				<a-form-item label="姓名" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
					<a-input
						v-decorator="[
							'stuname',
							{
								rules: [
									{ required: true, message: '请输入姓名!' },
									{ max: 10, message: '请输入长度不超过10位的字符!' },
									{ whitespace: true, message: '姓名不能为空' }
								]
							}
						]"
						placeholder="请输入长度不超过10位的字符"
					/>
				</a-form-item>
				<a-form-item label="答题器编号" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
					<a-input
						v-decorator="[
							'deviceID',
							{
								rules: [
									{ required: true, message: '请输入答题器编号!' },
									{ max: 10, message: '请输入长度不超过10位的数字!' },
									{ whitespace: true, message: '答题器编号不能为空' }
								]
							}
						]"
						placeholder="请输入长度不超过10位的数字"
					/>
				</a-form-item>
			</a-form>
		</a-modal>
		<!-- 一键匹配 -->
		<a-modal title="一键匹配" v-model="isMatchDevice" :footer="null" :width="600" :closable="false">
			<div class="match-device">
				<div class="flex">
					<div class="flex-1">
						<div class="loading">正在匹配…</div>
						<div class="match">
							<div class="name">周丹</div>
							<div>答题器</div>
						</div>
					</div>
					<div class="imgbox">
						<div class="title">识别码9025</div>
						<img src="../assets/img/datiqi.png" alt="" />
					</div>
				</div>
				<div class="tip">0位同学匹配成功/55位同学未匹配成功</div>
			</div>
		</a-modal>
	</div>
</template>

<script>
import vSelect from '@/page/mainPage/components/vue-select';
const columns = [
	{
		title: '序号',
		dataIndex: 'num',
		width: 60
	},
	{
		title: '学号',
		dataIndex: 'stuid',
		width: 100
	},
	{
		title: '名称',
		dataIndex: 'name',
		width: 150
	},
	{
		title: '答题器编号',
		dataIndex: 'deviceID',
		width: 150
	},
	{
		title: '配对情况',
		dataIndex: 'state',
		 width: 150,
		scopedSlots: { customRender: 'state' }
	},
	{
		title: '操作',
		key: 'operation',
		// fixed: 'right',
		width: 140,
		scopedSlots: { customRender: 'action' }
	}
];

const data = [];
for (let i = 0; i < 46; i++) {
	data.push({
		key: i,
		num: i + 1,
		stuid: i + 10002,
		name: `Edward King ${i}`,
		deviceID: `1010${i}`,
		state: i % 4 == 0 ? 0 : 1
	});
}
const statusMap = {
	0: {
		status: 'error',
		text: '未绑定'
	},
	1: {
		status: 'success',
		text: '配对成功'
	}
};
export default {
	components: {},
	data() {
		return {
			data,
			columns,
			selectedRowKeys: [],
			scrolly: 300,
			isEideClassName: false, //编辑班级名称
			isUploadStu: false, //上传学生
			isAddClass: false, //添加班级
			isAddStu: false,
			isMatchDevice: false,
			fileList: [],
			form: this.$form.createForm(this),
			selectedKeys: [],
			inlineIndent: 10
		};
	},
	mounted() {
		const that = this;
		that.scrolly = that.$refs.setbox.offsetHeight - 200;
		window.onresize = function() {
			that.scrolly = that.$refs.setbox.offsetHeight - 200;
		};
	},
	filters: {
		statusFilter(type) {
			return statusMap[type].text;
		},
		statusTypeFilter(type) {
			return statusMap[type].status;
		}
	},
	methods: {
		returnback() {
			this.$router.go(-1);
		},
		handleClick(e) {
			//console.log(this.selectedKeys)
			console.log(e);
		},
		onSelectChange(selectedRowKeys) {
			//console.log('selectedRowKeys changed: ', selectedRowKeys);
			this.selectedRowKeys = selectedRowKeys;
		},
		/* 导入学生 */
		showUploadStu() {
			this.isUploadStu = true;
		},
		/* 新增学生 */
		showAddStu() {
			this.isAddStu = true;
		},
		/* 新增班级 */
		showAddClass() {
			this.isAddClass = true;
		},
		/* 一键匹配 */
		showMatchDevice() {
			this.isMatchDevice = true;
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
			this.fileList = [...this.fileList, file];
			return false;
		},
		/* 解绑学生 */
		showUnbindStuConfirm() {
			this.$confirm({
				title: '你确定要进行解绑操作吗?',
				content: '',
				okText: '确定',
				cancelText: '取消',
				onOk() {
					console.log('OK');
				},
				onCancel() {
					console.log('Cancel');
				}
			});
		},
		/* 清除白名单 */
		showClearWhiteListConfirm() {
			this.$confirm({
				title: '你确定要进行清除白名单操作吗?',
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
		/* 确认批量删除 */
		showDeleteAllConfirm() {
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
		/* 全选 */
		onChangeAll() {},
		/* 单选 */
		onChange() {},
		/* 编辑学生 */
		editClass() {},
		/* 编辑班级 */
		editClassName() {
			this.isEideClassName = true;
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

.custom-tree /deep/ .ant-menu-item-group-title {
	position: relative;
}

.custom-tree /deep/ .ant-menu-item-group-title:hover .btn,
.custom-tree /deep/ .ant-menu-item:hover .btn {
	display: block;
}

.custom-tree /deep/ .btn {
	display: none;
	position: absolute;
	top: 0;
	right: 10px;
	width: 20px;
	height: 40px;
	line-height: 40px;
	z-index: 1050;
}
.custom-tree.ant-menu{
	background: none;
	color: #fff
}
.theme1 .custom-tree.ant-menu,.theme2 .custom-tree.ant-menu{
	color: #333;
}
.custom-tree /deep/ .btn:hover {
	-webkit-transform: scale(1.2);
	transform: scale(1.2);
	-webkit-transition: all 0.5s;
	transition: all 0.5s;
}
</style>
