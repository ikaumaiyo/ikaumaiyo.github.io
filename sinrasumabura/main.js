// global instance
let ods = new OptionDatastore();
let usds = new UnitStatusDatastore();
let bsds = new BossStatusDatastore();
let game;


function contentsToggle() {
	$('#main-contents').toggle();
	$('#game-contents').toggle();

	refreshStatus();
}

function sound(n) {
	$('.sound-file' + '.sp-bgm').prop('volume', 0.5);
	let _volume = ods.getVolume();
	if(_volume){
		$('.sound-file').get(n).play();
	}else{
		$('.sound-file').get(n).pause();
	}
}


function refreshUnit(){

	// ユニット一覧を生成

	let ul = $('<ul></ul>');

	$.each(UNIT_LIST, function(k, v){

		let li = $('<li></li>');
		li.addClass('charBtn');
		li.css('background-image', 'url(img/'+v.id+'.png)')
		li.attr('data-unit-num',k);
		li.attr('data-unit-id',v.id);

		let a = $('<a></a>');
		a.html(v.name);

		li.append(a);
		ul.append(li);

		let audio = $('<audio></audio>');
		audio.addClass('sound-file');
		audio.attr('preload','auto');

		let source = $('<source></source>');
		source.attr('src','sound/'+v.id+'.mp3');
		source.attr('type','audio/mp3');

		audio.append(source);
		ul.append(audio);


	});

	$('#charSelect').append(ul);

	refreshStatus();
}

function refreshStatus(){


	// ユニットステータスを更新
	let _unitStatusList = usds.getUnitStatusList();

	$(".charBtn").each(function() {

		let _id = $(this).data('unit-id');
		let _unitStatus = _unitStatusList.filter(function(o){
			return o.id == _id;
		});

		let _unit = UNIT_LIST.filter(function(o){
			return o.id == _id;
		});

		if(_unitStatus.length > 0){
			$(this).find('a').html('<font size="3">Lv</font>'+_unitStatus[0].level+'<br>'+_unit[0].name)
		}else{
			$(this).find('a').html('<font size="3">Lv</font>1<br>'+_unit[0].name);
		}
	});



	$('#charTargetDecoCut > span').html($('.charBtn.selected>a').html());

}


function resetPlayer(){
	if(confirm('プレイヤーレベルをリセットしますか？')){

		usds.reset();
		usds = new UnitStatusDatastore();
		refreshStatus();
	}
}

function resetBoss(){
	if(confirm('ボスレベルをリセットしますか？')){
		bsds.reset();
		bsds = new BossStatusDatastore();
	}
}

function toggleVolume(){
	ods.toggleVolume();
}

$(document).ready(function() {

	refreshUnit();


	$('.charBtn').on('click', function(e) {

		sound($(this).data('unit-num'));

		$('#startButton').show();
		$('#startButton').css('left', '-500px');
		$('#startButton').css('top', '100px');
		$('#startButton').animate({
			'left' : '0px',
			'top' : '0px'
		}, 70);

		$(".selected").each(function() {
			$(this).removeClass("selected");
		});
		$(this).toggleClass('selected');
		$(this).effect('shake', {
			direction : 'left',
			distance : 3,
			duration : 50
		}, 15);
		$(this).effect('highlight', 100);

		$('#charBox').animate({
			top : 15,
			'borderColor' : '#eeff00'
		}, 50).animate({
			top : 0,
			'borderColor' : '#000000'
		}, 50);

		$('#charTargetImg').effect('shake', {
			direction : 'left',
			distance : 15,
			duration : 50
		}, 150);

		$(".cursor").each(function() {
			$(this).animate({
//				top : e.pageY - $(this).parent().offset().top - 50,
//				left : e.pageX - $(this).parent().offset().left- 50
				top : e.pageY - 50,
				left : e.pageX - 50
			}, 250);
		});

		// ユニットID取得 要改修
		let _unitElm = $(this).css('background-image');
		let _unitId = _unitElm.substr(_unitElm.lastIndexOf('/') + 1);
		_unitId = _unitId.slice(0, -6);

		$('#charTargetImg').data('unit-id', _unitId);

	});



	$('.charBtn').hover(function() {
		selectChar($(this));

	}, function() {
		$(".selected").each(function() {
			selectChar($(this));
		});
	});

	$('#startButton').hover(function() {
//		$(this).find('span').css('left', '-200px');
//		$(this).find('span').animate({
//			'left' : '0px'
//		}, 100);
	});

	function selectChar(__elm__) {
		$('#charTargetImg').css('background-image', __elm__.css('background-image'));
		$('#charTargetDecoCut > span').html(__elm__.children('a').html());

		$('#charTargetImg').css('margin-left', '213px');

		$('#charTargetImg').animate({
			'marginLeft' : '0px'
		}, 50);

		$('#charTargetDecoCut > span').css('margin-left', '20px');
		$('#charTargetDecoCut > span').animate({
			'marginLeft' : '0px'
		}, 100);
	}


	$('#bossBox>.next').on('click', function() {

		let _bossId = $('#bossTargetImg').data('boss-id');
		let _bossIdLocation = BOSS_LIST.findIndex(({id}) => id === _bossId);

		let _i = 0;
		if(_bossIdLocation < BOSS_LIST.length-1){
			_i = _bossIdLocation + 1;
		}

		$('#bossTargetImg').css('background-image','url(img/boss'+BOSS_LIST[_i].id+'.png)');
		$('#bossTargetImg').data('boss-id',BOSS_LIST[_i].id);

		$('#bossTargetImg').css('left', '20px');
		$('#bossTargetImg').animate({
			'left' : '0px'
		}, 100);

	});

	$('#bossBox>.prev').on('click', function() {

		let _bossId = $('#bossTargetImg').data('boss-id');
		let _bossIdLocation = BOSS_LIST.findIndex(({id}) => id === _bossId);

		let _i = BOSS_LIST.length-1;
		if(_bossIdLocation != 0){
			_i = _bossIdLocation - 1;
		}

		$('#bossTargetImg').css('background-image','url(img/boss'+BOSS_LIST[_i].id+'.png)');
		$('#bossTargetImg').data('boss-id',BOSS_LIST[_i].id)

		$('#bossTargetImg').css('left', '-20px');
		$('#bossTargetImg').animate({
			'left' : '0px'
		}, 100);
	});



	$('#startButton').on('click', function(e) {
		let _unitId = $('#charTargetImg').data('unit-id');
		if(_unitId == ''){
			alert(MESSAGE_UNIT_NONE);
			return;
		}

		let _bossId = $('#bossTargetImg').data('boss-id');

		contentsToggle();

		game = new Game(_unitId, _bossId);
		game.run();

	});



});






