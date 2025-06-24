package com.examplelib.config2;

import com.examplelib.external.CourseRecommender;
import com.examplelib.external.CourseRecommenderImpl3;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
@ComponentScan("com.example.external")
public class ExternalConfig {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Bean("TertiaryRecommender")
    public CourseRecommender tertiaryCourseRecommender(){
        return new CourseRecommenderImpl3(jdbcTemplate);
    }

}
