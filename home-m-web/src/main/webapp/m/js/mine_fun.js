(function(){

    var fun = {

        mine_page_set : function(data){

            if(data.code == 0){

                $(".unlogin").hide();
                $(".logined").show();
                if(data.result.userPic != "undefined")$(".logined img").attr("src",data.result.userPic);
                
                $(".logined .name").html(data.result.userName);
                isLogin = true;
            }
            else{
                $(".unlogin").show();
                $(".logined").hide();
                isLogin = false;
            }
        },

        userPageSet : function(data){
            phoneNum = data.result.mobile;
            pin  = data.result.pin;
            $(".logined .name").html(data.result.nickname==null?pin:data.result.nickname);
            if(phoneNum != "undefined" &&  phoneNum!= null)$(".phone-num").html(phoneNum);
            
        },



        fill_msg_center : function(nums,data){
			var html = "";
            var isNull = true;
            if(data.buyerMess == undefined)data.buyerMess = {};
            if(data.buyerMess.length > 0)   {
                html += template($("#msg_buyer").html(),{mess:data.buyerMess[0],num:nums.buyerNum,times:comm_fun.get_date(data.buyerMess[0].created),type:"buyerType"});
            isNull = false;}
            if(data.sellerMess == undefined)data.sellerMess = {};
            if(data.sellerMess.length > 0) {
                html += template($("#msg_seller").html(),{mess:data.sellerMess[0],num:nums.sellerNum,times:comm_fun.get_date(data.sellerMess[0].created),type:"sellerType"});
              isNull = false;
            }
            $(".pay-c").html(html);
            if(window.fun.isapp()){
                msg_unread_state.buyer = nums.buyerNum;
                msg_unread_state.seller = nums.sellerNum;
            }
            fun.msg_center_badge_update({"buyerNum":nums.buyerNum, "sellerNum":nums.sellerNum});
            if(isNull==true){
                $(".none").css("display","block");
            }
            $(".pay-c a").attr("href","javascript:;");
		},




        config_page_ini:function(){
            if(!window.fun.isapp()) {
                page_set.top_bar({view: true, btn_back: true, title: "设置", before: $(".setting")});
            } ;

            $(".setting li").eq(0).click(function(){
                comm_fun.open_win("账号管理",{url:"user.html"});
            });
            $(".setting li").eq(1).click(function(){
                comm_fun.open_win("意见反馈",{url:"visitor.html"});
            });
            $(".sign-out").click(function(){
                if (window.fun.isapp()) {
                    JDSY.session.setValue("user","");
                    JDSY.app.loginOut();
                    JDSY.app.closeWin();
                } else {
                    window.location.href = query_url.loginOut;
                }
            })
        } ,
        visitor_page_ini:function(){
            uuid = comm_fun.get_uuid();

            if(!window.fun.isapp()){
                page_set.top_bar({view: true, btn_back: true, title: "意见反馈", before: $(".feedback-v2")});

            };
            //yzmUrl = (window.fun.isapp() ? window.rootUrl : "")  + query_url.getAuthCodeImg;
            //$(".codes img").attr("src",yzmUrl + "?uuid=" + uuid);
            //$(".codes").click(function(){
            //    $(".codes img").attr("src",yzmUrl + "?uuid=" + uuid + "&" + Math.random());
            //});
            $(".submit").click(evt.submit) ;
            $("input[name='mobile']").on("input",evt.mobile_input_event);
        }


    };

    var evt = {
        mobile_input_event:function(){
            var ipt = event.currentTarget;
            if($(ipt).val().length == 11 && comm_fun.check_value(ipt)){
                $(".err-text").css("display","none");

            }else{
                $(".err-text").css("display","block");
            }


        },
        inputEvt:function(){
            if($(this).val()==""){
                $(this).parent().find("p").css("display","block");
                return;
            }else{
                $(this).parent().find("p").css("display","none");

            }
        },

        linkEvent : function(){

            $(".link_login").click(function(){
                comm_fun.open_win("登录",{url:"login.html"});
            });
            $(".link_regi").click(function(){
                comm_fun.open_win("注册",{url:"regi.html"});
            });
            $(".btn-manage").click(function () {
                comm_fun.open_win("设置",{url:"config.html"});
            });

            $(".link_photo").parent().click(function(){
                comm_fun.open_win("个人相册", {url: "photo.html"});
            });

            /*$(".link_message").parent().click(function(){
                comm_fun.open_win("消息中心",{url:"msg_center.html"});
            });
            $(".link_address").parent().click(function(){
                comm_fun.open_win("我的地址",{url:"address.html"});
            });
            $(".link_favorite").parent().click(function(){
                if(window.fun.isapp()){
                    JDSY.app.openWin("favorite ", {
                        "type" : "openWin",
                        "name" : "favorite",
                        "title" : "我的收藏",
                        "hideBottomBar" : true,
                        "hideTitleBar" : false,
                        "showBack" : true,
                        "showRight" : true,
                        "rightBtnName":"编辑",
                        "url" : "favorite.html",
                        "urlType" : "file",
                        "pullToRefresh" : false,
                        "loginCheck" : true,
                        "returnRank" : 1,
                        "initData" : {}
                    })
                }else {
                    comm_fun.open_win("收藏夹", {url: "favorite.html"});
                }
            });
            $(".link_history").parent().click(function(){
                if(window.fun.isapp()){
                    JDSY.app.openWin("history ", {
                        "type" : "openWin",
                        "name" : "history",
                        "title" : "浏览历史",
                        "hideBottomBar" : true,
                        "hideTitleBar" : false,
                        "showBack" : true,
                        "showRight" : true,
                        "rightBtnName":"编辑",
                        "url" : "history.html",
                        "urlType" : "file",
                        "pullToRefresh" : false,
                        "loginCheck" : true,
                        "returnRank" : 1,
                        "initData" : {}
                    })
                }else {
                    comm_fun.open_win("浏览历史",{url:"history.html"});
                }
            });
            $(".link_ticket").parent().click(function(){
                comm_fun.open_win("优惠券",{url:"coupon_list.html"});
            });
            $(".btn-shop").click(function(){
                comm_fun.open_win("店铺",{url:"shop.html?shopId="+sellerShopId});
            });*/

        },

        uesr_page_ini : function(){
            JDSY.util.post(query_url.getInfo,{},fun.userPageSet);
            $(".my-item a").on("click",evt.userEvt);
            $(".m-btn").click(function(){
                if (window.fun.isapp()) {
                    JDSY.session.setValue("user","");
                    JDSY.app.loginOut();
                    JDSY.app.closeWin();
                } else {
                    window.location.href = query_url.loginOut;
                }
            });
        },

        userEvt : function(event){
            if($(this).hasClass("btn_updatePass")){
                comm_fun.open_win("修改密码",{url:"updatepass.html"});
            }
            if($(this).hasClass("btn_updatePhone")){
                comm_fun.open_win("手机验证",{url:"update_phone.html"});
            }
            if($(this).hasClass("btn_update_pay_pass")){
                comm_fun.open_win("修改支付密码",{url:"updatepaypass.html"});
            }
        },

        mess_page_ini : function(){
            var type =  comm_fun.GetQueryString("type");
            JDSY.util.post(query_url.message,{queryType:type,"pageIndex":pageIndex,"pageSize":pageSize},fun.fill_message,true);
			$(".pay-c").on("click",".money-list",function () {
				var orderId = $(this).find(".info").attr("oid");
                // 产品已暂时关掉消息跳转订单
                //comm_fun.open_win("订单详情",{url:"order_info.html?orderId="+orderId});
            });

            $(window).scroll(function(e){
                if (msg_scroll == true || msg_end == true) return;
                if ($(document).scrollTop() + $(window).height() >= $(document).height()) {
                    msg_scroll = true;
                    JDSY.util.post(query_url.message, {queryType: type, "pageIndex": pageIndex, "pageSize": pageSize}, fun.fill_message, true);
                }
            });
        },

		msg_center_ini : function(){
            // 消息中心接口调用
            JDSY.util.post(query_url.msg_num,null,function (data) {
                var nums = data.result;
                JDSY.util.post(query_url.message,{queryType:""},function (_data) {
                    fun.fill_msg_center(nums,_data.result);
                });
            });

			$(".pay-c").on("click",".money-list",function () {				
				var type = $(this).find(".info").attr("type");
                if(window.fun.isapp()){
                    msg_unread_state.clickType = type;
                }
                comm_fun.open_win("我的消息",{url:"message.html?type=" + type});
            });
        },
		
        noCertifyIni : function(){
            page_set.top_bar({view:true,btn_back:true,title:"卖家中心",before:$(".no-page")});
        },

        updateMobileIni : function(){
            updatestep = 1;
            sendType = "updateUser";
            page_set.top_bar({view:true,btn_back:true,title:"手机验证",before:$(".top-stap")});
            JDSY.util.post(query_url.getInfo,{},fun.updateMobileSet);
            $(".btn-yzm").on("click",evt.sendVcodeEvt);
            $(".btn_next_step").on("click",evt.nextStepEvt);
            $("input[name='mobile']").on("input",evt.mobileInputEvt);
        },

        updatePassIni : function(){
            updatestep = 1;
            sendType = "resetpass";
            page_set.top_bar({view:true,btn_back:true,title:"修改密码",before:$(".top-stap")});
            JDSY.util.post(query_url.getInfo,{},fun.updateMobileSet);
            $(".btn-yzm").on("click",evt.sendVcodeEvt);
            $(".btn_next_step").on("click",evt.passNextStepEvt);
        },

        updatePayPassIni : function(){
            updatestep = 1;
            sendType = "updatepaypass";
            page_set.top_bar({view:true,btn_back:true,title:"修改支付密码",before:$(".top-stap")});
            JDSY.util.post(query_url.getInfo,{},fun.updateMobileSet);
            $(".btn-yzm").on("click",evt.sendVcodeEvt);
            $(".btn_next_step").on("click",evt.payNextStepEvt);
            $(".step2 input[name='password']").on("input",evt.passLevel);
        },

        getPassIni : function(){
            updatestep = 1;
            sendType = "resetpass";
            page_set.top_bar({view:true,btn_back:true,title:"找回密码",before:$(".top-stap")});
            $("input[name='mobile']").on("input",evt.mobileInputEvt);
            $(".btn-yzm").on("click",evt.sendVcodeEvt);
            $(".btn_next_step").on("click",evt.passNextStepEvt);
        },

        mobileInputEvt : function(event){
            var ipt = event.currentTarget;
            if($(ipt).val().length == 11 && comm_fun.check_value(ipt)){
                $(".btn-yzm").css("display","block");
                $(".btn-yzm2").css("display","none");
            }
            else{
                $(".btn-yzm").css("display","none");
                $(".btn-yzm2").css("display","block");
            }
        },

        sendVcodeEvt : function(){
            var btn = this;
            var timer = $(this).parents(".box-input").find(".num");
            var ipt = $(this).parents(".box-input").find("input");
            $(ipt).attr("readonly",true);
            JDSY.util.post(query_url.getVerifyCode,{"mobile":$(ipt).val(),"sendType":sendType},function(){});
            setTime_handle = setInterval(function(){
                fun.vcodeTimer(btn,timer,ipt);
            },1000);
        },

        viewStep : function(){
            switch (updatestep){
                case 1:
                    $(".top-stap .txt").eq(0).addClass("stap1");
                    $(".register").hide();
                    $(".step1").show();
                    break;
                case 2:
                    $(".top-stap .txt").eq(1).addClass("stap1");
                    $(".register").hide();
                    $(".step2").show();

                    break;
                case 3:
                    $(".top-stap .txt").eq(2).addClass("stap1");
                    $(".register").hide();
                    $(".step3").show();
                    break;
            }
        },

        vcodeCheck : function(ipt){
            if($(ipt).val() == ""){
                JDSY.app.alert({msg:"验证码不能为空"});
                $(ipt).focus();
                return false;
            }
            if($(ipt).val().length != 6){
                JDSY.app.alert({msg:"验证码长度错误"});
                $(ipt).focus();
                return false;
            }
            return true;
        },

        vcodeConfirm : function(ipt_vcode,ipt_mobile,succ_fun){
            if(!evt.vcodeCheck(ipt_vcode)){
                return;
            }
            JDSY.util.post(query_url.checkVerifyCode,{mobile:$(ipt_mobile).val(),phoneCode:$(ipt_vcode).val(),sendType:sendType},function(data){
                if(data.code == 0){
                    updatestep += 1;
                    succ_fun();
                }
                else{
                    JDSY.app.alert({msg:data.msg});
                }
            });
        },

        passCheck : function(ipt_pass1,ipt_pass2){
            if($(ipt_pass1).val() == ""){
                JDSY.app.alert({msg:"密码不能为空"});
                return false;
            }
            else{
                reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/;                //var  reg =/^.{6,16}$/
                if(!reg.test($(ipt_pass1).val())){
                    JDSY.app.alert({msg:"密码为数字,字母,字符至少包含其中2种的6-16位组合"});
                    return false;
                }
                else{
                    if($(ipt_pass1).val() !== $(ipt_pass2).val()){
                        JDSY.app.alert({msg:"两次输入的密码不一致"});
                        return false;
                    }
                    else{
                        return true;
                    }
                }
            }
        },

        nextStepEvt : function(){
            if(updatestep == 1){
                evt.vcodeConfirm($(".step1 input[name='vcode']"),$(".step1 input[name='mobile']"),evt.viewStep);
            }
            if(updatestep == 2){
                //evt.vcodeConfirm($(".step2 input[name='vcode']"),$(".step2 input[name='mobile']"),evt.viewStep);
                JDSY.util.post(query_url.updateUserInfo,{mobile:$(".step2 input[name='mobile']").val(),phoneCode:$(".step2 input[name='vcode']").val()},function(data){
                    if(data.code == 0){
                        updatestep += 1;
                        evt.viewStep();
                    }
                    else{
                        JDSY.app.alert({msg:data.msg});
                    }
                });
            }
            if(updatestep == 3){
                comm_fun.open_win("用户中心",{url:"user.html"});
            }
        },

        passNextStepEvt : function(){
            if(updatestep == 1){
                evt.vcodeConfirm($(".step1 input[name='vcode']"),$(".step1 input[name='mobile']"),evt.viewStep);
            }
            if(updatestep == 2){
                var can_sub = evt.passCheck($(".step2 input[name='password']"), $(".step2 input[name='repass']"));
                if(!can_sub)return;
                JDSY.util.post(query_url.resetpass,{userId:$(".step1 input[name='mobile']").val(),mobile:$(".step1 input[name='mobile']").val(),phoneCode:$(".step1 input[name='vcode']").val(),newPassword:$(".step2 input[name='password']").val(),rePassword:$(".step2 input[name='repass']").val()},function(data){
                    if(0 == data.code){
                        JDSY.app.alert({msg:"新密码设置成功",type:"succ"})
                        setTimeout(function(){comm_fun.open_win("用户设置",{url:"mine.html"});},2000);
                    }
                    else{
                        JDSY.app.alert({msg:data.msg});
                    }
                });
            }
        },

        payNextStepEvt : function(){
            if(updatestep == 1){
                evt.vcodeConfirm($(".step1 input[name='vcode']"),$(".step1 input[name='mobile']"),evt.viewStep);
            }
            if(updatestep == 2){
                var can_sub = evt.passCheck($(".step2 input[name='password']"), $(".step2 input[name='repass']"));
                if(!can_sub)return;
                if(2 > $(".step2 input[name='passlevel']").val()){
                    JDSY.app.alert({msg:"密码强度过低，请重新设置"});
                    return;
                }
                JDSY.util.post(query_url.updatepaypass,{mobile:$(".step1 input[name='mobile']").val(),phoneCode:$(".step1 input[name='vcode']").val(),paymentCode:$(".step2 input[name='password']").val(),repaymentCode:$(".step2 input[name='repass']").val(),securityLevel:$(".step2 input[name='passlevel']").val()},function(data){
                    if(0 == data.code){
                        JDSY.app.alert({msg:"新支付密码设置成功",type:"succ"});
                        setTimeout(function(){comm_fun.open_win("用户设置",{url:"user.html"});},2000);
                    }
                    else{
                        JDSY.app.alert({msg:data.msg});
                    }
                });
            }
        },

        passLevel : function(){
            //alert(comm_fun.passwordLevel($(this).val()));
            $(".step2 input[name='passlevel']").val(comm_fun.passwordLevel($(this).val()));
        } ,
        submit:function(){
            var  params = comm_fun.getFormParam('#form');
            if($("err-text").css("display")=="block")return;

            if(params.content==""){
                JDSY.app.alert({msg:"反馈内容不能为空"}) ;
                return;
            }
            re = /^1\d{10}$/;
            if(params.mobile!="" && !re.test(params.mobile)) {//params.mobile.length!=11 && params.mobile.index(0)!="1"){
                JDSY.app.alert({msg:"手机号格式不正确"}) ;
                return;
            }
            //if(params.codes == ""){
            //    JDSY.app.alert({msg:"验证码不能为空"}) ;
            //    return;
            //}
            //
            JDSY.util.post(query_url.userFeedback,params,function(data){
                if(data.code == 0){
                    JDSY.app.alert({msg:"反馈成功",type:"succ"});
                    setTimeout(function(){
                        comm_fun.open_win("设置",{url:"config.html"});
                    },3000)
                }else{
                    JDSY.app.alert({msg:"反馈失败"})
                }
            })
        }

    };

    $(document.body).ready(function(){
        JDSY.ready(function() {
            FastClick.attach(document.body);
            if(location.href.indexOf("mine") >= 0){
                page_set.foot_bar({view:true,onItem:4});
                evt.linkEvent();
                page_set.top_bar({view:true,title:"个人中心",before:$(".m-my")});
                JDSY.util.post(query_url.getUserInfo,{},fun.mine_page_set);
            }
        });
    });

})();
