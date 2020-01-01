const url = 'https://script.google.com/macros/s/AKfycbxDTLf2pULQ5hX0lCSwWy_YKF75FdSbao7IW--SPao6FIK3vAo/exec';
let report = [];
let analysis;

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

			try{
			report = json
			console.table(report[0]);
			analysis = new Analysis(report);
			analysis.render();
			// var len = report.length;
			// var html = '';
			// for(var i=0; i < len; i++){
			// html += report[i].タイムスタンプ + ' ' + report[i].日数 + '<br>';
			// }
			// document.getElementById('whole').innerHTML = html;
			hideLoading();
			}catch(e){
				showErrorMsg(e);
				hideLoading();
			}
		},
		error : function(e) {
			console.log('error');
			console.log(e);
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


/** エラーのやつ **/
let showErrorMsg = function(e){
	$('.error').html(e);
	$('.error').show();
}

/** onloadでリスナーも全部登録 **/
$(document).ready(function() {

	load();

	$('body').on('click', '.reload', function(e) {
		load();
	});
	$('body').on('click', '.openSpreadSheet', function(e) {
		window.open('https://docs.google.com/spreadsheets/d/1Hvfu_6t2scV-8o8i5k1QpwMjUUngbHtoadetTnmdBzs/edit#gid=764539460', '_blank');
	});
	$('body').on('click', '.openJson', function(e) {
		window.open(url, '_blank');
	});





});