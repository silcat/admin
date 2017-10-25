package com.demo.controller;

import com.demo.orm.model.Course;
import com.demo.service.CourseService;
import com.demo.service.StudentService;
import com.github.pagehelper.PageHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import tk.mybatis.mapper.entity.Condition;

import java.util.List;

/**
 * Created by yangtianfeng on 2017/7/16.
 */
@Controller
public class RouteController {
@Autowired
private StudentService studentService;
    @Autowired
    private CourseService courseService;
    @GetMapping("/")
    public String home(){
        PageHelper.startPage(0,2);
        Condition condition = new Condition(Course.class);
        condition.createCriteria().andEqualTo("skuId",147);
        List<Course> byCondition = courseService.findByCondition(condition);
        System.out.print(byCondition.toString() );
        return "home";
    }
}
