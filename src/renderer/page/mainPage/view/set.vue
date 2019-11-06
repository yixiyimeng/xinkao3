<template>
	<div class="bg">
		<div class="title"><span>设</span><span>置</span></div>
		<!-- <a href="javascript:;" class="reback" @click="returnback"></a> -->
		<reback></reback>
		<div class="setbox">
			<div>
				<div class="inputtxt flex flex-align-center">
					<label>系统信道设置</label>
					<a-select class="select flex-1" size="large" v-model="ch">
						<a-icon type="caret-down" slot="suffixIcon" class="caret" />
						<a-select-option :value="item.ch" v-for="(item,index) in channels" :key="index">{{item.chName}}</a-select-option>
					</a-select>
				</div>
				<div class="mt15 inputtxt flex flex-align-center">
					<label>答题器发送功率</label>
					<a-select class="select flex-1" size="large" v-model="power">
						<a-icon type="caret-down" slot="suffixIcon" class="caret" />
						<a-select-option :value="1">1</a-select-option>
						<a-select-option :value="2">2</a-select-option>
						<a-select-option :value="3">3</a-select-option>
						<a-select-option :value="4">4</a-select-option>
						<a-select-option :value="5">5</a-select-option>
					</a-select>
				</div>
				<div class="linklist flex flex-pack-justify">
					<!-- <a href="javascript:;" @click="readChannel">读取</a> -->
					<a href="javascript:;" @click="setChannel">设置</a>
					<a href="javascript:;" @click="defaultSet">设为默认值</a>
				</div>
				<div class="mt15 inputtxt flex flex-align-center flex-pack-justify pr20">
					<label>弹幕模式</label>
					<a-switch v-model="isCheck" @change="onChange" />
				</div>
				<div class="mt15 inputtxt flex flex-align-center">
					<label>主题</label>
					<a-select class="select flex-1" size="large" v-model="defaulttheme" @change="changeTheme">
						<a-icon type="caret-down" slot="suffixIcon" class="caret" />
						<a-select-option value="theme1">主题一</a-select-option>
						<a-select-option value="theme2">主题二</a-select-option>
						<a-select-option value="theme3">主题三</a-select-option>
						<a-select-option value="theme4">主题四</a-select-option>
					</a-select>
				</div>
			</div>
			
			<!-- <div class="btnlist">
				<router-link :to="'setStu'">学生管理</router-link>
				<router-link :to="'setTest'">试卷管理</router-link>
			</div> -->
		</div>
	</div>
</template>

<script>
	import reback from '@/page/mainPage/components/reback';
	import api from '@/page/mainPage/api';
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			reback
		},
		data() {
			return {
				channels: [],
				ch: '',
				power: '',
				isCheck:true,
				defaulttheme:''
			};
		},
		computed: {
			...mapState(['theme','isDanmu'])
		},
		created() {
			this.getChannels();
			this.readChannel();
			this.defaulttheme=this.theme;
			this.isCheck=this.isDanmu;
		},
		methods: {
			returnback() {
				this.$router.go(-1);
			},
			readChannel() {
				this.$postAction(api.readChannel).then(da => {
					if (da && da.ret == 'success') {
						this.ch = da.data.rf_ch;
						this.power = da.data.tx_power
					}
				})
			},
			setChannel() {
				const $me=this;
				this.$confirm({
					title: '提示',
					content: '设置信道将解绑全部学生，你确定设置吗？',
					onOk() {
						$me.$postAction(api.setChannel, {
							ch: $me.ch,
							power: $me.power
						}).then(da => {
							if (da && da.ret == 'success') {
								$me.$toast.center('设置成功');
							}
						})
					},
					onCancel() {
						console.log('Cancel');
					},
				});

			},
			defaultSet() {
				const $me=this;
				this.$confirm({
					title: '提示',
					content: '设置信道将解绑全部学生，你确定设置吗？',
					onOk() {
						$me.$postAction(api.defaultSet).then(da => {
							if (da && da.ret == 'success') {
								$me.$toast.center('设为默认值成功');
								$me.readChannel();
							}
						})
					},
					onCancel() {
						console.log('Cancel');
					},
				});
				
				
			},
			getChannels() {
				/* 获取通道列表 */
				this.$postAction(api.getChannels).then(da => {
					if (da && da.ret == 'success') {
						this.channels = da.data
					}
				})
			},
			onChange(value){
				/* 是否显示弹幕 */
				this.$store.commit('SET_danmu', value);
			},
			changeTheme(value){
				/* 切换主题 */
				this.$store.commit('SET_theme', value);
			}
		}
	};
</script>

<style scoped="scoped" lang="scss">
	.bg {
		position: absolute;
		height: 100%;
		width: 100%;
		left: 0;
		right: 0;
	}

	.theme1 .bg {
		background: url(../assets/img/theme1/setbg.png) no-repeat center top;
		background-size: 100% auto;

		.setbox {
			top: 174px;
			background: rgba($color: #fff, $alpha: 0.7);
			>div{
				width: 500px;
			}
		}
	}

	.theme2 .bg {
		background: url(../assets/img/theme2/setbg.png) no-repeat 20px 30px;

		.title {
			font-size: 30px;
			color: #fff;
			position: absolute;
			left: 153px;
			top: 83px;
			background: url(../assets/img/theme2/titlebg.png);
			// width: 112px;
			height: 50px;
			text-align: right;
			padding-top: 15px;
		}

		.setbox {
			top: 150px;
			background: #fff;
			bottom: 40px;
			>div{
				width: 500px;
			} 
		}

		.setbox:after {
			content: '';
			height: 468px;
			width: 398px;
			display: block;
			position: absolute;
			right: 0.38rem;
			bottom: 0;
			background: url(../assets/img/theme2/setbg2.png) no-repeat center center;
			z-index: 0;
		}
	}

	.theme3 .bg {

		.setbox {
			left: .6rem;
			right: .6rem;
			top: 1.32rem;
			bottom: .16rem;
			padding: .4rem .6rem;
			// 		width: 808px;
			// 		height: 381px;
			// 		left: 60px;
			color: #fff;

			.linklist a {
				color: #07f8ff;
			}

			.btnlist a {
				width: 150px;
				background: url(../assets/img/theme3/setbtnbg.png);
			}

		}

		/deep/ .ant-select-selection {
			background: none;
			border: 1px solid #07f8ff;
			color: #fff;
		}

		/deep/ .ant-select-arrow {
			color: #07f8ff
		}
	}

	.theme4 {
		.setbox {
			width: 780px;
			text-align: center;

			label {
				text-align: left;
				padding-left: 20px;
				color: #333;
				font-size: 28px;
				width: 8em;
			}

			.linklist {
				width: 547px;
				margin-left: auto;
				margin-right: auto;
			}

			.linklist a {
				color: #333;
				font-size: 20px;
				border: 1px solid #ccc;
				background: #fff;
				border-radius: 5px;
				line-height: 40px;
				padding: 0 25px;
			}

			.inputtxt {
				background: #fff;
				width: 547px;
				line-height: 50px;
				border-radius: 5px;
				border: 1px solid #ccc;
				margin-left: auto;
				margin-right: auto;
			}

			/deep/ .ant-select .ant-select-selection {
				background: none;
				border: none;
				box-shadow: none;
				font-size: 24px;
				color: #333;

				&:focus {
					border: none;
					box-shadow: none;
				}
			}

			.caret {
				font-size: 24px;
				color: #2459a0;
				margin-top: -6px;
			}
		}
	}


	.setbox {
		position: absolute;
		left: 0.15rem;
		right: 0.15rem;
		border-radius: 10px;
		padding: 40px 60px;
		bottom: 0;

		label {
			width: 155px;
			display: inline-block;
			font-size: 16px;
		}

		.linklist a {
			color: #3f9be1;
			font-size: 14px;
			display: inline-block;
			margin-top: 18px;

			&+a {
				margin-left: 85px;
			}
		}

		.btnlist a {
			display: inline-block;
			width: 151px;
			height: 30px;
			border-radius: 5px;
			color: #fff;
			font-size: 14px;
			background: #3f9be1;
			text-align: center;
			line-height: 30px;
			margin-top: 30px;

			&+a {
				margin-left: 40px;
			}
		}
	}

	.select {
		width: 200px;
	}
	.pr20{
		padding-right: 20px;
	}
</style>
