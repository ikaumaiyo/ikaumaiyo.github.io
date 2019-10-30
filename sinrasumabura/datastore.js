
const UNIT = 'unitStatus';

class UnitStatusDatastore{

	constructor(){
		this.unitStatusList = this.load();
	}

	load(){
		let _unit = localStorage.getItem(UNIT);
		return JSON.parse(_unit) || [];
	}

	getUnitStatusList(){
		return this.unitStatusList;
	}

	levelUp(id) {

		let _targetUnit = this.unitStatusList.filter(function(o){
			return o.id == id;
		});

		if(_targetUnit.length > 0){

			_targetUnit[0].level++;

			let _newUnitStatusList = this.unitStatusList.filter(function(o){
				return o.id != id;
			});

			_newUnitStatusList.push(_targetUnit[0]);

			this.unitStatusList = _newUnitStatusList;

		}else{

			_targetUnit = {
					'id' : id,
					'level' : 2,
				};
			this.unitStatusList.push(_targetUnit);

		}

		localStorage.setItem(UNIT, JSON.stringify(this.unitStatusList));
	}

	insert(id) {

		let _targetUnit = this.unitStatusList.filter(function(o){
			return o.id == id;
		});

		if(_targetUnit.length == 0){

			_targetUnit = {
					'id' : id,
					'level' : 1,
				};
			this.unitStatusList.push(_targetUnit);

		}

		localStorage.setItem(UNIT, JSON.stringify(this.unitStatusList));
	}

	reset(){
		localStorage.removeItem(UNIT);
	}

}

const BOSS = 'bossStatus';

class BossStatusDatastore{

	constructor(){
		this.bossStatusList = this.load();
	}

	load(){
		let _unit = localStorage.getItem(BOSS);
		return JSON.parse(_unit) || [];
	}

	getBossStatusList(){
		return this.bossStatusList;
	}

	levelUp(id) {

		let _targetUnit = this.bossStatusList.filter(function(o){
			return o.id == id;
		});

		if(_targetUnit.length > 0){

			_targetUnit[0].level++;

			let _newBossStatusList = this.bossStatusList.filter(function(o){
				return o.id != id;
			});

			_newBossStatusList.push(_targetUnit[0]);

			this.bossStatusList = _newBossStatusList;

		}else{

			_targetUnit = {
					'id' : id,
					'level' : 2,
				};
			this.bossStatusList.push(_targetUnit);

		}

		localStorage.setItem(BOSS, JSON.stringify(this.bossStatusList));
	}

	insert(id) {

		let _targetUnit = this.bossStatusList.filter(function(o){
			return o.id == id;
		});

		if(_targetUnit.length == 0){

			_targetUnit = {
					'id' : id,
					'level' : 1,
				};
			this.bossStatusList.push(_targetUnit);

		}

		localStorage.setItem(BOSS, JSON.stringify(this.bossStatusList));
	}

	reset(){
		localStorage.removeItem(BOSS);
	}


}

const OPTION = 'option';
const VOLUME = 'volume';

class OptionDatastore{


	constructor(){
		this.optionList = this.load();
		this.saveOption();
	}

	load(){
		let _optionList = JSON.parse(localStorage.getItem(OPTION));

		if(_optionList == null){
			_optionList = {
					VOLUME : true,
				};

		}

		return _optionList;
	}

	saveOption(){
		localStorage.setItem(OPTION, JSON.stringify(this.optionList));
	}

	toggleVolume(){
		let _volume = this.getVolume();
		this.setVolume(!_volume);
	}
	getVolume(){
		return this.optionList.VOLUME;
	}
	setVolume(f){
		this.optionList.VOLUME = f;
		this.saveOption();
	}


}