const url = 'https://script.google.com/macros/s/AKfycbxDTLf2pULQ5hX0lCSwWy_YKF75FdSbao7IW--SPao6FIK3vAo/exec';
let report = [];
let member = [];
let optionDatastore;
let memoDatastore;
let analysis;

/** onloadでリスナーも全部登録 * */
$(document).ready(function() {

	//---------------------------------------------------------------
	// ページ初回実行
	//---------------------------------------------------------------
	// デバッグ用
	$('#targetDate').val('2019-12-26');
	// 日付初期値設定
//    let date = new Date();
//    let yyyy = date.getFullYear();
//    let mm = ("0"+(date.getMonth()+1)).slice(-2);
//    let dd = ("0"+date.getDate()).slice(-2);
//    $('#targetDate').val(yyyy+'-'+mm+'-'+dd);

	activationPlugins();    // プラグイン系を活性化
	renderBossImg();      // ボス画像をレンダ
	hideErrorMsg();         // エラーメッセージ削除

	// 設定読み込み
	optionDatastore = new OptionDatastore();
	renderSettingMenu(optionDatastore.getOptionList());

	// 凸データ反映
	load(optionDatastore.getOptionList());

	//---------------------------------------------------------------
	// ボタン系のイベントリスナ登録
	//---------------------------------------------------------------
	// バージョン
	$('body').on('click', '.version', function(e) {
		$('#modal_detail').html('');
		let container = $('#modal_detail');

		let _titleSpan = $('<span></span>');
		_titleSpan.addClass('title');
		_titleSpan.html('リリースノート');

		_titleSpan.appendTo(container);
		$('<span></span>').html('ヘルプボタン押したら機能見れるようにした').appendTo(container);

		$('#modal').show();
	});
	// 再読み込み
	$('body').on('click', '.reload', function(e) {
		hideErrorMsg();
		load(optionDatastore.getOptionList());
	});
	// スプシ
	$('body').on('click', '.openSpreadSheet', function(e) {
		window.open('https://docs.google.com/spreadsheets/d/1Hvfu_6t2scV-8o8i5k1QpwMjUUngbHtoadetTnmdBzs/edit#gid=764539460', '_blank');
	});
	// json
	$('body').on('click', '.openJson', function(e) {
		window.open(url, '_blank');
	});

	// 日付
        $('#targetDate').change(function() {
		hideErrorMsg();
		load(optionDatastore.getOptionList());
        });
	// 設定
	$('body').on('click', '.openSetting', function(e) {
		$('#modal-option').show();
	});
	$('body').on('click', '.option-btn_close', function(e) {
		if(!validateOption(optionDatastore.getOptionList())){
			return false;
		}
		saveOption(optionDatastore.getOptionList());
		$('#modal-option').hide();
		showLoading();
	});
	$('body').on('click', '.option-btn_reset', function(e) {
		optionDatastore.reset();
		$('#modal-option').hide();
		showLoading();
	});
	$('#modal-option').on('mousedown', function(event) {
		if(!validateOption(optionDatastore.getOptionList())){
			return false;
		}
		if (!($(event.target).closest($('#modal-option_content')).length) || ($(event.target).closest($(".btn_close")).length)) {
			saveOption(optionDatastore.getOptionList());
			$('#modal-option').hide();
			showLoading();
		}
	});
	// ヘルプモーダルのイベントリスナ
	$('body').on('mousedown', '.help', function(e) {

		let helpTitleSpan = $('<span></span>');
		helpTitleSpan.addClass('title');
		helpTitleSpan.html('help');

		console.log($(this).parent().find('.helpMsg:hidden'));
		let helpMsg = $(this).parent().find('.helpMsg:hidden').html();
		$('#modal_detail').html('');
		$('#modal_detail').append(helpTitleSpan);
		$('#modal_detail').append(helpMsg);
		$('#modal').show();
	});

	// 凸詳細モーダルのイベントリスナ
	$('body').on('mousedown', '#render-kisiState tr.render', function(e) {

		let totuTimeTitleSpan = $('<span></span>');
		totuTimeTitleSpan.addClass('title');
		totuTimeTitleSpan.html('凸詳細');

		let totuDetail = $(this).find('.totuDetail').clone();
		let totuTimeKeiko = $(this).find('.totuTimeKeiko').clone();
		$('#modal_detail').html('');
		$('#modal_detail').append(totuTimeTitleSpan);
		$('#modal_detail').append(totuDetail);
		$('#modal_detail').append(totuTimeKeiko);
		$('#modal').show();
	});
	// 凸詳細無効化するやつ
	$('body').on('mousedown', '.kisiTotuMemo', function(e) {
		e.stopPropagation();
		$(this).find('input').focus();
		let _renge = $(this).find('input').val().length;
		$(this).find('input').get(0).setSelectionRange(_renge, _renge);
	});
	// メモ保存
	$('body').on('focusout', '.kisiTotuMemo>input', function(e) {

		let tooltip = $(this).parent().find('span:hidden');
		tooltip.html($(this).val());

		let _memoList = [];
		let _memoInputList = $(this);

		let _name = $(this).attr('name');
		let _value = $(this).val();

		memoDatastore.save(_name, _value);
		e.stopPropagation();
	});
	$('body').on('keypress', '.kisiTotuMemo>input', function(e) {
		if ( e.which != 13 ) {
			return false;
		}
		$(this).blur();
	});

	// モーダル閉じる
	$('#modal').on('click', function(event) {
		if (!($(event.target).closest($('#modal_content')).length) || ($(event.target).closest($(".btn_close")).length)) {
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

/** スプシから凸ログを取得 * */
let load = function(optionList) {

	memoDatastore = new MemoDatastore(getPriconeDate());

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
			// url :
			// url+'?env='+optionList.exec_env_param+'&id=report',
			url : url,
			dataType : 'jsonp',
			 data : {env : optionList.exec_env_param, id : 'report', uid : optionList.uid, pwd : optionList.pwd},
			jsonpCallback : 'jsondata_report',
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
			// url :
			// url+'?env='+optionList.exec_env_param+'&id=member',
			url : url,
			dataType : 'jsonp',
			 data : {env : optionList.exec_env_param, id : 'member', uid : optionList.uid, pwd : optionList.pwd},
			jsonpCallback : 'jsondata_member',
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

/** プラグイン系の活性化とかスマホCSSとか * */
let activationPlugins = function(){
    var ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
        // スマートフォン用コード
    	$('header').addClass('minimumdisplay');
    } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
        // タブレット用コード
    } else {
    	$( ".draggable" ).draggable({ containment: "#analysis", scroll: false },{stack: '.draggable'});
    }

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
	span.appendTo($('.error.contents'));
	$('.error').css('display','grid');
}
let hideErrorMsg = function(e) {
	$('.error.contents').html('');
	$('.error.contents').hide();
}

/** 現在日付取得 * */
let getNowYYYYMMDD = function() {
	let now = new Date();
	let yyyymmdd = now.getFullYear() + '-' + ("0" + (now.getMonth() + 1)).slice(-2) + '-' + ("0" + now.getDate()).slice(-2);
	return yyyymmdd;
}

/** 現在プリコネ日を取得 * */
let getPriconeDate = function() {
	let nowdate = new Date();
	let inputdate = new Date();
	if ($('#targetDate').val() != "") {
		// デバッグ用の日付取得
		inputdate = new Date($('#targetDate').val());
	}
	let d = new Date(inputdate.getFullYear(), inputdate.getMonth(), inputdate.getDate(), nowdate.getHours() - 5, nowdate.getMinutes(), nowdate.getSeconds());
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
		let inputtype = 'text';
		if(i != 'uid' && i != 'pwd'){
			inputtype = 'number';
		}
		$('<span></span>').html(i).appendTo('#modal-option_content');
		$('<input>').attr({
			  type: inputtype,
			  id: 'option_'+i,
			  value: v
			}).appendTo('#modal-option_content');
		$('<br>').appendTo('#modal-option_content');
	});
}
// 設定バリデーション
let validateOption = function(optionList){
	let flg = true;
	$.each(optionList, (i,v) => {
		if(i != 'uid' && i != 'pwd'){
			if($('#option_'+i).val() == ''){
				flg = false;
				return;
			}
		}
	});
	return flg;

}

// オプションを保存
let saveOption = function(optionList){
	$.each(optionList, (i,v) => {
		optionList[i] = $('#option_'+i).val();
	});
	optionDatastore.optionList = optionList;
	optionDatastore.save();
}
