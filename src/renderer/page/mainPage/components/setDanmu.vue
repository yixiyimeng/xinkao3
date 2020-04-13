<template>
	<div class="setdanmu">
		<div v-if="isShowmenu">
			<div class="setdanmu-hd flex flex-pack-justify flex-align-center"><span>弹幕设置</span>
				<!-- <a-switch size="small"  /> -->
				<a href="javascript:;" class="close" @click="close"></a>
			</div>
			<div class="setdanmu-bd">
				<div class="flex flex-pack-justify" v-for="(item,index) in list" :key="index">
					<span class="flex-1 name" @click.stop="setDetails(index)">{{item.questionTypeName=='语音测评'?'语音/跟读测评':item.questionTypeName}}</span>
					<a-switch size="small" v-model="item.isOpenBarrageflag" />
					<!-- <label>
						<input type="checkbox" style="opacity: 0;" v-model="item.isOpenBarrageflag">
						<div class="ant-switch ant-switch-small">
							<span class="ant-switch-inner"></span>
							<div class="ant-click-animating-node"></div>
						</div>
					</label> -->
				</div>
			</div>
			<div class="setdanmu-ft">
				<a href="javascript:;" class="saveBtn" @click="saveAllinfo">确定</a>
			</div>
		</div>
		<div v-if="!isShowmenu">
			<div class="setdanmu-hd flex flex-pack-justify flex-align-center"><span>{{setinfo.questionTypeName=='语音测评'?'语音/跟读测评':setinfo.questionTypeName}}设置</span>
				<a-switch size="small" v-model="setinfo.isOpenBarrageflag" />
				<!-- <label>
					<input type="checkbox" style="opacity: 1;" v-model="setinfo.isOpenBarrageflag">
					<div class="ant-switch ant-switch-small">
						<span class="ant-switch-inner"></span>
						<div class="ant-click-animating-node"></div>
					</div>
				</label> -->
			</div>
			<div class="setdanmu-bd">
				<div>
					<span>显示区域</span>
					<div>
						<a-radio-group v-model="setinfo.location" class="checkbox">
							<a-radio value="up">上</a-radio>
							<a-radio value="center">中</a-radio>
							<a-radio value="down">下</a-radio>
							<a-radio value="full">全屏</a-radio>
						</a-radio-group>
					</div>
				</div>
				<div>
					<span>不透明度</span>
					<div class="flex flex-pack-justify flex-align-center">
						<a-slider :defaultValue="100" class="flex-1" v-model="setinfo.diaphaneity" />
						<span>{{setinfo.diaphaneity}}</span>
					</div>
				</div>

			</div>
			<div class="setdanmu-ft">
				<a href="javascript:;" class="defaultBtn" @click="isShowmenu=true">取消</a>
				<!-- <a href="javascript:;" class="defaultBtn">恢复默认值</a> -->
				<a href="javascript:;" class="onesaveBtn" @click="saveOneInfo">确定</a>
			</div>
		</div>
	</div>
</template>

<script>
	import api from '@/page/mainPage/api';
	import {
		mapState} from 'vuex';
	export default {
		data() {
			return {
				isShowmenu: true,
				area: 1,
				direction: 1,
				list: [],
				setindex: 0,
				setinfo: {
					diaphaneity: 100, //透明度
					location: 'up', //位置
					isOpenBarrageflag: true, //是否开启弹幕
				}
			};
		},
		created() {
			// this.getDanmuinfo();
			this.list = this.danmuinfolist;
		},
		computed: {
			...mapState(['danmuinfolist']),
		},
		mounted() {},
		beforeDestroy() {},
		methods: {
			/* 查询弹幕设置 */
			getDanmuinfo() {
				/* 查询弹幕设置 */
				this.$postAction(api.getDanmuinfo).then(da => {
					if (da && da.ret == 'success') {
						var list = da.data;
						if (list && list.length > 0) {
							list = list.map(item => {
								item.isOpenBarrageflag = item.isOpenBarrage == 1;
								return item
							})
						}
						this.$store.commit('SET_danmuinfolist', list);
					}
				})
			},
			setDetails(index) {
				this.isShowmenu = false;
				var obj = this.list[index];
				this.setindex = index;
				this.setinfo = Object.assign({}, obj);
			},
			saveOneInfo() {
				this.list[this.setindex] = this.setinfo;
				this.saveAllinfo();
			},
			saveAllinfo() {
				var list = this.list;
				if (list && list.length > 0) {
					list = this.list.map(item => {
						var obj = {
							questionType: item.questionType,
							isOpenBarrage: item.isOpenBarrageflag ? 1 : 0,
							diaphaneity: item.diaphaneity, //透明度
							location: item.location, //位置
						}
						return obj
					})
				}
				var param = {
					hardwareVersion: '44',
					teacHabitDOs: list
				}
				this.saveInfo(param)
			},
			saveInfo(param) {
				this.$postAction(api.setDanmuinfo, param).then(da => {
					if (da && da.ret == 'success') {
						this.$toast.center('修改成功!');
						this.isShowmenu = true;
						this.getDanmuinfo();
						this.close();
					}
				})
			},
			close() {
				this.$emit('close')
			}

		}
	};
</script>

<style scoped="scoped" lang="scss">
	.setdanmu {
		position: fixed;
		bottom: 240px;
		left: 40%;
		transform: translateX(-50%);
		background: #333;
		border-radius: 10px;
		overflow: hidden;
		color: #fff;
		width: 331px;
		z-index: 9999;

		& .setdanmu-hd {
			height: 62px;
			padding: 0 30px;
			border-bottom: 1px solid #666;
			font-size: 18px;
			position: relative;

			.close {
				display: block;
				height: 12px;
				width: 12px;
				background: url(../assets/img/close.png);
				background-size: cover;
				position: absolute;
				right: 20px;
				top: 50%;
				transform: translateY(-50%);
			}
		}

		& .setdanmu-bd {
			padding: 0 30px;
			font-size: 14px;

			&>div {
				padding: 10px 0;

				span.name {
					cursor: pointer;
				}
			}
		}

		& .setdanmu-ft {
			padding-bottom: 20px;
		}

		.saveBtn,
			{
			display: block;
			background: #1890ff;
			color: #fff;
			line-height: 30px;
			width: 50%;
			border-radius: 50px;
			text-align: center;
			margin: 20px auto 0;
			font-size: 18px;
		}

		// .defaultBtn {
		// 	background: #999;
		// }
		.defaultBtn,
		.onesaveBtn {
			display: block;
			width: 50% !important;
			line-height: 51px;
			float: left;
			text-align: center;
			color: #fff;
			font-size: 18px;
			background: #999;

			&+a {
				background: #1890ff;
			}
		}

		.small /deep/ .ant-radio-wrapper {
			font-size: 10px;

			span.ant-radio+* {
				padding-left: 2px;
			}
		}

		.checkbox {
			width: 100%;
			margin-top: 20px;
		}

		.checkbox /deep/ .ant-radio-wrapper {
			margin-right: 0;
			width: 25%;
			display: inline-block;
			font-size: 14px;
		}

		/deep/ .ant-switch-checked {
			background: #00de8d;
		}

		/deep/ .ant-radio-wrapper {
			color: #fff;
		}
	}
</style>
