package com.example.assessment.dto;

import com.example.course.dto.CourseData;

public class AssessmentData {

    private int id;
    private String content;
    private CourseData course;

    public AssessmentData() {
    }

    public AssessmentData(int id, String content) {
        this.id = id;
        this.content = content;
    }

    public AssessmentData(int id, String content, CourseData course) {
        this.id = id;
        this.content = content;
        this.course = course;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public CourseData getCourse() {
        return course;
    }

}
