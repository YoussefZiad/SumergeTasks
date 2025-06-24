package com.example.demo;

import com.examplelib.external.Course;
import com.examplelib.external.CourseRecommenderImpl3;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class CourseRecommenderImpl3Override extends CourseRecommenderImpl3 {

    @Autowired
    public CourseRecommenderImpl3Override(){
        super();
        System.out.println("(Override)");
    }

    @Override
    public List<Course> recommendCourses() {
        List<Course> recommended = super.recommendCourses();
        recommended.add(new Course("CS II", 8));
        return recommended;
    }

}
