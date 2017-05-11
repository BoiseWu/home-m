(function(){

    if(window.comm_fun)return;

    /** 公共函数 **/
    var comm_fun = {

        get_date : function(kms,format){
            format = comm_fun.isNotNull(format) ? format : "-"
            var date_obj = {};
            var dates = new Date(kms);
            date_obj.yr = dates.getFullYear();
            date_obj.mth = dates.getMonth() + 1;
            date_obj.dt = dates.getDate();
            date_obj.tm = dates.getHours();
            date_obj.mn = dates.getMinutes();
			date_obj.ymd = date_obj.yr + format + (date_obj.mth < 10 ? "0"+date_obj.mth : date_obj.mth) + format + (date_obj.dt < 10 ? "0"+date_obj.dt : date_obj.dt);
            date_obj.txt = date_obj.yr + format + (date_obj.mth < 10 ? "0"+date_obj.mth : date_obj.mth) + format + (date_obj.dt < 10 ? "0"+date_obj.dt : date_obj.dt) +"  "+ (date_obj.tm < 10 ? "0"+date_obj.tm : date_obj.tm) +":"+ (date_obj.mn < 10 ? "0"+date_obj.mn : date_obj.mn) ;
            return date_obj;
        },

        /** 获取某个分辨率的图片:* @param _url;  * @param _width 宽  * @param _height 高 **/
        formatImg : function(_url, _width, _height){
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
            return _url.replace("jfs", "s"+_width+"x"+_height+"_jfs");
        },
        GetUrlString:function(url,pargam){
            var  n = 0;
            for(var i in  pargam){
                if(n==0) {
                    url += "?";
                }else{
                    url+="&";
                }
                url = url + i + "=" + pargam[i];
                n++;
            }
            return url;
        } ,

        GetQueryString : function (name) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return "";
        },

        isNull : function(name){
            if(name == "" || name == undefined || name == null || name == "undefined")return true;
            return false;
        },

        isNotNull : function(name){
            return !comm_fun.isNull(name);
        },

        get_format_price : function(price_cents) {
            var price_string = price_cents.toString();
            var length = price_string.length;
            switch (length) {
                case 0:
                    return "";
                case 1:
                    return "0.0" + price_string;
                case 2:
                    return "0." + price_string;
                default:
                    return price_string.substr(0, length - 2) + "." + price_string.substr(length - 2, 2);
            }
        },

        coupon_get_limit_type : function(limit_type) {
            switch (limit_type) {
                case 1:
                    return "限定商品";
                case 2:
                    return "限定品类";
                case 3:
                    return "店铺所有";
                default:
                    return "";
            }
        },

        cookies : {
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
                var cval = cookies.get(name);
                if(cval != null){
                    document.cookie = name + "="+cval+";expires="+exp.toGMTString();
                }
            }
        },

        open_win : function (win_names,config){
            //JDSY.app.openWin(win_names,config);
			JDSY.open_win(win_names,win_names,config.url);
        },

        check_value : function (obj){
            if($(obj).is("select")){
                if($(obj).find("option:selected").val() == undefined || $(obj).val() == ""){
                    $(obj).siblings(".error").removeClass("hide");
                    return false;
                }
                else{
                    $(obj).siblings(".error").addClass("hide");
                    return true;
                }
            }
            var data_type = $(obj).attr("data-type");
            var err_text = "";
            var err_p = $(obj).parent().next("p").length > 0 ? $(obj).parent().next("p") : $(obj).next("p");
            if($(obj).val().replace(/\s/g,"") == ""){
                $(obj).val("");
                switch (data_type){
                    case "emailphone":
                        err_text = "手机号或邮箱不能为空";
                        break;
                    case "phone":
                        err_text = "手机号码不能为空";
                        break;
                    case "password":
                        err_text = "密码不能为空";
                        break;
                    case "repassword":
                        err_text = "密码确认不能为空";
                        break;
                    case "testcode":
                        err_text = "验证码不能为空";
                        break;
                }
                if($(err_p).html().indexOf("sp-icon") < 0){
                    $(err_p).html(err_text);
                    $(err_p).css("display","block");
                }
                else{
                    $(err_p).removeClass("hide");
                }

                return false;
            }
            else{
                var reg;
                switch (data_type){
                    case "emailphone":
                        reg = /^1\d{10}$|^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
                        err_text = "手机号或邮箱格式不正确";
                        break;
                    case "phone":
                        reg = /^1\d{10}$/;
                        err_text = "手机号格式不正确";
                        break;
                    case "password":
                        reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/;
                    ;
                        err_text = "";
                        break;
                    case "repassword":
                        reg =/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/;
                        err_text = "密码为数字,字母,字符至少包含其中2种的6-16位组合";
                        break;
                    case "testcode":
                        reg = /[a-zA-Z\0-9]{4}/;
                        err_text = "验证码有错误";
                        break;
                }
                if(reg != undefined && !reg.test($(obj).val())){
                    if($(err_p).html().indexOf("sp-icon") < 0){
                        $(err_p).html(err_text);
                        $(err_p).css("display","block");
                    }
                    else{
                        $(err_p).removeClass("hide");
                    }
                    return false;
                }
                else{
                    if(data_type == "repassword"){
                        if($(obj).val() != $(".register input[data-type='password']").val()){
                            $(err_p).html("两次密码不一致").css("display","block");
                            return false;
                        }
                        else{
                            return true;
                        }
                    }
                    else{
                        return true;
                    }
                }

            }
        },

        form_check : function (form){
            var can_submit = true;
            var ipts = $(form).find("input,textarea");
            for(i=0; i<ipts.length; i++){
                if(comm_fun.check_value(ipts[i]) == false)can_submit = false;
            }
            return can_submit;
        },

        getFormParam : function(form){
            var param = {};
            var ipts = $(form).find("input,select,textarea");
            for(i=0; i<ipts.length; i++){
                param[$(ipts).eq(i).attr("name")] = $(ipts).eq(i).val();
            }
            return param;
        },

        get_uuid : function () {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid;
        },

        passwordLevel : function(password) {
            var securityLevelFlag = 0;
            if (password.length < 6) {
                return 0;
            }
            else {
                if (/[a-z]/.test(password)){
                    securityLevelFlag++;    //lowercase
                }
                if (/[A-Z]/.test(password)){
                    securityLevelFlag++;    //uppercase
                }
                if(/[0-9]/.test(password)){
                    securityLevelFlag++;    //digital
                }
                if(/\w/.test(password)){
                    securityLevelFlag++;    //specialcase
                }
                return securityLevelFlag;
            }
        }

    };

    var page_set = {

        top_bar : function(config){
            var header = $(".m-header").length > 0 ? $(".m-header") : $('<div class="m-header"/>').insertBefore(config.before);
            if(!config.view){
                $(header).hide();
                return;
            }
            $(header).html("");
            if(config.btn_back){
                var btn_back = $('<a href="#" class="sp-icon go-backs">返回</a>').appendTo(header);
                $(btn_back).attr("href","javascript:;");
                $(btn_back).click(function(){
                    history.go(-1);
                });
            }
            if(config.btn_left){
                for(var i=0; i<config.btn_right.length; i++) {
                    var btn_left = $('<a href="#" class="' + config.btn_left[i].css + '">' + config.btn_left[i].tit + '</a>').appendTo(header);
                    $(btn_left).attr("href", "javascript:;");
                    $(btn_left).click(config.btn_left[i].fun);
                }
            }
            $(header).append('<h1>'+ config.title +'</h1>');
            if(config.btn_center){
                    var btn_center = $('<i class="icon rotate0"></i>').appendTo(header);
                    $(btn_center).attr("href","javascript:;");
                    $(btn_center).click(function(){
                        config.btn_center.fun();
                    });

            }
            if(config.btn_right){
                for(var i=0; i<config.btn_right.length; i++){
                    var btn_right = $('<a href="#" class="'+ config.btn_right[i].css +'">'+ config.btn_right[i].tit +'</a>').appendTo(header);
                    $(btn_right).attr("href","javascript:;");
                    $(btn_right).click(config.btn_right[i].fun);
                }
            }

        },

        foot_bar : function(config){
            var footer = $(".footer-tab").length > 0 ? $(".footer-tab") : $('<div class="footer-tab"/>').appendTo("body");
            if(!config.view){
                $(footer).hide();
                return;
            }
            $(footer).html("");
            var footer_navi = [
                {tit:"空间",link:"main.html"},
                {tit:"记录",link:"record.html"},
                {tit:"交流",link:"exchange.html"},
                {tit:"我的",link:"mine.html"}
            ];
            for(var i=0; i<footer_navi.length; i++){
                $(footer).append('<li class="item'+ (i+1) +" "+ (config.onItem == (i+1) ? 'on' : '') +'"><a href="#" data-link="'+ footer_navi[i].link +'"><i class="sp-icon"></i><span class="text">'+ footer_navi[i].tit +'</span></a></li>');
            }
            $(footer).find("a").click(function(){
                comm_fun.open_win($(this).find("span").html,{url:$(this).attr("data-link")});
            });
        }
    };

    function testError(){
        var errorMsg = "";
        errorMsg += "错误信息：" + arguments[0];
        errorMsg += "\n错误行数：" + arguments[2];
        errorMsg += "\n错误列数：" + arguments[3];
        errorMsg += "\nURL信息：" + arguments[1];
        errorMsg += "\n错误详细：" + arguments[4];
        //alert(errorMsg);
        //JDSY.app.alert({msg:errorMsg});
        window.onerror=null;
        return true;
    }

    window.comm_fun = comm_fun;
    window.page_set = page_set;
    //window.onerror = testError;
    


})();

