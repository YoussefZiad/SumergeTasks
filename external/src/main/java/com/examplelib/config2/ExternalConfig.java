package com.examplelib.config2;

import com.examplelib.external.CourseRecommender;
import com.examplelib.external.CourseRecommenderImpl3;
import com.examplelib.external.SampleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan("com.examplelib.external")
public class ExternalConfig {

    SampleRepository repository;

    @Autowired
    public ExternalConfig(@Qualifier("CourseRepo") SampleRepository repository){
        this.repository = repository;
    }

    @Bean("TertiaryRecommender")
    public CourseRecommender tertiaryCourseRecommender(){
        return new CourseRecommenderImpl3(repository);
    }

}
