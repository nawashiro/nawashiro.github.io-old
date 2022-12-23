$(function () {
  $(".hd-sm-3").hide();
  $(".closeico").hide();
  //メニューを表示/非表示するフラグ
  menu_flg = 0;
  $(".menubtn").click(function () {
    if (menu_flg == 0) {
      menu_flg = 1;
      $(".menuico").fadeOut();
      $(".closeico").fadeIn();
    } else {
      menu_flg = 0;
      $(".menuico").fadeIn();
      $(".closeico").fadeOut();
    }
    $(".hd-sm-3").slideToggle(300, "swing");
  });
});
