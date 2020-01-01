const url = 'https://script.google.com/macros/s/AKfycbxDTLf2pULQ5hX0lCSwWy_YKF75FdSbao7IW--SPao6FIK3vAo/exec';
let report = [];

/** スプシから凸ログを取得（googleキャッシュクリアしてるから重い） **/
let load = function() {

	showLoading();

	$.ajax({
		type : 'GET',
		url : url,
		dataType : 'jsonp',
		jsonpCallback : 'jsondata',
		cache : false,
		success : function(json) {
			report = json
			console.table(report[0]);
			// var len = report.length;
			// var html = '';
			// for(var i=0; i < len; i++){
			// html += report[i].タイムスタンプ + ' ' + report[i].日数 + '<br>';
			// }
			// document.getElementById('whole').innerHTML = html;
			hideLoading();
		},
		error : function(json) {
			console.log('error');
			console.table(json);
			hideLoading();
		}
	});

}// load()

/** ローディングアニメのやつ **/
let showLoading = function(){
	$('.loading').show();
}
let hideLoading = function(){
	$('.loading').hide();
}


/** onloadでリスナーも全部登録 **/
$(document).ready(function() {

	load();

	$('body').on('click', '.reload', function(e) {
		load();
	});
	$('body').on('click', '.howtouse', function(e) {
		$('p').toggle();
	});

	$('body').on('click', '.searchWord', function(e) {

		generate($(this).find('.word').html());
		location.href = "#"
	});

});