package com.example.course;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private JDBCCourseRepository courseRepository;

    @Autowired
    public CourseService(JDBCCourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public int addCourse(String name, String description, int credit){
        return courseRepository.addCourse(name, description, credit);
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
}
