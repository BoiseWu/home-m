(function(){

    var orderId;
    var url;

    var fun = {

        fillEvalList :  function (data){
            if(data.code != 0)return;
            var order = data.result.order;
            var product_html = template($("#goods_list").html(), order);
            $('#goods').append(product_html);
            var pictures = data.result.pictures;
            for(var i=0; i<order.items.length; i++){
                var skuId = order.items[i].skuId;
                $(".img_sku_" + skuId).attr("src", comm_fun.formatImg(pictures[skuId], 220, 220));
            }
        },

        loadEvalData : function () {
            JDSY.util.post(query_url.orderDetail,{"orderId":orderId},fun.fillEvalList,null, true);
        },

        evalPageIni : function(){
            orderId = comm_fun.GetQueryString("orderId");
            url = comm_fun.GetQueryString("url");
            fun.loadEvalData();
            $(".m-btn").click(evt.evalSubmitEvent);
            $(".star-yl2,.star-df2").click(evt.starEvent);
            $("#goods").on("click",".star-yl2,.star-df2",evt.starEvent);
        },

        emptyCheck : function(){
            var can_sub = true;
            $("textarea").each(function(){
                if($(this).val().length < 3 || $(this).val().length > 500 ){
                    can_sub = false;
                }
            });
            return can_sub;
        },

        startCheck : function(){
            var  can_sub = true;
            $(".star-yl2").each(function () {
                if ($(this).width() / 20 < 1) {
                    can_sub = false;
                    return false;
                }
            });
            return can_sub;
        }

    };

    var evt = {
        evalSubmitEvent: function () {
            var can_start = fun.startCheck();
            if (can_start == false) {
                JDSY.app.alert({msg: "每条评论至少为一星!"});
                return;
            }
            var can_submit = fun.emptyCheck();
            if(can_submit == false){
                JDSY.app.alert({msg:"商品评论长度必须为3到500个字符!"});
                return;
            }
            JDSY.util.post(query_url.evaluate, comm_fun.getFormParam('#form'), function(data){
                if(data.code == 0){
                    JDSY.app.alert({type:"succ",msg:"评价成功"});
                    setTimeout(function(){
                        if(window.fun.isapp()){
                            JDSY.session.setValue("orderId",JSON.stringify({"orderId":orderId,"state":99,"evaluate":2}))
                            JDSY.app.closeWin();
                        }else {
                            comm_fun.open_win((url.indexOf("_info") >= 0 ? "订单详情" : "我的订单"),{url:url});
                        }
                    },2000);
                }
            });
        },
        starEvent : function(e){
            var object;
            var next;
            object = $(this).parents(".star");
            next = $(object).next("input");
            var score = Math.ceil(e.offsetX/20);
            $(next).val(score);
            var per = score/5 * 100;
            $(object).find(".star-yl2").css("width", per+'%');
        }
    };

    $(document.body).ready(function(){
        JDSY.ready(function(){
            FastClick.attach(document.body);

            fun.evalPageIni();

        });
    });
})();
