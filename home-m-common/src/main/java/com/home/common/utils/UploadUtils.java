package com.home.common.utils;

import java.io.File;
import java.util.Iterator;

/**
 * @author dyc
 * @date 2015年4月30日上午10:14:16 	
 * @version 1.0
 */
public class UploadUtils {
public UploadUtils(){
		
	}

	/*public static JSONObject uploadPic(HttpServletRequest request,String path) throws Exception{
		String image_path = DateUtils.getYearTime() + "/"
				+ DateUtils.getMonthTime() + "/" + DateUtils.getDayTime() + "/";		
		String src_path = path+image_path;
		JSONObject json = new JSONObject();
		//转换成多部分request    
        MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest)request;  
        //取得request中的所有文件名  
        Iterator<String> iter = multiRequest.getFileNames();  
        while(iter.hasNext()){   
            //取得上传文件  
            MultipartFile file = multiRequest.getFile(iter.next());  
            if(file != null){  
            	
                //取得当前上传文件的文件名称  
                String myFileName = file.getOriginalFilename();  
                File tempFile=new File(GlobalSessionField.UPLOADPATH+src_path,myFileName);
                if(!tempFile.exists()){
                	tempFile.mkdirs();
                	tempFile.createNewFile(); 
                }
                file.transferTo(tempFile);
                
                String pic_url = src_path+myFileName;
                
                json.accumulate("src", GlobalSessionField.BASE_HTTP_IMAGE+pic_url);
                json.accumulate("path", pic_url);
            }  
        }
		return json;
	}*/
}
