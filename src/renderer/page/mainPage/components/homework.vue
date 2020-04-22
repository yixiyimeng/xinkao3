<template>
	<div class="bg" v-if="showHomework">
		<a href="javascript:;" class="reback" @click="returnback"></a>
		<div class="setbox">
			<div>
				<div class="modbox" ref="modbox" style="margin: 0 20px;">
					<div class="subtitle flex flex-pack-justify flex-align-center">
						<div><img src="../assets/img/gou.png" alt="" v-if="theme!='theme4'" />
							<img src="../assets/img/gou2.png" alt="" v-if="theme=='theme4'" />
							<span class="ml10">请选择试卷</span></div>
						<div>
							<!-- <div class="subtablink">
								<a href="javascript:;" @click="changeType(1)" :class="{'active':type==1}">普通模式</a>
								<span>|</span>
								<a href="javascript:;" @click="changeType(2)" :class="{'active':type==2}">套题模式</a>
							</div> -->
							<a href="javascript:;" class="addBtn" @click="addPaper">添加试卷</a>
						</div>
					</div>
					<div class="tablelist mt20" ref="setbox">
						<a-table style="height: 100%;" rowKey="titleCode" :columns="columns" :dataSource="dataSource" :scroll="{ x: 700, y: scrolly }"
						 size="middle" :pagination="pagination" @change="handleTableChange">
							<span slot="serial" slot-scope="text, record, index">
								{{ index + 1 }}
							</span>
							<span slot="testPaperStatus" slot-scope="text, record, index">{{text==0?'未发卷':(text==1?'已发卷':'已收取')}}</span>
							<a-tag :color="state==0?'#00a095':(state==1?'#ff8d1a':'#d43030')" slot="testPaperStatus" slot-scope="state">{{ state==0?'未发送':(state==1?'已发送':'已收卷')}}</a-tag>
							<!-- <a-tag :color="text==0?'#2db7f5':(text==1?'#87d068':'#f50')" slot="testPaperStatus" slot-scope="text, record, index">{{text==0?'未发卷':(text==1?'已发卷':'已收取')}}</a-tag> -->
							<span slot="action" slot-scope="text, record, index">
								<a href="javascript:;" v-if="record.testPaperStatus==0" @click="assignHomework(record)">发卷</a>
								<a href="javascript:;" v-if="record.testPaperStatus!=0" @click="confimAssignHomework(record)">重发试卷</a>
								<a href="javascript:;" v-if="record.testPaperStatus==1&&(record.instructionsStatus==0)" @click="gatherHomework(record)">收卷</a>
								<a href="javascript:;" v-if="record.testPaperStatus==1&&(record.instructionsStatus==1)" @click="stopgatherHomework(record)">停止收卷</a>
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
	// import upload from '@/page/mainPage/components/upload/upload';
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
				scrolly: 100,
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
				if (this.type == 1) {
					this.$refs.commonupload.show('common')
				} else {
					this.$refs.upload.show('classify');
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

						this.$message.success('试卷下发成功');
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
						this.$message.success('开始收取试卷');
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
						this.$message.success('收取试卷成功');
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

	.subtablink+.addBtn {
		color: #fff;
		font-size: 16px;
		background: #3bb1c2;
		border-radius: 6px;
		padding: 2px 10px;
		display: inline-block;
		margin-left: 22px;
	}
</style>
