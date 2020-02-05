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
//	$('#targetDate').val('2019-12-27');
	// 日付初期値設定
//    let date = new Date();
//    let yyyy = date.getFullYear();
//    let mm = ("0"+(date.getMonth()+1)).slice(-2);
//    let dd = ("0"+date.getDate()).slice(-2);
//    $('#targetDate').val(yyyy+'-'+mm+'-'+dd);

	changeBgColor();      // 背景変更
	activationPlugins();    // プラグイン系を活性化
	renderBossImg();      // ボス画像をレンダ
	hideErrorMsg();         // エラーメッセージ削除

	// 設定読み込み
	optionDatastore = new OptionDatastore();
	renderSettingMenu(optionDatastore.getOptionList());

	// 凸データ反映
	load(optionDatastore.getOptionList());

	// 開発鯖の場合はラベル付ける
	renderProductionLabel(optionDatastore.getOptionList());

	//---------------------------------------------------------------
	// ボタン系のイベントリスナ登録
	//---------------------------------------------------------------
	// バージョン
	$('#body').on('click', '.version', function(e) {
		$('#modal_detail').html('');
		let container = $('#modal_detail');

		let _titleSpan = $('<span></span>');
		_titleSpan.addClass('title');
		_titleSpan.html('リリースノート');

		_titleSpan.appendTo(container);
		$('<span></span>').html('スマホで表示するとヘッダがでなくなるようにした').appendTo(container);
		$('<span></span>').html('古いiOSでも動くようにした').appendTo(container);
		$('<span></span>').html('iOSで日付ドラムがロールするたびに再読み込みされないようにした').appendTo(container);
		$('<span></span>').html('設定に確認メッセージ追加した').appendTo(container);

		$('#modal').show();
	});
	// 再読み込み
	$('#body').on('click', '.reload', function(e) {
		hideErrorMsg();
		changeBgColor();
		load(optionDatastore.getOptionList());
	});
	// json
	$('#body').on('click', '.openJson', function(e) {
		window.open(url, '_blank');
	});

	// 日付
	let targetDateEvent;
	$('#targetDate').change(function() {
		 if (navigator.userAgent.indexOf('iPhone') != -1) {
			event = e;
		 }else{
			hideErrorMsg();
			load(optionDatastore.getOptionList());
		 }
	});
	 if (navigator.userAgent.indexOf('iPhone') != -1) {
		 $('#targetDate').focusout(function() {
			 if (event) {
				hideErrorMsg();
				load(optionDatastore.getOptionList());
			 }
		});
	 }
	// 設定
	$('#body').on('click', '.openSetting', function(e) {
		$('#modal-option').show();
	});
	$('#body').on('click', '.option-btn_confirm', function(e) {
		if(!validateOption(optionDatastore.getOptionList())){
			alert('必須項目を全て入力してください。');
			return false;
		}
		if(!confirm('設定を保存します。よろしいですか？')){
			return;
		}
		saveOption(optionDatastore.getOptionList());
		$('#modal-option').hide();
		showLoading();
	});
	$('#body').on('click', '.option-btn_reset', function(e) {
		if(!confirm('設定をリセットします。よろしいですか？')){
			return;
		}
		optionDatastore.reset();
		$('#modal-option').hide();
		showLoading();
	});
	$('#modal-option').on('mousedown', function(event) {
		if (!($(event.target).closest($('#modal-option_content')).length) || ($(event.target).closest($(".option-btn_close")).length)) {
			if(!confirm('閉じると変更が破棄されます。よろしいですか？')){
				return;
			}
			renderSettingMenu(optionDatastore.getOptionList());
			$('#modal-option').hide();
		}
	});
	// ヘルプモーダルのイベントリスナ
	$('#body').on('mousedown', '.help, .readme', function(e) {

		let helpTitleSpan = $('<span></span>');
		helpTitleSpan.addClass('title');
		helpTitleSpan.html('help');

		let helpMsg = $(this).parent().find('.helpMsg:hidden').html();
		$('#modal_detail').html('');
		$('#modal_detail').append(helpTitleSpan);
		$('#modal_detail').append(helpMsg);
		$('#modal').show();
	});

	// 凸詳細モーダルのイベントリスナ
	$('#body').on('mousedown', '#render-kisiState tr.render', function(e) {

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
	$('#body').on('mousedown', '.kisiTotuMemo', function(e) {
		e.stopPropagation();
		$(this).find('input').focus();
		let _renge = $(this).find('input').val().length;
		$(this).find('input').get(0).setSelectionRange(_renge, _renge);
	});
	// メモ保存
	$('#body').on('focusout', '.kisiTotuMemo>input', function(e) {
		// ツールチップに新しいメモを格納
		let tooltip = $(this).parent().find('span:hidden');
		tooltip.html($(this).val());

		// メモを保存
		let _name = $(this).attr('name');
		let _value = $(this).val();
		memoDatastore.save(_name, _value);

		if(_value == ''){
			$(this).removeClass('isShow');
		}else{
			$(this).addClass('isShow');
		}

		e.stopPropagation();
	});
	$('#body').on('keypress', '.kisiTotuMemo>input', function(e) {
		if ( e.keyCode  == 13 ) {
			$(this).blur();
		}

	});

	// モーダル閉じる
	$('#modal').on('click', function(event) {
		if (!($(event.target).closest($('#modal_content')).length) || ($(event.target).closest($(".btn_close")).length)) {
			$('#modal').hide();
		}
	});

	$('#render-battleLog .slideButton').on('click', function(event) {
		$('#render-battleLog').toggleClass('show');
	});

	/** チェックボックス系 * */
	// 3凸排除
	$('#body').on('click', '#chk-hideFin', function() {
		if($(this).prop('checked')){
			$('#render-kisiState').find('.finished').hide();
		}else{
			$('#render-kisiState').find('.finished').show();
		}
	});
	// 魔法排除
	$('#body').on('click', '#chk-magicUsed', function() {
		if($(this).prop('checked')){
			$('#render-kisiState').find('.magicUsed').hide();
		}else{
			$('#render-kisiState').find('.magicUsed').show();
		}
	});
	//pキャラ
	$('#body').on('click', '.pchar-summon', function(e) {
		$('.pchar').show();
	});
	$('#body').on('click', '.pchar', function(e) {
		$(this).toggleClass('mirror');
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
			hideLoadingConnectMsg();
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
		showErrorMsg('通信に失敗しました。設定でuidとpwdを確認してください。');
		hideLoading();
	});




}// load()

/** プラグイン系の活性化とかスマホCSSとか * */
let activationPlugins = function(){
    var ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
        // スマートフォン用コード
    	$('header .button').addClass('mobile');
    	$('header input').addClass('mobile');
    	$( ".pchar" ).draggable({ containment: "#body", scroll: false },{stack: '.draggable'});
    } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
        // タブレット用コード
    	$( ".pchar" ).draggable({ containment: "#body", scroll: false },{stack: '.draggable'});
    } else {
    	$( ".draggable" ).draggable({ containment: "#body", scroll: false },{stack: '.draggable'});
    }

	  // テーブルソートするやつ
	  $('.tablesorter').tablesorter();

}

/** ローディングアニメのやつ * */
let showLoading = function() {
	let comicLoc = comic[Math.floor(Math.random() * comic.length)];
	$('.loading .spinner').css('background-image','url(https://redive.estertion.win/comic/'+comicLoc+'.webp)');
	$('.loading .connecting').show();
	$('.loading').show();
}
let hideLoading = function() {
	$('.loading').hide();
}
let hideLoadingConnectMsg = function() {
	$('.loading .connecting').hide();
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
	let d;
	let pd;
	if ($('#targetDate').val() == "") {
		d = new Date(nowdate.getFullYear(), nowdate.getMonth(), nowdate.getDate(), nowdate.getHours() - 5, nowdate.getMinutes(), nowdate.getSeconds());
		pd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 5, 0, 0);
	}else{
		// デバッグ用の日付取得
		inputdate = new Date($('#targetDate').val());
		d = new Date(inputdate.getFullYear(), inputdate.getMonth(), inputdate.getDate(), nowdate.getHours() , nowdate.getMinutes(), nowdate.getSeconds());
		pd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 5, 0, 0);
	}
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
	$('#modal-option_content').find('.render').remove();
	$.each(optionList, (i,v) => {
		let inputtype = 'text';
		if(i != 'uid' && i != 'pwd'){
			inputtype = 'number';
		}
		$('<span></span>').addClass('render').html(i).appendTo('#modal-option_content');
		$('<input>').addClass('render').attr({
			  type: inputtype,
			  id: 'option_'+i,
			  value: v
			}).appendTo('#modal-option_content');
		$('<br>').addClass('render').appendTo('#modal-option_content');
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

// 背景変更
let changeBgColor = function(){
		let now = new Date();
		if(0 < now.getHours()  && now.getHours() <= 5){
			$('body').css('background-image','url(img/bg_Night.png)');
		}
		if(5 < now.getHours()  && now.getHours() <= 9){
			$('body').css('background-image','url(img/bg_Evening.png)');
		}
		if(9 < now.getHours()  && now.getHours() <= 16){
			$('body').css('background-image','url(img/bg_Daytime.png)');
		}
		if(16 < now.getHours()  && now.getHours() <= 18){
			$('body').css('background-image','url(img/bg_Evening.png)');
		}
		if(18 < now.getHours()  && now.getHours() <= 23){
			$('body').css('background-image','url(img/bg_Night.png)');
		}
}

// 開発用ラベル
let renderProductionLabel = function(optionList){
	if(optionList.exec_env_param == 0){
		let header = $('header');
		let label = $('<div></div>').html('開発サーバー');
		label.addClass('button');
		label.css('color','red');
		label.appendTo(header);
	}

}

// オプションを保存
let saveOption = function(optionList){
	$.each(optionList, (i,v) => {
		optionList[i] = $('#option_'+i).val();
	});
	optionDatastore.optionList = optionList;
	optionDatastore.save();
}
