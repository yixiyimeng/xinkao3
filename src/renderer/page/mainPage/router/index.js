import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/page/mainPage/pages/Main';
Vue.use(Router)

export default new Router({
	routes: [{
			path: '/',
			name: 'mainPage',
			component: Main,
			redirect: '/login',
			children: [{
					path: '/login',
					name: 'login',
					component: require('@/page/mainPage/view/login').default,
					meta: {
						title: '登陆设置'
					}
				},
				{
					path: '/set',
					name: 'set',
					component: require('@/page/mainPage/view/set').default,
					meta: {
						title: '设置'
					}
				},
				{
					path: '/class',
					name: 'class',
					component: require('@/page/mainPage/view/class').default,
					redirect: '/setClass',
					meta: {
						title: '设置'
					},
					children: [{
							path: '/setStu',
							name: 'setStu',
							component: require('@/page/mainPage/view/setStu').default,
							meta: {
								title: '学生设置'
							}
						},
						// {
						// 	path: '/setTest',
						// 	name: 'setTest',
						// 	component: require('@/page/mainPage/view/setTest').default,
						// 	meta: {
						// 		title: '试卷设置'
						// 	}
						// },
						// {
						// 	path: '/editQut',
						// 	name: 'editQut',
						// 	component: require('@/page/mainPage/view/editQut').default,
						// 	meta: {
						// 		title: '编辑题目'
						// 	}
						// }, 
						{
							path: '/setClass',
							name: 'setClass',
							component: require('@/page/mainPage/view/setClass').default,
							meta: {
								title: '课程设置'
							}
						},
						{
							path: '/startClass',
							name: 'startClass',
							component: require('@/page/mainPage/view/startClass').default,
							meta: {
								title: '开始上课'
							}
						},
						// {
						// 	path: '/startAnswer',
						// 	name: 'startAnswer',
						// 	component: require('@/page/mainPage/view/startAnswer').default,
						// 	meta: {
						// 		title: '选择题目类型'
						// 	}
						// },
						{
							path: '/answer',
							name: 'answer',
							component: require('@/page/mainPage/view/answer').default,
							meta: {
								title: '答题中'
							}
						},
						{
							path: '/answerChart',
							name: 'answerChart',
							component: require('@/page/mainPage/view/answerChart').default,
							meta: {
								title: '答题统计'
							}
						},
						{
							path: '/startClassTesting',
							name: 'startClassTesting',
							component: require('@/page/mainPage/view/startClassTesting').default,
							meta: {
								title: '开始随堂检测'
							}
						},
						{
							path: '/responder',
							name: 'responder',
							component: require('@/page/mainPage/view/responder').default,
							meta: {
								title: '抢答'
							}
						},
						{
							path: '/vote',
							name: 'vote',
							component: require('@/page/mainPage/view/vote').default,
							meta: {
								title: '投票统计'
							}
						},
						{
							path: '/voteChart',
							name: 'voteChart',
							component: require('@/page/mainPage/view/voteChart').default,
							meta: {
								title: '投票统计'
							}
						}
					]
				},

			]
		},
		{
			path: '*',
			redirect: '/'
		}
	]
})
