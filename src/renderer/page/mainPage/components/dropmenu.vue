<template>
	<div class="dropdown" ref="dropdown">
		<a href="javascript:;" class="dropdownarrow" @click="searchFlag = !searchFlag"><i class="icon icon-filter-arrow" :class="{ 'filter-show': searchFlag }"></i></a>
		<div class="dropdownlist slideDown animated" v-if="searchFlag">
			<ul>
				<li v-for="(item, index) in reftitletypelist" :key="index" @click="choseValue(item)">
					<a href="javascript:;">
						<slot :data="item">{{ item }}</slot>
					</a>
				</li>
				<li v-if="!reftitletypelist || reftitletypelist.length == 0" class="vs__no-options" @mousedown.stop=""><slot name="no-options">没有筛选数据</slot></li>
			</ul>
		</div>
	</div>
</template>

<script>
export default {
	name: 'dropmenu',
	data() {
		return {
			searchFlag: false
		};
	},

	props: {
		reftitletypelist: Array
	},
	mounted() {
		document.addEventListener('click', e => {
			if (this.$refs.dropdown) {
				if (!this.$refs.dropdown.contains(e.target)) {
					this.searchFlag = false;
				}
			}
		});
	},
	methods: {
		choseValue(talkname) {
			this.searchFlag = false;
			this.$emit('selTalkName', talkname);
		}
	}
};
</script>

<style scoped="scoped">
.dropdown {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
}

.dropdown .dropdownarrow {
	height: 60px;
	width: 54px;
	border-left: 2px solid #3f9be1;
	display: block;
	position: absolute;
	right: 0;
	top: 0;
}

.dropdown .dropdownlist,
.selectFilter .dropdownlist {
	position: absolute;
	left: 0;
	top: 60px;
	background: #fff;
	width: 100%;
	color: #000;
	z-index: 9999;
	max-height: 200px;
	overflow: auto;
	border: 2px solid #3f9be1;
}

.dropdown .dropdownlist li a {
	display: block;
	padding: 0 10px;
	line-height: 56px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	cursor: pointer;
	text-align: left;
	color: #000;
	font-size: 26px;
}

.dropdown .dropdownlist li a:active,
.dropdown .dropdownlist li a:hover {
	background: #3f9be1;
	color: #fff;
}

.icon-filter-arrow {
	right: 20px;
	top: 28px;
	position: absolute;
	transition: all 0.2s;
	border: 10px solid transparent;
	border-top-color: #000;
	transform-origin: center 2px;
}

.icon-filter-arrow.filter-show {
	-webkit-transform: rotate(-180deg);
	transform: rotate(-180deg);
}
@-webkit-keyframes slideDown {
	from {
		height: 0;
		overflow: hidden;
	}

	to {
		height: auto;
		overflow: auto;
	}
}

@keyframes slideDown {
	from {
		/* transform: scale(1,0); */
		height: 0;
	}

	100% {
		height: auto;
		/* transform: scale(1,1); */
	}
}

.slideDown {
	-webkit-animation-name: slideDown;
	animation-name: slideDown;
	-webkit-transform-origin: center top;
	transform-origin: center top;
	-webkit-animation-duration: 0.3s;
	animation-duration: 0.3s;
}
.dropdownlist {
	border-radius: 5px;
	box-sizing: border-box;
	top: 65px;
	width: auto;
	left: 5em;
	right: 0;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>
