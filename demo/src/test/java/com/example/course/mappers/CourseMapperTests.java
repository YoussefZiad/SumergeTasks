package com.example.course.mappers;

import com.example.assessment.Assessment;
import com.example.assessment.dto.AssessmentData;
import com.example.author.Author;
import com.example.author.dto.AuthorData;
import com.example.course.Course;
import com.example.course.dto.CourseData;
import com.example.rating.Rating;
import com.example.rating.dto.RatingData;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
public class CourseMapperTests {

    @Test
    public void givenCourse_whenMap_thenReturnCourseData(){
        Course course = new Course(1, 2, "test desc", "test");

        Date a1BD = new Date();
        Date a2BD = new Date();

        Author a1 = new Author(1, "test1", "test@test.test", a1BD);
        Author a2 = new Author(2, "test2", "test2@test.test", a2BD);

        AuthorData a1Data = new AuthorData(a1.getId(), a1.getName(), a1.getEmail(), a1.getBirthdate());
        AuthorData a2Data = new AuthorData(a2.getId(), a2.getName(), a2.getEmail(), a2.getBirthdate());

        Rating r1 = new Rating(1, 1);
        Rating r2 = new Rating(2, 5);

        RatingData r1Data = new RatingData(r1.getId(), r1.getNumber());
        RatingData r2Data = new RatingData(r2.getId(), r2.getNumber());

        Assessment as = new Assessment(1, "...");

        AssessmentData asData = new AssessmentData(as.getId(), as.getContent());

        course.setAuthors(Set.of(a1, a2));
        course.setRatings(Set.of(r1, r2));
        course.setAssessment(as);

        CourseData courseData = CourseMapper.INSTANCE.courseToCourseData(course);

        assertEquals(course.getId(), courseData.getId());
        assertEquals(course.getName(), courseData.getName());
        assertEquals(course.getDescription(), courseData.getDescription());
        assertEquals(course.getCredit(), courseData.getCredit());
        assertEquals(Set.of(a1Data, a2Data), courseData.getAuthors());
        assertEquals(Set.of(r1Data, r2Data), courseData.getRatings());
        assertEquals(asData, courseData.getAssessment());
    }

}
