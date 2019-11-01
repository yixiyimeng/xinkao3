<template>
	<transition name="vs__fade">
		<div class="namelistbox" v-if="isshowNamelist">
			<div class="mask" @click.stop="closeNamelist"></div>
			<div class="namelistbox-bd">
				<a href="javascript:;" class="close" @click="closeNamelist">×</a>
				<ul class="clearfix">
					<li v-for="(item, index) in namelist" :key="index">
						<span>{{ item.stuName }}</span>
						<span v-if="item.answer">({{item.answer|filterAnswer}})</span>
					</li>
				</ul>
	
		   </div>
		</div>
	</transition>
</template>
<script>
	export default {
		data() {
			return {
				isshowNamelist: false,
			};
		},
		props: {
			namelist: {
				type: Array,
				default: []
			}
		},
		
		created() {
			
		},
		methods: {
			show(){
				this.isshowNamelist=true
			},
			closeNamelist(){
				this.isshowNamelist=false
			}
		},
		filters:{
			filterAnswer(value){
				if(value=='false'){
					return '×'
				}else if(value=='true'){
					return '√'
				}else{
					return value
				}
			}
		}
	};
</script>

<style>
</style>