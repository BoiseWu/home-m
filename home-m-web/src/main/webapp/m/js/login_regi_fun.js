(function(){

    var uuid,link_url;
    var total_time = 60, setTime_handle;

    var fun = {
        vcode_timer : function (){
            if(total_time > 0){
                $("#code_btn").css("display","none");
                $(".num").css("display","block").text(total_time+'秒后重新获取');
                total_time -= 1;
            }
            else{
                clearInterval(setTime_handle);
                total_time = 60;
                $("#mobile").attr("readonly",false);
                $("#code_btn").css("display","block");
                $(".num").css("display","none").text(total_time+'秒后重新获取');
            }
        },


    };

    var evt = {

        input_event : function(form){
            $(form).find("input").each(function(index, element){
                $(element).blur(function(){
                    comm_fun.check_value(element);
                });

                $(element).click(function(){
                    $(element).parent().next("p").css("display","none");
                });


            });
        },

        login_event : function(){
            //var can_submit = comm_fun.form_check($(".register"));
            //if(can_submit){
                var ipts = $(".register").find("input");
                var parame = {};
                for(var i=0; i<ipts.length; i++){
                    parame[ipts.eq(i).attr("name")] = ipts.eq(i).val();
                }
                parame["uuid"] = uuid;
                JDSY.util.post(query_url.login,parame,function(data){
                    if(data.code == 0){
                        if (window.fun.isapp()) {
                            JDSY.session.setValue("user",JSON.stringify(data.result));
                            JDSY.app.closeWin();
                        } else {
                            if(comm_fun.isNotNull(link_url)){
                                comm_fun.open_win("",{url:link_url});
                            }
                            else{
                                comm_fun.open_win("个人中心",{url:"mine.html"});
                            }
                        }
                    }
                    else{
                        JDSY.app.alert({msg:data.msg});
                        $(".yzm img").attr("src",yzmUrl + "?uuid=" + uuid + "&" + Math.random());
                    }
                },true);
            //}
        },

        mobile_input_event : function(event){
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

        send_vcode_event : function(event){
            var ipt = $(event.currentTarget).parents(".ipt_box").find("input");
            $(ipt).attr("readonly",true);
            JDSY.util.post(query_url.getVerifyCode,{"mobile":$(ipt).val(),"sendType":"reg"},function(){});
            setTime_handle = setInterval(fun.vcode_timer,1000);
        },

        regi_event : function(){
            var can_submit = comm_fun.form_check($(".register"));
            if(can_submit){
                var ipts = $(".register").find("input");
                var parame = {};
                for(var i=0; i<ipts.length; i++){
                    parame[ipts.eq(i).attr("name")] = ipts.eq(i).val();
                }
                JDSY.util.post(query_url.regi,parame,function(data){
                    if(data.code == 0){
                        $(".pop-layer").show();
                        setTimeout(function(){
                            $(".pop-layer").hide();
                            if (window.fun.isapp()) {
                                JDSY.session.setValue("user",JSON.stringify(data.result));
                                JDSY.app.closeWin();
                            } else {
                                if(comm_fun.isNotNull(link_url)){
                                    comm_fun.open_win("",{url:link_url});
                                }
                                else{
                                    comm_fun.open_win("个人中心",{url:"mine.html"});
                                }
                            }
                        },3000);
                    }
                    else{
                        JDSY.app.alert({msg:data.msg});
                    }
                });
            }
        },


    };

    $(document.body).ready(function() {
        JDSY.ready(function () {
            FastClick.attach(document.body);

            if(location.href.indexOf("login") >= 0){
                uuid = comm_fun.get_uuid();
                link_url = comm_fun.GetQueryString("ReturnUrl");

                page_set.top_bar({view:true,btn_back:true,title:"登录",before:$(".register")});

                evt.input_event($(".register"));
                yzmUrl = (window.fun.isapp() ? window.rootUrl : "")  + query_url.getAuthCodeImg;

                $(".yzm img").attr("src",yzmUrl + "?uuid=" + uuid);

                $(".yzm").click(function(){
                    $(".yzm img").attr("src",yzmUrl + "?uuid=" + uuid + "&" + Math.random());
                });

                $(".btn-register").click(evt.login_event);

                $(".link_regi").click(function(){
                    comm_fun.open_win("注册",{url:"regi.html" + (link_url ? "?ReturnUrl="+link_url : "")});
                });
                
                $(".reset_pass").click(function(){
                    comm_fun.open_win("忘记密码",{url:"getpass.html"});
                });
            }

            if(location.href.indexOf("regi") >= 0){
                link_url = comm_fun.GetQueryString("ReturnUrl");
                
                page_set.top_bar({view:true,btn_back:true,title:"注册",before:$(".register")});

                $("#mobile").on("input",evt.mobile_input_event);
                $("#code_btn").click(evt.send_vcode_event);
                evt.input_event($(".register"));
                $(".btn-register").click(evt.regi_event);
                $(".link_login").click(function(){
                    comm_fun.open_win("登录",{url:"login.html" + (link_url ? "?ReturnUrl="+link_url : "")});
                });
                $(".link_regi").click(function(){
                    comm_fun.open_win("注册协议",{url:"regi_rule.html" + (link_url ? "?ReturnUrl="+link_url : "")});
                });
            }
        });
    });

})();
