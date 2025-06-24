package com.example.config;

import com.example.demo.CourseRecommenderImpl2;
import com.example.demo.CourseRecommenderImpl3Override;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import com.examplelib.config2.ExternalConfig;
import com.examplelib.external.CourseRecommender;

@Configuration
@ComponentScan("com.example.demo")
@Import(ExternalConfig.class)
public class DemoConfig {

    @Bean("SecondaryRecommender")
    public CourseRecommender secondaryCourseRecommender(){
        return new CourseRecommenderImpl2();
    }

    @Bean("TertiaryRecommender")
    public CourseRecommender tertiaryCourseRecommender() {
        return  new CourseRecommenderImpl3Override();
    }

}
