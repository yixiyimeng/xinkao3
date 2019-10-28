<template>
	<div class="bg">
		<div class="title">检测</div>
		<a href="javascript:;" class="getPaper">收取试卷</a>
		<div class="setbox">
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
</template>

<script>
export default {
	components: {},
	data() {
		return {
			list: new Array(100)
		};
	},
	methods: {}
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
	margin: 6px;
	.progressbar {
		height: 14px;
		font-size: 11px;
		text-align: center;
		position: relative;
		overflow: hidden;
		margin-top: 5px;
		& > div {
			width: 50%;
			height: 100%;
			border-radius: 2px;
		}
		& > span {
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

			& > div {
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

.theme3{
	.bg{
		background:none;
		.setbox{
			left: 10px;
			right: 10px;
			bottom: 15px;
			top: 132px;
			background: url(../assets/img/theme3/setboxbg2.png) no-repeat center top;
			background-size:100% auto;
		}
		&>.title {
			height:38px;
			padding-left: 117px;
			line-height: 38px;
			font-size: 23px;
			top: 83px;
			left: 75px;
		}
	}
	.getPaper{
		background: rgba($color: #07f8ff, $alpha: .3);
		border:1px solid #07f8ff;
		color: #fff;
		top:83px;
	}
	.userlist li {
		background: rgba($color: #07f8ff, $alpha: .3);
		border:1px solid #07f8ff;
		font-size: 14px;
		color: #fff;
		.progressbar {
			background: #fff;
			border-radius: 4px;
			box-shadow: inset 0 0 10px rgba($color: #3f9be1, $alpha: 0.28);
			color: #336699;
			font-size: 11px;
			& > div {
				background: #07f8ff;
			}
		}
	}
}
</style>
