<template>
	<div class="modbox" ref="modbox">
		<div class="subtitle">
			<img src="../assets/img/gou.png" alt="" />
			<span class="ml10">请选择试卷</span>
		</div>
		<div class="setbox mt20" ref="setbox">
			<a-table style="height: 100%;" :columns="columns" :dataSource="data" :scroll="{ x: 700, y: scrolly }" size="middle"
			 :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange ,type:'radio'}">
				<!-- <template slot="action" slot-scope="text, record,index">
					<a-checkbox @change="onChange(record,index,$event)" :checked="text.isChecked"></a-checkbox>
				</template> -->
			</a-table>
		</div>
		<div class="btnbar flex flex-pack-justify">
			<a href="javascript:;" @click="gotopage">开始答题</a>
			<a href="javascript:;">主观题记分</a>
			<a href="javascript:;">上传服务</a>
		</div>
	</div>
</template>

<script>
	const columns = [{
			title: '序号',
			dataIndex: 'num',
			width: 100
		},
		{
			title: '试卷名称',
			dataIndex: 'name',
			width: 200
		},
		{
			title: '试卷描述',
			dataIndex: 'subject'
		},
		// 	{
		// 		title: '操作',
		// 		key: 'operation',
		// 		fixed: 'right',
		// 		width: 100,
		// 		scopedSlots: { customRender: 'action' }
		// 	}
	];

	const data = [];
	for (let i = 0; i < 46; i++) {
		data.push({
			key: i,
			num: i + 1,
			name: `Edward King ${i}`,
			mark: `London, Park Lane no. ${i}`,
			isChecked: false,
			selectedRowKeys: []
		});
	}
	export default {
		data() {
			return {
				data,
				columns,
				selectedRowKeys: [],
				scrolly: 100
			};
		},
		mounted() {
			const that = this;
			that.scrolly = that.$refs.modbox.offsetHeight -220;
			window.onresize = function() {
				that.scrolly = that.$refs.modbox.offsetHeight - 220;
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
			},
			onChange(record, index, e) {
				console.log(`checked = ${e.target.checked}`);
				if (e.target.checked) {
					if (this.data.length > 0) {
						this.data.forEach(item => {
							item.isChecked = false;
							return item
						})
					}
					this.data[index].isChecked = true;
				} else {
					this.data[index].isChecked = false;
				}
			}
		}
	};
</script>

<style scoped="scoped" lang="scss">
	.theme1 {
		.modbox{
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
</style>
