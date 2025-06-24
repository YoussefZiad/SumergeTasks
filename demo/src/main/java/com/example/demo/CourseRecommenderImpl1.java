package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import com.examplelib.external.CourseRecommender;
import com.examplelib.external.Course;

import java.util.Arrays;
import java.util.List;

@Component("PrimaryRecommender")
@Primary
public class CourseRecommenderImpl1 implements CourseRecommender {

    JdbcTemplate jdbcTemplate;

    @Autowired
    public CourseRecommenderImpl1(JdbcTemplate jdbcTemplate){
        System.out.println("Impl 1 Created");
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Course> recommendCourses(String query) {
        System.out.println("Recommending using Primary Bean");
        return jdbcTemplate.query(query,
                (rs, _) -> new Course(
                        rs.getInt("id"),
                        rs.getInt("credit"),
                        rs.getString("description"),
                        rs.getString("name")
                ));
    }
}
