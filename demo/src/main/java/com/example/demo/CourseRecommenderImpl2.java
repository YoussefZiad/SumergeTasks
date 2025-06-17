package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

public class CourseRecommenderImpl2 implements CourseRecommender {

    @Autowired
    public CourseRecommenderImpl2(){
        System.out.println("Impl 2 Created");
    }

    @Override
    public List<Course> recommendCourses() {
        return Arrays.asList(new Course("Math II", 8),
                new Course("Databases I", 6),
                new Course("Physics II", 4));
    }

}
