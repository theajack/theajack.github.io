(function(){
  var _t={
    jsonp: function(options) {
      if (!options.url) {
        throw new Error("Parameter error");
      }else{
        var callbackName = ('_jsonp' + Math.random()).replace(".", "").substring(0, 15);
        var head = _t.tag("head");
        options.data[_checkArg(options.callback, "callback")] = callbackName;
        var script = document.createElement('script');
        head.appendChild(script);
        window[callbackName] = function(a) {
          head.removeChild(script);
          clearTimeout(script.timer);
          window[callbackName] = null;
          if(a.constructor==String){
            a=JSON.parse(a);
          }
          options.success && options.success(a);
        };
        if (options.dataType != undefined && options.dataType.toUpperCase() == "JSON") {
          script.setAttribute("src", options.url + '?json=' + encodeURIComponent(JSON.stringify(options.data)))
        } else {
          script.setAttribute("src", options.url + '?' + _formatParams(options.data))
        }
        options.time = _checkArg(options.time, 5000);
        script.timer = setTimeout(function() {
          window[callbackName] = null;
          head.removeChild(script);
          options.timeout && options.timeout({
            message:( (!options.message)?"timeout":options.message)
          })
        }, options.time)
      }
    },
    cookie: function(a, b, d, e) {
      if (arguments.length == 1) {
        if (document.cookie.length > 0) {
          var f = document.cookie.indexOf(a + "=");
          if (f != -1) {
            f = f + a.length + 1;
            var g = document.cookie.indexOf(";", f);
            if (g == -1) g = document.cookie.length;
            return unescape(document.cookie.substring(f, g))
          }
        }
        return ""
      } else {
        if (b == null) {
          _t.cookie(a, "", -1)
        } else {
          var c = a + "=" + escape(b);
          if (d != undefined) {
            var h = new Date();
            h.setDate(h.getDate() + d);
            c += ";expires=" + h.toGMTString()
          }
          if (e != undefined) {
            if (e.constructor == Boolean) {
              if (e) {
                c += (";path=/")
              }
            } else {
              c += (";path=" + e)
            }
          }
          document.cookie = c;
          return a + "=" + b
        }
      }
    },id: function(a) {
      return document.getElementById(a)
    },
    tag: function(a) {
      return _checkSelect(document.getElementsByTagName(a))
    }
  }
  function stat(){
    var name;
    var ss=_t.tag("script");
    var cookie=_t.cookie("stat_mark");
    if(cookie==""){
      _t.cookie("stat_mark","true");
      cookie="false";
    }
    for(var i=0;i<ss.length;i++){
      if(ss[i].hasAttribute("name")){
        name=ss[i].getAttribute("name");
        break;
      }
    }
    //name属性    state_name     #statName  title
    if(typeof name=="undefined"){
      if(typeof stat_name=="undefined"){
        var s_n=_t.id("statName");
        if(s_n==null){
          name=_t.tag("title").innerText;
        }else{
          name=s_n.innerText;
        }
      }else{
        name=stat_name;
      }
    }
    _t.jsonp({
      url:"https://theajack.goho.co/stat.aspx",
      data:{type:"add",name:name,mark:cookie},
      success:function(data){},
      time:20000,
      timeout:function(err){},
      message:""
    });
  }
  function _checkArg(a, b) {
    return (a == undefined) ? b : a
  };
  function _checkSelect(b) {
    if (b.length == 1) {
      return b[0]
    }
    return b
  };
  function _formatParams(a) {
    var b = [];
    for (var c in a) {
      b.push(encodeURIComponent(c) + "=" + encodeURIComponent(a[c]))
    }
    return b.join("&")
  }
  stat();
})()
