package com.example.assessment.dto;

import com.example.course.dto.CourseData;
import com.example.rating.dto.RatingData;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
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

    @Override
    public boolean equals(Object o){
        if(!(o instanceof AssessmentData a))
            return false;
        return id == a.getId()
                && content.equals(a.getContent());
    }

}
