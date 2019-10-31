<template>
	<div>
		<div class="modbox">
			<div class="icon">
				<img src="../assets/img/menu1.png" alt="" v-if="theme!='theme4'"/>
				<img src="../assets/img/theme4/smenuicon1.png" alt="" v-if="theme=='theme4'"/>
				<span>字母A</span>
			</div>
			<span class="line"></span>
			<a-select class="select flex-1" size="large" v-model="range">
				<a-icon type="caret-down" slot="suffixIcon" />
				<a-select-option value="B">B</a-select-option>
				<a-select-option value="C">C</a-select-option>
				<a-select-option value="D">D</a-select-option>
				<a-select-option value="F">F</a-select-option>
			</a-select>
		</div>
		<div class="c-red">请输入A-{{range}}多位字母</div>
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				range:'D'
			};
		},
		mounted() {},
		computed: {
			...mapState(['theme'])
		},
		methods: {
			getRange(){
				return 'A-'+this.range
			}
		}
	};
</script>

<style scoped="scoped" lang="scss">
	.modbox {
		color: #fff;
		text-align: center;
		padding-top: 0;
		margin-bottom:20px;

		.line {
			height: 70px;
			width: 1px;
			background: #3f9be1;
			display: inline-block;
			vertical-align: middle;
			margin: 0 10px;
		}
	}

	.icon {
		font-size: 30px;
		color: #3f9be1;
		text-align: center;
		display: inline-block;
		vertical-align: middle;

		img {
			vertical-align: middle;
			margin-right: 10px;
		}

		span {
			vertical-align: middle;
		}
	}

	.select {
		width: 120px;
		display: inline-block;
		vertical-align: middle;
	}

	.btnbar {
		position: relative;
	}

	.startClass {
		display: block;
		margin: 40px auto;
		width: 3.6rem;
		height: 40px;
		border-radius: 50px;
		background: #3f9be1;
		font-size: 24px;
		line-height: 40px;
		color: #fff;

		text-align: center;
	}

	.timecheckbox {
		width: 100px;
		height: 40px;
		background: url(../assets/img/off.png) no-repeat center center;
		cursor: pointer;
		display: inline-block;
		vertical-align: middle;

		&.active {
			background-image: url(../assets/img/on.png);
		}
	}

	.theme2 .bg .timecheckboxbar span {
		color: #fff;

	}

	.theme3 {
		.startClass {
			width: 361px;
			height: 41px;
			background: url(../assets/img/theme3/endBtn.png) no-repeat center center;
			border-radius: 0;
		}
	}
	.c-red {
		color: #f00;
		width: 377px;
		margin: 20px auto 10px;
		font-size: 18px;
	}
</style>
