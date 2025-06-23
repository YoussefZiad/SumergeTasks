package com.example.course;

import com.example.course.dto.CourseDTO;
import com.example.course.dto.CourseData;
import com.example.course.mappers.CourseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private JPACourseRepository courseRepository;

    @Autowired
    public CourseService(JPACourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public CourseData addCourse(CourseDTO createCourseDTO) throws Exception {
        Course insertedCourse = CourseMapper.INSTANCE.courseDTOToCourse(createCourseDTO);
        if(createCourseDTO.name == null)
            throw new Exception("Course Name must be defined on creation!");
        if(createCourseDTO.description == null)
            throw new Exception("Course Description must be defined on creation!");
        if(createCourseDTO.credit == null)
            throw new Exception("Course Credit must be defined on creation!");
        insertedCourse = courseRepository.save(insertedCourse);
        return CourseMapper.INSTANCE.courseToCourseData(insertedCourse);
    }

    public CourseData updateCourse(int courseId, CourseDTO updateCourseDTO) throws Exception {
        Optional<Course> optionalUpdatedCourse = courseRepository.findById(courseId);
        if(optionalUpdatedCourse.isEmpty())
            throw new Exception("Course with ID "+courseId+" was not found!");
        Course updatedCourse = optionalUpdatedCourse.get();
        if(updateCourseDTO.name != null)
            updatedCourse.setName(updateCourseDTO.name);
        if(updateCourseDTO.description != null)
            updatedCourse.setDescription(updateCourseDTO.description);
        if(updateCourseDTO.credit != null)
            updatedCourse.setCredit(updateCourseDTO.credit);
        updatedCourse = courseRepository.save(updatedCourse);
        return CourseMapper.INSTANCE.courseToCourseData(updatedCourse);
    }

    public void deleteCourse(int id){
        courseRepository.deleteById(id);
    }

    public Optional<CourseData> viewCourse(int id){
        Optional<Course> foundCourse = courseRepository.findById(id);
        return foundCourse.map(CourseMapper.INSTANCE::courseToCourseData);
    }

    public Page<CourseData> viewCourses(Pageable pageable){
        Page<Course> foundCourses = courseRepository.findAll(pageable);
        return foundCourses.map(CourseMapper.INSTANCE::courseToCourseData);
    }
}
