<template>
	<div class="bg" v-if="isshowlist">
		<a href="javascript:;" class="reback" @click="returnback"></a>
		<div class="setbox singInbox">
			<div class="singlist">
				<ul class="clearfix">
					<li v-for="(item, index) in namelist" :class="{ active: item.checked }">
						<i :class="item.state == 0 ? 'warn' : 'success'" @click="checkOneStu(item)"></i>
						<span @click="checkOneStu(item)">{{ item.stuName }}</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import api from '@/page/mainPage/api';
	export default {
		data() {
			return {
				namelist: [],
				isshowlist: false
			};
		},

		created() {

		},
		methods: {
			show() {
				this.isshowlist = true;
				/* 调用签到开始 */
				this.startSingIn()
				// this.getAttendanceList().then(() => {
				// 	
				// })
			},
			hide() {
				this.isshowlist = false;
				/* 调用签到结束 */
				this.stopSingIn();
			},
			returnback() {
				this.hide();
				this.$emit('returnback')
			},
			/* 开始绑定学生 */
			startSingIn() {
				this.$postAction(api.startSingIn).then(da=>{
					this.getAttendanceList();
					this.$emit('startAnswer')
				})
			},
			stopSingIn() {
				this.$postAction(api.stopSingIn).then(da=>{
					this.$emit('stopAnswer')
				})
			},
			/* 获取签到列表 */
			getAttendanceList() {
				const $me = this;
				return $me.$postAction(api.getAttendanceList).then(da => {
					if (da && da.ret == 'success') {
						$me.namelist = da.data;
					} else {
						$me.namelist = [];
					}
				})

			}
		}
	};
</script>

<style scoped="scoped" lang="scss">
	 @import '../assets/css/set.scss';
	 .theme1 .bg .setbox {
	 	background: rgba(255, 255, 255, .7);
	 }
// 	.theme4 .singInbox {
// 		width: 80%;
// 		top: 160px;
// 		bottom: 10%;
// 		background: #fff;
// 		padding: 18px;
// 		position: absolute;
// 		left: 10%;
// 		border: 2px solid #1e569e;
// 
// 		&:before {
// 			display: block;
// 			content: '';
// 			height: 91px;
// 			width: 549px;
// 			background: url(../assets/img/theme4/bg.png);
// 			position: absolute;
// 			top: -5px;
// 			left: 50%;
// 			transform: translateX(-50%);
// 		}
// 
// 		&>div {
// 			border: 2px solid #df8487;
// 			background: url(../assets/img/theme4/bg2.png);
// 			padding: 70px 35px 15px;
// 			overflow: auto;
// 			height: 100%;
// 		}
// 	}
// 
.theme1 .bg .setbox > div.singlist,
.theme4 .bg .setbox > div.singlist{
	padding-left: 20px;
	padding-right: 20px;
}
	.singlist ul {
		height: 100%;
		overflow: auto;
		margin-bottom: 0;
	
		
	}

	.singlist ul>li {
		float: left;
		margin: 10px 0;
		color: #333;
		width: 25%;
		padding-left: 10px;
		box-sizing: border-box;
		line-height: 20px;
		cursor: pointer;
		font-size: 18px;
	}

	.singlist ul li i {
		width: 16px;
		height: 16px;
		display: inline-block;
		border-radius: 50%;
		vertical-align: middle;
		position: relative;
		margin-right: 5px;
	}

	.singlist ul li i.success {
		background-color: #52c41a;
	}

	.singlist ul li i.warn {
		background-color: #f5222d;
	}
</style>
