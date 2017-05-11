(function(){
    
    var itemID,shopId,score,pageNum = 1, pageSize = 10,to_state=70;
    var isEnd = false,isScrolling = false ;


    var evt = {
            sort_tab_event: function () {
                //70=全部 5=好评 3=中评 1=差评
                 to_state = $(this).attr("data-state");
                $(".sort-list li").removeClass("on");
                $(this).parents("li").addClass("on");
                isEnd = false;
                isScrolling = false;
                pageNum = 1 ;
                fun.load_data();
            },
            scroll_event: function () {
                if (isEnd || isScrolling)return;
                if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
                    fun.load_data();
                }
            }
        }

    var fun = {

        fill_list : function (data){
            isScrolling = false;
            var html_temp = "";
                        if(data.result == undefined)data.result = [];
            if(data.code == 0 && data.result != null ) {

                for (var i = 0; i < data.result.length; i++) {
                    var cmt = data.result[i];
                    var times = comm_fun.get_date(cmt.createTime);
                    html_temp += template($("#comment").html(), {
                        data: cmt,
                        time: times,
                        buyerName: cmt.buyerName,
                        transNum: cmt.transNum
                    });
                }
            }
                $(".no-page").css("display","none");
                $(".evaluate-list").css("display","block");
            if(pageNum==1&&to_state!=2&&to_state!=4)$(".cmt-list").html("");
                $(".cmt-list").append(html_temp);
            if(data.result.length>=pageSize){
                isEnd = false ;
                pageNum++;
            } else{
                if(to_state==3||to_state==5){
                    to_state--;
                    pageNum=1;
                    fun.load_data();

                }else{
                    isEnd = true ;

                }
            } ;
            if($(".cmt-list li").count=0){
                $(".evaluate-list").css("display","none");
                $(".no-page").css("display","block");
            }
        },
        load_data : function(){
            if(!isEnd &&!isScrolling ) {
                isScrolling = true;
                if (to_state == 70) {
                    JDSY.util.post("/m/comment/getByItem", {
                        "itemId": itemID,
                        "shopId": shopId,
                        "pageNum": pageNum,
                        "pageSize": pageSize
                    }, fun.fill_list, true);
                } else {
                    JDSY.util.post("/m/comment/getByScoreType", {
                        "itemId": itemID,
                        "shopId": shopId,
                        "type": to_state,
                        "pageNum": pageNum,
                        "pageSize": pageSize
                    }, fun.fill_list, true);
                }
            }
                },

        page_ini : function(){

            itemID = comm_fun.GetQueryString("itemID");
            shopId = comm_fun.GetQueryString("shopId");
			$(".sort-list a").click(evt.sort_tab_event);
            $(window).scroll(evt.scroll_event);


            // 重新取一次最新的评价统计，并计算分数
            JDSY.util.post("/m/comment/getStatistcalByItem",{"itemId":itemID},function(data){
                if(data.code != 0)return;
                score = (data.result.scoreSum/data.result.totalNum).toFixed(1);
                score = (score==0?5:score);
                var html_sta = template($("#statist").html(),{score:score});
                $(".eva-text").html(html_sta);
            },true);

            // 默认取全部评论
            JDSY.util.post("/m/comment/getByItem",{"itemId":itemID,"shopId":shopId,"pageNum":pageNum,"pageSize":pageSize},fun.fill_list,true);
        }
    }

    $(document.body).ready(function(){
            JDSY.ready(function(){
                page_set.top_bar({view:true,btn_back:true,title:"商品评价",before:$(".m-header")});
                fun.page_ini();
            });
        }
    );
})();
