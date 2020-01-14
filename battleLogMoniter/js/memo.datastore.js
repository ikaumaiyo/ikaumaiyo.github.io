const MEMO = 'tm_memo';
const memoList_adam = {
}
/**
 * 岸君のメモを保存するやつ 関数の引数はunixtime
 */
class MemoDatastore{

	constructor(priconeDate){
		if(priconeDate !== undefined){
			this.memosolt = priconeDate.getFullYear()+''+(priconeDate.getMonth() + 1)+''+priconeDate.getDate();
			this.memoList = this.load();
		}
	}

	load(){
		let _memoList = JSON.parse(localStorage.getItem(MEMO+this.memosolt));

		if(_memoList == null){
			// オプションが無かったら初期値を返す
			_memoList = {};
		}

		return _memoList;
	}

	reset(){
		localStorage.removeItem(MEMO+this.memosolt);
	}

	save(name, value){

		if(name === undefined || value === undefined || name == ''){
			return true;
		}

		this.memoList[name] = value;

		localStorage.setItem(MEMO+this.memosolt, JSON.stringify(this.memoList));
	}

	getMemo(name){
		if(this.memoList[name] === undefined){
			return '';
		}
		return this.memoList[name]
	}


}