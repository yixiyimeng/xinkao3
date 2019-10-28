import { axios } from '@/page/mainPage/utils/request'
import {urlwsPath} from '@/page/mainPage/utils/base'
const api = {
	urlwsPath:urlwsPath+'/websocket',
	Login: '/platform/login',
	getClasses:'/platform/getClasses',
	getSubjectlist:'/platform/getSubjects',
	getTestpaperList:'/platform/getCoursewares',
	getTopicTitle:'/platform/getTopicAndSubject',
	startClass:'/common/startClass',//开始上课
	synchronizedCoursewareQuestions:'/platform/synchronizedCoursewareQuestions',//同步题目
	getAllBingdCardInfo:'/bindingCard/getAllBingdCardInfo',
	unBindStu:'/bindingCard/unBind',//一键解绑
	startBind:'/bindingCard/start',//开始绑定学生
	stopBind:'/bindingCard/stop',//停止绑定
	BindOneStu:'/singleStudent/binding',//单独绑定某个学生
	cancelBindOneStu:'/singleStudent/cancelBinding',//取消单独绑定某个学生
	startSingleAnswer:'/answer/startSingleAnswer',//答题
	stopAnswer:'/answer/stopAnswer',//结束答题
	getprogress:'/answer/statistics/getAnswerProgress',//获取作答进度
	getAnswerAccuracy:'/answer/statistics/getAnswerAccuracy',//查询正确率
	getEveryAnswerNum:'/answer/statistics/getEveryAnswerNum',//查询作答人数
	getEveryAnswerName:'/answer/statistics/getEveryAnswerName',//查询作答人名称
	getFalseAnswerName:'/answer/statistics/getFalseAnswerName',//查询错误作答人名称
	startVote:'/vote/start',//投票
	stopVote:'/vote/stop',//停止投票
}
export default api
export function postAction(url, parameter,obj={}) {
	return axios(Object.assign({},{
		url: url,
		method: 'post',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8'
		},
		data: parameter
	},obj))
}