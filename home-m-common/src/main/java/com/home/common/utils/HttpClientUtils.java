package com.home.common.utils;

import org.apache.commons.httpclient.DefaultHttpMethodRetryHandler;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

/**
 * @description httpclient工具
 * @Date: 2015-07-17
 */
public class HttpClientUtils {
	

	/**
	 * 执行post请求，并返回响应体
	 * 
	 * @param url
	 * @param paras
	 * @return
	 * @throws IOException
	 */
	public static String doPost(String url, Map<String, String> paras) throws IOException {
		System.out.print("---------------------doPost-----------------------");
		String re = null;
		HttpClient httpClient = new HttpClient();
		httpClient.getHttpConnectionManager().getParams().setConnectionTimeout(30000);
		httpClient.getHttpConnectionManager().getParams().setSoTimeout(30000);
		PostMethod postMethod = new PostMethod(url);
		postMethod.addRequestHeader("Connection", "close");
		httpClient.getParams().setBooleanParameter("http.protocol.expect-continue", Boolean.FALSE.booleanValue());

		httpClient.getParams().setParameter(HttpMethodParams.HTTP_CONTENT_CHARSET, "UTF-8");
		if (paras != null && paras.size() > 0) {
			NameValuePair[] data = new NameValuePair[paras.size()];
			int i = 0;
			for (String key : paras.keySet()) {
				data[i] = new NameValuePair(key, paras.get(key));
				i++;
			}

			postMethod.setRequestBody(data);
		}

		if (httpClient.executeMethod(postMethod) == HttpStatus.SC_OK) {
			re = postMethod.getResponseBodyAsString();
		}
		postMethod.releaseConnection();

		return re;
	}

	public void httpClient(String payUrl,Map<String,String> map){
		try{
			doPost(payUrl, map);
		}catch (Exception e){

		}
	}

	public static String doGet(String url,Map<String, String> paras) throws IOException {
		String re = null;
		StringBuilder builder = new StringBuilder();
		builder.append(url);
		if(!StringUtils.isNullString(url)&&url.indexOf("?")<0){
			builder.append("?");
		}
		HttpClient httpClient = new HttpClient();
		httpClient.getHttpConnectionManager().getParams().setConnectionTimeout(30000);
		httpClient.getHttpConnectionManager().getParams().setSoTimeout(30000);
		httpClient.getParams().setBooleanParameter("http.protocol.expect-continue", Boolean.FALSE.booleanValue());
		httpClient.getParams().setParameter(HttpMethodParams.HTTP_CONTENT_CHARSET, "UTF-8");
		
		Set<String> keys = new TreeSet<String>();
		keys = paras.keySet();
		Iterator<String> it = keys.iterator();
		while(it.hasNext()){
			String name = it.next();
			String value = paras.get(name);
			builder.append(EncodeUtils.encodeURL(name)).append("=").append(
					EncodeUtils.encodeURL(value));
			if (it.hasNext()) {
				builder.append("&");
			}
		}
		GetMethod getMethod = new GetMethod(builder.toString());
		getMethod.addRequestHeader("Connection", "close");
		getMethod.getParams().setParameter(HttpMethodParams.RETRY_HANDLER, new DefaultHttpMethodRetryHandler(3, false));
		if (httpClient.executeMethod(getMethod) == HttpStatus.SC_OK) {
			re = getMethod.getResponseBodyAsString();
		}
		getMethod.releaseConnection();
		return re;
	}
	
	/**  
     * 发送xml数据请求到server端  
     * @param urlStr xml请求数据地址
     * @param xmlInfo 发送的xml数据流
     * @return null发送失败，否则返回响应内容  
     */    
    public void httpPostXml(String urlStr,String xmlInfo){    
    	try {
            URL url = new URL(urlStr);
            URLConnection con = url.openConnection();
            con.setDoOutput(true);
            con.setRequestProperty("Pragma:", "no-cache");
            con.setRequestProperty("Cache-Control", "no-cache");
            con.setRequestProperty("Content-Type", "text/xml");

            OutputStreamWriter out = new OutputStreamWriter(con
                    .getOutputStream());   
            System.out.println("urlStr=" + urlStr);
            System.out.println("xmlInfo=" + xmlInfo);
            out.write(new String(xmlInfo.getBytes("ISO-8859-1")));
            out.flush();
            out.close();
            BufferedReader br = new BufferedReader(new InputStreamReader(con
                    .getInputStream()));
            String line = "";
            for (line = br.readLine(); line != null; line = br.readLine()) {
                System.out.println(line);
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }    
    }   
}
