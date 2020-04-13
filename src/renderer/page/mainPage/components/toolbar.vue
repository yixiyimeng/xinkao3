<template>
	<div class="toolbox" ref="TopImg">
		<div class="mask" ref="mask" @click="isShow=false;" v-if="isShow"></div>
		<div class="toolbar" v-if="isShow">
			<div>
				{{type}}
				<a href="javascript:;" class="printScreen" @click.stop="saveImgFullScreen">
					<i></i>
					<p>截屏</p>
				</a>
				<a href="javascript:;" class="whiteblock" @click.stop="show(4)">
					<i></i>
					<p>电子白板</p>
					<div class="state" :class="{'active':type==4}"></div>
				</a>
				<a href="javascript:;" class="countDown" @click.stop="show(2)">
					<i></i>
					<p>倒计时</p>
					<div class="state" @click.stop="onChange" :class="{'active':isCountDown==1}"></div>
				</a>
				<!-- <a href="javascript:;" class="rollCall">
					<i></i>
					<p>点名</p>
				</a>
				<a href="javascript:;" class="pickName">
					<i></i>
					<p>随机</p>
				</a> -->
				<a href="javascript:;" class="barrage" @click="show(1)">
					<i></i>
					<p>弹幕</p>
				</a>
				<!-- <a href="javascript:;" class="more">
					<i></i>
					<p>更多</p>
				</a> -->
				<router-link :to="'set'" class="more">
					<i></i>
					<p>更多</p></router-link>
			</div>
		</div>
		<div class="printScreenbox" v-show="type==3">
			<div style="height:100%; width: 100%;">
				<vue-cropper ref="cropper" :img="htmlUrl" :info="true" :autoCrop="options.autoCrop" :autoCropWidth="options.autoCropWidth"
				 :autoCropHeight="options.autoCropHeight" :mode="options.mode" :fixedBox="options.fixedBox" :canMove="options.canMove">
				</vue-cropper>
			</div>
			<div class="optionbtn">
				<a href="javascript:;" @click="canceImg">取消</a>
				<a href="javascript:;" class="savebtn" @click="saveImg">保存</a>
			</div>
		</div>
		<setDanmu @close="close" v-if="isShow&&type==1"></setDanmu>
		<timeswiper ref="timeswiper" @cancelcountDown="close" v-if="isShow&&type==2"></timeswiper>
		<draw ref="draw" v-if="type==4" @save='saveImgFullScreen' @cancel="type=0;$emit('close')"></draw>
	</div>
</template>

<script>
	import setDanmu from '@/page/mainPage/components/setDanmu.vue';
	import timeswiper from '@/page/mainPage/components/timeswiper';
	import draw from '@/page/mainPage/components/draw';
	import VueCropper from '@/page/mainPage/components/cropper/vue-cropper'
	import api from '@/page/mainPage/api';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				type: 0,
				isShow: false,
				htmlUrl: '',
				options: {
					img: '',
					autoCrop: true,
					fixedBox: false,
					canMove: false,
					mode: '100%'
				},
			}
		},
		props: {
			/* 涂鸦是否关联题号 */
			ifTemporary: {
				type: Boolean,
				default: false
			}
		},
		components: {
			setDanmu,
			timeswiper,
			draw,
			VueCropper
		},
		computed: {
			...mapState(['isCountDown'])
		},
		mounted() {
			document.addEventListener('click', e => {
				if (this.$refs.TopImg) {
					if (!this.$refs.TopImg.contains(e.target)) {
						this.isShow = false;
						this.type = 0;
						this.$emit('close')
					}
				}

			});
		},
		methods: {
			...mapMutations(['SET_isCountDown']),
			close: function() {
				this.type = 0
			},
			showSet() {
				this.isShow = true
			},
			hide() {
				this.isShow = false
			},
			changeShow() {
				this.isShow = !this.isShow;
				console.log('122', this.isShow)
			},
			show(type) {
				const $me = this;
				if (this.type == type) {
					this.type = 0;
					// $me.$refs.timeswiper.cancelcountDown();
				} else {
					this.type = type;
					switch (type) {
						case 1:
							{
								break;
							}
						case 2:
							{
								// $me.$refs.timeswiper.show();
								break;
							}
						case 4:
							{
								$me.isShow = false;
								this.$emit('close');

								break;
							}
					}
				}

			},
			saveImgFullScreen() {
				/* 全屏截图 */
				const $me = this;
				$me.isShow = false;
				this.$nextTick(() => {
					$me.$postAction(api.saveImgFullScreen).then(da => {
						if (da.ret == 'success') {
							/* 截图保存给后端 */
							$me.htmlUrl = 'data:image/jpg;base64,' + da.data;
							// console.log(this.htmlUrl)
							$me.type = 3;
							/* todo 暂停计时器 */
							this.$emit('resumeCountDown', 0);
							this.$nextTick(() => {
								this.$refs.cropper.startCrop();
							})
						} else {
							$me.$toast.center(da.message);
						}
					})

				})
			},
			saveImg() {
				const $me = this;
				this.$refs.cropper.getCropData(data => {
					data.split('data:image/jpg;base64,')[1]
					this.type = 0;
					$me.$postAction(api.saveImg, {
						ifTemporary: !$me.ifTemporary,
						imgBase64: data.replace(/data:image\/jpeg;base64,/, '')
					}).then(da => {
						if (da.ret == 'success') {
							$me.$emit('resumeCountDown', 1)
							$me.$emit('close')
						} else {
							$me.$toast.center(da.message);
						}
					})


				})
			},
			canceImg() {
				this.type = 0;
				this.$emit('close');
				this.$emit('resumeCountDown', 1)
			},
			onChange() {
				let isCountDown = this.isCountDown == 1 ? 0 : 1;
				this.SET_isCountDown(isCountDown)
			},
		}
	}
</script>

<style scoped="scoped" lang="scss">
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.settoolbar {
		position: fixed;
		left: 50%;
		margin-left: -129px;
		bottom: 40px;
		// background: #1890ff url(../assets/set.png) no-repeat center center;
		background-size: 32px auto;
		border-radius: 100%;
		height: 63px;
		width: 63px;
		box-shadow: 0 0 10px rgba(24, 114, 255, 0.4);
		z-index: 9999;
		border: 3px solid #fff;
	}

	.toolbar {
		left: 210px;
		// transform: translateX(-100%);
		// margin-left: -150px;
		position: fixed;
		bottom: 40px;
		z-index: 9999;

		// display:none;
		&:before {
			content: '';
			display: block;
			left: -8px;
			bottom: 20px;
			position: absolute;
			height: 30px;
			width: 40px;
			border-radius: 20px;
			background: #fff;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
			z-index: 1;
		}

		&:after {
			content: '';
			display: block;
			left: 0;
			bottom: 10px;
			position: absolute;
			height: 50px;
			width: 36px;
			background: #fff;
			z-index: 1;
		}

		&>div {
			position: relative;

			background: #fff;
			border-radius: 10px;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
			padding: 20px;

			&>a {
				position: relative;
				display: inline-block;
				color: #333;
				font-size: 16px;
				text-align: center;
				margin: 0 15px;

				&>i {
					display: block;
					margin: 0 auto 8px;
					width: 61px;
					height: 61px;
					background: no-repeat center center;
					border-radius: 15px;
				}

				&.countDown {
					i {
						background-color: #77b19a;
						background-image: url(../assets/img/icon10.png);
						box-shadow: 3px 3px 10px rgba(119, 177, 154, .5);
					}
				}

				&.rollCall {
					i {
						background-color: #1890ff;
						// background-image: url(../assets/icon9.png);
						box-shadow: 3px 3px 10px rgba(24, 144, 255, .5);
					}
				}

				&.pickName {
					i {
						background-color: #f1c16b;
						// background-image: url(../assets/icon10.png);
						box-shadow: 3px 3px 10px rgba(241, 193, 107, .5);
					}
				}

				&.barrage {
					i {
						background-color: #7b6dfb;
						background-image: url(../assets/img/icon11.png);
						box-shadow: 3px 3px 10px rgba(123, 109, 251, .5);
					}
				}

				&.whiteblock {
					i {
						background-color: #4a5169;
						background-image: url(../assets/img/icon20.png);
						box-shadow: 3px 3px 10px rgba(87, 119, 166, .5);
					}
				}

				&.printScreen {
					i {
						background-color: #3970af;
						background-image: url(../assets/img/icon19.png);
						box-shadow: 3px 3px 10px rgba(87, 119, 166, .5);
					}
				}

				&.more {
					i {
						background-color: #5777a6;
						background-image: url(../assets/img/icon12.png);
						box-shadow: 3px 3px 10px rgba(87, 119, 166, .5);
					}
				}

				div.state {
					height: 20px;
					width: 20px;
					position: absolute;
					background: url(../assets/img/off1.png) no-repeat center center;
					left: 45px;
					top: 50px;

					&.active {
						background-image: url(../assets/img/on1.png)
					}
				}

				p {
					margin-bottom: 0;
				}
			}
		}
	}

	.printScreenbox {
		position: fixed;
		top: 0%;
		bottom: 0%;
		left: 0%;
		right: 0%;
		// background: rgba(255, 255, 255, .5);
		// border: 4px solid #1890ff;
		// border-radius: 8px;
		z-index: 100001;
	}

	.printScreenbox .optionbtn {
		position: absolute;
		bottom: 10px;
		left: 0;
		right: 0;
		text-align: center;
	}

	.printScreenbox .optionbtn a {
		display: inline-block;
		height: 40px;
		line-height: 40px;
		width: 120px;
		border-radius: 50px;
		background: #6b6b6b;
		color: #fff;
		margin: 0 20px;
	}

	.printScreenbox .optionbtn a.savebtn {
		background: #1890ff;
	}
</style>
