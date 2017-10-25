package com.demo.configurer;

import com.demo.com.ConfiguereBean.RedisBean;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import redis.clients.jedis.JedisPoolConfig;

/**
 * Created by admin on 2017/10/25.
 */

public class RedisConfigurer {

    private RedisBean redisBean;

    public RedisTemplate createRedisTemplate(RedisBean redis) {
        StringRedisTemplate template = new StringRedisTemplate(createFactory(redis));
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        template.setValueSerializer(jackson2JsonRedisSerializer);
        template.setHashValueSerializer(jackson2JsonRedisSerializer);
        template.afterPropertiesSet();
        return template;
    }

    public RedisConnectionFactory createFactory(RedisBean redis) {
        JedisConnectionFactory jedis = new JedisConnectionFactory();
        jedis.setHostName(redis.getHost());
        jedis.setPort(redis.getPort());
        if (!StringUtils.isEmpty(redis.getPassword())) {
            jedis.setPassword(redis.getPassword());
        }
        if (redis.getDatabase() != 0) {
            jedis.setDatabase(redis.getDatabase());
        }
        jedis.setTimeout(redis.getTimeout());
        jedis.setPoolConfig(poolCofig(redis.getMaxIdle(),
                redis.getMaxTotal(), redis.getMaxWaitMillis(),redis.isTestOnBorrow(), redis.isTestOnReturn()));
        jedis.afterPropertiesSet(); // 初始化连接pool
        return jedis;
    }

    private JedisPoolConfig poolCofig(int maxIdle, int maxTotal, long maxWaitMillis,
                                      boolean testOnBorrow, boolean testOnReturn) {
        JedisPoolConfig poolCofig = new JedisPoolConfig();
        poolCofig.setMaxIdle(maxIdle);
        poolCofig.setMaxTotal(maxTotal);
        poolCofig.setMaxWaitMillis(maxWaitMillis);
        poolCofig.setTestOnBorrow(testOnBorrow);
        poolCofig.setTestOnReturn(testOnReturn);
        return poolCofig;
    }

}
