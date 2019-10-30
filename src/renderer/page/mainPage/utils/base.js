// export const urlPath = 'http://192.168.10.108:8080/teacher-client';
// export const urlwsPath = 'ws://192.168.10.108:8080/teacher-client';
export const urlPath = 'http://localhost:8080/teacher-client';
export const urlwsPath = 'ws://localhost:8080/teacher-client';
/*正则*/
/*两位小数*/
export const reg = {
	decimaltow: /^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/,
	telphone: /^1[3-9][0-9]{9}$/,

}
export const htmlescpe = new RegExp("[%--`~!@#$^&*()=|{}':;',\\[\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
//export const allenglish = new RegExp("^[a-zA-Z\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]|\s+$");
export const allenglish = /^([a-zA-Z0-9@$()=':;,.?!%"·]\s*)+$/;
//export const allchinese = /^([\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\u4e00-\u9fa5]\s*)+$/;
export const allchinese = /^([\u2000-\u206f\u3000-\u303f\u4e00-\u9fef\uff00-\uffef0-9]\s*)+$/;
export const parseTime = (time) => {
	const source = parseInt(time);
	if (source) {
		let min = parseInt(source / 60);
		let sec = source % 60;
		if (min < 10) {
			min = "0" + min
		}
		if (sec < 10) {
			sec = "0" + sec
		}
		return min + ":" + sec;
	} else {
		return '00:00';
	}
};
export const parseDay = (time) => {

	var thisdate = new Date(time);
	var year = thisdate.getFullYear();
	var month = thisdate.getMonth() + 1;
	var day = thisdate.getDate();
	return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
}
export default {
	urlPath,
	urlwsPath,
	htmlescpe,
	allenglish,
	allchinese

}
