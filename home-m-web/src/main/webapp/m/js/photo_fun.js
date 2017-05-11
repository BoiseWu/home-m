/**
 * Created by chengfubei on 2016/5/20.
 */

(function () {
    var page_size = 30; // 每页几项
    var current_page = 1; // 当前页数
    var editImg = new Array(); // 图片操作列表参数

    var is_last_page = false; // 是否是最后一页
    var is_end = false; // 新数据是否加载完毕

    /*公共函数*/
    var photo_fun = {
        page_ini : function(){
            $(".m-btn").on("click", photo_evt.submit_photo);
            $(".file").on("change", photo_evt.upload_photo);
            $("#photo-end").css("display","none");
            $("#photo-edit").on("click",photo_evt.photo_edit);
            $("#photo-end").on("click",photo_evt.photo_end);
            //$(window).scroll(hp_evt.scroll_event);
            photo_fun.get_data();
        },

        get_data: function(){
            is_end = false;
            params = {};
            JDSY.util.post(query_url.getUserPhoto,params,photo_fun.fill_data,null,false);
        },

        fill_data: function (data) {
            is_last_page = false;
            var imageList = data.result == null ? {} : data.result;
            if(data.code == 0 && imageList.length > 0){
                //is_last_page = page_size > imageList.length; // 是否刷新相关参数
                var html_temp = template($("#imgTemp").html(), {list: imageList});
                if(current_page == 1){
                    $(".gridly").html(html_temp);
                }else { // 数据追加
                    $(".gridly").append(html_temp);
                }
                // 图片处理
                photo_fun.image_compress();

            }else if(data.code == 0 && grouponResultList.length == 0 && current_page == 1){
                var html_temp = '<div class="no-page" style="display: block;"><i class="no-icon icon13"></i> <div class="no-text"><p>个人相册无图片哦~</p></div></div>'
                $(".gridly").html(html_temp);
            }else {
                //JDSY.app.alert({msg:data.msg});
            }
            is_end = true; // 是否刷新相关参数
        },

        /* 图片处理 */
        image_compress : function(){
            $('.gridly').gridly();
            $('.gridly').gridly('draggable');
            $('.gridly .brick').click(function(event) {
                var size;
                event.preventDefault();
                event.stopPropagation();
                $(this).toggleClass('small');
                $(this).toggleClass('large');
                if ($(this).hasClass('small')) {
                    size = 140;
                }
                if ($(this).hasClass('large')) {
                    size = 300;
                }
                $(this).data('width', size);
                $(this).data('height', size);
                return $('.gridly').gridly('layout');
            });
            return $('.gridly .delete').click(function(event) {
                event.preventDefault();
                event.stopPropagation();
                $(this).closest('.brick').remove();
                var dataId = $(this).parents(".brick").attr("data-id");
                editImg[editImg.length] = dataId;
                return $('.gridly').gridly('layout');
            });
        },

        // 是否允许加载新数据
        is_refresh : function(){
            var is_overflow_screen = false;
            if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
                is_overflow_screen = true;
            }
            // 满足 超出屏幕,不是最后一页,上一次数据加载完毕 允许加载新的数据
            return is_overflow_screen && !is_last_page && is_end;
        },

    };

    /*事件处理*/
    var photo_evt ={
        upload_photo:function () {
            var  params = comm_fun.getFormParam('#uploadImg');

            JDSY.util.post(query_url.uploadImg, params, function(data){
                if(0 == data.code){
                    if(!data.result){
                        JDSY.app.alert({type:"succ",msg:"图片上传成功"});
                        var imageList = new Array(data.result);
                        var html_temp = template($("#imgTemp").html(), {list: imageList});
                        $(".gridly").append(html_temp);
                        photo_fun.image_compress();

                        editImg[editImg.length] = data.result;
                    }

                } else {
                    JDSY.app.alert({msg:data.msg});
                }
            },null,false);
        },
        photo_edit:function () {
            $("#photo-end").css("display","block");
            $("#photo-edit").css("display","none");
            $(".delete").css("display","block");
        },
        photo_end:function () {
            $("#photo-end").css("display","none");
            $("#photo-edit").css("display","block");
            $(".delete").css("display","none");
        },
        submit_photo:function () {
            alert(JSON.stringify(editImg));
            JDSY.util.post(query_url.editUserPhoto, {"editImgs":editImg}, function(data){
                if(0 == data.code){
                    JDSY.app.alert({type:"succ",msg:"图片编辑成功"});

                } else {
                    JDSY.app.alert({msg:data.msg});
                }
            },null,false);
        }

    };

    $(document.body).ready(function(){
            JDSY.ready(function(){
                FastClick.attach(document.body);
                photo_fun.page_ini();
            });
        }
    );

})();
