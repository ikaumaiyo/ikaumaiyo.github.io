
const UNIT = 'unit';

class UnitDatastore{

	constructor(){
		this.unitList = this.load();
	}

	load(){
		let _unit = localStorage.getItem(UNIT);
		return JSON.parse(_unit) || [];
	}

	getUnitList(){
		return this.unitList;
	}

	levelUp(name) {

		let _targetUnit = this.unitList.filter(function(o){
			return o.name == name;
		});

		if(_targetUnit.length > 0){

			_targetUnit[0].level++;

			let _newUnitList = this.unitList.filter(function(o){
				return o.name != name;
			});

			_newUnitList.push(_targetUnit[0]);

			this.unitList = _newUnitList;

		}else{

			_targetUnit = {
					'name' : name,
					'level' : 2,
				};
			this.unitList.push(_targetUnit);

		}

		localStorage.setItem(UNIT, JSON.stringify(this.unitList));
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