(function(){

    var all_coupon_data;
    var state;

    var fun = {
        list_page_ini : function() {
            page_set.top_bar({view:true,btn_back:true,title:"优惠券",before:$(".sort-list")});
            JDSY.util.get(query_url.couponList,{},fun.init_load, null, false);
            $(".sort-list a").click(evt.tab_click_event);
        },

        init_load : function(data) {
            if (data.code != 0) {
                JDSY.app.alert({msg:data.msg});
                return;
            }
            all_coupon_data = data.result;
            state = "unused";
            fun.fill_tab_number();
            fun.load_coupon_list();
        },

        fill_tab_number : function() {
            $(".sort-tap a").each(function(index, element) {
                var state = $(element).attr("data-state");
                if(all_coupon_data[state].length >= 0) {
                    $(element).find("span").html('（' + all_coupon_data[state].length + '）').show();
                }
            });
        },

        load_coupon_list : function() {
            var coupon_list_html = template($("#coupon_list").html(),{coupon_state:state, coupon_list:all_coupon_data[state],
                get_alt_tips:fun.get_alt_tips, get_date:comm_fun.get_date, get_format_price:fun.get_format_price});
            $(".coupon-list").html(coupon_list_html);
        },

        get_alt_tips : function(data_state) {
            switch (data_state) {
                case "unused":
                    return "暂无未使用的优惠券";
                case "expired":
                    return "暂无过期的优惠券";
                case "used":
                    return "暂无已使用的优惠券";
                default:
                    return "暂无优惠券";
            }
        },

        get_format_price : function(price_cents) {
            var price_string = price_cents.toString();
            var length = price_string.length;
            switch (length) {
                case 0:
                    return "";
                case 1:
                    return "0.0" + price_string;
                case 2:
                    return "0." + price_string;
                default:
                    return price_string.substr(0, length - 2) + "." + price_string.substr(length - 2, 2);
            }
        }
    };

    var evt = {
        tab_click_event : function () {
            var to_state = $(this).attr("data-state");
            if(to_state != state) {
                $(".sort-list li").removeClass("on");
                $(this).parents("li").addClass("on");
                state = to_state;
                $(document).scrollTop(0)
                fun.load_coupon_list();
            }
        }

    };

    $(document.body).ready(function(){
        JDSY.ready(function() {
            FastClick.attach(document.body);

            if(location.href.indexOf("coupon_list") >= 0){
                fun.list_page_ini();
            }
        });
    });

})();
