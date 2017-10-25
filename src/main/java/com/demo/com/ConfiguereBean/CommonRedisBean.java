package com.demo.com.ConfiguereBean;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Created by admin on 2017/10/25.
 */
@ConfigurationProperties(prefix = "spring.redis")
@Component
public class CommonRedisBean extends RedisBean {
}
