function sound(n) {
	$('.sound-file').get(n).play();
}

$(document).ready(function() {





	$('.sound-file' + '.sp-bgm').prop('volume', 0.2);
	$('.sound-file' + '.sp-bgm').get(0).play();

	$('.charBtn').on('click', function() {

		$(".selected").each(function(){
		    $(this).removeClass("selected");
		});

		$(this).toggleClass('selected');
		$(this).effect('shake',{direction: 'left', distance: 5,duration:50},20);
		$(this).effect('highlight',40);

		$('#charBox').animate({
			top : 10
		}, 15).animate({
			top : 0
		}, 15);

	});

	$('.charBtn').hover(function() {
		$('#charTargetImg').css('background-image', $(this).css('background-image'));
		$('#charTargetDecoCut > span').html($(this).children('a').html());

		$('#charTargetImg').css('margin-left', '213px');

		$('#charTargetImg').animate({
			'marginLeft' : '0px'
		}, 100);

		$('#charTargetDecoCut > span').css('margin-left', '20px');
		$('#charTargetDecoCut > span').animate({
			'marginLeft' : '0px'
		}, 100);

	}, function() {

	});

});
