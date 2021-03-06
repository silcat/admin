package com.demo.configurer;

import com.demo.com.ConfiguereBean.CommonRedisBean;
import com.demo.com.ConfiguereBean.SpringSessionRedisBean;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.DefaultRedisCachePrefix;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;

import javax.annotation.Resource;

/**
 * Created by admin on 2017/10/25.
 */
@Configuration
@EnableCaching
public class CachableConfigurer extends RedisConfigurer{
    @Resource
    private CommonRedisBean commonRedisBean;
    @Resource
    private SpringSessionRedisBean springSessionRedisBean;

    /**
     *缓存管理器配置
     */
    @Bean
    public CacheManager cacheManager( CommonRedisBean commonRedisBean) {
        // 创建缓存管理器
        RedisCacheManager cacheManager = new RedisCacheManager(createRedisTemplate(commonRedisBean));
        cacheManager.setDefaultExpiration(3600 * 24);
        cacheManager.setUsePrefix(true);
        cacheManager.setCachePrefix(new DefaultRedisCachePrefix(":"));
        return cacheManager;
    }
    /**
     *session缓存redis连接工厂配置
     */
    @Bean(name = "sessionJedisConnectionFactory")
    public RedisConnectionFactory sessionJedisConnectionFactory() {
        return createFactory(springSessionRedisBean);
    }

}
