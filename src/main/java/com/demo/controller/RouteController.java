package com.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Created by yangtianfeng on 2017/7/16.
 */
@Controller
public class RouteController {

    @GetMapping("/")
    public String home(){
        return "home";
    }
}
