(function () {

    var pageIndex = 1, state = 0, pageSize = 5;
    var to_end = false;
    var curr_order = {};
    var isscrolling = false;
    // var orderId;
    var sku = {};
    var couponid;
      var  p_scroll;
    var can_sub = true;
    var skuIds = "";
    var addressId;
    var orderId;
    var paymentPrice, order_paymentPrice, order_promotionDiscount;

    var view_pop = false,view_mask = false;

    var is_seller = location.pathname.indexOf("seller") > 0 ? true : false;
    state = is_seller ? 1 : 0;

    var conpon_select_tab_state = "availableCoupons";
    var coupon_result;
    var selected_coupon_id;
    var invoice_yes = false;
    var stateStr = "全部订单";
    var btn = {
        delete: '  <a href="javascript:;" class="btn  btn-red btn_delete">删除订单</a>',
        buy_again: '  <a href="javascript:;" class="btn btn-red btn_buyagain">再次购买</a>',
        price_change: '  <a href="javascript:;" class="btn btn-red btn_price_change">修改价格</a>',
        cancel: '  <a href="javascript:;" class="btn  btn-red btn_close">取消订单</a>',
        pay: '  <a href="javascript:;" class="btn btn-red btn_gopay">去付款</a>',
        receive: '  <a href="javascript:;" class="btn btn-red btn_confirm">确认收货</a>',
        comment: '  <a href="javascript:;" class="btn btn-red btn_feedback">评价</a>',
        send: '  <a href="javascript:;" class="btn btn-red btn_send">确认发货</a>',
        refund :  location.pathname.indexOf("_info") > 0 ? '<a href="javascript:;" class="btn btn_refund">申请退款</a>' : "",
        prolong:   '  <a href="javascript:;" class="btn btn_prolong">延长收货</a>' ,
        refundInf: location.pathname.indexOf("_info") > 0 ?  '<a href="javascript:;" class="btn btn_refundInf">退款详情</a>':""


    }

    var fun = {

        fill_list: function (data) {
            isscrolling = false;
            if (data.code == 0) {
                var list = is_seller ? state==22 ?data.result.orderList: data.result.orderList.orders : data.result.orderList;

                if (list.length <= 0) {
                    $(".no-page").css("display", pageIndex == 1 ? "block" : "none");
                    $(".loading-bg").css("display", "none");
                    if (pageIndex == 1){
                        $(".cart").html("");
                    }else{
                        JDSY.app.alert({msg:"没有更多数据了"})
                    }
                    to_end = true;
                }
                else {
                    $(".no-page").css("display", "none");
                    $(".loading-bg").css("display", pageIndex >= 1 ? "block" : "none");
                    if (list.length < pageSize) {
                        $(".loading-bg").css("display", "none");
                        to_end = true;
                    }
                    for (var i = 0; i < list.length; i++) {
                        list[i].static = fun.get_state({
                            state: list[i].state,
                            yn: list[i].yn,
                            refund: list[i].refund,
                            afterService: list[i].afterService,
                            evaluate: list[i].evaluate,
                            sellerEvaluate: list[i].sellerEvaluate ,
                            applyForDelay : list[i].applyForDelay ,
                            refundState:list[i].refundState
                        });
                        list[i].pro_kind = list[i].items.length;
                        list[i].total = fun.getTotalCount(list[i].items);
                    }
                    var htmls = template($("#order_list").html(), {
                        list: list,
                        pictures: data.result.pictures,
                        get_date: comm_fun.get_date
                    });
                    if (pageIndex == 1)$(".cart").html("");
                    $(".cart").append(htmls);
                    //$(".btn_refund").remove();
                    //$(".btn_refundInf").remove();
                    $("btn_prolong").remove();

                    $(".cart a").attr("href", "javascript:;");
                    //var reg = /<(?!img).*?>/g;
                    //alert(htmls.replace(/<(?!img).*?>/g,""));
                    //$(".cart").append(htmls);
                    to_end = false;
                    pageIndex += 1;
                }
            }
            else {
                JDSY.app.alert({msg: data.msg});
            }
        },

        getTotalCount: function (items) {
            var total = 0;
            for (var p = 0; p < items.length; p++) {
                total += items[p].num;
            }
            return total;
        },

        fill_state: function (data) {
            if (data.code == 0) {
                $(".sort-list .text-red").each(function () {
                    var num = data.result[$(this).parents("a").attr("data-state")];
                    if (num > 0) {
                        // $(this).html(data.result[$(this).parents("a").attr("data-state")]);
                        $(this).hide();
                    }
                    else {
                        $(this).hide();
                    }
                });
            }
        },

        load_data: function () {

            if (!to_end && isscrolling == false) {
                isscrolling = true;
                var url ;
                if(state == 22){
                    url = is_seller ? query_url.sellerGetRefundList:query_url.getRefundList;
                }else{
                    url = is_seller ? query_url.getOrderListBySeller : query_url.orderList;
                }

                JDSY.util.post(url, {"pageIndex": pageIndex, "orderType": state, "pageSize": pageSize}, fun.fill_list,null,false);
            }

        },

        fill_info: function (data) {

            if (data.code == 0) {
                curr_order.orderId = data.result.order.orderId;
                curr_order.shopId = data.result.order.shopId;
                curr_order.sellerId = data.result.order.sellerId;
                curr_order.buyerId = data.result.order.buyerId;
                curr_order.state = data.result.order.state;
                curr_order.yn = data.result.order.yn;
                curr_order.paymentPrice = data.result.order.paymentPrice;
                curr_order.promote_price = data.result.order.totalDiscount;
                curr_order.freight = data.result.order.freight;
                $(".order_tit .order_id").html(data.result.order.orderId);
                $(".order_tit .text-r").html(fun.get_state({
                    state: data.result.order.state,
                    yn: data.result.order.yn,
                    refund: data.result.order.refund,
                    afterService: data.result.order.afterService,
                    evaluate: data.result.order.evaluate,
                    sellerEvaluate: data.result.order.sellerEvaluate ,
                }).state);
                $(".addr .receiver").html(data.result.order.name);
                $(".addr .tel").html(data.result.order.mobile);
                $(".addr .road").html(data.result.order.fullAddress);
                $(".order-list h4 a").attr("data-shopId", data.result.order.shopId)
                $(".order-list h4 .text").html(data.result.order.shopName);
                $(".payment .text-r").html(fun.get_payment(data.result.order.paymentType) || "在线支付");
                $(".total-box .promote_price").html(data.result.order.totalDiscount);
                $(".total-box .fright_price").html(data.result.order.freight);
                if(data.result.order.invoiceTitle!=null){
                    $(".total-box .invoice").css("display","none");
                    $(".total-box .invoice-title").css("display","block");
                $(".total-box .invoice-title").html("发票抬头："+data.result.order.invoiceTitle); }
                $(".total-box .reason").html(data.result.order.memo);
                $(".total-box .payment_price").html(curr_order.paymentPrice);

                var product_list = data.result.order.items;
                var product_html = template($("#order_info").html(), {
                    product_list: product_list,
                    attr: data.result.attr,
                    pictures: data.result.pictures
                });
                $(".order-list .content").html(product_html);
                $(".order-list .content a").attr("href", "javascript:;");
                var btn = fun.get_state({
                    state: data.result.order.state,
                    yn: data.result.order.yn,
                    refund: data.result.order.refund,
                    afterService: data.result.order.afterService,
                    evaluate: data.result.order.evaluate,
                    sellerEvaluate: data.result.order.sellerEvaluate ,
                    applyForDelay : data.result.order.applyForDelay

                }).btn_html;

                if (btn == "") {
                    $(".cart").css("padding-bottom", "10px");
                    $(".p-acitonbar").hide();
                }
                else {
                    $(".cart").css("padding-bottom", "58px");
                    $(".p-acitonbar").show().find(".btn-fix").html(btn);
                }
                /**  屏蔽退款按钮  **/
                //$(".btn_refund").remove();
                //$(".btn_refundInf").remove();
                /**  屏蔽退款按钮  **/
                //$(".btn_prolong").remove();

            }
        },

        fill_addr: function (data) {
            if (data.code == 0) {

                var address;
                if (data.result.length <= 0) {
                    address = null;
                }
                else {
                    for (var i = 0; i < data.result.length; i++) {
                        if (!addressId) {
                            if (data.result[i].isDefault == 1)address = data.result[i];
                        }
                        else {
                            if (data.result[i].id == addressId)address = data.result[i];
                        }
                    }
                    if (!address)address = data.result[0];
                }
                if (address == null) {
                    $(".addr .has_addr").hide();
                    $(".addr .no-addr").show();
                }
                else {
                    $(".addr .has_addr").show();
                    $(".addr .no-addr").hide();
                    $(".addr").attr("data-addressId", address.id)
                    $(".addr .flex .name .receiver").html(address.contactPerson);
                    $(".addr .flex .name .tel").html(address.contactPhone);
                    $(".addr .flex .road span").html(address.fullAddress);
                }
            } else if (data.code == 2001) {
                $(".addr .has_addr").hide();
                $(".addr .no-addr").show();
            }

            if (comm_fun.isNotNull($(".addr").attr("data-addressId"))) {
                // alert(sku.nums)
                if (sku.skuId > 0) {
                    JDSY.util.get(query_url.getOrderDetailForDirectOrder, {
                        skuId: sku.skuId,
                        num: sku.num,
                        addressId: $(".addr").attr("data-addressId")
                    }, fun.fill_order);
                } else {
                    JDSY.util.get(query_url.getOrderInfo, {addressId: $(".addr").attr("data-addressId")}, fun.fill_order);
                }
            } else {
                if (sku.skuId > 0) {
                    JDSY.util.get(query_url.getOrderDetailForDirectOrder, {
                        skuId: sku.skuId,
                        num: sku.num
                    }, fun.fill_order);
                } else {
                    JDSY.util.get(query_url.getOrderInfo, {}, fun.fill_order);
                }
            }
        },

        fill_order: function (data) {
            if (data.code != 0)return;
            var cartlist = data.result.cart.cartShopInfo;
            $(".order_detail").html("");
            var n = 0;
            for (var i = 0; i < cartlist.length; i++) {
                var product_list_html = "";

                if (cartlist[i].totalNum > 0) {
                    n += 1;
                    if (cartlist[i].items4Shop) {
                        product_list_html += fun.fill_product(cartlist[i].items4Shop);
                    }
                    if (cartlist[i].manSuits4Shop) {
                        for (p = 0; p < cartlist[i].manSuits4Shop.length; p++) {
                            product_list_html += fun.fill_product(cartlist[i].manSuits4Shop[p].cartSkuList);

                        }
                    }
                    var order_list_html = template($("#order_list").html(), {
                        order: cartlist[i],
                        order_no: (n),
                        pro_list: product_list_html
                    });
                    $(".order_detail").append(order_list_html);
                }
            }
            $(".order_detail").css("visibility", "visible");
            order_promotionDiscount = data.result.price.promotionDiscount;
            $(".p-acitonbar .fl-r").eq(0).html("￥" + order_promotionDiscount);
            $(".p-acitonbar .fl-r").eq(1).html("￥" + data.result.price.freight);
            order_paymentPrice = data.result.price.paymentPrice;
            $(".p-acitonbar .order-price").html("￥" + order_paymentPrice);
            var pargam = {};
            if (sku.skuId > 0)  pargam = {skuId: sku.skuId, num: sku.num};
            JDSY.util.get(query_url.getCouponsToSelect, pargam, fun.get_coupon_to_select);


        },

        fill_product: function (arr) {
            var pro_html = "";
            for (var h = 0; h < arr.length; h++) {
                var product = arr[h].mainSku || arr[h];
                if (product.listState == 4 && product.isCount) {
                    skuIds += product.skuId + ",";
                    pro_html += template($("#product_list").html(), {product: product, get_price: fun.get_price});
                }
            }
            return pro_html;
        },
        get_payment: function (data) {
            var paymnet = "";
            switch (data) {
                case 1:
                    paymnet = "在线支付";
                    break;
            }
            return paymnet
        },
        fill_available_coupon_count: function (data) {
            //todo
            if (data.code == 0) {
                $(".my-item .coupon span").html(data.result);
            }
        },

        get_state: function (data) {
            var stateStr = "";
            var btn_html = "";
            if (data.yn != 1) data.state = 2;
 //data.state = 2;
            if(state != 22) {
                switch (data.state) {
                    case 0:
                        stateStr = "全部";
                        break;
                    case 1:
                        stateStr = "全部";
                        break;
                    case 2:
                        stateStr = "已取消";
                        btn_html = is_seller ? "" : btn.delete + btn.buy_again;
                        break;
                    case 10:
                        stateStr = is_seller ? "待买家付款" : "待您付款";
                        btn_html = is_seller ? btn.price_change : btn.cancel + btn.pay;
                        break;
                    case 20:
                        if (is_seller) {
                            stateStr = data.refund == 2 ? "退款中" : data.refund == 3 ? "退款完成" : "待您发货";
                            btn_html = data.refund == 2 ? btn.refundInf : data.refund == 3 ? btn.refundInf : btn.send;
                        }
                        else {
                            stateStr = data.refund == 2 ? "退款中" : data.refund == 3 ? "退款完成" : "待商家发货";
                            btn_html = data.refund == 2 ? btn.refundInf : data.refund == 3 ? btn.refundInf : btn.refund;
                        }
                        break;
                    case 30:
                        if (is_seller) {
                            stateStr = data.refund == 2 ? "退款中" : data.refund == 3 ? "退款完成" : "待买家收货";
                            btn_html = data.refund != 2 && data.refund != 3 ? "" : btn.refundInf;
                        }
                        else {

                            stateStr = data.refund == 2 ? "退款中" : data.refund == 3 ? "退款完成" : "待您收货";
                            btn_html = data.refund != 2 && data.refund != 3 ? fun.prolong_btn(data.applyForDelay) + btn.refund+ btn.receive : fun.prolong_btn(data.applyForDelay) + btn.receive + btn.refundInf;
                        }
                        break;
                    case 99:
                        stateStr = data.afterService == 2 ? "售后服务中" : "已完成";
                        if (data.afterService != 2) {
                            if (is_seller) { // 卖家
                                if (data.sellerEvaluate != 2) {
                                    btn_html = btn.comment;
                                } else {
                                    btn_html = "";
                                }
                            } else { // 买家
                                if (data.evaluate != 2) {
                                    btn_html = btn.comment + btn.delete + btn.buy_again;
                                } else {
                                    btn_html = btn.delete + btn.buy_again;
                                }
                            }
                        }
                        break;
                    case 991:
                        stateStr = "待您评价";
                        btn_html = btn.comment;
                        break;
                }
            } else {
                switch (data.refundState) {
                    case 80:
                        stateStr = "退款单已完成";
                        break;
                    case 90:
                        stateStr = "退款单已撤销";
                        break;
                    case 100:
                        stateStr = "已失效";
                        break;
                    default:
                        stateStr = "退款中";
                }
                btn_html = btn.refundInf;
            }

            var returnback = {
                state: stateStr,
                btn_html: btn_html
            }

            return returnback;
        },

        prolong_btn: function (applyForDelay) {
            return applyForDelay == true ? btn.prolong :"";
        },

        get_price: function (num, sku_arr) {
            var price = 0;
            for (ii = 0; ii < sku_arr.length; ii++) {
                if (num >= sku_arr[ii].minNum && num <= sku_arr[ii].maxNum) {
                    if (sku_arr[ii].markDownPrice > 0) {
                        price = sku_arr[ii].markDownPrice;
                    } else {
                        price = sku_arr[ii].sellPrice;
                    }
                    break;
                }
            }
            return price;
        },

        list_page_ini: function () {
            pageIndex = comm_fun.GetQueryString("pageIndex") != "" ? comm_fun.GetQueryString("pageIndex") : 1;
            state = comm_fun.GetQueryString("state") != "" && comm_fun.GetQueryString("state") != null ? comm_fun.GetQueryString("state") : state;
            if (window.fun.isapp()) {
                JDSY.session.setValue("orderId", JSON.stringify(""));
                JDSY.util.viewWillAppear(function () {
                    JDSY.session.getValue("orderId", function (data) {
                        var data = JSON.parse(data);
                        var order_obj = $(".order-goods[data-orderId=" + data.orderId + "]");
                        if ($(order_obj)) {
                            JDSY.session.setValue("orderId", JSON.stringify(""));
                            if (data.state == 50) {
                                $(order_obj).next(".total").find(".tot-text2").html("总金额：（含运费￥" + data.freight + ") ");
                                $(order_obj).next(".total").find(".tot-text3 em").html(data.primitivePrice);
                            }else if(data.refund == 2||data.refund==1){
                                var returnback = fun.get_state(data);
                                $(order_obj).parents(".order-list").find(".right_status").html(returnback.state);
                                $(order_obj).parent().find(".total").eq(1).html(returnback.btn_html);
                            }
                            else if (state != 0 && state != 1 || data.state == 88) {
                                $(order_obj).parents(".order-list").prev(".h20").hide(200, function () {
                                    $(this).remove();
                                });
                                $(order_obj).parents(".order-list").hide(200, function () {
                                    $(this).remove();
                                });
                            } else {
                                var returnback = fun.get_state(data);
                                $(order_obj).parents(".order-list").find(".right_status").html(returnback.state);
                                $(order_obj).parent().find(".total").eq(1).html(returnback.btn_html);
                            }
                        }
                    })
                });
                JDSY.util.viewRefresh(function () {
                    to_end = false,isscrolling = false,pageIndex = 1;
                    fun.load_data();
                })

            } else {
                page_set.top_bar({view: true, btn_back: true, title: "全部订单", btn_center:
                    {fun: evt.mask_change}
                ,before: $(".sort-list")});
            }
            if (!is_seller) {
                JDSY.util.post(query_url.order_statistic, {}, fun.fill_state);
            }
            $(".cart").click(evt.list_event);

            $(window).scroll(evt.scroll_event);
            $(".pay-pw").on("input", evt.pay_input_event);
            $(".m-header h1").click(evt.mask_change);
            $(".pop-layer .btn-confirm").on("click", evt.pay_confirm_event);
            $(".pop-layer .btn-cancel").click(evt.pay_cancel_event);
            $(".shadow").on("click",evt.mask_change);
            $(".mask a").click(evt.sort_tab_event);

            $(".mask a[data-state='" + state + "']").click();

            $(document).on("touchmove", function (event) {
                if (view_pop) {
                    event.preventDefault();
                }
            });
            if (window.fun.isapp()){
                JDSY.app.config({"centerBtn": {"type": "callJS", "jsData": "window.evt.mask_change();"}});
                JDSY.app.setTitle({name: stateStr,place:"centerBtn",imageName: "nav_down"});
            }
        },

        info_page_ini: function () {
            orderId = comm_fun.GetQueryString("orderId");
            if (window.fun.isapp()) {
                JDSY.util.viewWillAppear(function () {
                    JDSY.session.getValue("orderId", function (data) {
                        var data = JSON.parse(data);
                        if (parseInt(data.orderId) == parseInt(orderId)) {
                            // JDSY.session.setValue("orderId","");
                            if (data.state == 50) {
                                $(".total-box .fright_price").html(data.freight);
                                $(".total-box .payment_price").html(data.primitivePrice);
                            } else {
                                var returnback = fun.get_state(data);
                                $(".order_tit .text-r").html(returnback.state);
                                $(".p-acitonbar .btn-fix").html(returnback.btn_html);
                            }
                        }
                    })
                })
            } else {
                page_set.top_bar({view: true, btn_back: true, title: "订单详情", before: $(".cart")});
            }
            var url = is_seller ? query_url.sellerOrderDetail : query_url.orderDetail;
            JDSY.util.post(url, {"orderId": orderId}, fun.fill_info);

            $(".order-list h4 a").click(function () {
                comm_fun.open_win($(".order-list h4 .text").html(), {url: "shop.html?shopId=" + $(".order-list h4 a").attr("data-shopId")});
            });
            $(".order-list .content").click(evt.view_product);
            $(".p-acitonbar .btn-fix").click(evt.info_event);
            $(".pay-pw").on("input", evt.pay_input_event);
            $(".pop-layer .btn-confirm").on("click", evt.pay_confirm_event);
            $(".pop-layer .btn-cancel").click(evt.pay_cancel_event);

            $(document).on("touchmove", function (event) {
                if (view_pop) {
                    event.preventDefault();
                }
            });
        },
        confirm_page_ini: function () {
            if (window.fun.isapp()) {
                JDSY.session.setValue("orderAddressId", "");
                JDSY.session.getValue("sku", function (data) {
                    sku = JSON.parse(data);
                })
                JDSY.util.viewWillAppear(function (e) {
                    JDSY.session.getValue("orderAddressId", function (data) {
                        if (data != "") {
                            addressId = data.toString();
                        }
                        JDSY.util.get(query_url.address_list, {}, fun.fill_addr);

                    });
                });
            } else {
                addressId = comm_fun.GetQueryString("addressId");
                sku = JSON.parse(comm_fun.cookies.get("sku"));
                page_set.top_bar({view: true, btn_back: true, title: "订单确认", before: $(".cart")});
                JDSY.util.get(query_url.address_list, {}, fun.fill_addr);

            }
            // now we call getOrderInfo in fun.fill_addr()

            $(".addr").click(evt.address_event);
            $(".btn-pay").click(evt.confirm_event);
            $(".my-item").click(evt.show_coupon_select_event);
            $(".btn-invoice").click(evt.invoice_switch_event);
            $(".close").click(evt.coupon_tab_close_event);
            //$(".pop-layer").show();
            $(".sort-list a").on("click", evt.coupon_tab_click_event);
            $(".coupon-sel-list").on("click", evt.coupon_select_event);
            $(".add-address .m-btn").click(evt.coupon_select_confirm_event);
            $(".shadow").click(evt.coupon_select_confirm_event);
            $(document).on("touchmove", function (event) {
                if (view_pop) {
                    event.preventDefault();
                }
            });
            p_scroll = new IScroll('.coupon-sel-list', {scrollX: false, freeScroll: true, tap: true, click: false});
        },

        pay_page_ini: function () {
            orderId = comm_fun.GetQueryString("orderId"),
                paymentPrice = comm_fun.GetQueryString("price");
 var ua = window.navigator.userAgent.toLowerCase();
 if(ua.match(/MicroMessenger/i) == 'micromessenger'||window.fun.isapp()){
 $(".weixin").css("display","block");
 };
            $("#payform input[name='orderId']").val(orderId);
            $(".money .text-red").html(paymentPrice + "元");
            $("#payform input[name='device_token']").val(comm_fun.cookies.get("JSESSIONID"));
            //use session id for device token

                if(!window.fun.isapp()){
                page_set.top_bar({
                    view: true, btn_back: true, title: "收银台", before: $(".pay-c")
                });
            }
            $(".jd-pay").eq(0).click(function () {
                if (window.fun.isapp()) {
                                     var rootUrl=window.rootUrl ;
                                     JDSY.session.getValue("host",function(data){
                                                           rootUrl =  data ;
                                                           });
                    JDSY.session.getValue("deviceToken", function (data) {
                        // window.rootUrl is set in native code
                                         

                        window.location.href = rootUrl + query_url.topay + "?orderId=" + orderId + "&device_token=" + data.toString()
                    });
                } else {
                    $("#payform").attr("action", query_url.topay).submit();
                }
            });
            $(".wx-pay").click(function(){
                $("#payform").attr("action","/m/pay/toPayWx").submit();
                               
                    })

        },

        pay_succ_ini: function () {
            page_set.top_bar({view: true, title: "支付成功", before: $(".pay-status")});

            $(".pay_state").html(decodeURIComponent(escape(comm_fun.GetQueryString("msg"))));
            $(".price").html("￥" + comm_fun.GetQueryString("amount"));

            $(".link_order").click(function () {
                comm_fun.open_win("订单详情", {url: "order_info.html?orderId=" + comm_fun.GetQueryString("orderId")});
            });

            $(".link_home").click(function () {
                if(window.fun.isapp()){
                    JDSY.app.returnHomePage();
                }else {
                    comm_fun.open_win("首页", {url: "main.html"});
                }
            });
        },

        get_coupon_to_select: function (data) {
            if (data.code == 0) {
                //$(".close").click(evt.coupon_tab_close_event);
                ////$(".pop-layer").show();
                //$(".sort-list a").click(evt.coupon_tab_click_event);
                //$(".coupon-sel-list").click(evt.coupon_select_event);
                //$(".add-address .m-btn").click(evt.coupon_select_confirm_event);

                coupon_result = data.result;
                $(".sort-tap a").each(function (index, element) {
                    var state = $(element).attr("data-state");
                    if (coupon_result[state].length >= 0) {
                        $(element).find("span").html('（' + coupon_result[state].length + '）').show();
                    }
                });

                fun.fill_coupon_select_page();

            } else {
                JDSY.app.alert({msg: data.msg});
            }
        },


        fill_coupon_select_page: function () {
            var coupon_sel_list_html = template($("#coupon_sel_list").html(), {
                coupon_state: conpon_select_tab_state,
                coupon_list: coupon_result[conpon_select_tab_state]
            });
            $(".coupon-sel-list div").html(coupon_sel_list_html);
            if(conpon_select_tab_state == "availableCoupons") {
                $(".cp-category[data-couponId='" + couponid + "']").find(".cart-checkbox").addClass("checked");
            };
            p_scroll.refresh();
            var lenght = coupon_result["availableCoupons"].length;
            $(".my-item .coupon span").html(lenght);


        }

    };

    var evt = {

        list_event: function (event) {
            curr_order.order_obj = $(event.target).parents(".order-list").find(".order-goods");
            curr_order.orderId = $(curr_order.order_obj).attr("data-orderId");
            curr_order.sellerId = $(curr_order.order_obj).attr("data-sellerId");
            curr_order.buyerId = $(curr_order.order_obj).attr("data-buyerId");
            curr_order.shopId = $(curr_order.order_obj).attr("data-shopId");
            curr_order.state = $(curr_order.order_obj).attr("data-state");
            curr_order.price = (curr_order.order_obj).attr("data-paymentPrice");

            if ($(event.target).parents(".order-goods").length > 0) {
                if (state == 22) {
                    var refundId = $(curr_order.order_obj).attr("data-refundId");
                    comm_fun.open_win("退款详情",{url:"refund_info.html?orderId=" + curr_order.orderId + "&refundId=" + refundId + "&is_seller=" + is_seller});

                } else {
                    var url = is_seller ? "order_info_seller.html" : "order_info.html";
                    comm_fun.open_win("订单详情", {url: url + "?orderId=" + curr_order.orderId});
                }
            }
            if ($(event.target).parents("a").hasClass("link_shop")) {
                comm_fun.open_win("店铺详情", {url: "shop.html?shopId=" + curr_order.shopId});


            }
            if ($(event.target).hasClass("btn-t-del") || $(event.target).parent().hasClass("btn-t-del")) {
                evt.order_delete(event);
            }

            if ($(event.target).parents(".total").length > 0) {

                if ($(event.target).hasClass("btn_gopay")) {

                 comm_fun.open_win("收银台", {url: "payment.html?orderId=" + curr_order.orderId + "&price=" + curr_order.price});

                }
                if ($(event.target).hasClass("btn_close")) {
                    evt.order_close(event);
                }
                if ($(event.target).hasClass("btn_delete")) {
                    evt.order_delete(event);
                }
                if($(event.target).hasClass("btn_prolong")){
                    evt.order_prolong(event);
                }
                if ($(event.target).hasClass("btn_buyagain")) {
                    evt.order_buyagain(event);
                }

                if ($(event.target).hasClass("btn_confirm")) {
                    evt.view_pay_layer();
                }
                if ($(event.target).hasClass("btn_send")) {
                    comm_fun.open_win("发货", {url: "send.html?orderId=" + curr_order.orderId + "&buyerId=" + curr_order.buyerId + "&url=" + location.href});
                }

                if ($(event.target).hasClass("btn_price_change")) {
                    comm_fun.open_win("修改订单价格", {url: "priceChange.html?orderId=" + curr_order.orderId + "&buyerId=" + curr_order.buyerId + "&url=" + location.href});
                }
                if ($(event.target).hasClass("btn_feedback")) {
                    var url = is_seller ? "comment.html" : "evaluate.html";
                    comm_fun.open_win("商品点评", {url: url + "?orderId=" + curr_order.orderId + "&buyerId=" + curr_order.buyerId + "&url=" + location.href});
                }

            }
        },

        info_event: function (event) {
            if ($(event.target).hasClass("btn_gopay")) {

             JDSY.open_win("payment", "收银台", "payment.html?orderId=" + orderId + "&price=" + curr_order.paymentPrice);

            }
            if ($(event.target).hasClass("btn_delete")) {
                evt.order_delete(event);
            }
            if ($(event.target).hasClass("btn_close")) {
                evt.order_close(event);
            }
            if ($(event.target).hasClass("btn_buyagain")) {
                evt.order_buyagain(event);
            }
            if ($(event.target).hasClass("btn_confirm")) {
                evt.view_pay_layer();
            }
            if($(event.target).hasClass("btn_refundInf")){
                evt.refund_info();
            }
            if($(event.target).hasClass("btn_refund")){
                evt.order_refund();
            }
            if($(event.target).hasClass("btn_prolong")){
                evt.order_prolong(event);
            }
            if ($(event.target).hasClass("btn_send")) {
                comm_fun.open_win("发货", {url: "send.html?orderId=" + curr_order.orderId + "&buyerId=" + curr_order.buyerId + "&url=" + location.href});
            }
            if ($(event.target).hasClass("btn_price_change")) {
                comm_fun.open_win("修改订单价格", {url: "priceChange.html?orderId=" + curr_order.orderId + "&buyerId=" + curr_order.buyerId + "&url=" + location.href});
            }
            if ($(event.target).hasClass("btn_feedback")) {
                var url = is_seller ? "comment.html" : "evaluate.html";
                comm_fun.open_win("商品点评", {url: url + "?orderId=" + curr_order.orderId + "&buyerId=" + curr_order.buyerId + "&url=" + location.href});
            }
        },

        view_pay_layer: function () {
            $(".pop-layer").show();
            $(document.body).css("overflow", "hidden");
            view_pop = true;
        },

        hide_pay_layer: function () {
            $(".pop-layer").hide();
            $(".pay-pw").val("");
            $(".pop-pay .btn-confirm").addClass("disabled");
            $(document.body).css("overflow", "auto");
            view_pop = false;
        },

        mask_show:function(){
            view_mask = true;
            $(".m-header i").removeClass("rotate0");
            $(".m-header i").addClass("rotate180");
            $(".mask").css("display", "block");
            $(document.body).css("overflow", "hidden");
            view_pop = true;
        },

        mask_hid:function(){
            view_mask = false;
            $(".m-header i").removeClass("rotate180");
            $(".m-header i").addClass("rotate0");
            $(".mask").css("display","none");
            $(document.body).css("overflow", "auto");
            view_pop = false;
        },

        mask_change: function () {
            if (view_mask == false) {
                evt.mask_show();
                if(window.fun.isapp()){
                    JDSY.app.setTitle({name: stateStr,place:"centerBtn",imageName: "nav_up"});
                }
            } else {
                evt.mask_hid();
                if(window.fun.isapp()){
                    JDSY.app.setTitle({name: stateStr,place:"centerBtn",imageName: "nav_down"});
                }
            }
        },

        scroll_event: function () {
//            if ($(window).scrollTop() > 44) {
//                $(".sort-list").addClass("sl-fixed");
//                //$(".mask").addClass("sl-fixed");
//                $(".cart").css("padding-top", "47px");
//            }
//            else {
//                $(".sort-list").removeClass("sl-fixed");
//                //$(".mask").removeClass("se-fixed");
//                $(".cart").css("padding-top", "0");
//            }
            if (to_end == true) return;

            if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
                fun.load_data();
            }
        },

        sort_tab_event: function () {
            //0=全部 2=取消 10=待付款  20=待发货 991=待评价 99=已完成
            var to_state = $(this).attr("data-state");

            //if(to_state != state)
            {
                stateStr = $(this).html();

                if ($(".mask").css("display") == "block") {
                    $(".mask a").removeClass("cur");
                    $(this).addClass("cur");

                    evt.mask_change(stateStr);
                }

                $(".m-header h1").html(stateStr);

                state = to_state;
                pageIndex = 1;
                to_end = false;
                $(document).scrollTop(0);
                fun.load_data();
            }
        },

        pay_input_event: function () {
            if ($(this).val().length >= 6) {
                $(".pop-pay .btn-confirm").removeClass("disabled");
            } else {
                $(".pop-pay .btn-confirm").addClass("disabled");
            }
        },

        pay_confirm_event: function () {
            if ($(this).hasClass("disabled"))return;
            JDSY.util.post(query_url.order_complete, {
                "orderId": curr_order.orderId,
                "sellerId": curr_order.sellerId,
                "shopId": curr_order.shopId,
                "state": curr_order.state,
                "payPass": $(".pay-pw").val()
            }, function (data) {
                if (data.code == 0) {
                    JDSY.app.alert({msg: data.msg, type: "succ"});

                    evt.hide_pay_layer();
                    $(".pay-pw").val("");
                    if (curr_order.order_obj) {
                        if (state != 0 && state != 1) {
                            $(curr_order.order_obj).parents(".order-list").prev(".h20").hide(200, function () {
                                $(this).remove();
                            });
                            $(curr_order.order_obj).parents(".order-list").hide(200, function () {
                                $(this).remove();
                            });
                            $(curr_order.order_obj).attr("data-state", "99");
                        }
                        else {
                            $(curr_order.order_obj).parents(".order-list").find(".right_status").html("已完成");
                            $(curr_order.order_obj).parent().find(".total").eq(1).html(fun.get_state({
                                state: 99,
                                yn: 1,
                                evaluate: 1
                            }).btn_html);
                            $(curr_order.order_obj).attr("data-state", "99");

                        }
                    }
                    else {
                        if (window.fun.isapp()) {
                            JDSY.session.setValue("orderId", JSON.stringify({
                                "orderId": curr_order.orderId,
                                "state": 99
                            }));
                        }
                        ;
                        $(".order_tit .text-r").html("已完成");
                        $(".p-acitonbar .btn-fix").html(fun.get_state({state: 99, yn: 1, evaluate: 1}).btn_html);

                        curr_order.yn = 1;
                    }
                }
                else {

                    JDSY.app.alert({msg: data.msg});

                    evt.hide_pay_layer();
                    $(".pay-pw").val("");
                    setTimeout(function () {
                        evt.view_pay_layer();
                    }, 2000);
                }
            }, null, false)
        },

        pay_cancel_event: function () {
            evt.hide_pay_layer();
        },
        refund_info:function(refundId){
            comm_fun.open_win("退款详情",{url:"refund_info.html?orderId=" + curr_order.orderId + "&is_seller=" + is_seller});
        },
       order_refund:function(){
                      //alert(curr_order.state)
           var url = curr_order.state==20 ? "refund.html" : "refund_send.html";
           var pargam = {
               "state": curr_order.state,
               "orderId": curr_order.orderId,
               //refundPrice:parseFloat(curr_order.paymentPrice)-parseFloat(curr_order.freight),
               refundPrice:curr_order.paymentPrice,
               freight:curr_order.freight ,
           };
           url = comm_fun.GetUrlString(url,pargam);
             comm_fun.open_win("申请退款",{url:url});
       },
        order_delete: function () {
            JDSY.app.confirm({title: "确定要删除此订单？"}, function () {
                JDSY.util.post(query_url.order_delete, {
                    "orderId": curr_order.orderId,
                    "sellerId": curr_order.sellerId,
                    "shopId": curr_order.shopId,
                    "state": curr_order.state
                }, function (data) {
                    if (data.code == 0) {
                        JDSY.app.alert({msg: "订单删除成功", type: "succ"});
                        if (curr_order.order_obj) {
                            $(curr_order.order_obj).parents(".order-list").prev(".h20").hide(200, function () {
                                $(this).remove();
                            });
                            $(curr_order.order_obj).parents(".order-list").hide(200, function () {
                                $(this).remove();
                            });
                        }
                        else {
                            if (window.fun.isapp()) {
                                JDSY.session.setValue("orderId", JSON.stringify({
                                    "orderId": curr_order.orderId,
                                    "state": 88
                                }));
                                setTimeout(function () {
                                    JDSY.app.closeWin();
                                }, 500);
                            } else {
                                comm_fun.open_win("我的订单", {url: "order.html"});
                            }
                        }
                    }
                    else {
                        JDSY.app.alert({msg: data.msg});
                    }

                },null,true);
            });
        },

        order_close: function (event) {
            JDSY.app.confirm({title: "确定要取消此订单？"}, function () {
                JDSY.util.post(query_url.order_cancel, {
                    "orderId": curr_order.orderId,
                    "sellerId": curr_order.sellerId,
                    "shopId": curr_order.shopId,
                    "state": curr_order.state
                }, function (data) {
                    if (data.code == 0) {
                        JDSY.app.alert({msg: "订单取消成功", type: "succ"});
                        if (curr_order.order_obj) {
                            if (state != 0 && state != 1) {
                                $(curr_order.order_obj).parents(".order-list").prev(".h20").hide(200, function () {
                                    $(this).remove();
                                });
                                $(curr_order.order_obj).parents(".order-list").hide(200, function () {
                                    $(this).remove();
                                });
                            } else {
                                $(curr_order.order_obj).parents(".order-list").find(".right_status").html("取消");
                                $(curr_order.order_obj).parent().find(".total").eq(1).html(fun.get_state({
                                    state: 2,
                                    yn: 2
                                }).btn_html);
                                $(curr_order.order_obj).attr("data-yn", "2");
                            }
                        }
                        else {
                            if (window.fun.isapp()) {
                                JDSY.session.setValue("orderId", JSON.stringify({
                                    "orderId": curr_order.orderId,
                                    "state": 2
                                }))
                            }
                            $(".order_tit .text-r").html("取消");
                            $(".p-acitonbar .btn-fix").html(fun.get_state({state: 2, yn: 1}).btn_html);
                            curr_order.yn = 1;
                        }
                    }
                    else {
                        JDSY.app.alert({msg: data.msg});
                    }

                });
            });
        },

        order_prolong: function (event) {
            JDSY.app.confirm({title: "是否确认延长收货时间<br> 每笔订单只能延长一次"}, function () {
                JDSY.util.post(query_url.applyForDelay, {orderId: curr_order.orderId}, function (data) {
                    if (data.code == 0) {
                        JDSY.app.alert({msg: "延长收货成功", type: "succ"});
                        $(event.target).remove();
                    } else {
                        JDSY.app.alert({msg: data.msg})
                    }
                }, null, true)
            });
        },

        order_buyagain: function (event) {
            JDSY.util.post(query_url.buy_again, {orderId: curr_order.orderId}, function (data) {
                if (data.code == 0) {
                    comm_fun.open_win("购物车", {url: "exchange.html?orderId=" + curr_order.orderId});
                }
                else {
                    JDSY.app.alert({msg: data.msg});
                }
            });
        },

        view_product: function (event) {
            if ($(event.target).hasClass("goods-total") || $(event.target).parents(".goods-total").length > 0)return;
            if ($(event.target).parents(".goods-num").length > 0) {
                comm_fun.open_win("商品详情", {url: "product.html?itemID=" + $(event.target).parents(".goods-num").attr("data-itemID")});
            }
        },

        address_event: function (event) {
            if ($(".addr").attr("data-addressId")) {
                if (window.fun.isapp()) {
                    JDSY.app.openWin("addr_sel", {
                        "type": "openWin",
                        "name": "addr_sel",
                        "title": "地址选择",
                        "hideBottomBar": true,
                        "hideTitleBar": false,
                        "showBack": true,
                        "showRight": true,
                        "rightBtnName": "管理",
                        "url": "addr_sel.html?addressId=" + $(this).attr("data-addressId"),
                        "urlType": "file",
                        "pullToRefresh": false,
                        "loginCheck": true,
                        "returnRank": 1,
                        "initData": {}
                    })
                } else {
                    comm_fun.open_win("地址选择", {url: "addr_sel.html?addressId=" + $(this).attr("data-addressId")});
                }
            }
            else {
                comm_fun.open_win("地址新建", {url: "addr_add.html?from=orderconfirm"});
            }
        },

        show_coupon_select_event: function () {
            $(".mask").css("display","block");
            $(".p-cover").show(0).addClass("show");
            $(document.body).css("overflow", "hidden");
            p_scroll.refresh();
            view_pop =   true;

        },

        coupon_tab_close_event: function () {
            $(".mask").css("display","none");
            $(document.body).css("overflow", "auto");
            view_pop = false;

            $(".p-cover").removeClass("show");
            setTimeout(function () {
                $(".p-cover").hide();
            }, 200);
        },

        coupon_tab_click_event: function () {
            var to_state = $(this).attr("data-state");
            if (to_state != conpon_select_tab_state) {
                $(".sort-list li").removeClass("on");
                $(this).parents("li").addClass("on");
                conpon_select_tab_state = to_state;
                fun.fill_coupon_select_page();
            }
        },

        coupon_select_event: function (event) {
            if (conpon_select_tab_state == "unavailableCoupons")return;
            //if ($(event.target).hasClass("cart-checkbox")) {
            var checkbox = $(event.target).parents(".ui-flex").find(".cart-checkbox");
            if ($(checkbox).hasClass("checked")) {
                $(checkbox).removeClass("checked");
            } else {
                $(checkbox).parents(".coupon-sel-list").find(".cart-checkbox").removeClass("checked");
                $(checkbox).addClass("checked");
                couponid = $(checkbox).parents(".cp-category").attr("data-couponid");
            }
            //}
        },

        coupon_select_confirm_event: function () {
            var denomination = $(".p-cover .checked").parents(".cp-category").attr("data-denomination");
            if (denomination == undefined)
            {   denomination = 0;
                $(".my-item .text2").html("未使用");
            }else{
                $(".my-item .text2").html("已使用");
            }

          var payment_denomination = parseFloat(order_promotionDiscount) + parseFloat(denomination);
            var paymentPrice = parseFloat(order_paymentPrice) - parseFloat(denomination);
            $(".p-acitonbar .fl-r").eq(0).html("￥" + payment_denomination);
            $(".p-acitonbar .order-price").html("￥" + paymentPrice);


            evt.coupon_tab_close_event();


        },

        invoice_switch_event: function (event) {
            if ($(event.target).hasClass("on")) {
                $(event.target).removeClass("on");
                $(".invoice-title").hide();
            } else {
                $(event.target).addClass("on");
                $(".invoice-title").show();
            }
            invoice_yes = $(event.target).hasClass("on");
        },

        confirm_event: function () {
            if (!can_sub)return;
            if (skuIds.length == 0) {
                JDSY.app.alert({msg: "订单内商品为空，请返回购物车重新选择"})
                return;
            }
            var invoice_title = $(".ipt-type").val();
            if (invoice_yes && comm_fun.isNull(invoice_title)) {
                JDSY.app.alert({msg: "请填写发票抬头"});
                return;
            }
            var messageJSON = {};
            $(".order-list .memo").each(function (index, element) {
                var message = $(element).val();
                if (comm_fun.isNotNull(message)) {
                    var shop_id = $(element).parents(".order-list").find(".order-list-shop-id").attr("data-shopId");
                    messageJSON[shop_id] = message;
                }
            });
            var url = sku.skuId > 0 ? query_url.submitDirectOrder : query_url.order_submit;
            var pagam = sku.skuId > 0 ? {
                "invoice": invoice_yes ? 2 : 1,
                "invoiceTitle": invoice_title,
                "paymode": 0,
                "addressId": $(".addr").attr("data-addressId"),
                "skuId": sku.skuId,
                "num": sku.num,
                "message": JSON.stringify(messageJSON),
                "couponId": couponid
            } :
            {
                "invoice": invoice_yes ? 2 : 1,
                "invoiceTitle": invoice_title,
                "paymode": 0,
                "addressId": $(".addr").attr("data-addressId"),
                "skuIds": skuIds.substr(0, skuIds.length - 1),
                "message": JSON.stringify(messageJSON),
                "couponId": couponid


            };
            var price = $(".p-acitonbar .order-price").html().substr(1);
            JDSY.util.post(url, pagam, function (data) {
                if (data.code == 0) {
                    comm_fun.open_win("收银台", {url: "payment.html?orderId=" + data.result.orderId + "&price=" + price});

                } else {
                    JDSY.app.alert({msg: data.msg});
                    can_sub = true;
                }
            }, false);
            can_sub = false;
        }
    };

    window.evt = evt;
    $(document.body).ready(function () {
        JDSY.ready(function () {
            FastClick.attach(document.body);

            if (location.pathname.indexOf("order") > 0) {
                if (location.pathname.indexOf("_info") > 0) {
                    fun.info_page_ini();
                }
                else if (location.pathname.indexOf("_confirm") > 0) {
                    fun.confirm_page_ini();
                }
                else {
                    fun.list_page_ini();
                }
            }

            if (location.href.indexOf("payment") >= 0) {
                fun.pay_page_ini();
            }

            if (location.href.indexOf("_succ") >= 0) {
                fun.pay_succ_ini();
            }
        });
    });

})();
