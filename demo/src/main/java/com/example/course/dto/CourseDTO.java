package com.example.course.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CourseDTO {

    public String name;
    public String description;
    public Integer credit;

}
