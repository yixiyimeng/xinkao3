import {
	axios
} from '@/page/mainPage/utils/request'
import {
	urlwsPath
} from '@/page/mainPage/utils/base'
const api = {
	urlwsPath: urlwsPath + '/websocket',
	Login: '/platform/login',
	getClasses: '/platform/getClasses',
	getSubjectlist: '/platform/getSubjects',
	getTestpaperList: '/platform/getCoursewares',
	getTopicTitle: '/platform/getTopicAndSubject',
	startClass: '/common/startClass', //开始上课
	synchronizedCoursewareQuestions: '/platform/synchronizedCoursewareQuestions', //同步题目
	getAllBingdCardInfo: '/bindingCard/getAllBingdCardInfo',
	unBindStu: '/bindingCard/unBind', //一键解绑
	startBind: '/bindingCard/start', //开始绑定学生
	stopBind: '/bindingCard/stop', //停止绑定
	BindOneStu: '/singleStudent/binding', //单独绑定某个学生
	cancelBindOneStu: '/singleStudent/cancelBinding', //取消单独绑定某个学生
	startSingleAnswer: '/answer/startSingleAnswer', //答题
	stopAnswer: '/answer/stopAnswer', //结束答题
	getprogress: '/answer/statistics/getAnswerProgress', //获取作答进度
	getAnswerAccuracy: '/answer/statistics/getAnswerAccuracy', //查询正确率
	getEveryAnswerNum: '/answer/statistics/getEveryAnswerNum', //查询作答人数
	getEveryAnswerName: '/answer/statistics/getEveryAnswerName', //查询作答人名称
	getFalseAnswerName: '/answer/statistics/getFalseAnswerName', //查询错误作答人名称
	getAnswerName: '/answer/statistics/getAnswerName', //查询全部作答人名称
	startVote: '/vote/start', //投票
	stopVote: '/vote/stop', //停止投票
	getVoteResult: '/vote/getVoteResult', //获取投票结果
	startScore: '/score/start', //评分
	stopScore: '/score/stop', //停止评分
	getScoreResult: '/score/getScoreResult', //获取评分结果
	startSingIn: '/attendance/start', //开始签到
	stopSingIn: '/attendance/stop', //结束签到
	getAttendanceList: '/attendance/getAttendanceList', //获取签到列表
	endClass: '/common/endClass', //下课
	startQuickAnswer: '/quickAnswer/start', //抢答开始
	stopQuickAnswer: '/quickAnswer/stop', //停止抢答
	readChannel: '/set/readChannel', //读取信道信息
	setChannel: '/set/setChannel', //设置
	defaultSet: '/set/defaultSet', //设置默认值
	getChannels: '/set/getChannels',
	exit: '/common/exit', //退出
	listPaper: '/randomDetection/listPaper/',
	startRandomDetection: '/randomDetection/start/', //开始随堂检测
	stopRandomDetection: '/randomDetection/stop', //停止随堂检测
	answerPercent: '/randomDetection/answerPercent', //更新随堂检测进度
	getSpeedKingList: '/answer/statistics/getSpeedKingList', //答题速度王
	nameStart: '/bindingCard/nameStart',
	nameStop: '/bindingCard/nameStop',
	getDanmuinfo: '/teacherHabit/queryTeacHabit/44',
	setDanmuinfo: '/teacherHabit/save',
	importQuesrions: '/randomDetection/importQuesrions',
	uploadTestPaper: '/randomDetection/uploadTestPaper',
	getAuthentication: '/platform/authentication', //获取题库地址
	saveImgFullScreen:'/common/saveImgFullScreen',//截屏
	saveImg:'/platform/saveWhiteboardImg',//截图
	getHomeworkTitleList:'/homework/getHomeworkTitleList/',//查询课后作业试卷
	assignHomework:'/homework/assignHomework',//发送课后作业
	gatherHomework:'/homework/gatherHomework',//获取课后作业
	stopHomework:'/homework/stopHomework',//停止发试卷
	saveQuestionImgAndSend:'/common/saveQuestionImgAndSend',//保存题干
	importTestQuestions:'/platform/importTestQuestions',//上传家庭作业试卷
	getAnswerMsg:'answerMsg/getAnswerMsg',//随堂检测统计
	// yu
}
export default api
export function postAction(url, parameter, obj = {}) {
	return axios(Object.assign({}, {
		url: url,
		method: 'post',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8'
		},
		data: parameter
	}, obj))
}
export function postActionUpload(url, parameter) {
	return axios({
		url: url,
		method: 'post',
		headers: {
			"Content-Type": "multipart/form-data"
		},
		processData: false,
		data: parameter
	})
}
