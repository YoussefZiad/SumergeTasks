package com.example.demo;

import com.examplelib.external.Course;
import com.examplelib.external.CourseRecommenderImpl3;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class CourseRecommenderImpl3Override extends CourseRecommenderImpl3 {

    JdbcTemplate jdbcTemplate;

    @Autowired
    public CourseRecommenderImpl3Override(JdbcTemplate jdbcTemplate){
        super(jdbcTemplate);
        System.out.println("(Override)");
    }

    @Override
    public List<Course> recommendCourses(String query) {
        System.out.println("(Override)");
        return super.recommendCourses(query);
    }

}
