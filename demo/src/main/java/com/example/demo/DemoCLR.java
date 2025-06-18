package com.example.demo;

import com.example.course.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DemoCLR implements CommandLineRunner {

    @Autowired
    CourseService courseService;

    @Override
    public void run(String... args) throws Exception {

    }
}