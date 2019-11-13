<template>
	<div class="setbox" v-if="isShow">
		<div ref="mainbox">
			<ul class="userlist clearfix" v-if="viewState==0">
				<li v-for="(item,index) in list" :key="index" @click="showDetails(index)">
					<div>{{item.studentName}}</div>
					<div class="progressbar">
						<span>{{item.percent}}%</span>
						<div :style="{width:item.percent+'%'}"></div>
					</div>
				</li>
			</ul>
			<div  v-if="viewState==1" ref="tablebox">
				<div>姓名：<span>{{studentInfo.stuName}}</span></div>
				<a-table rowKey="questionId" :columns="columns" :dataSource="dataSource" :scroll="{ y: scrolly }" size="middle"
				 :pagination="false">
					<span slot="serial" slot-scope="text, record, index">
						{{ index + 1 }}
					</span>
					<span slot="questionType" slot-scope="text, record, index">
						{{ text|typefilter}}
					</span>
					<a-tag slot="answerResult" slot-scope="text, record, index" v-if="text" :color="record.result?'#87d068':'#f00'">{{ text|Answerfilter}}</a-tag>
				</a-table>
			</div>

			<a href="javascript:;" class="reback rebacklist" @click="returnback" v-if="viewState==1"></a>
		</div>
	</div>
</template>

<script>
	const columns = [{
			title: '题号',
			dataIndex: 'num',
			width: 100,
			scopedSlots: {
				customRender: 'serial'
			},
		},
		{
			title: '题目类型',
			dataIndex: 'questionType',
			width: '25%',
			scopedSlots: {
				customRender: 'questionType'
			},
		},
		{
			title: '按键答案',
			dataIndex: 'answerResult',
			align:'center',
			width: '25%',
			scopedSlots: {
				customRender: 'answerResult'
				
			},
		},
		{
			title: '正确答案',
			dataIndex: 'trueAnswer',
			align:'center',
			width: '25%',
			// width: 300,
		},
		{
			title: '得分',
			dataIndex: 'score',
			width: 100
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
		components: {},
		data() {
			return {
				isShow: false,
				list: [],
				scrolly: 100,
				viewState: 0,
				columns,
				detailslist: [],
				dataSource: [],
				studentInfo: {}
			};
		},
		mounted() {

		},
		methods: {
			show() {
				this.list = [];
				this.viewState = 0;
				this.detailslist = [];
				this.isShow = true;
			},
			hide() {
				this.isShow = false;
			},
			setList(list) {
				if(list&&list.length>0){
					this.list = list.map(item=>{
						item.percent=parseInt(item.percent*100);
						return item
					});
				}else{
					this.list = [];
				}
				
			},
			setDetailslist(list) {
				this.detailslist = list;
			},
			showDetails(index) {
				if (this.detailslist.length <= 0) {
					return false;
				}
				this.dataSource = this.detailslist[index].recordList;
				this.studentInfo = this.detailslist[index].studentInfo;
				this.viewState = 1;
				const that = this;
				this.$nextTick(() => {
					that.scrolly = that.$refs.tablebox.offsetHeight - 100;
					window.onresize = function() {
						that.scrolly = that.$refs.tablebox.offsetHeight - 100;
					};
				})
			},
			returnback() {
				this.viewState = 0;
			}
		},
		destroyed() {
			window.onresize = null;
		},
		filters: {
			typefilter(value) {
				var str = ''
				switch (value) {
					case '1':
						{
							str = "单题单选-字母"
							break;
						}
					case '2':
						{
							str = "单题单选-判断"
							break;
						}
					case '3':
						{
							str = "单题单选-数字"
							break;
						}
					case '4':
						{
							str = "单题多选"
							break;
						}
				}
				return str
			},
			Answerfilter(value) {
				var str = value;
				switch (value) {
					case 'true':
						{
							str = "√"
							break;
						}
					case 'false':
						{
							str = "×"
							break;
						}

				}
				return str
			}
		}
	};
</script>

<style scoped="scoped" lang="scss">
	@import '../assets/css/set.scss';

	.getPaper {
		display: block;
		font-size: 18px;
		color: #3399cc;
		background: #fff;
		border-radius: 5px;
		width: 100px;
		height: 40px;
		text-align: center;
		line-height: 40px;
		position: absolute;
		top: 90px;
		right: 35px;
	}

	.userlist {
		height: 100%;
		overflow: auto;
	}

	.userlist li {
		width: 100px;
		height: 53px;
		display: inline-block;
		border-radius: 6px;
		padding: 6px;
		cursor: pointer;
		margin: 6px;

		.progressbar {
			height: 14px;
			font-size: 11px;
			text-align: center;
			position: relative;
			overflow: hidden;
			margin-top: 5px;

			&>div {
				width: 0;
				height: 100%;
				border-radius: 2px;
			}

			&>span {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
			}
		}
	}

	.theme1 .bg,
	.theme2 .bg {
		.userlist li {
			background: #fff;
			box-shadow: inset 0 0 10px rgba($color: #3f9be1, $alpha: 0.28);
			font-size: 14px;
			color: #336699;

			.progressbar {
				background: #fff;
				border-radius: 4px;
				box-shadow: inset 0 0 10px rgba($color: #3f9be1, $alpha: 0.28);
				color: #336699;
				font-size: 11px;

				&>div {
					background: #3f9be1;
				}
			}
		}
	}

	.theme1 .bg,
	.theme2 .bg {
		.setbox {
			padding: 25px 35px;
			bottom: 120px;
			background: rgba(255, 255, 255, .7);

			&>div {
				height: 100%;
				overflow: hidden;
				&>div{
					height: 100%;
				}
			}
		}
		.reback.rebacklist {
			position: absolute;
			top: auto;
			bottom: -20px;
			right: 20px;
		}
	}

	.theme3 {
		.bg {
			background: none;

			.setbox {
				left: 10px;
				right: 10px;
				bottom: 15px;
				top: 132px;
				background: url(../assets/img/theme3/setboxbg2.png) no-repeat center top;
				background-size: 100% auto;

				&>div {
					height: 100%;
					overflow: hidden;
					&>div{
						height: 100%;
					}
				}
			}

			&>.title {
				height: 38px;
				padding-left: 117px;
				line-height: 38px;
				font-size: 23px;
				top: 83px;
				left: 75px;
			}
		}

		.getPaper {
			background: rgba($color: #07f8ff, $alpha: .3);
			border: 1px solid #07f8ff;
			color: #fff;
			top: 83px;
		}

		.userlist li {
			background: rgba($color: #07f8ff, $alpha: .3);
			border: 1px solid #07f8ff;
			font-size: 14px;
			color: #fff;

			.progressbar {
				background: #fff;
				border-radius: 4px;
				box-shadow: inset 0 0 10px rgba($color: #3f9be1, $alpha: 0.28);
				color: #336699;
				font-size: 11px;

				&>div {
					background: #07f8ff;
				}
			}
		}
	}

	.theme4 .setbox {
		bottom: 120px;
		width: 80%;

		&>div {
			height: 100%;
			overflow: hidden;
			padding: 65px 0 15px;

			.userlist {
				padding: 0 90px;

				li {
					font-size: 20px;
					color: #2459a0;
					width: 10%;

					.progressbar {
						background: #fff;
						border-radius: 4px;
						color: #2459a0;
						font-size: 14px;
						border: 1px solid #2459a0;
						line-height: 20px;
						height: 20px;

						&>div {
							background: #ffd941;
						}
					}
				}
			}
			&>div{
				margin: 10px 40px;
				height: 100%;
			}
		}

		.reback.rebacklist {
			position: absolute;
			top: auto;
			top: 5px;
			right: 20px;
		}
	}
</style>
