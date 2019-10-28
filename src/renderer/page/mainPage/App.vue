<template>
	<a-locale-provider :locale="locale">
		<div id="app" class="theme1">
			<router-view></router-view>
			<div class="timg"></div>
		</div>
	</a-locale-provider>
</template>

<script>
	import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
	export default {
		data() {
			return {
				locale: zhCN
			}
		},
		created() {
			// localStorage.setItem('theme', 'theme1');
		},
		mounted() {

		}
	}
</script>

<style lang="scss">
	@import 'assets/css/animate.css';
	@import 'assets/css/reset.css';
	@import 'assets/css/index.scss';

	.ant-message .ant-message-notice-content {
		padding: 0;
		overflow: hidden;

		.ant-message-custom-content {
			padding: 10px 16px;
			border-radius: 4px;
		}

		.ant-message-info {
			background: #e6f7ff;
			border: 1px solid #91d5ff;
		}

		.ant-message-success {
			background: #f6ffed;
			border: 1px solid #b7eb8f;
		}

		.ant-message-error {
			background: #fff1f0;
			border: 1px solid #ffa39e;
		}

		.ant-message-warning {
			background: #fffbe6;
			border: 1px solid #ffe58f;
		}
	}

	.download,
	.exitappWin {
		position: fixed;
		background: rgba(0, 0, 0, 0.4);
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: 9999;
	}

	.download .confirm,
	.exitappWin .confirm {
		width: 360px;
		box-sizing: border-box;
		background: #fff;
		border-radius: 14px;
		position: fixed;
		top: 40%;
		left: 50%;
		padding-top: 60px;
		-webkit-transform: translate(-50%, -50%);
		padding-bottom: 20px;
	}

	.download .confirm>div,
	.exitappWin .confirm>div {
		position: relative;
		z-index: 999;
	}

	.download .confirm img {
		position: absolute;
		top: -100px;
		width: 100%;
		left: 0;
		z-index: 0;
	}

	.download .confirm .title {
		line-height: 40px;
		font-size: 20px;
		margin-bottom: 10px;
		padding: 100px 50px 0;
	}

	.download .confirm .txt {
		color: #999;
		padding: 0 50px;
	}

	.download .confirm .buttonGroup,
	.exitappWin .confirm .buttonGroup {
		margin-top: 40px;
		height: 40px;
		overflow: hidden;
		line-height: 40px;
		text-align: center;
	}

	.download .confirm .buttonGroup a,
	.exitappWin .confirm .buttonGroup a {
		display: inline-block;
		width: 40%;
		color: #000;
		border-radius: 20px;
		margin: 0 5px;
		background: #eee;
	}

	.download .confirm .buttonGroup a.comfirmBtn,
	.exitappWin .confirm .buttonGroup a.comfirmBtn {
		background: #ffe400;
	}

	.exitappWin .confirm .title {
		line-height: 40px;
		font-size: 20px;
		margin-bottom: 10px;
		text-align: center;
	}

	#app {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.theme1#app {
		background-image: linear-gradient(#409be1, #ffffff);

		.timg {
			content: '';
			display: block;
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			background: url(assets/img/theme1/theme-bg.png) no-repeat top center;
			background-size: 100% auto;
			height: 1.08rem;
		}
	}

	.theme2#app {
		background: url(assets/img/theme2/bg.jpg) #0773d2;
	}

	.theme3#app {
		background: url(assets/img/theme3/bg.jpg) #0773d2 no-repeat center center;
		background-size: cover;
	}
</style>
