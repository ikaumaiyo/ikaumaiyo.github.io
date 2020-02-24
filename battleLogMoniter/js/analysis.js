class Analysis{

	constructor(report, member, priconeDate){

		let that = this;

		/** 全凸レポート * */
		this.report = report;
		/** メンバー * */
		this.member = member;
		/** プリコネ日 * */
		this.priconeDate = priconeDate;

		// プリコネ日(START)をミリ秒に変換
		this.startPriconeDate_Milli = Date.parse(this.priconeDate);
		// プリコネ日(END)をミリ秒に変換
		this.endPriconeDate = new Date(this.priconeDate.getFullYear(), this.priconeDate.getMonth(), this.priconeDate.getDate()+1,
				this.priconeDate.getHours(), this.priconeDate.getMinutes(), this.priconeDate.getSeconds());
		this.endPriconeDate_Milli = Date.parse(this.endPriconeDate);
		// プリコネ日(START_YESTERDAY)をミリ秒に変換
		this.startYestPriconeDate = new Date(this.priconeDate.getFullYear(), this.priconeDate.getMonth(), this.priconeDate.getDate()-1,
				this.priconeDate.getHours(), this.priconeDate.getMinutes(), this.priconeDate.getSeconds());
		this.startYestPriconeDate_Milli = Date.parse(this.startYestPriconeDate);

		/** 今日分の凸レポート * */
		this.todayReport = this.report.filter(function(item, index){
			if(Date.parse(item.タイムスタンプ) >= that.startPriconeDate_Milli
					&& Date.parse(item.タイムスタンプ) < that.endPriconeDate_Milli) {
				return true;
			}
		});
		/** 前日分の凸レポート * */
		this.yesterdayReport = this.report.filter(function(item, index){
			if(Date.parse(item.タイムスタンプ) >= that.startYestPriconeDate_Milli
					&& Date.parse(item.タイムスタンプ) < that.startPriconeDate_Milli) {
				return true;
			}
		});

		/** 凸チャート * */
		this.totuChart;
	}

	/** インスタンス破棄 * */
	destroy() {
		if(this.totuChart){
			this.totuChart.destroy();
		}
	}

	/** レンダコントローラ * */
	render(){

		console.log('Analysis.render start ************************************');

		/** 初期化 * */
		// 凸数
		$('#render-battleSuccessful').find('.totuNum').html('');
		$('#render-battleSuccessful>.perProgress>.successful').css('width' ,0+'%');
		$('#render-battleSuccessful').find('.perNum').html('消化率 : '+0+'％');
		// ボス状態
		$('#render-bossState').find('.render').remove();
		// 岸君の凸
		$('#render-kisiState').find('.render').remove();
		if($('#chk-hideFin').prop('checked')){
			$('#chk-hideFin').click();
		}
		if($('#chk-magicUsed').prop('checked')){
			$('#chk-magicUsed').click();
		}
		// ボス@
		$('.boss').html('');
		// 凸予想
		$('#render-kisiNextExpected').find('.render').remove();
		// バトルログ
		$('#render-battleLog').find('.logArea').html('');

		this.renderPriconeDate();

		/** 昨日と今日のデータがあれば分析開始 * */
		if(!(this.todayReport.length == 0 && this.yesterdayReport.length == 0)){
			try{
				// 凸完了数を表示
				this.renderBattleSuccessful();
				// 凸チャートを表示
				this.renderBattleChart();
				// ボス状態を表示
				this.renderBattleState();
				// 岸君の凸状態を表示
				this.renderKisiState();
				// 岸君の次の凸予想
				this.renderKisiNextExpected();
				// バトルログを表示
				this.renderBattleLog();
				// 岸君の凸傾向を表示
				// this.renderKisiTrend();

				renderBossImg();
			}catch(e){
				return e;
			}
		}else{
			return 'データがありません';
		}
	}

	/** プリコネ日をセット * */
	renderPriconeDate(){
		let priconeViewDate = 'プリコネ日：'+this.priconeDate.getFullYear() + '-' + ("0" + (this.priconeDate.getMonth() + 1)).slice(-2) + '-' + ("0" + this.priconeDate.getDate()).slice(-2);
		$('#render-battleSuccessful').find('p').find('span').html(priconeViewDate);
	}

	/** 凸完了数を表示 * */
	renderBattleSuccessful(){

		// 凸数を取得
		let totuNum = 0;
		$.each(this.todayReport, function(i, v){
			if(v.LA残 == 1 || v.LA == 1 ){
				totuNum = totuNum + 0.5;
			}else{
				totuNum = totuNum + 1;
			}
		});

		// プログレスバー生成
		let span = $("<span></span>");
		span.attr('class', 'text');
		span.html(' / 90');

		// 凸数セット
		$('#render-battleSuccessful').find('.totuNum').html(totuNum);
		$('#render-battleSuccessful').find('.totuNum').append(span);
		// プログレスバーをセット
		$('#render-battleSuccessful>.perProgress>.successful').css('width' ,totuNum/90*100+'%');
		// 消化率をセット
		$('#render-battleSuccessful').find('.perNum').html('消化率: '+Math.round(totuNum/90*100)+'％ / 残凸: ' +(90-totuNum));

	}

	/** 凸チャートを表示 * */
	renderBattleChart(){
		let timeArray = [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,1,2,3,4];
		let battleCountArray = [];

		// 時間ごとに凸数をカウント
		$.each(timeArray, (i,searchHour) => {
			let _countBattles = this.todayReport.filter((item, index) => {
				let targetHour = new Date(item.タイムスタンプ).getHours();
				if(targetHour == searchHour) return true;
			});
			battleCountArray.push(_countBattles.length);
		});

		// 凸チャートレンダ
		let ctx = $('#render-battleChart').find('.chart').get(0);
		this.totuChart = new Chart(ctx, {
		  type: 'bar',
		  data: {
		    labels: timeArray,
		    datasets: [{
		      label: '時間あたりの凸数',
		      data: battleCountArray,
		      backgroundColor: "rgba(33,150,243,0.9)"
		    }]
		  }
		});
	}

	/** ボス状態を表示 * */
	renderBattleState(){
		let that = this;

		// オプション読み込み
		let optionList = optionDatastore.getOptionList();

		// 今日のダメージ
		let todayDmg = this.todayReport.reduce((prev, item) => prev + item.ダメージ ,0);
		// 今日の周回数
		let todayWrap = todayDmg / optionDatastore.getW3Sum();
		// 昨日のダメージ
		let yesterdayDmg = this.yesterdayReport.reduce(function(prev, item){
			if(item.周回 >= optionList.w3_start_wrap){
				return prev + item.ダメージ;
			}else{
				return prev + item.ダメージ*0.9; // 周回予測に使うため1,2週目分はダメージ低く見積もる（係数はフィーリング）
			}
		} ,0);
		// 昨日の周回数
		let yestWrap = yesterdayDmg / optionDatastore.getW3Sum();
		if(this.todayReport[0].周回 >= optionList.w4_start_wrap){
			yestWrap = yesterdayDmg / optionDatastore.getW4Sum();
		}

		// 今日のボス情報を取得
		let startBoss = 0;  // ボス開始
		let startWrap = 0; // ラップ開始
		let nowBoss = 0;   // ボス現在
		let nowWrap = 0;  // ラップ現在
		if(this.todayReport.length > 0){
			startBoss = this.todayReport[0].ボス;
			startWrap = this.todayReport[0].周回;
			nowBoss = this.todayReport[this.todayReport.length-1].ボス;
			nowWrap = this.todayReport[this.todayReport.length-1].周回;
		}else{
			// その日のデータが無い場合はスタートを前日最終地点に設定
			startBoss = this.yesterdayReport[this.yesterdayReport.length-1].ボス;
			startWrap = this.yesterdayReport[this.yesterdayReport.length-1].周回;
			nowBoss = this.yesterdayReport[this.yesterdayReport.length-1].ボス;
			nowWrap = this.yesterdayReport[this.yesterdayReport.length-1].周回;
		}
		// 現ボスの状態
		let nowBossReport = this.report.filter(function(_item, _index){
			if(_item.周回 == nowWrap && _item.ボス == nowBoss
					&& Date.parse(_item.タイムスタンプ) < that.endPriconeDate) {
				return true;
			}
		});
		// 現ボスが食らったダメージ
		let nowBossDmg = nowBossReport.reduce((prev, item) => prev + item.ダメージ ,0);
		// 現wave
		let nowBossWave = 1;
		if(nowWrap >= optionList.w4_start_wrap){
			nowBossWave = 4;
		}else if(nowWrap >= optionList.w3_start_wrap){
			nowBossWave = 3;
		}else if(nowWrap >= optionList.w2_start_wrap){
			nowBossWave = 2;
		}else if(nowWrap >= optionList.w1_start_wrap){
			nowBossWave = 1;
		}

		// ボス撃破後だった場合は次のボスを現在地に設定
		if(nowBossDmg >= optionList['boss_hp_w'+nowBossWave+'_0'+nowBoss] ){
			if(startBoss == nowBoss && startWrap == nowWrap){
				startBoss = startBoss + 1;
			}
			nowBoss = nowBoss + 1;
			nowBossDmg = 0;
			if(nowBoss == 6){
				nowBoss = 1;
				nowWrap = nowWrap + 1;
			}
			if(startBoss == 6){
				startBoss = 1;
				startWrap = startWrap + 1;
			}
		}


		// 現在のボスを表示する
		// ボス画像
		$('#render-bossState').find('.nowBossState').find('.boss').css('background-image','url('+$('#bossImg0'+nowBoss).val()+')');
		// wave
		$('#render-bossState').find('.nowBossState').find('.hpPerBox').find('.wave').html('wave'+nowBossWave);
		// hp
		let nowBossHpStateStr = (optionList['boss_hp_w'+nowBossWave+'_0'+nowBoss] - nowBossDmg);
		let nowBossHpStatePerStr = Math.round((optionList['boss_hp_w'+nowBossWave+'_0'+nowBoss] - nowBossDmg)/optionList['boss_hp_w'+nowBossWave+'_0'+nowBoss]*100) + '%';
		nowBossHpStateStr = nowBossHpStateStr + ' / ';
		nowBossHpStateStr = nowBossHpStateStr + optionList['boss_hp_w'+nowBossWave+'_0'+nowBoss];
		nowBossHpStateStr = nowBossHpStateStr + ' ('+ nowBossHpStatePerStr + ')';
		$('#render-bossState').find('.nowBossState').find('.hpPerBox').find('.hp').html(nowBossHpStateStr);

		// プログレスバー
		$('#render-bossState').find('.nowBossState').find('.hpPerBox').find('.perProgress').find('.successful').css('width',nowBossHpStatePerStr);

		// 着地予測の終端を計算
		let outlookBossCount = this.calc_outlookBossCount(yestWrap,startBoss);

		// ボスの必要凸数を取得
		let requiredBossTotuCount = this.calc_requiredBossTotuCount(this.report);
		let requiredBossTotuCountSum = {};
		if(Object.keys(requiredBossTotuCount).length != 0){
			requiredBossTotuCountSum[1] = 0;
			requiredBossTotuCountSum[2] = 0;
			requiredBossTotuCountSum[3] = 0;
			requiredBossTotuCountSum[4] = 0;
			requiredBossTotuCountSum[5] = 0;
		}

		// ボス状態をレンダ
		let firstFlg = 1; // 初回ループフラグ
		let outlookFlg = 0; // 着地予測割り込みフラグ
		while(true){
			if(outlookBossCount <= 0 && startWrap > nowWrap){
				break;
			}
			let bossStateWrapLine = $('<div></div>').attr('class','bossStateWrapLine render');
			$('<div></div>').attr('class','emptyBox render').html(startWrap).appendTo(bossStateWrapLine); // レンダ用のwrapボックス

			for (  var i = 1;  i < 6;  i++  ) {

				let nowStateDiv = $('<div></div>').attr('class','nowState render');
				let emptyBoxDiv = $('<div></div>').attr('class','emptyBox render');
				let outlookDiv = $('<div></div>').attr('class','outlook render').html('着地予測');

				// 現在のボス以下の場合は空ボックス挿入してcontinue
				if(firstFlg == 1 && i < startBoss){
					emptyBoxDiv.appendTo(bossStateWrapLine);
					continue;
				}
				// 着地予測の割り込み処理
				outlookBossCount = outlookBossCount - 1;
				if(outlookBossCount == 0){
					// 現在地の場合は特殊ボックス
					if(startWrap == nowWrap && i == nowBoss){
						outlookDiv = $('<div></div>').attr('class','nowState render');
						outlookDiv.html('現在地');
						outlookDiv.css('box-shadow','rgb(250, 164, 3) 0px 0px 0px 2px inset');
					}
					outlookDiv.appendTo(bossStateWrapLine);
					continue;
				}

				// 現在のボス以上の場合は空ボックス挿入してcontinue
				if(startWrap > nowWrap || (startWrap == nowWrap && i > nowBoss)){
					// ボス必要凸数をカウント
					if(outlookBossCount > 0 && Object.keys(requiredBossTotuCountSum).length != 0){
						requiredBossTotuCountSum[i] = requiredBossTotuCountSum[i] + requiredBossTotuCount[i];
					}
					// 空ボックス挿入
					emptyBoxDiv.appendTo(bossStateWrapLine);
					continue;
				}

				// 現在地の場合はコメント追加
				if(startWrap == nowWrap && i == nowBoss){
					nowStateDiv.html('現在地');
				}

				// 現在ボスのレンダ
				if(startWrap <= nowWrap){
					nowStateDiv.appendTo(bossStateWrapLine);
					continue;
				}
				emptyBoxDiv.html('(エラー)');
				emptyBoxDiv.appendTo(bossStateWrapLine);
			}

			bossStateWrapLine.appendTo('#render-bossState');
			firstFlg = 0;
			startWrap = startWrap + 1; // ループのスタート周をカウントアップ

		} // while

		if(Object.keys(requiredBossTotuCountSum).length != 0){
			$('.bossStateWrapLine').find('.emptyBox')[0].innerHTML = '周速 '+requiredBossTotuCount[0].toFixed(1);
			$('.requiredCount.b1').html(requiredBossTotuCount[1].toFixed(1)+'凸');
			$('.requiredCount.b2').html(requiredBossTotuCount[2].toFixed(1)+'凸');
			$('.requiredCount.b3').html(requiredBossTotuCount[3].toFixed(1)+'凸');
			$('.requiredCount.b4').html(requiredBossTotuCount[4].toFixed(1)+'凸');
			$('.requiredCount.b5').html(requiredBossTotuCount[5].toFixed(1)+'凸');
			$('#render-bossState .boss.b1').html('@'+requiredBossTotuCountSum[1].toFixed(1)+'凸');
			$('#render-bossState .boss.b2').html('@'+requiredBossTotuCountSum[2].toFixed(1)+'凸');
			$('#render-bossState .boss.b3').html('@'+requiredBossTotuCountSum[3].toFixed(1)+'凸');
			$('#render-bossState .boss.b4').html('@'+requiredBossTotuCountSum[4].toFixed(1)+'凸');
			$('#render-bossState .boss.b5').html('@'+requiredBossTotuCountSum[5].toFixed(1)+'凸');
		}


	}

	/** 岸君の凸状況 * */
	renderKisiState(){

		if(this.member.length == 0){
			return false;
		}

		let optionList = optionDatastore.getOptionList();

		// 岸君テーブル
		let kisiStateTable = $('#render-kisiState').find('#kisiStateTable');
		let that = this;
		$.each(this.member, function(index, val){

			// 岸君凸配列
			let kisiTotuReport = that.todayReport.filter(function(_item, _index){
				if(_item.プリコネーム == val.プリコネーム){
					return true;
				}
			});

			// 一行
			let tr = $('<tr></tr>').attr('class','render');

			// 名前
			$('<td></td>').html(val.プリコネーム).appendTo(tr);
			// 凸数
			let totuNum = kisiTotuReport.reduce(function(_prev, _item) {
				if(_item.LA == 1 || _item.LA残 == 1 ){
					return _prev + 0.5;
				}else{
					return _prev + 1;
				}
			},0);
			$('<td></td>').html(totuNum).appendTo(tr);
			if(totuNum >= 3){
				tr.addClass('finished');
			}
			// 凸メーター
			let totuMater = $('<td></td>').html(totuNum);
			$.each(kisiTotuReport, function(_i, _v){
				let div = $('<div></div>');
				div.addClass('stateBox');
				if(_v.LA == 1){
					div.addClass('half');
					div.addClass('first');
				}else if(_v.LA残 == 1){
					div.addClass('half');
					div.addClass('second');
				}
				if(_v.魔法 == 1){
					div.addClass('magic');
				}
				div.appendTo(totuMater);
			});

			totuMater.appendTo(tr);

			// 魔法凸済
			let totuMagicNum = kisiTotuReport.reduce(function(_prev, _item) {
				if(_item.魔法 == 1){
					return _prev + 1;
				}else{
					return _prev;
				}
			},0);

			if(totuMagicNum > 0){
				$('<td></td>').html('✔').appendTo(tr);
				tr.addClass('magicUsed');
			}else{
				let _td_ = $('<td></td>').css('color','white');
				_td_.html('_'+totuNum).appendTo(tr);
			}

			// 実凸
			for(var i = 1; i < 6; i++){
				let _ktr = kisiTotuReport.filter(function(o){
					return o.ボス == i;
				});
				if(_ktr.length > 0){
					let totuNum = _ktr.reduce(function(_prev, _item) {
						if(_item.LA == 1 || _item.LA残 == 1 ){
							return _prev + 0.5;
						}else{
							return _prev + 1;
						}
					},0);
					let stateTd = $('<td></td>').html(totuNum);
					let stateDiv = $('<div></div>');
					$.each(_ktr, function(_i, _v){
						let div = $('<div></div>');
						div.addClass('stateBox');
						if(_v.LA == 1){
							div.addClass('half');
							div.addClass('first');
						}else if(_v.LA残 == 1){
							div.addClass('half');
							div.addClass('second');
						}
						if(_v.魔法 == 1){
							div.addClass('magic');
						}
						div.appendTo(stateTd);
					});
					stateTd.appendTo(tr);
				}else{
					$('<td></td>').html(0).appendTo(tr);
				}
			}

			// 凸傾向
			let _nowloc = that.report[that.report.length-1].周回;
			let keikoTargetWrap = optionList.w1_start_wrap;
			keikoTargetWrap = _nowloc >= optionList.w4_start_wrap ? optionList.w4_start_wrap : keikoTargetWrap;
			keikoTargetWrap = _nowloc >= optionList.w3_start_wrap ? optionList.w3_start_wrap : keikoTargetWrap;
			keikoTargetWrap = _nowloc >= optionList.w2_start_wrap ? optionList.w2_start_wrap : keikoTargetWrap;

			let kisiTotuOver20MReport = that.report.filter(function(_item, _index){
				if(_item.プリコネーム == val.プリコネーム
						&& _item.ダメージ > 3000000
						&& _item.周回 >= keikoTargetWrap){
					return true;
				}
			});
			for(var i = 1; i < 6; i++){
				let _ktr = kisiTotuOver20MReport.filter(function(o){
					return o.ボス == i;
				});
				if(_ktr.length > 0){
					let stateTd = $('<td></td>').html(_ktr.length/10);
					let stateDiv = $('<div></div>').attr('class','stateBox center trend').css('opacity',_ktr.length/8);
					stateDiv.appendTo(stateTd);
					stateTd.appendTo(tr);
				}else{
					$('<td></td>').html(0).appendTo(tr);
				}
			}

			// 岸君メモ
			let kisiTotuMemoTd = $('<td></td>').addClass('kisiTotuMemo');
			kisiTotuMemoTd.css('padding','0px');
			kisiTotuMemoTd.css('position','relative');
			let kisiTotuMemo = $('<input>').attr({
				  type: 'text',
				  id: 'input_'+val.プリコネーム,
				  name: val.プリコネーム,
				  value: memoDatastore.getMemo(val.プリコネーム)
				});
			kisiTotuMemo.appendTo(kisiTotuMemoTd);
			if(memoDatastore.getMemo(val.プリコネーム) != ''){
				kisiTotuMemoTd.addClass('isShow');
			}

			let kisiTotuMemoTooltip = $('<div></div>');
			kisiTotuMemoTooltip.addClass('tooltip');
			let kisiTotuMemoTooltip_span = $('<span></span>');
			kisiTotuMemoTooltip_span.html(memoDatastore.getMemo(val.プリコネーム));
			kisiTotuMemoTooltip_span.appendTo(kisiTotuMemoTooltip);
			kisiTotuMemoTooltip.appendTo(kisiTotuMemoTd);

			kisiTotuMemoTd.appendTo(tr);


			// 以下凸詳細モーダル用のデータ

			// 凸詳細を挿入
			let totuDetail = $('<p></p>');
			totuDetail.addClass('totuDetail');

			let totuDetailSpan = $('<span></span>');
			totuDetailSpan.html(val.プリコネーム + ' (' +totuNum + '凸)');
			totuDetailSpan.appendTo(totuDetail);

			let totuDetailTable = $('<table></table>');
			totuDetailTable.addClass('simple-table');
			let totuDetailTr = $('<tr></tr>');
			$('<th></th>').html('日付').appendTo(totuDetailTr);
			$('<th></th>').html('周回').appendTo(totuDetailTr);
			$('<th></th>').html('ボス').appendTo(totuDetailTr);
			$('<th></th>').html('ダメージ').appendTo(totuDetailTr);
			$('<th></th>').html('魔法').appendTo(totuDetailTr);
			$('<th></th>').html('LA').appendTo(totuDetailTr);
			$('<th></th>').html('LA残').appendTo(totuDetailTr);
			totuDetailTr.appendTo(totuDetailTable);
			$.each(kisiTotuReport, function(_i, _v){
				let _tr = $('<tr></tr>');
				let dateTime = new Date(_v.タイムスタンプ);
				let dateStr = dateTime.toLocaleDateString() +' '+dateTime.toLocaleTimeString('ja-JP');
				$('<td></td>').html(dateStr).appendTo(_tr);
				$('<td></td>').html(_v.周回).appendTo(_tr);
				$('<td></td>').html(_v.ボス).appendTo(_tr);
				$('<td></td>').html(_v.ダメージ).appendTo(_tr);
				$('<td></td>').html(_v.魔法).appendTo(_tr);
				$('<td></td>').html(_v.LA).appendTo(_tr);
				$('<td></td>').html(_v.LA残).appendTo(_tr);
				_tr.appendTo(totuDetailTable);
			});
			totuDetailTable.appendTo(totuDetail);
			totuDetail.appendTo(tr);

			// 岸君ごとの凸傾向を挿入
			let totuTotuAllDayContainer = $('<p></p>').addClass('totuTimeKeiko');
			let kisiTotuAllDay_keikoContainer = $('<div></div>').addClass('totuTimeKeiko-flex');
			let kisiTotuAllDay_timeContainer = $('<div></div>').addClass('totuTimeKeiko-flex').addClass('time');

			let timeArray = [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,1,2,3,4];
			let battleCountArray = [];

			let kisiTotuAllDayReport = that.report.filter(function(_item, _index){
				if(_item.プリコネーム == val.プリコネーム){
					return true;
				}
			});

			let totuTimeSpan = $('<span></span>');
			totuTimeSpan.html('凸時間の傾向(全日)');
			totuTimeSpan.appendTo(totuTotuAllDayContainer);

			// 時間ごとに凸数をカウント
			$.each(timeArray, (i,searchHour) => {
				let _countBattles = kisiTotuAllDayReport.filter((item, index) => {
					let targetHour = new Date(item.タイムスタンプ).getHours();
					if(targetHour == searchHour) return true;
				});
				$('<div></div>').html(_countBattles.length).css('background-color','rgba(0, 0, 255, '+_countBattles.length/5+')').appendTo(kisiTotuAllDay_keikoContainer);
				$('<div></div>').html(searchHour).appendTo(kisiTotuAllDay_timeContainer);
			});

			kisiTotuAllDay_keikoContainer.appendTo(totuTotuAllDayContainer);
			kisiTotuAllDay_timeContainer.appendTo(totuTotuAllDayContainer);

			totuTotuAllDayContainer.appendTo(tr);

			// 一行レンダ
			tr.appendTo(kisiStateTable);

		});

		$(".tablesorter").trigger("update");

	}


	/** 岸君の次の凸予想 * */
	renderKisiNextExpected(){

		let optionList = optionDatastore.getOptionList();

		let that = this;

		let yosoList = {0:[],1:[],2:[],3:[],4:[],5:[]}; // 0は残凸分

		$.each(this.member, function(index, val){

			// 岸君凸配列
			let kisiTotuReport = that.todayReport.filter(function(_item, _index){
				if(_item.プリコネーム == val.プリコネーム){
					return true;
				}
			});
			// 凸数
			let totuNum = kisiTotuReport.reduce(function(_prev, _item) {
				if(_item.LA == 1 || _item.LA残 == 1 ){
					return _prev + 0.5;
				}else{
					return _prev + 1;
				}
			},0);
			// 残凸
			let zanTotuNum = 3 - totuNum;
			// ボスごとの予想
			let _nowloc = that.report[that.report.length-1].周回;
			let keikoTargetWrap = optionList.w1_start_wrap;
			keikoTargetWrap = _nowloc >= optionList.w4_start_wrap ? optionList.w4_start_wrap : keikoTargetWrap;
			keikoTargetWrap = _nowloc >= optionList.w3_start_wrap ? optionList.w3_start_wrap : keikoTargetWrap;
			keikoTargetWrap = _nowloc >= optionList.w2_start_wrap ? optionList.w2_start_wrap : keikoTargetWrap;
			let kisiYosoCountList = {};
			for(var i = 1; i < 6; i++){
				kisiYosoCountList[i] = 0;
				let iBossList = that.report.filter(function(_item, _index){
					if(_item.プリコネーム == val.プリコネーム
							&& _item.ダメージ > 3000000
							&& _item.周回 >= keikoTargetWrap
							&& _item.ボス == i){
						return true;
					}
				});
				kisiYosoCountList[i] = iBossList.length;
			}
			// 凸済のボスをボス予想リストから削除
			$.each(kisiTotuReport, function(_i, _v){
				if(_v.ダメージ > 3000000){
					delete kisiYosoCountList[_v.ボス];
				}
			});
			// 予想リストに追加していく
			for(var i = 0; i< zanTotuNum; i++){
				if(zanTotuNum - i == 0.5){
					yosoList[0].push(val.プリコネーム);
					break;
				}
				let maxLoc = that.getMaxValLocation(kisiYosoCountList);
				yosoList[maxLoc].push(val.プリコネーム);
				delete kisiYosoCountList[maxLoc];
			}

		});


		// レンダ
		// 岸君テーブル
		let kisiNextExpectedArea = $('#render-kisiNextExpected').find('#kisiNextExpectedList');
		let ul;

		ul = $('<ul></ul>').addClass('render').addClass('tableCellChanger');
		$.each(yosoList[0], function(index, val){
			let _li = $('<li></li>');
			_li.css('background-color','#cdcdf7');
			_li.css('border-radius','10px');
			_li.html(val).appendTo(ul);
		});
		ul.appendTo(kisiNextExpectedArea);

		ul = $('<ul></ul>').addClass('render').addClass('tableCellChanger');
		$.each(yosoList[1], function(index, val){
			$('<li></li>').html(val).appendTo(ul);
		});
		ul.appendTo(kisiNextExpectedArea);

		ul = $('<ul></ul>').addClass('render').addClass('tableCellChanger');
		$.each(yosoList[2], function(index, val){
			$('<li></li>').html(val).appendTo(ul);
		});
		ul.appendTo(kisiNextExpectedArea);

		ul = $('<ul></ul>').addClass('render').addClass('tableCellChanger');
		$.each(yosoList[3], function(index, val){
			$('<li></li>').html(val).appendTo(ul);
		});
		ul.appendTo(kisiNextExpectedArea);

		ul = $('<ul></ul>').addClass('render').addClass('tableCellChanger');
		$.each(yosoList[4], function(index, val){
			$('<li></li>').html(val).appendTo(ul);
		});
		ul.appendTo(kisiNextExpectedArea);

		ul = $('<ul></ul>').addClass('render').addClass('tableCellChanger');
		$.each(yosoList[5], function(index, val){
			$('<li></li>').html(val).appendTo(ul);
		});
		ul.appendTo(kisiNextExpectedArea);


		  $('.tableCellChanger').sortable({
			  connectWith: '.tableCellChanger'
		  });

	}

	/** バトルログ * */
	renderBattleLog(){
		let that = this;

		let logArea = $('#render-battleLog').find('.logArea');


		$.each(this.todayReport, function(i, v){
			let log = $('<div></div>').addClass('log');

			let bossImg = $('<div></div>').addClass('boss b'+v.ボス);
			bossImg.appendTo(log);
			let time = $('<div></div>').addClass('time');
			time.html(that.calcDiffMili(v.タイムスタンプ));

			time.appendTo(log);

			let msg = $('<div></div>').addClass('msg');
			let insertMsg = v.プリコネーム + ' が<br>' + v.ダメージ.toLocaleString() +' ダメージ';
			if(v.LA == 1){
				insertMsg = insertMsg + ' で撃破'
			}
			if(v.LA残 == 1){
				insertMsg = insertMsg + ' を持越し'
			}
			msg.html(insertMsg);
			msg.appendTo(log);
			log.prependTo(logArea);

			if(v.ボス == 5 && v.LA == 1){
				let sep = $('<div class="log" style="height:1.5rem"><div class="separator">'+(v.周回+1)+'週目開始</div></div>');
				sep.prependTo(logArea);
			}

		});
	}

	/** 時間の差分を返す **/
	calcDiffMili(mili){
		let t1 = new Date();
		let t2 = new Date(mili);

		let diff = t1.getTime() - t2.getTime();

		//HH部分取得
		let diffHour = diff / (1000 * 60 * 60);
		//MM部分取得
		let diffMinute = (diffHour - Math.floor(diffHour)) * 60;
		//SS部分取得
		let diffSecond = (diffMinute - Math.floor(diffMinute)) * 60;

		if(('00' + Math.floor(diffHour)).slice(-2) == '00'){
			return Number(('00' + Math.floor(diffMinute)).slice(-2)) + '分前';
		}else{
			return Number(('00' + Math.floor(diffHour)).slice(-2))  + '時間前';
		}

		return ('00' + Math.floor(diffHour)).slice(-2) + ':' + ('00' + Math.floor(diffMinute)).slice(-2) + ':' + ('00' + Math.round(diffSecond)).slice(-2);
	}

	/** オブジェクト配列の最大値の指標を返す（数値じゃなきゃだめ） * */
	getMaxValLocation(list){
		let maxLocation;
		$.each(list, function(i, v){
			if(maxLocation === undefined){
				maxLocation = i;
				return true;// continue
			}
			if(list[maxLocation] < v){
				maxLocation = i;
			}
		});
		return maxLocation;

	}

	/** ボス状態を表示 - 着地予測の終端を計算 * */
	calc_outlookBossCount(yestWrap,startBoss){
		let optionList = optionDatastore.getOptionList();
		let b01per = optionList.boss_hp_w3_01/optionDatastore.getW3Sum(); // 1ボスHP割合
		let b02per = optionList.boss_hp_w3_02/optionDatastore.getW3Sum(); // 2ボスHP割合
		let b03per = optionList.boss_hp_w3_03/optionDatastore.getW3Sum(); // 3ボスHP割合
		let b04per = optionList.boss_hp_w3_04/optionDatastore.getW3Sum(); // 4ボスHP割合
		let b05per = optionList.boss_hp_w3_05/optionDatastore.getW3Sum(); // 5ボスHP割合
		let yestWrapDecimal = yestWrap - Math.floor(yestWrap); // 昨日周回の小数点以下を取得
		let outlookStartPoint = startBoss + 1; // 撃破数計算のボス指標
		let outlookDecimalCount = 0; // 少数部でどれだけ倒すか
		// ボスの撃破数を予測
		while(yestWrapDecimal > 0){
			switch (outlookStartPoint) { // 各ボスのHP分を減算
			  case 1:
				  yestWrapDecimal = yestWrapDecimal - b01per;
			    break;
			  case 2:
				  yestWrapDecimal = yestWrapDecimal - b02per;
			    break;
			  case 3:
				  yestWrapDecimal = yestWrapDecimal - b03per;
			    break;
			  case 4:
				  yestWrapDecimal = yestWrapDecimal - b04per;
			    break;
			  case 5:
				  yestWrapDecimal = yestWrapDecimal - b05per;
			    break;
			  default:
				  break;
			}
			outlookDecimalCount = outlookDecimalCount + 1; // 撃破数をカウントアップ
			outlookStartPoint = outlookStartPoint + 1; // ボス指標をカウントアップ
			if(outlookStartPoint > 5){
				outlookStartPoint = 1; // 1ボスに戻す
			}
		}

		return (Math.floor(yestWrap)*5) + outlookDecimalCount; // ボス撃破数予測
	}

	// ボス毎の必要凸数をカウント（３or４段階目だけ表示する）
	calc_requiredBossTotuCount(report){

		let optionList = optionDatastore.getOptionList();
		let requiredBossTotuCount = {};

		// 昨日と今日のレポートを結合
		let concatReport = this.yesterdayReport.concat(this.todayReport);

		// 現時点で３段階目突入していたら作動する
		let lastLocation = concatReport[concatReport.length-1].周回;
		if(lastLocation >= Number(optionList.w3_start_wrap)+1){
			// おっけー
		}else{
			return requiredBossTotuCount;
		}

		// 4週目の場合はそっちに切り替える
		let targetWrap = optionList.w3_start_wrap;
		if(lastLocation >= Number(optionList.w4_start_wrap)+1){
			targetWrap = optionList.w4_start_wrap;
		}

		requiredBossTotuCount[1] = 0;
		requiredBossTotuCount[2] = 0;
		requiredBossTotuCount[3] = 0;
		requiredBossTotuCount[4] = 0;
		requiredBossTotuCount[5] = 0;
		// w3or4レポートのみ抽出(現在週は除く)
		let calcTargetReport = concatReport.filter(function(_item, _index){
			if(_item.周回 >= targetWrap && _item.周回 < lastLocation) return true;
		});
		// ボスごとに凸数をカウントしていく
		$.each(calcTargetReport, function(i, v){
			if(v.LA == 1 || v.LA残 == 1){
				requiredBossTotuCount[v.ボス] = requiredBossTotuCount[v.ボス] + 0.5;
			}else{
				requiredBossTotuCount[v.ボス]++;
			}
		});
		// 何週分のレポートを処理したかを保存する
		let finishedLocation = lastLocation - calcTargetReport[0].周回;
		// 処理したレポート分でボス凸数を割る
		$.each(requiredBossTotuCount, function(i, v){
			requiredBossTotuCount[i] = requiredBossTotuCount[i] / finishedLocation;
		});

		requiredBossTotuCount[0] =
		+ requiredBossTotuCount[1]
		+ requiredBossTotuCount[2]
		+ requiredBossTotuCount[3]
		+ requiredBossTotuCount[4]
		+ requiredBossTotuCount[5];

		return requiredBossTotuCount;

	}

}