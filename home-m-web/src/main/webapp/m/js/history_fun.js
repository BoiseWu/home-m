(function(){

    var pageIndex = 1, pageSize = 5;
    var to_end = false;
    var cid=1000071;
    var sels = 0;
    var edit_mode = false;
    var isScrolling = false;
    var oldDate = '';
    var fun = {

        fill_list : function(data){
            isScrolling = false;
            if(data.code == 0){
                var list = data.result;
                if(list.length <= 0){
                    $(".no-page").css("display", pageIndex == 1 ? "block" : "none");
                    $(".loading-bg").css("display","none");
                    if(pageIndex == 1)$(".cart").html("");
                    to_end = true;
                }
                else{
                    $(".no-page").css("display", "none");
                    $(".loading-bg").css("display",pageIndex >= 1 ? "block" : "none");
                    if(fun.getListCount(data) < pageSize){
                        $(".loading-bg").css("display","none");
                        to_end = true;
                    }
                    var htmls = template($("#history_map").html(),{map:data.result});
                    if(pageIndex == 1)$(".cart").html("");
                    $(".cart").append(htmls);
                    if(data.result[0]["visitDate"] == oldDate){
                        $(".view-date:contains('"+ oldDate +"'):last").remove();
                    }
                    oldDate = data.result[data.result.length - 1]["visitDate"];
                    $(".cart a").attr("href","javascript:;");
                    pageIndex += 1;
                }
            }
            else{
                JDSY.app.alert({msg:data.msg});
            }
        },

        getListCount : function(data){
            var total = 0;
            for(var i=0; i<data.result.length; i++){
                total += data.result[i].mVisitHistoryVos.length;
            }
            return total;
        },

        load_data : function(){
        	if(!to_end){
                JDSY.util.post(query_url.historyList,{"cid":cid,"page":pageIndex,"size":pageSize},fun.fill_list);
            }
        },

        toEdit : function(){
            $(".loading-bg").css("display","none");
            if($(".cart .cart-checkbox").length <= 0)return;
            edit_mode = true;
            $(".cart").css("padding-bottom","48px");
            $(".p-acitonbar").show();
            if (window.fun.isapp()){
                JDSY.app.setTitle({name: "完成", place: "rightBtn"});
                JDSY.app.setTitle({name: "编辑浏览记录"});
                JDSY.app.config({
                    "rightBtn": {
                        "type": "callJS",
                        "jsData": "window.history_fun.toNor();"
                    }
                });
            }else {
                page_set.top_bar({view:true,btn_back:true,title:"编辑浏览记录",btn_right:[{tit:"完成",css:"btn-link",fun:fun.toNor}],before:$(".cart")});
            }
            $(".order-list").removeClass("ol_nor");
        },

        toNor : function(){
            edit_mode = false;
            $(".cart").css("padding-bottom","0");
            $(".p-acitonbar").hide();
            if (window.fun.isapp()){
                JDSY.app.setTitle({name: "编辑", place: "rightBtn"});
                JDSY.app.setTitle({name: "浏览记录"});
                JDSY.app.config({
                    "rightBtn": {
                        "type": "callJS",
                        "jsData": "window.history_fun.toEdit();"
                    }
                });
            }else {
                page_set.top_bar({view:true,btn_back:true,title:"浏览记录",btn_right:[{tit:"编辑",css:"btn-link",fun:fun.toEdit}],before:$(".cart")});
            }
            $(".order-list").addClass("ol_nor");
        },

        selAll : function(){
            $(".cart .cart-checkbox").addClass("checked");
        },

        unSelAll : function(){
            $(".cart .cart-checkbox").removeClass("checked");
        },

        checkSel : function(){
            var itemIds="";
            var lists = $(".cart .cart-checkbox");
            for(var i=0; i<lists.length; i++){
                if($(lists).eq(i).hasClass("checked")){
                    itemIds += (i==0 ? "" : ",") + $(lists).eq(i).parents("li").attr("data-id");
                }
            }
            return itemIds;
        },

        delSelect : function(itemIds){
            var lists = $(".cart .cart-checkbox");
            JDSY.util.post(query_url.historyDel,{visitIds:itemIds},function(data){
                if(data.code == 0){
                    for(var i=0; i<$(lists).length; i++){
                        if($(lists).eq(i).hasClass("checked")){
                            $(lists).eq(i).parents("li").remove();
                        }
                    }
                    $(".order-list").each(function(){
                        if($(this).find("li").length == 0){
                            $(this).prev(".view-date").remove();
                            $(this).remove();
                        }
                    });
                    sels = 0;
                    if($(".cart .cart-checkbox").length <= 0){
                        fun.toNor();
                        if(to_end){
                            $(".cart").hide();
                            $(".no-page").show().find("p").html("您还未任何浏览记录哦");
                        }
                        else{
                            fun.load_data();
                        }
                    }
                }
            },null,false);
        },

        list_page_ini : function(){
            page_set.top_bar({view:true,btn_back:true,title:"浏览记录",btn_right:[{tit:"编辑",css:"btn-link",fun:fun.toEdit}],before:$(".cart")});
        	fun.load_data();
            $(window).scroll(evt.scroll_event);

            $(".cart").on("click",".cart-checkbox",evt.selEvent);
            $(".cart").on("click",".goods-box",evt.viewPage);
            $(".p-acitonbar").on("click",".cart-checkbox",evt.selAllEvent);
            $(".p-acitonbar").on("click",".btn-pay",evt.delEvent);
            $(".btn-rhome").on("click",function(){
                if (window.fun.isapp()){
                    JDSY.app.returnHomePage();
                }else {
                    comm_fun.open_win("首页",{url:"main.html"});
                }
            });

        }

    };

    var evt = {

    	scroll_event : function(){
            if(to_end == true || edit_mode == true || isScrolling == true) return;
            if($(window).scrollTop() + $(window).height() >= $(document).height()){
                isScrolling = true;
                fun.load_data();
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
            comm_fun.open_win("商品详情",{url:"product.html?itemID="+$(this).parents("li").attr("data-itemId")});
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
            if(sel_obj == ""){
                JDSY.app.alert({msg:"还没做出选择"});
                return;
            }
            JDSY.app.confirm({title:"确定要删除选中的记录？"},function(){
                fun.delSelect(sel_obj);
            },null);
        }

    };

    if(window.fun.isapp()){
        window.history_fun = fun;
    }
    $(document.body).ready(function(){
        JDSY.ready(function() {
            FastClick.attach(document.body);

            if(location.href.indexOf("history.") >= 0){
                fun.list_page_ini();
            }

            if (window.fun.isapp()){
                JDSY.app.config({
                    "rightBtn": {
                        "type": "callJS",
                        "jsData": "window.history_fun.toEdit();"
                    }
                });
            }
            
        });
    });

})();
