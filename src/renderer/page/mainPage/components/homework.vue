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
							<div class="subtablink">
								<a href="javascript:;" @click="changeType(1)" :class="{'active':type==1}">普通模式</a>
								<span>|</span>
								<a href="javascript:;" @click="changeType(2)" :class="{'active':type==2}">套题模式</a>
							</div>
							<a href="javascript:;" class="addBtn" @click="addPaper">添加试卷</a>
						</div>
					</div>
					<div class="tablelist mt20" ref="setbox">
						<a-table style="height: 100%;" rowKey="titleCode" :columns="columns" :dataSource="dataSource" :scroll="{ x: 700, y: scrolly }"
						 size="middle" :pagination="pagination" @change="handleTableChange">
							<span slot="serial" slot-scope="text, record, index">
								{{ index + 1 }}
							</span>
							<span slot="action" slot-scope="text, record, index">
								<a href="javascript:;" v-if="text==0" @click="assignHomework(record.titleCode,record.titleName)">发卷</a>
								<a href="javascript:;" v-if="text==1" @click="gatherHomework(record.titleCode)">收卷</a>
							</span>
						</a-table>
					</div>
				</div>
				<upload class="upload" ref="upload" @close="getlistPaper"></upload>
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
	import upload from '@/page/mainPage/components/upload/upload';
	import commonupload from '@/page/mainPage/components/upload/commonupload';
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
			title: '操作',
			key: 'isHomeWork',
			dataIndex: 'isHomeWork',
			fixed: 'right',
			width: 100,
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
			upload,
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
			if (that.$refs.modbox) {
				that.scrolly = that.$refs.modbox.offsetHeight - 100;
			}
			// that.scrolly = document.body.offsetHeight * .6 - 180;
			window.onresize = function() {
				if (that.$refs.modbox) {
					that.scrolly = that.$refs.modbox.offsetHeight - 100;
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
					this.scrolly = this.$refs.modbox.offsetHeight - 100;
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
						console.log(da);
						$me.dataSource = da.data.records;
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
			assignHomework(titleCode, titleName) {
				/* 发送试卷 */
				this.$postAction(api.assignHomework, {
					subjectCode: this.sendInfo.subjectCode,
					titleCode: titleCode,
					titleName: titleName
				}).then(da => {
					if (da && da.ret == 'success') {
						this.getlistPaper();
						this.$message.error('题目下发成功');
					}
				})
			},
			gatherHomework(titleCode) {
				/* 收取试卷 */
				this.$postAction(api.gatherHomework, {
					subjectCode: this.sendInfo.subjectCode,
					titleCode: titleCode
				}).then(da => {
					if (da && da.ret == 'success') {
						this.$message.error('开始收取试卷');
					}
				})
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
