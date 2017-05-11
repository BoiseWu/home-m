(function(){

    var cosId="", pageIndex=1, pageSize=10,isEnd = false;
    var isScrolling = false;

    var supp_fun = {

        fill_list :  function (data){
            isScrolling = false;
            if(data.code!=0) {
                if (pageIndex > 1) {
                    JDSY.app.alert({msg:"没有更多数据了"});
                } else {

                    JDSY.app.alert({msg:data.msg});
                }
                isEnd = true;
                return;
            }
            if(pageIndex == 1){
                $(".search-list ul").html("");
                $(".search-list").css("display",data.result.length <= 0 ? "none" : "block");
                $(".loading").css("display",data.result.length <= 0 ? "block" : "none");
                $(".loading-bg").css("display",data.result.length < pageSize ? "none" : "block");
            }
            else{
                $(".loading-bg").css("display",data.result.length < pageSize ? "none" : "block");
            }
            var html = template($("#supply_list").html(),{list:data.result});
            if(pageIndex == 0)$(".search-list ul").empty();
            $(".search-list ul").append(html);
            pageIndex += 1;
        },

        load_data : function () {
            JDSY.util.post(query_url.supply_list,{
                "cosId":cosId,
                "pageIndex":pageIndex,
                "pageSize":pageSize
            },supp_fun.fill_list,null);
        },

        list_event : function(event){
            var shopID = $(event.target).parents("li").attr("data-shopID");
            var shopName = $(event.target).parents("li").find("h3").html();
            comm_fun.open_win(shopName,{url:"shop.html?shopId="+shopID});
            return false ;
        },

        scroll_event : function(){
            if(isEnd || isScrolling)return;
            if($(window).scrollTop() + $(window).height() >= $(document).height()){
                isScrolling = true;
                supp_fun.load_data();
            }
        },

        search_event : function(event){
            if($(event.target).parents(".frame").length > 0 || $(event.target).hasClass("search")){
                comm_fun.open_win("搜索",{url:"search.html?kd=sup"});
            }
        },

        cate_event : function(){
            comm_fun.open_win("分类",{url:"category.html?kd=sup"});
        },

        page_ini : function(){
            cosId = comm_fun.GetQueryString("cosId") != "" ? comm_fun.GetQueryString("cosId") : cosId;

            supp_fun.load_data();

            page_set.foot_bar({view:true,onItem:2});

            $(".search-list ul").click(supp_fun.list_event);
            $(".back").click(supp_fun.cate_event);
            $(window).scroll(supp_fun.scroll_event);
            $(".top-search").click(supp_fun.search_event);
        }

    };

    $(document.body).ready(function(){
        JDSY.ready(function(){
            FastClick.attach(document.body);
            supp_fun.page_ini();
        });
    });
})();
