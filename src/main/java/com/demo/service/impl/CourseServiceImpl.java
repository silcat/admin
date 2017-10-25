package com.demo.service.impl;

import com.demo.orm.mapper.CourseMapper;
import com.demo.orm.model.Course;
import com.demo.service.CourseService;
import com.demo.core.AbstractService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;


/**
 * Created by CodeGenerator on 2017/10/25.
 */
@Service
@Transactional
public class CourseServiceImpl extends AbstractService<Course> implements CourseService {
    @Resource
    private CourseMapper courseMapper;

}
