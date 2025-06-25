package com.example.demo;

import com.example.course.JPACourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import com.examplelib.external.CourseRecommender;

@Component("PrimaryRecommender")
@Primary
public class CourseRecommenderImpl1 implements CourseRecommender {

    JPACourseRepository repository;

    @Autowired
    public CourseRecommenderImpl1(JPACourseRepository repository){
        this.repository = repository;
    }

    @Override
    public Page recommendCourses(Pageable pageable) {
        System.out.println("Recommending using Primary Bean");
        return repository.findByCreditGreaterThan(3, pageable);
    }
}
