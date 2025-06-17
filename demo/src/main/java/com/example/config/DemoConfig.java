package com.example.config;

import com.example.demo.CourseRecommenderImpl2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import com.example.external.CourseRecommender;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

@Configuration
@ComponentScan("com.example.demo")
@Import(ExternalConfig.class)
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


}
