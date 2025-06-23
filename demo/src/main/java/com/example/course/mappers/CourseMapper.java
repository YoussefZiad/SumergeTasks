package com.example.course.mappers;

import com.example.course.Course;
import com.example.course.dto.CourseDTO;
import com.example.course.dto.CourseData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CourseMapper {

    CourseMapper INSTANCE = Mappers.getMapper(CourseMapper.class);

    CourseData courseToCourseData(Course course);

    Course courseDTOToCourse(CourseDTO courseDTO);

}
