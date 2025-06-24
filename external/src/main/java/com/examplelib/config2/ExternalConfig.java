package com.examplelib.config2;

import com.examplelib.external.CourseRecommender;
import com.examplelib.external.CourseRecommenderImpl3;
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
