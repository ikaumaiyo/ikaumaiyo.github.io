const url = 'https://script.google.com/macros/s/AKfycbxDTLf2pULQ5hX0lCSwWy_YKF75FdSbao7IW--SPao6FIK3vAo/exec';
let report = [];
let optionDatastore;
let analysis;

/** onloadでリスナーも全部登録 * */
$(document).ready(function() {

	// デバッグ用
	$('#targetDate').val('2019-12-25');

	// 設定読み込み
	optionDatastore = new OptionDatastore();
	renderSettingMenu(optionDatastore.getOptionList());

	// 凸データ反映
	load();

	// ボタン系のイベントリスナ登録
	// 再読み込み
	$('body').on('click', '.reload', function(e) {
		load();
	});
	// スプシ
	$('body').on('click', '.openSpreadSheet', function(e) {
		window.open('https://docs.google.com/spreadsheets/d/1Hvfu_6t2scV-8o8i5k1QpwMjUUngbHtoadetTnmdBzs/edit#gid=764539460', '_blank');
	});
	// json
	$('body').on('click', '.openJson', function(e) {
		window.open(url, '_blank');
	});
	// 設定
	$('body').on('click', '.openSetting', function(e) {
		$('#modal').show();
	});
	$('#modal').on('click', function(event) {
		if (!($(event.target).closest($('#modal_content')).length) || ($(event.target).closest($(".btn_close")).length)) {
			optionDatastore.saveOption();
			$('#modal').hide();
		}
	});

});

/** スプシから凸ログを取得（googleキャッシュクリアしてるからここだけ重い） * */
let load = function() {

	// ローディングアニメ開始
	showLoading();
	// analysisインスタンスが残っていたら破棄する
	if (analysis) {
		analysis.destroy();
	}
	// 全レポート取得
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
				hideLoading();
			} catch (e) {
				showErrorMsg(e);
				hideLoading();
			}
		},
		error : function(e) {
			console.error('error');
			console.error(e);
			showErrorMsg(e);
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
	let _d = new Date();
	if ($('#targetDate').val() != "") {
		// デバッグ用の日付取得
		_d = new Date($('#targetDate').val());
	}
	let d = new Date(_d.getFullYear(), _d.getMonth(), _d.getDate(), _d.getHours() - 5, _d.getMinutes(), _d.getSeconds());
	let pd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 5, 0, 0);
	return pd;
}

/** 設定画面生成 **/
let renderSettingMenu = function(optionList){
	$.each(optionList, (i,v) => {
		$('<span></span>').html(i).appendTo('#modal_content');
		$('<input>').attr({
			  type: 'text',
			  id: i,
			  value: v
			}).appendTo('#modal_content');
		$('<br>').appendTo('#modal_content');
	});
}
