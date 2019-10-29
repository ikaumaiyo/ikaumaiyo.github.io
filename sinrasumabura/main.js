let ods = new OptionDatastore();
let uds = new UnitDatastore();


function sound(n) {
	$('.sound-file' + '.sp-bgm').prop('volume', 0.15);
	let _volume = ods.getVolume();
	if(_volume){
		$('.sound-file').get(n).play();
	}else{
		$('.sound-file').get(n).pause();
	}
}


function refreshUnit(){

	let _unitList = uds.getUnitList();

	$(".charBtn").each(function() {
		let _name = $(this).find('a').html();
		let _unit = _unitList.filter(function(o){
			return o.name == _name;
		});
		if(_unit.length > 0){
			$(this).find('a').html('<font size="3">Lv</font>'+_unit[0].level+'<br>'+_name)
		}else{
			$(this).find('a').html('<font size="3">Lv</font>1<br>'+_name)
		}
	});

}

function toggleVolume(){
	ods.toggleVolume();
}

$(document).ready(function() {

	refreshUnit();


	$('.charBtn').on('click', function(e) {

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
				top : e.pageY - $(this).parent().offset().top - 50,
				left : e.pageX - $(this).parent().offset().left- 50
			}, 250);
		});

		// ユニットID取得 要改修
		let _unitElm = $(this).css('background-image');
		let _unitId = _unitElm.substr(_unitElm.lastIndexOf('/') + 1);
		_unitId = _unitId.slice(0, -6);

		$('#charTargetImg').data('unit-id', _unitId);

	});



	$('#startButton').on('click', function(e) {
		let _unitId = $('#charTargetImg').data('unit-id');
		console.log(_unitId);
		if(_unitId == ''){
			alert('キャラを選択してください。');
		}


	});

	$('.charBtn').hover(function() {
		selectChar($(this));

	}, function() {
		$(".selected").each(function() {
			selectChar($(this));
		});
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

});






