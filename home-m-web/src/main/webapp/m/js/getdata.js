// JavaScript Document

function get_data(url,data,send_type,callback_fun){
	if(send_type == "post"){
		$.post(url,data,function(json){
			callback_fun(json);
		});
	}
	else{
		$.getJSON(url,data,function(json){
			callback_fun(json);
		});

	}
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
