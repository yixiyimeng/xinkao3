<template>
	<div class="bg" v-if="showHomework">
		<a href="javascript:;" class="reback" @click="returnback"></a>
		<div class="setbox">
			<div style="padding-bottom: 0;">
				<div class="modbox flex flex-v" ref="modbox" style="margin: 0 20px; height: 100%;">
					<div class="subtitle flex flex-pack-justify flex-align-center">
						<div><img src="../assets/img/gou.png" alt="" v-if="theme!='theme4'" />
							<img src="../assets/img/gou2.png" alt="" v-if="theme=='theme4'" />
							<span class="ml10">请选择作业</span></div>
						<div>
							<!-- <div class="subtablink">
								<a href="javascript:;" @click="changeType(1)" :class="{'active':type==1}">普通模式</a>
								<span>|</span>
								<a href="javascript:;" @click="changeType(2)" :class="{'active':type==2}">套题模式</a>
							</div> -->
							<div  class="addBtn">
								<span>导入Excel标准答案</span>
								<input type="file" @change="addPaper" id="upload" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
							</div>
							<!-- <a href="javascript:;" class="addBtn" @click="addPaper">导入作业</a> -->
						</div>
					</div>
					<div class="tablelist mt20 flex-1" ref="setbox">
						<a-table style="height: 100%;" rowKey="titleCode" :columns="columns" :dataSource="dataSource" :scroll="{ x: 700, y: scrolly }"
						 size="middle" :pagination="pagination" @change="handleTableChange">
							<span slot="serial" slot-scope="text, record, index">
								{{ index + 1 }}
							</span>
							<span slot="testPaperStatus" slot-scope="text, record, index">{{text==0?'未发送':(text==1?'已发送':'已收取')}}</span>
							<a-tag :color="state==0?'#00a095':(state==1?'#ff8d1a':'#d43030')" slot="testPaperStatus" slot-scope="state">{{ state==0?'未发送':(state==1?'已发送':'已收取')}}</a-tag>
							<!-- <a-tag :color="text==0?'#2db7f5':(text==1?'#87d068':'#f50')" slot="testPaperStatus" slot-scope="text, record, index">{{text==0?'未发卷':(text==1?'已发卷':'已收取')}}</a-tag> -->
							<span slot="action" slot-scope="text, record, index">
								<a href="javascript:;" v-if="record.testPaperStatus==0" @click="assignHomework(record)">发作业</a>
								<a href="javascript:;" v-if="record.testPaperStatus!=0" @click="confimAssignHomework(record)">重发作业</a>
								<a href="javascript:;" v-if="record.testPaperStatus==1&&(record.instructionsStatus==0)" @click="gatherHomework(record)">收作业</a>
								<a href="javascript:;" v-if="record.testPaperStatus==1&&(record.instructionsStatus==1)" @click="stopgatherHomework(record)">停止收作业</a>
								<!-- <a href="javascript:;" v-if="record.testPaperStatus==2">已收卷</a> -->
							</span>
						</a-table>
					</div>
				</div>
				<!-- <upload class="upload" ref="upload" @close="getlistPaper"></upload> -->
				<commonupload class="upload" ref="commonupload" @close="getlistPaper"></commonupload>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import api from '@/page/mainPage/api';
	import {
		postActionUpload
	} from '@/page/mainPage/api';
	import commonupload from '@/page/mainPage/components/homeupload/commonupload';
	const columns = [{
			title: '序号',
			dataIndex: 'num',
			width: 100,
			scopedSlots: {
				customRender: 'serial'
			},
		},
		{
			title: '试卷名称',
			dataIndex: 'titleName',
			width: 200
		},
		{
			title: '试卷描述',
			dataIndex: 'remark'
		},
		{
			title: '状态',
			dataIndex: 'testPaperStatus',
			scopedSlots: {
				customRender: 'testPaperStatus'
			}
		},
		{
			title: '操作',
			key: 'isHomeWork',
			dataIndex: 'isHomeWork',
			fixed: 'right',
			width: 160,
			align: 'center',
			scopedSlots: {
				customRender: 'action'
			}
		}
	];

	export default {
		data() {
			return {
				dataSource: [],
				columns,
				selectedRowKeys: [],
				scrolly: 200,
				pagination: {},
				type: 1,
				showHomework: false,
				sendInfo: {}
			};
		},
		components: {
			commonupload
		},
		computed: {
			...mapState(['theme'])
		},
		created() {
			this.getlistPaper(0, 10);
		},
		mounted() {
			const that = this;
			// that.scrolly = document.body.offsetHeight * .6 - 180;
			window.onresize = function() {
				if (that.$refs.modbox) {
					that.scrolly = that.$refs.modbox.offsetHeight - 150;
				}
			};
		},
		destroyed() {
			window.onresize = null;
		},
		methods: {
			show() {
				this.showHomework = true;
				this.getlistPaper();
				this.$nextTick(() => {
					if (this.$refs.modbox) {
						this.scrolly = this.$refs.modbox.offsetHeight - 150;
						console.log('高度' + this.scrolly)
					}
					// this.scrolly = this.$refs.modbox.offsetHeight - 100;
				})
			},
			returnback() {
				this.showHomework = false;
				this.$emit('returnback');
			},
			gotopage() {
				this.$router.push({
					path: 'startClassTesting'
				});
			},
			onSelectChange(selectedRowKeys) {
				this.selectedRowKeys = selectedRowKeys;
				console.log(selectedRowKeys)
			},

			handleTableChange(pagination) {
				// const pager = { ...this.pagination
				// };
				// pager.current = pagination.current;
				// this.pagination = pager;
				// let offset = (pager.current - 1) * pagination.pageSize;
				// this.getlistPaper(offset, pageSize)
			},
			getlistPaper(offset = 0, pageSize = 10) {
				const $me = this;
				var url = api.getHomeworkTitleList;
				this.sendInfo = JSON.parse(this.$route.query.sendInfo);
				this.$postAction(url, {
					teacAssistantCode: this.sendInfo.teacAssistantCode,
					subjectCode: this.sendInfo.subjectCode,
					offset: offset,
					pageSize: pageSize
				}).then(da => {
					if (da && da.ret == 'success') {
						$me.dataSource = [];
						if (da.data.records && da.data.records.length > 0) {
							$me.dataSource = da.data.records.map(item => {
								item.instructionsStatus = 0; //点击了收卷后的指令状态
								return item
							});
						}
						$me.paginationtotal = da.total;
					}
				})
			},
			getTitleCode() {
				if (this.selectedRowKeys.length == 0) {
					this.$message.error('请至少选择一套试卷');
					return false;
				}
				return this.selectedRowKeys
			},
			changeType(type) {
				this.type = type;
				this.getlistPaper()
			},
			addPaper() {
				// if (this.type == 1) {
				// 	this.$refs.commonupload.show('common')
				// } else {
				// 	this.$refs.upload.show('classify');
				// }
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
					$me.titleName = strFileName;
					formData.append('file', file.files[0]);
					formData.append('titleName', $me.titleName);
					formData.append('classCode', $me.sendInfo.classCode);
					formData.append('className', $me.sendInfo.className);
					formData.append('subjectCode', $me.sendInfo.subjectCode);
					formData.append('subjectName', $me.sendInfo.subjectName);
					formData.append('type', $me.type);
					postActionUpload(api.importTestQuestions, formData).then(da => {
						if (da.ret == 'success') {
							$me.$toast.center('上传成功');
							/* 重新查询 */
							this.getlistPaper()
						} else {
							$me.$toast.center(da.message);
						}
					})
				
					file.value = '';
				} else {
					this.$toast.center('请选择文件');
				}


			},
			assignHomework(record) {
				/* 发送试卷 */
				this.$postAction(api.assignHomework, {
					subjectCode: this.sendInfo.subjectCode,
					titleCode: record.titleCode,
					titleName: record.titleName
				}).then(da => {
					if (da && da.ret == 'success') {
						this.getlistPaper();

						this.$toast.center('试卷下发成功');
					}
				})
			},
			gatherHomework(record) {
				/* 收取试卷 */
				this.$postAction(api.gatherHomework, {
					subjectCode: this.sendInfo.subjectCode,
					titleCode: record.titleCode
				}).then(da => {
					if (da && da.ret == 'success') {
						record.instructionsStatus = 1;
						this.$toast.center('开始收取试卷');
					}
				})
			},
			stopgatherHomework(record) {
				/* 停止收取试卷 */
				this.$postAction(api.stopHomework, {
					subjectCode: this.sendInfo.subjectCode,
					titleCode: record.titleCode
				}).then(da => {
					if (da && da.ret == 'success') {
						record.instructionsStatus = 0;
						this.getlistPaper();
						this.$toast.center('收取试卷成功');
					}
				})
			},
			confimAssignHomework(record) {
				/* 确认重发 */
				let that = this;
				this.$confirm({
					title: '确认重发试卷?',
					content: '重复试卷后，之前答题记录将清空',
					onOk() {
						that.assignHomework(record)
					},
					onCancel() {},
				});
			}
		}
	};
</script>

<style scoped="scoped" lang="scss">
	.theme1 {
		.modbox {
			position: absolute;
			top: 80px;
			left: 0;
			right: 0;
			bottom: 0;
		}
	}

	.subtitle {
		color: #fff;
		font-size: 24px;

		img,
		span {
			vertical-align: middle;
		}
	}

	.btnbar {
		margin: 0 60px;

		a {
			display: block;
			width: 206px;
			height: 46px;
			line-height: 46px;
			background: #3f9be1;
			color: #fff;
			font-size: 20px;
			border-radius: 50px;
			text-align: center;
		}
	}

	.theme3 .btnbar {
		a {

			background: url(../assets/img/theme3/endBtn.png) no-repeat center center;
			background-size: 100% 100%;
			border-radius: 0;
		}
	}

	.theme4 .subtitle {
		color: #2459a0;
	}

	.subtablink {
		font-size: 14px;
		color: #999;
		vertical-align: middle;
		display: inline-block;
	}

	.subtablink a {
		color: #999;
		text-decoration: none;
	}

	.theme1 .subtablink a,
	.theme1 .subtablink {
		color: rgba($color: #fff, $alpha: .8);
	}

	.subtablink a.active {
		color: #2459a0;
	}

	.subtablink a,
	.subtablink span {
		vertical-align: middle;
	}

	.addBtn {
		color: #fff;
		font-size: 16px;
		background: #3bb1c2;
		border-radius: 6px;
		padding: 2px 10px;
		display: inline-block;
		margin-left: 22px;
		position: relative;
		overflow: hidden;
	}
	.addBtn input{
		opacity: 0;
		font-size: 400px;
		position: absolute;
		top: 0;
		right: 0;
	}
</style>
