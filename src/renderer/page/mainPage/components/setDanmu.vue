<template>
	<div class="setdanmu">
		<div>
			<div class="setdanmu-hd flex flex-pack-justify flex-align-center"><span>弹幕设置</span>
				<a-switch size="small" defaultChecked />
			</div>
			<div class="setdanmu-bd">
				<div class="flex flex-pack-justify">
					<span>单题单选题</span>
					<a-switch size="small" defaultChecked />
				</div>
				<div class="flex flex-pack-justify">
					<span>单题单选题</span>
					<a-switch size="small" defaultChecked />
				</div>
				<div class="flex flex-pack-justify">
					<span>单题单选题</span>
					<a-switch size="small" defaultChecked />
				</div>
				<div class="flex flex-pack-justify">
					<span>单题单选题</span>
					<a-switch size="small" defaultChecked />
				</div>
			</div>
			<div class="setdanmu-ft">
				<a href="javascript:;" class="saveBtn">确定</a>
			</div>
		</div>
		<div>
			<div class="setdanmu-hd flex flex-pack-justify flex-align-center"><span>单题单选题设置</span>
				<a-switch size="small" defaultChecked />
			</div>
			<div class="setdanmu-bd">
				<div>
					<span>显示区域</span>
					<div class="flex flex-pack-justify flex-align-center">
						<a-radio :value="1" size="small">A</a-radio>
						<a-radio :value="2" size="small">B</a-radio>
						<a-radio :value="3" size="small">C</a-radio>
						<a-radio :value="4" size="small">D</a-radio>
					</div>
				</div>
				<div>
					<span>弹幕方向</span>
					<div class="flex flex-pack-justify flex-align-center small">
						<a-radio :value="1" size="small">从左至右</a-radio>
						<a-radio :value="2" size="small">从右至左</a-radio>
						<a-radio :value="3" size="small">从上至下</a-radio>
						<a-radio :value="4" size="small">从下至上</a-radio>
					</div>
				</div>
				<div>
					<span>不透明度</span>
					<div class="flex flex-pack-justify flex-align-center">
						<a-slider :defaultValue="30"  class="flex-1" />
						<span>12</span>
					</div>
				</div>
				<div>
					<span>字体大小</span>
					<div class="flex flex-pack-justify flex-align-center">
						<a-slider :defaultValue="30"  class="flex-1" />
						<span>12</span>
					</div>
				</div>
			</div>
			<div class="setdanmu-ft">
				<a href="javascript:;" class="defaultBtn">恢复默认值</a>
				<a href="javascript:;" class="saveBtn">确定</a>
			</div>
		</div>
	</div>
</template>

<script>
</script>

<style scoped="scoped" lang="scss">
	.setdanmu {
		background: #333;
		border-radius: 10px;
		color: #fff;
		width: 331px;

		& .setdanmu-hd {
			height: 62px;
			padding: 0 30px;
			border-bottom: 1px solid #666;
			font-size: 18px;
		}

		& .setdanmu-bd {
			padding: 0 30px;
			font-size: 14px;

			&>div {
				padding: 10px 0;
			}
		}

		& .setdanmu-ft {
			padding-bottom: 20px;
		}

		.saveBtn ,.defaultBtn{
			display: block;
			background: #1890ff;
			color: #fff;
			line-height: 30px;
			width: 221px;
			border-radius: 50px;
			text-align: center;
			margin: 20px auto 0;
			font-size: 18px;
		}
		.defaultBtn{
			background: #999;
		}

		.small /deep/ .ant-radio-wrapper {
			font-size: 10px;

			span.ant-radio+* {
				padding-left: 2px;
			}
		}

		/deep/ .ant-switch-checked {
			background: #00de8d;
		}

		/deep/ .ant-radio-wrapper {
			color: #fff;
		}
	}
</style>
