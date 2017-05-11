(function(){

    var itemStatus=4,pageIndex= 0,pageSize=10;
    var is_end = false;
    var edit_mode = false;
    var sels = 0;
    var isScrolling = false;

    var fun = {

        fillProList : function (data) {
            isScrolling = false;
            if(data.code != 0){
                is_end = true;
                return;
            }
                if(data.result == null){
                    $(".cart").hide();
                    $(".no-page").show();
                    return;
                }
            data.result = !data.result?[]:data.result;
            if(data.result.length < pageSize)is_end = true;
            if(data.result.length == 0 && pageIndex == 0){
                $(".cart").hide();
                $(".no-page").show();
            }
            else{
                $(".cart").show();
                $(".no-page").hide();
            }
            for(var i=0; i<data.result.length; i++){
                data.result[i].operate = fun.getOperate(itemStatus);
            }
            var pro_list = template($("#pro_list").html(),{list:data.result,formatImg:comm_fun.formatImg});
            if(pageIndex == 0)$(".order-list ul").html("");
            $(".order-list ul").append(pro_list);
            if(itemStatus == 4){
                $(".p-acitonbar a").attr("class","btn-mg2-type2 btn_down").find(".text").html("下架");
            }
            else if(itemStatus == 3){
                $(".p-acitonbar a").attr("class","btn-mg2-type btn_up").find(".text").html("上架");
            }
            pageIndex += 1;
        },

        getOperate : function(status){
            var btn = {
                btn_up : '<a href="#" class="btn-mg-type2 btn_up"><i></i><br><span class="text">上架</span></a>',
                btn_down : '<a href="#" class="btn-mg-type3 btn_down"><i></i><br><span class="text">下架</span></a>',
                btn_edit : '<a href="#" class="btn-mg-type3 btn_edit"><i></i><br><span class="text">修改</span></a>',
                line : '<span class="line"></span>'
            };
            var operate = "";

            switch (Number(status)){
                case 4:
                    operate = btn.btn_down;
                    break;
                case 3:
                    operate = btn.btn_up + btn.line + btn.btn_edit;
                    break;
                default:
                    operate = "";
            }
            return operate;
        },

        loadProList : function(){
            JDSY.util.post(query_url.getProduct,{itemStatus:itemStatus,pageIndex:pageIndex,pageSize:pageSize},fun.fillProList);
        },

        selAll : function(){
            $(".order-list .cart-checkbox").addClass("checked");
        },

        unSelAll : function(){
            $(".order-list .cart-checkbox").removeClass("checked");
        },

        checkSel : function(){
            var itemIds = "";
            var lists = $(".order-list .checked");
            for(var i=0; i<lists.length; i++){
                itemIds += (i==0 ? "" : ",") + $(lists).eq(i).parents("li").attr("data-itemId");
            }
            return itemIds;
        },

        removeSel : function(itemIds){
            if(itemIds.indexOf(",") >= 0){
                var lists = $(".order-list .checked");
                for(var i=0; i<lists.length; i++){
                    $(lists).eq(i).parents("li").remove();
                }
                fun.listEmpty();
            }
            else{
                $(".order-list li[data-itemId='"+ itemIds +"']").hide(200,function(){
                    $(this).remove();
                    fun.listEmpty();
                });
            }
        },

        listEmpty : function(){
            if($(".order-list ul li").length == 0){
                $(".cart").hide();
                $(".add-address").hide();
                $(".no-page").show();
            }
        },

        pageMode: function () {
            if (edit_mode) {
                if (window.fun.isapp()) {
                    var title = itemStatus != 2 ? "完成" : "";
                    var jsData = itemStatus != 2 ? "window.manage_evt.editEvt();" : "";
                    JDSY.app.setTitle({name: title, place: "rightBtn"});
                    JDSY.app.config({"rightBtn": {"type": "callJS", "jsData": jsData}});
                } else {
                    page_set.top_bar({
                        view: true,
                        btn_back: true,
                        title: "商品管理",
                        btn_right: (itemStatus != 2 ? [{tit: "完成", css: "btn-link", fun: evt.editEvt}] : []),
                        before: $(".sort-list")
                    });
                }
                $(".order-list").removeClass("ol_nor");
                $(".add-address").hide();
                $(".p-acitonbar").show();
            }
            else {
                if (window.fun.isapp()) {
                    var title = itemStatus != 2 ? "编辑" : "";
                    var jsData = itemStatus != 2 ? "window.manage_evt.editEvt();" : "";
                    JDSY.app.setTitle({name: title, place: "rightBtn"});
                    JDSY.app.config({"rightBtn": {"type": "callJS", "jsData": jsData}});
                } else {
                    page_set.top_bar({
                        view: true,
                        btn_back: true,
                        title: "商品管理",
                        btn_right: (itemStatus != 2 ? [{tit: "编辑", css: "btn-link", fun: evt.editEvt}] : []),
                        before: $(".sort-list")
                    });
                }
                $(".order-list").addClass("ol_nor");
                $(".add-address").show();
                $(".p-acitonbar").hide();
            }
            $(".p-acitonbar .cart-checkbox").removeClass("checked");
        },

        pageIni: function () {
            itemStatus = comm_fun.isNull(comm_fun.GetQueryString("itemStatus")) ? 4 : comm_fun.GetQueryString("itemStatus");
            if (window.fun.isapp()) {
                JDSY.util.viewWillAppear(function () {
                    if (itemStatus == 3) {
                        JDSY.session.getValue("issue", function (data) {
                            var data = JSON.parse(data);
                            if (data.itemId) {
                                JDSY.session.setValue("issue", "");
                                fun.removeSel(data.itemId);
                            }
                        })
                    }
                })
            } else {
                page_set.top_bar({
                    view: true,
                    btn_back: true,
                    title: "商品管理",
                    btn_right: [{tit: "编辑", css: "btn-link", fun: evt.editEvt}],
                    before: $(".sort-list")
                });
            }
            $(".sort-list a").on("click",evt.sortEvt);
            $(".sort-list a[data-status='"+ itemStatus +"']").click();
            $(".order-list").on("click",".cart-checkbox",evt.selEvent);
            $(".order-list").on("click",".goods-box",evt.viewPage);
            $(".order-list").on("click",".btn-mg-area a",evt.onceEvt);
            $(".p-acitonbar").on("click",".cart-checkbox",evt.selAllEvent);
            $(".p-acitonbar").on("click","a",evt.batchEvt);
            $(".add-address .m-btn").on("click",evt.proIssuevt);
            $(window).on("scroll",evt.scrollEvt);
        },
    };

    var evt = {
        sortEvt : function(){
            $(this).parents(".tap").find("li").removeClass("on");
            $(this).parent().addClass("on");
            itemStatus = $(this).attr("data-status");
            pageIndex = 0;
            edit_mode = false;
            fun.pageMode();
            fun.loadProList();
        },

        scrollEvt : function(){
            if($(window).scrollTop() + $(window).height() >= $(document).height()){
                if(is_end || isScrolling)return;
                isScrolling = true;
                fun.loadProList();
            }
        },

        editEvt : function(){
            edit_mode = edit_mode == true ? false : true;
            fun.pageMode();
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

        onceEvt : function(event){
            event.stopPropagation();
            var itemId = $(this).parents("li").attr("data-itemId");
            if($(this).hasClass("btn_up")){
                evt.proUpEvt(itemId);
            }
            else if($(this).hasClass("btn_down")){
                evt.proDownEvt(itemId);
            }
            else if($(this).hasClass("btn_edit")){
                evt.proEditEvt(itemId);
            }
        },

        batchEvt : function(){
            var itemIds = fun.checkSel();
            if(itemIds == ""){
                JDSY.app.alert({msg:"还未选择任何商品"});
                return;
            }
            if($(this).hasClass("btn_up")){
                evt.proUpEvt(itemIds);
            }
            else if($(this).hasClass("btn_down")){
                evt.proDownEvt(itemIds);
            }
        },

        proUpEvt : function(itemIds){
            JDSY.util.post(query_url.batchUp,{itemIds:itemIds},function(data){
                if(data.code == 0){
                    JDSY.app.alert({msg:"上架成功",type:"succ"});
                    fun.removeSel(itemIds);
                }
                else{
                    JDSY.app.alert({msg:data.msg});
                }
            });
        },

        proDownEvt : function(itemIds){
            JDSY.util.post(query_url.batchDown,{itemIds:itemIds},function(data){
                if(data.code == 0){
                    JDSY.app.alert({msg:"下架成功",type:"succ"});
                    fun.removeSel(itemIds);
                }
                else{
                    JDSY.app.alert({msg:data.msg});
                }
            });
        },

        proEditEvt : function(itemId){
            comm_fun.open_win("商品修改",{url:"pro_issue.html?itemID="+itemId})
        },

        proIssuevt : function(){
            comm_fun.open_win("快速发布",{url:"pro_issue.html"})
        }

    };
    window.manage_evt = evt;
    $(document.body).ready(function(){
        JDSY.ready(function(){
            FastClick.attach(document.body);

            fun.pageIni();

        });
    });
})();
