(function () {

    var pro_sku, pro_id, pro_num = 1, sellerId, shopId, sku_inventory, posi_scroll, areaId = 0;
    var score;
    var attr = [];
    var skuList;
    var selectSku;
    var alert_layer;
    var item_status;
    var have_price;
    var cmtNum;
    var addStr;
    var status_str = {
        1: "未发布",
        2: "待审核",
        20: "审核驳回",
        3: "待上架",
        4: "在售",
        5: "已下架",
        6: "锁定",
        7: "申请解锁"
    };

    var option_scroll;

    var pro_fun = {
        //商品轮播图数据填充
        fill_img: function (data) {
            var html_temp = template($("#scroll_img").html(), {list: data});
            $("#slider_showcase .bd ul").html(html_temp);
            setTimeout(function () {
                TouchSlide({
                    slideCell: "#slider_showcase",
                    titCell: ".hd ul",
                    mainCell: ".bd ul",
                    autoPage: true,
                    autoPlay: false,
                    pageStateCell: ".pageState"
                });
                $("#slider_showcase .bd img").on("load", function () {
                    $(this).css("margin-top", ((320 - $(this).height()) / 2) + "px");
                });
            }, 100);
        },

        //商品信息数据填充
        fill_info: function (data) {
            if (data.code != 0) {
                JDSY.app.alert({msg: "数据加载失败"});
                return;
            }
            shopFare = data.result.shopFare;
            shopInfo = data.result.shopInfo;
            var product = data.result.product;
            item_status = data.result.product.itemStatus;
            sellerId = product.sellerId;
            shopId = product.shopId;

            pro_fun.fill_qp(shopInfo);
            $(".pro_name").html(product.itemName);
            $(".deli_charge").html(pro_fun.get_fare({
                weight: product.weight,
                continueWeightPrice: shopFare.continueWeightPrice,
                firstWeightPrice: shopFare.firstWeightPrice
            }));
            $(".orign").html(shopInfo.provinceName + shopInfo.cityName);
            $(".p-shop").attr("data-shopId", shopInfo.shopId);
            $(".p-shop-info .logo img").attr("src", shopInfo.logoUrl);
            $(".p-shop-info .shop_name").html(shopInfo.shopName);
            $(".p-shop-info .shop_slogn").html(shopInfo.mainSell);
            var ua = window.navigator.userAgent.toLowerCase();

            if (ua.match(/MicroMessenger/i) == 'micromessenger' || window.fun.isapp()) {
                $(".share-btn").css("display", "block");
            } else {
                $(".share-btn").css("display", "none");

            }
            if (product.fav) {
                $(".collection").addClass("on");
                $(".favstr").text("已收藏");
            }
            pro_fun.fill_img(product.itemPictureList);
            pro_fun.fill_property(product);
            pro_fun.get_sku_info("num");

        },

        fill_qp: function (shopInfo) {

            var html_hp = template($("#hunpi").html(), {shopInfo: shopInfo});
            $(".hunpi").html(html_hp);

            var html_qp = template($("#qipi").html(), {shopInfo: shopInfo});
            $(".qipi").html(html_qp);

        },

        //促销数据填充
        fill_prom: function (data) {
            if (data.code == 0) {
                var html_temp = "";
                var mjhide = true, zjhide = true;
                hyhide = true;
                if (data.result.fullReduce && data.result.fullReduce[pro_sku]) {
                    //html_temp += '<i class="item-icon">'+ data.result.fullReduce[pro_sku].promotionInfoVo.activityName +'</i>';
                    html_temp += '<i class="item-icon">满减</i>';
                    mjhide = false;
                }
                if (data.result.markdown && data.result.markdown[pro_sku]) {
                    html_temp += '<i class="item-icon" style="background:#6cb247;">直降</i>';
                    zjhide = false;
                }
                if (data.result.memberDiscount) {
                    var discount = data.result.memberDiscount / 10;
                    if (discount > 0) {
                        html_temp += '<i class="icon-vip">会员' + discount + '折</i>';
                        hyhide = false;
                    }

                }

                if (mjhide == true && zjhide == true && hyhide == true) {
                    $(".p-promotion").eq(0).remove();
                }
                $(".prom_info .item").html(html_temp);
            }
        },

        //SKU数据填充
        fill_property: function (data) {
            skuList = data.skuList;
            for (i = 0; i < skuList.length; i++) {
                var attributeList = skuList[i].attributeList;
                if (!selectSku) {
                    selectSku = skuList[i].attributes;
                }
                if (attributeList) {
                    for (j = 0; j < attributeList.length; j++) {
                        var attrItem = attributeList[j];
                        if (!attr[attrItem.attrId]) {
                            attr[attrItem.attrId] = {};
                        }
                        attr[attrItem.attrId]['attrName'] = attrItem.attrName;
                        if (!attr[attrItem.attrId]['attrValue']) {
                            attr[attrItem.attrId]['attrValue'] = {};
                        }
                        attr[attrItem.attrId]['attrValue'][attrItem.attrValueId] = attrItem.attrValueName;
                    }
                }
            }
            pro_fun.fill_sku();
            //pro_fun.fill_step_price(data.itemPriceVoList);
        },

        fill_sku: function () {
            var proper_html = "";
            if (selectSku != null && selectSku.length > 0) {
                var att_kind_id = selectSku.split(";");

                for (var s = 0; s < att_kind_id.length; s++) {
                    var kind_id = att_kind_id[s].substring(0, att_kind_id[s].indexOf(":"));
                    for (o in attr) {
                        if (o == kind_id) {
                            attrItem = attr[o];
                            proper_html += template($("#sku_list").html(), {
                                attrName: attrItem.attrName,
                                attr_id: o,
                                attrValue: attrItem.attrValue,
                                selectSku: selectSku
                            });
                        }
                    }
                    $(".option-bd .pro_box").html(proper_html);
                }
            }

            pro_fun.set_sels();
        },

        fill_step_price: function (data) {
            var price_html = "";
            var maxPrice = 0.00;
            var minPrice = 0.00;
            if (data.length > 0) {
                price_html = template($("#step_price").html(), {price_list: data});
                $(".p-price").html(price_html);
                $(".p-cover .price").text('￥' + minPrice + ' ~ ' + maxPrice);
                have_price = true;
            }
            else {
                $(".p-price").html('<div class="cell"><span class="price">暂无报价</span></div>');
                $(".p-cover .price").text("暂无报价");
                have_price = false;
            }
        },

        //填充数据
        get_pro_detail: function () {
            pro_id = comm_fun.GetQueryString("itemID");

            JDSY.util.post(query_url.product_info, {"itemId": pro_id}, pro_fun.fill_info);
            JDSY.util.post(query_url.pro_count, null, pro_fun.set_cart_num);
            JDSY.util.post(query_url.sale_num, {"itemId": pro_id}, function (data) {
                if (data.code == 0) {
                    $(".sales").html(data.result + " 笔");
                }
            })
        },

        //设置选择
        set_sels: function () {
            var sels = "";
            for (j = 0; j < skuList.length; j++) {
                var skuItem = skuList[j];
                if (!selectSku || !skuItem.attributes) {
                    pro_sku = skuItem.skuId;
                    break;
                }
                //alert(skuItem.attributes +"="+ selectSku +"="+(skuItem.attributes == selectSku))
                if (skuItem.attributes == selectSku) {
                    for (i = 0; i < skuItem.attributeList.length; i++) {
                        var attrItem = skuItem.attributeList[i];
                        var attrValueName = attrItem.attrValueName;
                        if (attrValueName.indexOf(':') > 0) {
                            var arr = attrValueName.split(':');
                            attrValueName = arr[1];
                        }
                        sels += attrItem.attrName + (attrValueName ? "：" + attrValueName : "") + "  ";
                    }
                    $(".proper_sel").html(sels + '<span class="sp-icon"></span>');
                    pro_sku = skuItem.skuId;
                }
            }
            pro_fun.get_sku_info();
        },

        get_sku_info: function (type) {
            if (type != "num") {
                /*
                 // 新sku接口
                 JDSY.util.post(query_url.sku_detail,{"skuId":pro_sku,"sellerId":sellerId,"shopId":shopId},function(data){
                 console.log("\n\n" + query_url.sku_detail + JSON.stringify(data));
                 // 解析 店铺的服务
                 // 解析 促销类型
                 },true);
                 */

                JDSY.util.post(query_url.getItemCoupons, {"itemId": pro_id}, function (data) {
                    if (data.code == 0 && data.result != null) {
                        var csize = 0;
                        for (var sku in data.result) {
                            csize++;
                        }
                        if (csize > 0) {
                            $(".coupondiv").css("display", "block");
                        }
                    }
                });

                // 送货地址
                JDSY.util.get(query_url.getAddFromRedis,{},function(data){
                    var html_addr = "";
                    if (data.code == 0 && data.result.fullAddress.length > 0) {
                        var fullAddress;
                        var proviceCode;

                        fullAddress = data.result.fullAddress;
                        proviceCode = data.result.proviceCode;

                        html_addr = template($("#addr").html(), {addr: fullAddress});
                        $(".address").html(html_addr);

                        JDSY.util.post(query_url.sku_price, {
                            "skuId": pro_sku,
                            "sellerId": sellerId,
                            "shopId": shopId,
                            "itemId": pro_id,
                            "areaId": proviceCode
                        }, function (data) {
                            if (data.code != 0)return;
                            if (data.result && pro_fun.get_price(pro_num, data.result) > 0) {
                                have_price = true;
                                pro_fun.fill_step_price(data.result);
                                $(".p-cover .price").html('￥' + pro_fun.get_price(pro_num, data.result));
                            }
                            else {
                                have_price = false;
                                $(".p-cover .price").html("暂无报价");
                            }
                        }, null);
                    } else {
                        // 默认处理
                        html_addr = template($("#addr").html(), {addr: "请选择配送地址"});
                    }
                    $(".address").html(html_addr);

                },null);

                // 获取评价统计：评价数，评分
                JDSY.util.post(query_url.getStatistcalByItem, {"itemId": pro_id}, function (data) {
                    var html_temp = "";
                    if (data.code == 0 && data.result != null) {
                        cmtNum = data.result.totalNum;
                        score = (data.result.scoreSum / cmtNum).toFixed(1);
                        score = (score == 0 ? 5 : score);
                        html_temp = template($("#comment").html(), {number: cmtNum, score: score});
                        $(".comment").html(html_temp);
                    } else {
                        // 默认处理
                        cmtNum = 0;
                        html_temp = template($("#comment").html(), {number: cmtNum, score: 5});
                    }
                    $(".comment").html(html_temp);

                }, null);

                JDSY.util.post(query_url.promotion_info, {
                    "skuId": pro_sku,
                    "sellerId": sellerId,
                    "shopId": shopId
                }, pro_fun.fill_prom);

                JDSY.util.post(query_url.sku_pic, {"skuId": pro_sku}, function (data) {
                    if (data.code != 0)return;
                    $(".p-cover img").attr("src", data.result[pro_sku]);
                }, true);

                JDSY.util.post(query_url.sku_inventory, {
                    "skuId": pro_sku,
                    "sellerId": sellerId,
                    "shopId": shopId
                }, function (data) {
                    if (data.code != 0)return;
                    $(".p-cover .stock").html(data.result[pro_sku] > 0 ? "库存 " + data.result[pro_sku] + " 件" : "无库存");
                    sku_inventory = data.result[pro_sku] || 0;
                }, true);
            }else {
                JDSY.util.post(query_url.sku_price, {
                    "skuId": pro_sku,
                    "sellerId": sellerId,
                    "shopId": shopId,
                    "itemId": pro_id,
                    "areaId": areaId
                }, function (data) {
                    if (data.code != 0)return;
                    if (data.result && pro_fun.get_price(pro_num, data.result) > 0) {
                        have_price = true;
                        pro_fun.fill_step_price(data.result);
                        $(".p-cover .price").html('￥' + pro_fun.get_price(pro_num, data.result));
                    }
                    else {
                        have_price = false;
                        $(".p-cover .price").html("暂无报价");
                    }
                }, null);
            }
        },

        //添加购物车
        add_cart: function (e, callback) {
            if (pro_fun.check_status() == false)return;
            JDSY.util.post(query_url.checkPro, {itemId: pro_id}, function (check_data) {
                // seller can not buy his own product
                if (check_data.code == 4010) {
                    JDSY.app.alert({msg: check_data.msg});
                    return;
                }
                JDSY.util.post(query_url.cartAdd, {skuId: pro_sku, num: pro_num}, function (data) {
                    if (data.code == 1010) {
                        if (window.fun.isapp()) {
                            comm_fun.open_win("用户登录", {url: "login.html"});
                        } else {
                            comm_fun.open_win("用户登录", {url: "login.html?pName=product&pTitle=商品详情&ReturnUrl=" + location.href});
                        }
                    }
                    else if (data.code == 0) {
                        JDSY.app.alert({msg: "添加成功", type: "succ"});
                        pro_fun.set_cart_num(data);
                        if (callback)callback();
                    }
                    else {
                        JDSY.app.alert({msg: data.msg});
                    }
                });
            });
        },

        //填充购物车数量
        set_cart_num: function (data) {
            if (data.code == 0) {
                $(".cart .num").html(data.result.totalNumber || data.result);
            } else {
                //JDSY.app.alert(data.msg);
            }
        },

        //打开购物车
        go_order: function () {
            pro_fun.check_status();
            comm_fun.open_win("购物车", {url: "exchange.html"});
        },

        check_status: function () {

            if (item_status == 4 && have_price == true)return true;
            if (have_price == false) {
                JDSY.app.alert({msg: "此商品暂无报价，<br>不能进行此项操作"});
                return false;
            }
            if (pro_num > sku_inventory) {
                JDSY.app.alert({msg: "库存不够，<br>不能进行此项操作"});
                return false;
            }
            JDSY.app.alert({msg: "商品状态为：" + status_str[item_status] + "，<br>不能进行此项操作"});
            return false;
        },

        get_price: function (num, sku_arr) {
            var price = 0;
            for (ii = 0; ii < sku_arr.length; ii++) {
                if (num >= sku_arr[ii].minNum && num <= sku_arr[ii].maxNum) {
                    price = sku_arr[ii].sellPrice;
                    break;
                }
            }
            return price;
        },

        get_fare: function (data) {
            return data.firstWeightPrice == null || data.firstWeightPrice == "" ? "无运费" : data.firstWeightPrice + " 元起";
            if (data.code == 0) {
                if (data.weight >= 1000) {
                    return data.continueWeightPrice * (data.weight - 1000) / 1000 + data.firstWeightPrice;
                }
                else {
                    return data.firstWeightPrice;
                }
            }
        },

        positionView: function () {
            $(".cover-decision").css("z-index", "500").show();
            $(".position_layer").animate({left: "10%"}, 200);
            $(".position_layer ul").removeClass("view").eq(0).addClass("view");
            $(".position_layer h4 a").attr("data-level", "1");
            posi_scroll.refresh();
        },

        positionHide: function () {
            $(".cover-decision").css("z-index", "150").hide();
            $(".position_layer").animate({left: "100%"}, 200);
            pro_fun.get_sku_info("num");
            if(addStr == null || addStr == undefined)addStr = {};
            if (addStr.length > 0){
                JDSY.util.get(query_url.saveAddToRedis,{"addStr":addStr},function(data){
                    if (data.code != 0){
                        JDSY.app.alert({msg:data.msg});
                    }
                },null);
            }
        },

        position_fill: function (data) {
            var html = "";
            if (data.code == 0) {
                var list = data.result;
                for (var i = 0; i < list.length; i++) {
                    html += '<li data-code="' + list[i].code + '">' + list[i].name + '</li>';
                }
                return html
            }
        },

        position_ini: function () {
            JDSY.util.get(query_url.getRegion, {"parentId": 0}, function (data) {
                $(".position_layer ul").eq(0).html(pro_fun.position_fill(data));
                posi_scroll.refresh();
            });
        },

        position_sel: function () {
            var sel_line = this;
            var $list = $(this).parents("ul");
            var level = $list.attr("data-level");
            if (level == 1) { // 区域价只包含一级
                areaId = $(this).attr("data-code");
                $(".position_layer").find("li").removeClass("sel");
                addStr = areaId;
            }else {
                addStr += "_" + $(this).attr("data-code");
            }
            var $to_list = $(".position_layer ul").eq(level);
            $(".position_layer h4 a").attr("data-level", level);
            $list.find("li").removeClass("sel");
            $(this).addClass("sel");
            if (level < 3) {
                for (var i = level + 1; i <= 3; i++) {
                    $(".position_layer ul").eq(level - 1).html("");
                }
                JDSY.util.get(query_url.getRegion, {"parentId": $(sel_line).attr("data-code")}, function (data) {
                    $list.removeClass("view");
                    $to_list.html(pro_fun.position_fill(data)).addClass("view");
                    posi_scroll.refresh();
                    posi_scroll.scrollTo(0, 0);
                }, true);
            }
            else {
                pro_fun.positionHide();
            }
            pro_fun.position_value();
        },

        position_back: function () {
            var level = $(this).attr("data-level");
            if(level>1){
                $(".position_layer ul").eq(level).removeClass("view");
                $(".position_layer ul").eq(level - 1).addClass("view");
                $(this).attr("data-level", level - 1);
                posi_scroll.scrollToElement($(".position_layer .view .sel").get(0));
            }
            else {
                pro_fun.positionHide();
            }
            return false;
        },

        position_value: function () {
            var $sels = $(".position_layer .sel");
            var val = "";
            for (var i = 0; i < $sels.length; i++) {
                val += ($sels.eq(i).html() + " ");
            }
            $(".address span[class!='txt-r']").html(val);
        }
    };

    var pro_event = {
        //打开商品选项
        view_cover: function () {
            $(".cover-decision").show();
            $(".p-cover").show(0).addClass("show");
        },

        //关闭商品选项
        close_cover: function () {
            $(".p-cover").removeClass("show");
            setTimeout(function () {
                $(".p-cover").hide();
            }, 200);
            $(".cover-decision").hide();

            $(".buy").css("display", "block");
            $(".add-cart").css("display", "block");
            $(".btn_enter").css("display", "none");

        },

        number_btn_event: function (event) {
            var ipt = $(event.currentTarget).parent().find("input");
            var value = parseFloat(ipt.val());
            if ($(this).hasClass("decrease")) {
                value = value - 1 < 1 ? 1 : value - 1;
            }
            else {
                value += 1;
            }
            ipt.val(value);
            pro_num = value;
            pro_fun.get_sku_info("num");
            if (pro_num > sku_inventory)JDSY.app.alert({msg: "商品数量已超过库存数量"});
        },

        number_ipt_event: function (event) {
            var ipt = event.currentTarget;
            if ($(ipt).val() == "")$(ipt).val(1);
            $(ipt).val(parseInt($(ipt).val()) || 1);
            pro_num = $(ipt).val();
            pro_fun.get_sku_info("num");
            if (pro_num > sku_inventory)JDSY.app.alert({msg: "商品数量已超过库存数量"});
        },

        sku_list_event: function (event) {
            if (event.target.tagName == "LI") {
                $(event.target).siblings().removeClass("checked");
                $(event.target).addClass("checked");
                var ulList = $(".option-bd .pro_box ul");
                selectSku = "";
                for (i = 0; i < ulList.length; i++) {
                    var liList = ulList[i];
                    for (j = 0; j < $(liList).children().length; j++) {
                        var li = $(liList).children()[j];
                        if ($(li).hasClass('checked')) {
                            selectSku += $(li).attr("data-attrID") + ":" + $(li).attr("data-valueID") + ";";
                        }
                    }
                }
                pro_fun.set_sels();
            }
        },

        view_sku_cover: function (event) {
            if ($(event.target).parents(".p-action").length > 0) {
                pro_event.view_cover();
                if (option_scroll) {
                    option_scroll.refresh();
                }
                else {
                    option_scroll = new IScroll('.option-bd', {
                        scrollX: false,
                        freeScroll: true,
                        tap: true,
                        click: false
                    });
                }
            }
        },

        view_share: function () {
            if (window.fun.isapp()) {
                var imgs = $("#slider_showcase").find("img");

                var share = {
                    'title': $(".shop_name").html(), // 微信客户端显示标题
                    'shareContent': $(".pro_name").html(), // 分享内容详情描述
                    'url': window.rootUrl + '/m/product.html?itemID=' + pro_id, // 分享给微信的M页链接
                    'imageURL': imgs[0].src, // 微信客户端显示的分享图片
                } // 分享数据内容
                JDSY.util.share(share);
            } else {
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                    $(".wx-share").show();
                }
            }
        },
        appback: function () {
            JDSY.app.closeWin();
        }
    };

    $(document.body).ready(function () {
        JDSY.ready(function () {
            FastClick.attach(document.body);
            pro_fun.get_pro_detail();
            $(".go-backs").click(pro_event.appback);
            $(".number a").on("tap", pro_event.number_btn_event);

            $(".number input").on("input", pro_event.number_ipt_event);

            $(".option-bd .pro_box").on("tap", pro_event.sku_list_event);

            $(".p-action").click(pro_event.view_sku_cover);

            $(".cover-decision, .close").click(pro_event.close_cover);

            $(".add-cart").click(pro_fun.add_cart);

            $(".btn_enter").click(pro_fun.add_cart);

            $(".buy").click(function (event) {
                JDSY.util.post(query_url.checkPro, {itemId: pro_id}, function (check_data) {
                    if (check_data.code == 1010) {
                        if (window.fun.isapp()) {
                            comm_fun.open_win("用户登录", {url: "login.html"});
                        } else {
                            comm_fun.open_win("用户登录", {url: "login.html?pName=product&pTitle=商品详情&ReturnUrl=" + location.href});
                        }
                    } else if (check_data.code == 4010) {
                        JDSY.app.alert({msg: check_data.msg});
                        return;
                    } else if (check_data.code == 0) {
                        var num = $("input").val();
                        if (window.fun.isapp()) {
                            JDSY.session.setValue("sku", JSON.stringify({"skuId": pro_sku, "num": num}));
                        } else {
                            comm_fun.cookies.set("sku", JSON.stringify({"skuId": pro_sku, "num": num}))
                        }
                        comm_fun.open_win("订单确认", {url: "order_confirm.html"});
                    } else {
                        JDSY.app.alert({msg: data.msg});
                    }
                });
                //pro_fun.add_cart(event,pro_fun.go_order);

            });

            $(".share-btn").click(pro_event.view_share);

            $(".wx-share").click(function () {
                $(this).hide();
            });

            $(".go-shop").on("click", function () {
                comm_fun.open_win("店铺", {url: "shop.html?shopId=" + $(this).parents(".p-shop").attr("data-shopId") + "&tab=new"});
            });

            $(".shop_link,.all-product").on("click", function () {
                comm_fun.open_win("店铺", {url: "shop.html?shopId=" + $(this).parents(".p-shop").attr("data-shopId")});
            });

            $(".cart").on("click", function () {
                comm_fun.open_win("购物车", {url: "exchange.html?item"});
            });

            $(".link_detail").on("click", function () {
                comm_fun.open_win("图文详情", {url: "pro_detail.html?itemID=" + pro_id + "&pro_sku=" + pro_sku + "&pro_num=" + pro_num});
            });

            $(".comment").on("click", function () {
                if (cmtNum > 0)
                    comm_fun.open_win("商品评价", {url: "cmt_list.html?itemID=" + pro_id + "&shopId=" + shopId});
            });

            $(".collection").on("click", function () {
                if ($(".collection").hasClass("on")) {
                    // 取消收藏
                    JDSY.util.post(query_url.batchDelItems, {itemIds: pro_id}, function (data) {
                        if (data.code == 0) {
                            JDSY.app.alert({msg: "取消收藏成功", type: "succ"});
                            if (window.fun.isapp()) {
                                JDSY.session.setValue("fav", JSON.stringify({"favId": pro_id, "state": 0}))
                            }
                            $(".collection").removeClass("on");
                            $(".favstr").text("收藏");
                        }
                    });
                } else {
                    // 收藏接口
                    JDSY.util.post(query_url.addFavItem, {"itemId": pro_id}, function (data) {
                        if (data.code == 0) {
                            JDSY.app.alert({msg: "收藏成功", type: "succ"});
                            if (window.fun.isapp()) {
                                JDSY.session.setValue("fav", JSON.stringify(""))
                            }
                            $(".collection").addClass("on");
                            $(".favstr").text("已收藏");
                        }
                    }, true);
                }

            });

            $(".getcoupon").on("click", function () {
                comm_fun.open_win("店铺优惠",{url:"shop.html?shopId="+shopId+"&tab=act"});
            });

            $(".address").on("click", function () {
                pro_fun.positionView();
            });

            $(".cover-decision").on("click", pro_fun.positionHide);

            $(".position_layer ul").on("click", "li", pro_fun.position_sel);
            $(".position_layer h4 a").on("click", pro_fun.position_back);

            pro_fun.position_ini();

            posi_scroll = new IScroll('.posi_scroll', {scrollX: false, freeScroll: true, tap: true, click: false});

        });
    });

})();