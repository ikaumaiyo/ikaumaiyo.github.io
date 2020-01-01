class Analysis{

	constructor(report, priconeDate){
		this.report = report;
		this.priconeDate = priconeDate;
	}

	/** レンダコントローラ **/
	render(){
		this.renderTargetDate();
		this.renderBattleSuccessful();
	}

	/** プリコネ日を表示 * */
	renderTargetDate(){

		// appendする要素を生成
		let div = $("<div></div>");
		div.attr('id', 'render-targetDate');

		// プリコネ日をセット
		div.html('プリコネ日：'+this.priconeDate.getFullYear() + '-' + ("0" + (this.priconeDate.getMonth() + 1)).slice(-2) + '-' + ("0" + this.priconeDate.getDate()).slice(-2));

		// レンダリング
		$('#analysis').append(div);


	}

	/** 凸完了数を表示 * */
	renderBattleSuccessful(){

		// appendする要素を生成
		let div = $("<div></div>");
		div.attr('id', 'render-battleSuccessful');

		// プリコネ日(START)をミリ秒に変換
		let startPriconeDate_Milli = Date.parse(this.priconeDate);

		// プリコネ日(END)をミリ秒に変換
		let endPriconeDate = new Date(this.priconeDate.getFullYear(), this.priconeDate.getMonth(), this.priconeDate.getDate()+1,
				this.priconeDate.getHours(), this.priconeDate.getMinutes(), this.priconeDate.getSeconds());
		let endPriconeDate_Milli = Date.parse(endPriconeDate);


		console.log(this.priconeDate);
		console.log(endPriconeDate);

		// 今日分の凸レポートを生成
		let todayReport = this.report.filter(function(item, index){
			if(Date.parse(item.タイムスタンプ) >= startPriconeDate_Milli
					&& Date.parse(item.タイムスタンプ) < endPriconeDate_Milli) {
				return true;
			}
		});
		console.log(todayReport.length);

		// 凸数を取得
		let totuNum = 0;
		$.each(todayReport, function(i, v){

			console.log(v.プリコネーム);
			console.log(v.LA残);
			if(v.LA残 == 1 || v.LA == 1 ){
				totuNum = totuNum + 0.5;
			}else{
				totuNum = totuNum + 1;
			}

		});

		// 凸数をセット
		div.html('凸済：'+totuNum + ' / 90 (消化率: '+totuNum/90*100+'％	)');

		// レンダリング
		$('#analysis').append(div);


	}

}