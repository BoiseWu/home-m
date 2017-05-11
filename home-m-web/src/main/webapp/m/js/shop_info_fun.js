/**
 * Created by jingdong on 16/3/21.
 */
(function(){
    var shop_id = 0;
    var shop_info_fun = {
        fill_info_detail : function (data) {
            if(data.code == 0){
                var shopInfoKeys = ["companyName",         //公司信息
                                    "operateScope",     //经营范围
                                    "shopName",      //店铺名称
                                    "address",          //所在地区
                                    "sellMain",         //店铺主营
                                    "prodNum"];         //商品数量
                var shopInfoValues = new Array();
                for(var i = 0; i < shopInfoKeys.length; i++){
                    var key = shopInfoKeys[i];
                    var value = data.result[key];
                    if(value == null){
                        value = "";
                    }
                    shopInfoValues.push(value.length == 0 ? "&nbsp;" : value);
                }
                var shopInfoItems = $(".company-info .info-item .info-r");
                for(var i = 0; i < shopInfoItems.length; i++){
                    var soloInfo = $(shopInfoItems[i]);
                    soloInfo.html(shopInfoValues[i]);
                }

                var creditScore = data.result.creditScore;
                $(".eva-comm-v3 .eva-text .data-num").html(creditScore);
                $(".eva-comm-v3 .eva-text .star-yl").width(creditScore * 20 + "%");
                //$(".eva-comm-v3 .eva-text .star-yl").width("30%");

                var shopMarkingKeys = ["descripScore",      //描述相符
                                       "serviceScore",      //服务态度
                                       "deliveryScore",     //发货速度
                                       "afterSaleScore"];   //售后评价
                var shopMarkingValues = new Array();
                for(var i = 0; i < shopMarkingKeys.length; i++){
                    var key = shopMarkingKeys[i];
                    var value = data.result[key];
                    shopMarkingValues.push(value == null? 0 : value);
                }
                var shopMarkingItems = $(".eva-comm-v3 dd");
                for(var i = 0;i < shopMarkingItems.length; i++){
                    var soloMarking = $(shopMarkingItems[i]);
                    soloMarking.html(shopMarkingValues[i] + "分");
                }
            }
        },

        page_ini : function () {
            shop_id = comm_fun.GetQueryString("shopID");
            if(shop_id){
                JDSY.util.post(query_url.shop_detail,{"shopId":shop_id},shop_info_fun.fill_info_detail,null,true);
            }
        },
    };

    $(document.body).ready(function(){
        JDSY.ready(function(){
            FastClick.attach(document.body);
            shop_info_fun.page_ini();
        });
    });
})();