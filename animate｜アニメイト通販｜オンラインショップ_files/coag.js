$(document).ready(function() {
  var cac = $.cookie('COAG_ANIMATE');
  if(!cac){ $('#cookie_agree').show();}else{ $('#cookie_agree').html('');}
});
$(function() {
    $('#cookie_agree button').on('click',function(){
      $.cookie('COAG_ANIMATE', 'TRUE',{expires:365,path:'/'});
      $('#cookie_agree').html('')
    });
});