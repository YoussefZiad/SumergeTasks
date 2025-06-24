package com.examplelib.external;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;
import java.util.List;

public class CourseRecommenderImpl3 implements CourseRecommender {

    @Autowired
    public CourseRecommenderImpl3(){
        System.out.println("Impl 3 Created");
    }

    @Override
    public List<Course> recommendCourses() {
        return Arrays.asList(new Course("Math I", 8),
                new Course("Physics I", 4));
    }

}
