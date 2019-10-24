
function sound(n) {
	$('.sound-file' + '.sp-bgm').prop('volume', 0.5);
	$('.sound-file').get(n).play();
}

$(document).ready(function() {


	$('.charBtn').on('click', function(e) {
		console.log('screen=' + e.screenX + ',' + e.screenY);

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

		$(".cursor").each(function() {
			$(this).animate({
				top : e.pageY-30   ,
				left:e.pageX-110
			}, 50);
		});

		 console.log('screen=' + e.screenX + ',' + e.screenY);
		  console.log('page=' + e.pageX + ',' + e.pageY);
		  console.log('client=' + e.clientX + ',' + e.clientY);
		  console.log('offset=' + e.offsetX + ',' + e.offsetY);


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

});
