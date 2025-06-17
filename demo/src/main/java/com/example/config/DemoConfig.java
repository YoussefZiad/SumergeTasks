package com.example.config;

import com.example.demo.CourseRecommender;
import com.example.demo.CourseRecommenderImpl2;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import com.example.config.ExternalConfig;

@Configuration
@ComponentScan("com.example.demo")
@Import(ExternalConfig.class)
public class DemoConfig {

    @Bean("SecondaryRecommender")
    public CourseRecommender secondaryCourseRecommender(){
        return new CourseRecommenderImpl2();
    }

}
