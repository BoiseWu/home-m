/**
 * 
 */
/**
 * @author dangyuanchao
 *
 */
package com.home.common.cache;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import redis.clients.jedis.Jedis;

import java.util.List;

//@Component
public class CacheImpl implements Cache{

	private static final Logger logger = LoggerFactory.getLogger(CacheImpl.class);
	
	//@Autowired
	Jedis jedis;
	
	public static final int TIMEOUT = 3600;
    //域名唯一标识_模块唯一标识_key唯一标识
	public final static String KEY = "%s_%s_%s";
	
	public String get(String key) {
		String value = jedis.get(key);
		logger.debug("get--->key:" + key + "; values:" + value);
		return value;
	}

	@Override
	public String setex(String key, String value, Integer timeOut) {
		logger.debug("set--->key:" + key + "; value=" + value);
		return jedis.setex(key, timeOut, value);
	}

	@Override
	public String set(String key, String value) {
		logger.debug("set--->key:" + key + "; value=" + value);
		return jedis.set(key, value);
	}

	@Override
	public void remove(String key) {
		logger.debug("remove--->key:" + key);
		jedis.del(key);
	}

	@Override
	public Long incr(String key) {
		logger.debug("incr--->key:" + key);
		return jedis.incr(key);
	}

	@Override
	public Object getObject(String key) {
		logger.debug("getObject--->key:" + key);
		return null;//jedis.getObject(key);
	}

	@Override
	public List<Object> setObject(String key, int seconds, Object value) {
		logger.debug("setObject--->key:" + key);
		return null;//jedis.set.setObject(key, seconds, value);
	}

	public void setRedis(Jedis jedis) {
		this.jedis = jedis;
	}
}