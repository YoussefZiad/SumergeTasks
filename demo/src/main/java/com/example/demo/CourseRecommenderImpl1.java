package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import com.examplelib.external.CourseRecommender;
import com.examplelib.external.Course;

import java.util.Arrays;
import java.util.List;

@Component("PrimaryRecommender")
@Primary
public class CourseRecommenderImpl1 implements CourseRecommender {

    @Autowired
    public CourseRecommenderImpl1(){
        System.out.println("Impl 1 Created");
    }

    @Override
    public List<Course> recommendCourses() {
        return Arrays.asList(new Course("Math III", 8),
                new Course("Databases II", 6),
                new Course("Physics III", 4));
    }

}
