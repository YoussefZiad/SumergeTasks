package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private CourseRecommender courseRecommender;

    @Autowired
    public CourseService(@Qualifier("PrimaryRecommender") CourseRecommender courseRecommender){
        System.out.println(courseRecommender.getClass());
    }

    @Autowired
    public void setCourseRecommender(@Qualifier("PrimaryRecommender") CourseRecommender courseRecommenderImpl1) {
        this.courseRecommender = courseRecommenderImpl1;
    }

    public List<Course> recommendCourses(){
        List<Course> recommendedCourses = courseRecommender.recommendCourses();
        recommendedCourses.forEach(System.out::println);
        return recommendedCourses;
    }

}
