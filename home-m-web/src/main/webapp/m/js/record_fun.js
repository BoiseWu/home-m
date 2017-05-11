(function(){

    var page_n = 1;
    var page_size = 5;
    var shop_id = 0;
    var type = comm_fun.GetQueryString("tab");
    var isEnd = false;
    var isScrolling = false;
    var keywords = "";
    var categoryId = "",orderColumn="saleNum",orderType="desc";
    var shareContent = "";
    var shopName = "";

    var shop_fun = {

        fill_shop_info : function (data){
            if(data.code == 0){
                shareContent  = data.result.introduce;

                if(true == data.result.fav){
                    $(".shop .btn_fav").addClass("on").find("span").html("已收藏");
                }
                else{
                    $(".shop .btn_fav").removeClass("on").find("span").html("收藏");
                }
                var ua = window.navigator.userAgent.toLowerCase();

                if(ua.match(/MicroMessenger/i) != 'micromessenger'&&!window.fun.isapp()){
                    $(".btn_share").css("display","none");
                }
               // $(".btn_share").css("display","none");
                $(".shop .shop-info img").attr("src",comm_fun.formatImg(data.result.shopLogo,49,49));
                $(".shop .shop-name").html(data.result.shopName);
                shopName = data.result.shopName;
                $(".shop .shop-add").html('<i class="icon"></i>' + data.result.shopAddress);
            }
        },

        fill_shop_cate: function (data) {
            if (data.code == 0) {
                var cates = data.result.all;
                var html_temp = template($("#cate_list").html(), {list: cates});
                $(".category-list ul").html(html_temp);
            }
        },

        fill_shop_product: function (data) {
            isScrolling = false;
            if(data.code == 0){

               var  prolist = data.result;
                $(".l-item").css("display", "block");
                $(".no-page").css("display", "none");
                var  items = prolist.items;
                prolist.items = prolist.items == null ? {} : prolist.items ;
                if(items == null ||prolist.items.length <= 0 || prolist.items.length < page_size){
                    isEnd = true;
                    $(".loading-bg").css("display","none");
                 }else{
                 isEnd = false;

                 
                 }
                var list_item = prolist.items;
                var list_img = prolist.itemPicList;
                var list_shop = prolist.shopInfoList;
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

                var html_temp =  template($("#product_list").html(),{list:list_item});
                if(page_n == 1)$(".search-list ul").html("");
                page_n+=1;
                $(".search-list ul").append(html_temp);
                //alert($(".search-list li").length)
                if($( ".search-list li").length==0){
                    $(".l-item").css("display", "none");
                    $(".no-page").css("display", "block");
                    $(".no-page p").html("暂无商品");
                }
                setTimeout(function(){
                    $(".search-list ul a").attr("href","javascript:;");
                    //shop_fun.loadItemPics(data.result.itemPicList);
                },100);

            }
            else{
                JDSY.app.alert({msg:data.msg});
                $(".loading-bg").css("display","none");
                return;
            }
        },

        fillCoupon : function(data){
            isScrolling = false;
            if(data.code == 0){
                if(data.result.length > 0){

                    var list = data.result;
                    $(".l-item").css("display","block");
                    $(".no-page").css("display","none");

                    for(var i=0; i<list.length; i++){
                        list[i].effectiveStartTime = comm_fun.get_date(list[i].effectiveStartTime,".").ymd;
                        list[i].effectiveEndTime = comm_fun.get_date(list[i].effectiveEndTime,".").ymd;
                        list[i].receiveStartTime = comm_fun.get_date(list[i].receiveStartTime,".").ymd;
                        list[i].receiveEndTime = comm_fun.get_date(list[i].receiveEndTime,".").ymd;
                    }
                    var coupon_html = template($("#coupon_list").html(),{list:list});

                    if(page_n ==1){
                        $(".coupon_list").html(coupon_html);
                    }else{
                        $(".coupon_list").append(coupon_html);
                    }
                    if(list.length<page_size){
                        isEnd = true;
                        $(".loading-bg").css("display","none");

                    }else{
                        isEnd = false;
                        page_n += 1;
                        $(".loading-bg").css("display","block");

                    }
                }
                else{
                    isEnd = true;
                 $(".l-item").css("display","none");
                 $(".no-page").css("display","block");
                 $(".no-page p").html("暂无优惠");
                 $(".loading-bg").css("display","none");

                 
                }
            }else{
                JDSY.app.alert({msg:data.msg});
                $(".loading-bg").css("display","none");
            }
        },

        load_data : function(){
            if(isEnd == false && isScrolling == false){
                isScrolling = true;
                JDSY.util.post(query_url.product_list,{
                "pageIndex" : page_n,
                "orderColumn" : orderColumn,
                "orderType" : orderType,
                "shopIdList" : shop_id,
                "pageSize" : page_size,
                "itemSearchInput" : keywords,
                "categoryId" : categoryId
                },shop_fun.fill_shop_product,null,true);
            }
        },

        loadCoupon : function(){
            if(isEnd == false && isScrolling == false) {
                isScrolling = true;
                JDSY.util.post(query_url.getShopCoupons, {
                    shopId: shop_id,
                    pageNum: page_n,
                    pageSize: page_size
                }, shop_fun.fillCoupon, null, true);
            }
        },

        tab_event : function(event){
            var link = event.currentTarget;
            $(".shop-tab a").removeClass("on");
            $(link).addClass("on");
            var data_type = $(this).attr("data-type");
            orderColumn = data_type == "all" ? "saleNum" :  data_type == "act" ? "coupon" : "listing_time";
            $(".loading-bg").css("display","block");
            page_n = 1;
            isEnd = false;
            $(".search-list ul").html("");

            if(orderColumn != "coupon"){
                $(".coupon_list").css("display","none");
                $(".search-list").css("display","block");
                shop_fun.load_data();
            }
            else{

                $(".search-list").css("display","none");
                $(".coupon_list").css("display","block");
                shop_fun.loadCoupon();
            }
        },

        scroll_event : function(){
            if(isEnd==true)return;
            if($(window).scrollTop() + $(window).height() >= $(document).height()){
                if(orderColumn != "coupon"){
                    shop_fun.load_data();
                }else{
                    shop_fun.loadCoupon();

                }
            }
            if($(window).scrollTop() > 50){
                if($(".btn-top").css("display") == "none"){
                    $(".btn-top").show(200);
                }
            }
            else{
                if($(".btn-top").css("display") != "none"){
                    $(".btn-top").hide(200);
                }
            }
        },

        list_event : function(event){
            var id = $(event.target).parents("li").attr("data-itemID");
            comm_fun.open_win("商品详情",{url:"product.html?itemID="+id});
        },

        showShopInfo : function(){
            comm_fun.open_win("公司信息", {url:"shop_info.html?shopID="+shop_id});
        },

        share_event : function(event){
            if($(event.target).hasClass("btn_share") || $(event.target).parents().hasClass("btn_share")){
                if(window.fun.isapp()){
                    var imgs = $(".shop-info > .img").find("img");

                    var share = {'title' : shopName, // 微信客户端显示标题
                        'shareContent' : shareContent, // 分享内容详情描述
                        'url' : window.rootUrl + '/m/record.html?shopId='+shop_id, // 分享给微信的M页链接
                        'imageURL' :imgs[0].src, // 微信客户端显示的分享图片
                    } // 分享数据内容
                    JDSY.util.share(share);
                }else{

                var ua = window.navigator.userAgent.toLowerCase();


                if(ua.match(/MicroMessenger/i) == 'micromessenger'){

                    $(".wx-share").show();
                }
                }
            }
        },

        hide_share : function(){
            $(".wx-share").hide();
        },

        cateView : function(){
            $(".cover-decision").show();
            $(".category-list").animate({left:"10%"},200);
        },

        cateHide : function(event){
            $(".cover-decision").hide();
            $(".category-list").animate({left:"100%"},200);
        },

        cateEvt : function(){
            var link = this;
            if(location.pathname.indexOf("sch") >= 0){
                page_n = 1;
                isEnd = false;
                keywords = $(this).find("input[name='keyword']").val();
                categoryId = $(link).attr("data-cate");
                shop_fun.load_data();
            }
            else{
                setTimeout(function(){
                    comm_fun.open_win("店铺分类商品",{url:"shop_sch.html?shopId="+shop_id+"&cate="+$(link).attr("data-cate")});
                },200);
            }
        },

        toTop : function(){
            $(document.body).animate({scrollTop:"0"},200);
        },

        searchFormEvt : function(){
            if(comm_fun.isNotNull($(this).find("input[name='keyword']").val())){
                if(location.pathname.indexOf("sch") >= 0){
                    page_n = 1;
                    isEnd = false;
                    keywords = $(this).find("input[name='keyword']").val();
                    shop_fun.load_data();
                }
                else{
                    comm_fun.open_win("店铺分类商品",{url:"shop_sch.html?shopId="+shop_id+"&keyword="+ encodeURI(encodeURI($(this).find("input[name='keyword']").val()))});
                }
            }
            return false;
        },

        favEvt : function(){
            if($(this).hasClass("on")){
                // 取消收藏
                JDSY.util.post(query_url.batchDelShops, {shopIds: shop_id}, function (data) {
                    if (data.code == 0) {
                        JDSY.app.alert({msg: "取消收藏成功",type:"succ"});
                        if (window.fun.isapp()) {
                            JDSY.session.setValue("fav", JSON.stringify({"favId": shop_id, "state": 0}))
                        }
                        $(".shop .btn_fav").removeClass("on").find("span").html("收藏");
                    }
                    else {
                        JDSY.app.alert({msg: data.msg});
                    }
                });

            }else {
                // 添加收藏
                JDSY.util.post(query_url.addFavShop, {shopId: shop_id}, function (data) {
                    if (data.code == 0) {
                        JDSY.app.alert({msg: "收藏成功", type: "succ"});
                        if (window.fun.isapp()) {
                            JDSY.session.setValue("fav", JSON.stringify(""));
                        }
                        $(".shop .btn_fav").addClass("on").find("span").html("已收藏");
                    }
                    else {
                        JDSY.app.alert({msg: data.msg});
                    }
                });
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
            $(this).addClass("on").siblings(".on").removeClass("on");
            page_n = 1;
            isEnd = false;
            orderColumn = newOrderColumn;
            shop_fun.load_data();
        },

        couponEvt : function(){
            if($(this).hasClass("buy-cp-v1") || $(this).find(".order-cmp3").css("display") != "none"){
                JDSY.app.alert({msg:"已领取"});
                return;
            }

            var coupon = this;
            //alert($(this).hasClass("buy-cp-v1") || $(this).find(".order-cmp3").css("display") != "none")
            JDSY.util.post(query_url.receiveCoupon,{couponId:$(coupon).attr("data-couponId")},function(data){
                if(data.code == 0){
                    JDSY.app.alert({msg:"领取成功",type:"succ"});
                    $(coupon).find(".order-cmp3").show();
                }
                else{
                    JDSY.app.alert({msg:data.msg});
                }
            })
        },

        appBack : function() {
            JDSY.app.closeWin();
        },

        shop_vip_evt: function () {
            comm_fun.open_win("会员专区", {url: "shop_vip.html?shopId=" + shop_id});
        },

        shop_vip_ini: function () {
            JDSY.util.get(query_url.getShopMemberRule, {shopId:comm_fun.GetQueryString("shopId")}, shop_fun.shop_vip_fill, null, false); 
        },

        shop_vip_fill: function (data) {
            if (data.code == 0) {
                if (data.result == null) {
                    $(".user-v2").hide();
                    $(".member-only").hide();
                    $(".no-page").show();
                    return;
                } else { // 有会员体系
                    $(".user-v2").show();
                    $(".member-only").show();
                    $(".no-page").hide();
                    JDSY.util.get(query_url.getShopMember, {shopId: comm_fun.GetQueryString("shopId")}, function (data) {
                        if (data.code == 1010) { // 用户未登录
                            $(".login").show();
                            $(".member-login").click(function () {
                                comm_fun.open_win("登录", {url: "login.html" + "?ReturnUrl=" + location.href});
                            });
                        } else if (data.code == 0) {
                            $(".name").html(data.result.pin);
                            if (data.result.levelTag.length == 0) {
                                $(".no_vip").show();
                            } else { 
                                $(".vip").show();
                                $(".member-lv span").html(data.result.levelTag);
                            }
                        }
                    });
                }

                var rank_list = data.result.memberRuleInfoPos;
                var rank_html = template($("#card_rank").html(), {rank_list: rank_list});
                $(".member-only").html(rank_html);
            } else {
                JDSY.app.alert({msg: data.msg});
            }
        },

        page_ini : function(){
            $(window).scroll(shop_fun.scroll_event);
            $(".search-list").click(shop_fun.list_event);
            $(".shop").click(shop_fun.share_event);
            $(".introduction").on("click",shop_fun.showShopInfo);
            $(".wx-share").click(shop_fun.hide_share);
            $(".btn-ctg").on("click",shop_fun.cateView);
            $(".btn-top").on("click",shop_fun.toTop);
            $(".search_form").on("submit",shop_fun.searchFormEvt);
            $(".cover-decision").on("click",shop_fun.cateHide);
            $(".category-list").on("click",shop_fun.cateHide);
            $(".member").on("click", shop_fun.shop_vip_evt);
            $(".category").on("click", shop_fun.cateView);

            if (window.fun.isapp){
                $(".top-search .back").on("click",shop_fun.appBack);
            }

            page_set.foot_bar({view:true,onItem:2});
        },

        shopPageIni : function(){
            shop_id = comm_fun.GetQueryString("shopId");
          //  type = comm_fun.GetQueryString("type");
            if(shop_id)JDSY.util.post(query_url.shop_info,{"shopId":shop_id},shop_fun.fill_shop_info);
            if (shop_id)JDSY.util.get(query_url.shopCategory, {
                "shopId": shop_id,
                parentId: -1
            }, shop_fun.fill_shop_cate);
            $(".shop-tab a").click(shop_fun.tab_event);
            $(".cate-list").on("click", "a",shop_fun.cateEvt);
            $(".shop .btn_fav").on("click",shop_fun.favEvt);
            //$(".btn_share").click(shop_fun.share_event);
            $(".coupon_list").on("click", ".buy-cp", shop_fun.couponEvt);
            if(comm_fun.isNotNull(type)){
                $(".shop-tab a[data-type='"+ type +"']").click();
            }else{
                $(".shop-tab a").eq(0).click();
            }
        },

        schPageIni : function(){
            shop_id = comm_fun.GetQueryString("shopId");
            keywords = decodeURI(comm_fun.GetQueryString("keyword"));
            categoryId = comm_fun.GetQueryString("cate");
            if (shop_id)JDSY.util.get(query_url.shopCategory, {
                "shopId": shop_id,
                parentId: -1
            }, shop_fun.fill_shop_cate);
            $(".cate-list2").on("click", "a",shop_fun.cateEvt);
            $(".sort-list li").on("click",shop_fun.sort_event);
            $("input").val(keywords);
            shop_fun.load_data();
        },


    }

    $(document.body).ready(function(){
            JDSY.ready(function(){
                FastClick.attach(document.body);
                shop_fun.page_ini();
                shop_fun.schPageIni();

            });
        }
    );
})();
