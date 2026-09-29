var GSSA = GSSA || (function () {
  var params = {};
  var endpoint_url = "https://log.gs3.goo.ne.jp/animate/";

  var generateId = function() {
    var str = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < 32; i++) {
      str += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    str += "-";
    str += new Date().getTime().toString(16);
    return str;
  };

  var buildQuery = function(obj) {
    return Object.keys(obj).map(function(key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    }).join("&");
  };

  var getCookie = function (name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  };

  var send = function() {
    params["url"] = window.location.href;
    params["ref"] = document.referrer;
    var id = getCookie("_gssa");
    if (!id) {
      id = generateId();
      document.cookie = "_gssa=" + id + "; path=/; expires=Tue, 19 Jan 2038 03:14:07 GMT";
    }
    params["id"] = id;
    var sid = getCookie("_gssas");
    if(!sid) {
      sid = id + "-" + new Date().getTime().toString(16);
    }
    document.cookie = "_gssas=" + sid + "; path=/; max-age=1800";
    params["sid"] = sid;
    params["t"] = new Date().getTime();

    var query = buildQuery(params);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", endpoint_url + "?" + query, true);
    xhr.withCredentials = true;
    xhr.send(null);
    params = {};
  };

  var set = function(key, value) {
    params[key] = value;
  };

  return {
    send: send,
    set: set
  }
})();
