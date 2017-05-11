package com.home.common.utils;

import java.text.SimpleDateFormat;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;


public class StringUtils {
	public StringUtils() {
	}
	
	/**
	 * 六位随机码
	 * @return
	 * @throws PatternSyntaxException
	 */
	public static String randCode(Integer num) throws PatternSyntaxException {
		String strReturn = randomCode(num);
		while(strReturn.length()!=num){
			strReturn = randomCode(num);
		}
		return strReturn;
	}
	
	/**
	 * 返回n个随机数
	 * @author liujinshan
	 * @param n
	 * @return
	 * @throws PatternSyntaxException
	 */
	public static String randomCode(int n) throws PatternSyntaxException {
		double code = Math.random();
		String codeStr = String.valueOf(code);
		return codeStr.substring(2, 2+n);
	}
	
	/**
	 * 验证输入的邮箱格式是否符合
	 * 
	 * @param email
	 * @return 是否合法
	 */
	public static boolean isEmail(String email) {
	    if(!StringUtils.isNullString(email)){
	        final String pattern1 = "^([a-z0-9A-Z]+[_-|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$";
	        final Pattern pattern = Pattern.compile(pattern1);
	        final Matcher matcher = pattern.matcher(email);
	        return matcher.matches(); 
	    }else{
	        return false;
	    }
		
	}
	
	/** 
	 * @param str
	 * String
	 * @return boolean
	 */
	public static boolean isNullString(String str) {
		boolean isNull = false;
		if (str == null || (str != null && str.trim().equals("")))
			isNull = true;
		return isNull;
	}
	
	/**
	 * 返回一个时间名称
	 * 
	 * @param c_path
	 *            客户端的文件路径
	 * @return
	 */
	public static String getFileTimeName(String c_path) {
		SimpleDateFormat shijian = new SimpleDateFormat("yyyyMMDDhhmmssSSS");
		String systemTime = shijian.format(new java.util.Date());
		int temp = c_path.lastIndexOf(".");
		String subName = c_path.substring(temp + 1);
		String filename = systemTime + "." + subName;
		return filename;
	}
	
	
	//隐藏手机号或者邮箱
	public static String hidewords(String words){
		if(!StringUtils.isNullString(words)){
			if(StringUtils.isEmail(words)){
				String ws[] = words.split("@");
				if(ws[0].length()>3){
					return ws[0].substring(0,3)+ "***" + ws[1];
				}else{
					return ws[0]+ "***" + ws[1];
				}
				
				
			}else{
				return words.substring(0, 3) + "****" + words.substring(7);
			}
		}
		return null;
	}
	
}
