var pos = [];
  var change=false, select, timer;
 
  //配列posの番号からX座標を返す関数
  function posX(n){
    return n % 6 * -100;
  }
  //配列posの番号からY座標を返す関数
  function posY(n){
    return Math.floor(n / 6) * -100;
  }
  //配列posの位置に移動させる関数
  function sortArr(){
    for(i=0; i<24; i++) {
      $("#puzzle li#"+i).css({
        "left" : -posX(pos[i]) + "px ",
        "top" : -posY(pos[i]) + "px"
      });
    }
  }
  //配列のシャッフル
  function shuffle(array) {
    var random = array.map(Math.random);
    array.sort(function(a, b) {
      return random[a] - random[b];
    });
  }
  //タイマー処理
  function setTimer() {
      var i = 0;
      timer = setInterval(function(){
        i++;
        $("#time").text(i + "秒経過");
      },1000);
  }
  //クリアー判定
  function goal(){
    var goal = true;
    for(i=0; i<24; i++) {
      if(pos[i] != i) {
        goal = false;
      }
    }
    if(goal) {
      clearInterval(timer);
      $("#again").show();
    }
  }
 
$(function(){
 
  //liタグの生成
  for(i=0; i<24; i++) {
    pos[i] = i;
    $("<li id='" + i + "'></li>").css( "background-position", posX(i) + "px " + posY(i) + "px").appendTo($("#puzzle"));
  }
  sortArr();
 
  //スタートボタンクリック
  $("#start").click(function(){
    $(this).remove();	//スタートボタンを削除
    $("#block").remove();	//div#blockの削除
    shuffle(pos);	//配列posの中身をシャッフル
    sortArr();	//配列posの中身に沿ってピースを並び替え
    $("#time").show();	//タイマーの表示
    setTimer();	//タイマーのスタート
  })
 
  //選択したピースの入れ替え
  $("#puzzle li").click(function (){
    if(!change) {	//1枚目のピース選択時の処理
      $(this).fadeTo(0,0.5).css("border","2px solid #ff0");
      select = $(this).attr("id");
      change = true;
    } else {	//2枚目のピース選択時の処理
      $("#puzzle li#" + select).fadeTo(0,1).css("border","none");
      var id = $(this).attr("id");
      var replace = pos[select];
      pos[select] =  pos[id];
      pos[id] = replace;
      sortArr();
      change = false;
      goal();
    }
  });
});
