package com.example.demo;

import com.example.course.JPACourseRepository;
import com.examplelib.external.CourseRecommender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public class CourseRecommenderImpl2 implements CourseRecommender {

    JPACourseRepository repository;

    @Autowired
    public CourseRecommenderImpl2(JPACourseRepository repository){
        this.repository = repository;
    }

    @Override
    public Page recommendCourses(Pageable pageable) {
        System.out.println("Recommending using Secondary Bean");
        return repository.findByCreditGreaterThan(6, pageable);
    }

}
