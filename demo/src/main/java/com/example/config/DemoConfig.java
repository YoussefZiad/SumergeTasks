package com.example.config;

import com.example.demo.CourseRecommenderImpl2;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import com.example.config.ExternalConfig;
import com.example.external.CourseRecommender;

@Configuration
@ComponentScan("com.example.demo")
@Import(ExternalConfig.class)
public class DemoConfig {

    @Bean("SecondaryRecommender")
    public CourseRecommender secondaryCourseRecommender(){
        return new CourseRecommenderImpl2();
    }

}
