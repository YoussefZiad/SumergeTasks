package com.example.demo;

import com.example.course.JPACourseRepository;
import com.examplelib.external.CourseRecommenderImpl3;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public class CourseRecommenderImpl3Override extends CourseRecommenderImpl3 {

    @Autowired
    public CourseRecommenderImpl3Override(JPACourseRepository repository){
        super(repository);
        System.out.println("(Override)");
    }

    @Override
    public Page recommendCourses(Pageable pageable) {
        System.out.println("(Override)");
        return super.recommendCourses(pageable);
    }

}
