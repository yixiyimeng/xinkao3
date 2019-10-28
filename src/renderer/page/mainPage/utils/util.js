import {
	baseColor
} from '@/utils/base'
Vue.filter('attendState', function(value) { //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面

});
/*保留两位*/
Vue.filter('Decimal', function(value, num) { //全局方法 Vue.filter() 注册一个自定义过滤器,必须放在Vue实例化前面
	if(!num) {
		num = 2
	} else {
		num = parseInt(num);
	}
	if(isNaN(value)) {
		value = 0
	}

	var f = parseFloat(value);

	var f = Math.round(value * 100) / 100;

	var s = f.toString();
	var rs = s.indexOf('.');

	if(rs < 0) {
		rs = s.length;
		s += '.';
	}
	while(s.length <= rs + num) {
		s += '0';
	}

	return s;
});