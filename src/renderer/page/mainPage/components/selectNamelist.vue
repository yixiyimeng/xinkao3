<template>
	<transition name="vs__fade">
		<div class="namelistbox" v-if="isshowNamelist">
			<div class="mask" @click.stop="closeNamelist"></div>
			<div class="namelistbox-bd">
				<a href="javascript:;" class="close" @click="closeNamelist">×</a>
				<ul class="clearfix">
					<li v-for="(item, index) in namelist" :key="index">
						<span>{{ item.stuName }}</span>
						<template v-if="isShowAnswer">
							<span v-if="item.answer">({{ item.answer | filterAnswer(questiontype) }})</span>
							<span v-else>(未作答)</span>
						</template>
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
			isShowAnswer: true
		};
	},
	props: {
		namelist: {
			type: Array,
			default: []
		},
		questiontype: {
			type: [String, Number],
			default: ''
		}
	},

	created() {},
	methods: {
		show(type) {
			if (type && type == 1) {
				this.isShowAnswer = false;
			} else {
				this.isShowAnswer = true;
			}
			this.isshowNamelist = true;
		},
		closeNamelist() {
			this.isshowNamelist = false;
		}
	},
	filters: {
		filterAnswer(value, questionType) {
			console.log('questionType', questionType);
			if (questionType == 2) {
				if (value == 'F') {
					return '×';
				} else if (value == 'E') {
					return '√';
				} else {
					return value;
				}
			} else {
				return value;
			}
		}
	}
};
</script>

<style></style>
