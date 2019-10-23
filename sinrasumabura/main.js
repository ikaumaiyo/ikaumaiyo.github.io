function sound(n) {
	$('.sound-file').get(n).play();
}

$(document).ready(function() {

	$('.charBtn').on('click', function() {

		console.log('イベントが実行されました！');
		console.log($(this).css('background-image'));



	});

});
