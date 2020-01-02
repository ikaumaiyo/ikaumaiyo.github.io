const OPTION = 'tm_option';

class OptionDatastore{

	constructor(){
		this.optionList = this.load();
	}

	load(){
		let _optionList = JSON.parse(localStorage.getItem(OPTION));

		if(_optionList == null){
			_optionList = {
					boss_hp_w1_01 : 6000000,
					boss_hp_w1_02 : 8000000,
					boss_hp_w1_03 : 10000000,
					boss_hp_w1_04 : 12000000,
					boss_hp_w1_05 : 15000000,
					boss_hp_w2_01 : 6000000,
					boss_hp_w2_02 : 8000000,
					boss_hp_w2_03 : 10000000,
					boss_hp_w2_04 : 12000000,
					boss_hp_w2_05 : 15000000,
					boss_hp_w3_01 : 7000000,
					boss_hp_w3_02 : 9000000,
					boss_hp_w3_03 : 12000000,
					boss_hp_w3_04 : 14000000,
					boss_hp_w3_05 : 17000000,
				};
			localStorage.setItem(OPTION, JSON.stringify(_optionList));
		}
		return _optionList;
	}

	resetOption(){
		localStorage.removeItem(OPTION);
		this.load();
		this.saveOption();
	}

	saveOption(){
		let that = this;
		$.each(this.optionList, (i,v) => {
			that.optionList.i = $('#'+i).val();
		});
		localStorage.setItem(OPTION, JSON.stringify(this.optionList));
	}

	getOptionList(){
		return this.optionList;
	}
	getW1Sum(){
		this.optionList.boss_hp_w1_01 + this.optionList.boss_hp_w1_02 + this.optionList.boss_hp_w1_03 + this.optionList.boss_hp_w1_04 + this.optionList.boss_hp_w1_05;
	}
	getW2Sum(){
		this.optionList.boss_hp_w2_01 + this.optionList.boss_hp_w2_02 + this.optionList.boss_hp_w2_03 + this.optionList.boss_hp_w2_04 + this.optionList.boss_hp_w2_05;
	}
	getW3Sum(){
		this.optionList.boss_hp_w3_01 + this.optionList.boss_hp_w3_02 + this.optionList.boss_hp_w3_03 + this.optionList.boss_hp_w3_04 + this.optionList.boss_hp_w3_05;
	}


}