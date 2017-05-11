(function(){

    var banner_obj;
    var type;

    var index_fun = {
        banner_fill : function (data){
            var banner_html = template($("#banner").html(),{list:data});
            $(".focus-slider .bd ul").html(banner_html);
            $(".focus-slider img").each(function(index,element){
                $(element).css("height",($(".focus-slider").width() * (175 / 320)) +"px");
            });

            if(banner_obj){//判断banner是否初始化
                banner_obj.stopPlay();
                banner_obj.refesh();
            }
            else{
                setTimeout(function(){
                    banner_obj = TouchSlide({ slideCell:"#slider_touch",titCell:".hd ul",mainCell:".bd ul",autoPage:true,autoPlay:true,effect:"leftLoop",interTime:3000});
                },50);
            }
        },

        img_fill : function (floor_arr,row,col){ // row 行 col 列
            var img_html = template($("#mix_floor").html(), {list: floor_arr, row: row, col: col});
            $(".main-content").append(img_html);
            $(".main-content a").attr("href","javascript:;");
        },

        floor_fill : function(title,more_url,data){

            var head_photo_floor_html = template($("#head_photo_floor").html(),{list:data,title:title,more_url:more_url});
            $(".main-content").append(head_photo_floor_html);
            $(".discount-floor a").attr("href","javascript:;");
            $(".discount-floor img").height($(".discount-floor").width() / 2 * 0.62)


            var pro_floor_html = template($("#pro_floor").html(),{list:data,title:title,more_url:more_url});
            $(".main-content").append(pro_floor_html);
            $(".discount-floor a").attr("href","javascript:;");
            $(".discount-floor img").height($(".discount-floor").width() / 2 * 0.62)
        },

        load_data : function(data){
            if (data.code!=0) {
                JDSY.app.alert({msg:data.msg});
                return;
            }
            $(".main-content").css("display","block");
            $(".no-page").css("display","none");
            $("div .floor").remove();
            
            if(data.result != null){
                index_fun.banner_fill(data.result);
            }
            
        },
        reload : function () {
            JDSY.util.get(query_url.index_data,{type:type},index_fun.load_data,index_fun.failload,false);

        }  ,
           failload : function(){
               $(".main-content").css("display","none");
               $(".no-page").css("display","block");
           } ,
        link_event : function(event){
            if(event.target.tagName == "A" || $(event.target).parents("a").length > 0){
                var btn = event.target.tagName == "A" ? event.target : $(event.target).parents("a");
                if($(btn).attr("data-type")){
                    var pageTitle,pageName,url;
                    //item/shop/category/link
                    switch ($(btn).attr("data-type")){
                        case "item":
                            pageName = "product";
                            pageTitle = "商品详情";
                            url = "product.html?itemID="+ ($(btn).attr("data-link") == undefined ? $(btn).attr("data-link").replace("item|","") : $(btn).attr("data-id"));
                            break;
                        case "shop":
                            pageName = "shop";
                            pageTitle = $(btn).attr("data-desc");
                            url = "shop.html?shopId="+$(btn).attr("data-link").replace("shop|","");
                            break;
                        case "category":
                            pageName = "search";
                            pageTitle = $(btn).attr("data-desc");
                            url = "search.html?kd=pro&cosID="+$(btn).attr("data-link").replace("category|","");
                            break;
                        case "link":
                            pageName = "page";
                            pageTitle = $(btn).attr("data-desc");
                            url = $(btn).attr("data-link");
                            break;
                    }

                    if(pageName != "page") {
                        comm_fun.open_win(pageTitle, {url: url});
                    }else{
                        JDSY.app.openWin(pageTitle,{
                            title : site.name,
                            url : url,
                            urlType : "url",
                            showBack : true,
                        });
                    }

                }
                else{
                    comm_fun.open_win($(btn).attr("data-title"),{url:$(btn).attr("data-link")});
                }
                return false;
            }
        },

        scroll_fun : function(){
            //search opactiy
            var search_cover = $(".search-box-cover"),
                sc_height = search_cover.height(),
                t_height = $("#slider_touch").height() - sc_height,
                srolltop =  $(window).scrollTop();
            if (srolltop <= t_height) {
                search_cover.css("opacity", srolltop < sc_height ? 0: 0.85 * ((srolltop - sc_height) / t_height));
            }
            else {
                search_cover.css("opacity", 0.85);
            }
        },

        search_event : function(event){
            if($(event.target).parents(".search-form").length > 0){
                comm_fun.open_win("搜索",{url:"search.html"});
            }
        },

        cate_event : function(event){
            comm_fun.open_win("分类",{url:"category.html?kd=pro"});
        },

        message_event : function(event){
            comm_fun.open_win("消息",{url:"msg_center.html"});
        },

        page_ini : function(){

            page_set.foot_bar({view:true,onItem:1});

            $(window).scroll(index_fun.scroll_fun);
            $(".no-page a").on("click",index_fun.reload);

            JDSY.util.get(query_url.getUserPhoto,{},index_fun.load_data,index_fun.failload,false);
            $(".main-content").click(index_fun.link_event);


        }
    }

    window.index_fun = index_fun;

    $(document.body).ready(function(){
        JDSY.ready(function(){
            FastClick.attach(document.body);
            index_fun.page_ini();

        });
    });
})();