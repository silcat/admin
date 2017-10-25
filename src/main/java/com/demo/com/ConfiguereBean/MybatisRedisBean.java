package com.demo.com.ConfiguereBean;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Created by admin on 2017/10/25.
 */
@ConfigurationProperties(prefix = "spring.mybatis")
@Component
public class MybatisRedisBean extends RedisBean {
}
