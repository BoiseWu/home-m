(function(){

    var fun = {
        fill_message : function(data){

             if(data.code == 0) {
                 var cat_list = data.result.cartShopInfo;
                 if (cat_list.length == 0) {
                     $(".cart").css("display", "none");
                     $(".no-page").css("display", "block");
                     return;
                 }
                 $(".cart").css("display", "block");
                 $(".no-page").css("display", "none");
                 var cart_html = "";
                 for (i = 0; i < cat_list.length; i++) {
                     var temp_cart_html = "";
                     total_number_for_shop = 0;
                     member_discount_for_shop = cat_list[i].memberDiscount != undefined ? cat_list[i].memberDiscount : null;
                     temp_cart_html += '<div class="h20"></div>';
                     temp_cart_html += '<div class="order-list">';
                     temp_cart_html += template($("#shop_info").html(), {
                         totalNum: cat_list[i].totalNum,
                         shopId: cat_list[i].shopId,
                         shopName: cat_list[i].shopName
                     });
                     total_number += cat_list[i].totalNum;

                     var cart_man_shop_html = "";
                     if (cat_list[i].manSuits4Shop) {
                         for (k = 0; k < cat_list[i].manSuits4Shop.length; k++) {
                             var temp_cart_man_shop_html = "";
                             temp_cart_man_shop_html += template($("#promote_info").html(), {manSuits4Shop: cat_list[i].manSuits4Shop[k]});
                             var man_shop_cart_sku_html = fun.get_pro_html(cat_list[i].manSuits4Shop[k].cartSkuList);
                             if (man_shop_cart_sku_html.length > 0) {
                                 temp_cart_man_shop_html += man_shop_cart_sku_html;
                                 cart_man_shop_html += temp_cart_man_shop_html;
                             }
                         }
                     }
                     temp_cart_html += cart_man_shop_html;

                     var cart_item_shop_html = "";
                     if (cat_list[i].items4Shop) {
                         cart_item_shop_html = fun.get_pro_html(cat_list[i].items4Shop);
                     }
                     temp_cart_html += cart_item_shop_html;

                     if (cart_man_shop_html.length > 0 || cart_item_shop_html.length > 0) {
                         temp_cart_html += template($("#total_info").html(), {
                             num_shop: total_number_for_shop,
                             prom_shop: cat_list[i].totalPromotionDiscount4Shop,
                             num_price: cat_list[i].totalPromotionPrice4Shop
                         });
                         cart_html += temp_cart_html;
                     }
                     temp_cart_html += "</div>";
                 }
                 $(".car_list").html(cart_html);
                 fun.pro_check_select_all();
                 $(".p-acitonbar .price .text em").html("￥" + data.result.totalPromotionPrice);
                 $(".p-acitonbar .price .text2").html(total_kind + "种" + total_number + "件 不含运费");
                 $(".title span").html(total_number);

                 setTimeout(evt.input_blur, 100);
             } else{
                 if(data.code==1010){
                     JDSY.app.alert({msg:"用户未登陆"});
                 }else{
                   JDSY.app.alert({msg:data.msg})
                 }
             }
        },
        page_ini : function(){
                //page_set.top_bar({view:true,title:"进货车",before:$(".cart")});
                $(".p-acitonbar").css("bottom", "48px");
                page_set.foot_bar({view:true,onItem:3});

        }

    };

    var evt = {
        list_event : function(event){
            if($(event.target).hasClass("cart-checkbox") || $(event.target).hasClass("icon-chk")){
                var btn = $(event.target).hasClass("cart-checkbox") ? $(event.target) : $(event.target).parent();
                var send_to = "";
                var ignore_check = false;
                if($(btn).parents("h4").length > 0){
                    if($(btn).hasClass("checked")){
                        $(btn).parents(".order-list").find(".cart-checkbox").removeClass("checked");
                        send_to = "cartUnsel";
                        ignore_check = true;
                    }
                    else{
                        $(btn).parents(".order-list").find(".cart-checkbox").each(function(index, element) {
                            if (can_edit || !$(element).hasClass("disable")) {
                                $(element).addClass("checked");
                            }
                        });
                        //$(btn).parents(".order-list").find(".cart-checkbox .enable").addClass("checked");
                        send_to = "cartSelect";
                    }
                    var goods = $(btn).parents(".order-list").find(".order-goods");
                    var skuids = fun.pro_check(goods, ignore_check);
                    if(skuids.length > 0 && !can_edit)JDSY.util.get(query_url[send_to],{"skuIds":skuids},fun.fill_cart,null,false);
                }
                else{
                    if($(btn).hasClass("checked")){
                        $(btn).removeClass("checked");
                        if($(btn).parents(".order-list").find(".order-goods .checked").length <= 0){
                            $(btn).parents(".order-list").find("h4 .cart-checkbox").removeClass("checked");
                        }
                        send_to = "cartUnsel";
                    }
                    else{
                        if (!can_edit && $(btn).hasClass("disable")) return;
                        $(btn).addClass("checked");
                        $(btn).parents(".order-list").find("h4 .cart-checkbox").addClass("checked");
                        send_to = "cartSelect";
                    }
                    var skuid = $(btn).parents(".order-goods").attr("data-skuId");
                    if(!can_edit)JDSY.util.get(query_url[send_to],{"skuIds":skuid},fun.fill_cart,null,false);
                }
                if (can_edit) {
                    // check select all in edit mode
                    fun.pro_check_select_all();
                }
            }
            
        },




    };

    $(document.body).ready(function() {
        JDSY.ready(function () {
            FastClick.attach(document.body);
             fun.page_ini();
        });
    });

})();
