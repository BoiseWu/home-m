/**
 * Created by iikevin on 16/1/19.
 */
(function(){

    var orderId,buyerId,url;
    var order_info = {};
    var  price = 0;

    var fun = {

        pricrChangeFill : function(data){



            
            if(data.code != 0)return;
            order_info.primitivePrice = data.result.order.totalPrice;
            order_info.freight = data.result.order.freight;
            order_info.discountPrice = data.result.order.totalDiscount;
            $("input[name='orderId']").val(data.result.order.orderId);
            $("input[name='buyerId']").val(data.result.order.buyerId);
            $(".send-order .orderId").html(data.result.order.orderId);
            $(".send-order .static").html(fun.get_state({state:data.result.order.state,yn:data.result.order.yn,refund:data.result.order.refund,afterService:data.result.order.afterService}));
            $(".send-order .primitivePrice .txt-price").html("￥"+data.result.order.totalPrice);
            $(".send-order .freight .txt-price").html("￥"+data.result.order.freight);
            $(".send-order .discountPrice .txt-price2").html("￥-"+data.result.order.totalDiscount);
            $(".send-order .primitivePrice input").val(data.result.order.totalPrice);
            $(".send-order .freight input").val(data.result.order.freight);
            $(".send-order .discountPrice input").val(data.result.order.totalDiscount);
            $(".p-acitonbar .total_pay").html("￥"+data.result.order.paymentPrice);
        },

        sendFill : function(data){
            if(data.code != 0)return;
            $("input[name='orderId']").val(data.result.order.orderId);
            $("input[name='buyerId']").val(data.result.order.buyerId);
            $(".orderId").html(data.result.order.orderId);
            $(".h3_tit .text-r").html(fun.get_state({state:data.result.order.state,yn:data.result.order.yn,refund:data.result.order.refund,afterService:data.result.order.afterService}));
            $(".addr .overf-text").html(data.result.order.fullAddress);
            $(".addr .addr_name").html(data.result.order.name);
            $(".addr .addr_tel").html(data.result.order.mobile);
            var attr = data.result.attr;
            for(p in attr){
                for(var i=0; i<attr[p].length; i++){
                    attr[p][i].attrValueName = attr[p][i].attrValueName.replace(/#[0-9a-fA-F]{3,6}:/g,"");
                }
            }
            var pro_html = template($("#pro_list").html(),{list:data.result.order.items,pictures:data.result.pictures,attr:attr,formatImg:comm_fun.formatImg});
            $(".order-list .content").html(pro_html);
        },

        commentFill : function(data){
            if(data.code != 0)return;
            $("input[name='orderId']").val(data.result.order.orderId);
            $("input[name='score']").val(0);
            $(".order-list .orderId").html(data.result.order.orderId);
            $(".order-list .order_time").html(comm_fun.get_date(data.result.order.orderTime).txt);
            var img_html = template($("#pro_img").html(),{list:data.result.order.items,pictures:data.result.pictures,formatImg:comm_fun.formatImg});
            $(".goods-num").html(img_html);
        },

        priceChangeIni : function(){
            if (!window.fun.isapp()) {
                page_set.top_bar({view: true, btn_back: true, title: "修改订单价格", before: $(".send-order")});
            }
            JDSY.util.post(query_url.sellerOrderDetail,{"orderId":orderId},fun.pricrChangeFill);
            $("input").on("blur",evt.inputEvt);
            $(".p-acitonbar .btn-pay").on("click",evt.priceChangeEvt);
        },

        get_state : function(data){
            var state = "";
            if(data.yn != 1) data.state = 2;

            switch (data.state){
                case 0:
                    state = "全部";
                    break;
                case 2:
                    state = "取消";
                    break;
                case 10:
                    state = "待买家付款";
                    break;
                case 20:
                    state = data.refund == 2 ? "退款中" : data.refund == 3 ? "退款完成" : "待发货";
                    break;
                case 30:
                    state = data.refund == 2 ? "退款中" : data.refund == 3 ? "退款完成" : "待收货";
                    break;
                case 991:
                    state = "已完成";
                    break;
                case 99:
                    state = data.afterService == 2 ? "售后服务中" : "已完成";
                    break;
            }
            return state;
        },

        getParam : function(){
            var param = {};
            var form_obj = $("input,textarea,select");
            for(var i=0; i<form_obj.length; i++){
                if($(form_obj).eq(i).is("input") || $(form_obj).eq(i).is("textarea")){
                    if($(form_obj).eq(i).attr("name")!= undefined){
                    param[$(form_obj).eq(i).attr("name")] = $(form_obj).eq(i).val();}
                }
                else if($(form_obj).eq(i).is("select")){
                    if($(form_obj).eq(i).attr("name")!= undefined){
                    param[$(form_obj).eq(i).attr("name")] = $(form_obj).find("option:selected").val();}
                }
            }
            return param;
        },

        sendPageIni : function(){
            if (!window.fun.isapp()) {
                page_set.top_bar({view: true, btn_back: true, title: "发货", before: $(".cart")});
            }
            JDSY.util.post(query_url.sellerOrderDetail,{"orderId":orderId},fun.sendFill);
            $(".add-address .m-btn").on("click",evt.sendEvt);
        },

        commentPageIni : function(){
            if (!window.fun.isapp()) {
                page_set.top_bar({view: true, btn_back: true, title: "评价", before: $(".order-list")});
            }
            JDSY.util.post(query_url.sellerOrderDetail,{"orderId":orderId},fun.commentFill);
            $(".star,.star-df2,.star-yl2").on("click",evt.starEvt);
            $(".add-address .m-btn").on("click",evt.commentEvt);
        },
    };

    var evt = {

        inputEvt : function(){
            var viewer = $(this).parents(".bt-div").find(".txt-price,.txt-price2");
            var names = $(this).parents(".bt-div").attr("class").replace("bt-div ","");
            $(this).val(parseInt($(this).val() * 100)/100);
            //if($(this).val() < 0)$(this).val(order_info[names]);
            //if($(viewer).parents(".bt-div").hasClass("primitivePrice")){
            //    if($(this).val() <= parseInt($(".bt-div .txt-price2").html().substring(2)))$(this).val(order_info[names])
            //}
            //if($(viewer).parents(".bt-div").hasClass("discountPrice")){
            //    if($(this).val() >=parseInt($(".total_price").val())||$(this).val()<order_info[names])$(this).val(order_info[names])
            //}
           // $(viewer).html(($(viewer).attr("class").indexOf("2") > 0 ? "￥-" : "￥") + $(this).val());
            price  = Number($(".primitivePrice input").val()) + Number($(".freight input").val()) - Number($(".discountPrice input").val());
            price = price.toFixed(2);
            $(".p-acitonbar .total_pay").html("￥"+ price);
        },

        priceChangeEvt : function(){
            var param = fun.getParam();
            var priceStr =$(".p-acitonbar .total_pay").html().split("￥")[1];
            price = parseFloat(priceStr);
            if(param.primitivePrice == order_info.primitivePrice){
                JDSY.app.alert({msg:"商品价格没有改动"});
                return ;
            }
            if(parseFloat(param.discountPrice>parseFloat(param.primitivePrice))){
                JDSY.app.alert({msg:"商品总额必须不小于优惠总额"})  ;
                return;
            }
            if(price<=0){
                JDSY.app.alert({msg:"总价必须大于0"});
                return;
            }
            JDSY.util.post(query_url.modifyOrderPrice,param,function(data){
                if(data.code == 0){
                    JDSY.app.alert({msg:"修改成功",type:"succ"});
                    setTimeout(function(){
                        if (window.fun.isapp()) {
                            JDSY.session.setValue("orderId", JSON.stringify({"orderId": orderId, "state": 50, "primitivePrice": price, "freight": param.freight}));
                            JDSY.app.closeWin()
                        } else {
                            comm_fun.open_win("我的订单", {url: url})
                        }
                    },2000)
                }
            });
        },

        sendEvt : function(){
            if($("input[name='companyName']").val() == ""){
                $("input[name='companyName']").focus();
                JDSY.app.alert({msg:"物流公司不能为空"});
                return;
            }
            if( $("input[name='deliveryId']").val() == ""){
                $("input[name='deliveryId']").focus();
                JDSY.app.alert({msg:"运单号不能为空"});
                return;
            }
            var param = fun.getParam();
            param.orderId = orderId;
            param.buyerId = buyerId;
            JDSY.util.post(query_url.addDeliveryInfos,param,function(data){
                if(data.code == 0){
                    JDSY.app.alert({msg:"发货成功",type:"succ"});
                    setTimeout(function(){
                        if (window.fun.isapp()) {
                            JDSY.session.setValue("orderId", JSON.stringify({"orderId": orderId, "state": 30,"yn":1}));
                            JDSY.app.closeWin()
                        } else {
                            comm_fun.open_win("我的订单", {url: url});
                        }
                    },2000)
                }else {
                    JDSY.app.alert({msg: data.msg});
                }
            });

        },

        starEvt : function(event){
            event = window.event || event;
            event.stopPropagation();
            var score = Math.ceil(event.offsetX/20);
            $("input[name='score']").val(score);
            $(".star-yl2").css("width",(score/5 * 100)+"%");
        },

        commentEvt : function(){
            var param = fun.getParam();
            param.buyerId = buyerId;
            if (param["score"] <= 0){
                JDSY.app.alert({msg:"评价至少为一星!"})
                return;
            }
            if($("textarea[name='comment']").val() == ""){
                $("input[name='comment']").focus();
                JDSY.app.alert({msg:"评论不能为空"});
                return;
            }
            JDSY.util.post(query_url.commentToBuyer,param,function(data){
                if(data.code == 0){
                    JDSY.app.alert({msg:"评论成功",type:"succ"});
                    setTimeout(function(){
                        if (window.fun.isapp()) {
                            JDSY.session.setValue("orderId", JSON.stringify({"orderId": orderId, "state": 99, "sellerEvaluate": 2}));
                            JDSY.util.closeWin();
                        } else {
                            comm_fun.open_win("我的订单", {url: url})
                        }
                    },2000)
                }
            });
        },
    };

    $(document.body).ready(function(){
        JDSY.ready(function() {
            FastClick.attach(document.body);

            orderId = comm_fun.GetQueryString("orderId");
            buyerId = comm_fun.GetQueryString("buyerId");
            url = comm_fun.GetQueryString("url");

            if(location.href.indexOf("price") > 0){
                fun.priceChangeIni();
            }
            if(location.href.indexOf("send") > 0){
                fun.sendPageIni();
            }
            if(location.href.indexOf("comm") > 0){
                fun.commentPageIni();
            }
        });
    });

})();