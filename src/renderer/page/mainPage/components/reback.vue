<template>
	<a href="javascript:;" class="reback" @click="returnback"></a>
</template>

<script>
	export default {
		data() {
			return {
			
			};
		},
		methods: {
			returnback() {
				// this.$router.go(-1);
				 this.$router.push('/login');
			}
		}
	};
</script>

<style>
</style>
