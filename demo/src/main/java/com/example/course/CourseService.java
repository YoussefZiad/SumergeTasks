package com.example.course;

import com.examplelib.external.Course;
import com.examplelib.external.CourseRecommender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private JDBCCourseRepository courseRepository;
    private CourseRecommender courseRecommender;

    @Autowired
    public CourseService(@Qualifier("TertiaryRecommender") CourseRecommender courseRecommender, JDBCCourseRepository courseRepository) {
        this.courseRepository = courseRepository;
        this.courseRecommender = courseRecommender;
    }

    public void addCourse(String name, String description, int credit){
        courseRepository.addCourse(name, description, credit);
    }

    public void updateCourse(int id, String name, String description, Integer credit){
        courseRepository.updateCourse(id, name, description, credit);
    }

    public void deleteCourse(int id){
        courseRepository.deleteCourse(id);
    }

    public Course viewCourse(int id){
        return courseRepository.viewCourse(id);
    }

    public List<Course> viewCourses(){
        return courseRepository.viewCourses();
    }

    public List<Course> recommendCourses(String query){
        return courseRecommender.recommendCourses(query);
    }
}
