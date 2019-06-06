


$(document).ready(function() {

	let charLimit = 5;
	var lineCount = 0;

	$('.prcn-char').html($('#prcn-char').html());
	$('.prcn-rank').html($('#prcn-rank').html());
	$('.prcn-star').html($('#prcn-star').html());
	$('.prcn-unique').html($('#prcn-unique').html());

	$('.button-init').click(function() {
		$('.edit-area').html('');
		$('.button-line-insert').trigger('click');
	});

	$('.button-line-insert').click(function() {
		var lineTime = $('#prcn-timeline-time').html();
		var lineTimeResult = '';

		lineTimeResult = lineTime.replace(/01:30/g, getlastTime);

		var lineChar = $('#prcn-timeline-char').html();
		var lineCharResult = '';

		for (var i = 0; i < charLimit; i++) {
			var insertChar = getCharName(i);

			var _lineChar = lineChar;

			_lineChar = _lineChar.replace(/charNum/g, ('char' + i + lineCount));
			_lineChar = _lineChar.replace(/charName/g, insertChar);

			lineCharResult += _lineChar;
		}

		var lineBiko = $('#prcn-timeline-biko').html();
		var lineBikoResult = '';
		lineBikoResult = lineBiko.replace(/biko/g, 'biko' + lineCount);

		var lineDelete = $('#prcn-timeline-delete').html();
		var lineDeleteResult = '';

		lineCount += 1;

		$(".edit-area").append($("<div></div>").html(lineTimeResult + lineCharResult + lineBikoResult + lineDelete));
	});

	$(document).on("click", '.button-line-delete', function() {
		$(this).parent().remove();
	});

	$(document).on("click", '.button-export', function() {
		var result = '';

		for (var i = 0; i < charLimit; i++) {
			result += getCharName(i) + ' ';
			result += getCharStar(i) + ' ';
			result += getCharRank(i);
			result += '<br>';

		}

		result += '<br>';

		var lines = $('.edit-area').children();
		for (var i = 0; i < lines.length; i++) {
			var line = lines.eq(i);
			result += $(line).children('input[type="time"]').val() + ' ';

			var chars = $(line).children('input[type="checkbox"]');

			for (var ci = 0; ci < chars.length; ci++) {
				var chr = chars.eq(ci);
				if ($(chr).prop('checked')) {
					result += $('label[for="' + $(chr).attr('id') + '"]').html() + ' ';
				}
			}

			if ($(line).children().children('input[type="text"]').val().length > 0) {

				result += "（" + $(line).children().children('input[type="text"]').val() + '）';
			}

			result += '<br>';
		}

		$('.export-area p').html(result);

	});

	$(document).on("click", '.button-copy', function() {
		execCopy($('.export-area p').html());
	});


	$(document).on("click", '.test', function() {
		$('#char0').children('.prcn-char').children('.input').children('input').val('キャラ0');
		$('#char1').children('.prcn-char').children('.input').children('input').val('キャラ1');
		$('#char2').children('.prcn-char').children('.input').children('input').val('キャラ2');
		$('#char3').children('.prcn-char').children('.input').children('input').val('キャラ3');
		$('#char4').children('.prcn-char').children('.input').children('input').val('キャラ4');
	});


	function getCharName(num) {
		return $('#char' + num).children('.prcn-char').children('.input').children('input').val();
	}
	function getCharStar(num) {
		return $('#char' + num).children('.prcn-star').children('select').val();
	}
	function getCharRank(num) {
		return $('#char' + num).children('.prcn-rank').children('select').val();
	}
	function getlastTime() {
		var result = $('.edit-area div:last-child').children('input[type="time"]').val();
		if (result === undefined) {
			return "01:30";
		}
		return result;
	}

});

// タイムチャートコピー
function execCopy(string){
	  var tmp = document.createElement("div");
	  var pre = document.createElement('pre');
	  pre.style.webkitUserSelect = 'auto';
	  pre.style.userSelect = 'auto';


	  string = string.replace(/<br>/g, "\r\n");
	  tmp.appendChild(pre).textContent = string;
	  var s = tmp.style;
	  s.position = 'fixed';
	  s.right = '200%';

	  document.body.appendChild(tmp);
	  document.getSelection().selectAllChildren(tmp);
	  var result = document.execCommand("copy");
	  document.body.removeChild(tmp);

	  return result;
	}