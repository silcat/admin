package com.demo.service.impl;

import com.demo.orm.mapper.StudentMapper;
import com.demo.orm.model.Student;
import com.demo.service.StudentService;
import com.demo.core.AbstractService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;


/**
 * Created by CodeGenerator on 2017/07/16.
 */
@Service
@Transactional
public class StudentServiceImpl extends AbstractService<Student> implements StudentService {
    @Resource
    private StudentMapper studentMapper;

}
