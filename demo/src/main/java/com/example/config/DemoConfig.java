package com.example.config;

import com.example.demo.CourseRecommenderImpl2;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.CourseRecommenderImpl3Override;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import org.springframework.context.annotation.Import;
import com.examplelib.config2.ExternalConfig;
import com.examplelib.external.CourseRecommender;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
@ComponentScan("com.example")
public class DemoConfig {

    JdbcTemplate jdbcTemplate;

    @Autowired  // Optional, Spring will autowire DataSource anyway
    public DemoConfig(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Bean("SecondaryRecommender")
    public CourseRecommender secondaryCourseRecommender(){
        return new CourseRecommenderImpl2();
    }


    @Bean("TertiaryRecommender")
    public CourseRecommender tertiaryCourseRecommender() {
        return  new CourseRecommenderImpl3Override();
    }

}
