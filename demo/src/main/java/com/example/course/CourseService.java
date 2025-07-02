package com.example.course;

import com.example.exception.InvalidOperationException;
import com.examplelib.external.CourseRecommender;
import com.example.course.dto.CourseDTO;
import com.example.course.dto.CourseData;
import com.example.course.mappers.CourseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CourseService {

    private CourseRecommender courseRecommender;
    private JPACourseRepository courseRepository;

    @Autowired
    public CourseService(@Qualifier("TertiaryRecommender") CourseRecommender courseRecommender, JPACourseRepository courseRepository) {
        this.courseRepository = courseRepository;
        this.courseRecommender = courseRecommender;
    }

    public CourseData addCourse(CourseDTO createCourseDTO) throws InvalidOperationException {
        Course insertedCourse = CourseMapper.INSTANCE.courseDTOToCourse(createCourseDTO);
        if(createCourseDTO.name == null)
            throw new InvalidOperationException("Course Name must be defined on creation!");
        if(createCourseDTO.description == null)
            throw new InvalidOperationException("Course Description must be defined on creation!");
        if(createCourseDTO.credit == null)
            throw new InvalidOperationException("Course Credit must be defined on creation!");
        insertedCourse = courseRepository.save(insertedCourse);
        return CourseMapper.INSTANCE.courseToCourseData(insertedCourse);
    }

    public CourseData updateCourse(int courseId, CourseDTO updateCourseDTO) throws InvalidOperationException {
        Optional<Course> optionalUpdatedCourse = courseRepository.findById(courseId);
        if(optionalUpdatedCourse.isEmpty())
            throw new InvalidOperationException("Course with ID "+courseId+" was not found!");
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

    public void deleteCourse(int id) throws InvalidOperationException {
        Optional<Course> optionalUpdatedCourse = courseRepository.findById(id);
        if(optionalUpdatedCourse.isEmpty())
            throw new InvalidOperationException("Course with ID "+id+" was not found!");
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

    public Page<CourseData> recommendCourses(Pageable pageable){
        Page<Course> recommended = courseRecommender.recommendCourses(pageable);
        return recommended.map(CourseMapper.INSTANCE::courseToCourseData);
    }
}
