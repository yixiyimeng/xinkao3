<template>
	<div class="bg">
		<div class="title"><span v-for="item in title" :key="item">{{item}}</span></div>
		<reback></reback>
		<div class="classbox">
			<div>
				<div class="form-group">
					<div class="input-row flex flex-align-center">
						<label>班级</label>
						<a-select class="select flex-1" size="large" v-model="formData.classCode" @change="handleChange">
							<a-icon type="caret-down" slot="suffixIcon" />
							<a-select-option :value="item.code" v-for="(item,index) in classList" :key="index">{{item.name}}</a-select-option>
						</a-select>
					</div>
					<div class="input-row mt10  flex flex-align-center">
						<label>科目</label>
						<a-select class="select flex-1" size="large" v-model="formData.subjectCode" @change="handleChange">
							<a-icon type="caret-down" slot="suffixIcon" />
							<a-select-option :value="item.code" v-for="(item,index) in subjectList" :key="index">{{item.name}}</a-select-option>
						</a-select>
					</div>
					<div class="input-row mt10  flex flex-align-center">
						<label>课程名</label>
						<a-input class="flex-1 inputtxt" size="large" v-model="formData.topicName" @input="changrTopic"></a-input>
						<a-dropdown :trigger="['click']" placement="bottomRight" class="dropdown" :overlayStyle="{'width': theme=='theme4'?'400px':'200px'}" v-if="TopicTitleList.length>0"  >
							<span>
								<a-icon type="caret-down" />
							</span>
							<a-menu slot="overlay">
								<a-menu-item @click="setTopicName(item)" v-for="(item,index) in TopicTitleList" :key="index">{{item.name}}</a-menu-item>
							</a-menu>
						</a-dropdown>
					</div>
					<div class="input-row flex" v-if="formData.questionId > 0 || formData.tempQuestionId > 0">
						<label></label>
						<a-checkbox v-model="isClearquestion" class="flex-1">
							是否清空之前作答记录
						</a-checkbox>
					</div>
					<div class="input-row  flex flex-align-center" :class="{mt10:!formData.questionId&&!formData.tempQuestionId}">
						<label>试卷</label>
						<a-range-picker :open="openRange" v-model="rangetime" @change="changrTime" style="width: 1px;opacity: 0; height: 0;">
						</a-range-picker>
						<a-icon type="calendar" @click="openRange=true" class="seltime" />
						<a-select class="select flex-1" size="large" v-model="formData.titleCode" style="text-indent: 1.5em;">
							<a-icon type="caret-down" slot="suffixIcon" />
							<a-select-option :value="item.code" v-for="(item,index) in testpaperList" :key="index">{{item.name}}</a-select-option>
						</a-select>
					</div>
				</div>
				<a-button class="startClass" :loading="loading" @click="sendClass">
					开始上课
				</a-button>
			</div>
			<!-- <a href="javascript:;" class="startClass" ></a> -->
		</div>
	</div>
</template>

<script>
	import reback from '@/page/mainPage/components/reback';
	import api from '@/page/mainPage/api';
	import moment from 'moment'
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			reback
		},
		data() {
			return {
				title:'课程设置',
				isClearquestion: false,
				schoolCode: '', //学校code
				sendInfo: {}, //发送数据 
				classList: [], //班级
				subjectList: [], //科目
				TopicTitleList: [], //课程名
				testpaperList: [], //试卷
				formData: {
					classCode: '',
					className: '',
					subjectCode: '',
					subjectName: '',
					topicCode: '',
					topicName: '',
					titleCode: '',
					titleName: '',
					questionId: 0,
					tempQuestionId: 0,
				},
				rangetime: [],
				openRange: false,
				loading: false,
				// theme:'theme4'

			};
		},
		computed: {
			...mapState(['theme'])
		},
		created() {
			this.sendInfo = JSON.parse(this.$route.query.sendInfo);
			this.schoolCode = this.sendInfo.schoolCode;
			this.getClasslist();
			this.getSubjectlist();
			this.rangetime[0] = moment().subtract(30, 'days');
			this.rangetime[1] = moment();
			this.getTopicTitle();
		},
		methods: {
			gotoPage() {
				this.$router.push({
					path: 'startClass',
					query: {
						sendInfo: JSON.stringify(this.sendInfo)
					}
				});
			},
			/* 选择课程名 ,需要记录 答题记录, 临时题记录*/
			setTopicName(topic) {
				this.formData.topicName = topic.name;
				this.formData.topicCode = topic.code;
				this.formData.questionId = topic.questionId;
				this.formData.tempQuestionId = topic.tempQuestionId;
			},
			/* 手动输入课程名称后，需要清空课程code， 答题记录，临时题记录 */
			changrTopic() {
				/* 手动输入主题,清空主题code */
				this.formData.topicCode = '';
				this.formData.questionId = '';
				this.formData.tempQuestionId = '';
			},
			/* 查询班级 */
			getClasslist() {
				var param = {
					schoolCode: this.schoolCode
				};
				const $me = this;
				this.$postAction(api.getClasses, param).then(da => {
					if (da && da.ret == 'success') {
						var list = da.data;
						$me.classList = [];
						if (list.length > 0) {
							$me.classList = list.map(item => {
								return {
									name: item.name,
									code: item.code
								};
							});
						}

					}
				});
			},
			/* 查询科目 */
			getSubjectlist() {
				const $me = this;
				this.$postAction(api.getSubjectlist).then(da => {
					if (da && da.ret == 'success') {
						var list = da.data;
						$me.subjectList = [];
						if (list.length > 0) {
							$me.subjectList = list.map(item => {
								return {
									name: item.name,
									code: item.value
								};
							});
						}

					}
				});
			},
			/*获取课程名*/
			getTopicTitle() {
				const $me = this;
				this.$postAction(api.getTopicTitle, {
					teacherCode: $me.sendInfo.teacAssistantCode
				}).then(da => {
					if (da && da.ret == 'success') {
						var list = da.data;
						$me.TopicTitleList = [];
						if (list.length > 0) {
							$me.TopicTitleList = list.map(item => {
								return {
									name: item.topicName,
									code: item.topicCode
								};
							});
						}

					}
				});

			},
			/* 查询试卷 */
			getTestpaperList() {
				const $me = this;
				if (this.formData.classCode && this.formData.subjectCode && this.rangetime.length == 2 && this.rangetime[0] && this
					.rangetime[1]) {
					var param = {
						classCode: this.formData.classCode,
						subjectCode: this.formData.subjectCode,
						startDateTime: this.rangetime[0].format('YYYY-MM-DD') + ' 00:00:00',
						endDateTime: this.rangetime[1].format('YYYY-MM-DD') + ' 23:59:59'
					};
					this.$postAction(api.getTestpaperList, param).then(da => {
						if (da && da.ret == 'success') {
							var list = da.data;
							$me.testpaperList = [];
							if (list.length > 0) {
								$me.testpaperList = list.map(item => {
									return {
										name: item.titleName,
										code: item.titleCode
									};
								});
									$me.testpaperList.unshift({
									name: '不选',
									code: ''
								});
							} else {
								this.formData.titleCode = ''
							}

						}
					});
				}
			},
			/* 切换班级或者科目的时候，重新查询试卷 */
			handleChange() {
				this.getTestpaperList();
			},
			/* 切换时间的时候，重新查询试卷 */
			changrTime() {
				this.openRange = false;
				this.getTestpaperList();
			},
			/* 点击开始上课 */
			sendClass() {
				const $me = this;
				/* 先判断是否loading，防止重复提交 */
				if ($me.loading) {
					return false;
				}
				if ($me.formData.classCode && $me.formData.subjectCode && $me.formData.topicName) {
					$me.formData.className = $me.classList.find(item => item.code == $me.formData.classCode).name;
					$me.formData.subjectName = $me.subjectList.find(item => item.code == $me.formData.subjectCode).name;
					if ($me.formData.topicCode) {
						/* 判断是否清空了之前作答记录*/
						$me.formData.questionId = $me.isClearquestion ? null : $me.formData.questionId;
						$me.formData.tempQuestionId = $me.isClearquestion ? null : $me.formData.tempQuestionId;
					}
				} else {
					this.$toast.center(!$me.classCode ? '请选择班级' : (!$me.subjectCode ? '请选择科目' : '请输入或者选择一个课程名'));
					return false;
				}
				$me.loading = true;
				/* 如果有选择了试卷，则需要同步 */
				$me.sendInfo = Object.assign({}, $me.sendInfo, $me.formData);
				console.log($me.sendInfo);
				if ($me.formData.titleCode) {
					$me.sendInfo.titleName = $me.testpaperList.find(item => item.code == $me.formData.titleCode).name;
					$me.synchronizedCoursewareQuestions();
				} else {
					$me.startDirectBroadcasts();
				}

			},
			/* 开始上课 */
			startDirectBroadcasts() {
				const $me = this;
				sessionStorage.setItem('sendInfo', JSON.stringify($me.sendInfo));
				$me.$postAction(api.startClass, $me.sendInfo).then(da => {
					if (da && da.ret == 'success') {
						$me.gotoPage();
					}
				}).finally(() => {
					$me.loading = false;
				})
			},
			/* 同步试卷 */
			synchronizedCoursewareQuestions() {
				const $me = this;
				$me.$postAction(api.synchronizedCoursewareQuestions, {
					titleCode: $me.titleCode
				}).then(da => {
					if (da && da.ret == 'success') {
						$me.startDirectBroadcasts();
					}
				}).catch(function(err) {
					$me.loading = false;
				});

			}
		}
	};
</script>

<style scoped="scoped" lang="scss">
	// @import '../assets/css/set.scss';

	.bg {
		.classbox {
			position: absolute;

			.select {
				width: 280px;
				border-radius: 50px;
			}

			/deep/ .ant-select-arrow {
				font-size: 14px;
			}

			&>div {
				.form-group .input-row {
					position: relative;

					&>label {
						display: inline-block;
						width: 3em;
						text-align: right;
						font-size: 18px;
						margin-right: 10px;
						color: #333;
						line-height: 40px;
						
					}

					& /deep/ .ant-checkbox-wrapper {
						text-align: left;
						font-size: 14px;
						color: #666;
					}
				}
			}

			.seltime {
				position: absolute;
				left: 5.4em;
				z-index: 999;
			}

		}
	}

	.theme1 .bg {
		background-image: url(../assets/img/theme1/kcbg.png);

		.classbox {
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);

			&>div {
				padding: 30px 80px;
				background: rgba($color: #fff, $alpha: 0.7);
				border-radius: 10px;
			}
		}
	}

	.theme2 .bg {
		background-image: url(../assets/img/theme2/setClass.png);
		background-position: center 30px;

		.classbox {
			left: 50%;
			top: 230px;
			transform: translateX(-50%);

			&>div {
				padding: 30px 80px;
				background: #fff;
				border-radius: 10px;
			}
		}
	}

	.theme1 .startClass,
	.theme2 .startClass {
		display: block;
		margin: 40px auto 0;
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
		background: none;

		.classbox {
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			margin-top: 20px;

			.select {
				width: 200px;
				border-radius: 50px;
				background: none;
			}

			/deep/ .ant-select-selection,
			/deep/ .ant-input {
				background: none;
				border: 1px solid #07f8ff;
				color: #fff;
			}

			/deep/ .ant-select-arrow,
			.dropdown {
				font-size: 20px;
				color: #07f8ff;
			}

			/deep/ .ant-select-arrow {
				margin-top: -8px;
			}

			&>div {
				background: url(../assets/img/theme3/setclassbg.png);
				height: 221px;
				width: 505px;
				padding: 43px 100px;

				&.form-group .input-row {
					label {
						color: #fff;
					}
				}
			}

			.startClass {
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
	}
	.theme4{
		.bg{
			.classbox{
				width: 716px;
				background: #fff;
				padding: 18px;
				position: relative;
				border: 2px solid #1e569e;
				transform: translate(-50%, -50%);
				top: 50%;
				left: 50%;
				position:absolute;
				&:before {
					display: block;
					content: '';
					height: 91px;
					width: 549px;
					background: url(../assets/img/theme4/bg.png);
					position: absolute;
					top: -5px;
					left: 50%;
					transform: translateX(-50%);
				}
				
				&>div {
					border: 2px solid #df8487;
					background: url(../assets/img/theme4/bg2.png);
					padding: 70px 85px 45px 40px;
					.form-group .input-row {
						label {
							font-size: 24px;
							width: 3em;
							color: #333;
							display: block;
							text-align: right;
							margin-right: 20px;
						}
						.inputtxt /deep/ .ant-input-lg,/deep/ .ant-select-lg .ant-select-selection--single{
							// border: 1px solid #333;
							line-height: 50px;
							height: 50px;
						}
						/deep/ .ant-select-selection__rendered{
							line-height: 48px;
						}
						.select /deep/  .anticon,.dropdown /deep/ .anticon{
							font-size: 20px;
						}.dropdown /deep/ .anticon{
							margin-top: 20px;
						}.select /deep/  .anticon{
							margin-top: -3px;
						}
						.dropdown{
							line-height: 50px;
						}
						
					}
				}
				.seltime{
					left: 7.4em;
					}
				.startClass {
					display: block;
					width: 100%;
					background:#ffd941;
					color: #fff;
					font-size: 14px;
					font-size: 24px;
					color: #333;
					line-height: 60px;
					height: 60px;
					box-shadow: 0 2px 5px rgba(0,0,0,.6);
					border-radius: 5px;
					margin-top: 35px;
					&:hover,&:active{
						border: none;
					}
				}
				
			}
		}
	}
</style>
