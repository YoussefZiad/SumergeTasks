package com.examplelib.external;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Arrays;
import java.util.List;

public class CourseRecommenderImpl3 implements CourseRecommender {

    JdbcTemplate jdbcTemplate;

    @Autowired
    public CourseRecommenderImpl3(JdbcTemplate jdbcTemplate){
        System.out.println("Impl 3 Created");
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
