package com.example.author.mappers;

import com.example.author.Author;
import com.example.author.dto.AuthorData;
import com.example.course.Course;
import com.example.course.dto.CourseData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AuthorMapper {

    AuthorMapper INSTANCE = Mappers.getMapper(AuthorMapper.class);

    @Mapping(target = "courses", source = "courses", qualifiedByName = "AuthorCourseMapper")
    AuthorData authorToAuthorData(Author author);

    @Named("AuthorCourseMapper")
    @Mapping(target = "authors", ignore = true)
    @Mapping(target = "ratings", ignore = true)
    @Mapping(target = "assessment", ignore = true)
    CourseData courseToCourseData(Course course);

}
