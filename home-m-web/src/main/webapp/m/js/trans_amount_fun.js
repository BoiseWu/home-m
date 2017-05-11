(function(){

    var queryType;
    var getType;

    var fun = {
    		countshop_fill : function(data){
    		
        	if(data.code == 0){
                var dataVo = data.result;
                
                var dateData = dataVo.dateStr.split(',');
                var strData = dataVo.dataStr.split(',');
                
                var dataLegend ;
                var stack;
                
                if(getType=='transOrderCount'){
                	dataLegend = '成交单数';
                	stack = '单数';
                }else if(getType=='transProdCount'){
                	dataLegend = '成交商品数';
                	stack = '商品数';
                }else if(getType=='totalOrderCount'){
                	dataLegend = '总订单数';
                	stack = '单数';
                }else if(getType=='transRate'){
                	dataLegend = '成交率';
                	stack = '率';
                }else{
                	dataLegend = '成交金额';
                	stack = '金额';
                }
				if (window.fun.isapp()) {
					JDSY.app.setTitle({name: dataLegend});
				} else {
					$('h1').html(dataLegend);
				}
                $('.text').html(dateData[0]+'   昨日');
                $('.text2').html(dataLegend+"：<em class='text'>"+strData[0]+"</em>");
                var chart1 = echarts.init(document.getElementById('chart1'));
               
                var option = {
            	    title: {},
            	    tooltip : {
            	        trigger: 'axis'
            	    },
            	    legend: {
            	    	show: false,
            	        data:[dataLegend]
            	    },
            	    toolbox: {},
            	    grid: {
            	    	top: '10%',
            	        left: '2%',
            	        right: '5%',
            	        bottom: '10%',
            	        itemStyle: {
            				    normal: {
            				        borderColor: 'rgba(0, 0, 0, 0.8)'
            				    }
            				},
            	        containLabel: true
            	    },
            	    xAxis : [
            	        {
            	            type : 'category',
            	            boundaryGap : false,
            	            data : dateData
            	        }	    ],
            	    yAxis : [
            	        {
            	            type : 'value'
            	        }
            	    ],
            	    dataZoom: [//是否缩放
            	    	{
            	    		type: 'inside'
            	        }
            	    ],
            	    series : [
            	        {
            	            name:dataLegend,
            	            type:'line',
            	            stack: stack,
            	            data: strData,
            	            itemStyle: {
            				    normal: {
            				        color: 'rgba(43, 184, 170, 0.8)'
            				    }
            				}

            	        }
            	    ]
            	};
                
                // 使用刚指定的配置项和数据显示图表。
                chart1.setOption(option);
                window.onresize = chart1.resize;
                
                
            }
            else{
            	
                JDSY.app.alert({msg:data.msg});
            }
        },

        page_ini : function(){
        	page_set.top_bar({view: true, btn_back: true, title: "", before: $(".ui-flex")});
        	queryType = comm_fun.GetQueryString("queryType");
        	getType = comm_fun.GetQueryString("getType");
        	
        	if('zb' == queryType){
        		JDSY.util.post(query_url.countShop,{'days':'15','getType':getType},fun.countshop_fill,false);
        	}else{
        		JDSY.util.post(query_url.countShop,{'days':'7','getType':getType},fun.countshop_fill,false);
        	}
        	
        	
        
        }
    };


    $(document.body).ready(function() {
        JDSY.ready(function () {
        	
            //FastClick.attach(document.body);
            fun.page_ini();
        });
    });

})();