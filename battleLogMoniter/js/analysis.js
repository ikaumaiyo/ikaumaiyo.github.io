class Analysis{

	constructor(report, priconeDate){

		/** 全凸レポート **/
		this.report = report;
		/** プリコネ日 **/
		this.priconeDate = priconeDate;

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

		/** 今日分の凸レポート **/
		this.todayReport = this.report.filter(function(item, index){
			if(Date.parse(item.タイムスタンプ) >= startPriconeDate_Milli
					&& Date.parse(item.タイムスタンプ) < endPriconeDate_Milli) {
				return true;
			}
		});

		/** 凸チャート **/
		this.totuChart;
	}

	/** インスタンス破棄 **/
	destroy() {
		console.log('this.totuChart');
		console.log(this.totuChart);
		if(this.totuChart){
			this.totuChart.destroy();
			console.log('インスタンス破棄')
		}
	}

	/** レンダコントローラ * */
	render(){
		// プリコネ日を表示
		this.renderTargetDate();
		// 凸完了数を表示
		this.renderBattleSuccessful();
		// 凸チャートを表示
		this.renderBattleChart();
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
		$('#render-battleSuccessful').find('.perNum').html('( 消化率: '+totuNum/90*100+'％ )');

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

	}

}