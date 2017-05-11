package com.home.common.cache;

import java.util.List;

public interface Cache {
	
	String get(String key);

    String setex(String key, String value, Integer timeOut);
    
    String set(String key, String value);

    void remove(String key);
    
    Long incr(String key);
    
    Object getObject(String key);
    
    List<Object> setObject(String key, int seconds, Object value);
}
