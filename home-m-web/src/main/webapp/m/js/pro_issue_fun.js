(function(){

    var select_list_level = [];
    var itemId;
    var notGetBand = true;

    var fun = {

        select_cate : function(selectIndex, level){
            var data = select_list_level[level];
            var html = template($("#option_tpl").html(),{list:data});
            $("#select_"+level).html("");
            $("#select_"+level).append(html);
            var object = data[selectIndex];
            $("#select_"+level).find("option[value='"+object.categoryId+"']").attr("selected",true);
            $("#select_"+level).prev().html(object.categoryName);
            if (null != object.children && object.children.length > 0) {
                select_list_level[level+1] = object.children;
                fun.select_cate(0, level + 1);
                if(notGetBand == false){
                    if(level == 2)fun.load_brand(fun.getCidVal());
                }
            }
            else{
                if(level < 3){
                    for(var p=level+1; p<3; p++){
                        $("#select_"+p).html("");
                        $(".sel-txt").eq(p).html("暂无");
                    }
                }
                if(notGetBand === false)fun.load_brand(fun.getCidVal());
            }
        },

        productFill : function(data){
            for(var i=0; i<3; i++){
                for(var k=0; k<select_list_level[i].length; k++){
                    if(select_list_level[i][k].categoryId == data.result.categorys[i].cid){
                        if(i<2)select_list_level[i+1] = select_list_level[i][k].children;
                        fun.select_cate(k,i);
                    }
                }
            }
            fun.load_brand(data.result.categorys[data.result.categorys.length - 1].cid);
            //fun.load_brand($('#select_2').val());
            for(var i=0; i<data.result.itemPictureList.length; i++){
                $('.img-group>ul>li').last().before(template($("#img_tpl").html(),{index:i, pictureUrl: data.result.itemPictureList[i]}));
            }
            if(data.result.itemPictureList.length >= 4){
                $('.img-group>ul>li').eq($('.img-group>ul>li').length-1).remove();
            }
            $("input[name='itemName']").val(data.result.itemName);
            $("input[name='costPrice']").val(data.result.costPrice);
            $("input[name='marketPrice']").val(data.result.marketPrice);
            $("input[name='inventory']").val(data.result.inventory);
            $("textarea[name='describe']").parents(".add-item").hide();
            if (window.fun.isapp()) {
                $("input[type='file']").hide();
                $(".img-group").on("click","div",evt.app_upload);
            }
        },

        getCidVal : function(){
            var cid;
            for(var i=2; i>=0; i--){
                if(comm_fun.isNotNull($("#select_"+i).val())){
                    cid = $("#select_"+i).val();
                    break;
                }
            }
            return cid;
        },

        cate_default_fill : function(data){
            select_list_level[0] = data.result.all;
            if(comm_fun.isNull(itemId)) {
                if(comm_fun.isNull(itemId)){
                    fun.select_cate(0, 0);
                }
            }
        },

        loadProductInfo : function(){
            JDSY.util.get(query_url.getProductDetail,{itemID:itemId},fun.productFill);
        },

        load_brand : function(cid) {
            if(comm_fun.isNull(cid)){
                $("#brand").prev().html("暂无");
                return;
            }
            $("#brand").html("");

            JDSY.util.get(query_url.shop_brand+"?cid="+cid,{},function(data){
                if(data.code == 0 && data.result.length >0){
                    var html = template($("#brand_tpl").html(), data);
                    $("#brand").append(html);
                    $("#brand").prev().html(data.result[0].brandName);
                }
                else{
                    $("#brand").prev().html("暂无");
                }
            }, true);

        },

        load_data : function () {
            JDSY.util.get(query_url.category,null,function(data){
                if(data.code == 0){
                    fun.cate_default_fill(data);
                }
                else{
                    JDSY.app.alert({msg:data.msg});
                }
            }, true);
        },

        page_ini : function(){
            itemId = comm_fun.GetQueryString("itemID");
            fun.load_data();
            $('.cat').change(evt.select_cate_evt);
            $("#brand").change(evt.select_brand_change);
            $(".img-group").on("change","input[type='file']",evt.file_upload);
            $('.m-btn').click(evt.pro_issue_submit);
            if(comm_fun.isNotNull(itemId)){
                $("input[name='itemId']").val(itemId);
                fun.loadProductInfo();
                page_set.top_bar({view:true,btn_back:true,title:"商品修改",before:$("#form")});
                $(".m-btn").html("确认修改");
            }
            else{
                page_set.top_bar({view: true, btn_back: true, title: "快速发布", before: $("#form")});
                $(".m-btn").html("确认发布");
                if (window.fun.isapp()) {
                    $("input[type='file']").hide();
                    $(".img-group").on("click","div",evt.app_upload);
                }
            }
            var getCid = setInterval(function(){
                var cid = fun.getCidVal();
                if(comm_fun.isNotNull(cid)){
                    clearInterval(getCid);
                    if(comm_fun.isNull(itemId))fun.load_brand(fun.getCidVal());
                }
            },200);
            setTimeout(function(){
                notGetBand = false;
            },1000);

        }
    };

    var evt = {

        select_cate_evt : function() {
            var level = parseInt($(this).attr("level"));
            var selectIndex = $(this).find("option:selected").index();
            fun.select_cate(selectIndex, level);
            //fun.load_brand($('#select_2').val());
        },
        select_brand_change : function(){
            var str =  $(this).find("option:selected").html();
               $(this).parent().find(".sel-txt").html(str);
           } ,
        pro_issue_submit : function() {
            /**验证没加全**/
            var ul = $('.img-group>ul');
            var cid = fun.getCidVal();
            var brand = $('#brand').val();
            var imgCount =  $(ul).children().length - 1;
            var itemName = $('#itemName').val();
            var inventory = $('#inventory').val();
            var describe = $('#describe').val();
            if(cid == null || cid == ''){
                JDSY.app.alert({msg:'请选择分类！'});
                return;
            }
//            cid = 1000190;
            if(brand == null || brand == ''){
                JDSY.app.alert({msg:'请选择品牌！'});
                return;
            }
            if(imgCount == 0){
                JDSY.app.alert({msg:'请上传商品图片！'});
                return;
            }
            if(itemName == null || itemName == ''){
                JDSY.app.alert({msg:'请填写商品名称！'});
                return;
            }
            if(inventory == null || inventory == ''){
                JDSY.app.alert({msg:'请填写库存量！'});
                return;
            }
            if(comm_fun.isNull(itemId)){
                if(describe == null || describe == ''){
                    JDSY.app.alert({msg:'请填写商品描述！'});
                    return;
                }
            }
                var  params = comm_fun.getFormParam('#form');

            JDSY.util.post(query_url.item_add, params, function(data){
                if(0 == data.code){
                    JDSY.app.alert({type:"succ",msg:"发布成功"});
                    if (window.fun.isapp()) {
                        JDSY.session.setValue("issue", JSON.stringify({"itemId": params.itemId, "state": 1}));
                        JDSY.app.closeWin();
                    } else {
                        comm_fun.open_win("账号管理", {url: "pro_manage.html"});
                    }
                } else {
                    JDSY.app.alert({msg:data.msg});
                }
            },null,false);
        },

        app_upload: function () {
            var ul = $('.img-group>ul');
            var that = $(this).find("input");

            var index = $(ul).children().length - 1;
            var elementId = $(this).find("input").attr("id");
            JDSY.app.getPhoto({size: "200＊200", backType: "url"}, function (data) {
                if (0 == data.code && null != data.result) {
                    if (elementId == "picInput") {
                        var li = template($("#img_tpl").html(), {index: index, pictureUrl: data.result});
                        $('.img-group>ul>li').last().before(li);
                        $("input[type='file']").hide();
                        if (index >= 3) $('.img-group>ul>li').last().remove();
                    } else { /*重新上传*/
                        index = parseInt($(that).attr("no"));
                        $("#pictureImg" + index).attr("src", data.result);
                        $("#pictureInputHidden" + index).val(data.result);
                    }
                } else {
                    JDSY.app.alert({msg: "上传失败"});
                }
            })
        },

        file_upload : function() {
            var ul = $('.img-group>ul');
            var that = $(this);

            var index =  $(ul).children().length - 1;
            var elementId = $(this).attr("id");
            $.ajaxFileUpload({
                type:'POST',
                url:query_url.uploadfile,
                fileElementId:elementId,
                dataType:'json',
                secureuri:false,//一般设置为false
                success:function(data){
                    if(0 == data.code && null != data.result) {
                        if (elementId == "picInput") {
                            var li = template($("#img_tpl").html(),{index:index, pictureUrl: data.result});
                            $('.img-group>ul>li').last().before(li);
                            if (index>=3) $('.img-group>ul>li').last().remove();
                        } else { /*重新上传*/
                            index = parseInt($(that).attr("no"));
                            $("#pictureImg"+index).attr("src", data.result);
                            $("#pictureInputHidden"+index).val(data.result);
                        }
                    } else {
                        JDSY.app.alert({msg:"上传失败"});
                    }
                },
                error:function(data){
                    JDSY.app.alert({msg:data.msg});
                }
            });
 
        }

    };

    $(document.body).ready(function(){
        JDSY.ready(function(){
            FastClick.attach(document.body);
            fun.page_ini();
        });
    });

})();


