<template>
	<div class="bg">
		<div class="title">设置</div>
		<!-- <a href="javascript:;" class="reback" @click="returnback"></a> -->
		<reback></reback>
		<div class="setbox">
			<div>
				<label>系统信道设置</label>
				<a-select  class="select">
					<a-select-option value="jack">Jack</a-select-option>
					<a-select-option value="lucy">Lucy</a-select-option>
					<a-select-option value="disabled" disabled>Disabled</a-select-option>
					<a-select-option value="Yiminghe">yiminghe</a-select-option>
				</a-select>
			</div>
			<div class="mt15">
				<label>答题器发送功率</label>
				<a-select  class="select">
					<a-select-option value="jack">Jack</a-select-option>
					<a-select-option value="lucy">Lucy</a-select-option>
					<a-select-option value="disabled" disabled>Disabled</a-select-option>
					<a-select-option value="Yiminghe">yiminghe</a-select-option>
				</a-select>
			</div>
			<div class="linklist">
				<a href="">读取</a>
				<a href="">设置</a>
				<a href="">设为默认值</a>
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
export default {
	components: {
	reback
	},
	data() {
		return {
			reftitletypelist: ['123', '345566'],
			product: { label: 'foo', value: 'Foo' }
		};
	},
	methods: {
		returnback() {
			this.$router.go(-1);
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
		width: 112px;
		height: 50px;
		text-align: right;
		padding-top: 15px;
	}
	.setbox {
		top: 150px;
		background: #fff;
		bottom: 40px;
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
		left:.6rem;
		right:.6rem;
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
	/deep/ .ant-select-selection{
		background: none;
		border: 1px solid #07f8ff;
		color: #fff;
	}
	/deep/ .ant-select-arrow{
		color: #07f8ff
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
		& + a {
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
		& + a {
			margin-left: 40px;
		}
	}
}
	.select{
			width: 200px;
		}
</style>
