(function(){

    var js = ["js/TouchSlide.1.1.js","js/fastclick.js","js/iscroll-probe.js","js/comm.js","js/template.js","js/query_str.js"],
        web = {
            css : [],
            js : ["js/jdsy_1.0.0.js"]
        },
        app = {
            css : ["css/mobile.css"],
            js : ["js/jdsy_1.0.1.js"]
        };

    var fun = {
        isapp : function(){

            return false;
            //var ua = navigator.userAgent;
            //return ua.indexOf("B2B_APP") >=0 ? true : false;
        },
        add_css : function(css_arr){
            for(var i=0; i<css_arr.length; i++){
                $('<link rel="stylesheet" type="text/css" href="'+ css_arr[i] +'" />').appendTo($("head"));
            }

        },
        add_js : function(js_arr){
            for(var i=0; i<js_arr.length; i++){
                $('<script type="text/javascript" src="'+ js_arr[i] +'" />').appendTo($("head"));
            }
        },
        get_query : function (src,name) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = src.substr(src.indexOf("?")+1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
        }
    };
    window.fun = fun;
    fun.add_js(js);

    if(fun.isapp()){
        fun.add_css(app.css);
        fun.add_js(app.js);
    }
    else{
        fun.add_css(web.css);
        fun.add_js(web.js);
    }

    var page_param = fun.get_query($("script").eq(1).attr("src"),"pg");
    fun.add_js(["js/"+page_param+"_fun.js"]);
    $("<meta http-equiv='pragma' content='no-cache'>").appendTo($("head"));
    $(document.body).ready(function(){})

    /*if(site.name && site.name != undefined) {
        $("title").html(site.name);
        $(document.body).ready(function () {
            $(".site_name").html(site.name);
            $(".site_url").html(site.url);
        });
    }*/

})();




