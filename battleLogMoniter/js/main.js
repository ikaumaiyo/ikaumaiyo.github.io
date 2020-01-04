const url = 'https://script.google.com/macros/s/AKfycbxDTLf2pULQ5hX0lCSwWy_YKF75FdSbao7IW--SPao6FIK3vAo/exec';
let report = [];
let member = [];
let optionDatastore;
let analysis;

/** onloadでリスナーも全部登録 * */
$(document).ready(function() {

	// デバッグ用
	$('#targetDate').val('2019-12-26');

	activationPlugins();    // activationPlugins
	renderBossImg();      // ボス画像をレンダ
	hideErrorMsg();         // エラーメッセージ削除

	// 設定読み込み
	optionDatastore = new OptionDatastore();
	renderSettingMenu(optionDatastore.getOptionList());

	// 凸データ反映
	load();

	// ボタン系のイベントリスナ登録
	// 再読み込み
	$('body').on('click', '.reload', function(e) {
		hideErrorMsg();
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
	$('body').on('click', '.btn_close', function(e) {
		optionDatastore.saveOption();
		$('#modal').hide();
	});
	$('body').on('click', '.btn_reset', function(e) {
		optionDatastore.resetOption();
		$('#modal').hide();
		showErrorMsg('ブラウザの更新ボタンでページを更新してください。');
	});
	$('#modal').on('click', function(event) {
		if (!($(event.target).closest($('#modal_content')).length) || ($(event.target).closest($(".btn_close")).length)) {
			optionDatastore.saveOption();
			$('#modal').hide();
		}
	});
	/** チェックボックス系 * */
	// 3凸排除
	$('body').on('click', '#chk-hideFin', function() {
		if($(this).prop('checked')){
			$('#render-kisiState').find('.finished').hide();
		}else{
			$('#render-kisiState').find('.finished').show();
		}
	});
	// 魔法排除
	$('body').on('click', '#chk-magicUsed', function() {
		if($(this).prop('checked')){
			$('#render-kisiState').find('.magicUsed').hide();
		}else{
			$('#render-kisiState').find('.magicUsed').show();
		}
	});




});

/** スプシから凸ログを取得（googleキャッシュクリアしてるから重い） * */
let load = function() {

	// ローディングアニメ開始
	showLoading();
	// analysisインスタンスが残っていたら破棄する
	if (analysis) {
		analysis.destroy();
	}

	var ajax_list = [];
	ajax_list.push(
		$.ajax({
			type : 'GET',
			url : url,
			dataType : 'jsonp',
			jsonpCallback : 'jsondata',
			cache : false
		}).done(function(json){
			report = json
			if(report.length == 0){
				showErrorMsg('凸データ０件（エラー）');
			}
		}).fail(function(e){
			showErrorMsg(e);
			console.error(e);
		})
	);


	ajax_list.push(
		$.ajax({
			type : 'GET',
			url : url+'?query=member',
			dataType : 'jsonp',
			jsonpCallback : 'jsondataMember',
			cache : false
		}).done(function(json){
			member = json
			if(member.length == 0){
				showErrorMsg('メンバーデータ０件（エラー）');
			}
		}).fail(function(e){
			showErrorMsg(e);
			console.error(e);
		})
	);


	$.when.apply($, ajax_list).done(function(){
		analysis = new Analysis(report, member, getPriconeDate());
		try{
			showErrorMsg(analysis.render());
			hideLoading();
		}catch(e){
			console.error(e);
			showErrorMsg(e);
			hideLoading();
		}
		hideLoading();
	}).fail(function(e){
		console.error(e);
		showErrorMsg('ajax通信に失敗');
		hideLoading();
	});




}// load()

/** プラグイン系の活性化 * */
let activationPlugins = function(){
	// ドラッグするやつ
//	 $('.draggable').draggable({
//	 stack: '.draggable'
//	 });
	 $( ".draggable" ).draggable({ containment: "#analysis", scroll: false },{stack: '.draggable'});
	  // テーブルソートするやつ
	  $('.tablesorter').tablesorter();
}

/** ローディングアニメのやつ * */
let showLoading = function() {
	$('.loading').show();
}
let hideLoading = function() {
	$('.loading').hide();
}

/** エラーのやつ * */
let showErrorMsg = function(e) {
	let span = $('<span></span>').html(e);
	span.appendTo($('.error'));
	$('.error').css('display','grid');
}
let hideErrorMsg = function(e) {
	$('.error').html('');
	$('.error').hide();
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
/** ボス画像をレンダ * */
let renderBossImg = function(){
	$('.boss.b1').css('background-image','url('+$('#bossImg01').val()+')');
	$('.boss.b2').css('background-image','url('+$('#bossImg02').val()+')');
	$('.boss.b3').css('background-image','url('+$('#bossImg03').val()+')');
	$('.boss.b4').css('background-image','url('+$('#bossImg04').val()+')');
	$('.boss.b5').css('background-image','url('+$('#bossImg05').val()+')');
}

/** 設定画面生成 * */
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
