package com.example.config;

import com.example.external.CourseRecommender;
import com.example.external.CourseRecommenderImpl3;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan("com.example.external")
public class ExternalConfig {

    @Bean("TertiaryRecommender")
    public CourseRecommender tertiaryCourseRecommender(){
        return new CourseRecommenderImpl3();
    }

}
