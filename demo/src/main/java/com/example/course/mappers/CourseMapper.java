package com.example.course.mappers;

import com.example.assessment.Assessment;
import com.example.assessment.dto.AssessmentData;
import com.example.author.Author;
import com.example.author.dto.AuthorData;
import com.example.course.Course;
import com.example.course.dto.CourseDTO;
import com.example.course.dto.CourseData;
import com.example.rating.Rating;
import com.example.rating.dto.RatingData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CourseMapper {

    CourseMapper INSTANCE = Mappers.getMapper(CourseMapper.class);

    @Mapping(source = "authors", target = "authors", qualifiedByName = "CourseAuthorMapper")
    @Mapping(source = "ratings", target = "ratings", qualifiedByName = "CourseRatingMapper")
    @Mapping(source = "assessment", target = "assessment", qualifiedByName = "CourseAssessmentMapper")
    CourseData courseToCourseData(Course course);

    Course courseDTOToCourse(CourseDTO courseDTO);

    @Named("CourseAuthorMapper")
    @Mapping(target = "courses", ignore = true)
    AuthorData authorToAuthorData(Author author);

    @Named("CourseRatingMapper")
    @Mapping(target = "course", ignore = true)
    RatingData ratingToRatingData(Rating rating);

    @Named("CourseAssessmentMapper")
    @Mapping(target = "course", ignore = true)
    AssessmentData assessmentToAssessmentData(Assessment assessment);



}
