<template>
	<div class="bg" v-if="visible">
		<div class="upload-bd">
			<a href="javascript:;" class="close" @click="close()"></a>
			<div>
				<div class="upload-title">堂测标准答案设置</div>
				<div class="upload-btnbar flex flex-pack-justify flex-align-center">
					<div>
						<label>标题</label>
						<input type="text" name="" id="" value="" placeholder="请输入标题" v-model.trim="titleName" class="ant-input" style="width: 200px;" />
					</div>

					<div class="btnlist">
						<div class="upload">
							<span>导入Excel标准答案</span>
							<input type="file" @change="uploadFile" id="upload" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
						</div>
					</div>
				</div>
				<div class="mt10">
					<a-form :form="form" autocomplete="off" class="flex flex-align-top">
						<a-row :gutter="24" class="mb10 flex-1">
							<a-col :span="6">
								<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="小题总数">
									<a-input-number v-decorator="['totalnum',{rules: [{ required: true, message: '请输入小题总数' }]}]" :min="1" class="w100" />
								</a-form-item>
							</a-col>
							<a-col :span="6">
								<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="题目得分">
									<a-input-number v-decorator="['totalscore',{rules: [{ required: true, message: '请输入题目得分' }]}]" :min="0" class="w100" />
								</a-form-item>
							</a-col>
							<a-col :span="6">
								<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="题目类型">
									<a-select v-decorator="['totaltype',{rules: [{ required: true, message: '请选择题目类型' }]}]" @change="changeQuestionType">
										<a-select-option :value="item.value" v-for="(item,index) in totaltypeList" :key="index">{{item.name}}</a-select-option>
									</a-select>
								</a-form-item>
							</a-col>
							<a-col :span="6">
								<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="答案">
									<a-input placeholder="题目答案" v-decorator="[ 'totaltrueanswer',{rules: [{pattern:pattern, message: '请输入正确的答案' }]}]"
									 @change="changetotaltrueanswer" />
								</a-form-item>
							</a-col>
						</a-row>
						<a-button class="ant-btn-success ml20" style="margin-top: 3px;" @click="addlist()">确认插入</a-button>
					</a-form>
					<!--表格-->
					<a-table :columns="columns" :dataSource="list" bordered class="mt20" bordered size="middle" :pagination="false">
						<span slot="serial" slot-scope="text, record, index">
							{{ index + 1 }}
						</span>
						<a-select slot="questionType" slot-scope="text,record" v-model="record.questionType" class="w100" @change="changeOneQuestionType(record)">
							<a-select-option :value="item.value" v-for="(item,index) in totaltypeList" :key="index">{{item.name}}</a-select-option>
						</a-select>
						<a-input-number :min="1" class="w100" slot="score" slot-scope="text,record" v-model="record.score" />
						<a-input placeholder="题目答案" slot="trueAnswer" class="w100" slot-scope="text,record" v-model="record.trueAnswer"
						 @change="changeOnetrueanswer(record)" />
						<span slot="operation" slot-scope="text,record,index" class="operation">
							<a href="javascript:;" title="删除" class="del" @click="showDeleteConfirm(record,index)">删除</a>
						</span>
					</a-table>
					<!-- totalbar -->
					<div class="totalbar"><span>总题数{{total}}题，总分{{totalScore}}分</span> <a href="javascript:;" class="btn" @click="batchSave">批量保存</a></div>
				</div>
			</div>
		</div>
	</div>
	</div>
</template>

<script>
	const columns = [{
			title: '题号',
			scopedSlots: {
				customRender: 'serial'
			},
			width: 100
		}, {
			title: '题目类型',
			dataIndex: 'questionType',
			key: 'questionType',
			width: 250,
			scopedSlots: {
				customRender: 'questionType'
			},
		},
		{
			title: '正确答案',
			dataIndex: 'trueAnswer',
			key: 'trueAnswer',
			width: 250,
			scopedSlots: {
				customRender: 'trueAnswer'
			},
		},
		{
			title: '得分',
			key: 'score',
			dataIndex: 'score',
			scopedSlots: {
				customRender: 'score'
			},
		},

		{
			title: '操作',
			key: 'operation',
			dataIndex: 'operation',
			scopedSlots: {
				customRender: 'operation'
			},
			align: 'center',
			width: 100,

		}
	];
	import api from '@/page/mainPage/api';
	import {
		postActionUpload
	} from '@/page/mainPage/api';
	export default {
		data() {
			return {
				labelCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 10
					},
				},
				wrapperCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 14
					},
				},
				visible: false,
				confirmLoading: false,
				totaltypeList: [{
						value: '1',
						name: '单选字母'
					},
					{
						value: '2',
						name: '单题判断'
					},
					{
						value: '3',
						name: '单选数字'
					},
					{
						value: '4',
						name: '多选'
					}
				],
				mdl: {},
				form: this.$form.createForm(this),
				columns: columns,
				titleCode: '',
				list: [],
				record: {},
				pattern: /^[E-F]{1}$/,
				listmap: {},
				titleName: '',
				sendInfo: {},
				type: ''
			};
		},

		created() {
			this.sendInfo = sessionStorage.getItem('sendInfo') ? JSON.parse(sessionStorage.getItem('sendInfo')) : null;
		},
		computed: {
			total: function() {
				return this.list.length;
			},
			totalScore: function() {
				let count = 0;
				if (this.list.length > 0) {
					count = this.list.reduce((count, item) => count += item.score - 0, 0);
				}
				return count;
			}
		},

		methods: {
			show(type) {
				this.visible = true;
				this.type = type
			},
	
			close() {
				this.visible = false;
				this.list=[];
				this.form.resetFields();
				this.$emit('close');
			},

			/* 确认是否删除 */
			showDeleteConfirm(record, index) {
				let $me = this;
				this.$confirm({
					title: '你确定要删除这条吗?',
					content: '',
					okText: '确定',
					cancelText: '取消',
					class: 'confirmbox',
					okType: 'danger',
					onOk() {
						$me.list.splice(index, 1)
					},
					onCancel() {},
				});
			},
			addlist() {
				this.form.validateFields((err, values) => { // 验证表单没错误
					if (!err) {
						// console.log('form values', values)
						var totalnum = values['totalnum'];
						for (var i = 0; i < totalnum; i++) {
							var item = {
								questionType: values['totaltype'],
								score: values['totalscore'],
								trueAnswer: values['totaltrueanswer'],
								maxNum: values['maxNum'],
							}
							let list = [...this.list, item];
							this.list.push(item)
						}
					}
				})
			},
			changeQuestionType(value) {
				if (value == 1) {
					this.pattern = /^[A-D]{1}$/
				} else if (value == 2) {
					this.pattern = /^[E-F]{1}$/
				} else if (value == 3) {
					this.pattern = /^[0-9]{1}$/
				} else {
					this.pattern = /^(?!.*([A-F]).*\1)[A-F]{2,6}$/
				}
				this.form.setFieldsValue({
					totaltrueanswer: ''
				})
			},
			changeOneQuestionType(item) {
				item.trueAnswer = ''
			},
			changetotaltrueanswer(e) {
				console.log(e.target.value)
				e.target.value = e.target.value.toLocaleUpperCase().split('').sort().join('')
			},
			changeOnetrueanswer(record) {
				var answerreg = null;
				if (record.questionType == 1) {
					answerreg = /^[A-D]{1}$/;
				} else if (record.questionType == 2) {
					answerreg = /^[E-F]{1}$/;
				} else if (record.questionType == 3) {
					answerreg = /^[0-9]{1}$/
				} else {
					answerreg = /^(?!.*([A-F]).*\1)[A-F]{2,6}$/
				}
				if (answerreg && record.trueAnswer) {
					record.trueAnswer = record.trueAnswer.toLocaleUpperCase().split('').sort().join('')
					if (!answerreg.test(record.trueAnswer)) {
						record.trueAnswer = '';
						this.$message.error('请输入正确的答案')

					}
				}

			},
			uploadFile() {
				const $me = this;
				var file = $('#upload')[0];

				if (file.files[0] && $me.sendInfo) {
					var strFileName = $('#upload')
						.val()
						.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi, '$1'); //正则表达式获取文件名，不带后缀
					var FileExt = $('#upload')
						.val()
						.replace(/.+\./, ''); //正则表达式获取后缀
					var formData = new FormData();
					if (FileExt != 'xls' && FileExt != 'xlsx') {
						$me.$toast.center('请上传excel文件');
						return false;
					}
					if (!$me.titleName) {
						$me.titleName = strFileName;
					}
					formData.append('file', file.files[0]);
					formData.append('titleName', $me.titleName);
					formData.append('classCode', $me.sendInfo.classCode);
					formData.append('className', $me.sendInfo.className);
					formData.append('subjectCode', $me.sendInfo.subjectCode);
					formData.append('subjectName', $me.sendInfo.subjectName);
					formData.append('type', $me.type);
					postActionUpload(api.importQuesrions, formData).then(da => {
						if (da.ret == 'success') {
							$me.$toast.center('上传成功');
							$me.close();
						} else {
							$me.$toast.center(da.data.message);
						}
					})
				
					file.value = '';
				} else {
					this.$toast.center('请选择文件');
				}
			},
			/* 批量保存 */
			batchSave() {
				const $me = this;
				$me.isSave = false;
				if (!$me.titleName) {
					this.$toast.center('请输入标题');
					return false;
				}
				if (this.list.length == 0) {
					this.$toast.center('请导入或者手动添加题目');
					return false;
				}
				//console.log(this.dataSource)
				let questions = [];
				for (var i = 0; i < this.list.length; i++) {
					var item = this.list[i];
					if (!item.questionType || !item.score || !item.trueAnswer) {
						this.$toast.center('请完善题目信息');
						return false;
					}
					var param = {
						questionId:i+1,
						questionType: item.questionType,
						score: item.score,
						trueAnswer: item.trueAnswer

					};

					questions.push(param);
				}

				var param = {
					classCode: $me.sendInfo.classCode,
					className: $me.sendInfo.className,
					subjectCode: $me.sendInfo.subjectCode,
					subjectName: $me.sendInfo.subjectName,
					titleCode: $me.titleCode,
					titleName: $me.titleName,
					questions: questions,
					type: this.type
				};
				this.$postAction(api.uploadTestPaper, param).then(da => {
					if (da.ret == 'success') {
						$me.$toast.center('保存成功');
						$me.close();
					} else {
						$me.$toast.center(da.data.message);
					}
				});
			},

		}
	};
</script>

<style scoped="scoped" lang="scss">
	.ml20 {
		margin-left: 20px;
	}

	.bg {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
	}

	// .bg .mask {
	// 	background: rgba(0, 0, 0, 0.4);
	// 	height: 100%;
	// 	width: 100%;
	// }
	.bg>.upload-bd {
		position: absolute;
		left: 60px;
		right: 60px;
		// transform: translateX(-50%);
		top: 100px;
		bottom: 40px;
		background: #fff;
		border-radius: 10px;
		padding: 40px 0;
		box-sizing: border-box;
		box-shadow: 0 0 10px rgba($color: #2459a0, $alpha: .3);
	}

	.bg>.upload-bd>div {
		overflow-y: auto;
		height: 100%;
		padding: 0 40px;
	}

	.ant-btn-success,
	.ant-btn-success:hover,
	.ant-btn-success:active {
		background: #3bb1c2;
		color: #fff;
		boder: 1px solid #3bb1c2
	}

	.bg>.upload-bd .upload-title {
		color: #2459a0;
		font-size: 16px;
		line-height: 30px;
		margin-bottom: 10px;
		text-align: left;
		border-bottom: 1px solid #cfdbec;
	}

	.bg>.upload-bd .upload-btnbar .upload,
	.totalbar .btn {
		position: relative;
		overflow: hidden;
		color: #fff;
		font-size: 16px;
		background: #3bb1c2;
		border-radius: 6px;
		padding: 2px 10px;
		display: inline-block;
		margin-left: 10px;
	}

	.bg>.upload-bd .upload-btnbar .upload input[type='file'] {
		position: absolute;
		top: 0;
		right: 0;
		font-size: 400px;
		opacity: 0;
	}

	.w100 {
		width: 100%;
	}

	/deep/ .ant-table-wrapper .operation {
		a {
			&.del {
				color: #d43030;
			}

			&.add {
				color: #00baad;
			}
		}
	}

	/deep/ .ant-form-item {
		margin-bottom: 0;
	}

	.link {
		color: #1890ff;
	}

	.close {
		color: #fff;
		font-size: 40px;
		position: absolute;
		right: 20px;
		top: 20px;
		display: block;
		width: 16px;
		height: 16px;
		text-align: center;
		background: url(../../assets/img/close2.png);
	}

	.totalbar {
		position: absolute;
		right: 40px;
		bottom: 5px;
		line-height: 28px
	}

	.totalbar span,
	.totalbar .btn {
		vertical-align: middle;
		display: inline-block;
	}
</style>
