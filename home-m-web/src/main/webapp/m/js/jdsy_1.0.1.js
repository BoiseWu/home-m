/**
 * Created by liuqingmin on 16/1/15.
 */
;
(function() {
    if (window.JDSY) {
        return

    }

    var JSBridge;
    var readyCallback;
    function init(config) {
        JSBridge = config.bridge;
        JSBridge.init(function(msg, callback) {

        });
        readyCallback();
    }

    function ready(fn) {
        readyCallback = fn;
    }

    var fn = {

    };

    var session = {

        getValue: function(keyname, successCallback) {
            JSBridge.send({
                type : 'getValue',
                name : keyname
            }, function(result) {
                successCallback(result);
            });
        },
        setValue : function(keyname, value, successCallback) {
            JSBridge.send({
                type : 'setValue',
                name : keyname,
                value : value
            }, function(result) {
                if (successCallback) {
                    successCallback(result);
                }
            });
        },

    };

    var app = {
        alert : function(data) {
            JSBridge.send({
                type : 'alert',
                msg : data.msg||data,
                showType : data.type,
            });
        },
        setTitle : function(data) {
            JSBridge.send({
                type : 'title',
                name: data.name == undefined ? "" : data.name,
                place:data.place == undefined ? "" : data.place,
                imageName:data.imageName == undefined ? "" : data.imageName
            });
        },

        confirm : function(data, successCallback,cancelCallback) {
            JSBridge.send({
                type : 'confirm',
                title : data.title,
            }, function(result) {

                if(result.suc==1)
                    successCallback();
                else
                    cancelCallback();
            });
        },
        openWin : function(fileName, config) {

            JSBridge.send({
                type : 'openNewWin',
                config : config
            },function(result) {
                //successCallback(result);
            });

        },
        closeWin : function(config) {
            JSBridge.send({
                type : 'closeWin',
                config : config
            },function(result) {
                //successCallback(result);
            });
        },
        config : function(config) { //titlebar
            JSBridge.send({
                type : 'config',
                config : config
            },function(result) {
                //successCallback(result);
            });

        },
        gps : function(successCallback) {
            JSBridge.send({
                type : 'gps'
            },function(result) {
                successCallback(result);

            });

        },
        getPhoto : function(data, successCallback) {
            JSBridge.send({
                type : 'getPhoto',
                config : data
            }, function(result) {
                successCallback(result);
            });
        },

        loginOut : function() {
            JSBridge.send({
                type : 'loginOut'
            },function(result) {

            });
        },

        reload : function() {
            JSBridge.send({
                type : 'reload'
            },function(result) {

            });
        },

        returnHomePage : function() {
            JSBridge.send({
                type : 'returnHomePage'
            },function(result) {

            });
        }

    };

    var util = {
        /*

         setting demo

         {
         type: "get",
         url:query_url.index_data,
         data : {
         ...
         },
         hideLoading : true,
         failureCallback :JDSY.defaultHttpFailureCallback,
         successCallback :index_fun.page_ini

         }

         */

        ajax : function(settings){

            settings.type = (settings.type && settings.type == "post")?"post":"get";

            JSBridge.send({
                type : settings.type,
                url : settings.url,
                data : settings.data,
                hide : settings.hideLoading==false?false:true,
            }, function(result) {
                if (result != undefined && result.code != undefined) {
                    settings.successCallback(result);
                    return;
                }
                if (settings.failureCallback != undefined && settings.failureCallback != null) {
                    settings.failureCallback();
                }
            });

        },

        post : function(url, params, successCallback, failureCallback, hideLoading) {
            JDSY.util.ajax({
                type : 'post',
                url: url,
                data : params,
                hideLoading : hideLoading,
                successCallback :successCallback,
                failureCallback :failureCallback,

            });
        },

        get : function(url, params, successCallback , failureCallback, hideLoading) {
            JDSY.util.ajax({
                type : 'get',
                url:url,
                data : params,
                hideLoading : hideLoading,
                successCallback :successCallback,
                failureCallback :failureCallback,

            });
        },
        initData : function(successCallback) {

            JSBridge.callHandler('data', null, function(responseData,responseCallback) {
                successCallback(responseData);
            });

        },
        viewWillAppear : function(successCallback) {

            JSBridge.registerHandler('viewWillAppear', function(responseData,responseCallback) {
                successCallback(responseData);
            });

        },

        viewRefresh : function(successCallback) {
            JSBridge.registerHandler('viewRefresh', function(responseData,responseCallback) {
                successCallback(responseData);
                if (typeof(responseCallback) != 'undefined') {
                    responseCallback(responseData);
                }
            });
        },
        share : function(data) {
            JSBridge.callHandler('share', data, function(responseData,responseCallback) {
                successCallback(responseData);
            });
        }

    };


    function parseQueryString(url) {
        var reg_url = /^[^\?]+\?([\w\W]+)$/,
            reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
            arr_url = reg_url.exec(url),
            ret = {};
        ;
        if (arr_url && arr_url[1]) {
            var str_para = arr_url[1], result;
            while ((result = reg_para.exec(str_para)) != null) {
                ret[result[1]] = result[2];
            }
        }
        return ret;
    }

    function open_win(win_names,win_tit,url){
        JDSY.open_win_with_data(win_names,win_tit,url,{});
    }

    function open_win_with_data(win_names,win_tit,url,init_data,returnRank) {
        var hideTitleBar = false;
        if (
            url.indexOf("search.html" ) >= 0 ||
            url.indexOf("shop.html") >= 0 ||
            url.indexOf("shop_sch.html") >= 0
//            url.indexOf("product.html") >= 0
        ) {
            hideTitleBar = true;
        }
        var pullToRefresh = false;
        if (url.indexOf("order.html") >= 0||url.indexOf("exchange.html") >= 0) {
            pullToRefresh = true;
        }
        var loginCheck = false;
        if (
            url.indexOf("order.html") >= 0 ||
            url.indexOf("address.html") >= 0 ||
            url.indexOf("exchange.html") >= 0 ||
            url.indexOf("msg_center.html") >= 0 ||
            url.indexOf("history.html") >= 0 ||
            url.indexOf("coupon_list.html") >= 0
        ) {
            loginCheck = true;
        }



        JDSY.app.openWin(win_names, {
            "type" : "openWin",
            "name" : win_names,
            "title" : win_tit,
            "hideBottomBar" : true,
            "hideTitleBar" : hideTitleBar,
            "showBack" : true,
            "showRight" : false,
            "url" : url,
            "urlType" : "file",
            "pullToRefresh" : pullToRefresh,
            "loginCheck" : loginCheck,
            "returnRank" : returnRank==null?1:returnRank,
            "initData" : init_data
        });
    }

    function formatImg(_url, _width, _height){
        if(!_url){
            return "";
        }
        if(!_width || !_height){
            return _url;
        }
        var index = _url.lastIndexOf(".");
        var type = _url.substring(index*1 + 1, _url.length);
        if(type == "gif" || type == "GIF"){
            return _url;
        }
        return _url.replace("/jfs/", "/s"+_width+"x"+_height+"_jfs/");
    }


    function get_date(ms){
        var date_obj = {};
        var dates = new Date(ms);
        date_obj.yr = dates.getFullYear();
        date_obj.mth = dates.getMonth() + 1;
        date_obj.dt = dates.getDate();
        date_obj.tm = dates.getHours();
        date_obj.mn = dates.getMinutes();
        date_obj.txt = date_obj.yr +"-"+ (date_obj.mth < 10 ? "0"+date_obj.mth : date_obj.mth) +"-"+ (date_obj.dt < 10 ? "0"+date_obj.dt : date_obj.dt) +"  "+ (date_obj.tm < 10 ? "0"+date_obj.tm : date_obj.tm) +":"+ (date_obj.mn < 10 ? "0"+date_obj.mn : date_obj.mn) ;
        return date_obj;
    }

    function defaultHttpFailureCallback() {
        JDSY.app.alert("加载失败");
    }

    window.JDSY = {
        init : init,
        ready : ready,
        io : fn,
        app : app,
        util : util,
        session : session,
        open_win : open_win,
        open_win_with_data : open_win_with_data,
        formatImg : formatImg,
        get_date : get_date,
        defaultHttpFailureCallback : defaultHttpFailureCallback
    }

    document.addEventListener('WebViewJavascriptBridgeReady', function onReady(
        ev) {
        JDSY.init({
            'bridge' : ev.bridge
        });

    });
})();