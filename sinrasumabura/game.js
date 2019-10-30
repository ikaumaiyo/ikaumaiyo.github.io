class Game{


	constructor(unitId, bossId){

		this.unitId = unitId;
		this.bossId = bossId;

		let that = this;

		this.nowPlayerHp;
		this.nowBossHp;

		this.HP_PER_MAX = 100;

		// プレイヤー情報
		this._unit = UNIT_LIST.filter(function(o){
			return o.id == that.unitId;
		});
		this._unitStatusList = usds.getUnitStatusList();

		this._unitStatus = this._unitStatusList.filter(function(o){
			return o.id == that.unitId;
		});
		if(this._unitStatus.length == 0){
			// 新規プレイヤーの場合はセーブデータ登録
			usds.insert(this.unitId);
			usds.load();
			this._unitStatusList = usds.getUnitStatusList();
			this._unitStatus = this._unitStatusList.filter(function(o){
				return o.id == that.unitId;
			});
		}

		// ボス情報
		this._boss = BOSS_LIST.filter(function(o){
			return o.id == that.bossId;
		});
		this._bossStatusList = bsds.getBossStatusList();
		console.table('asdwa');
		console.table(this._bossStatusList);
		this._bossStatus = this._bossStatusList.filter(function(o){
			return o.id == that.bossId;
		});
		if(this._bossStatus.length == 0){
			// 新規プレイヤーの場合はセーブデータ登録
			bsds.insert(this.bossId);
			bsds.load();
			this._bossStatusList = bsds.getBossStatusList();
			this._bossStatus = this._bossStatusList.filter(function(o){
				return o.id == that.bossId;
			});
		}

	}


	run(){

		// 画像読み込み
		$('.unitImg.player').show();
		$('.unitImg.boss').show();
		$('.unitImg.player').css('background-image','url(img/'+this.unitId+'.png)');
		$('.unitImg.boss').css('background-image','url(img/boss'+this.bossId+'.png)');

		// 名前読み込み
		$('.status.player>.name').html(this._unit[0].name);
		$('.status.boss>.name').html(this._boss[0].name);

		// レベル読み込み
		let _playerLevel = 1;
		if(this._unitStatus.length > 0){
			_playerLevel = this._unitStatus[0].level;
		}
		let _bossLevel = 1;
		if(this._bossStatus.length > 0){
			_bossLevel = this._bossStatus[0].level;
		}
		$('.status.player>.level>span').html(_playerLevel);
		$('.status.boss>.level>span').html(_bossLevel);

		// HP読み込み
		$('.status.player>.hp>meter').val(this.HP_PER_MAX);
		$('.status.boss>.hp>meter').val(this.HP_PER_MAX);

		// HPカウント読み込み
		let _playerHp = this.calcHp(this._unit[0].hp, this._unitStatus[0].level);
		let _bossHp = this.calcHp(this._boss[0].hp, this._bossStatus[0].level);

		$('.status.player>.hpPer>span').html(_playerHp+' / '+_playerHp);
		$('.status.boss>.hpPer>span').html(_bossHp+' / '+_bossHp);

		this.nowPlayerHp = _playerHp;
		this.nowBossHp = _bossHp;

		// コマンド読み込み
		let _fightElm = $('.commandArea>.fight>ul');
		let _c0 = ATK_LIST.filter(function(o){
			return o.id == '00';
		});
		// --初期化
		_fightElm.find('.c1').html(_c0[0].name);
		_fightElm.find('.c1').data('atk-id',_c0[0].id);
		_fightElm.find('.c2').html(_c0[0].name);
		_fightElm.find('.c2').data('atk-id',_c0[0].id);
		_fightElm.find('.c3').html(_c0[0].name);
		_fightElm.find('.c3').data('atk-id',_c0[0].id);
		_fightElm.find('.c4').html(_c0[0].name);
		_fightElm.find('.c4').data('atk-id',_c0[0].id);
		// --共通
		let _c1 = ATK_LIST.filter(function(o){
			return o.id == '01';
		});
		_fightElm.find('.c1').html(_c1[0].name);
		_fightElm.find('.c1').data('atk-id',_c1[0].id);
		// --専用わざ
		// ----シアン
		if(this.unitId == 'sian' && this._unitStatus[0].level > 5){
			let _c2 = ATK_LIST.filter(function(o){
				return o.id == '02';
			});
			_fightElm.find('.c2').html(_c2[0].name);
			_fightElm.find('.c2').data('atk-id',_c2[0].id);
		}
		// ----シロン
		if(this.unitId == 'siron' && this._unitStatus[0].level > 5){
			let _c2 = ATK_LIST.filter(function(o){
				return o.id == '03';
			});
			_fightElm.find('.c2').html(_c2[0].name);
			_fightElm.find('.c2').data('atk-id',_c2[0].id);
		}


	}

	calcHp(hp,level){
		return hp * level;
	}

	calcAtk(atk,level,str){
		return atk * level * str;
	}
	calcDmgResult(hp,dmg){
		if(hp-dmg>0){
			return hp-dmg;
		}else{
			return 0;
		}
	}

	battle(atkId){
		$('body').css('pointer-events', 'none');


		// わざ情報取得
		let _atk = ATK_LIST.filter(function(o){
			return o.id == atkId;
		});

		// HPカウント読み込み
		let _playerHp = this.calcHp(this._unit[0].hp, this._unitStatus[0].level);
		let _bossHp = this.calcHp(this._boss[0].hp, this._bossStatus[0].level);


		//
		this.nowPlayerHp;
		this.nowBossHp;

		// プレイヤーアタック

		setTimeout(() => {
			$('.sound-file' + '.atk01')[0].play();

			$('.unitArea.boss').effect('shake', {
				direction : 'left',
				distance : 15,
				duration : 50
			}, 150);

			let _playerAtkDamage = this.calcAtk(this._unit[0].atk,this._unitStatus[0].level,_atk[0].str);
			$('.status.boss>.hpPer>span').html(this.calcDmgResult(this.nowBossHp,_playerAtkDamage)+' / '+_bossHp);

			this.nowBossHp = this.calcDmgResult(this.nowBossHp,_playerAtkDamage);

			$('.status.boss>.hp>meter').val(this.nowBossHp/_bossHp*100);
		},
		10);


		// ボスアタック
		setTimeout(() => {

			if(this.nowBossHp != 0){

				$('.sound-file' + '.atk01')[0].play();
				$('.unitArea.player').effect('shake', {
					direction : 'left',
					distance : 15,
					duration : 50
				}, 150);

				let _bossAtkDamage = this.calcAtk(this._boss[0].atk,this._bossStatus[0].level,1);
				$('.status.player>.hpPer>span').html(this.calcDmgResult(this.nowPlayerHp,_bossAtkDamage)+' / '+_playerHp);

				this.nowPlayerHp = this.calcDmgResult(this.nowPlayerHp,_bossAtkDamage);

				$('.status.player>.hp>meter').val(this.nowPlayerHp/_playerHp*100);

			}
		},
		800)


		setTimeout(() => {
			// リザルト判定
			if(this.nowBossHp == 0){
				// win
				$('.unitImg.boss').effect('explode',{mode:'toggle'},800);
				usds.levelUp(this.unitId);
				bsds.levelUp(this.bossId);
				$('.sound-file' + '.win')[0].play();
				dialogShowWin();


			}
			if(this.nowPlayerHp == 0){
				// lose
				$('.unitImg.player').effect('explode',{mode:'toggle'},800);
				usds.levelUp(this.unitId);
				dialogShowLose();

			}



			$('body').css('pointer-events', 'auto');
		},
		1000);

	}



}



$(document).ready(function() {

	$('.commandArea>.fight>ul>li').on('click', function(e) {

		if($(this).data('atk-id') != '00'){
			game.battle($(this).data('atk-id'));
		}

	});


	$('#dialog').on('click', function(e) {
		$(this).hide();
		contentsToggle();

	});


});


function dialogHide() {
    $('#dialog').hide();
}
function dialogShowWin() {
	$('#dialogContent').html('WIN');
    $('#dialog').show();

}
function dialogShowLose() {
	$('#dialogContent').html('LOSE');
    $('#dialog').show();
}







