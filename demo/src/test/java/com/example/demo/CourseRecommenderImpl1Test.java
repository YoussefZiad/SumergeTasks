package com.example.demo;

import com.example.course.Course;
import com.example.course.JPACourseRepository;
import com.example.course.dto.CourseData;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.List;

import static org.hamcrest.Matchers.any;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

@ExtendWith(MockitoExtension.class)
public class CourseRecommenderImpl1Test {

    @Mock
    private JPACourseRepository repository;

    @InjectMocks
    private CourseRecommenderImpl1 recommender;

    @Test
    public void givenList_whenRecommendCourses_thenReturnCourses(){
        Course course1 = new Course(1, 4, "Test Desc", "Test 1");
        Course course2 = new Course(2, 5, "Test Desc", "Test 2");


        Pageable pageable = PageRequest.of(0, 2, Sort.by("id")
                .ascending());
        Page<Course> page = new PageImpl<Course>(List.of(course1, course2), pageable, 2);

        given(repository.findByCreditGreaterThan(3, pageable)).willReturn(page);

        Page res = recommender.recommendCourses(pageable);

        assertEquals(page, res);

    }

}
