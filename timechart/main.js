$(document).ready(function() {

	const charLimit = 5;
	var lineCount = 0;
	var charModalSelectParentId = '';

	// 初期化
	$('.prcn-char').html(getCharPulldown());
	$('.prcn-rank').html($('#prcn-rank').html());
	$('.prcn-star').html($('#prcn-star').html());
	$('.prcn-unique').html($('#prcn-unique').html());

	$('.ui.dropdown').dropdown();

	for (let i = 0; i < charLimit; i++) {
		// 画像初期化
		let selectElm = $('#char' + i + ' > div.prcn-char > div > select');
		let imgElm = getCharImg(selectElm.val());
		imgElm.css("width", "100%");
		selectElm.parent().parent().parent().children('.prcn-img').html('');
		selectElm.parent().parent().parent().children('.prcn-img').append(imgElm);
	}

	$('.button-init').click(function() {
		$('.edit-area').html('');
		$('.button-line-insert').trigger('click');
	});

	$('.button-line-insert').click(function() {


		let lineTime = $('#prcn-timeline-time').html();
		let lineTimeResult = '';

		lineTimeResult = lineTime.replace(/01:30/g, getlastTime);

		let lineChar = $('#prcn-timeline-char').html();
		let lineCharResult = '';

		for (let i = 0; i < charLimit; i++) {
			let insertChar = getCharName(i);

			let _lineChar = lineChar;

			_lineChar = _lineChar.replace(/charNum/g, ('char' + i + lineCount));
			_lineChar = _lineChar.replace(/charName/g, insertChar);

			_lineChar = '<span class=\"item\">'  +_lineChar + "</span>";
			lineCharResult += _lineChar;


		}
		lineCharResult = '<span class=\"timeCharList\">'  +lineCharResult + "</span>";

		let lineBiko = $('#prcn-timeline-biko').html();
		let lineBikoResult = '';
		lineBikoResult = lineBiko.replace(/biko/g, 'biko' + lineCount);

		let lineDelete = $('#prcn-timeline-delete').html();
		let lineDeleteResult = '';

		lineCount += 1;

		$(".edit-area").append($("<div></div>").html(lineTimeResult + lineCharResult + lineBikoResult + lineDelete));


		for (let i = 0; i < $('.timeCharList').length; i++) {
		Sortable.create($('.timeCharList')[i], {
			  animation: 110  // ミリ秒で指定
			});
		}

	});

	$(document).on("click", '.button-line-delete', function() {
		$(this).parent().remove();
	});

	$(document).on("click", '.button-export', function() {

		createTeamSet();

		let result = '';

		for (let i = 0; i < charLimit; i++) {
			result += getCharName(i);
			result += getCharStar(i) + ' ';
			result += getCharRank(i) + ' ';
			result += getCharUnique(i) != '-' ? '専用' + getCharUnique(i) : '';
			result += '<br>';

		}

		result += '<br>';

		let lines = $('.edit-area').children();
		for (let i = 0; i < lines.length; i++) {
			let line = lines.eq(i);
			result += $(line).children('input[type="time"]').val() + ' ';

			let chars = $(line).find('input[type="checkbox"]');

			for (let ci = 0; ci < chars.length; ci++) {
				let chr = chars.eq(ci);
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
		let imgElm = getCharImg($(this).val());
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
	let result = $('.edit-area div:last-child').children('input[type="time"]').val();
	if (result === undefined) {
		return "01:30";
	}
	return result;
}

// タイムチャートコピー
function execCopy(string) {
	let tmp = document.createElement("div");
	let pre = document.createElement('pre');
	pre.style.webkitUserSelect = 'auto';
	pre.style.userSelect = 'auto';

	string = string.replace(/<br>/g, "\r\n");
	tmp.appendChild(pre).textContent = string;
	let s = tmp.style;
	s.position = 'fixed';
	s.right = '200%';

	document.body.appendChild(tmp);
	document.getSelection().selectAllChildren(tmp);
	let result = document.execCommand("copy");
	document.body.removeChild(tmp);

	return result;
}

// チーム画像生成
function createTeamSet() {

	// 前の描画を削除
	document.querySelector("div.ui.clearing.segment.img-export-area > p").innerHTML = '';
	// 画像のサイズ取得
	let width = $('#target').width();

	// 描画用コンテンツ生成
	let teamElm = $('#target').clone();
	teamElm.attr('id', 'teamImgContents');
	teamElm.width(width);

	let lines = $(teamElm).children('div div').children();
	let buttonElmHtml = '<button class="fluid ui button img-txt" >charVal</button>'
	for (let i = 0; i < lines.length; i++) {
		let line = lines.eq(i);
		line.css('margin-left', '25px;');
		buttonElmHtml.replace(/charVal/g, getCharName(i));
		$(line).children('.prcn-char').html(buttonElmHtml.replace(/charVal/g, getCharName(i)));
		$(line).children('.prcn-star').html(buttonElmHtml.replace(/charVal/g, getCharStar(i)));
		$(line).children('.prcn-rank').html(buttonElmHtml.replace(/charVal/g, getCharRank(i)));
		$(line).children('.prcn-unique').html(buttonElmHtml.replace(/charVal/g, getCharUnique(i) != '-' ? '専用 ' + getCharUnique(i) : '-'));
	}

	$('body').append($(teamElm));

	// canvas描画
	html2canvas(document.getElementById("teamImgContents"), {
		onrendered : function(canvas) {
			$(canvas).attr('id', 'canvas');
			document.querySelector("div.ui.clearing.segment.img-export-area p").appendChild(canvas);
			$('body').children('#teamImgContents').remove();
		},
		allowTaint : true,
		useCORS : true,
		taintTest : false
	});

}

$(document).on("click", '.char-modal-close', function() {
	const modal = document.querySelector('dialog');

	// モーダルを隠す
	modal.close();
});
$(document).on("click", '.char-modal-submit', function() {

	var selectId = $('input[name=selectChar]:checked').val();

	// モーダルを隠す
	const modal = document.querySelector('dialog');
	modal.close();

	// 画像初期化
	let selectElm = $('#' + selectId + ' > div.prcn-char > div > select');
	let imgElm = getCharImg(selectId);

	imgElm.css("width", "100%");
	$('#' + charModalSelectParentId).children('div.prcn-img').html('');
	$('#' + charModalSelectParentId).children('div.prcn-img').append(imgElm);

	$("#" + charModalSelectParentId + " > div.prcn-char > div > select").dropdown('set selected', getCharNameById(selectId));


});
$(document).on("click", '.prcn-img', function() {

	charModalSelectParentId = $(this).parent().attr('id');

	let charArray = getCharList();

	let idHash = 'radioImg';

	let radioInputHtml = '<input type="radio" id="targetId" name="selectChar" value="targetValue"/>';
	let radioLabelHtml = "<label for=\"targetFor\" style=\"background-image: url('../img/targetImg.jpg')\"></label>";

	let appendCharResult = '';

	for (let i = 0; i < charArray.length; i++) {

		let _radioInputHtml = radioInputHtml;
		let _radioLabelHtml = radioLabelHtml;

		_radioInputHtml = _radioInputHtml.replace(/targetId/g, charArray[i].val + idHash);
		_radioInputHtml = _radioInputHtml.replace(/targetValue/g, charArray[i].val);

		_radioLabelHtml = _radioLabelHtml.replace(/targetImg/g, charArray[i].val);
		_radioLabelHtml = _radioLabelHtml.replace(/targetFor/g, charArray[i].val + idHash);

		appendCharResult += _radioInputHtml + _radioLabelHtml;

	}

	$('.input-area').html(appendCharResult);

	const modal = document.querySelector('dialog');

	// モーダルを表示する (open属性を与える)
	modal.showModal();

});
