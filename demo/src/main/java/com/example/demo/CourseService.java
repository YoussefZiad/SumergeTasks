package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import com.example.external.Course;
import com.example.external.CourseRecommender;

import java.util.List;

@Service
public class CourseService {

    private CourseRecommender courseRecommender;

    @Autowired
    public CourseService(@Qualifier("TertiaryRecommender") com.example.external.CourseRecommender courseRecommender){
        System.out.println(courseRecommender.getClass());
    }

    public List recommendCourses(){
        List recommendedCourses = courseRecommender.recommendCourses();
        recommendedCourses.forEach(System.out::println);
        return recommendedCourses;
    }

}
