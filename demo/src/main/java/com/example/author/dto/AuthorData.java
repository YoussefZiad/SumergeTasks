package com.example.author.dto;

import com.example.course.dto.CourseData;

import java.util.Date;
import java.util.Set;

public class AuthorData {

    private int id;
    private String name;
    private String email;
    private Date birthdate;
    private Set<CourseData> courses;

    public AuthorData() {
    }

    public AuthorData(int id, String name, String email, Date birthdate) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.birthdate = birthdate;
    }

    public AuthorData(int id, String name, String email, Date birthdate, Set<CourseData> courses) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.birthdate = birthdate;
        this.courses = courses;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(Date birthdate) {
        this.birthdate = birthdate;
    }

    public Set<CourseData> getCourses() {
        return courses;
    }

}
