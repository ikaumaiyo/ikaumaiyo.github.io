class Analysis{

	constructor(report, member, priconeDate){

		/** 全凸レポート * */
		this.report = report;
		/** メンバー * */
		this.member = member;
		/** プリコネ日 * */
		this.priconeDate = priconeDate;
		console.log('report>'+this.report.length);
		console.log('member>'+this.member.length);

		// プリコネ日(START)をミリ秒に変換
		let startPriconeDate_Milli = Date.parse(this.priconeDate);
		// プリコネ日(END)をミリ秒に変換
		let endPriconeDate = new Date(this.priconeDate.getFullYear(), this.priconeDate.getMonth(), this.priconeDate.getDate()+1,
				this.priconeDate.getHours(), this.priconeDate.getMinutes(), this.priconeDate.getSeconds());
		let endPriconeDate_Milli = Date.parse(endPriconeDate);
		// プリコネ日(START_YESTERDAY)をミリ秒に変換
		let startYestPriconeDate = new Date(this.priconeDate.getFullYear(), this.priconeDate.getMonth(), this.priconeDate.getDate()-1,
				this.priconeDate.getHours(), this.priconeDate.getMinutes(), this.priconeDate.getSeconds());
		let startYestPriconeDate_Milli = Date.parse(startYestPriconeDate);

		/** 今日分の凸レポート * */
		this.todayReport = this.report.filter(function(item, index){
			if(Date.parse(item.タイムスタンプ) >= startPriconeDate_Milli
					&& Date.parse(item.タイムスタンプ) < endPriconeDate_Milli) {
				return true;
			}
		});
		/** 前日分の凸レポート * */
		this.yesterdayReport = this.report.filter(function(item, index){
			if(Date.parse(item.タイムスタンプ) >= startYestPriconeDate_Milli
					&& Date.parse(item.タイムスタンプ) < startPriconeDate_Milli) {
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

		// プリコネ日を表示
		this.renderTargetDate();

		/** 初期化 **/
		// 凸数
		$('#render-battleSuccessful').find('.totuNum').html('');
		$('#render-battleSuccessful>.perProgress>.successful').css('width' ,0+'%');
		$('#render-battleSuccessful').find('.perNum').html('( 消化率: '+0+'％ )');
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

		/** 昨日と今日のデータがあれば分析開始 **/
		if(!(this.todayReport.length == 0 && this.yesterdayReport.length == 0)){
			// 凸完了数を表示
			this.renderBattleSuccessful();
			// 凸チャートを表示
			this.renderBattleChart();
			// ボス状態を表示
			this.renderBattleState();
			// 岸君の凸状態を表示
			this.renderKisiState();
			// 岸君の凸傾向を表示
			// this.renderKisiTrend();


			return true;
		}else{
			return false;
		}
	}

	/** プリコネ日を表示 * */
	renderTargetDate(){
		let priconeViewDate = 'プリコネ日：'+this.priconeDate.getFullYear() + '-' + ("0" + (this.priconeDate.getMonth() + 1)).slice(-2) + '-' + ("0" + this.priconeDate.getDate()).slice(-2);
		// プリコネ日をセット
		$('#render-targetDate').find('span').html(priconeViewDate);
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
		$('#render-battleSuccessful').find('.perNum').html('( 消化率: '+Math.round(totuNum/90*100)+'％ )');

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

		// 今日のダメージ
		let todayDmg = this.todayReport.reduce((prev, item) => prev + item.ダメージ ,0);
		// 今日の周回数
		let todayWrap = todayDmg / optionDatastore.getW3Sum();
		// 昨日のダメージ
		let yesterdayDmg = this.yesterdayReport.reduce((prev, item) => prev + item.ダメージ ,0);
		// 昨日の周回数
		let yestWrap = yesterdayDmg / optionDatastore.getW3Sum();

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
		}

		// 着地予測の終端を計算
		let outlookBossCount = this.renderBattleState_calc_outlookBossCount(yestWrap,startBoss);

		// ボス状態をレンダ
		let firstFlg = 1; // 初回ループフラグ
		let outlookFlg = 0; // 着地予測割り込みフラグ
		while(true){
			if(outlookBossCount < 0 && startWrap > nowWrap){
				break;
			}
			let bossStateWrapLine = $('<div></div>').attr('class','bossStateWrapLine render');
			$('<div></div>').attr('class','emptyBox render').html(startWrap).appendTo(bossStateWrapLine); // レンダ用のwrapボックス

			for (  var i = 1;  i < 6;  i++  ) {

				let nowStateDiv = $('<div></div>').attr('class','nowState render');
				// 現在地の場合はコメント追加
				if(startWrap == nowWrap && i == nowBoss){
					nowStateDiv.html('現在地');
				}

				// 着地予測の割り込み処理
				if(outlookBossCount == 0){
					outlookFlg  = 1; // 割り込み
					if(firstFlg == 1 && i < startBoss){
						$('<div></div>').attr('class','emptyBox render').appendTo(bossStateWrapLine);
					}else if(startWrap <= nowWrap && i <= nowBoss){
						// 現在地の場合は譲る
						nowStateDiv.appendTo(bossStateWrapLine);
					}else{
						// 他に何もなければ着地予測を出す
						$('<div></div>').attr('class','outlook render').html('着地予測').appendTo(bossStateWrapLine);
					}
				}
				outlookBossCount = outlookBossCount - 1;

				// 着地予測に割り込まれなかった場合のみ現在ボスのレンダ
				if(nowWrap == 0 && outlookFlg == 0){
					// その日のデータが無い場合
					$('<div></div>').attr('class','emptyBox render').appendTo(bossStateWrapLine);
					if(firstFlg == 1 && i < this.yesterdayReport[this.yesterdayReport.length-1].ボス){
						outlookBossCount = outlookBossCount + 1;
					}
				}else if(outlookFlg == 0){
					// その日のデータが有る場合
					if(firstFlg == 1){ // 初回ループ
						if(i < startBoss){
							$('<div></div>').attr('class','emptyBox render').appendTo(bossStateWrapLine);
							outlookBossCount = outlookBossCount + 1;
						}else{
							nowStateDiv.appendTo(bossStateWrapLine);
						}
					}
					if(firstFlg == 0){ // 二回目以降ループ
						if(startWrap <= nowWrap && !(startWrap == nowWrap && i > nowBoss)){
							nowStateDiv.appendTo(bossStateWrapLine);
						}else{
							$('<div></div>').attr('class','emptyBox render').appendTo(bossStateWrapLine);
						}
					}
				}
				outlookFlg = 0;
			}

			bossStateWrapLine.appendTo('#render-bossState');
			firstFlg = 0;
			startWrap = startWrap + 1; // ループのスタート周をカウントアップ

		}
	}
	/** ボス状態を表示 - 着地予測の終端を計算 * */
	renderBattleState_calc_outlookBossCount(yestWrap,startBoss){
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

	/** 岸君の凸状況 **/
	renderKisiState(){

		if(this.member.length == 0){
			return false;
		}

		// 岸君テーブル
		let kisiStateTable = $('#render-kisiState').find('#kisiStateTable');

		let that = this;

		$.each(this.member, function(index, val){

			let tr = $('<tr></tr>').attr('class','render');

			$('<td></td>').html(val.プリコネーム).appendTo(tr);
			$('<td></td>').html(val.凸数).appendTo(tr);
			let totuMater = $('<td></td>').html(val.凸数);
			if(val.凸数 >= 3){
				tr.addClass('finished');
			}
			for(var i=0;i<val.凸数-0.5;i++){
				$('<div></div>').attr('class','stateBox').appendTo(totuMater);
			}
			if(val.凸数 - Math.floor(val.凸数) > 0){
				$('<div></div>').attr('class','stateBox half').appendTo(totuMater);
			}
			totuMater.appendTo(tr);
			if(val.魔法凸数 > 0){
				$('<td></td>').html('✔').appendTo(tr);
				tr.addClass('magicUsed');
			}else{
				$('<td></td>').appendTo(tr);
			}
			let kisiTotuReport = that.todayReport.filter(function(_item, _index){
				if(_item.プリコネーム == val.プリコネーム
						&& _item.ダメージ > 2000000){
					return true;
				}
			});
			for(var i = 1; i < 6; i++){
				let _ktr = kisiTotuReport.filter(function(o){
					return o.ボス == i;
				});
				if(_ktr.length > 0){
					let stateTd = $('<td></td>').html(1);
					let stateDiv = $('<div></div>').attr('class','stateBox center');
					stateDiv.appendTo(stateTd);
					stateTd.appendTo(tr);
				}else{
					$('<td></td>').html(0).appendTo(tr);
				}
			}
			let kisiTotuAllReport = that.report.filter(function(_item, _index){
				if(_item.プリコネーム == val.プリコネーム
						&& _item.ダメージ > 2000000){
					return true;
				}
			});
			for(var i = 1; i < 6; i++){
				let _ktr = kisiTotuAllReport.filter(function(o){
					return o.ボス == i;
				});
				if(_ktr.length > 0){
					let stateTd = $('<td></td>').html(_ktr.length/10);
					let stateDiv = $('<div></div>').attr('class','stateBox center trend').css('opacity',_ktr.length/10);
					stateDiv.appendTo(stateTd);
					stateTd.appendTo(tr);
				}else{
					$('<td></td>').html(0).appendTo(tr);
				}
			}

			tr.appendTo(kisiStateTable);

		});

		$(".tablesorter").trigger("update");

	}

	/** 岸君の凸傾向【廃止（凸状況に統合）】 **/
	renderKisiTrend(){

		if(this.member.length == 0){
			return false;
		}

		// 岸君テーブル
		let kisiTrendTable = $('#render-kisiTrend').find('#kisiTrendTable');

		let that = this;

		$.each(this.member, function(index, val){

			let tr = $('<tr></tr>').attr('class','render');

			$('<td></td>').html(val.プリコネーム).appendTo(tr);

			let kisiTotuReport = that.report.filter(function(_item, _index){
				if(_item.プリコネーム == val.プリコネーム
						&& _item.ダメージ > 2000000){
					return true;
				}
			});
			for(var i = 1; i < 6; i++){
				let _ktr = kisiTotuReport.filter(function(o){
					return o.ボス == i;
				});
				if(_ktr.length > 0){
					let stateTd = $('<td></td>').html(_ktr.length/10);
					let stateDiv = $('<div></div>').attr('class','stateBox center').css('opacity',_ktr.length/10);
					stateDiv.appendTo(stateTd);
					stateTd.appendTo(tr);
				}else{
					$('<td></td>').html(0).appendTo(tr);
				}
			}


			console.log('tr>'+tr);
			tr.appendTo(kisiTrendTable);

		});

		$(".tablesorter").trigger("update");

	}

}