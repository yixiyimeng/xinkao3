<template>
	<div class="bindnamelist bg" v-if="isshowNamelist">
		<a href="javascript:;" class="reback" @click="closeNamelist"></a>
		<div class="setbox">
			<div>
				<div class="singtitle" v-if="isBind==1">接收器编号：{{code}}</div>
				<ul class="clearfix">
					<li v-for="(item, index) in namelist" :class="{ active: item.checked,'success':item.state == 1}">
						<i @click="checkOneStu(item)"></i>
						<span @click="checkOneStu(item)">{{ item.stuName }}</span>
						<img src="../assets/img/jiebang1.png" alt="" v-if="item.state == 1" @click="isUnBindStu('one',item)" style="opacity: .6;" />
						<img src="../assets/img/pwd2.png" alt="" v-if="item.state == 0" @click="BindOneStu(item)" />
						<!-- <img src="../assets/img/pwd2.png" alt="" v-if="item.state == 0" @click="cancelBindOneStu(item)"  /> -->
					</li>
				</ul>
				<div class="tag">
					<a-button type="primary" @click="startBind" v-if="isBind!=1&&isrebackFill!=1">开始绑卡</a-button>
					<a-button type="danger" @click="stopBind" v-if="isBind==1">停止绑卡</a-button>
					<a-button type="primary" @click="nameStart" v-if="isBind==2&&isrebackFill==0">开始回显</a-button>
					<a-button type="danger" @click="nameStop" v-if="isBind==2&&isrebackFill==1">停止回显</a-button>
				</div>
				<div class="tag" style="left: auto; right: 100px;">
					<span>已选择{{ checkbindStu }}个学生</span>
					<a href="javascript:;" @click="isUnBindStu('some')">解绑选中学生</a>
					<a href="javascript:;" @click="checkAll">全选</a>
					<a href="javascript:;" @click="uncheckAll">全不选</a>

				</div>
				<div @click="isUnBindStu('all')" class="unbindAllStu" title="一键解绑"><img src="../assets/img/jiebang.png" alt="" /></div>
			</div>
		</div>
	</div>
</template>

<script>
	import api from '@/page/mainPage/api';
	export default {
		data() {
			return {
				isshowNamelist: false,
				namelist: [],
				sendInfo: {},
				code: '',
				isBind: 0, //是否绑定状态 0，没有下发状态，1 开始绑定状态， 2 停止状态
				isrebackFill: 0, //回显状态 0 ，没有开始， 1开始
			};
		},
		props: {
			isAnswering: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			checkbindStu() {
				if (this.namelist && this.namelist.length > 0) {
					return this.namelist.filter(item => item.checked).length;
				} else {
					return 0;
				}
			},
		},
		created() {
			try {
				this.sendInfo = JSON.parse(sessionStorage.getItem('sendInfo'));

			} catch (e) {
				//TODO handle the exception
			}

		},
		methods: {
			shownamelist() {
				this.isshowNamelist = true;
				this.code = '';
				this.namelist = [];
				this.isBind = 0;
				this.isrebackFill = 0;
				this.$emit('startName')
				this.getNamelist();
				// this.startBind();
			},
			closeNamelist() {
				if (this.isBind == 1) {
					this.stopBind();
				}
				if (this.isrebackFill == 1) {
					this.nameStop()
				}
				this.isshowNamelist = false;
				this.$emit('stopName');
				// this.$emit('returnback')
			},
			/* 获取学生名单 */
			getNamelist() {
				const $me = this;
				$me.$postAction(api.getAllBingdCardInfo).then(da => {
					if (da && da.ret == 'success') {
						$me.namelist = da.data.map(item => {
							item.checked = false;
							return item
						});
					} else {
						$me.namelist = [];
					}
				})

			},
			unBindStu(param) {
				const $me = this;
				$me.$postAction(api.unBindStu, param).then(da => {
					if (da && da.ret == 'success') {
						$me.$toast.center('解绑成功');
						$me.getNamelist();
					}
				})
			},
			isUnBindStu(type, stu) {
				const $me = this;
				// if ($me.isAnswering) {
				// 	$me.$toast.center('答题过程中不能解绑');
				// 	return false;
				// }
				let unbindtext = '';
				var param = {};
				switch (type) {
					case 'one':
						{
							unbindtext = '确定解绑' + stu.stuName + '吗？';
							param = {
								stuCodes: [stu.stuCode]
							};
							break;
						}
					case 'some':
						{
							unbindtext = '确定解绑选中学生吗？';
							if ($me.checkbindStu == 0) {
								$me.$toast.center('请至少选择一个学生');
								return false
							}
							var list = [];
							if ($me.namelist && $me.namelist.length > 0) {
								list = $me.namelist.filter(item => {
									return item.checked;
								}).map(item => item.stuCode);
							}
							param = {
								stuCodes: list
							};
							break;
						}
					case 'all':
						{
							unbindtext = '确定解绑所有学生名单吗？';
							param = {
								classCode: $me.sendInfo.classCode
							};
							break;
						}
				}
				$me.$confirm({
					title: '提示',
					content: unbindtext,
					okText: '确认',
					centered: true,
					cancelText: '取消',
					onOk() {
						$me.unBindStu(param)
					}
				});
			},
			BindOneStu(item) {
				/* 单独绑定某个学生 */
				const $me = this;
				$me.$postAction(api.BindOneStu, {
					stuCode: item.stuCode
				}).then(da => {
					if (da && da.ret == 'success') {
						// $me.$toast.center('绑定成功');
						// $me.getNamelist();
					}
				})
			},
			cancelBindOneStu(item) {
				/* 单独取消绑定某个学生 */
				const $me = this;
				$me.$postAction(api.cancelBindOneStu, {
					stuCode: item.stuCode
				}).then(da => {
					if (da && da.ret == 'success') {
						// $me.$toast.center('绑定成功');
						// $me.getNamelist();
					}
				})
			},
			/* 选中一个学生 */
			checkOneStu(item) {
				const $me = this;
				if (item.state != 0) {
					item.checked = !item.checked;
				}
			},
			/* 全选 */
			checkAll() {
				const $me = this;
				if ($me.namelist && $me.namelist.length > 0) {
					$me.namelist.forEach(item => {
						if (item.state == 1) {
							console.log(123);
							item.checked = true;
						}
					});
				}
			},
			/* 全不选 */
			uncheckAll() {
				const $me = this;
				if ($me.namelist && $me.namelist.length > 0) {
					$me.namelist.forEach(item => {
						if (item.state == 1) {
							item.checked = false;
						}
					});
				}
			},
			/* 开始绑定学生 */
			startBind() {
				this.$postAction(api.startBind).then(da => {
					if (da && da.ret == 'success') {
						this.code = da.data.pin;
						this.isBind = 1;

					}

				})
			},
			stopBind() {
				this.$postAction(api.stopBind).then(da => {
					if (da && da.ret == 'success') {
						this.isBind = 2;

					}

				})

			},
			setCode(code) {
				this.code = code.pin;
			},
			nameStart() {
				this.$postAction(api.nameStart).then(da => {
					if (da && da.ret == 'success') {
						this.isrebackFill = 1;

					}

				})

			},
			nameStop() {
				this.$postAction(api.nameStop).then(da => {
					if (da && da.ret == 'success') {
						this.isrebackFill = 0;

					}

				})

			}
		}
	};
</script>

<style scoped="scoped" lang="scss">
	@import '../assets/css/set.scss';

	.bindnamelist {
		z-index: 99999;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.setbox {
		&>div {
			height: 100%;
		}
	}

	.theme1 .bg .setbox {
		background: rgba(255,255,255,.7);
	}

	.theme4 .bg .setbox {
		position: absolute;
		width: auto;
		left: 135px;
		right: 135px;
		transform: translate(0, 0);
		top: 160px;
		bottom: 120px;
		.singtitle {
			font-size: 30px;
			line-height: 40px;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			z-index: 999;
		text-align: left;
		}

	}

	.singtitle {
		font-size: 30px;
		line-height: 40px;
		text-align: center;
		position: absolute;
		top: -50px;
		left: 0;
		right: 0;
		z-index: 999;

	}
</style>
