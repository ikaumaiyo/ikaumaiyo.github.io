class Analysis{

	constructor(report){
		this.report = report;
	}

	render(){
		console.log(this.report.length);
		var b = Date.parse(this.report[0].タイムスタンプ) ;


		$('#analysis').html(b);

	}

}