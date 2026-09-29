//////////////////////目安箱///////////////////////
function send_suggestion(sid, suggestion_text) {
    //var url = $.url(); // parse the current page URL
    //var path = (-1 == url.attr('host').indexOf("wahtcomu",0)) ? '' : '/animate/html';

    var url = location.pathname;
    var directory = url.split("/");
    if(directory[2]=='html') {
        // テスト環境
        var currentDirectory = "/animate/html/";
    } else if(-1 != location.hostname.indexOf("wahtcomu",0)) {
        // テスト環境
        var currentDirectory = "/animate/html/";
    } else {
        // 本番環境
        var currentDirectory = "/";
    }
    //alert(currentDirectory);exit;

    if(suggestion_text == 0){
    }else{
        $.get(currentDirectory + 'srv/send_suggestion.php?' + sid, {'suggestion_text' : suggestion_text}, function(data) {
        });
    }
}
