<template>
	<div class="bg">
		<div class="title">投票统计</div>
		<a href="javascript:;" class="reback" @click="returnback"></a>
		<div class="setbox">
			<a-form :form="form">
				<a-form-item label="投票主题" :label-col="{ span: 3}" :wrapper-col="{ span: 20 }">
					<a-input v-decorator="['title', { rules: [{ required: true, message: '请输入投票主题!' }] }]" placeholder="请输入投票主题"
					 allowClear />
				</a-form-item>
				<a-form-item label="投票描述" :label-col="{ span: 3}" :wrapper-col="{ span: 20 }">
					<a-textarea placeholder="请输入投票描述" :rows="4"  v-decorator="['describe', { rules: [{ required: true, message: '请输入投票描述!' }] }]"/>
				</a-form-item>
				<a-form-item label="投票对象" :label-col="{ span: 3 }" :wrapper-col="{ span:20 }">
					<div v-for="item in objlist" :key="item" class="objitem">
						<a-input v-decorator="['obj['+item+']', { rules: [{ required: true, message: '请输入投票对象!' }] }]" placeholder="请输入投票主题"
						 allowClear />
						<a-icon type="minus-circle" @click="delObj(item)" v-if="objlist.length>1" />
					</div>
				</a-form-item>
			</a-form>
			<a href="javascript:;" class="addObj" @click="addObj">
				<a-icon type="plus-circle" /><span>添加对象</span></a>
			<p class="tip">说明：A 表示赞成；B 表示反对；C 表示弃权；标题限制字数：20；描述限制字数：100；投票对象限制字数：5;</p>
			<a href="javascript:;" class="startVote" @click="startVote">开始投票</a>
		</div>
	</div>
</template>

<script>
	let maxId = 0;
	import api from '@/page/mainPage/api';
	export default {
		data() {
			return {
				form: this.$form.createForm(this),
				reftitletypelist: ['123', '345566'],
				product: {
					label: 'foo',
					value: 'Foo'
				},
				objlist: [0]

			};
		},
		methods: {
			returnback() {
				this.$router.go(-1);
			},
			addObj() {
				if (this.objlist.length >= 5) {
					return false;
				}
				this.objlist.push(++maxId);
			},
			delObj(key) {
				let list = this.objlist.filter(item => {
					if (item != key) {
						return item
					};
				})

				this.objlist = list;
			},
			startVote() {
				const $me=this;
				this.form.validateFields((err, values) => {
					if (!err) {
						console.log(values);
						$me.$postAction(api.startVote,values).then(da=>{
							this.$router.push({
								path: 'voteChart',
								query:{voteInfo:JSON.stringify(values)}
							});
						})
						
					}
				})
			}
		}

	};
</script>

<style scoped="scoped" lang="scss">
	/deep/ .ant-form-item {
		margin-bottom: 10px;
	}

	.objitem {
		width: 33.33%;
		display: inline-block;
		padding-right: 30px;
		position: relative;
	}

	.objitem .anticon {
		position: absolute;
		right: 5px;
		top: 15px;
	}

	.addObj {
		color: #333;
		font-size: 16px;
		margin: 0 auto 20px;
		display: block;
		width: 6em;
	}

	.addObj .anticon {
		margin-right: 10px;
	}

	.bg {
		position: absolute;
		height: 100%;
		width: 100%;
		left: 0;
		right: 0;
	}

	.tip {
		color: #d5525a;
		font-size: 14px;
		text-align: center;
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

	.theme1 .startVote,
	.theme2 .startVote {
		display: block;
		margin: 30px auto 0;
		width: 360px;
		height: 40px;
		border-radius: 50px;
		background: #3f9be1;
		font-size: 16px;
		line-height: 40px;
		color: #fff;
		text-align: center;
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

		.startVote {
			background: url(../assets/img/theme3/loginBtn.png);
			color: #060606;
			font-size: 14px;
			display: block;
			width: 240px;
			line-height: 40px;
			text-align: center;
			margin: 20px auto 0;
		}
	}

	.setbox {
		position: absolute;
		left: 0.15rem;
		right: 0.15rem;
		border-radius: 10px;
		padding: 40px 60px;
		bottom: 0;

		.ant-form {
			width: 800px;
			margin: 0 auto;
		}

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
</style>
