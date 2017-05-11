package com.home.common.utils;


import org.apache.commons.httpclient.util.URIUtil;

/**
 * url encode工具类
 * 
 * @date 2015-07-15 下午01:25:18
 * @author dyc
 */
public class EncodeUtils {
	/**
	 * encode the url using encoding UTF-8
	 * 
	 * @param url
	 * @return
	 */
	public static String encodeURL(String url) {
		return encodeURL(url, "UTF-8");
	}

	/**
	 * encode the url using encoding
	 * 
	 * @param url
	 * @return
	 */
	public static String encodeURL(String url, String encoding) {
		try {
			return URIUtil.encodeWithinQuery(url, encoding);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * decode the url using encoding UTF-8
	 * 
	 * @param url
	 * @return
	 */
	public static String decodeURL(String url) {
		return decodeURL(url, "UTF-8");
	}

	/**
	 * decode the url using encoding
	 * 
	 * @param url
	 * @param encoding
	 * @return
	 */
	public static String decodeURL(String url, String encoding) {
		try {
			return URIUtil.decode(url, encoding);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
}
