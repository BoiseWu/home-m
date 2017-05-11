package com.home.common.utils;

import java.io.*;
import java.text.DecimalFormat;

public class FileUtils {
	
	private static final int BUFFER_SIZE = 2 * 1024;
	
	public static String FormetFileSize(long fileS) {
        DecimalFormat df = new DecimalFormat("#.00");
        String fileSizeString = "";
        if (fileS < 1024) {
            fileSizeString = df.format((double) fileS) + "B";
        } else if (fileS < 1048576) {
            fileSizeString = df.format((double) fileS / 1024) + "K";
        } else if (fileS < 1073741824) {
            fileSizeString = df.format((double) fileS / 1048576) + "M";
        } else {
            fileSizeString = df.format((double) fileS / 1073741824) + "G";
        }
        return fileSizeString;
    }
	
	/**
	 * 保存文件
	 * @param src 文件�?
	 * @param dst 目标文件
	 */
	public static void copy(File src, File dst) {
		InputStream in = null;
		OutputStream out = null;
		try {
			in = new BufferedInputStream(new FileInputStream(src), BUFFER_SIZE);
			out = new BufferedOutputStream(new FileOutputStream(dst),
					BUFFER_SIZE);
			byte[] buffer = new byte[BUFFER_SIZE];
			while (in.read(buffer) > 0) {
				out.write(buffer);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (null != in) {
				try {
					in.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if (null != out) {
				try {
					out.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	public static boolean isBigFile(File file) throws Exception{
		boolean flag = false;
		long s = 0;
        if (file.exists()){
            FileInputStream fis = null;
            fis = new FileInputStream(file);
            s = fis.available();
        } else {
        	flag = true;
        }
        double size = (double) s / 1048576;
        if(size>2 && !flag){
        	flag = true;
        }
        return flag;
	}
	
	/**
	 * 返回不带后缀的文件名
	 * @param fileName 文件全名（包含后�?��
	 * @return
	 */
	public static String getExtention(String fileName) {
		int pos = fileName.lastIndexOf(".");
		return fileName.substring(pos);
	}

}
