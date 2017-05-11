(function(){

    var words="",cosID="",kd="",orderColumn="saleNum",orderType="desc",pageSize=5,shopId="",kinds = "";
    var isEnd = false;
    var pageIndex = 1; // 分页数
    var qu_url;
    var isScrolling = false;
    var isMoreViewHide = true;

    var sch_fun = {

        schformFocus : function(event){
            event.stopPropagation();
            sch_fun.morehide();
            $(".top-search .option").show();
            $(".top-search .s-box").css({"padding-left":"0","border-radius":"0 5px 5px 0"}).find(".icon-search").hide();
            $(".sort-list").hide();
            $(".search-list").hide();
// $("#input").focus();
        },

        schformBlur : function(){
            $(".top-search .option").hide();
            $(".top-search .s-box").css({"padding-left":"25px","border-radius":"5px"}).find(".icon-search").show();
//            $(".top-search input").val("");
            if(kd=="pro" && $(".search-list li").length > 0)$(".sort-list").show();
            $(".search-list").show();
        },

        list_fill : function(data){
            isScrolling = false
            if(data.code!=0) {
                sch_fun.set_page_status();
                isEnd = true;
                return;
            }
            if(data.result.items == null&& kinds == "产品") {
                sch_fun.set_page_status();
                isEnd = true;
                return;
            }
            $(".hot-search").css("display","none");
//            $(".loading-bg").css("display","block");
            var html_temp = "";
            var list = kd == "sup" ? data.result : data.result.items;
            if(list == null)list = {};
            sch_fun.set_page_load(list.length);

            isEnd = list.length < pageSize ? true : false;

            if(kd == "sup"){
                html_temp = template($("#supply_list").html(),{list:list});
                $(".search-list").css("margin-top","44px");
            }
            else{
                if(data.result.items == null)data.result.items = {};
                html_temp = template($("#product_list").html(),{list:sch_fun.setItemList(data.result.items,data.result.shopInfoList,data.result.itemPicList)});
                $(".search-list").css("margin-top","91px");
            }
            if(pageIndex == 1)$(".search-list ul").html("");
            $(".search-list ul").append(html_temp);
            $(".search-list ul a").attr("href","javascript:;");
            pageIndex += 1;
        },

        setItemList : function(list_item,list_shop,list_img){
            for(var i=0; i<list_item.length; i++){
                for(var p=0; p<list_img.length; p++){
                    if(list_img[p].itemId == list_item[i].itemId){
                        list_item[i].img = comm_fun.formatImg(list_img[p].pictureUrl,220,220);
                    }
                }
                for(var k=0; k<list_shop.length; k++){
                    if(list_shop[k].shopId == list_item[i].shopId){
                        list_item[i].shopName = list_shop[k].shopName;
                        list_item[i].provinceName = list_shop[k].provinceName;
                        list_item[i].cityName = list_shop[k].cityName;
                        list_item[i].initialAmount = list_shop[k].initialAmount;
                    }
                }
            }
            return list_item;
        },

        set_page_status : function(){
            if (pageIndex > 1) {
                JDSY.app.alert({msg:"没有更多数据了"});
 $(".loading-bg").css("display","none");

            }
            else {
                $(".none, .search-list").css("display","block");
                      var  str = kinds=="产品"?"商品" :"店铺";
               var str = "抱歉，没有找到符合条件的" + str;
                $(".none p").html(str);
                $(".loading-bg").css("display","none");
                //$(".sort-list").css("disply","none");
                $(".search-list ul").html("");
                //JDSY.app.alert({msg:data.msg});
            }
        },

        set_page_load : function(list_length){
 if(list_length == undefined)list_length = 0;
            if(pageIndex == 1){
                $(".search-list ul").html("");
                $(".search-list").css("display","block");
                $(".none").css("display",list_length <= 0 ? "block" : "none");
                $(".loading-bg").css("display",list_length <= pageSize ? "none" : "block");

            }
            else{
                $(".loading-bg").css("display",list_length <= pageSize ? "none" : "block");
                isEnd = true;
            }
        },

        load_data : function(){
            if(!isEnd&&!isScrolling) {
                isScrolling = true;
            if(kd == "sup"){
                JDSY.util.post(qu_url,{
                    "words":words,
                    "pageIndex":pageIndex,
                    "pageSize":pageSize,
                },sch_fun.list_fill,null,false);
            }else{
                JDSY.util.post(qu_url,{
                    "categoryId":cosID,
                    "itemSearchInput":words,
                    "orderColumn":orderColumn,
                    "orderType":orderType,
                    "pageIndex":pageIndex,
                    "pageSize":pageSize,
                },sch_fun.list_fill,null,false);
            }
        }},

        drop_sch_pop : function(event){
            $(".option").addClass("open");
            event.stopPropagation();
            sch_fun.morehide();
        },

        hide_sch_pop : function(){
            $(".option").removeClass("open");
        },

        sch_pop_event : function(event){
            event.stopPropagation();
            var link = event.target;
            $(link).parents(".option").find("span").text($(link).text());
            sch_fun.hide_sch_pop();
        },

        search_event : function(){
            var keywords = $(".frame input").val();
             kinds = $(".option span").html();
            if(comm_fun.isNull(keywords))return false;
            sch_fun.schformBlur();
            kd = kinds == "产品" ? "pro" : "sup";
            qu_url =  kinds == "产品" ? query_url.product_list : query_url.supply_list;
            $(".sort-list").css("display",kd == "sup" ? "none" : "block");
            $(".sort-list li").removeClass("on").eq(0).addClass("on");
            pageIndex = 1;
            isEnd = false;
            orderColumn="saleNum";
            orderType="desc";
            words = keywords;
            sch_fun.load_data();
            return false;
        },

        list_event : function(event){
            if(kd == "sup"){
                comm_fun.open_win("店铺",{url:"shop.html?shopId=" + $(event.target).parents("li").attr("data-shopID")});
            }
            else{
                comm_fun.open_win("商品详情",{url:"product.html?itemID=" + $(event.target).parents("li").attr("data-itemID")});
            }
        },

        sort_event : function(){
            var newOrderColumn = $(this).attr("data-sort");
            if(newOrderColumn != orderColumn){
                if(newOrderColumn == "sell_price"){
                    orderType = "asc";
                }else{
                    orderType = "desc";
                }
                $(".sort-tap .tap i").attr("class","up");
            }else{
                if($(this).find("i").attr('class') == 'down') {
                    orderType = 'asc';
                    $(this).find("i").attr('class', 'up');
                } else {
                    orderType = 'desc';
                    $(this).find("i").attr('class', 'down');
                }
            }
            $(event.currentTarget).addClass("on").siblings(".on").removeClass("on");
            pageIndex = 1;
            isEnd = false;
            orderColumn = newOrderColumn;
            sch_fun.load_data();
        },

        scroll_event : function(event){
            if($(window).scrollTop() + $(window).height() >= $(document).height()){
                if(isEnd)return;
                if($(".search-list").is(":hidden")) return;
                    if(kinds == "")kinds = "产品";
                sch_fun.load_data();
            }
        },

        moreView : function(event){
            if(isMoreViewHide){
                event.stopPropagation();
                $(".cover-decision").show();
                $(".re-menu").show().animate({height:"95px"},200);
                isMoreViewHide = false;
            }else {
                sch_fun.morehide();
            }
        },

        morehide : function(){
            $(".cover-decision").hide();
            $(".re-menu").animate({height:"0"},200,function(){$(this).hide()});
            isMoreViewHide = true;
        },

        moreEvt : function(){
            sch_fun.morehide();
            var link = $(this).attr("data-link");
            if(link == "fav"){
                comm_fun.open_win("收藏夹",{url:"favorite.html"});
            }
            else{
                if(window.fun.isapp()) {
                    JDSY.app.returnHomePage();
                }else {
                    comm_fun.open_win("首页",{url:"main.html"});
                }
            }
        },

        appBack : function(){
            JDSY.app.closeWin();
        },

        page_ini : function(){

            cosID = comm_fun.GetQueryString("cosID") || cosID;
            words = comm_fun.GetQueryString("words") || words;
            kd=comm_fun.GetQueryString("kd");
            qu_url =  kd == "pro" ? query_url.product_list : query_url.supply_list;
            $(".top-search input").on("click",sch_fun.schformFocus);
            $(".top-search .option").on("click",sch_fun.drop_sch_pop);
            $(".top-search .option li").on("click",sch_fun.sch_pop_event);
            $(".search_form").on("submit",sch_fun.search_event);
            $(".top-search .option>span").html(kd=="sup"?"供应商":"产品");
            $(document.body).on("click",function(){
                if($(".search-list li").length > 0)sch_fun.schformBlur();
            });
            $(window).scroll(sch_fun.scroll_event);
            $(document.body).on("click",sch_fun.morehide);
            $(".search-list").on("click","li",sch_fun.list_event);
            $(".sort-list li").on("click",sch_fun.sort_event);
            $(".top-search .btn-more").on("click",sch_fun.moreView);
            $(".re-menu li").on("click",sch_fun.moreEvt);
            //$(".cover-decision").on("click",sch_fun.morehide);
            if(comm_fun.isNull(words) && comm_fun.isNull(cosID)){
                $("input").focus();
                $("input").click();
                //JDSY.util.get(query_url.hot_word,null,fill_hot_word,true);
            }
            else {
                $("input").focus();
                $("input").click();
                $(".hot-search").css("display","none");
                $(".search-list").css("display","block");
                $(".sort-list").css("display",kd == "sup" ? "none" : "block");
                sch_fun.load_data();
            }
            if (window.fun.isapp){
                $(".top-search .back").on("click",sch_fun.appBack);
            }
        }

    };
    $(document.body).ready(function(){
        JDSY.ready(function(){
            FastClick.attach(document.body);
            sch_fun.page_ini();



        });
    });
})();
