package com.home.common.utils;

import com.home.common.model.GlobalConstants;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;

public class CookieUtils {
	
	private static int encode_length = 0;
	public static void setCookie(HttpServletRequest request,HttpServletResponse response,String key,String value){
		setCookie(request,response, key, value, GlobalConstants.COOKIE_MAX_AGE, true);
	}

    /**
     *
     * @param request
     * @param response
     * @param key
     * @param value
     * @param isSec 默认true  加密
     */
    public static void setCookie(HttpServletRequest request,HttpServletResponse response,String key,String value, boolean isSec){
        setCookie(request,response, key, value, GlobalConstants.COOKIE_MAX_AGE, isSec);
    }

	public static void setCookie(HttpServletRequest request,HttpServletResponse response,String key,String value,int maxValue, boolean isSec){
		if(null == key){
			return ;
		}
		if(null == value){
			value = "";
		}
		
		Cookie cookie = null;
        if(isSec){
            cookie = new Cookie(key, encodeCookie(value));
        }else{
            cookie = new Cookie(key, value);
        }
	    cookie.setDomain(getDomain(request));
	    cookie.setPath("/");
	    if (maxValue != 0) {
	      cookie.setMaxAge(maxValue);
	    } else {
	      cookie.setMaxAge(GlobalConstants.COOKIE_MAX_AGE);
	    }
	    response.addCookie(cookie);
	}
	
	public static void deleteCookie(HttpServletRequest request,HttpServletResponse response, String key){
		if (null == key) {
		      return;
		    }
		    Cookie cookie = getCookie(request, key);
		    if(null != cookie){
		    	cookie.setDomain(getDomain(request));
		    	cookie.setPath("/");
		    	cookie.setValue("");
		    	cookie.setMaxAge(0);
		    	response.addCookie(cookie);
		    }
	}
	
	public static Cookie getCookie(HttpServletRequest request, String key){
		Cookie[] cookies = request.getCookies();
	    if (null == cookies || null == key || key.length() == 0) {
	      return null;
	    }
	    Cookie cookie = null;
	    for (Cookie c : cookies) {
	      if (key.equals(c.getName())) {
	        cookie = c;
	        break;
	      }
	    }
	    return cookie;
	}
	
	public static String getDomain(HttpServletRequest request){
		String serverName = request.getServerName();
		int i = serverName.indexOf(".");
		return serverName.substring(i);
	}
	
	public static String getCookieValue(HttpServletRequest request, String key){
		Cookie cookie = getCookie(request, key);
		if(cookie == null){
			return null;
		}
		return decodeCookie(cookie.getValue());
	}

    /**
     * 获取cookie
     * @param request
     * @param key
     * @param isSec 默认true 解密获取
     * @return
     */
    public static String getCookieValue(HttpServletRequest request, String key, boolean isSec){
        Cookie cookie = getCookie(request, key);
        if(cookie == null){
            return null;
        }
        if(isSec){
            return decodeCookie(cookie.getValue());
        }
        return cookie.getValue();
    }
	
	 /**
     * cookie中的值加密
     */
    public static String encodeCookie(String value){
        String encode = "";
        byte bytes[];
        try {
        	encode_length = value.length();
            bytes = value.getBytes("utf-8");
            encode = encode_base64(bytes,bytes.length); 
        } catch (UnsupportedEncodingException e) {          
            e.printStackTrace();
        }
        return encode;
    }
    /**
     * cookie中值解密
     */
    public static String decodeCookie(String value){
        byte bytes[];                           
        String decode = "";
        try {
            bytes = decode_base64(value,value.length());
            decode = new String(bytes,"UTF-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return decode;
    }
     
    static private final char base64_code[] = {
        '.', '/', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
        'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
        'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5',
        '6', '7', '8', '9'
    };
 
    // Table for Base64 decoding
    static private final byte index_64[] = {
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        -1, -1, -1, -1, -1, -1, 0, 1, 54, 55,
        56, 57, 58, 59, 60, 61, 62, 63, -1, -1,
        -1, -1, -1, -1, -1, 2, 3, 4, 5, 6,
        7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
        17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
        -1, -1, -1, -1, -1, -1, 28, 29, 30,
        31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
        51, 52, 53, -1, -1, -1, -1, -1
    };
    private static String encode_base64(byte d[], int len)  throws IllegalArgumentException {
        int off = 0;
        StringBuffer rs = new StringBuffer();
        int c1, c2;
     
        if (len <= 0 || len > d.length)
            throw new IllegalArgumentException ("Invalid len");
     
        while (off < len) {
            c1 = d[off++] & 0xff;
            rs.append(base64_code[(c1 >> 2) & 0x3f]);
            c1 = (c1 & 0x03) << 4;
            if (off >= len) {
                rs.append(base64_code[c1 & 0x3f]);
                break;
            }
            c2 = d[off++] & 0xff;
            c1 |= (c2 >> 4) & 0x0f;
            rs.append(base64_code[c1 & 0x3f]);
            c1 = (c2 & 0x0f) << 2;
            if (off >= len) {
                rs.append(base64_code[c1 & 0x3f]);
                break;
            }
            c2 = d[off++] & 0xff;
            c1 |= (c2 >> 6) & 0x03;
            rs.append(base64_code[c1 & 0x3f]);
            rs.append(base64_code[c2 & 0x3f]);
        }
        return rs.toString();
    }
    private static byte char64(char x) {
        if ((int)x < 0 || (int)x > index_64.length)
            return -1;
        return index_64[(int)x];
    }
    private static byte[] decode_base64(String s, int maxolen) throws IllegalArgumentException {
        StringBuffer rs = new StringBuffer();
        int off = 0, slen = s.length(), olen = 0;
        byte ret[];
        byte c1, c2, c3, c4, o;
     
        if (maxolen <= 0)
            throw new IllegalArgumentException ("Invalid maxolen"); 
        while (off < slen - 1 && olen < maxolen) {
            c1 = char64(s.charAt(off++));
            c2 = char64(s.charAt(off++));
            if (c1 == -1 || c2 == -1)
                break;
            o = (byte)(c1 << 2);
            o |= (c2 & 0x30) >> 4;
            rs.append((char)o);
            if (++olen >= maxolen || off >= slen)
                break;
            c3 = char64(s.charAt(off++));
            if (c3 == -1)
                break;
            o = (byte)((c2 & 0x0f) << 4);
            o |= (c3 & 0x3c) >> 2;
            rs.append((char)o);
            if (++olen >= maxolen || off >= slen)
                break;
            c4 = char64(s.charAt(off++));
            o = (byte)((c3 & 0x03) << 6);
            o |= c4;
            rs.append((char)o);
            ++olen;
        }
     
        ret = new byte[olen];
        for (off = 0; off < olen; off++)
            ret[off] = (byte)rs.charAt(off);
        return ret;
    }
     
    public static void main(String[] args) {
        System.out.println(encodeCookie("admin11"));;
//      [97, 100, 109, 105, 110]
//      [97, 100, 109, 105, 110]
        System.out.println(decodeCookie("KReuKBCvKxGyLRb6KR.uKBCwdBH6Ke"));;
    }
	
}
