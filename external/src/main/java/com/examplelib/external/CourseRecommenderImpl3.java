package com.examplelib.external;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public class CourseRecommenderImpl3 implements CourseRecommender {

    SampleRepository repository;

    @Autowired
    public CourseRecommenderImpl3(SampleRepository repository){
        System.out.println("Impl 3 Created");
        this.repository = repository;
    }

    @Override
    public Page recommendCourses(Pageable pageable) {
        System.out.println("Recommending using Tertiary Bean");
        return repository.findByCreditGreaterThan(4, pageable);
    }

}
