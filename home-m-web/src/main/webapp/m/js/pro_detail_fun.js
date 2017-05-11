(function(){

    var pro_cnt = {};
    var pro_id = comm_fun.GetQueryString("itemID");
    var pro_sku = comm_fun.GetQueryString("pro_sku");
    var pro_num = comm_fun.GetQueryString("pro_num");

    var pro_fun = {

        fill_cnt : function(data){
            if(data.code == 0){
                pro_cnt["describe"] = data.result.describe == "" ? "暂无图文数据" : data.result.describe;
                pro_cnt["packingList"] = data.result.packingList == "" ? "暂无包装数据" : data.result.packingList;
                pro_cnt["afterService"] = data.result.afterService == "" ? "暂无服务数据" : data.result.afterService;
                setTimeout(function(){
                    $(".details-hd li").eq(0).click();
                },20);
            }
        },

        set_cnt : function(event_obj){
            var frame_id = $("#" + $(event_obj).attr("rel")).children("iframe").attr("id");
            if($(window.frames[frame_id].document).find(".pro_detail_cnt").html() != "")$(window.frames[frame_id].document).find(".pro_detail_cnt").html(pro_cnt[frame_id]);
        },

        get_cnt : function(){
            JDSY.util.post(query_url.product_detail,{"itemId":pro_id},pro_fun.fill_cnt);
            JDSY.util.get(query_url.pro_count,{},pro_fun.set_cart_num);
        },

        page_ini : function(){
            page_set.top_bar({view:true,btn_back:true,title:"商品详情",before:$(".product-details")});
            pro_fun.get_cnt();
            $("iframe").height($(".details-bd").height());
        },
        add_cart : function(e,callback){
            JDSY.util.post(query_url.checkPro,{itemId:pro_id}, function(check_data) {
                // seller can not buy his own product
                if (check_data.code == 4010) {
                    JDSY.app.alert({msg: check_data.msg});
                    return;
                }
                JDSY.util.get(query_url.cartAdd + "?skuId="+ pro_sku +"&num="+pro_num,{},function(data){
                    if(data.code == 1010){
                        if(window.fun.isapp()){
                            comm_fun.open_win("用户登录", {url:"login.html"});
                        }else {
                            comm_fun.open_win("用户登录",{url:"login.html?pName=product&pTitle=商品详情&ReturnUrl="+encodeURIComponent(location.href)});
                        }
                    }
                    else if(data.code == 0) {
                        JDSY.app.alert({msg:"添加成功",type:"succ"});
                        pro_fun.set_cart_num(data);
                        if (callback)callback();
                    }
                    else{
                        JDSY.app.alert({msg:data.msg});
                    }
                });
            });
        },

        set_cart_num : function (data){
            if (data.code == 0) {
                $(".cart .num").html(data.result.totalNumber||data.result);
            } else {
                //JDSY.app.alert({msg:data.msg});
            }
        },
           go_cart : function(){
               comm_fun.open_win("购物车",{url:"exchange.html"});
           }  ,
        go_order : function(){
            JDSY.util.post(query_url.checkPro, {itemId: pro_id}, function (check_data) {
                if(check_data.code == 1010){
                    if(window.fun.isapp()){
                        comm_fun.open_win("用户登录", {url:"login.html"});
                    }else {
                        comm_fun.open_win("用户登录",{url:"login.html?pName=product&pTitle=商品详情&ReturnUrl="+encodeURIComponent(location.href)});
                    }
                } else if (check_data.code == 4010){
                    JDSY.app.alert({msg: check_data.msg});
                    return;
                } else if (check_data.code == 0){
                    if (window.fun.isapp()) {
                        JDSY.session.setValue("sku", JSON.stringify({"skuId": pro_sku, "num": pro_num}));
                    } else {
                        comm_fun.cookies.set("sku", JSON.stringify({"skuId": pro_sku, "num": pro_num}))
                    }
                    //comm_fun.open_win("订单确认", {url: "order_confirm.html"});
                }else {
                    JDSY.app.alert({msg:data.msg});
                }
            });
            //         pro_fun.add_cart(event,pro_fun.go_cart);

        }
    };

    var pro_event = {

        scroll_event : function(event){
            if($(window).scrollTop() > $(".m-header").height()){
                $(".details-hd").addClass("hd-fixed");
            }else {
                $(".details-hd").removeClass("hd-fixed");
            }
        },

        tab_event : function(event){
            var li = event.currentTarget;
            if ($(li).hasClass('on')===false) {
                $(".details-hd li").removeClass("on");
                $(li).addClass("on");
            }
            var selId = $(li).attr('rel');
            $('.d-tab-bd').css('display','none');
            $('.d-tab-bd#'+selId).css('display','block');
            pro_fun.set_cnt(li);
        }

    };

    $(document.body).ready(function(){
        JDSY.ready(function() {
            FastClick.attach(document.body);
            pro_fun.page_ini();

            $(".add-cart").click(pro_fun.add_cart);
            $(".btn_enter").click(pro_fun.add_cart);
            $(".buy").click(pro_fun.go_order);
            $(".cart").on("click", function () {
                comm_fun.open_win("购物车", {url: "exchange.html"});
            });
            //图片详情tab
            $(".details-hd li").click(pro_event.tab_event);

            $(window).scroll(pro_event.scroll_event);
        });
    });

})();
