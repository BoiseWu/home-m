(function() {
	//m版
    if (window.JDSY) {
        return;

    }

	
    var JSBridge;
    var readyCallback;
    function init() {

        readyCallback();
    }

    function ready(fn) {
		
        readyCallback = fn;
		
		JDSY.init();
    }

    var session = {

        getValue: function(keyname, successCallback) {
           
        },
        setValue : function(keyname, value, successCallback) {
            
        },

    };

    var app = {
        getNetworkType : function(successCallback) {
           
        },
        alert : function(data) {
            var alert_layer = $(".pop-layer2").length > 0 ? $(".pop-layer2") : $("<div class='pop-layer2'/>").appendTo($("body"));
			var html = "";
			html += '<div class="pop-tbl">';
			html += '<div class="section">';
			html += '<div class="pop2">';
			switch (data.type){
				case "succ":
					html += '<i class="sp-icon icon2"></i>';
					break;
				case "atti":
					html += '<i class="sp-icon icon3"></i>';
					break;
				default:
					html += '<i class="sp-icon"></i>';
					break;
			}
			html += '<p>'+ data.msg +'</p>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			$(alert_layer).html(html);
			$(alert_layer).show(200);
			setTimeout(function () {
				$(alert_layer).hide(200);
			}, 1800);
        },
        setTitle : function(title) {
            
        },

        confirm : function(data, successCallback,cancelCallback){
			var pop_layer = $(".pop-layer").length > 0 ? $(".pop-layer") : $("<div class='pop-layer'/>").appendTo($("body"));
			var html = "";
			html += '<div class="shade"></div>';
			html += '<div class="pop-tbl">';
			html += '<div class="section">';
			html += '<div class="pop">';
			html += '<p>'+ data.title +'</p>';
			html += '<div class="btn-area">';
			html += '<a href="javascript:;" class="btn-cancel">取消</a>';
			html += '<a href="javascript:;" class="btn-confirm">确定</a>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			$(pop_layer).html(html);
			$(pop_layer).show();
			
			$(pop_layer).click(function(event){
				if($(event.target).attr("class") == "shade"){
					$(pop_layer).remove();
				}
				if($(event.target).attr("class") == "btn-cancel"){
					$(pop_layer).remove();
					if(cancelCallback)cancelCallback();
				}
				if($(event.target).attr("class") == "btn-confirm"){
					$(pop_layer).remove();
					if(successCallback)successCallback();
				}
			});
            
        },
        openWin : function(fileName, config) {

            location.href = config.url;

        },
        closeWin : function(config) {
            

        },
        config : function(config1) {

        },
        gps : function(successCallback) {

            

        },
        getPhoto : function(data, successCallback) {
            
        },

    };

    var util = {
		ajax : function(settings){
			settings.type = (settings.type && settings.type == "POST")?"POST":"GET";
			var load;
			if(!settings.hideLoading)load = loading("加载中…");

			$.ajax({
				url : settings.url,
				type : settings.type,
				cache:false,
				data : settings.params,
				dataType : "json",
				success : function(result){
					if (settings.successCallback) {
						settings.successCallback(result);
						return;
					}
				},
				error : function(){
					if(settings.failureCallback){
						settings.failureCallback();
					}
					else{
                        if(!settings.hideLoading) {
                            JDSY.app.alert({msg:"网络错误"});
                        }
						console.log(JSON.stringify(settings));
					}
				},
				complete : function(){
					if(load)$(load).hide();
				}
			});

		},

        post : function(url, params, callBack, failureCallback, hideLoading) {
			util.ajax({
				url : url,
				type : "POST",
				params : params,
				successCallback : callBack,
				failureCallback : failureCallback,
				hideLoading : hideLoading
			});
        },

        get : function(url, params, callBack, failureCallback , hideLoading) {
			util.ajax({
				url : url,
				type : "GET",
				params : params,
				successCallback : callBack,
				failureCallback : failureCallback,
				hideLoading : hideLoading
			});
        },
        initData : function(successCallback) {
			
			
			
        },
        viewWillAppear : function(successCallback) {
			
        }
    };
	
	var cookies = {
		get : function(name){
			var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
			if(arr=document.cookie.match(reg)){
				return unescape(arr[2]);
			}
			else{
				return null;
			}
		},
		set : function(name,value){
			var Days = 30;
			var exp = new Date();
			exp.setTime(exp.getTime() + Days*24*60*60*1000);
			document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
		},
		del : function(name){
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var cval=cookies.get(name);
			if(cval!=null){
				document.cookie = name + "="+cval+";expires="+exp.toGMTString();
			}
		}
	}

	function loading(msg){
		var load_layer = $(".loading").length > 0 ? $(".loading") : $("<div class='loading top44'/>").appendTo($("body"));
		var html = "";
		html += '<div class="loading-tbl">';
		html += '<div class="cell">';
		html += '<div class="bd loading-type2">';
		html += '<img src="images/loading2.gif" width="22px" height="22px">';
		html += '<p>'+ msg +'</p>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		$(load_layer).html(html);
		$(load_layer).show();

		return load_layer;
	}

	function open_win(win_names,win_tit,url){
		location.href = url;
	}

    window.JDSY = {
        init : init,
        ready : ready,
        app : app,
        util : util,
        session : session,
		loading : loading,
		open_win : open_win
    }

	
	
})();