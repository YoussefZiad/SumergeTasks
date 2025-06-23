package com.example.rating.dto;

import com.example.course.dto.CourseData;

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

    public RatingData(int id, int number, CourseData course) {
        this.id = id;
        this.number = number;
        this.course = course;
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

}
