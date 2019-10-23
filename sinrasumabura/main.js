function sound(n) {
	$('.sound-file').get(n).play();
}

$(document).ready(function() {

	$('.charBtn').on('click', function() {


		$('#charTarget').css('background-image', $(this).css('background-image'));



	});

});
