(function(){
    var local_url = {
        index_data : "api/index.php",
        main_banner : "api/banner.php",
        main_floor : "api/floor.php",
        category: "api/category.php",
        product_list : "api/pro_list.php",
        supply_list : "api/supply_list.php",
        hot_word : "api/hot_word.php",
        login : "api/login.php",
        regi : "api/reg.php",
        getVerifyCode : "api/getVerifyCode.php",
        getAuthCodeImg : "http://183.2.169.108/m/public/getAuthCodeImg",
        getInfo : "api/getInfo.php",
        address_list : "api/addr_list.php",
        addr_setDefault : "api/addr_setDefault.php",
        addr_del : "api/addr_del.php",
        getRegion : "api/getRegion.php",
        addr_insert : "api/insert.php",
        addr_getinfo : "api/addr_getinfo.php",
        addr_update : "api/update.php",
        getCart : "api/getCart.php",
        cartAdd : "api/addGoods.php",
        pro_count : "api/pro_count.php",
        cartUpdate : "api/updateGoods.php",
        cartDelete : "api/deleteGoods.php",
        cartSelect : "api/check.php",
        cartUnsel : "api/unCheck.php",
        getOrderInfo : "api/getOrderInfo.php",
        getOrderDetailForDirectOrder:"api/getOrderDetailForDirectOrder.php",
        getPayWay : "api/getPayWay.php",
        orderDetail : "api/order_detail.php",
        submitDirectOrder:"api/submitDirectOrder.php",
        orderList : "api/order_list.php",
        order_cancel : "api/order_cancel.php",
        order_submit : "api/order_submit.php",
        order_statistic : "api/order_statistic.php",//订单分类统计
        order_complete : "api/order_complete.php",
        order_delete : "api/order_delete.php",
        topay : "m/pay/toPay",
        saveOrderAddress : "api/save_order_address.php",
        product_info : "api/pro_info.php",
        product_detail : "api/pro_detail.php",
        promotion_info : "api/promot.php",
        pay_url : "m/pay/toPay",
        shop_info : "api/shop_info.php",
        message : "api/message.php",
        sku_pic : "api/sku_pic.php",
        sku_inventory : "api/sku_inventory.php",
        sku_price : "api/sku_price.php",
        buy_again : "api/buy_again.php",
        loginOut : "loginOut",
        sale_num : "api/sale_num.php",
        getFavCount : "api/getFavCount.php",
        getItemFav : "api/getItemFav.php",
        getShopFav : "api/getShopFav.php",
        batchDelItems : "api/batchDelItems.php",
        batchDelShops : "api/batchDelShops.php",
        couponList : "api/getUserCouponInfo.php",
        historyList : "api/historyList.php",
        historyDel : "api/historyDel.php",
        evaluate : "api/evaluate.php",
        countShop : "api/countShop.php",
        subComment : "api/subcomment.php",
        getOrderListBySeller : "api/getOrderListBySeller.php",
        modifyOrderPrice : "api/modifyOrderPrice.php",
        addDeliveryInfos : "api/addDeliveryInfos.php",
        getProduct : "api/getProduct.php",
        batchDown : "api/batchDown.php",
        batchUp : "api/batchUp.php",
        updateItem : "api/updateItem.php",
        checkVerifyCode : "api/checkVerifyCode.php",
        updateInfo : "api/updateInfo.php",
        updatepaypass : "api/updatepaypass.php",
        updatepass : "api/updatepass.php",
        shop_brand : "/m/shop/getBrandByCid",
        addFavShop : "api/update.php",
        addFavItem:"/m/fav/addFavItem",
        getShopCoupons : "api/getShopCoupons.php",
        getItemCoupons : "api/getItemCoupons.php",
        receiveCoupon : "api/update.php",
        getProductDetail : "api/getProductDetail.php",
        shop_brand : "/m/shop/getBrandByCid",

    };

    var net_url = {
        login : "/m/user/login",
        getUserInfo : "/m/user/getInfo",
        regi: "/m/user/register",
        getAuthCodeImg:"/m/public/getAuthCodeImg",
        getUserPhoto:"/m/user/getUserPhoto",
        editUserPhoto:"/m/user/editUserPhoto",
        uploadImg:"/m/public/uploadImg",
        saveMessage:"/m/message/saveMessage",
        getMessages:"/m/message/getMessages"

    };

    window.query_url = location.href.indexOf("localhost") >= 0 ? net_url : net_url;

})(window);



query_url