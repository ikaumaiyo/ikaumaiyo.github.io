const OPTION = 'tm_option';
const optionList_adam = {
		uid : '',
		pwd : '',
		exec_env_param : 1,
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
		boss_hp_w3_03 : 13000000,
		boss_hp_w3_04 : 15000000,
		boss_hp_w3_05 : 20000000,
		w1_start_wrap : 1,
		w2_start_wrap : 4,
		w3_start_wrap : 11,
}

class OptionDatastore{

	constructor(){
		this.optionList = this.load();
	}

	load(){
		let _optionList = JSON.parse(localStorage.getItem(OPTION));

		if(_optionList == null){
			// オプションが無かったら初期設定登録
			_optionList = optionList_adam;
			localStorage.setItem(OPTION, JSON.stringify(_optionList));
		}else{
			$.each(_optionList, (i,v) => {
				optionList_adam[i] = v;
			});
			_optionList = optionList_adam;
			localStorage.setItem(OPTION, JSON.stringify(_optionList));
		}

		return _optionList;
	}

	reset(){
		localStorage.removeItem(OPTION);
		location.reload();
	}

	save(){
		let that = this;
		$.each(this.optionList, (i,v) => {
			that.optionList.i = $('#'+i).val();
		});
		localStorage.setItem(OPTION, JSON.stringify(this.optionList));
		this.load();
		location.reload();
	}

	getOptionList(){
		return this.optionList;
	}
	getW1Sum(){
		return this.optionList.boss_hp_w1_01 + this.optionList.boss_hp_w1_02 + this.optionList.boss_hp_w1_03 + this.optionList.boss_hp_w1_04 + this.optionList.boss_hp_w1_05;
	}
	getW2Sum(){
		return this.optionList.boss_hp_w2_01 + this.optionList.boss_hp_w2_02 + this.optionList.boss_hp_w2_03 + this.optionList.boss_hp_w2_04 + this.optionList.boss_hp_w2_05;
	}
	getW3Sum(){
		return Number(this.optionList.boss_hp_w3_01) + Number(this.optionList.boss_hp_w3_02) + Number(this.optionList.boss_hp_w3_03) + Number(this.optionList.boss_hp_w3_04) + Number(this.optionList.boss_hp_w3_05);
	}


}