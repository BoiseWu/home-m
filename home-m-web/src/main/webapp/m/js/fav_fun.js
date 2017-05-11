(function(){

    var view_kind = "", edit_mode = false;
    var sels = 0;
    var isEnd = false,isScrolling = false;
    var pageNo = 1,pageSize = 10 ;
 var item = 0,shop = 0;
    var fun = {

        fillCount : function(data){
          if(data.code == 0){
             item = data.result.item;
             shop = data.result.shop;
              $(".sort-list .product a").html("货品（"+ item +"）");
              $(".sort-list .shop a").html("供应商（"+ shop +"）");
          }
        },

        fillFavItems : function(data){
            isScrolling = false;
            if(data.code == 0){
                if(data.result.items.length > 0){

                    $(".order-list").show();
                    $(".no-page").hide();
                    var item_list = data.result.items;
                    var shop_list = data.result.shopInfoList
                    for(var i=0; i<item_list.length; i++){
                        item_list[i] = fun.getShopInfo(item_list[i],shop_list);
                    }
                    var html = template($("#fav_pro").html(),{list:item_list});
                    if(pageNo == 1){
                        $(".order-list ul").html(html);
                    }else{
                        $(".order-list ul").append(html);
                    } ;
                    if(data.result.items.length<pageSize){
                        isEnd = true;
                    }else{
                        isEnd = false;
                        pageNo += 1;
                    };
                }
                else{
                    isEnd = true;
                    if(pageNo == 1) {
                        $(".order-list").hide();
                        $(".no-page").show().find("p").html("您还未收藏过任何商品哦");
                    }
                }
            }else{
                if(data.code==2001){
                    $(".order-list").hide();
                    $(".no-page").show().find("p").html("您还未收藏过任何商品哦");
                }else{
                $(".order-list").hide();
                $(".no-page").show().find("p").html("获取信息失败");
            }}
            $(".p-acitonbar .cart-checkbox").removeClass("checked");
        },

        getShopInfo : function(items_obj,shop_arr){
            for(var p=0; p<shop_arr.length; p++){
                if(shop_arr[p].shopId == items_obj.shopId){
                    items_obj.shopName = shop_arr[p].shopName;
                    items_obj.initialAmount = shop_arr[p].initialAmount;
                    items_obj.provinceName = shop_arr[p].provinceName;
                    items_obj.cityName = shop_arr[p].cityName;
                    break;
                }
            }
            return items_obj;
        },

        fillFavShops : function(data){
            isScrolling = false;
            if(data.code == 0){
                if(data.result.length > 0) {
                    $(".order-list").show();
                    $(".no-page").hide();

                    var html = template($("#fav_sup").html(), {list: data.result});
                    if(pageNo==1) {
                        $(".order-list ul").html(html);
                    }else{
                        $(".order-list ul").append(html);
                    }
                    if(data.result.length<pageSize){
                        isEnd = true;
                    }else{
                        isEnd = false;
                        pageNo += 1;
                    }
                }
                else{
                    isEnd = true;
                    if(pageNo==1) {
                        $(".order-list").hide();
                        $(".no-page").show().find("p").html("您还未收藏过任何店铺哦");
                    }
                }
            }else{
                if(data.code==2001){
                    $(".order-list").hide();
                    $(".no-page").show().find("p").html("您还未收藏过任何店铺哦");
                }else{
                $(".order-list").hide();
                $(".no-page").show().find("p").html("获取信息失败");
                }
            }
            $(".p-acitonbar .cart-checkbox").removeClass("checked");
        },

        toEdit : function(){

            if ($(".order-list .cart-checkbox").length <= 0)return;
            edit_mode = true;
            if (window.fun.isapp()) {
                var title = view_kind == "product" ? "编辑收藏的商品" : "编辑收藏的店铺"
                JDSY.app.setTitle({name: "完成", place: "rightBtn"});
                JDSY.app.setTitle({name: title});
                JDSY.app.config({"rightBtn": {"type": "callJS", "jsData": "window.fav_fun.toNor();"}});
            } else {
                page_set.top_bar({view: true, btn_back: true, title: (view_kind == "product" ? "编辑收藏的商品" : "编辑收藏的店铺"), btn_right: [
                    {tit: "完成", css: "btn-link", fun: fun.toNor}
                ], before: $(".sort-list")});
            }

            $(".sort-list").hide();
            $(".p-acitonbar").show();
            $(".order-list").removeClass("ol_nor");
        },

        toNor: function () {
            edit_mode = false;
            if (window.fun.isapp()) {
                JDSY.app.setTitle({name: "编辑", place: "rightBtn"});
                JDSY.app.setTitle({name: "我的收藏"});
                JDSY.app.config({"rightBtn": {"type": "callJS", "jsData": "window.fav_fun.toEdit();"}})

            } else {
                page_set.top_bar({view: true, btn_back: true, title: "我的收藏", btn_right: [
                    {tit: "编辑", css: "btn-link", fun: fun.toEdit}
                ], before: $(".sort-list")});
            }
            $(".sort-list").show();
            $(".p-acitonbar").hide();
            $(".order-list").addClass("ol_nor");
        },

        selAll : function(){
            $(".order-list .cart-checkbox").addClass("checked");
        },

        unSelAll : function(){
            $(".order-list .cart-checkbox").removeClass("checked");
        },

        checkSel : function(){
            var sel_obj = {};
            var lists = $(".order-list .checked");
 
            sel_obj.itemIds = "", sel_obj.shopIds = "";
            for(var i=0; i<lists.length; i++){
                    sel_obj.itemIds += (i==0 ? "" : ",") + $(lists).eq(i).parents("li").attr("data-itemId");
                    sel_obj.shopIds += (i==0 ? "" : ",") + $(lists).eq(i).parents("li").attr("data-shopId");
                }
           
            return sel_obj;
        },

        delSelect : function(sel_obj){
            var lists = $(".order-list .cart-checkbox");
            var del_url = view_kind == "product" ? query_url.batchDelItems : query_url.batchDelShops;
            var param = view_kind == "product" ? {itemIds:sel_obj.itemIds} : {shopIds:sel_obj.shopIds};
            JDSY.util.post(del_url,param,function(data){
                if(data.code == 0){
                           JDSY.app.alert({msg:data.msg,type:"succ"});
                    for(var i=0; i<$(lists).length; i++){
                        if($(lists).eq(i).hasClass("checked")){
                            $(lists).eq(i).parents("li").remove();
                        }
                    }
                    fun.getFavCount();
                    sels = 0;
                    if($(".order-list li").length <= 0){
                        fun.toNor();
                        $(".order-list").hide();
                        $(".no-page").show().find("p").html("您还未收藏过任何"+ (view_kind == "product" ? "商品" : "店铺") +"哦");
                    }
                }
            },null,true);
        },

        getFavCount : function(){
            JDSY.util.post(query_url.getFavCount,{},fun.fillCount,null,true);
        },

        getFavList : function(){
          if(!isEnd && isScrolling == false) {
              isScrolling = true;
              sels = 0;
              if (view_kind == "product") {
                  //if(fornt_view==view_kind) return;
                  JDSY.util.post(query_url.getItemFav, {
                      pageNo: pageNo,
                      pageSize: pageSize
                  }, fun.fillFavItems, window.fun.isapp() ? JDSY.defaultHttpFailureCallback : null, false);
                  //fornt_view=view_kind;
              }
              else {
                  //if(fornt_view==view_kind) return;
                  JDSY.util.post(query_url.getShopFav, {
                      pageNo: pageNo,
                      pageSize: pageSize
                  }, fun.fillFavShops, window.fun.isapp() ? JDSY.defaultHttpFailureCallback : null, false);
                  //fornt_view=view_kind;
              }
          }
        },

        page_ini : function(){

            if (window.fun.isapp()) {
                JDSY.app.config({"rightBtn": {"type": "callJS", "jsData": "window.fav_fun.toEdit();"}})
                JDSY.session.setValue("fav",JSON.stringify(""));
                JDSY.util.viewWillAppear(function () {
                    JDSY.session.getValue("fav", function (data) {
                        var data = JSON.parse(data);
                        if (data.favId && data.state == 0) {
                            JDSY.session.setValue("fav",JSON.stringify(""));
                            if (view_kind == "product") {
                                $(".order-list li[data-itemid='" + data.favId + "']").remove();
                                item = item - 1 < 0 ? 0 : item - 1;
                                $(".sort-list .product a").html("货品（" + item + "）");
                            } else {
                                $(".order-list li[data-shopid='" + data.favId + "']").remove();
                                shop = shop - 1 < 0 ? 0 : shop - 1;
                                $(".sort-list .shop a").html("供应商（" + shop + "）");
                            }
                            if ($(".order-list li").length <= 0) {
                                fun.toNor();
                                $(".order-list").hide();
                                $(".no-page").show().find("p").html("您还未收藏过任何" + (view_kind == "product" ? "商品" : "店铺") + "哦");
                            }
                        }
                    })
                })
            } else {
                page_set.top_bar({
                    view: true, btn_back: true, title: "我的收藏", btn_right: [
                        {tit: "编辑", css: "btn-link", fun: fun.toEdit}
                    ], before: $(".sort-list")
                });
            }
           // fun.getFavCount();

            $(".sort-list li").click(evt.tabEvent);
            $(".sort-list li").eq(0).click();
            $(".order-list").on("click",".cart-checkbox",evt.selEvent);
            $(".order-list").on("click",".goods-box",evt.viewPage);
            $(".p-acitonbar").on("click",".cart-checkbox",evt.selAllEvent);
            $(".p-acitonbar").on("click",".btn-pay",evt.delEvent);
            $(window).scroll(evt.scrollEvent);
            $(".btn-rhome").on("click", function () {
                if (window.fun.isapp()) {
                    JDSY.app.returnHomePage();
                } else {
                    comm_fun.open_win("首页", {url: "main.html"});
                }
            });
        }
    };
    var evt = {
        tabEvent : function(){

            $(".sort-list li").removeClass("on");
            $(this).addClass("on");
            view_kind = $(this).attr("data-kind");
            pageNo = 1;
            isEnd = false;

            fun.getFavList();
            fun.getFavCount();
        },
        scrollEvent:function(){
               if(isEnd||isScrolling)return;
            if($(window).scrollTop() + $(window).height() >= $(document).height()){
                fun.getFavList();
            }
        },

        selEvent : function(){
            if($(this).hasClass("checked")){
                $(this).removeClass("checked");
                sels -= 1;
                $(".p-acitonbar .cart-checkbox").removeClass("checked");
            }
            else{
                $(this).addClass("checked");
                sels += 1;
                if(sels >= $(".order-list .cart-checkbox").length){
                    $(".p-acitonbar .cart-checkbox").addClass("checked");
                }
            }
        },

        viewPage : function(){
            if(edit_mode){
                $(this).parents("li").find(".cart-checkbox").click();
                return;
            }
            if(view_kind == "product"){
                comm_fun.open_win("商品详情",{url:"product.html?itemID="+$(this).parents("li").attr("data-itemId")});
            }
            else{
                comm_fun.open_win("店铺详情",{url:"shop.html?shopId="+$(this).parents("li").attr("data-shopId")});
            }
        },

        selAllEvent : function(){
            if($(this).hasClass("checked")){
                fun.unSelAll();
                $(this).removeClass("checked");
            }
            else{
                fun.selAll();
                $(this).addClass("checked");
            }
        },

        delEvent : function(){
            var sel_obj = fun.checkSel();
            if(sel_obj.itemIds == "" || sel_obj.shopIds == ""){
                JDSY.app.alert({msg:"还没做出选择"});
                return;
            }
            JDSY.app.confirm({title:"确定要删除选中的收藏？"},function(){
                fun.delSelect(sel_obj);
            },null);
        }
    };

    window.fav_fun = fun;
    $(document.body).ready(function(){
            JDSY.ready(function(){
                FastClick.attach(document.body);
                
                fun.page_ini();
            });
        }
    );

})()