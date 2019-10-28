<template>
	<transition name="vs__fade">
		<div class="namelistbox" v-if="isshowNamelist">
			<div class="mask" @click.stop="closeNamelist"></div>
			<div class="namelistbox-bd">
				<a href="javascript:;" class="close" @click="closeNamelist">×</a>
				<ul class="clearfix">
					<li v-for="(item, index) in namelist" :class="{ active: item.checked }">
						<i :class="item.state == 0 ? 'warn' : 'success'" @click="checkOneStu(item)"></i>
						<span @click="checkOneStu(item)">{{ item.stuName }}</span>
						<img src="../assets/img/jiebang1.png" alt="" v-if="item.state == 1" @click="isUnBindStu('one',item)" style="opacity: .6;" />
						<img src="../assets/img/pwd2.png" alt="" v-if="item.state == 0" @click="BindOneStu(item)"  />
						<!-- <img src="../assets/img/pwd2.png" alt="" v-if="item.state == 0" @click="cancelBindOneStu(item)"  /> -->
					</li>
				</ul>

				<div class="tag">
					<span>已选择{{ checkbindStu }}个学生</span>
					<a href="javascript:;" @click="isUnBindStu('some')">解绑选中学生</a>
					<a href="javascript:;" @click="checkAll">全选</a>
					<a href="javascript:;" @click="uncheckAll">全不选</a>
				</div>
				<div @click="isUnBindStu('all')" class="unbindAllStu" title="一键解绑"><img src="../assets/img/jiebang.png" alt="" /></div>
			</div>
		</div>
	</transition>
</template>

<script>
	import api from '@/page/mainPage/api';
	export default {
		data() {
			return {
				isshowNamelist: false,
				namelist: [],
				sendInfo: {},
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
				this.getNamelist();
			} catch (e) {
				//TODO handle the exception
			}

		},
		methods: {
			shownamelist() {
				this.isshowNamelist = true;
				this.startBind();
			},
			closeNamelist(){
				this.isshowNamelist = false;
				this.stopBind();
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
					}else{
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
				if ($me.isAnswering) {
					$me.$toast.center('答题过程中不能解绑');
					return false;
				}
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
					cancelText: '取消',
					onOk() {
						$me.unBindStu(param)
					}
				});
			},
			BindOneStu(item){
				/* 单独绑定某个学生 */
				const $me = this;
				$me.$postAction(api.BindOneStu, {stuCode:item.stuCode}).then(da => {
					if (da && da.ret == 'success') {
						// $me.$toast.center('绑定成功');
						// $me.getNamelist();
					} 
				})
			},
			cancelBindOneStu(item){
				/* 单独取消绑定某个学生 */
				const $me = this;
				$me.$postAction(api.cancelBindOneStu, {stuCode:item.stuCode}).then(da => {
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
			startBind(){
				this.$postAction(api.startBind)
			},
			stopBind(){
				this.$postAction(api.stopBind)
			}
		}
	};
</script>

<style>
</style>
