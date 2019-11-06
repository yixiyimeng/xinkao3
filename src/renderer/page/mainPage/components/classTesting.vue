<template>
	<div class="modbox" ref="modbox">
		<div class="subtitle">
			<img src="../assets/img/gou.png" alt="" v-if="theme!='theme4'"/>
			<img src="../assets/img/gou2.png" alt=""  v-if="theme=='theme4'"/>
			<span class="ml10">请选择试卷</span>
		</div>
		<div class="tablelist mt20" ref="setbox">
			<a-table style="height: 100%;" rowKey="titleCode" :columns="columns" :dataSource="dataSource" :scroll="{ x: 700, y: scrolly }"
			 size="middle" :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange ,type:'radio'}"
			 :pagination="pagination" @change="handleTableChange">
				<span slot="serial" slot-scope="text, record, index">
					{{ index + 1 }}
				</span>
			</a-table>
		</div>
		<!-- <div class="btnbar flex flex-pack-justify">
			<a href="javascript:;" @click="gotopage">开始答题</a>
			<a href="javascript:;">主观题记分</a>
			<a href="javascript:;">上传服务</a>
		</div> -->
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import api from '@/page/mainPage/api';
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
			dataIndex: 'titleCode'
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
				scrolly: 100,
				pagination: {},
			};
		},
		computed: {
			...mapState(['theme'])
		},
		created() {
			this.getlistPaper(0,10);
		},
		mounted() {
			const that = this;
			that.scrolly = document.body.offsetHeight * .6 - 380;
			window.onresize = function() {
				that.scrolly = document.body.offsetHeight * .6 - 380;
			};
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
				let offset=(pager.current-1)*pagination.pageSize;
				this.getlistPaper(offset,pageSize)
			},
			getlistPaper(offset,pageSize) {
				const $me = this;
				var url = api.listPaper + offset+'/'+pageSize;
				this.$postAction(url).then(da => {
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
			getTitleCode(){
				return this.selectedRowKeys 
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
	.theme4 .subtitle{
		color: #2459a0;
		}
</style>
