package com.example.demo;

import com.examplelib.external.CourseRecommender;
import com.examplelib.external.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class CourseRecommenderImpl2 implements CourseRecommender {

    JdbcTemplate jdbcTemplate;

    @Autowired
    public CourseRecommenderImpl2(JdbcTemplate jdbcTemplate){
        System.out.println("Impl 2 Created");
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Course> recommendCourses(String query) {
        System.out.println("Recommending using Tertiary Bean");
        return jdbcTemplate.query(query,
                (rs, _) -> new Course(
                        rs.getInt("id"),
                        rs.getInt("credit"),
                        rs.getString("description"),
                        rs.getString("name")
                ));
    }

}
