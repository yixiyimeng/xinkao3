<template>
	<div class="bg">
		<div class="title"><span v-for="item in title" :key="item">{{item}}</span></div>
		<a href="javascript:;" class="reback" @click="returnback" ></a>
		<div class="setbox">
			<div>
				<ul class="userlist clearfix">
					<li v-for="i in list" :key="i">
						<div>刘德华</div>
						<div class="progressbar">
							<span>25.0%</span>
							<div></div>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="btnbar">
			<a href="javascript:;" class="startClass">收取试卷</a></div>
	</div>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				title:'随堂检测',
				list: new Array(100)
			};
		},
		methods: {
			returnback(){
				this.$router.go(-1);
			}
		}
	};
</script>

<style scoped="scoped" lang="scss">
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
		margin: 6px;

		.progressbar {
			height: 14px;
			font-size: 11px;
			text-align: center;
			position: relative;
			overflow: hidden;
			margin-top: 5px;

			&>div {
				width: 50%;
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

	.theme1 .bg {
		.setbox {
			padding: 25px 35px;
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
		top: 168px;
		transform: translate(-50%, 0);
		bottom: 120px;
		width: 80%;

		&>div {
			height: 100%;
			overflow: hidden;
			padding:65px 0 15px;
			
			.userlist{
				padding:0 90px;
				li {
				font-size: 20px;
				color: #2459a0;
				width:10%;
				.progressbar {
					background: #fff;
					border-radius: 4px;
					color: #2459a0;
					font-size: 14px;
					border:1px solid #2459a0;
					line-height:20px;height:20px;
					&>div {
						background: #ffd941;
					}
				}
				}
			}
		}
	}
</style>
