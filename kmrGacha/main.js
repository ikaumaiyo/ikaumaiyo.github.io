$(document).ready(function() {

	var breakFlg = '0';

	$('#gchaRun').click(function() {
		breakFlg = '0';
		$(this).hide();
		$('#gchaStop').show();
		gchaloop();
	});

	$('#gchaStop').click(function() {
		breakFlg = '1';
		$(this).hide();
		$('#gchaRun').show();
	});


	var gchaloop = function (){

		$('.kmr').hide();
		var elm = $('.kmr')[Math.floor(Math.random() * $('.kmr').length)];
		elm.style.display ="block";

		if(breakFlg == '0'){
			setTimeout(gchaloop,100);
		}

	}

});

