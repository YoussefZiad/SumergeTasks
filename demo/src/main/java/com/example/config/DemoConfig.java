package com.example.config;

import com.example.course.JPACourseRepository;
import com.example.demo.CourseRecommenderImpl2;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.CourseRecommenderImpl3Override;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import org.springframework.context.annotation.Import;
import com.examplelib.config2.ExternalConfig;
import com.examplelib.external.CourseRecommender;

@Configuration
@ComponentScan("com.example")
@Import(ExternalConfig.class)
public class DemoConfig {

    JPACourseRepository repository;

    @Autowired  // Optional, Spring will autowire DataSource anyway
    public DemoConfig(JPACourseRepository repository) {
        this.repository = repository;
    }

    @Bean("SecondaryRecommender")
    public CourseRecommender secondaryCourseRecommender(){
        return new CourseRecommenderImpl2(repository);
    }


    @Bean("TertiaryRecommender")
    public CourseRecommender tertiaryCourseRecommender() {
        return new CourseRecommenderImpl3Override(repository);
    }

}
