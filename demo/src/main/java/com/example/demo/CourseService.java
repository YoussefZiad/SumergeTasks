package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import com.examplelib.external.Course;
import com.examplelib.external.CourseRecommender;

import java.util.List;

@Service
public class CourseService {

    private CourseRecommender courseRecommender;

    @Autowired
    public CourseService(@Qualifier("TertiaryRecommender") CourseRecommender courseRecommender){
        System.out.println(courseRecommender.getClass());
    }

    public List<Course> recommendCourses(){
        List<Course> recommendedCourses = courseRecommender.recommendCourses();
        recommendedCourses.forEach(System.out::println);
        return recommendedCourses;
    }

}
