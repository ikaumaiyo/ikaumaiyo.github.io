const url = 'https://script.google.com/macros/s/AKfycbxDTLf2pULQ5hX0lCSwWy_YKF75FdSbao7IW--SPao6FIK3vAo/exec';
let report = [];
let analysis;

/** スプシから凸ログを取得（googleキャッシュクリアしてるから重い） * */
let load = function() {

	showLoading();

	$.ajax({
		type : 'GET',
		url : url,
		dataType : 'jsonp',
		jsonpCallback : 'jsondata',
		cache : false,
		success : function(json) {

			try {
				report = json
				console.table(report[0]);
				analysis = new Analysis(report, getPriconeDate());
				analysis.render();
				// var len = report.length;
				// var html = '';
				// for(var i=0; i < len; i++){
				// html += report[i].タイムスタンプ + ' ' + report[i].日数 + '<br>';
				// }
				// document.getElementById('whole').innerHTML = html;
				hideLoading();
			} catch (e) {
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

/** ローディングアニメのやつ * */
let showLoading = function() {
	$('.loading').show();
}
let hideLoading = function() {
	$('.loading').hide();
}

/** エラーのやつ * */
let showErrorMsg = function(e) {
	$('.error').html(e);
	$('.error').show();
}

/** 現在日付取得 * */
let getNowYYYYMMDD = function() {
	let now = new Date();
	let yyyymmdd = now.getFullYear() + '-' + ("0" + (now.getMonth() + 1)).slice(-2) + '-' + ("0" + now.getDate()).slice(-2);
	return yyyymmdd;
}

/** 現在プリコネ日を取得 * */
let getPriconeDate = function() {

	alert($('#targetDate').val());

	let _d = new Date();
	if ($('#targetDate').val() != "") {
		// デバッグ用の日付取得
		_d = new Date($('#targetDate').val());
	}
	let d = new Date(_d.getFullYear(), _d.getMonth(), _d.getDate(), _d.getHours() - 5, _d.getMinutes(), _d.getSeconds());
	let pd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 5, 0, 0);
	return pd;
}

/** onloadでリスナーも全部登録 * */
$(document).ready(function() {

	// デバッグ用
	 $('#targetDate').val('2019-12-25');

	// 凸データ反映
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