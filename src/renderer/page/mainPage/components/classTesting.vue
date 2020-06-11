<template>
	<div class="modbox" ref="modbox">
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
		<div class="tablelist mt20" ref="setbox" :style="{'height':tabheight+'px'}">
			<a-table style="height: 100%;" rowKey="titleCode" :columns="columns" :dataSource="dataSource" :scroll="{ x: 700, y: scrolly }"
			 size="middle" :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange ,type:'radio'}"
			 :pagination="pagination" @change="handleTableChange">
				<span slot="serial" slot-scope="text, record, index">
					{{ index + 1 }}
				</span>
				<a-tag :color="state==0?'#00a095':'#d43030'" slot="isLock" slot-scope="state">{{ state==0?'未发送':'已发送'}}</a-tag>
			</a-table>
		</div>
		<upload class="upload" ref="upload" @close="getlistPaper"></upload>
		<commonupload class="upload" ref="commonupload" @close="getlistPaper"></commonupload>
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
			title: '试卷状态',
			dataIndex: 'isLock',
			width: 120,
			scopedSlots: {
				customRender: 'isLock'
			}
		},
		{
			title: '试卷描述',
			dataIndex: 'remark'
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
		data() {
			return {
				dataSource: [],
				columns,
				selectedRowKeys: [],
				scrolly: 300,
				pagination: {},
				type: 1,
				tabheight: 100
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
			// that.scrolly = that.$refs.modbox.offsetHeight - 100;
			// that.scrolly = document.body.offsetHeight * .6 - 180;
			window.onresize = function() {
				// that.scrolly = document.body.offsetHeight * .6 - 180;
				that.tabheight = that.$refs.modbox.offsetHeight - 150;
			};
			this.$nextTick(() => {
				if (this.$refs.modbox) {
					this.tabheight = this.$refs.modbox.offsetHeight - 150;
					console.log('高度' + this.scrolly)
				}
			})
		},
		destroyed() {
			window.onresize = null;
		},
		methods: {
			gotopage() {
				this.$router.push({
					path: 'startClassTesting'
				});
			},
			onSelectChange(selectedRowKeys) {
				this.selectedRowKeys = selectedRowKeys;
				console.log(selectedRowKeys)
			},
			onChange(record, index, e) {
				console.log(`checked = ${e.target.checked}`);
				// if (e.target.checked) {
				// 	if (this.dataSource.length > 0) {
				// 		this.dataSource.forEach(item => {
				// 			item.isChecked = false;
				// 			return item
				// 		})
				// 	}
				// 	this.dataSource[index].isChecked = true;
				// } else {
				// 	this.dataSource[index].isChecked = false;
				// }
			},
			handleTableChange(pagination) {
				const pager = { ...this.pagination
				};
				pager.current = pagination.current;
				this.pagination = pager;
				let offset = (pager.current - 1) * pagination.pageSize;
				this.getlistPaper(offset, pageSize)
			},
			getlistPaper(offset = 0, pageSize = 10) {
				const $me = this;
				var url = api.listPaper + offset + '/' + pageSize;
				this.$postAction(url, {
					type: this.type == 1 ? 'common' : 'classify'
				}).then(da => {
					if (da && da.ret == 'success') {
						console.log(da);
						$me.dataSource = da.data;
						const pagination = { ...this.pagination
						};
						pagination.total = da.total;
						this.pagination = pagination;
					}
				})
			},
			getTitleCode() {
				let $me = this;
				if (this.selectedRowKeys.length == 0) {
					this.$message.error('请至少选择一套试卷');
					return false;
				} else {
					let index = $me.dataSource.findIndex(item => item.titleCode == this.selectedRowKeys[0]);
					return {
						titleCode: this.selectedRowKeys,
						isLock: $me.dataSource[index].isLock
					}
				}

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
