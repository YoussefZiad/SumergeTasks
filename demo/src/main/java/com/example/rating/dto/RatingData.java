package com.example.rating.dto;

import com.example.course.dto.CourseData;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class RatingData {

    private int id;
    private int number;
    private CourseData course;

    public RatingData() {
    }

    public RatingData(int id, int number) {
        this.id = id;
        this.number = number;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public CourseData getCourse() {
        return course;
    }

    public void setCourse(CourseData course) {
        this.course = course;
    }

    @Override
    public boolean equals(Object o){
        if(!(o instanceof RatingData r))
            return false;
        return id == r.getId()
                && number == r.getNumber();
    }
}
