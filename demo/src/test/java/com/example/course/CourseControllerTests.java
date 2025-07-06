package com.example.course;

import com.example.course.dto.CourseDTO;
import com.example.course.dto.CourseData;
import com.example.exception.InvalidOperationException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;


import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.mockito.BDDMockito.given;

@WebMvcTest(CourseController.class)
public class CourseControllerTests {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private CourseService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void givenCourses_whenGetCourses_thenStatus200()
            throws Exception {

        CourseData courseData1 = new CourseData(1, "Test 1", "Test Desc", 2);
        CourseData courseData2 = new CourseData(2, "Test 2", "Test Desc 2", 4);

        Page<CourseData> courseDataPage = new PageImpl<>(List.of(courseData1, courseData2));

        given(service.viewCourses(any(Pageable.class))).willReturn(courseDataPage);

        mvc.perform(get("/api/courses/")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content()
                        .contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content[0].name", is("Test 1")))
                .andExpect(jsonPath("$.content[1].name", is("Test 2")));
    }

    @Test
    public void givenCourses_whenRecommendCourses_thenStatus200()
            throws Exception {

        CourseData courseData1 = new CourseData(1, "Test 1", "Test Desc", 2);
        CourseData courseData2 = new CourseData(2, "Test 2", "Test Desc 2", 4);

        Page<CourseData> courseDataPage = new PageImpl<>(List.of(courseData1, courseData2));

        given(service.recommendCourses(any(Pageable.class))).willReturn(courseDataPage);

        mvc.perform(get("/api/courses/recommend")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content()
                        .contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content[0].name", is("Test 1")))
                .andExpect(jsonPath("$.content[1].name", is("Test 2")));
    }

    @Test
    public void givenCourse_whenGetCourse_thenStatus200()
            throws Exception {

        CourseData courseData1 = new CourseData(1, "Test 1", "Test Desc", 2);

        given(service.viewCourse(1)).willReturn(Optional.of(courseData1));

        mvc.perform(get("/api/courses/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content()
                        .contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name", is("Test 1")));
    }

    @Test
    public void givenEmpty_whenGetCourse_thenStatus404()
            throws Exception {

        given(service.viewCourse(1)).willReturn(Optional.empty());

        mvc.perform(get("/api/courses/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    public void givenFullDTO_whenAddCourse_thenStatus201()
            throws Exception {

        CourseDTO createDTO = new CourseDTO();

        createDTO.name = "Created Name";
        createDTO.description = "Created Description";
        createDTO.credit = 2;

        CourseData createdCourseData =
                new CourseData(1, createDTO.name, createDTO.description, createDTO.credit);

        given(service.addCourse(any(CourseDTO.class))).willReturn(createdCourseData);

        mvc.perform(post("/api/courses/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isCreated())
                .andExpect(header().string("location", containsString("/api/courses/1")))
                .andExpect(content()
                        .contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name", is("Created Name")));
    }

    @Test
    public void givenMissingData_whenAddCourse_thenStatus400()
            throws Exception {

        given(service.addCourse(any(CourseDTO.class))).willThrow(InvalidOperationException.class);

        mvc.perform(post("/api/courses/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void givenCourseFound_whenUpdateCourse_thenStatus204()
            throws Exception {

        CourseDTO createDTO = new CourseDTO();

        createDTO.name = "Updated Name";
        createDTO.description = "Updated Description";
        createDTO.credit = 2;

        CourseData createdCourseData =
                new CourseData(1, createDTO.name, createDTO.description, createDTO.credit);

        given(service.updateCourse(eq(1), any(CourseDTO.class))).willReturn(createdCourseData);

        mvc.perform(put("/api/courses/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isNoContent());

    }

    @Test
    public void givenCourseNotFound_whenUpdateCourse_thenStatus400()
            throws Exception {

        given(service.updateCourse(eq(1), any(CourseDTO.class)))
                .willThrow(InvalidOperationException.class);

        mvc.perform(put("/api/courses/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isNotFound());

    }

    @Test
    public void givenCourseFound_whenDeleteCourse_thenStatus204()
            throws Exception {

        mvc.perform(delete("/api/courses/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

    }

    @Test
    public void givenCourseNotFound_whenDeleteCourse_thenStatus404()
            throws Exception {

        doThrow(InvalidOperationException.class).when(service).deleteCourse(1);

        mvc.perform(delete("/api/courses/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

    }



}
