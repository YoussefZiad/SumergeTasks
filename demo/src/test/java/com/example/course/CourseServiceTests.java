package com.example.course;

import com.example.course.dto.CourseDTO;
import com.example.course.dto.CourseData;
import com.example.course.mappers.CourseMapper;
import com.example.exception.InvalidOperationException;
import com.examplelib.external.CourseRecommender;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.spy;

@ExtendWith(MockitoExtension.class)
public class CourseServiceTests {

    @Mock
    private JPACourseRepository repository;

    @Mock
    private CourseRecommender recommender;

    @Spy
    private CourseMapper mapper = spy(CourseMapper.INSTANCE);

    @InjectMocks
    private CourseService service;

    @Test
    public void whenGetCourses_thenReturnsPage(){
        Course course1 = new Course(1, 1, "Test Desc", "Test 1");
        Course course2 = new Course(2, 2, "Test Desc", "Test 2");

        CourseData course1Data = new CourseData(1, "Test 1", "Test Desc", 1);
        CourseData course2Data = new CourseData(2, "Test 2", "Test Desc", 2);

        Pageable pageable = PageRequest.of(0, 2, Sort.by("id")
                .ascending());
        Page<Course> page = new PageImpl<Course>(List.of(course1, course2), pageable, 2);

        given(repository.findAll(pageable)).willReturn(page);

        given(mapper.courseToCourseData(course1)).willReturn(course1Data);
        given(mapper.courseToCourseData(course2)).willReturn(course2Data);

        Page<CourseData> courseDataPage = service.viewCourses(pageable);

        then(repository).should().findAll(pageable);

        assertEquals(courseDataPage.getContent(), (List.of(course1Data, course2Data)), "Should return first 2 courses");

    }

    @Test
    public void whenRecommendCourses_thenReturnsPage(){
        Course course1 = new Course(1, 1, "Test Desc", "Test 1");
        Course course2 = new Course(2, 2, "Test Desc", "Test 2");

        CourseData course1Data = new CourseData(1, "Test 1", "Test Desc", 1);
        CourseData course2Data = new CourseData(2, "Test 2", "Test Desc", 2);

        Pageable pageable = PageRequest.of(0, 2, Sort.by("id")
                .ascending());
        Page<Course> page = new PageImpl<Course>(List.of(course1, course2), pageable, 2);

        given(recommender.recommendCourses(pageable)).willReturn(page);

        given(mapper.courseToCourseData(course1)).willReturn(course1Data);
        given(mapper.courseToCourseData(course2)).willReturn(course2Data);

        Page<CourseData> courseDataPage = service.recommendCourses(pageable);

        then(recommender).should().recommendCourses(pageable);

        assertEquals(courseDataPage.getContent(), (List.of(course1Data, course2Data)), "Should return first 2 courses");

    }

    @Test
    public void givenCourse_whenGetCourse_thenReturnsCourseData(){
        Course course1 = new Course(1, 1, "Test Desc", "Test 1");

        CourseData course1Data = new CourseData(1, "Test 1", "Test Desc", 1);

        given(repository.findById(1)).willReturn(Optional.of(course1));

        given(mapper.courseToCourseData(course1)).willReturn(course1Data);

        Optional<CourseData> courseData = service.viewCourse(1);

        then(repository).should().findById(1);

        assertTrue(courseData.isPresent(), "Course Should be found");

        assertEquals(course1Data, courseData.get(),
                "Returned course data should match input data");

    }

    @Test
    public void givenEmpty_whenGetCourse_thenReturnsEmpty(){

        given(repository.findById(1)).willReturn(Optional.empty());

        Optional<CourseData> courseData = service.viewCourse(1);

        then(repository).should().findById(1);

        assertTrue(courseData.isEmpty(), "Course Should not be found");

    }

    @Test
    public void givenCourseFound_whenDelete_thenCallDelete() throws InvalidOperationException {

        Course foundCourse = new Course(1, 2, "Test Desc", "Test");

        given(repository.findById(1)).willReturn(Optional.of(foundCourse));

        service.deleteCourse(1);

        then(repository).should().findById(1);

        then(repository).should().deleteById(1);
    }

    @Test
    public void givenCourseNotFound_whenDelete_thenCallDelete() throws InvalidOperationException {

        given(repository.findById(1)).willReturn(Optional.empty());

        assertThrows(InvalidOperationException.class, () -> service.deleteCourse(1));
    }

    @Test
    public void givenCourseNotFound_whenUpdate_thenThrowException() throws Exception {
        Optional<Course> foundCourse = Optional.empty();

        CourseDTO updateDto = new CourseDTO();

        updateDto.name = "Updated Name";
        updateDto.description = "Updated Description";
        updateDto.credit = 2;

        given(repository.findById(1)).willReturn(foundCourse);

        assertThrows(InvalidOperationException.class, () -> service.updateCourse(1, updateDto));
    }

    @Test
    public void givenCourseFoundAndFullDTO_whenUpdate_thenPerformUpdate() throws Exception {
        Optional<Course> foundCourse = Optional.of(new Course(1, 1, "Test Desc", "Test"));

        CourseDTO updateDto = new CourseDTO();

        updateDto.name = "Updated Name";
        updateDto.description = "Updated Description";
        updateDto.credit = 2;

        given(repository.findById(1)).willReturn(foundCourse);
        given(repository.save(foundCourse.get())).willReturn(foundCourse.get());

        given(mapper.courseToCourseData(foundCourse.get())).willReturn(
                new CourseData(1, "Test", "Test Desc", 1));

        CourseData savedCourse = service.updateCourse(1, updateDto);

        then(repository).should().findById(1);
        then(repository).should().save(argThat(course ->
                course.getName().equals(updateDto.name) &&
                        course.getDescription().equals(updateDto.description) &&
                        course.getCredit() == updateDto.credit));

        assertEquals(1, savedCourse.getId());
        assertEquals(updateDto.name, savedCourse.getName());
        assertEquals(updateDto.description, savedCourse.getDescription());
        assertEquals(updateDto.credit, savedCourse.getCredit());
    }

    @Test
    public void givenCourseFoundAndNameMissing_whenUpdate_thenPerformUpdate() throws Exception {
        Optional<Course> foundCourse = Optional.of(new Course(1, 1, "Test Desc", "Test"));

        CourseDTO updateDto = new CourseDTO();

        updateDto.description = "Updated Description";
        updateDto.credit = 2;

        given(repository.findById(1)).willReturn(foundCourse);
        given(repository.save(foundCourse.get())).willReturn(foundCourse.get());

        given(mapper.courseToCourseData(foundCourse.get())).willReturn(
                new CourseData(1, "Test", "Test Desc", 1));

        CourseData savedCourse = service.updateCourse(1, updateDto);

        then(repository).should().findById(1);
        then(repository).should().save(argThat(course ->
                        course.getDescription().equals(updateDto.description) &&
                        course.getCredit() == updateDto.credit));

        assertEquals(1, savedCourse.getId());
        assertEquals(foundCourse.get().getName(), savedCourse.getName());
        assertEquals(updateDto.description, savedCourse.getDescription());
        assertEquals(updateDto.credit, savedCourse.getCredit());
    }

    @Test
    public void givenCourseFoundAndDescMissing_whenUpdate_thenPerformUpdate() throws Exception {
        Optional<Course> foundCourse = Optional.of(new Course(1, 1, "Test Desc", "Test"));

        CourseDTO updateDto = new CourseDTO();

        updateDto.name = "Updated Name";
        updateDto.credit = 2;

        given(repository.findById(1)).willReturn(foundCourse);
        given(repository.save(foundCourse.get())).willReturn(foundCourse.get());

        given(mapper.courseToCourseData(foundCourse.get())).willReturn(
                new CourseData(1, "Test", "Test Desc", 1));

        CourseData savedCourse = service.updateCourse(1, updateDto);

        then(repository).should().findById(1);
        then(repository).should().save(argThat(course ->
                course.getName().equals(updateDto.name) &&
                        course.getCredit() == updateDto.credit));

        assertEquals(1, savedCourse.getId());
        assertEquals(updateDto.name, savedCourse.getName());
        assertEquals(foundCourse.get().getDescription(), savedCourse.getDescription());
        assertEquals(updateDto.credit, savedCourse.getCredit());
    }

    @Test
    public void givenCourseFoundAndCreditMissing_whenUpdate_thenPerformUpdate() throws Exception {
        Optional<Course> foundCourse = Optional.of(new Course(1, 1, "Test Desc", "Test"));

        CourseDTO updateDto = new CourseDTO();

        updateDto.description = "Updated Description";
        updateDto.name = "Updated Name";

        given(repository.findById(1)).willReturn(foundCourse);
        given(repository.save(foundCourse.get())).willReturn(foundCourse.get());

        given(mapper.courseToCourseData(foundCourse.get())).willReturn(
                new CourseData(1, "Test", "Test Desc", 1));

        CourseData savedCourse = service.updateCourse(1, updateDto);

        then(repository).should().findById(1);
        then(repository).should().save(argThat(course ->
                course.getDescription().equals(updateDto.description) &&
                        course.getName().equals(updateDto.name)));

        assertEquals(1, savedCourse.getId());
        assertEquals(updateDto.name, savedCourse.getName());
        assertEquals(updateDto.description, savedCourse.getDescription());
        assertEquals(foundCourse.get().getCredit(), savedCourse.getCredit());
    }

    @Test
    public void givenFullDTO_whenCreate_thenPerformCreate() throws Exception {
        CourseDTO createDto = new CourseDTO();

        createDto.name = "Created Name";
        createDto.description = "Created Description";
        createDto.credit = 2;

        Course courseToSave =
                new Course(1, createDto.credit, createDto.description, createDto.name);

        given(mapper.courseDTOToCourse(createDto)).willReturn(courseToSave);

        given(repository.save(any(Course.class))).willReturn(courseToSave);

        CourseData savedCourse = service.addCourse(createDto);

        then(repository).should().save(argThat(course ->
                course.getName().equals(createDto.name) &&
                        course.getDescription().equals(createDto.description) &&
                        course.getCredit() == createDto.credit));

        assertEquals(1, savedCourse.getId());
        assertEquals(createDto.name, savedCourse.getName());
        assertEquals(createDto.description, savedCourse.getDescription());
        assertEquals(createDto.credit, savedCourse.getCredit());
    }

    @Test
    public void givenMissingName_whenCreate_thenThrowException() {
        CourseDTO createDto = new CourseDTO();

        createDto.description = "Created Description";
        createDto.credit = 2;

        assertThrows(InvalidOperationException.class, () -> service.addCourse(createDto));
    }

    @Test
    public void givenMissingDesc_whenCreate_thenThrowException() {
        CourseDTO createDto = new CourseDTO();

        createDto.name = "Created Name";
        createDto.credit = 2;

        assertThrows(InvalidOperationException.class, () -> service.addCourse(createDto));
    }

    @Test
    public void givenMissingCredit_whenCreate_thenThrowException() {
        CourseDTO createDto = new CourseDTO();

        createDto.name = "Created Name";
        createDto.description = "Created Description";

        assertThrows(InvalidOperationException.class, () -> service.addCourse(createDto));
    }

}
