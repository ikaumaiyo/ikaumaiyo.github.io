$(document).ready(function() {

	let charLimit = 5;
	var lineCount = 0;

	// 初期化
	$('.prcn-char').html(getCharPulldown());
	$('.prcn-rank').html($('#prcn-rank').html());
	$('.prcn-star').html($('#prcn-star').html());
	$('.prcn-unique').html($('#prcn-unique').html());

	$('.ui.dropdown').dropdown();

	for (var i = 0; i < charLimit; i++) {
		// 画像初期化
		var selectElm = $('#char' + i + ' > div.prcn-char > div > select');
		var imgElm = getCharImg(selectElm.val());
		imgElm.css("width", "100%");
		selectElm.parent().parent().parent().children('.prcn-img').html('');
		selectElm.parent().parent().parent().children('.prcn-img').append(imgElm);
	}

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
			result += getCharName(i);
			result += getCharStar(i) + ' ';
			result += getCharRank(i) + ' ';
			result += getCharUnique(i) != '-' ? '専用' + getCharUnique(i) : '';
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

		$('.tl-export-area p').html(result);

	});

	$(document).on("click", '.button-copy', function() {
		execCopy($('.tl-export-area p').html());
	});

	$(document).on("click", '.button-create-team-set', function() {
		createTeamSet();
	});

	$(document).on("click", '.tsts', function() {
	    let canvas = document.getElementById("canvas");

	    let link = document.createElement("a");
	    link.href = canvas.toDataURL("image/jpg");
	    link.download = "test.png";
	    link.click();
	});

	// キャラプルダウン変更時 画像更新
	$('div.prcn-char > div > select').dropdown('setting', 'onChange', function() {
		var imgElm = getCharImg($(this).val());
		imgElm.css("width", "100%");
		$(this).parent().parent().parent().children('.prcn-img').html('');
		$(this).parent().parent().parent().children('.prcn-img').append(imgElm);
	});

});

function getCharName(num) {
	return $('#char' + num + ' > div.prcn-char > div > div.text').html();
}
function getCharStar(num) {
	return $('#char' + num + ' > div.prcn-star > div > div.text').html();
}
function getCharRank(num) {
	return $('#char' + num + ' > div.prcn-rank > div > div.text').html();
}
function getCharUnique(num) {
	return $('#char' + num + ' > div.prcn-unique > div > div.text').html();
}
function getlastTime() {
	var result = $('.edit-area div:last-child').children('input[type="time"]').val();
	if (result === undefined) {
		return "01:30";
	}
	return result;
}

// タイムチャートコピー
function execCopy(string) {
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

// チーム画像生成
function createTeamSet() {

	var tmp = document.createElement("div");
	$(tmp).attr('id', 'imgTmp');
	document.body.appendChild(tmp);
	//
	// var charImg = $('#prcn-char-img').children().clone();
	// console.log(charImg.html());
	// var imgUrl = getCharImgUrl("アキノ");
	//
	// charImg.css('background-image', 'url(' + imgUrl + ')');

	// charImg.attr("src",imgUrl);
	// charImg.attr("src",imgUrl);
	// $('#imgTmp').append(charImg);

	html2canvas(document.body, {
		onrendered : function(canvas) {
			$(canvas).attr('id','canvas');
			document.body.appendChild(canvas);
		},
		allowTaint : true,
		useCORS : true,
		taintTest : false
	})

//	// HTML内に画像を表示
//	html2canvas(document.getElementById("target"), {
//		onrendered : function(canvas) {
//			// imgタグのsrcの中に、html2canvasがレンダリングした画像を指定する。
//			var imgData = canvas.toDataURL();
//			document.getElementById("result").src = imgData;
//		}
//	});
//
//	// ボタンを押下した際にダウンロードする画像を作る
//	html2canvas(document.getElementById("target"), {
//		onrendered : function(canvas) {
//			// aタグのhrefにキャプチャ画像のURLを設定
//			var imgData = canvas.toDataURL();
//			document.getElementById("ss").href = imgData;
//		}
//	});

	// document.body.removeChild(tmp);

}
// キャラ画像取得
function getCharImg(charId) {

	return $('#prcn-char-img').children('#' + charId + '').clone();

}