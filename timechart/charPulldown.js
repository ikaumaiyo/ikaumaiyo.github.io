var charArray = [ {
	val : "akari",
	txt : "アカリ"
}, {
	val : "akino",
	txt : "アキノ"
}, {
	val : "ayane",
	txt : "アヤネ"
}, {
	val : "ayane_kurisumasu",
	txt : "アヤネ（クリスマス）"
}, {
	val : "ayumi",
	txt : "アユミ"
}, {
	val : "arisa",
	txt : "アリサ"
}, {
	val : "an",
	txt : "アン"
}, {
	val : "annna",
	txt : "アンナ"
}, {
	val : "io",
	txt : "イオ"
}, {
	val : "iriya",
	txt : "イリヤ"
}, {
	val : "eriko",
	txt : "エリコ"
}, {
	val : "eriko_barenntain",
	txt : "エリコ（バレンタイン）"
}, {
	val : "kaori",
	txt : "カオリ"
}, {
	val : "kasumi",
	txt : "カスミ"
}, {
	val : "kyaru",
	txt : "キャル"
}, {
	val : "kyaru_sama-",
	txt : "キャル（サマー）"
}, {
	val : "kyouka",
	txt : "キョウカ"
}, {
	val : "kuuka_o-edo",
	txt : "クウカ（オーエド）"
}, {
	val : "kurisu",
	txt : "クリス"
}, {
	val : "kurumi",
	txt : "クルミ"
}, {
	val : "kurumi_kurisumasu",
	txt : "クルミ（クリスマス）"
}, {
	val : "kokkoro",
	txt : "コッコロ"
}, {
	val : "kokkoro_sama-",
	txt : "コッコロ（サマー）"
}, {
	val : "saren",
	txt : "サレン"
}, {
	val : "ji-ta",
	txt : "ジータ"
}, {
	val : "siori",
	txt : "シオリ"
}, {
	val : "sizuru",
	txt : "シズル"
}, {
	val : "sizuru_barenntain",
	txt : "シズル（バレンタイン）"
}, {
	val : "sinobu",
	txt : "シノブ"
}, {
	val : "jun",
	txt : "ジュン"
}, {
	val : "suzuna",
	txt : "スズナ"
}, {
	val : "suzume",
	txt : "スズメ（サマー）"
}, {
	val : "tamaki",
	txt : "タマキ"
}, {
	val : "tamaki_sama-",
	txt : "タマキ（サマー）"
}, {
	val : "tika",
	txt : "チカ"
}, {
	val : "tika_kurisumasu",
	txt : "チカ（クリスマス）"
}, {
	val : "tumugi",
	txt : "ツムギ"
}, {
	val : "tomo",
	txt : "トモ"
}, {
	val : "nanaka",
	txt : "ナナカ"
}, {
	val : "ninon",
	txt : "ニノン"
}, {
	val : "ninon_o-edo",
	txt : "ニノン（オーエド）"
}, {
	val : "nozomi",
	txt : "ノゾミ"
}, {
	val : "hatune",
	txt : "ハツネ"
}, {
	val : "sinobu_harowin",
	txt : "ハロシノ"
}, {
	val : "miyako_harowin",
	txt : "ハロプリ"
}, {
	val : "misaki_harowin",
	txt : "ハロミサ"
}, {
	val : "hiyori",
	txt : "ヒヨリ"
}, {
	val : "hiyori_nyu-iya-",
	txt : "ヒヨリ（ニューイヤー）"
}, {
	val : "pekori-nu",
	txt : "ペコリーヌ"
}, {
	val : "pekori-nu_sama-",
	txt : "ペコリーヌ（サマー）"
}, {
	val : "makoto",
	txt : "マコト"
}, {
	val : "mahiru",
	txt : "マヒル"
}, {
	val : "maho",
	txt : "マホ"
}, {
	val : "misato",
	txt : "ミサト"
}, {
	val : "misogi",
	txt : "ミソギ"
}, {
	val : "mituki",
	txt : "ミツキ"
}, {
	val : "mihuyu",
	txt : "ミフユ"
}, {
	val : "mihuyu_sama-",
	txt : "ミフユ（サマー）"
}, {
	val : "mimi",
	txt : "ミミ"
}, {
	val : "miyako",
	txt : "ミヤコ"
}, {
	val : "muimi",
	txt : "ムイミ"
}, {
	val : "monika",
	txt : "モニカ"
}, {
	val : "yui",
	txt : "ユイ"
}, {
	val : "yui_nyu-iya-",
	txt : "ユイ（ニューイヤー）"
}, {
	val : "yukari",
	txt : "ユカリ"
}, {
	val : "yuki",
	txt : "ユキ"
}, {
	val : "rima",
	txt : "リマ"
}, {
	val : "rulu",
	txt : "ルゥ"
}, {
	val : "ruka",
	txt : "ルカ"
}, {
	val : "rei",
	txt : "レイ"
}, {
	val : "rei_nyu-iya-",
	txt : "レイ（ニューイヤー）"
} , {
	val : "remu",
	txt : "レム"
} , {
	val : "ramu",
	txt : "ラム"
} ];

// キャラプルダウン生成
function getCharPulldown() {

	let selecter = $('#prcn-char').children().clone();

	for (let i = 0; i < charArray.length; i++) {
		let op = document.createElement("option");
		op.value = charArray[i].val;
		op.text = charArray[i].txt;

		selecter.append(op);

	}

	return selecter;

}

//キャラ画像取得
function getCharImg(charId) {


	//<img src="akari.jpg" id="akari"></img>

	let charImgElm = $('<img>');
	$(charImgElm).attr('src','../img/'+charId + '.jpg');
	$(charImgElm).attr('id',charId);


	return charImgElm;

}
